"""Create an image-only, editable PowerPoint cutout library from existing assets."""
from pathlib import Path
import zipfile,re,xml.etree.ElementTree as ET,posixpath
from kickoff_design import ppt_items,brush,blob,wave,paint_edge
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'output/semester-kickoff'
P='http://schemas.openxmlformats.org/presentationml/2006/main'
A='http://schemas.openxmlformats.org/drawingml/2006/main'
R='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
assets={}
def art(path):
    p=ROOT/'public/images'/path
    assets[p.name]=p.read_bytes()
    return p.name
motor='motor-cargo-cutout-clean.png';assets[motor]=(OUT/'assets'/motor).read_bytes()
stickers=art('editorial/neuroscience-margin-notes.png')
tongues=art('articles/thinking-in-tongues-cover-v3.png')
clock=art('articles/the-accelerating-clock-cover.png')
genes=art('articles/written-in-our-genes-cover-v2.png')
synapse=art('articles/inline/intelligence-synapse.png')
dna=art('articles/inline/genes-chromosome-dna.png')
intelligence=art('articles/truth-behind-intelligence-cover.png')
emotion=art('articles/the-changing-weather-within-cover.png')
newton=art('articles/inline/intelligence-newton.png')
framework=art('articles/inline/intelligence-framework.png')
tree_art=art('articles/inline/shrinking-brain-aging-tree.png')
brain=art('articles/the-shrinking-brain-cover-v2.png')
wash1=art('issues/backgrounds/truth-behind-intelligence-watercolor.png')
wash2=art('issues/backgrounds/thinking-in-tongues-watercolor.png')
def img(name,x,y,w,h,mask=None,crop=None):return dict(kind='image',asset=name,x=x,y=y,w=w,h=h,mask=mask,crop=crop)
scenes=[];notes=[]
def add(scene,note):scenes.append(scene);notes.append(note)
add([img(motor,4.5,.5,4.33,6.5)],'Isolated motor protein and cargo. Transparent PNG adapted from the existing watercolor illustration. Built-in imagegen extraction; original artist credited in the main deck. Select the image to copy, move or resize.')
# Native PowerPoint cropping separates the existing transparent sticker sheet.
# Boxes are fractions of the original square sheet; no new raster edits are made.
boxes=[(0,.0,.385,.407),(.585,.02,.975,.392),(.07,.59,.30,.93),(.315,.025,.56,.19),(.665,.39,.95,.49),(.34,.775,.63,.92),(.68,.755,.95,.90),(.052,.372,.214,.60),(.775,.49,.93,.725)]
sheet=[]
for i,(l,t,r,b) in enumerate(boxes):
    row,col=divmod(i,3);slotx=.55+col*4.25;sloty=.3+row*2.35
    ratio=(r-l)/(b-t);w=min(3.65,1.95*ratio);h=w/ratio
    sheet.append(img(stickers,slotx+(3.65-w)/2,sloty+(1.95-h)/2,w,h,crop=(l,t,1-r,1-b)))
add(sheet,'Nine independently selectable paper cutouts from public/images/editorial/neuroscience-margin-notes.png: neuron, brain, synapse, tape, colored marks and arrows. Original transparency preserved; cropping is native to PowerPoint.')
add([img(tongues,.7,.55,5.4,6.4,brush()),img(clock,7.1,.55,5.4,6.4,brush('left'))],'Brush-edge picture cutouts: Thinking in Tongues and The Accelerating Clock. Artwork: Elgin Tawiah.')
# Each angled slice is a separate picture with a shared image coordinate frame.
strips=[]
for left,right in [(0,.29),(.325,.625),(.66,1)]:
    mask=[(min(1,left+.13),0),(min(1,right+.13),0),(right,1),(left,1)]
    strips.append(img(genes,2,.7,9.3,6.1,mask))
add(strips,'Three independent diagonal picture strips from Written in our genes? Artwork: Elgin Tawiah. Each strip can be selected and moved separately.')
add([img(synapse,.65,.6,5.6,6.3,wave()),img(dna,7.0,.6,5.6,6.3,wave())],'Wave-shaped art panels: synaptic illustration and chromosome/DNA illustration from the website archive. Native editable picture geometry.')
add([img(name,.3+i*4.35,1.65,4.0,4.0,blob(i+2)) for i,name in enumerate([intelligence,emotion,newton])],'Paint-shaped art cutouts: The Truth Behind Intelligence, Feeling Our Age, and the Newton illustration. Artwork from the Penn Grey Matters archive.')
add([img(name,.3+i*4.35,1.5,4.0,4.4,blob(i+9)) for i,name in enumerate([framework,tree_art,brain])],'Paint-shaped art cutouts: intelligence framework, brain/tree illustration, and The Shrinking Brain. Artwork from the Penn Grey Matters archive.')
add([img(wash1,.6,1.2,12.1,1.7,paint_edge()),img(wash2,.6,4.2,12.1,1.7,paint_edge())],'Watercolor paint borders from the issue background archive. Each border is an independent picture with a native clipped edge.')
add([img(name,.8+i*3.1,1.0+j*2.2,1.6+j*.32,1.6,blob(i*7+j+20)) for j in range(2) for i,name in enumerate([wash1,wash2,emotion,synapse])],'Eight individually selectable paint droplets, using archive artwork and watercolor textures.')

def root(kind,body):return f'<p:{kind} xmlns:p="{P}" xmlns:a="{A}" xmlns:r="{R}">{body}</p:{kind}>'
def rels(items):return '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+''.join(f'<Relationship Id="{id}" Type="{R}/{kind}" Target="{target}"/>' for id,kind,target in items)+'</Relationships>'
def tree(body):return '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr/>'+body+'</p:spTree>'
source=OUT/'grey-matters-kickoff.pptx';target=OUT/'grey-matters-cutouts.pptx'
with zipfile.ZipFile(source) as template,zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
    for name in template.namelist():
        if name.startswith(('ppt/slideMasters/','ppt/slideLayouts/','ppt/theme/')):z.writestr(name,template.read(name))
    z.writestr('_rels/.rels',rels([('rId1','officeDocument','ppt/presentation.xml')]))
    types={'presentation':'presentation.main','slideMasters/slideMaster1':'slideMaster','slideLayouts/slideLayout1':'slideLayout'}
    for i in range(1,len(scenes)+1):types[f'slides/slide{i}']='slide'
    z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="xml" ContentType="application/xml"/>'+''.join(f'<Override PartName="/ppt/{k}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.{v}+xml"/>' for k,v in types.items())+'<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/></Types>')
    z.writestr('ppt/presentation.xml',root('presentation','<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster"/></p:sldMasterIdLst><p:sldIdLst>'+''.join(f'<p:sldId id="{256+i}" r:id="rId{i}"/>' for i in range(1,len(scenes)+1))+'</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/>'))
    z.writestr('ppt/_rels/presentation.xml.rels',rels([('rIdMaster','slideMaster','slideMasters/slideMaster1.xml')]+[(f'rId{i}','slide',f'slides/slide{i}.xml') for i in range(1,len(scenes)+1)]))
    for name,data in assets.items():z.writestr('ppt/media/'+name,data)
    for i,scene in enumerate(scenes,1):
        shapes,links=ppt_items(scene,assets,None)
        # Replace the automatic aspect crop with native sticker-sheet crop bounds.
        pics=shapes.split('<p:pic>')[1:]
        for j,item in enumerate(scene):
            if item['crop']:
                l,t,r,b=[round(v*100000) for v in item['crop']]
                pics[j]=re.sub(r'<a:srcRect[^>]*/>',f'<a:srcRect l="{l}" t="{t}" r="{r}" b="{b}"/>',pics[j])
        shapes=''.join('<p:pic>'+pic for pic in pics)
        z.writestr(f'ppt/slides/slide{i}.xml',root('sld','<p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>'+tree(shapes)+'</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>'))
        z.writestr(f'ppt/slides/_rels/slide{i}.xml.rels',rels([('rIdLayout','slideLayout','../slideLayouts/slideLayout1.xml')]+links))
(OUT/'cutouts-guide.md').write_text('# Cutouts-only PowerPoint\n\nOpen `grey-matters-cutouts.pptx`. Every visible item is a separate selectable picture. Copy/paste pieces into another presentation. Slide backgrounds are white; cutouts retain their transparent pixels or native shaped boundaries. No presentation text, portraits or flattened slide screenshots are included.\n\n'+''.join(f'{i}. {note}\n\n' for i,note in enumerate(notes,1)))
with zipfile.ZipFile(target) as z:
    names=set(z.namelist())
    for name in names:
        if name.endswith(('.xml','.rels')):ET.fromstring(z.read(name))
        if name.endswith('.rels'):
            base=posixpath.dirname(posixpath.dirname(name)) if name!='_rels/.rels' else ''
            for rel in ET.fromstring(z.read(name)):assert posixpath.normpath(posixpath.join(base,rel.attrib['Target'])) in names
    for i in range(1,len(scenes)+1):
        content=z.read(f'ppt/slides/slide{i}.xml').decode()
        assert '<a:t>' not in content
        assert content.count('<p:pic>')==len(scenes[i-1])
print(f'Created {target}: {len(scenes)} slides, {sum(map(len,scenes))} independently selectable cutouts. XML, assets and image-only slides validated.')
