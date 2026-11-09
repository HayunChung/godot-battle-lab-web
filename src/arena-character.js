import {readGlb} from './character-file.js';
import {esc} from './ui.js';

const remembered=new Map();
const fallbackDurations={hit:.35,death:.9};
const optionalNames={attack:/attack|shoot|fire/i,hit:/hit|hurt|flinch|stagger/i,death:/death|die|dead|collapse|fall/i,roll:/roll|dodge|evade|somersault/i};

function dataName(role,key){
  return 'data-'+(role==='enemy'?'enemy-':'')+key;
}
function actorName(role,key){
  return 'data-'+(role==='enemy'?'enemy':'hero')+'-'+key;
}
export function characterControls(role='player'){
  const enemy=role==='enemy',prefix=enemy?'Enemy ':'',attr=key=>actorName(role,key);
  const slotLabel=slot=>slot[0].toUpperCase()+slot.slice(1)+' clip';
  const animationSelect=(slot,optional=false)=>{
    const attrName=optional?dataName(role,slot+'-clip'):dataName(role,'clip')+'="'+slot+'"';
    return `<label>${enemy?'Enemy '+slot+' clip':slotLabel(slot)}${optional?' (optional)':''}<select ${attrName}></select></label>`;
  };
  const attack=enemy?`${animationSelect('attack',true)}<div data-enemy-contact-controls hidden><label>Contact point in the attack<input type="range" min="0" max="1" step="0.001" value="0.5" data-enemy-contact></label><output data-enemy-contact-time></output><button type="button" class="secondary" data-enemy-pose>Show contact pose</button><p>Scrub until the striking limb reaches its target. Damage is checked once at that pose.</p></div><a class="lib-link" href="#/enemy-attack">Enemy attack timing guide →</a>`:`${animationSelect('attack',true)}<div data-release-controls hidden><label>Release time (seconds)<input type="range" min="0" step="0.001" data-release></label><output data-release-time></output><button type="button" class="secondary" data-pose>Show release pose</button></div><a class="lib-link" href="#/attack">Attack animation screenshot guide →</a>`;
  return `<details class="${enemy?'enemy-controls':'hero-controls'}" data-character-role="${role}"><summary>${enemy?'Use a Blender enemy':'Use my Blender character'}</summary><p>Choose a local GLB with idle and walk clips. Hook up optional attack, hit, ${enemy?'and death':'death, and roll'} clips for this ${enemy?'enemy':'player'}. Your tuned kit includes the selected model.</p><a class="lib-link" href="#/character">Blender-to-arena screenshot guide →</a>
  <label>${enemy?'Enemy GLB':'Character GLB'}<input type="file" accept=".glb,model/gltf-binary" ${attr('file')}></label><button class="secondary" ${attr('demo')}>Try the example ${enemy?'enemy':'character'}</button>
  <div ${attr('picker')} hidden><div class="hero-thumbnail" ${dataName(role,'model-view')}></div>${animationSelect('idle')}${animationSelect('walk')}${attack}${animationSelect('hit',true)}${animationSelect('death',true)}${enemy?'':animationSelect('roll',true)}<label>${prefix}Facing correction<select ${attr('turn')}><option value="0">0°</option><option value="90">90°</option><option value="180">180°</option><option value="270">270°</option></select></label><button class="secondary" ${attr('reset')}>Restore ${enemy?'sentinel':'scout'}</button></div><p ${attr('status')} role="status"></p></details>`;
}

export function mountCharacter(el,redraw,pause,role='player'){
  const enemy=role==='enemy',panel=el.querySelector('[data-character-role="'+role+'"]');
  const actorField=key=>panel.querySelector('['+actorName(role,key)+']');
  const picker=actorField('picker'),status=actorField('status'),file=actorField('file');
  const slots=['idle','walk','attack','hit','death'];
  if(!enemy)slots.push('roll');
  const optional=slots.slice(2);
  const selects={};
  for(const slot of slots){
    const name=optional.includes(slot)?dataName(role,slot+'-clip'):dataName(role,'clip')+'="'+slot+'"';
    selects[slot]=picker.querySelector('['+name+']');
  }
  const slider=picker.querySelector(enemy?'[data-enemy-contact]':'[data-release]'),turn=actorField('turn');
  const thumbnail=picker.querySelector('['+dataName(role,'model-view')+']');
  let view,model,revision=0;
  function sync(){
    for(const slot of slots){
      const select=selects[slot];
      if(optional.includes(slot)){
        for(const option of select.options){
          const index=Number(option.value);
          option.disabled=index>=0&&slots.some(other=>other!==slot&&model[other]===index);
        }
      }
      select.value=model[slot];
    }
    model.timing=null;
    const enabled=model.attack>=0;
    picker.querySelector(enemy?'[data-enemy-contact-controls]':'[data-release-controls]').hidden=!enabled;
    if(!enabled)return;
    const duration=view.durations[model.attack];
    if(enemy){
      const contact=duration*model.contact;
      const blade=view.bladeAt(model.attack,contact,model.turn*Math.PI/180);
      model.timing={duration,contact,blade};slider.value=model.contact;
      picker.querySelector('[data-enemy-contact-time]').textContent=Math.round(model.contact*100)+'% · '+contact.toFixed(3)+' s / '+duration.toFixed(3)+' s';
      return;
    }
    model.release=Math.max(0,Math.min(model.release,duration));
    model.timing={duration,release:model.release};
    slider.max=duration;slider.value=model.release;
    picker.querySelector('[data-release-time]').textContent=model.release.toFixed(3)+' s / '+duration.toFixed(3)+' s';
  }
  function reset(){
    pause();revision++;delete status.dataset.busy;view?.dispose();view=null;model=null;remembered.delete(role);
    thumbnail.replaceChildren();picker.hidden=true;file.value='';status.textContent=enemy?'Sentinel restored.':'Scout restored.';redraw();
  }
  async function load(getBytes,name,previous){
    pause();const ticket=++revision;status.dataset.busy='true';status.textContent='Opening '+name+'…';
    try{
      const bytes=await getBytes();
      const {json}=readGlb(bytes),clips=json.animations.map((a,i)=>a.name||'Clip '+(i+1));
      const {openCharacter}=await import('../vendor/character-renderer.js');
      if(ticket!==revision)return;
      const fresh=await openCharacter(bytes,{frameScale:enemy?2:1});
      if(ticket!==revision){fresh.dispose();return;}
      const idle=previous?.idle??Math.max(0,clips.findIndex(n=>/idle/i.test(n)));
      const walkMatch=clips.findIndex((n,i)=>i!==idle&&/walk/i.test(n));
      const walk=previous?.walk??(walkMatch>=0?walkMatch:clips.findIndex((_,i)=>i!==idle));
      view?.dispose();view=fresh;
      thumbnail.replaceChildren(view.image);view.image.setAttribute('aria-label','Selected '+role+' preview');
      model={bytes,name,idle,walk,attack:-1,hit:-1,death:-1,roll:-1,release:0,contact:previous?.contact??.5,turn:previous?.turn??0,scale:view.scale,offset:view.offset};
      const used=new Set([idle,walk]);
      for(const slot of optional){
        const index=previous?.[slot]??clips.findIndex((n,i)=>!used.has(i)&&view.durations[i]>0&&optionalNames[slot].test(n));
        model[slot]=index;if(index>=0)used.add(index);
      }
      if(!enemy&&model.attack>=0)model.release=previous?.release??view.durations[model.attack]/3;
      remembered.set(role,model);picker.hidden=false;
      for(const slot of slots){
        const extra=optional.includes(slot);
        const options=clips.map((n,i)=>extra&&view.durations[i]<=0?'':`<option value="${i}">${esc(n)}</option>`).join('');
        selects[slot].innerHTML=(extra?'<option value="-1">'+(slot==='attack'?(enemy?'Use built-in strike':'None · instant shot'):slot==='roll'?'Use built-in tumble':'Use built-in reaction')+'</option>':'')+options;
      }
      sync();turn.value=model.turn;
      status.textContent=name+' is ready. '+(enemy?'Practice a swing to test the attack. Land a shot to see the hit reaction.':'Start battle and use WASD to switch from idle to walk.');
      redraw();
    }catch(e){
      if(ticket===revision){status.textContent=e.message+' Current character: '+(model?.name||(enemy?'sentinel':'scout'))+'.';file.value='';}
    }finally{if(ticket===revision)delete status.dataset.busy;}
  }
  file.addEventListener('change',()=>{
    const f=file.files[0];if(!f)return;
    if(f.size>64*1024*1024){status.textContent='Use a game-ready GLB smaller than 64 MB.';return;}
    load(()=>f.arrayBuffer(),f.name);
  });
  actorField('demo').addEventListener('click',()=>load(async()=>{
    const r=await fetch(enemy?'./assets/reactions-guide/enemy.glb':'./assets/character-guide/hero.glb');
    if(!r.ok)throw Error('Could not open the example GLB.');return r.arrayBuffer();
  },enemy?'Example enemy':'Example hero'));
  function previewStrike(){
    if(!model||model.attack<0)return;
    pause();
    view.draw(model.attack,Math.PI*.8+model.turn*Math.PI/180,0,enemy?model.timing.contact:model.release);
    picker.dataset.playing=enemy?'contact-preview':'release-preview';
  }
  picker.querySelector(enemy?'[data-enemy-pose]':'[data-pose]').addEventListener('click',previewStrike);
  slider.addEventListener('input',()=>{
    if(!model||model.attack<0)return;
    if(enemy)model.contact=slider.valueAsNumber;
    else model.release=slider.valueAsNumber;
    sync();previewStrike();
  });
  picker.addEventListener('change',e=>{
    if(!model||e.target===slider)return;
    pause();
    const slot=slots.find(key=>selects[key]===e.target);
    if(slot){
      const value=Number(e.target.value);
      if(slot==='idle'||slot==='walk'){
        const other=slot==='idle'?'walk':'idle';
        if(value===model[other])model[other]=model[slot];
        for(const key of optional)if(model[key]===value)model[key]=-1;
      }
      model[slot]=value;
      if(slot==='attack'&&value>=0){
        if(enemy)model.contact=.5;
        else model.release=view.durations[value]/3;
      }
    }else if(e.target===turn)model.turn=Number(turn.value);
    sync();redraw();
  });
  actorField('reset').addEventListener('click',reset);
  const previous=remembered.get(role);
  if(previous)load(()=>previous.bytes,previous.name,previous);
  return {
    get loading(){return status.dataset.busy==='true';},
    get model(){return model;},
    get attack(){return model?.timing;},
    get rollDuration(){return view?.durations[model?.roll]||.75;},
    get reactionDurations(){return model?{hit:view.durations[model.hit]||fallbackDurations.hit,death:view.durations[model.death]||fallbackDurations.death}:fallbackDurations;},
    draw(ctx,g,walking,dt){
      if(!view)return false;
      const swing=enemy?g.enemySwing:null;
      const roll=!enemy&&!g.playerReaction&&!g.outcome?g.roll:null;
      const dx=enemy?(swing?.dx??g.x-g.ex):(roll?.dx??g.dx);
      const dz=enemy?(swing?.dz??g.z-g.ez):(roll?.dz??g.dz);
      const yaw=Math.atan2(-dx,-dz)+model.turn*Math.PI/180;
      const reaction=enemy?g.enemyReaction:g.playerReaction;
      const attackTime=enemy?swing?.time:g.attackTime;
      const attacking=model.attack>=0&&attackTime!=null&&!g.outcome;
      const state=reaction?.kind||(roll?'roll':attacking?'attack':walking?'walk':'idle');
      if(roll){
        const fraction=Math.max(0,Math.min(1,roll.time/roll.duration));
        if(model.roll>=0)view.draw(model.roll,yaw,0,fraction*view.durations[model.roll]);
        else view.drawTumble(model.idle,Math.atan2(-dx,-dz),model.turn*Math.PI/180,fraction);
      }else if(reaction&&model[state]<0){
        const progress=Math.min(1,Math.max(0,reaction.time/fallbackDurations[state]));
        const tilt=state==='death'?1.49*progress:0.43*Math.sin(Math.PI*progress);
        view.draw(model.idle,yaw,0,0,tilt,state==='death'?progress:0);
      }else if(swing&&model.attack<0&&!reaction&&!g.outcome){
        const lean=Math.sin(Math.PI*Math.min(1,swing.time/swing.duration));
        view.draw(model.idle,yaw,0,0,-.32*lean);
      }else{
        const time=reaction?Math.min(view.durations[model[state]],reaction.time):attacking?attackTime:null;
        const fall=state==='death'?time/view.durations[model.death]:0;
        view.draw(model[state],yaw,dt,time,0,fall);
      }
      picker.dataset.playing=swing&&!reaction&&!g.outcome?'attack':state;
      const size=62*view.frameScale;
      ctx.drawImage(view.image,320+33*(enemy?g.ex:g.x)-size/2,207+28*(enemy?g.ez:g.z)-size/2,size,size);
      return true;
    },
    dispose(){revision++;view?.dispose();}
  };
}
