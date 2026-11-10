import {setSceneProperty} from './direction-values.js';

const flatScene = 'scenes/hit_feedback.tscn';
const duelScene = 'scenes/duel_hit.tscn';
const matchScene = 'scenes/duel.tscn';
const rumbleFields = [
  {node:'HitRumble',property:'strength',label:'Rumble strength',min:0,max:1,step:0.05,initial:0.55},
  {node:'HitRumble',property:'duration',label:'Pulse duration (seconds)',min:0.05,max:1,step:0.01,initial:0.18}
];
const visualFields = [
  {node:'Burst', property:'amount', label:'Particle count', min:1, max:64, step:1, initial:12},
  {node:'Burst', property:'lifetime', label:'Particle lifetime (seconds)', min:0.1, max:1.5, step:0.05, initial:0.35},
  {node:'AnimationPlayer', property:'speed_scale', label:'Animation playback speed (×)', min:0.25, max:2, step:0.05, initial:1},
];
const storageKey = 'battle-lab.hit-feedback.v1';

export function effectsPreview(id) {
  const rumble=id==='duel-hit-rumble';
  const duel=id==='duel-hit-effects' || rumble;
  const scene=rumble?matchScene:duel?duelScene:flatScene;
  const fields=rumble?rumbleFields:visualFields;
  return `<details class="trouble effects-preview"><summary>${rumble?'Tune and download your vibration settings':'Preview and tune the hit in Godot'}</summary><div class="cue-tuner">
  <p>${rumble?'Set the values to use on your controller in the downloaded Godot project.':duel?'Replay a pulse hitting P2 in the actual duel scene.':'Run the preview and click the hexagon, then the empty floor.'} ${rumble?'Use the two-computer exercise to feel the difference.':'Change one setting and replay the hit.'}</p>
  ${fields.map(f=>`<label class="tuner-control">${f.label} <output></output><input type="range" data-effect="${f.property}" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.initial}"></label>`).join('')}
  ${rumble?'':'<div class="live-stage"></div><button type="button" class="secondary" data-effect-play>Run Godot preview</button>'}
  <p>In <code>res://${scene}</code>, select the node below to edit the same setting in the Inspector. ${rumble?'Open <code>scripts/hit_rumble.gd</code> to see how the selected device uses these values.':duel?'The confirmed target in <code>scripts/duel.gd</code> selects the pilot’s <code>HitFX</code>. Give both players the same tuned ZIP.':'The hit signal in <code>scripts/hit_feedback.gd</code> calls <code>_play_hit()</code> to restart the particles and play the animation.'}</p>
  <pre data-effect-source></pre>${duel?'<p>In Godot’s Script editor, use Go to Line (Ctrl+L or ⌘L) to follow one confirmed hit.</p><pre data-hit-code></pre>':''}<button type="button" class="primary" data-effect-download>Download my effects project ↓</button>
  <p>The ZIP includes this lesson and its screenshots in <code>MY-EFFECTS-LESSON.md</code>.</p><p role="status"></p></div></details>`;
}

export function mountEffectsPreview(app,lesson,sources) {
  const lab=app.querySelector('.effects-preview');
  if(!lab)return;
  const rumble=lesson.id==='duel-hit-rumble';
  const duel=lesson.id==='duel-hit-effects' || rumble;
  const fields=rumble?rumbleFields:visualFields;
  const kind=duel?'duel-hit':'hit-feedback';
  const scene=rumble?matchScene:duel?duelScene:flatScene;
  const main=duel?'scenes/duel.tscn':flatScene;
  const sliders=[...lab.querySelectorAll('input[type=range]')];
  let saved={};
  try { saved=JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  for(const slider of sliders){
    const value=saved[slider.dataset.effect];
    if(Number.isFinite(value))slider.value=String(value);
  }
  const settings=()=>Object.fromEntries(sliders.map(s=>[s.dataset.effect,s.valueAsNumber]));
  const makeScene=(files,values,path,properties=fields)=>{
    for(const f of properties)setSceneProperty(files,path,f.node,f.property,values[f.property]);
  };
  function display(){
    const values=settings();
    for(const slider of sliders)slider.parentElement.querySelector('output').textContent=slider.value;
    const files={[scene]:new TextEncoder().encode(sources[scene])};
    makeScene(files,values,scene);
    const lines=new TextDecoder().decode(files[scene]).split('\n');
    lab.querySelector('[data-effect-source]').textContent=fields.map(f=>{
      const node=lines.findIndex(line=>line.startsWith('[node name="'+f.node+'" '));
      const index=lines.findIndex((line,i)=>i>node && line.startsWith(f.property+' = '));
      return f.node+' · line '+(index+1)+' · '+lines[index];
    }).join('\n');
  }
  if(duel){
    const calls=rumble?[
      ['duel.gd','$HitRumble.play_hit(target, mode)'],
      ['hit_rumble.gd','Input.start_joy_vibration(device, strength, strength, duration)']
    ]:[
      ['duel.gd','_confirm_hit(target)'],
      ['duel_network.gd','hit_received.emit(target)'],
      ['duel.gd','pilots[target].get_node("HitFX").play_hit()'],
      ['duel_hit.gd','$Burst.restart(true)'],
      ['duel_hit.gd','$AnimationPlayer.play(&"hit_flash")'],
    ];
    lab.querySelector('[data-hit-code]').textContent=calls.map(([file,call])=>{
      const lines=sources['scripts/'+file].split('\n');
      return 'scripts/'+file+' · line '+(lines.findIndex(line=>line.trim()===call)+1)+'\n'+call;
    }).join('\n\n');
  }
  const play=lab.querySelector('[data-effect-play]');
  let frame;
  function preview(){
    if(!lab.isConnected || !lab.open)return;
    const request={kind,values:settings()};
    if(frame){
      frame.contentWindow?.configureDirection?.(request);
      return;
    }
    frame=document.createElement('iframe');
    frame.title='Godot hit feedback practice';
    frame.src='./assets/godot-preview/index.html#'+encodeURIComponent(JSON.stringify(request));
    frame.onload=()=>frame?.contentWindow?.configureDirection?.({kind,values:settings()});
    lab.querySelector('.live-stage').append(frame);
    play.textContent='Replay hit';
  }
  if(play)play.onclick=preview;
  let timer;
  lab.oninput=()=>{
    display();
    try { localStorage.setItem(storageKey,JSON.stringify({...saved,...settings()})); } catch {}
    clearTimeout(timer);
    if(play)timer=setTimeout(preview,120);
  };
  lab.ontoggle=()=>{
    if(!lab.open){
      clearTimeout(timer);
      frame?.remove();
      frame=null;
      if(play)play.textContent='Run Godot preview';
    }
  };
  const download=lab.querySelector('[data-effect-download]');
  const status=lab.querySelector('[role=status]');
  download.onclick=async()=>{
    const values=settings();
    download.disabled=true;
    status.textContent='Preparing your Godot project…';
    try{
      const [zip,response]=await Promise.all([import('../vendor/fflate.js'),fetch('./downloads/battle-lab.zip')]);
      if(!response.ok)throw Error();
      const files=zip.unzipSync(new Uint8Array(await response.arrayBuffer()));
      // Carry settings from the other effect lesson into the same playable duel.
      const allValues={...saved,...values};
      for(const f of [...visualFields,...rumbleFields]){
        const raw=allValues[f.property];
        allValues[f.property]=Number.isFinite(raw)?Math.min(f.max,Math.max(f.min,raw)):f.initial;
      }
      for(const path of [flatScene,duelScene])makeScene(files,allValues,path,visualFields);
      makeScene(files,allValues,matchScene,rumbleFields);
      const guide=['# '+lesson.title,'Open '+main+'. Press F6 to run and F8 to stop. Edit '+scene+' for these settings.',
        ...fields.map(f=>'- '+f.node+' → '+f.property+' = '+values[f.property])];
      for(const step of lesson.steps){
        guide.push('## '+step.title,...step.directions,'Check: '+step.expected, '!['+step.caption+'](workshop-images/'+step.image.split('/').pop()+'.webp)');
      }
      await Promise.all([...new Set(lesson.steps.map(step=>step.image))].map(async image=>{
        const response=await fetch('./assets/'+image+'.webp');
        if(!response.ok)throw Error();
        files['workshop-images/'+image.split('/').pop()+'.webp']=new Uint8Array(await response.arrayBuffer());
      }));
      files['workshop-images/.gdignore']=new Uint8Array();
      files['MY-EFFECTS-LESSON.md']=zip.strToU8(guide.join('\n\n'));
      const config=zip.strFromU8(files['project.godot']).replace(/^run\/main_scene=.*$/m,'run/main_scene="res://'+main+'"');
      files['project.godot']=zip.strToU8(config);
      const link=document.createElement('a');
      link.href=URL.createObjectURL(new Blob([zip.zipSync(files)],{type:'application/zip'}));
      link.download=rumble?'battle-lab-hit-rumble.zip':duel?'battle-lab-duel-hit.zip':'battle-lab-hit-feedback.zip';
      link.click();
      setTimeout(()=>URL.revokeObjectURL(link.href),1000);
      status.textContent='Extract the ZIP, import project.godot, then press F5 to play your settings.';
    }catch{status.textContent='Could not prepare the project. Try downloading again.';}
    finally{download.disabled=false;}
  };
  display();
}
