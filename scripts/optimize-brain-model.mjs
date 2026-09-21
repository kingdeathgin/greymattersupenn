// Repack the supplied Nomad Sculpt GLB for Cloudflare's 25 MiB asset limit.
// Usage: node scripts/optimize-brain-model.mjs INPUT.glb OUTPUT.glb
import fs from "node:fs";
import { MeshoptSimplifier } from "meshoptimizer/simplifier";

const [input, output] = process.argv.slice(2);
if (!input || !output) throw new Error("Provide input and output .glb paths");
await MeshoptSimplifier.ready;

const source = fs.readFileSync(input);
if (source.toString("utf8", 0, 4) !== "glTF") throw new Error("Input is not a GLB");
const jsonLength = source.readUInt32LE(12);
const gltf = JSON.parse(source.toString("utf8", 20, 20 + jsonLength));
const binaryHeader = 20 + jsonLength;
const binaryStart = binaryHeader + 8;
const originalAccessors = gltf.accessors;
const originalViews = gltf.bufferViews;
const parts = [];
const newViews = [];
const newAccessors = [];
let offset = 0;

function readAccessor(index, components, bytes) {
  const accessor = originalAccessors[index];
  const view = originalViews[accessor.bufferView];
  const stride = view.byteStride ?? components * bytes;
  const start = binaryStart + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const values = bytes === 4 ? new Float32Array(accessor.count * components) : new Uint16Array(accessor.count * components);
  for (let i = 0; i < accessor.count; i++) {
    for (let c = 0; c < components; c++) {
      const at = start + i * stride + c * bytes;
      values[i * components + c] = bytes === 4
        ? source.readFloatLE(at)
        : source.readUInt16LE(at);
    }
  }
  return values;
}

function readIndices(index) {
  const accessor = originalAccessors[index];
  const view = originalViews[accessor.bufferView];
  const start = binaryStart + (view.byteOffset ?? 0) + (accessor.byteOffset ?? 0);
  const indices = new Uint32Array(accessor.count);
  for (let i = 0; i < accessor.count; i++) indices[i] = source.readUInt32LE(start + 4 * i);
  return indices;
}

function addAccessor(values, componentType, type, extra = {}) {
  const data = Buffer.from(values.buffer, values.byteOffset, values.byteLength);
  const padding = (4 - (offset % 4)) % 4;
  if (padding) { parts.push(Buffer.alloc(padding)); offset += padding; }
  const viewIndex = newViews.length;
  newViews.push({ buffer: 0, byteOffset: offset, byteLength: data.length });
  parts.push(data);
  offset += data.length;
  const accessorIndex = newAccessors.length;
  newAccessors.push({ bufferView: viewIndex, componentType, count: values.length / (type === "VEC4" ? 4 : type === "VEC3" ? 3 : 1), type, ...extra });
  return accessorIndex;
}

for (const mesh of gltf.meshes) {
  const revised = [];
  for (const primitive of mesh.primitives) {
    const positions = readAccessor(primitive.attributes.POSITION, 3, 4);
    const colors = readAccessor(primitive.attributes.COLOR_0, 4, 2);
    const indices = readIndices(primitive.indices);
    const colorFloats = new Float32Array(colors.length);
    for (let i = 0; i < colors.length; i++) colorFloats[i] = colors[i] / 65535;
    const ratio = mesh.name === "Quad Sphere" ? 0.1 : 0.3;
    const [chosen] = MeshoptSimplifier.simplifyWithAttributes(
      indices, positions, 3, colorFloats, 4, [1, 1, 1, 0], null,
      Math.floor(indices.length * ratio / 3) * 3, 0.025, ["LockBorder"]
    );
    const remap = new Map();
    const compactPositions = [];
    const compactColors = [];
    const compactIndices = new Uint32Array(chosen.length);
    for (let i = 0; i < chosen.length; i++) {
      const oldIndex = chosen[i];
      let newIndex = remap.get(oldIndex);
      if (newIndex === undefined) {
        newIndex = remap.size;
        remap.set(oldIndex, newIndex);
        compactPositions.push(...positions.subarray(oldIndex * 3, oldIndex * 3 + 3));
        compactColors.push(...colors.subarray(oldIndex * 4, oldIndex * 4 + 4));
      }
      compactIndices[i] = newIndex;
    }
    const packedPositions = new Float32Array(compactPositions);
    const packedColors = new Uint16Array(compactColors);
    const indexArray = remap.size < 65536 ? new Uint16Array(compactIndices) : compactIndices;
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < packedPositions.length; i += 3) {
      for (let axis = 0; axis < 3; axis++) {
        min[axis] = Math.min(min[axis], packedPositions[i + axis]);
        max[axis] = Math.max(max[axis], packedPositions[i + axis]);
      }
    }
    const positionAccessor = addAccessor(packedPositions, 5126, "VEC3", { min, max });
    const colorAccessor = addAccessor(packedColors, 5123, "VEC4", { normalized: true });
    const indexAccessor = addAccessor(indexArray, indexArray.BYTES_PER_ELEMENT === 2 ? 5123 : 5125, "SCALAR");
    revised.push({ ...primitive, attributes: { POSITION: positionAccessor, COLOR_0: colorAccessor }, indices: indexAccessor });
    console.log(`${mesh.name}: ${indices.length} → ${chosen.length} indices, ${positions.length / 3} → ${remap.size} vertices`);
  }
  mesh.primitives = revised;
}

gltf.accessors = newAccessors;
gltf.bufferViews = newViews;
gltf.buffers = [{ byteLength: offset }];
const json = Buffer.from(JSON.stringify(gltf));
const jsonPadding = (4 - json.length % 4) % 4;
const binPadding = (4 - offset % 4) % 4;
const total = 12 + 8 + json.length + jsonPadding + 8 + offset + binPadding;
const outputBuffer = Buffer.alloc(total);
outputBuffer.write("glTF", 0);
outputBuffer.writeUInt32LE(2, 4);
outputBuffer.writeUInt32LE(total, 8);
outputBuffer.writeUInt32LE(json.length + jsonPadding, 12);
outputBuffer.write("JSON", 16);
json.copy(outputBuffer, 20);
outputBuffer.fill(0x20, 20 + json.length, 20 + json.length + jsonPadding);
const chunkStart = 20 + json.length + jsonPadding;
outputBuffer.writeUInt32LE(offset + binPadding, chunkStart);
outputBuffer.write("BIN\0", chunkStart + 4);
Buffer.concat(parts).copy(outputBuffer, chunkStart + 8);
fs.writeFileSync(output, outputBuffer);
console.log(`${(source.length / 1048576).toFixed(1)} → ${(total / 1048576).toFixed(1)} MiB`);
