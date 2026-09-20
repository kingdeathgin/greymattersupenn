"""Build an offline HTML deck and editable PowerPoint using only the standard library."""
from pathlib import Path
from html import escape
import base64, json, zipfile
from xml.sax.saxutils import escape as xml

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'output/semester-kickoff'
OUT.mkdir(parents=True, exist_ok=True)
ART = 'public/images/articles/'
clock = 'the-accelerating-clock-cover.png'
tongues = 'thinking-in-tongues-cover-v3.png'
genes = 'written-in-our-genes-cover-v2.png'
mito = 'altered-mitochondrial-trafficking-cover-v2.png'
brain = 'the-shrinking-brain-cover-v2.png'
slides = []
def add(tag, title, subtitle, points, art, credit, prompt='', notes=''):
    slides.append(dict(tag=tag, title=title, subtitle=subtitle, points=points, art=art, credit=credit, prompt=prompt, notes=notes))
add('WELCOME / FALL 2026', 'Big brains.\nBigger ideas.', 'Grey Matters at Penn', ['Science you can understand.', 'Art you want to look at.', 'Stories you want to share.'], tongues, 'Thinking in Tongues', 'Bring your curiosity. We’ll build the rest together.', 'Welcome everyone. This is a suggested 25–30 minute kickoff, plus time for elections. The role descriptions are practical working expectations; confirm team-specific deadlines with your leads.')
add('WARM-UP / 3 MINUTES', 'Give this brain\na headline.', 'Pair up with someone you haven’t met.', ['30 sec · Look at the artwork. What catches your eye?', '60 sec · Invent a six-word headline together.', '90 sec · Hear three pairs. Applaud the boldest idea.'], clock, 'The Accelerating Clock', 'Optional twist: pitch your headline like a movie trailer.', 'Run the three-minute timer in the HTML version. Invite volunteers, not cold calls. There is no correct headline. Offer describing or speaking as alternatives to writing. The artwork is a conversation starter, not evidence for a scientific claim.')
add('THE REVEAL', 'You just did\nGrey Matters.', 'One image. Many ways into a question.', ['You noticed something worth exploring.', 'You made a complicated idea approachable.', 'You shared it in your own voice.'], clock, 'The Accelerating Clock', 'Actual article: “The Accelerating Clock” · Elias Mekuriaw', 'Reveal the title after the warm-up. Ask which visual detail shaped people’s headlines. Connect this to collaboration between writers and artists.')
add('OUR PURPOSE', 'Neuroscience\nfor the curious.', 'A student publication at the University of Pennsylvania.', ['We make neuroscience accessible through stories and art.', 'We bring together writers, artists, editors and communicators.', 'You don’t have to study neuroscience to belong here.'], genes, 'Written in our genes?', 'Our audience: anyone who has ever asked, “Why does my brain do that?”', 'Mission adapted from the local About page. Describe podcasting and social media as team activities and opportunities, without claiming an established release schedule.')
add('THE CREATIVE LOOP', 'One question.\nFive kinds of magic.', 'The best work moves between teams.', ['Author + editor → a clear, well-supported story.', 'Artist → a visual way into the idea.', 'Podcast → a conversation worth hearing.', 'Social media → an invitation to discover more.'], mito, 'Altered Mitochondrial Trafficking', 'Start collaborating at the pitch—not just at the finish line.', 'Suggested workflow: pitch together, research, draft and sketch, review, revise, publish and share. Scientific details should be checked before publication.')
add('ROLE 01 / AUTHOR', 'Follow the\n“wait, why?”', 'Turn curiosity into a story people can follow.', ['Pitch a focused neuroscience question.', 'Read research; explain the evidence and its limits.', 'Draft a clear story, cite sources and revise with your editor.'], genes, 'Written in our genes?', 'Your first move: pitch one question you would ask over dinner.', 'Suggested deliverable: a sourced draft plus a short visual brief for an artist. Example from our archive: Written in our genes? by Elias Mekuriaw. Avoid turning a single study into a universal claim.')
add('ROLE 02 / EDITOR', 'Be the reader’s\nbest friend.', 'Help a strong idea become a clear, trustworthy piece.', ['Shape the structure, argument and pacing.', 'Check claims against sources; flag uncertainty and jargon.', 'Give specific, kind feedback while preserving the author’s voice.'], brain, 'The Shrinking Brain', 'Quick edit: replace “utilize” with…?', 'Answer: use. Suggested deliverable: an annotated draft and revision priorities. Editing includes the substance and logic, not just spelling. Coordinate factual checks with the author.')
add('ROLE 03 / ARTIST', 'Make the idea\nimpossible to ignore.', 'Build a visual explanation—not just a decoration.', ['Read the pitch and brainstorm with the author early.', 'Sketch concepts, metaphors and accurate diagrams.', 'Refine for readability; supply credits and an image description.'], tongues, 'Thinking in Tongues', 'Look at the art: how do the speech bubbles tell a story?', 'Suggested deliverable: a cover or illustration, with a caption and description. Separate metaphor from literal anatomy. Existing artwork used in this deck is credited to Elgin Tawiah in the article metadata.')
add('ROLE 04 / PODCAST', 'Make curiosity\na conversation.', 'Help listeners feel like they’re in the room.', ['Research a topic or guest and build thoughtful questions.', 'Host or produce: listen closely and ask useful follow-ups.', 'Edit audio; check claims, permissions and show notes.'], mito, 'Altered Mitochondrial Trafficking', 'Try it: ask a scientist a question that doesn’t start with jargon.', 'Suggested deliverable: an episode outline, edited audio and accessible show notes or transcript. Confirm guest participation and recording consent before recording. Do not imply that an episode schedule has already been agreed.')
add('ROLE 05 / SOCIAL MEDIA', 'Stop the scroll.\nStart a question.', 'Give good science a welcoming front door.', ['Turn stories into accurate hooks, captions and short clips.', 'Work with artists on readable, accessible visuals.', 'Plan posts, credit collaborators and learn from audience responses.'], clock, 'The Accelerating Clock', 'Your challenge: pitch this artwork in one intriguing sentence.', 'Suggested deliverable: a post or carousel linked to the full piece. Keep nuance; avoid clickbait that changes the claim. Include alt text and captions when appropriate.')
add('TEAM CHALLENGE / 2 MINUTES', 'Pitch it across\nfive formats.', 'Prompt: “Why does a semester feel so fast?”', ['Author: a question. Editor: a claim to check.', 'Artist: a visual metaphor. Podcast: a guest question.', 'Social: a hook that makes us want to learn more.'], clock, 'The Accelerating Clock', 'Make a group of 3–5. Pick roles. Share a 20-second pitch.', 'Spend 90 seconds brainstorming and 30 seconds hearing one pitch. Encourage multiple roles in smaller groups. These are pitches, not established scientific explanations.')
add('LEADS / PEOPLE TO KNOW', 'Meet the people\nconnecting the dots.', 'Leadership listed in the current application roster', ['Elias Mekuriaw · Co-Editor-in-Chief', 'Feng Pan + Hans Manish · Lead Editors', 'Livia De La Rosa · Podcast Director'], tongues, 'Thinking in Tongues', 'Editor-in-Chief: Elgin Tawiah', 'Elgin’s title comes from data/team.json. Other names and titles come from lib/application-roster.ts, which differs from the older team page. This is a current-roster introduction, not a ballot or a statement that these individuals are running this semester.')
add('LEADS / WHAT THE JOB MEANS', 'Help your team\ndo its best work.', 'Leadership is a commitment to other people.', ['Connect people, set clear milestones and notice blockers.', 'Offer useful feedback and make room for quieter voices.', 'Coordinate across teams and follow through on decisions.'], brain, 'The Shrinking Brain', 'Candidate prompt: “One thing I’ll help our team do this semester is…”', 'Proposed lead expectations for discussion. Ask organizers to confirm which positions are open, seat counts, eligibility and term before nominations. Do not assume every department has an elected lead.')
add('SEMESTER LEAD ELECTION / SETUP', 'Your team.\nYour voice.', 'Nominate → hear candidates → vote', ['Confirm open roles, seat counts and voter eligibility.', 'Invite nominations; ask each nominee to accept.', 'Give each candidate the same 30-second introduction.'], genes, 'Written in our genes?', 'Vote for follow-through, collaboration and a clear plan.', 'Proposed election format, subject to organizer approval. Candidate names and a hosted poll URL have not been supplied. Confirm the ballot, voting window, tie process and counting method before opening the vote. Keep current leaders distinct from confirmed candidates.')
add('SEMESTER LEAD ELECTION / POLL', 'Who will help\nyour team thrive?', 'Ballot question: “Who should serve as [role] this semester?”', ['Choose from the confirmed nominees—or abstain.', 'Cast one ballot per eligible voter for each role.', 'Use the announced poll link or the paper ballot provided.'], tongues, 'Thinking in Tongues', 'Paper fallback: write the role + one nominee’s name, then fold.', 'Use the separate printable ballot file. Organizers announce confirmed roles and nominees before distributing ballots. Suggested rule for one-seat races: most votes wins; tied candidates enter a runoff. Agree on rules before voting. Use two counters and announce verified results. HTML allows setting a real external poll URL; it does not collect votes itself.')
add('YOUR FIRST STEP', 'Leave with\none new connection.', 'Find a collaborator before you go.', ['Meet someone from another team.', 'Exchange one question you’d love to explore.', 'Agree on one small next step with your lead.'], mito, 'Altered Mitochondrial Trafficking', 'A pitch. A sketch. A question. That’s where it starts.', 'Invite questions, then give members a few minutes to mingle. Team deadlines and contact channels should be announced by organizers rather than invented in this deck.')
add('THANK YOU / ART & STORY CREDITS', 'Curiosity looks\ngood on you.', 'Let’s make something worth sharing.', ['Featured artwork · Elgin Tawiah', 'Featured stories · Elias Mekuriaw, Hans Manish,', 'Augustus Clarke and Isabelle Chen'], genes, 'Written in our genes?', 'Grey Matters at Penn · Fall 2026', 'Artwork and article credits are taken from data/articles.json. Covers: The Accelerating Clock and Written in our genes? (Elias Mekuriaw); Thinking in Tongues (Hans Manish); Altered Mitochondrial Trafficking (Augustus Clarke); The Shrinking Brain (Isabelle Chen). Mission: app/about/page.tsx. Role workflows and election procedures are suggested facilitation content.')

# Use the live website's Leadership section, verified 2026-09-19.
from kickoff_design import layout, html_items, ppt_items
team = json.loads((ROOT / 'data/team.json').read_text())
people = {p['name']: dict(p, image=p['image'].split('/')[-1]) for p in team}
slides[11].update(title='Meet your editorial\nleadership.', subtitle='The people behind Penn Grey Matters', points=[], prompt='', people=[people['Elgin Tawiah'],people['Elias Mekuriaw']], notes='Leadership names, titles and photos verified against https://greymattersjournalpenn.com/team on 2026-09-19: Elgin Tawiah, Editor-in-Chief; Elias Mekuriaw, Co-Editor-in-Chief. Invite each to introduce themselves. These are current leaders, not an election ballot.')
second=dict(slides[11], title='Meet your creative\nleadership.', people=[people['Livia De La Rosa'],people['Hans Manish']], notes='Leadership verified against the live team page on 2026-09-19: Livia De La Rosa, Podcast Director; Hans Manish, Lead Editor. Invite each to introduce themselves. Photos are the same assets used on the website.')
slides.insert(12,second)
modes=['cover','activity','background','issue','cutout','strips','scrapbook','background','wave','postcard','droplets','team','team','droplets','wave','paint_poll','closing_art','gallery_end']
for i,(slide,mode) in enumerate(zip(slides,modes)):
    slide['layout']=mode
    slide['role_num']='02' if i==6 else ''
slides[10].update(callout='02 MINUTES',aside='Five roles.\nOne idea.')
slides[13].update(callout='LEAD WITH CARE',aside='Make it easier\nfor others\nto do great work.')
slides[14].update(callout='30 SECONDS EACH',aside='One idea.\nOne promise.\nYour introduction.')
slides[15].update(callout='CAST YOUR VOTE',aside='One role.\nOne choice.\nOr abstain.')
# One distinct artwork per slide. Paths stay tied to the website archive.
art_paths=[
 'articles/thinking-in-tongues-cover-v3.png',
 'articles/the-accelerating-clock-cover.png',
 'articles/truth-behind-intelligence-cover.png',
 'issues/issue-one-fall-2025-enhanced.png',
 None,
 'articles/written-in-our-genes-cover-v2.png',
 'editorial/neuroscience-margin-notes.png',
 'articles/the-changing-weather-within-cover.png',
 'articles/inline/intelligence-synapse.png',
 'articles/inline/intelligence-framework.png',
 'articles/inline/intelligence-newton.png',
 'issues/backgrounds/truth-behind-intelligence-watercolor.png',
 'issues/backgrounds/thinking-in-tongues-watercolor.png',
 'articles/inline/shrinking-brain-aging-tree.png',
 'articles/inline/genes-chromosome-dna.png',
 'issues/backgrounds/altered-mitochondrial-trafficking-watercolor.png',
 'articles/altered-mitochondrial-trafficking-cover-v2.png',
 'articles/the-shrinking-brain-cover-v2.png',
]
assets={}
for slide,path in zip(slides,art_paths):
    name=Path(path).name if path else 'motor-cargo-cutout-clean.png'
    slide['art']=name
    asset_path=ROOT/'public/images'/path if path else OUT/'assets'/name
    assets[name]=asset_path.read_bytes()
    slide['notes']+=' Artwork on this slide: '+(path or 'assets/motor-cargo-cutout-clean.png')+'. Decorative integration; not a scientific claim about the slide topic.'
slides[7]['prompt']='Look at the art: how do color and gesture communicate emotion?'
slides[2]['notes']+=' The warm-up title refers to the previous clock artwork; this new painting shows another example from the archive.'
slides[3]['notes']+=' Issue One, Fall 2025, is shown in full rather than cropped.'
for person in slides[11]['people']+slides[12]['people']:
    assets[person['image']] = (ROOT/'public/images/team'/person['image']).read_bytes()
assert len({slide['art'] for slide in slides})==len(slides), 'Do not repeat artwork across slides.'
(OUT/'artwork-map.md').write_text('# Artwork by slide\n\nEach slide uses a different archive image or the motor-and-cargo cutout. Layout clipping is native and editable; original artwork files are preserved.\n\n| Slide | Artwork | Treatment |\n|---|---|---|\n'+''.join(f'| {i+1} | {path or "assets/motor-cargo-cutout-clean.png"} | {slide["layout"]} |\n' for i,(slide,path) in enumerate(zip(slides,art_paths))))
scenes=[layout(s,i,len(slides)) for i,s in enumerate(slides)]
css = '''*{box-sizing:border-box}body{margin:0;background:#dedbd4;color:#242838;font-family:Arial,sans-serif}main{width:min(100vw,177.77vh);margin:auto}.slide{container-type:inline-size;aspect-ratio:16/9;position:relative;display:none;overflow:hidden;background:#faf8f2}.slide.active{display:block}.element{position:absolute}.text{white-space:pre-line;line-height:1.16;overflow:visible}.controls{display:flex;justify-content:center;gap:8px;padding:12px;flex-wrap:wrap;font-size:14px}button{background:#faf8f2;color:#242838;border:1px solid #aaa79f;border-radius:5px;padding:9px 12px;font:inherit;cursor:pointer}button:focus-visible,a:focus-visible{outline:3px solid #bd563f}#notes,#settings{max-width:950px;margin:12px auto;padding:20px;background:#faf8f2;line-height:1.6}input{width:70%;padding:12px;font:inherit}#timer{color:#236b68;font-variant-numeric:tabular-nums;padding:10px}#pollLink{position:absolute;left:5.3%;top:91%;font-size:1cqw;color:#236b68;overflow-wrap:anywhere;max-width:80%}#progress{height:3px;background:#236b68;width:0;transition:width .2s}body:fullscreen main{width:min(100vw,177.77vh)}body:fullscreen .controls{position:fixed;bottom:0;opacity:0}body:fullscreen .controls:focus-within,body:fullscreen .controls:hover{opacity:1}@media print{@page{size:13.333333in 7.5in;margin:0}body,main{width:13.333333in;background:#faf8f2;print-color-adjust:exact;-webkit-print-color-adjust:exact}.slide,.slide.active{display:block;width:13.333333in;height:7.5in;break-after:page}.controls,#notes,#settings,#progress{display:none!important}}'''
parts=[]
for i,(slide,scene) in enumerate(zip(slides,scenes)):
    poll='<a id="pollLink" target="_blank" rel="noopener noreferrer" hidden></a>' if i==15 else ''
    parts.append(f'<section class="slide{" active" if i==0 else ""}" aria-label="Slide {i+1}: {escape(slide["title"].replace(chr(10)," "))}">'+html_items(scene,assets)+poll+'</section>')
js = '''let current=0;const slides=[...document.querySelectorAll('.slide')];const notes=document.getElementById('notes');function show(n){current=Math.max(0,Math.min(slides.length-1,n));slides.forEach((s,i)=>{s.classList.toggle('active',i===current);s.setAttribute('aria-hidden',i!==current)});notes.textContent=NOTES[current];document.getElementById('progress').style.width=((current+1)/slides.length*100)+'%';document.getElementById('status').textContent=`Slide ${current+1} of ${slides.length}`;history.replaceState(null,'','#'+(current+1))}document.getElementById('prev').onclick=()=>show(current-1);document.getElementById('next').onclick=()=>show(current+1);document.getElementById('noteButton').onclick=()=>notes.hidden=!notes.hidden;document.getElementById('print').onclick=()=>window.print();document.getElementById('full').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await document.body.requestFullscreen()}catch{document.getElementById('status').textContent='Use your browser’s fullscreen command.'}};document.addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|BUTTON|A/.test(e.target.tagName))return;if(['ArrowRight','PageDown',' '].includes(e.key)){e.preventDefault();show(current+1)}if(['ArrowLeft','PageUp'].includes(e.key)){e.preventDefault();show(current-1)}if(e.key==='Home')show(0);if(e.key==='End')show(slides.length-1);if(e.key.toLowerCase()==='n')notes.hidden=!notes.hidden});let interval;document.getElementById('startTimer').onclick=()=>{clearInterval(interval);let remaining=180;const render=()=>document.getElementById('timer').textContent=remaining?Math.floor(remaining/60)+':'+String(remaining%60).padStart(2,'0'):'Time to share!';render();interval=setInterval(()=>{remaining--;render();if(remaining<=0)clearInterval(interval)},1000)};document.getElementById('settingsButton').onclick=()=>{const p=document.getElementById('settings');p.hidden=!p.hidden};document.getElementById('setPoll').onclick=()=>{const input=document.getElementById('pollURL');try{const url=new URL(input.value);if(url.protocol!=='https:')throw Error();const a=document.getElementById('pollLink');a.href=url.href;a.textContent=url.href;a.hidden=false;document.getElementById('pollMessage').textContent='Poll link added for this presentation session. Open slide 16 to use it.'}catch{document.getElementById('pollMessage').textContent='Enter a full HTTPS poll URL.'}};show((parseInt(location.hash.slice(1),10)||1)-1);'''
art_data={name:'data:image/png;base64,'+base64.b64encode(data).decode() for name,data in assets.items()}
html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Grey Matters at Penn · Fall 2026 Kickoff</title><style>'+css+'</style><main>'+''.join(parts)+'</main><div id="progress"></div><nav class="controls" aria-label="Presentation controls"><button id="prev">← Previous</button><button id="next">Next →</button><button id="full">Fullscreen</button><button id="noteButton">Presenter notes (N)</button><button id="startTimer">Start / reset 3:00</button><span id="timer" role="timer">3:00</span><button id="settingsButton">Add poll link</button><button id="print">Print / PDF</button><span id="status" aria-live="polite"></span></nav><aside id="notes" hidden></aside><aside id="settings" hidden><label for="pollURL">Hosted election poll URL</label><br><input id="pollURL" type="url" placeholder="https://…"><button id="setPoll">Use link</button><p id="pollMessage">Add a real poll after confirming the nominees. This deck does not collect or store votes. Without a link, use the printable paper ballot.</p></aside><script>const ART_DATA='+json.dumps(art_data)+';document.querySelectorAll("img[data-asset]").forEach(img=>img.src=ART_DATA[img.dataset.asset]);const NOTES='+json.dumps([s['notes'] for s in slides])+';'+js+'</script></html>'
(OUT/'grey-matters-kickoff.html').write_text(html)

# Minimal standards-based editable PowerPoint, including presenter notes.
P='http://schemas.openxmlformats.org/presentationml/2006/main'
A='http://schemas.openxmlformats.org/drawingml/2006/main'
R='http://schemas.openxmlformats.org/officeDocument/2006/relationships'
EMU=914400

def rels(items):
    return '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+''.join(f'<Relationship Id="{id}" Type="{R}/{kind}" Target="{target}"/>' for id,kind,target in items)+'</Relationships>'
def textshape(id,x,y,w,h,lines,size=20,color='F7F2E9',font='Arial'):
    paras=''.join(f'<a:p><a:pPr/><a:r><a:rPr lang="en-US" sz="{size*100}"><a:solidFill><a:srgbClr val="{color}"/></a:solidFill><a:latin typeface="{font}"/></a:rPr><a:t>{xml(line)}</a:t></a:r><a:endParaRPr lang="en-US" sz="{size*100}"/></a:p>' for line in lines)
    return f'<p:sp><p:nvSpPr><p:cNvPr id="{id}" name="Text {id}"/><p:cNvSpPr txBox="1"/><p:nvPr/></p:nvSpPr><p:spPr><a:xfrm><a:off x="{int(x*EMU)}" y="{int(y*EMU)}"/><a:ext cx="{int(w*EMU)}" cy="{int(h*EMU)}"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:noFill/></p:spPr><p:txBody><a:bodyPr wrap="square" lIns="0" rIns="0" tIns="0" bIns="0"/><a:lstStyle/>{paras}</p:txBody></p:sp>'
def tree(content):
    return '<p:spTree><p:nvGrpSpPr><p:cNvPr id="1" name=""/><p:cNvGrpSpPr/><p:nvPr/></p:nvGrpSpPr><p:grpSpPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="0" cy="0"/><a:chOff x="0" y="0"/><a:chExt cx="0" cy="0"/></a:xfrm></p:grpSpPr>'+content+'</p:spTree>'
def root(kind,content):
    return f'<p:{kind} xmlns:p="{P}" xmlns:a="{A}" xmlns:r="{R}">{content}</p:{kind}>'
with zipfile.ZipFile(OUT/'grey-matters-kickoff.pptx','w',zipfile.ZIP_DEFLATED) as z:
    types={'presentation':'presentation.main','slideMasters/slideMaster1':'slideMaster','slideLayouts/slideLayout1':'slideLayout','notesMasters/notesMaster1':'notesMaster'}
    for i in range(1,len(slides)+1): types[f'slides/slide{i}']='slide'; types[f'notesSlides/notesSlide{i}']='notesSlide'
    z.writestr('[Content_Types].xml','<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="xml" ContentType="application/xml"/>'+''.join(f'<Override PartName="/ppt/{k}.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.{v}+xml"/>' for k,v in types.items())+'<Override PartName="/ppt/theme/theme1.xml" ContentType="application/vnd.openxmlformats-officedocument.theme+xml"/></Types>')
    z.writestr('_rels/.rels',rels([('rId1','officeDocument','ppt/presentation.xml')]))
    z.writestr('ppt/presentation.xml',root('presentation','<p:sldMasterIdLst><p:sldMasterId id="2147483648" r:id="rIdMaster"/></p:sldMasterIdLst><p:notesMasterIdLst><p:notesMasterId r:id="rIdNotes"/></p:notesMasterIdLst><p:sldIdLst>'+''.join(f'<p:sldId id="{256+i}" r:id="rId{i}"/>' for i in range(1,len(slides)+1))+'</p:sldIdLst><p:sldSz cx="12192000" cy="6858000" type="screen16x9"/><p:notesSz cx="6858000" cy="9144000"/>'))
    z.writestr('ppt/_rels/presentation.xml.rels',rels([('rIdMaster','slideMaster','slideMasters/slideMaster1.xml'),('rIdNotes','notesMaster','notesMasters/notesMaster1.xml')]+[(f'rId{i}','slide',f'slides/slide{i}.xml') for i in range(1,len(slides)+1)]))
    cmap='<p:clrMap accent1="accent1" accent2="accent2" accent3="accent3" accent4="accent4" accent5="accent5" accent6="accent6" bg1="lt1" bg2="lt2" folHlink="folHlink" hlink="hlink" tx1="dk1" tx2="dk2"/>'
    z.writestr('ppt/slideMasters/slideMaster1.xml',root('sldMaster','<p:cSld>'+tree('')+'</p:cSld>'+cmap+'<p:sldLayoutIdLst><p:sldLayoutId id="2147483649" r:id="rId1"/></p:sldLayoutIdLst><p:txStyles><p:titleStyle/><p:bodyStyle/><p:otherStyle/></p:txStyles>'))
    z.writestr('ppt/slideMasters/_rels/slideMaster1.xml.rels',rels([('rId1','slideLayout','../slideLayouts/slideLayout1.xml'),('rId2','theme','../theme/theme1.xml')]))
    z.writestr('ppt/slideLayouts/slideLayout1.xml',root('sldLayout','<p:cSld name="Blank">'+tree('')+'</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>'))
    z.writestr('ppt/slideLayouts/_rels/slideLayout1.xml.rels',rels([('rId1','slideMaster','../slideMasters/slideMaster1.xml')]))
    z.writestr('ppt/notesMasters/notesMaster1.xml',root('notesMaster','<p:cSld>'+tree('')+'</p:cSld>'+cmap+'<p:notesStyle/>'))
    z.writestr('ppt/notesMasters/_rels/notesMaster1.xml.rels',rels([('rId1','theme','../theme/theme1.xml')]))
    colors={'dk1':'101020','lt1':'F7F2E9','dk2':'29283F','lt2':'DCD6EF','accent1':'98E4D8','accent2':'C8B9F6','accent3':'F4D276','accent4':'F5A1BE','accent5':'8AAAE8','accent6':'C4DB91','hlink':'98E4D8','folHlink':'C8B9F6'}
    fills='<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>'*3
    lines='<a:ln w="9525"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>'*3
    z.writestr('ppt/theme/theme1.xml',f'<a:theme xmlns:a="{A}" name="Grey Matters"><a:themeElements><a:clrScheme name="Grey Matters">'+''.join(f'<a:{k}><a:srgbClr val="{v}"/></a:{k}>' for k,v in colors.items())+'</a:clrScheme><a:fontScheme name="Editorial"><a:majorFont><a:latin typeface="Georgia"/><a:ea typeface=""/><a:cs typeface=""/></a:majorFont><a:minorFont><a:latin typeface="Arial"/><a:ea typeface=""/><a:cs typeface=""/></a:minorFont></a:fontScheme><a:fmtScheme name="Simple"><a:fillStyleLst>'+fills+'</a:fillStyleLst><a:lnStyleLst>'+lines+'</a:lnStyleLst><a:effectStyleLst>'+('<a:effectStyle><a:effectLst/></a:effectStyle>'*3)+'</a:effectStyleLst><a:bgFillStyleLst>'+fills+'</a:bgFillStyleLst></a:fmtScheme></a:themeElements></a:theme>')
    for name,data in assets.items(): z.writestr('ppt/media/'+name.split('/')[-1],data)
    for i,s in enumerate(slides,1):
        shapes,image_links=ppt_items(scenes[i-1],assets,textshape)
        z.writestr(f'ppt/slides/slide{i}.xml',root('sld','<p:cSld><p:bg><p:bgPr><a:solidFill><a:srgbClr val="FAF8F2"/></a:solidFill><a:effectLst/></p:bgPr></p:bg>'+tree(shapes)+'</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>'))
        z.writestr(f'ppt/slides/_rels/slide{i}.xml.rels',rels([('rIdLayout','slideLayout','../slideLayouts/slideLayout1.xml'),('rIdNotes','notesSlide',f'../notesSlides/notesSlide{i}.xml')]+image_links))
        note=textshape(2,.5,1,6.5,8,[s['notes']],12,'242838').replace('<p:nvPr/>','<p:nvPr><p:ph type="body" idx="1"/></p:nvPr>')
        z.writestr(f'ppt/notesSlides/notesSlide{i}.xml',root('notes','<p:cSld>'+tree(note)+'</p:cSld><p:clrMapOvr><a:masterClrMapping/></p:clrMapOvr>'))
        z.writestr(f'ppt/notesSlides/_rels/notesSlide{i}.xml.rels',rels([('rId1','slide',f'../slides/slide{i}.xml'),('rId2','notesMaster','../notesMasters/notesMaster1.xml')]))

ballot='''<!doctype html><html lang="en"><meta charset="utf-8"><title>Grey Matters · Lead ballot</title><style>body{font:17px Arial;margin:40px;color:#151525}article{border:2px dashed #888;padding:25px;margin:20px 0;break-inside:avoid}h1{font:28px Georgia}p{line-height:1.8}.line{border-bottom:1px solid #555;display:inline-block;width:65%}@media print{button,.instructions{display:none}}</style><button onclick="print()">Print ballots</button><p class="instructions">Organizer: announce confirmed roles and consenting nominees first. Print one slip per eligible voter per role. Fill in the role before distributing. These slips are for a one-seat race; confirm the rules before voting.</p>'''
for _ in range(3): ballot+='''<article><h1>Grey Matters at Penn · Fall 2026</h1><p>Lead position: <span class="line">&nbsp;</span></p><p>My choice: <span class="line">&nbsp;</span></p><p>□ I abstain</p><small>Write one confirmed nominee’s name OR check abstain. Fold and return to the designated collector. Do not write your own name.</small></article>'''
(OUT/'lead-election-ballots.html').write_text(ballot+'</html>')
(OUT/'presenter-guide.md').write_text('''# Grey Matters at Penn — Fall 2026 kickoff

Open `grey-matters-kickoff.pptx` in PowerPoint or Keynote. Text and images are editable; each slide has presenter notes. Alternatively, open `grey-matters-kickoff.html` in a browser: it works offline with all artwork embedded. Use arrow keys, fullscreen, N for notes, and the three-minute activity timer. Print / PDF exports the slides from the browser.

Allow about 25–30 minutes, plus election time. Start with the six-word headline activity on slide 2. Slide 11 adds a short cross-team pitch challenge. Slides 6–10 explain the five positions. Slides 12–13 introduce the four leaders with portraits from the website; slide 14 covers proposed lead responsibilities.

## Before the election

The user has not supplied candidates, open positions or a hosted poll link. Slides 15–16 therefore introduce a usable paper-ballot process rather than implying that a live online election exists. Confirm positions, seat counts, consenting candidates, eligible voters, closing time and tie rules before voting. The paper slips assume one seat per race. Print `lead-election-ballots.html` and announce the choices. Use two counters; a runoff for tied candidates is a suggested rule to agree on in advance.

If using an online poll, create the confirmed ballot in the club’s preferred service and configure its voting rules. In the HTML deck, “Add poll link” puts your HTTPS URL on slide 16 for the current session. In PowerPoint, edit slide 16 to include the link. The presentation itself does not collect votes or prevent duplicate submissions.

## Content and credits

Mission: `app/about/page.tsx`. Leaders and portrait assets: the live https://greymattersjournalpenn.com/team page, verified 2026-09-19, with matching local data in `data/team.json` and the Leadership selection in `app/team/page.tsx`. Leaders: Elgin Tawiah (Editor-in-Chief), Elias Mekuriaw (Co-Editor-in-Chief), Livia De La Rosa (Podcast Director), Hans Manish (Lead Editor). Existing leaders are not automatically election candidates. Role workflows and election rules are suggested facilitation content, not established club bylaws.

Art credits and article titles: `data/articles.json`. Decorative cover excerpts credit Elgin Tawiah as artist. The deck preserves the original brush-edge cover, uses full-art backgrounds with paper panels and angled art strips, and incorporates an isolated motor-protein-and-cargo illustration on slide 5, with a different artwork on every slide, plus paint-droplet masks and layered flowing panels; portraits are taken from the website’s existing assets. Stories: Elias Mekuriaw (The Accelerating Clock; Written in our genes?), Hans Manish (Thinking in Tongues), Augustus Clarke (Altered Mitochondrial Trafficking), Isabelle Chen (The Shrinking Brain).

The transparent motor-and-cargo asset was adapted using the built-in imagegen tool from `public/images/articles/inline/mitochondrial-synapse-v2.png`. It is a stylized illustration, not a molecular model. Prompt: isolate the left complete orange motor, its two feet and stalk, and its turquoise cargo; remove the second motor, track and background; preserve the watercolor subject with a clean transparent silhouette. A second pass removed any outside halo. The final asset is `assets/motor-cargo-cutout-clean.png`.

Rebuild both decks and ballots with `python3 scripts/generate-kickoff-presentation.py`.
''')
print(f'Created {len(slides)} slides in PowerPoint and offline HTML, plus ballots and presenter guide: {OUT}')
