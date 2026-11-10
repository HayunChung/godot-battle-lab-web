import {lessonRecord,sourceView,editorSteps,portableLesson} from './direction-editor.js';
import {parameters,normalizeValues,tuneProject} from './direction-values.js';
import {esc} from './ui.js';

const storageKey='battle-lab.direction-values.v1';
let values=normalizeValues({});
function readValues() {
  try {
    const saved=localStorage.getItem(storageKey);
    if(saved)values=normalizeValues(JSON.parse(saved));
  } catch { /* Keep the in-memory choices when browser storage is unavailable. */ }
  return values;
}
const keyFor=kind=>kind==='network'?'ring':kind;

export function tuner(kind) {
  const key=keyFor(kind);
  const [label,unit,min,max,step]=parameters[key];
  const value=readValues()[key];
  return `<section class="cue-tuner" data-cue-kind="${kind}"><h4>Tune in Godot</h4>
    <label class="tuner-control">${esc(label)} <output data-live-value>${value} ${esc(unit)}</output>
    <input type="range" data-live-range min="${min}" max="${max}" step="${step}" value="${value}"></label>
    <div class="live-stage"></div>
    <button type="button" class="secondary" data-live-run>${kind==='audio'?'Play guard sound':'Run live Godot preview'}</button>
    <div class="tuner-source"></div>
    <button type="button" class="primary" data-live-export>Download my Godot project ↓</button>
    <p role="status" data-live-status></p><div class="tuner-exercise"></div><p>The ZIP includes every workshop’s settings and a copy of this exercise in <code>MY-WORKSHOP.md</code>.</p>
  </section>`;
}

let audioContext, sample;
async function playCue(db) {
  audioContext ??= new AudioContext();
  await audioContext.resume();
  if(!sample) {
    const response=await fetch('./assets/direction/guard-cue.wav');
    if(!response.ok)throw Error('The guard sound could not be loaded.');
    sample=await audioContext.decodeAudioData(await response.arrayBuffer());
  }
  const voice=audioContext.createBufferSource(), gain=audioContext.createGain();
  voice.buffer=sample;
  gain.gain.value=10**(db/20);
  voice.connect(gain).connect(audioContext.destination);
  voice.start();
}

async function exportProject(settings,kind,source) {
  const [zip,response]=await Promise.all([import('../vendor/fflate.js'),fetch('./downloads/direction-project.zip')]);
  if(!response.ok)throw Error('The project could not be loaded. Try again.');
  const files=zip.unzipSync(new Uint8Array(await response.arrayBuffer()));
  tuneProject(files,settings,kind);
  files['MY-WORKSHOP.md']=zip.strToU8(portableLesson(lessonRecord(kind,settings[keyFor(kind)],source)));
  const link=document.createElement('a');
  link.href=URL.createObjectURL(new Blob([zip.zipSync(files)],{type:'application/zip'}));
  link.download='battle-lab-my-direction.zip';
  link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

export function bindTuner(container,locations) {
  const panel=container.querySelector('[data-cue-kind]');
  if(!panel)return;
  const {cueKind:kind}=panel.dataset, key=keyFor(kind);
  const [,unit]=parameters[key];
  const source=locations[kind];
  function updateLesson(value){
    const record=lessonRecord(kind,value,source);
    panel.querySelector('.tuner-source').innerHTML=sourceView(record);
    panel.querySelector('.tuner-exercise').innerHTML=editorSteps(record);
  }
  updateLesson(values[key]);
  const slider=panel.querySelector('[data-live-range]');
  const run=panel.querySelector('[data-live-run]'), status=panel.querySelector('[data-live-status]');
  let frame=null, revisionTimer;
  function preview() {
    if(!panel.isConnected || !panel.closest('details').open)return;
    if(kind==='audio'){
      playCue(values.audio).catch(()=>{status.textContent='Audio playback is unavailable in this browser.';});
      return;
    }
    const request={kind,values:{...values}};
    if(!frame){
      frame=document.createElement('iframe');
      frame.title='Live Godot preview · '+parameters[key][0];
      frame.src='./assets/godot-preview/index.html#'+encodeURIComponent(JSON.stringify(request));
      frame.onload=()=>frame?.contentWindow?.configureDirection?.({kind,values:{...values}});
      panel.querySelector('.live-stage').append(frame);
      run.textContent='Replay preview';
    } else frame.contentWindow?.configureDirection?.(request);
  }
  slider.oninput=()=>{
    readValues();
    values[key]=slider.valueAsNumber;
    try{localStorage.setItem(storageKey,JSON.stringify(values));}catch{}
    panel.querySelector('[data-live-value]').textContent=values[key]+' '+unit;
    updateLesson(values[key]);
    status.textContent='';
    clearTimeout(revisionTimer);
    revisionTimer=setTimeout(preview,100);
  };
  run.onclick=preview;
  const workshop=panel.closest('details');
  workshop.addEventListener('toggle',()=>{
    if(!workshop.open && frame){frame.remove();frame=null;run.textContent='Run live Godot preview';}
  });
  const download=panel.querySelector('[data-live-export]');
  download.onclick=async()=>{
    download.disabled=true;
    status.textContent='Preparing project…';
    try { await exportProject({...readValues(),[key]:slider.valueAsNumber},kind,source);status.textContent='Project ready. Open project.godot in the extracted folder.'; }
    catch(error){status.textContent=error.message;}
    finally{download.disabled=false;}
  };
}
