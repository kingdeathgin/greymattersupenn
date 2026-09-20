"""Shared editable slide layouts for PowerPoint and the browser presentation."""
from html import escape
from xml.sax.saxutils import escape as xml
import base64, math, random
W,H=13.333333,7.5
PAPER='FAF8F2'; INK='242838'; MUTED='606473'; TEAL='236B68'; CORAL='BD563F'; LILAC='E9E1F0'

def brush(side='right'):
    rng=random.Random(19)
    peaks=[(rng.random(),rng.uniform(.035,.11),rng.uniform(.004,.012)) for _ in range(24)]
    edge=[]
    for i in range(301):
        y=i/300
        x=.865+.015*math.sin(y*53)+sum(amp*math.exp(-((y-center)/width)**2) for center,amp,width in peaks)
        edge.append((min(.995,x),y))
    points=[(0,0)]+edge+[(0,1)]
    if side=='left': points=[(1-x,y) for x,y in points]
    if side=='corner':
        points=[(1,0),(1,1),(0,1)]+[(max(0,min(1,.88*(1-y)+.025*math.sin(y*61))),y) for y in [i/180 for i in range(180,-1,-1)]]
    return points

def blob(seed=1):
    phase=seed*.73
    return [(.5+(.41+.025*math.sin(5*t+phase)+.022*math.sin(9*t-phase)+.016*math.sin(17*t))*math.cos(t),
             .5+(.41+.031*math.sin(6*t+phase)+.017*math.sin(13*t))*math.sin(t)) for t in [i*2*math.pi/240 for i in range(240)]]

def wave():
    return [(1,0),(1,1)]+[(.22+.12*math.sin(y*math.pi*2+.45)+.075*math.sin(y*math.pi*4-.6),y) for y in [i/240 for i in range(240,-1,-1)]]

def paint_edge():
    return [(0,0),(1,0)]+[(x,.74+.065*math.sin(x*53)+.075*math.sin(x*117)+.04*math.sin(x*211)) for x in [i/360 for i in range(360,-1,-1)]]

def layout(s,index,total):
    items=[]
    def text(x,y,w,h,value,size=20,color=INK,font='Arial',bold=False):
        items.append(dict(kind='text',x=x,y=y,w=w,h=h,value=value,size=size,color=color,font=font,bold=bold))
    def shape(x,y,w,h,color,geom='rect',mask=None):
        items.append(dict(kind='shape',x=x,y=y,w=w,h=h,color=color,geom=geom,mask=mask))
    def image(x,y,w,h,asset,mask=None):
        items.append(dict(kind='image',x=x,y=y,w=w,h=h,asset=asset,mask=mask))
    def header(title=None,width=11):
        text(.7,.4,11,.25,s['tag'],10,TEAL,bold=True)
        text(.7,1.0,width,1.6,title or s['title'],39,font='Georgia')
    def footer():
        text(.7,7.08,10,.2,'GREY MATTERS AT PENN  /  FALL 2026',8,MUTED)
        text(12.0,7.08,.7,.2,f'{index+1:02} / {total:02}',8,MUTED)
    def prompt(x=.7,y=6.35,w=11.7):
        shape(x,y-.13,.48,.035,CORAL)
        text(x,y,w,.5,s['prompt'],15,TEAL)
    art=s['art']; mode=s['layout']
    if mode=='cover':
        image(0,0,6.65,7.5,art,brush())
        text(7.1,.65,5.5,.3,s['tag'],11,TEAL,bold=True)
        text(7.1,2.0,5.6,1.9,s['title'],43,font='Georgia')
        text(7.1,4.05,5.4,.6,s['subtitle'],24,TEAL)
        text(7.1,4.95,5.2,.9,'Science. Art. Stories.\nA place for every curious mind.',19,MUTED)
        prompt(7.1,6.35,5.4)
        text(.4,7.08,5.2,.2,'ART · ELGIN TAWIAH',8,'FFFFFF')
        text(12.1,7.08,.6,.2,f'{index+1:02}',8,MUTED)
        return items
    if mode=='team':
        image(0,0,W,1.05,art,paint_edge())
        image(0,6.98,W,.52,art)
        image(4.42,2.53,1.18,1.24,art,blob(index))
        image(10.65,4.02,1.15,1.2,art,blob(index+2))
        text(.7,1.13,11.9,.7,s['title'].replace('\n',' '),36,font='Georgia')
        text(.7,1.9,11,.5,'The people behind Penn Grey Matters',21,MUTED)
        for j,p in enumerate(s['people']):
            x=1.4+j*6.1
            image(x,2.6,2.6,2.6,p['image'], 'ellipse')
            text(x,5.4,5.6,.5,p['name'],28,font='Georgia')
            text(x,6.02,5.5,.35,p['role'],18,TEAL)
        text(.7,6.72,11,.2,'Leadership · greymattersjournalpenn.com/team',10,MUTED)
        return items
    if mode=='activity':
        image(7.05,0,6.3,7.5,art,brush('left'))
        header(width=6.2)
        text(.7,2.85,5.7,.7,s['subtitle'],20,MUTED)
        for j,(label,line) in enumerate([('00:30','Look closely. What catches your eye?'),('01:00','Create a six-word headline with a partner.'),('01:30','Hear three pairs. Applaud the boldest idea.')]):
            text(.7,3.7+j*.7,1.2,.4,label,23,CORAL,font='Georgia')
            text(2,3.73+j*.7,4.5,.6,line,17)
        prompt(w=5.8); footer(); return items
    if mode=='issue':
        shape(7.85,0,5.49,H,'E6E2D9')
        shape(8.4,.48,4.34,6.23,'CBC7C0')
        image(8.15,.3,4.4,5.74,art)
        text(8.3,6.22,4.4,.28,'ISSUE 01  /  FALL 2025',12,TEAL,bold=True)
        text(8.3,6.64,4.1,.35,'A real issue. A shared creative effort.',14,MUTED)
        header(width=7.1)
        text(.7,2.85,6.6,.82,s['subtitle'],21,TEAL)
        for j,p in enumerate(s['points']): text(.7,3.93+j*.67,6.6,.59,p,19)
        prompt(w=6.7)
        text(.7,7.08,7,.2,'GREY MATTERS AT PENN  /  FALL 2026',8,MUTED)
        return items
    if mode=='scrapbook':
        # Existing transparent paper-cut illustrations become part of the page.
        image(7.1,.7,6.1,6.1,art)
        shape(.45,.85,6.75,5.28,PAPER)
        header(width=6.9)
        text(.7,2.84,6.2,.8,s['subtitle'],21,TEAL)
        for j,p in enumerate(s['points']): text(.7,3.87+j*.69,6.25,.62,p,18)
        prompt(w=6.7); footer(); return items
    if mode=='wave':
        for shift,color in [(0,'F4E9B0'),(.22,'E8BC78'),(.44,'D78070'),(.66,'A56DA4')]:
            shape(7.45+shift,0,5.89,H,color,mask=wave())
        image(8.35,0,4.99,H,art,wave())
        header(width=7.7)
        text(.7,2.86,7.1,.78,s['subtitle'],22,TEAL)
        for j,p in enumerate(s['points']): text(.7,3.9+j*.7,7.15,.6,p,19)
        prompt(w=7.1)
        text(.7,7.08,8,.2,'GREY MATTERS AT PENN  /  FALL 2026',8,MUTED)
        return items
    if mode=='droplets':
        # Large organic pools retain recognizable subjects, with smaller paint drops.
        if index==10:
            image(7.55,2.0,5.78,3.25,art,blob(index))
            text(8.0,5.7,4.7,.6,'A familiar question.\nAn unexpected way to show it.',16,TEAL)
        else:
            image(8.03,1.0,5.23,5.75,art,blob(index))
        shape(7.82,1.0,.22,.31,'E8BC78',mask=blob(index+3))
        shape(12.6,.75,.31,.4,'A56DA4',mask=blob(index+6))
        shape(7.92,6.03,.21,.16,'236B68',mask=blob(index+9))
        shape(12.67,6.3,.13,.17,'BD563F',mask=blob(index+12))
        header(width=7.4)
        text(.7,2.84,6.7,.82,s['subtitle'],21,TEAL)
        for j,p in enumerate(s['points']): text(.7,3.93+j*.69,6.7,.62,p,18)
        prompt(w=6.8); footer(); return items
    if mode=='postcard':
        # An illustration breaks out of a wide lavender editorial band.
        shape(0,3.2,W,2.75,'E6E1ED')
        image(7.55,1.52,5.5,4.8,art,blob(81))
        text(.7,.4,8,.25,s['tag'],10,TEAL,bold=True)
        text(.7,1.03,7,1.55,s['title'],38,font='Georgia')
        text(.7,2.75,6.8,.6,s['subtitle'],20,TEAL)
        for j,p in enumerate(s['points']): text(.7,3.7+j*.68,6.65,.6,p,18)
        prompt(w=7); footer(); return items
    if mode=='paint_poll':
        image(0,0,W,H,art)
        edge=[(0,.018),(.3,0),(.7,.012),(1,0),(.994,.4),(1,1),(.6,.99),(.2,1),(0,.985),(.008,.6)]
        shape(.8,.62,11.72,6.14,PAPER,mask=edge)
        text(1.2,1.0,10.6,.28,s['tag'],11,TEAL,bold=True)
        text(1.2,1.53,10.6,1.32,s['title'].replace('\n',' '),34,font='Georgia')
        text(1.2,2.77,10.4,.75,s['subtitle'],23,TEAL)
        for j,p in enumerate(s['points']): text(1.2,3.77+j*.63,10.2,.54,p,21)
        text(1.2,6.02,10.3,.43,s['prompt'],16,TEAL)
        text(.8,7.08,10,.2,'GREY MATTERS AT PENN  /  FALL 2026',8,'FFFFFF')
        return items
    if mode=='gallery_end':
        image(0,0,W,H,art)
        # The painting is the canvas; the closing copy sits on a broad flowing shape.
        shape(4.4,0,8.94,H,PAPER,mask=wave())
        text(7.45,.6,5.15,.3,'THANK YOU / KEEP CREATING',11,TEAL,bold=True)
        text(7.45,1.55,5.25,1.8,s['title'],39,font='Georgia')
        text(7.45,3.62,5.12,.65,s['subtitle'],22,TEAL)
        text(7.45,4.78,5.15,.45,'Artwork from the Penn Grey Matters archive',16)
        text(7.45,5.45,5.1,.65,'Full artwork and story credits\nin the presenter notes.',15,MUTED)
        prompt(7.45,6.45,5.1)
        return items
    if mode=='cutout':
        # A complete, identified subject crosses the panel boundary.
        shape(9.45,.85,3.9,5.9,'E7EAE0')
        text(.7,.4,8,.25,s['tag'],10,TEAL,bold=True)
        text(.7,1.05,8.3,1.45,'One question.\nMany ways in.',40,font='Georgia')
        text(.7,2.75,7.2,.65,s['subtitle'],21,TEAL)
        entries=[('AUTHOR + EDITOR','Find the story. Make it clear.'),('ARTIST','Give the idea a visual language.'),('PODCAST + SOCIAL','Carry the story into new conversations.')]
        for j,(role,desc) in enumerate(entries):
            text(.7,3.7+j*.72,7,.25,role,11,CORAL,bold=True)
            text(.7,4.0+j*.72,7.2,.45,desc,20)
        image(8.22,.6,4.12,6.18,'motor-cargo-cutout-clean.png')
        text(8.35,6.85,4.3,.22,'Motor protein + cargo · stylized illustration',9,MUTED)
        prompt(w=7.4); footer(); return items
    if mode=='strips':
        # One continuous painting, sliced by editable diagonal paper strips.
        side=[(.28,0),(1,0),(1,1),(0,1)]
        image(9,0,4.34,7.5,art,side)
        shape(9.62,0,1.7,7.5,PAPER,mask=[(.88,0),(1,0),(.12,1),(0,1)])
        shape(11.05,0,1.7,7.5,PAPER,mask=[(.88,0),(1,0),(.12,1),(0,1)])
        header(width=8)
        text(.7,2.86,7.75,.8,s['subtitle'],22,TEAL)
        for j,p in enumerate(s['points']):
            text(.7,3.9+j*.68,.4,.35,str(j+1),19,CORAL,font='Georgia')
            text(1.22,3.9+j*.68,7.0,.6,p,19)
        prompt(w=7.6)
        text(.7,7.08,8,.2,'GREY MATTERS AT PENN  /  FALL 2026',8,MUTED)
        return items
    if mode=='background':
        image(0,0,W,H,art)
        # Slightly irregular white paper: a readable foreground on vivid artwork.
        edge=[(0,.015),(.24,0),(.5,.013),(.76,.003),(1,.015),(.992,.3),(1,.65),(.993,1),(.71,.99),(.43,1),(.21,.989),(0,1),(.008,.62),(0,.3)]
        shape(.62,.58,7.45,6.22,PAPER,mask=edge)
        text(1.03,.95,6.5,.3,s['tag'],10,TEAL,bold=True)
        text(1.03,1.47,6.5,1.55,s['title'],36,font='Georgia')
        text(1.03,3.15,6.3,.74,s['subtitle'],19,TEAL)
        for j,p in enumerate(s['points']): text(1.03,4.08+j*.58,6.4,.52,p,17)
        text(1.03,6.0,6.3,.52,s['prompt'],14,TEAL)
        text(.7,7.12,8,.2,'ART · ELGIN TAWIAH  /  GREY MATTERS AT PENN',8,'FFFFFF')
        text(12.05,7.12,.7,.2,f'{index+1:02} / {total:02}',8,'FFFFFF')
        return items
    if mode=='closing_art':
        image(0,0,W,H,art)
        shape(6.1,.0,7.25,7.5,PAPER,mask=brush('left'))
        text(7.5,.55,5.2,.3,s['tag'],10,TEAL,bold=True)
        text(7.5,1.4,5.1,1.7,s['title'],36,font='Georgia')
        text(7.5,3.27,5,.65,s['subtitle'],20,TEAL)
        for j,p in enumerate(s['points']): text(7.5,4.2+j*.55,5,.5,p,17)
        prompt(7.5,6.35,5)
        text(.4,7.08,5,.2,'ART · ELGIN TAWIAH',8,'FFFFFF')
        return items
    if mode=='statement':
        header()
        shape(.7,2.8,11.8,.025,'D3CEC4')
        text(.7,3.13,10.7,.55,s['subtitle'],23,TEAL)
        for j,p in enumerate(s['points']):
            x=.7+j*4.02
            text(x,4.1,3.5,.6,f'0{j+1}',32,CORAL,font='Georgia')
            text(x,4.85,3.5,1.0,p,21)
        prompt(); footer(); return items
    if mode=='workflow':
        header('One question. Many ways in.')
        text(.7,2.08,11.5,.6,s['subtitle'],24,MUTED)
        entries=[('01','AUTHOR','Find the story.'),('02','EDITOR','Make it clear.'),('03','ARTIST','Make it visual.'),('04','PODCAST','Make it a conversation.'),('05','SOCIAL','Help it travel.')]
        for j,(n,name,desc) in enumerate(entries):
            x=.7+j*2.43
            shape(x,3.2,2.2,2.5,LILAC if j%2==0 else 'EBEDE5')
            text(x+.18,3.4,1.8,.6,n,34,CORAL,font='Georgia')
            text(x+.18,4.2,1.85,.3,name,13,TEAL,bold=True)
            text(x+.18,4.75,1.85,.8,desc,19)
        prompt(); footer(); return items
    if mode=='art':
        image(0,0,6.5,7.5,art,brush())
        text(6.95,.5,5.7,.3,s['tag'],11,TEAL,bold=True)
        text(6.95,1.05,5.6,1.75,s['title'],37,font='Georgia')
        text(6.95,2.95,5.5,.8,s['subtitle'],20,TEAL)
        for j,p in enumerate(s['points']): text(6.95,4.0+j*.65,5.55,.6,p,17)
        prompt(6.95,6.35,5.5)
        text(.4,7.08,5.5,.2,'ART · ELGIN TAWIAH',8,'FFFFFF')
        return items
    if mode=='role':
        header(width=9.4)
        text(.7,2.9,9,.65,s['subtitle'],23,TEAL)
        for j,p in enumerate(s['points']):
            text(.7,3.85+j*.62,.55,.35,f'{j+1}.',20,CORAL,font='Georgia')
            text(1.3,3.85+j*.62,8.2,.55,p,19)
        text(10.0,1.25,2.5,2.5,s.get('role_num',''),100,'E4DED2',font='Georgia')
        prompt(w=9.1); footer(); return items
    if mode=='podcast':
        header(width=9.7)
        text(.7,2.9,11,.6,s['subtitle'],23,TEAL)
        for j,p in enumerate(s['points']): text(.7,3.8+j*.64,8.3,.57,p,20)
        for j in range(15):
            height=.35+1.25*abs(math.sin(j*.75))
            shape(9.65+j*.17,4.55-height/2,.08,height,TEAL if j%2 else CORAL)
        prompt(w=10.5); footer(); return items
    if mode=='closing':
        header(width=9.5)
        text(.7,3.0,10,.6,s['subtitle'],25,TEAL)
        for j,p in enumerate(s['points']): text(.7,4+j*.55,10.8,.5,p,20)
        prompt(); footer(); return items
    # Open, art-free discussion/election slides with steps and a side callout.
    header(width=8.8)
    text(.7,2.88,8,.8,s['subtitle'],22,TEAL)
    for j,p in enumerate(s['points']): text(.7,3.93+j*.65,8.25,.6,p,19)
    shape(9.45,2.6,3.2,3.05,'E9ECE3')
    text(9.72,2.95,2.66,.4,s.get('callout','LET’S TALK'),13,TEAL,bold=True)
    text(9.72,3.62,2.6,1.9,s.get('aside','A little curiosity\ngoes a long way.'),25,font='Georgia')
    prompt(); footer(); return items

def html_items(items,assets):
    out=[]
    for t in items:
        style=f'left:{t["x"]/W*100}%;top:{t["y"]/H*100}%;width:{t["w"]/W*100}%;height:{t["h"]/H*100}%;'
        if t['kind']=='text':
            style+=f'font-size:{t["size"]/9.6}cqw;color:#{t["color"]};font-family:{t["font"]};font-weight:{700 if t["bold"] else 400};'
            out.append(f'<div class="element text" style="{style}">{escape(t["value"])}</div>')
        elif t['kind']=='shape':
            if t.get('mask'): style+='clip-path:polygon('+','.join(f'{x*100:.3f}% {y*100:.3f}%' for x,y in t['mask'])+');'
            out.append(f'<div class="element" style="{style}background:#{t["color"]};"></div>')
        else:
            mask=t.get('mask')
            if mask=='ellipse': style+='clip-path:ellipse(50% 50% at 50% 50%);'
            elif mask: style+='clip-path:polygon('+','.join(f'{x*100:.3f}% {y*100:.3f}%' for x,y in mask)+');'
            out.append(f'<img class="element" style="{style}object-fit:cover;" data-asset="{escape(t["asset"])}" alt="{escape(t["asset"].split("/")[-1])}">')
    return ''.join(out)

def ppt_items(items,assets,textshape):
    emu=914400
    out=[]; links=[]
    for id,t in enumerate(items,2):
        if t['kind']=='text':
            node=textshape(id,t['x'],t['y'],t['w'],t['h'],t['value'].split('\n'),t['size'],t['color'],t['font'])
            if t['bold']: node=node.replace('<a:rPr lang=','<a:rPr b="1" lang=')
            out.append(node); continue
        x,y,w,h=[int(t[k]*emu) for k in ['x','y','w','h']]
        trans=f'<a:xfrm><a:off x="{x}" y="{y}"/><a:ext cx="{w}" cy="{h}"/></a:xfrm>'
        geom='<a:prstGeom prst="rect"><a:avLst/></a:prstGeom>'
        mask=t.get('mask')
        if mask=='ellipse': geom='<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom>'
        elif mask:
            path=''.join(f'<a:{"moveTo" if j==0 else "lnTo"}><a:pt x="{int(a*100000)}" y="{int(b*100000)}"/></a:{"moveTo" if j==0 else "lnTo"}>' for j,(a,b) in enumerate(mask))+'<a:close/>'
            geom='<a:custGeom><a:avLst/><a:gdLst/><a:ahLst/><a:cxnLst/><a:rect l="0" t="0" r="r" b="b"/><a:pathLst><a:path w="100000" h="100000">'+path+'</a:path></a:pathLst></a:custGeom>'
        if t['kind']=='shape':
            out.append(f'<p:sp><p:nvSpPr><p:cNvPr id="{id}" name="Accent {id}"/><p:cNvSpPr/><p:nvPr/></p:nvSpPr><p:spPr>{trans}{geom}<a:solidFill><a:srgbClr val="{t["color"]}"/></a:solidFill><a:ln><a:noFill/></a:ln></p:spPr></p:sp>'); continue
        data=assets[t['asset']]; iw=int.from_bytes(data[16:20],'big'); ih=int.from_bytes(data[20:24],'big')
        ratio=t['w']/t['h']; l=r=top=b=0
        if iw/ih>ratio: l=r=int((1-ratio/(iw/ih))*50000)
        else: top=b=int((1-(iw/ih)/ratio)*50000)
        rid=f'rIdImage{id}'
        links.append((rid,'image','../media/'+t['asset'].split('/')[-1]))
        out.append(f'<p:pic><p:nvPicPr><p:cNvPr id="{id}" name="{xml(t["asset"])}"/><p:cNvPicPr><a:picLocks noChangeAspect="1"/></p:cNvPicPr><p:nvPr/></p:nvPicPr><p:blipFill><a:blip r:embed="{rid}"/><a:srcRect l="{l}" r="{r}" t="{top}" b="{b}"/><a:stretch><a:fillRect/></a:stretch></p:blipFill><p:spPr>{trans}{geom}<a:ln><a:noFill/></a:ln></p:spPr></p:pic>')
    return ''.join(out),links
