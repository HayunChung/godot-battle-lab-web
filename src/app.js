import {flowResearch} from './flow-research.js';
import directionLocations from './direction-locations.js';
import {bindComparison} from './direction-media.js';
import {directionWorkshop} from "./direction-workshops.js";
import {screenshot} from './screenshot.js';
import {menuStyling} from './menu-styling.js';
import {readableCode,wordReference,findWords,openWord} from './word-reader.js';
import {deviceSync,PUBLIC,ORIGINAL} from './device-sync.js';
import {duelLab,mountDuelLab} from './duel-lab.js';
import {menuPractice,mountMenuPractice} from './menu-practice.js';
import {lessonReadings} from './lesson-readings.js';
import {stepShot} from './lesson-shots.js';
import {sharedStaminaGuide} from './shared-stamina-guide.js';
import {staminaGuide} from './stamina-guide.js';
import {rollGuide} from './roll-guide.js';
import {enemyAttackGuide} from './enemy-attack-guide.js';
import {modules} from './curriculum.js';
import {reactionsGuide} from './reactions-guide.js';
import {attackGuide} from './attack-guide.js';
import {characterGuide,characterLink} from './character-guide.js';
import {setupGuide,guideLink} from './setup-guide.js';
import {arenaLab,mountArena} from './final-arena.js';
import {codeLab,mountCodeLab} from './code-lab.js';
import {simulator, refreshSim} from './simulators.js';
import sources from './sources.js';
import {KEY, emptyState, readProgress, ready} from './progress.js';
import {icon, esc, pad, glossary} from './ui.js';

const lessons = modules.flatMap(m => m.lessons);
let storageWorks = true;
let state = emptyState();
try {
  state = readProgress(localStorage.getItem(KEY), lessons);
  localStorage.setItem(KEY, JSON.stringify(state));
} catch { storageWorks = false; }
const app = document.querySelector('#app');
const photoViewer = document.querySelector('#photo-viewer');
const preview = document.querySelector('#preview');
const openModules = new Set();
const conceptExpanded = new Map();
let drawer = false;
let routeKey = '';

const count = m => m.lessons.filter(l => state.completed.includes(l.id)).length;
const percent = () => Math.round(100 * state.completed.length / lessons.length);
const moduleIndex = l => modules.findIndex(m => m.lessons.includes(l));
const ref = l => '#/lesson/' + l.id;
const moduleIcons = ['box','code','bolt','target','game','layers','target'];
const moduleBlurbs = ['Find your way from the Blender viewport to your first Godot scene.','Write GDScript for a ready room, loading screen, and match results.','Bring your character to life with movement and animation.','Connect damage, enemies, and projectiles into a playable arena.',...modules.slice(4).map(m=>m.description)];
let skipVisit=false;
const sync=deviceSync(lessons,()=>state,(next,draftsChanged)=>{
  if(JSON.stringify(next)===JSON.stringify(state)&&!draftsChanged)return;
  state=next;
  saveLocal();
  render();
});
function saveLocal() {
  try { localStorage.setItem(KEY,JSON.stringify(state)); } catch { storageWorks=false; }
}
function persist(){ const current=route().lesson;if(current)state.last=current.id; saveLocal(); sync.changed(); }
function route() {
  const [,section,id] = location.hash.split('/');
  const lesson = section === 'lesson' && lessons.find(l => l.id === id);
  return {section:lesson?'lesson':['devices','pair','resources','complete','setup','own-project','character','attack','reactions','enemy-attack','roll','stamina','shared-budget'].includes(section)?section:'dashboard',lesson};
}
const progressBar = (v, label) => `<div class="track" role="progressbar" aria-label="${esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}"><i style="width:${v}%"></i></div>`;
const moduleColor = i=>'mod-'+i;
function sidebar(r) {
  return `<aside id="sidebar" class="sidebar ${drawer?'visible':''}" aria-label="Course navigation"><header class="brand"><img src="./assets/mark.svg" alt="" width="39" height="39"><a href="#/" aria-label="Battle Lab dashboard"><strong>Battle Lab</strong><small>GODOT LEARNING STUDIO</small></a><button class="drawer-close icon-btn" data-action="menu" aria-label="Close navigation">${icon('close')}</button></header>
  <div class="sidebar-scroll"><div class="side-label">WORKSPACE</div><nav class="main-nav"><a href="#/" class="${r.section==='dashboard'?'selected':''}">${icon('grid')} Dashboard</a><a href="#/setup" class="${['setup','own-project','character','attack','reactions','enemy-attack','roll','stamina','shared-budget'].includes(r.section)?'selected':''}">${icon('book')} Setup guide</a><a href="#/resources" class="${r.section==='resources'?'selected':''}">${icon('folder')} Resource library</a><a href="#/devices" class="${['devices','pair'].includes(r.section)?'selected':''}">${icon('layers')} Sync progress</a></nav>
  <div class="side-label second">CURRICULUM</div><nav class="chapter-nav">${modules.map((m,i)=>`<div><button class="chapter-switch ${moduleColor(i)}" data-module="${i}" aria-expanded="${openModules.has(i)}"><span class="chap-glyph">${icon(moduleIcons[i],16)}</span><span class="chap-name"><small>MODULE ${pad(i+1)} · ${count(m)}/${m.lessons.length}</small><b>${esc(m.title)}</b></span>${icon(openModules.has(i)?'down':'right',13)}</button>${openModules.has(i)?`<div class="side-lessons">${m.lessons.map(l=>`<a class="${r.lesson===l?'current':''}" href="${ref(l)}">${state.completed.includes(l.id)?icon('check',13):'<i></i>'}${esc(l.title)}</a>`).join('')}</div>`:''}</div>`).join('')}</nav></div>
  <footer class="side-foot"><div class="flex items-center justify-between"><b>${icon('target',15)} Your progress</b><strong>${percent()}%</strong></div>${progressBar(percent(),'Course completion')}<small>${state.completed.length} of ${lessons.length} lessons complete</small></footer></aside>`;
}
function topbar(r) {
  const name = r.lesson ? modules[moduleIndex(r.lesson)].title : ({dashboard:'Dashboard',devices:'Sync progress',pair:'Resume on this device',resources:'Resource library',complete:'Course complete',setup:'First setup','own-project':'Use my project',character:'My Blender character',attack:'Attack animation',reactions:'Hit and death','enemy-attack':'Enemy weapon timing',roll:'Dodge roll',stamina:'Roll stamina','shared-budget':'Shared stamina'}[r.section]);
  return `<header class="topbar"><button class="menu icon-btn" data-action="menu" aria-label="Open navigation" aria-expanded="${drawer}">${icon('menu')}</button><div class="crumb">${icon('layers',16)} <a href="#/">Workspace</a> ${icon('right',12)} <span>${esc(name)}</span></div><span class="engine"><i></i> Godot 4.4.1</span></header>`;
}
function dashboard() {
  const next = lessons.find(l=>l.id===state.last)||lessons[0];
  return `<div class="page"><header class="page-title"><h1>Learning dashboard</h1><p>Your workshop for turning 3D art into a playable game.</p><a class="lib-link" href="#/devices">Continue on another device →</a></header>
  <section class="hero"><img class="hero-img" src="./assets/art/arena.webp" alt="Isometric sci-fi arena with a cyan pilot facing a coral enemy"><div class="hero-shade"></div><div class="hero-copy"><span class="kicker hero-label">${icon('game',15)} PROJECT-BASED COURSE</span><h2>Build your first<br><em>3D battle game.</em></h2><p>From Blender artist to game developer.<br>Learn Godot and GDScript, one scene at a time.</p><div class="hero-meta"><span>${icon('layers',15)} ${modules.length} modules</span><span>${icon('book',15)} ${lessons.length} lessons</span></div><a class="primary" href="${ref(next)}">${state.last?'Resume Learning':'Start Learning'} ${icon('arrow',17)}</a></div><button class="preview-button" data-action="preview" aria-label="Preview playable arena">${icon('expand',15)}</button></section>
  <section class="curriculum"><div class="section-heading"><div><span class="kicker">LEARNING PATH</span><h2>Course curriculum</h2></div><span class="module-total">${icon('layers',15)} ${modules.length} modules</span></div><div class="card-grid">${modules.map((m,i)=>`<a class="course-card ${moduleColor(i)}" href="${ref(m.lessons.find(l=>!state.completed.includes(l.id))||m.lessons[0])}"><div class="card-art"><img src="${i===6?'./assets/duel-guide/setup-menu.webp':i===5?'./assets/menu-guide/art-lobby.webp':i===4?'./assets/enemy-attack-guide/godot-encounter.webp':'./assets/art/chapter-'+(i+1)+'.webp'}" alt=""><span class="card-number">${pad(i+1)}</span></div><div class="card-body"><span class="kicker">MODULE ${pad(i+1)}</span><h3>${esc(m.title)}</h3><p>${moduleBlurbs[i]}</p><div class="card-meta"><span>${icon('book',14)} ${m.lessons.length} lessons</span><span class="card-arrow">${icon('arrow',15)}</span></div>${progressBar(Math.round(count(m)*100/m.lessons.length),m.title+' completion')}</div></a>`).join('')}</div></section>
  <a class="resource-banner" href="#/resources"><span class="resource-icon">${icon('folder',23)}</span><span><b>Resource library</b><small>Project files, practice assets, and the coding glossary</small></span>${icon('arrow')}</a></div>`;
}
function fileBlock(path) {
  return `<details class="file" data-source="${esc(path)}"><summary>${icon('file',16)} <code>${esc(path)}</code></summary><div class="file-toolbar"><span>res://${esc(path)}</span><button data-copy="${esc(path)}">${icon('copy',14)} Copy</button></div><pre><code>${esc(sources[path])}</code></pre></details>`;
}
function stepPhoto(lessonId, step) {
  const [path, caption] = stepShot(lessonId, step);
  const url = './assets/' + path + '.webp';
  return screenshot(url, caption, true);
}

function sourceReading(id) {
  const {file, lines} = lessonReadings[id];
  const title = file.endsWith('.tscn') || file.endsWith('.import') ? 'Read the saved settings' : 'Read the code line by line';
  return `<section class="lesson-reading"><h3>${title}</h3><p class="reading-file"><code>${esc(file)}</code></p><p class="word-help">Select an underlined word to see its meaning and a usage example.</p><dl>${lines.map(({code,meaning})=>`<div><dt><code>${readableCode(code,!file.endsWith('.gd'))}</code></dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl></section>`;
}

function lessonScreen(l) {
  const i=moduleIndex(l), ix=lessons.indexOf(l), m=modules[i], answers=state.responses[l.id]||{};
  const active=state.active[l.id]||l.steps[0].id, quiz=active==='quiz', step=l.steps.find(s=>s.id===active)||l.steps[0];
  const done=state.completed.includes(l.id);
  const hasArena=l.id==='projectiles-and-restart'||(l.guide && l.guide!=='own-project');
  const practice=l.duelMode ? duelLab(l.duelMode) : i===5 ? menuPractice() : hasArena ? arenaLab() : l.guide==='own-project' ? '<a class="lib-link" href="#/lesson/projectiles-and-restart">Open the arena and download your tuned kit →</a>' : codeLab(l.id);
  const stepButtons=[...l.steps,{id:'quiz',title:'Knowledge check'}].map((s,j)=>{
    const ok=s.id==='quiz'?answers.quiz===l.answer:answers[s.id];
    return `<button class="step-tab ${active===s.id?'active':''}" data-step="${esc(s.id)}" aria-label="Step ${j+1}: ${esc(s.title)}" aria-pressed="${active===s.id}"><span>${ok?icon('check',15):j+1}</span> ${esc(s.title)}</button>`;
  }).join('');
  const exercise=quiz?`<h3>${esc(l.question)}</h3><div class="choices">${l.options.map((o,j)=>`<button data-answer="${j}" class="choice ${answers.quiz===j?(j===l.answer?'correct':'incorrect'):''}" aria-pressed="${answers.quiz===j}"><b>${String.fromCharCode(65+j)}</b>${esc(o)}</button>`).join('')}</div>${Number.isInteger(answers.quiz)?`<p class="feedback" role="status">${answers.quiz===l.answer?'Correct. '+esc(l.feedback):'Try again. Revisit the diagram or code trace, then choose another answer.'}</p>`:''}`:`<h3>${esc(step.title)}</h3>${step.directions?`<ol class="editor-directions">${step.directions.map(d=>`<li>${esc(d)}</li>`).join('')}</ol>`:`<p class="preserve">${esc(step.body)}</p>`}${(l.id==='duel-setup'||(l.id==='duel-network'&&step.id==='host')||(l.id==='duel-internet'&&step.id==='prepare')) ? (step.id==='install'?'<a class="lib-link" href="./downloads/arena-kit.zip" download>Download the installable project kit ↓</a>':'<a class="lib-link" href="./downloads/battle-lab.zip" download>Download the reference project ↓</a>'):''}${stepPhoto(l.id,step)}<div class="expected"><b>${icon('target',16)} What you should see</b><p>${esc(step.expected)}</p></div><button class="primary verify" data-action="verify">${icon(answers[active]?'check':'right',15)} ${answers[active]?'Verified · continue':'I verified this step'}</button>`;
  return `<div class="page lesson-page ${moduleColor(i)}"><header class="page-title"><span class="kicker">MODULE ${pad(i+1)} / LESSON ${pad(m.lessons.indexOf(l)+1)}</span><h1>${esc(l.title)}</h1><p class="meta-line">${icon('clock',15)} ${Number(l.minutes)} min <span>·</span> ${esc(m.title)}</p><button class="jump-lab" data-action="jump">Jump to hands-on lab ↓</button> ${l.id==='shared-stamina'?'<button class="jump-lab" data-action="jump-attack-cost">Edit attack cost code ↓</button>':l.id==='roll-stamina'?'<button class="jump-lab" data-action="jump-stamina">Edit stamina code ↓</button>':''}</header><div class="lesson-grid"><details class="panel lesson-concept" ${(conceptExpanded.get(l.id)??window.matchMedia('(max-width:800px)').matches)?'open':''}><summary>${icon('book',18)} <span>What &amp; why</span> ${icon('down',16)}</summary><p class="preserve">${esc(l.concept)}</p><div class="analogy"><b>${icon('box',16)} In Blender terms</b><p>${esc(l.analogy)}</p></div>${l.guide?`<a class="lib-link" href="#/${l.guide}">Open the illustrated walkthrough →</a>`:''}<h3>Visual map</h3><div class="diagram">${l.diagram.map((d,j)=>`<div><span>${pad(j+1)}</span><code>${esc(d)}</code></div>`).join('')}</div>
  ${l.walkthrough?.length?`<h3>Read the code</h3><div class="trace">${l.walkthrough.map(w=>`<div><code>${readableCode(w.line)}</code><p>${esc(w.explanation)}</p></div>`).join('')}</div>`:''}
  ${l.files.length?`<h3>Source files</h3>${l.files.map(fileBlock).join('')}`:''}<h3>Troubleshooting</h3>${l.troubleshooting.map(t=>`<details class="trouble"><summary>${esc(t.symptom)}</summary><p>${esc(t.fix)}</p></details>`).join('')}</details>
  <section class="panel lab" tabindex="-1"><div class="panel-label">${icon('terminal')} HANDS-ON LAB</div><h2>Try it yourself</h2>${l.id.startsWith('pvp-') ? '<a class="lib-link" href="./downloads/battle-lab.zip" download>Download the playable Godot project ↓</a><a class="lib-link" href="#/lesson/duel-network">Play this match on two computers →</a>'+flowResearch() : ''}${directionWorkshop(l.id)}${i===5?'<button class="jump-lab" data-action="jump-style">Customize this screen ↓</button> ':''}${practice&&l.guide!=='own-project'?`<button class="jump-lab" data-action="jump-practice">${l.duelMode==='network'?'Trace one network input':l.duelMode?'Try the duel controls':i===5?'Jump to game menu':hasArena?'Jump to playable arena':'Jump to code editor'} ↓</button>`:''}${l.id==='editor-tour'?guideLink:['asset-import','animation-blend','projectiles-and-restart'].includes(l.id)?characterLink:''}<div class="step-list" aria-label="Exercise steps">${stepButtons}</div><div class="exercise"><div class="kicker">${quiz?'KNOWLEDGE CHECK':'STEP '+pad(l.steps.indexOf(step)+1)+' / '+pad(l.steps.length)}</div>${exercise}</div>${quiz?'':sourceReading(l.id)}${menuStyling(l.id)}${practice}${simulator(l.id)}<a class="lib-link" href="#/resources">${icon('folder',16)} Open resource library ${icon('right',14)}</a></section></div></div>
  <div class="lesson-footer"><a class="secondary" href="${ix?ref(lessons[ix-1]):'#/'}">${icon('back',14)} Previous</a><span>Lesson ${ix+1} of ${lessons.length}</span><button class="primary" data-action="finish" ${ready(l,answers)?'':'disabled'}>${done?'Continue':ix===lessons.length-1?'Complete lesson':'Mark complete & continue'} ${icon('arrow',15)}</button></div>`;
}
function resources(){
  return `<div class="page resource-page"><header class="page-title"><span class="kicker">WORKSPACE</span><h1>Resource library</h1><p>Everything you need to build and inspect the arena.</p>${guideLink} ${characterLink}</header><div class="downloads">${[['battle-lab.zip','Reference game','Unzip, then open project.godot in Godot 4.4.1. Press F6 on a practice scene or F5 for the full arena.','game'],['scout.glb','Animated scout','Drag this glTF binary into the FileSystem panel. It includes materials and the idle and walk clips.','box']].map(([file,title,desc,ic])=>`<article class="panel"><span class="resource-icon">${icon(ic,25)}</span><h2>${title}</h2><p>${desc}</p><a class="secondary" href="./downloads/${file}" download>${icon('download',16)} Download ${file.endsWith('zip')?'project':'asset'}</a></article>`).join('')}</div>${wordReference()}<div class="section-heading"><h2>Coding glossary</h2></div><div class="glossary">${glossary.map(([term,meaning])=>`<details class="trouble"><summary>${esc(term)}</summary><p>${esc(meaning)}</p></details>`).join('')}</div></div>`;
}
function complete(){
 const all=state.completed.length===lessons.length;
 const next=lessons.find(l=>!state.completed.includes(l.id))||lessons[0];
 return `<div class="page"><section class="panel finish"><span class="resource-icon">${icon('flag',28)}</span><div class="kicker">COURSE PROGRESS</div><h1>${all?'Arena complete!':'Your learning progress'}</h1><p>${state.completed.length} of ${lessons.length} lessons complete. ${all?'Run your arena, defeat the enemy, and restart for another round.':'Continue with your next unfinished lesson.'}</p>${progressBar(percent(),'Overall progress')}<a class="primary" href="${all?'#/resources':ref(next)}">${all?'Open project files':'Continue learning'} ${icon('arrow',15)}</a><a class="lib-link" href="#/">Back to dashboard</a></section></div>`;
}
let personalLink='';
let syncError='';
let connecting=false;
function devicePage(pairing){
  const last=lessons.find(l=>l.id===state.last);
  const step=last?.steps.find(s=>s.id===state.active[last.id]);
  const progress=last?last.title+' · '+(step?.title||(state.active[last.id]==='quiz'?'Knowledge check':last.steps[0].title)):'No lesson started in this browser.';
  return `<div class="page"><header class="page-title"><h1>${pairing?'Resume on this device':'Sync your progress'}</h1><p>Carry your last exercise step, completed lessons, quiz answers and saved practice code between devices.</p></header><section class="panel sync-panel"><h2>Your place in the course</h2><p>${esc(progress)}</p><p>${state.completed.length} of ${lessons.length} lessons complete</p><p role="status" data-sync-status>${esc(syncError||sync.status)}</p>
    ${pairing?`<button class="primary" data-action="pair" ${connecting?'disabled':''}>${connecting?'Connecting…':state.last&&!sync.paired?'Merge this browser’s progress and open':'Open my progress'}</button>`:`<button class="primary" data-action="sync-link" ${connecting?'disabled':''}>${connecting?'Connecting…':sync.paired?'Show my personal link':'Create my personal link'}</button>`}
    <p>Anyone with your personal link can view and update this progress. Keep it for your own devices.</p>
    ${personalLink&&!pairing?`<div class="sync-transfer"><div data-qr></div><div><h3>Continue on your phone</h3><p>Scan the QR code with your phone camera, or copy the link to yourself. Keep the same link for your next session.</p><label for="personal-link">Your personal link</label><input id="personal-link" readonly value="${esc(personalLink)}"><button class="secondary" data-action="copy-link">Copy link</button> <a class="primary" href="${esc(personalLink)}">Continue on the public site →</a></div></div>`:''}
    </section>${!pairing&&location.origin!==ORIGINAL?`<section class="panel sync-panel"><h2>Bring progress from the original site</h2><p>On the computer and browser where you studied, open the original site. Create your personal link there first, then open it on this device.</p><a class="secondary" href="${ORIGINAL}/#/devices">Open original progress →</a></section>`:''}</div>`;
}
async function pairDevice(join){
  if(connecting)return;
  connecting=true;syncError='';render();
  try{
    const token=join?location.hash.split('/')[2]:undefined;
    if(join&&!token)throw Error('This link is incomplete.');
    personalLink=await sync.connect(token);
    if(join && route().section==='pair'){
      history.replaceState(null,'',location.pathname+location.search+(state.last?'#/lesson/'+state.last:'#/'));
      skipVisit=true;
    }
  }catch(err){syncError=err instanceof TypeError?'Could not connect. Check your connection and retry.':err.message;}
  finally{connecting=false;render();skipVisit=false;}
}
let closeArena;
function render(){
 closeArena?.();
 const r=route(), key=r.lesson?.id||r.section;
 if(key!==routeKey){
   if(r.lesson){openModules.add(moduleIndex(r.lesson));if(!skipVisit){state.last=r.lesson.id;persist();}}
   drawer=false;window.scrollTo(0,0);
 }
 const changed=key!==routeKey;routeKey=key;
 document.title=(r.lesson?.title||({dashboard:'Dashboard',devices:'Sync progress',pair:'Resume on this device',resources:'Resource library',complete:'Course progress',setup:'First setup','own-project':'Use my project',character:'My Blender character',attack:'Attack animation',reactions:'Hit and death','enemy-attack':'Enemy weapon timing',roll:'Dodge roll',stamina:'Roll stamina','shared-budget':'Shared stamina'}[r.section]))+' · Battle Lab';
 app.innerHTML=sidebar(r)+`<button class="scrim ${drawer?'visible':''}" aria-label="Close menu" data-action="menu"></button><main id="content" tabindex="-1">${topbar(r)}${storageWorks?'':'<p class="storage-warning">Progress is available for this session only. Browser storage is unavailable.</p>'}${r.lesson?lessonScreen(r.lesson):['devices','pair'].includes(r.section)?devicePage(r.section==='pair'):r.section==='shared-budget'?sharedStaminaGuide():r.section==='stamina'?staminaGuide():r.section==='roll'?rollGuide():r.section==='enemy-attack'?enemyAttackGuide():r.section==='reactions'?reactionsGuide():r.section==='attack'?attackGuide():r.section==='character'?characterGuide():['setup','own-project'].includes(r.section)?setupGuide(r.section==='own-project'):r.section==='resources'?resources():r.section==='complete'?complete():dashboard()}</main>`;
 // A base URL keeps assets relative to the course root at the alternate entry.
 // Fragment links must stay on the document that owns this learning session.
 if(document.querySelector('base')){
   for(const link of document.querySelectorAll('a[href^="#"]'))link.href=location.pathname+location.search+link.getAttribute('href');
 }
 const wordResults=app.querySelector('[data-word-results]');
 if(wordResults)findWords(wordResults,'');
 for(const file of app.querySelectorAll('details[data-source]'))file.addEventListener('toggle',()=>{
   if(!file.open || file.dataset.annotated)return;
   const path=file.dataset.source;
   file.querySelector('pre code').innerHTML=readableCode(sources[path],!path.endsWith('.gd'));
   file.dataset.annotated='1';
 });
 const qr=app.querySelector('[data-qr]');
 if(qr)import('../vendor/qrcode.mjs').then(({default:make})=>{const code=make(0,'M');code.addData(personalLink);code.make();qr.innerHTML=code.createSvgTag({scalable:true,alt:'Scan your personal progress link'});});
 const tracked=lessons.find(l=>l.guide===r.section);
 if(tracked){const nav=app.querySelector('.guide-tabs');if(nav)nav.insertAdjacentHTML('afterbegin',`<a class="secondary" href="${ref(tracked)}">Open tracked lesson →</a>`);}
 const concept=app.querySelector('.lesson-concept');
 if(concept)concept.addEventListener('toggle',()=>conceptExpanded.set(r.lesson.id,concept.open));
 mountCodeLab(app);
 closeArena=mountDuelLab(app) || mountMenuPractice(app) || mountArena(app);
 if(r.lesson?.id==='shared-stamina')app.querySelector('[data-explain="attack-cost"]').open=true;
 if(r.lesson?.guide==='roll')app.querySelector('.roll-panel').open=true;
 bindComparison(app,directionLocations);
 refreshSim(app.querySelector('[data-sim]'));
 if(changed&&r.section!=='dashboard')document.querySelector('#content').focus({preventScroll:true});
}
function announce(msg){document.querySelector('#notice').textContent=msg;}
function updateAndFocus(selector){render();document.querySelector(selector)?.focus({preventScroll:true});}
app.addEventListener('click',async e=>{
 const b=e.target.closest('button,a');if(!b)return;
 const {lesson:l}=route();
 if(b.hasAttribute('data-enlarge')){
   const original=b.closest('figure').querySelector('img');
   const enlarged=photoViewer.querySelector('img');
   enlarged.onload=()=>enlarged.style.setProperty('--photo-ratio',enlarged.naturalWidth/enlarged.naturalHeight);
   enlarged.src=original.currentSrc||original.src;
   enlarged.alt=original.alt;
   photoViewer.showModal();
   return;
 }
 if(b.dataset.word){openWord(b.dataset.word);return;}
 if(b.dataset.action==='pair'||b.dataset.action==='sync-link'){await pairDevice(b.dataset.action==='pair');return;}
 if(b.dataset.action==='copy-link'){try{await navigator.clipboard.writeText(personalLink);b.textContent='Copied';}catch{document.querySelector('#personal-link').select();}return;}
 if(b.closest('[data-sim]')){refreshSim(b.closest('[data-sim]'),b);return;}
 if(b.dataset.module!==undefined){const i=Number(b.dataset.module);openModules.has(i)?openModules.delete(i):openModules.add(i);updateAndFocus('[data-module="'+i+'"]');return;}
 if(b.dataset.action==='menu'){drawer=!drawer;render();document.querySelector(drawer?'.drawer-close':'.menu').focus();return;}
 if(b.tagName==='A'&&drawer){drawer=false;if(b.hash===location.hash)render();}
 if(b.dataset.action==='jump-attack-cost'){app.querySelector('[data-tune="attack-cost"]')?.focus();return;}
 if(b.dataset.action==='jump-stamina'){app.querySelector('[data-tune="roll-cost"]')?.focus();return;}
 if(b.dataset.action==='jump-style'){const guide=app.querySelector('.menu-style-guide');guide.open=true;guide.querySelector('summary').focus();guide.scrollIntoView({block:'start'});return;}
 if(b.dataset.action==='jump-practice'){const practice=app.querySelector('.lab .code-lab');practice.tabIndex=-1;practice.focus({preventScroll:true});practice.scrollIntoView({block:'start'});return;}
 if(b.dataset.action==='jump'){const lab=app.querySelector('.lab');lab.focus({preventScroll:true});lab.scrollIntoView({block:'start'});return;}
 if(b.dataset.action==='preview'){
   preview.innerHTML=`<button class="icon-btn" aria-label="Close preview" autofocus>${icon('close')}</button><img src="./assets/art/gameplay.png" alt="Godot game screen showing the scout, sentinel, arena floor, and health display"><div><h2>The playable arena</h2><p>Captured in Godot 4.4.1. Move with WASD, fire with Space, roll with Shift, and press R after a round to restart.</p></div>`;preview.showModal();return;
 }
 if(b.dataset.copy){try{await navigator.clipboard.writeText(sources[b.dataset.copy]);b.textContent='Copied';announce('Copied '+b.dataset.copy);}catch{const pre=b.closest('.file').querySelector('pre');const range=document.createRange();range.selectNodeContents(pre);getSelection().removeAllRanges();getSelection().addRange(range);announce('Code selected. Use your keyboard copy shortcut.');}return;}
 if(!l)return;
 const a=state.responses[l.id] ||= {};
 if(b.dataset.step){state.active[l.id]=b.dataset.step;persist();updateAndFocus('[data-step="'+b.dataset.step+'"]');}
 if(b.dataset.action==='verify'){
   const idx=l.steps.findIndex(s=>s.id===(state.active[l.id]||l.steps[0].id));
   a[l.steps[idx].id]=true;state.active[l.id]=l.steps[idx+1]?.id||'quiz';persist();updateAndFocus('[data-step="'+state.active[l.id]+'"]');app.querySelector('.step-list').scrollIntoView({block:'start'});announce('Step verified');
 }
 if(b.dataset.answer!==undefined){
   if(state.completed.includes(l.id)&&Number(b.dataset.answer)!==l.answer){announce('You already completed this knowledge check.');return;}
   a.quiz=Number(b.dataset.answer);persist();updateAndFocus('[data-answer="'+a.quiz+'"]');
 }
 if(b.dataset.action==='finish'&&ready(l,a)){
   if(!state.completed.includes(l.id))state.completed.push(l.id);
   persist();const next=lessons[lessons.indexOf(l)+1];
   location.hash=state.completed.length===lessons.length?'#/complete':ref(next||lessons.find(x=>!state.completed.includes(x.id)));
 }
});
app.addEventListener('input',e=>{if(e.target.id==='find-word')findWords(app.querySelector('[data-word-results]'),e.target.value);else refreshSim(e.target.closest('[data-sim]'));});
photoViewer.addEventListener('click',e=>{
 if(e.target===photoViewer || e.target.closest('button'))photoViewer.close();
});
window.addEventListener('hashchange',()=>{if(photoViewer.open)photoViewer.close();});
preview.addEventListener('click',e=>{if(e.target===preview||e.target.closest('button'))preview.close();});
document.addEventListener('keydown',e=>{
 if(!drawer)return;
 if(e.key==='Escape'){drawer=false;updateAndFocus('.menu');}
 if(e.key==='Tab'){
   const nodes=[...document.querySelectorAll('#sidebar a,#sidebar button')].filter(n=>n.offsetWidth);
   if(e.shiftKey&&document.activeElement===nodes[0]){e.preventDefault();nodes.at(-1).focus();}
   if(!e.shiftKey&&document.activeElement===nodes.at(-1)){e.preventDefault();nodes[0].focus();}
 }
});
document.querySelector('.skip').addEventListener('click',e=>{e.preventDefault();document.querySelector('#content').focus();});
window.addEventListener('hashchange',()=>{render();if(route().section==='pair'&&(sync.paired||!state.last))pairDevice(true);});
window.addEventListener('storage',e=>{if(e.key===KEY){state=readProgress(e.newValue,lessons);render();}});
const initial=route();
skipVisit=sync.paired;
render();
skipVisit=false;
if(initial.section==='pair'){if(sync.paired||!state.last)pairDevice(true);}
else if(sync.paired){
  const previousLast=state.last;
  sync.refresh().then(ok=>{
    if(route().lesson!==initial.lesson || !initial.lesson)return;
    if(ok&&initial.lesson.id===previousLast&&state.last!==previousLast){location.replace(location.pathname+location.search+ref(lessons.find(l=>l.id===state.last)||initial.lesson));}
    else if(initial.lesson.id!==previousLast){state.last=initial.lesson.id;persist();}
  });
}
