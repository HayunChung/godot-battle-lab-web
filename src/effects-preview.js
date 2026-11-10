import {setSceneProperty} from './direction-values.js';

const scene = 'scenes/hit_feedback.tscn';
const fields = [
  {node:'Burst', property:'amount', label:'Particle count', min:1, max:64, step:1, initial:12},
  {node:'Burst', property:'lifetime', label:'Particle lifetime (seconds)', min:0.1, max:1.5, step:0.05, initial:0.35},
  {node:'AnimationPlayer', property:'speed_scale', label:'Animation playback speed (×)', min:0.25, max:2, step:0.05, initial:1},
];
const storageKey = 'battle-lab.hit-feedback.v1';

export function effectsPreview() {
  return `<details class="trouble effects-preview"><summary>Preview and tune the hit in Godot</summary><div class="cue-tuner">
  <p>Run the preview and click the hexagon, then the empty floor. Change one setting and replay the hit.</p>
  ${fields.map(f=>`<label class="tuner-control">${f.label} <output></output><input type="range" data-effect="${f.property}" min="${f.min}" max="${f.max}" step="${f.step}" value="${f.initial}"></label>`).join('')}
  <div class="live-stage"></div><button type="button" class="secondary" data-effect-play>Run Godot preview</button>
  <p>In <code>res://${scene}</code>, select the node below to edit the same setting in the Inspector. The hit signal in <code>scripts/hit_feedback.gd</code> calls <code>_play_hit()</code> to restart the particles and play the animation.</p>
  <pre data-effect-source></pre><button type="button" class="primary" data-effect-download>Download my effects project ↓</button>
  <p>The ZIP includes this lesson and its screenshots in <code>MY-EFFECTS-LESSON.md</code>.</p><p role="status"></p></div></details>`;
}

export function mountEffectsPreview(app,lesson,sources) {
  const lab=app.querySelector('.effects-preview');
  if(!lab)return;
  const sliders=[...lab.querySelectorAll('input[type=range]')];
  let saved={};
  try { saved=JSON.parse(localStorage.getItem(storageKey)) || {}; } catch {}
  for(const slider of sliders){
    const value=saved[slider.dataset.effect];
    if(Number.isFinite(value))slider.value=String(value);
  }
  const settings=()=>Object.fromEntries(sliders.map(s=>[s.dataset.effect,s.valueAsNumber]));
  const makeScene=(files,values)=>{
    for(const f of fields)setSceneProperty(files,scene,f.node,f.property,values[f.property]);
  };
  function display(){
    const values=settings();
    for(const slider of sliders)slider.parentElement.querySelector('output').textContent=slider.value;
    const files={[scene]:new TextEncoder().encode(sources[scene])};
    makeScene(files,values);
    const lines=new TextDecoder().decode(files[scene]).split('\n');
    lab.querySelector('[data-effect-source]').textContent=fields.map(f=>{
      const node=lines.findIndex(line=>line.startsWith('[node name="'+f.node+'" '));
      const index=lines.findIndex((line,i)=>i>node && line.startsWith(f.property+' = '));
      return f.node+' · line '+(index+1)+' · '+lines[index];
    }).join('\n');
  }
  const play=lab.querySelector('[data-effect-play]');
  let frame;
  function preview(){
    if(!lab.isConnected || !lab.open)return;
    const request={kind:'hit-feedback',values:settings()};
    if(frame){
      frame.contentWindow?.configureDirection?.(request);
      return;
    }
    frame=document.createElement('iframe');
    frame.title='Godot hit feedback practice';
    frame.src='./assets/godot-preview/index.html#'+encodeURIComponent(JSON.stringify(request));
    frame.onload=()=>frame?.contentWindow?.configureDirection?.({kind:'hit-feedback',values:settings()});
    lab.querySelector('.live-stage').append(frame);
    play.textContent='Replay hit';
  }
  play.onclick=preview;
  let timer;
  lab.oninput=()=>{
    display();
    try { localStorage.setItem(storageKey,JSON.stringify(settings())); } catch {}
    clearTimeout(timer);
    timer=setTimeout(preview,120);
  };
  lab.ontoggle=()=>{
    if(!lab.open){
      clearTimeout(timer);
      frame?.remove();
      frame=null;
      play.textContent='Run Godot preview';
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
      makeScene(files,values);
      const guide=['# '+lesson.title,'Open scenes/hit_feedback.tscn. Press F6 to run and F8 to stop.',
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
      const config=zip.strFromU8(files['project.godot']).replace(/^run\/main_scene=.*$/m,'run/main_scene="res://'+scene+'"');
      files['project.godot']=zip.strToU8(config);
      const link=document.createElement('a');
      link.href=URL.createObjectURL(new Blob([zip.zipSync(files)],{type:'application/zip'}));
      link.download='battle-lab-hit-feedback.zip';
      link.click();
      setTimeout(()=>URL.revokeObjectURL(link.href),1000);
      status.textContent='Extract the ZIP, import project.godot, then press F5 to play your settings.';
    }catch{status.textContent='Could not prepare the project. Try downloading again.';}
    finally{download.disabled=false;}
  };
  display();
}
