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

const tryInEditor = {
  camera:'Walk to each edge with WASD. In arena.tscn select Camera3D and edit Size to reframe the floor.',
  guard:'Press R to start the strike, then G near the end of the bar. Open practice/guard.gd and find the guard_window comparison.',
  audio:'Press R, then G just before impact. Select GuardSound in guard.tscn to adjust Volume dB, or open guard.gd to follow the success signal.',
  message:'Press R and let a strike finish. Time how long the result remains. In practice/guard.gd follow result_left as it counts down.',
  blend:'Tap W and release. Open stages/animated_player.gd and follow move_toward into the AnimationTree blend position.',
  impact:'Face the enemy and fire with Space. Open scripts/impact.gd and find the scale tween that uses expansion_seconds.',
  attack:'Tap Space and watch when the pulse leaves the hand. Open scripts/player.gd to see where elapsed reaches attack_release_seconds.',
  contact:'Let the sentinel approach, then step across its blade. Open scripts/enemy.gd and follow the contact time into the reach check.',
  reaction:'Shoot the enemy until its HP reaches zero. In scripts/reactions.gd find fall_speed and follow elapsed into the death clip.',
  outline:'Press Shift repeatedly to spend stamina. Read the denial caption under HUD → Stamina → Caption in arena.tscn.',
  sparks:'Watch the upper-right corner of the lobby. Open scenes/menu_art.tscn and change Amount on SparksAnchor → Sparks.',
  ring:'Choose Local PvP, face P2 and fire with Space. Open scripts/duel.gd and follow the HP change into the ring tween.',
  network:'Choose Network PvP. Host in one copy and join from another. Open scripts/duel.gd and follow apply_snapshot into _draw_round.'
};
export function tuner(kind) {
  const key=keyFor(kind);
  const [label,unit,min,max,step,,scene,node,property,start]=parameters[key];
  const value=readValues()[key];
  return `<section class="cue-tuner" data-cue-kind="${kind}"><h4>Tune in Godot</h4>
    <label class="tuner-control">${esc(label)} <output data-live-value>${value} ${esc(unit)}</output>
    <input type="range" data-live-range min="${min}" max="${max}" step="${step}" value="${value}"></label>
    <p class="tuner-path">res://${scene}.tscn → ${node} <code data-live-property>${property} = ${value}</code></p>
    <div class="live-stage"></div>
    <button type="button" class="secondary" data-live-run>${kind==='audio'?'Play guard sound':'Run live Godot preview'}</button>
    <button type="button" class="primary" data-live-export>Download my Godot project ↓</button>
    <p role="status" data-live-status></p><p>Unzip, import <code>project.godot</code> in Godot 4.4.1, then press F5 for <code>${start}.tscn</code>. ${esc(tryInEditor[kind])}</p><p>The project includes your settings from every direction workshop.</p>
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

async function exportProject(settings,kind) {
  const [zip,response]=await Promise.all([import('../vendor/fflate.js'),fetch('./downloads/direction-project.zip')]);
  if(!response.ok)throw Error('The project could not be loaded. Try again.');
  const files=zip.unzipSync(new Uint8Array(await response.arrayBuffer()));
  tuneProject(files,settings,kind);
  const link=document.createElement('a');
  link.href=URL.createObjectURL(new Blob([zip.zipSync(files)],{type:'application/zip'}));
  link.download='battle-lab-my-direction.zip';
  link.click();
  setTimeout(()=>URL.revokeObjectURL(link.href),1000);
}

export function bindTuner(container) {
  const panel=container.querySelector('[data-cue-kind]');
  if(!panel)return;
  const {cueKind:kind}=panel.dataset, key=keyFor(kind);
  const [,unit,,,,,,,property]=parameters[key];
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
    panel.querySelector('[data-live-property]').textContent=property+' = '+values[key];
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
    try { await exportProject({...readValues()},kind);status.textContent='Project ready. Open project.godot in the extracted folder.'; }
    catch(error){status.textContent=error.message;}
    finally{download.disabled=false;}
  };
}
