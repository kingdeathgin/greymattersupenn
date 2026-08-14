#!/usr/bin/env swift

import AppKit
import Foundation
import PDFKit

guard CommandLine.arguments.count == 5 else {
    fputs("Usage: compress_pdf.swift input.pdf output.pdf dpi jpeg-quality\n", stderr)
    exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
let dpi = CGFloat(Double(CommandLine.arguments[3]) ?? 110)
let quality = CGFloat(Double(CommandLine.arguments[4]) ?? 0.65)

guard let source = PDFDocument(url: inputURL) else {
    fputs("Unable to open input PDF\n", stderr)
    exit(1)
}

let result = PDFDocument()
let scale = dpi / 72.0

for index in 0..<source.pageCount {
    autoreleasepool {
        guard let page = source.page(at: index) else { return }
        let bounds = page.bounds(for: .mediaBox)
        let pixelsWide = max(1, Int((bounds.width * scale).rounded()))
        let pixelsHigh = max(1, Int((bounds.height * scale).rounded()))

        guard let bitmap = NSBitmapImageRep(
            bitmapDataPlanes: nil,
            pixelsWide: pixelsWide,
            pixelsHigh: pixelsHigh,
            bitsPerSample: 8,
            samplesPerPixel: 4,
            hasAlpha: true,
            isPlanar: false,
            colorSpaceName: .deviceRGB,
            bytesPerRow: 0,
            bitsPerPixel: 0
        ), let context = NSGraphicsContext(bitmapImageRep: bitmap) else { return }

        NSGraphicsContext.saveGraphicsState()
        NSGraphicsContext.current = context
        NSColor.white.setFill()
        NSRect(x: 0, y: 0, width: pixelsWide, height: pixelsHigh).fill()
        context.cgContext.scaleBy(x: scale, y: scale)
        page.draw(with: .mediaBox, to: context.cgContext)
        context.flushGraphics()
        NSGraphicsContext.restoreGraphicsState()

        guard let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: quality]),
              let image = NSImage(data: jpeg),
              let compressedPage = PDFPage(image: image) else { return }
        result.insert(compressedPage, at: result.pageCount)
    }
}

guard result.write(to: outputURL) else {
    fputs("Unable to write output PDF\n", stderr)
    exit(1)
}

print("Compressed \(source.pageCount) pages")
