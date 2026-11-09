import {characterControls,mountCharacter} from './arena-character.js';
import {draft,saveDraft,explainPanel,lineNotes} from './code-lab.js';
import {downloadKit} from './project-kit.js';
import {runChallenge} from './gd-practice.js';
import {esc} from './ui.js';

const movement='wasd-movement', combat='health-and-pursuit';
const tuningLabels=['Move speed','Attack power','Roll cost','Stamina recovery','Attack stamina cost'];
const staminaDefaults={cost:40,regen:20,attackCost:15};
const keysUsed=new Set(['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft','ShiftRight']);
const rollDefaults={start:4/18,end:12/18,duration:.75};
const rollKey='battle-lab.roll-window.v1';
export function protectedRoll(roll){
  return Boolean(roll&&roll.time+1e-9>=roll.start*roll.duration&&roll.time+1e-9<roll.end*roll.duration);
}
const clamp=(v,limit)=>Math.max(-limit,Math.min(limit,v));

export function newRound(){
  return {stamina:100,rest:0,denied:null,shotsFired:0,x:0,z:2.8,ex:0,ez:-3,hp:3,enemyHP:3,dx:0,dz:-1,shots:[],roll:null,rollTap:false,fireTap:false,attackTime:null,attackReleased:false,reload:0,enemySwing:null,lastStrike:'',flash:0,outcome:'',playerReaction:null,enemyReaction:null};
}
const fallbackTiming={hit:.35,death:.9};
export function takeHit(g,actor,amount,timing=fallbackTiming){
  if(g.outcome||amount<=0||(actor==='player'&&protectedRoll(g.roll)))return;
  const hp=actor==='player'?'hp':'enemyHP';
  g[hp]=Math.max(0,g[hp]-amount);
  const kind=g[hp]===0?'death':'hit';
  g[actor+'Reaction']={kind,time:0,duration:timing[kind]};
  if(actor==='player'||kind==='death'){g.roll=null;g.rollTap=false;}
  if(actor==='player'){g.attackTime=null;g.attackReleased=false;g.fireTap=false;}
  if(actor==='enemy'||kind==='death')g.enemySwing=null;
  if(kind==='death'){g.outcome=actor==='player'?'Defeat':'Victory';g.shots=[];g.walking=g.enemyWalking=false;}
}
function advanceReactions(g,dt){
  for(const key of ['playerReaction','enemyReaction']){
    const r=g[key];if(!r)continue;
    r.time=Math.min(r.duration,r.time+dt);
    if(r.kind==='hit'&&r.time>=r.duration)g[key]=null;
  }
}
function poseFinished(g){
  return [g.playerReaction,g.enemyReaction].every(r=>!r||(r.kind==='death'&&r.time>=r.duration));
}
// Weapon coordinates at the contact key: right and forward from the enemy.
const fallbackBlade={baseRight:0,baseForward:.35,tipRight:0,tipForward:1.55};
const bladeRadius=.12;
const playerRadius=.37;
function bladeSegment(g,s){
  const weapon=s.blade||fallbackBlade;
  const point=(right,forward)=>[g.ex+s.dx*forward-s.dz*right,g.ez+s.dz*forward+s.dx*right];
  return [point(weapon.baseRight,weapon.baseForward),point(weapon.tipRight,weapon.tipForward)];
}
function bladeTouchesPlayer(g,s){
  const [[ax,az],[bx,bz]]=bladeSegment(g,s);
  const vx=bx-ax,vz=bz-az;
  const lengthSquared=vx*vx+vz*vz;
  const t=lengthSquared?Math.max(0,Math.min(1,((g.x-ax)*vx+(g.z-az)*vz)/lengthSquared)):0;
  return Math.hypot(g.x-(ax+t*vx),g.z-(az+t*vz))<=bladeRadius+playerRadius;
}
function advanceEnemy(g,dt,timings){
  g.enemyWalking=false;
  if(g.enemyReaction)return;
  if(!g.enemySwing){
    const x=g.x-g.ex,z=g.z-g.ez,distance=Math.hypot(x,z);
    const blade=timings.swing?.blade;
    const reach=blade?Math.min(1.6,Math.max(.4,Math.max(blade.baseForward,blade.tipForward)+.25)):1.6;
    if(distance>reach){
      const step=Math.min(distance-reach,1.35*dt);
      g.ex+=step*x/distance;g.ez+=step*z/distance;
      g.enemyWalking=true;
      if(distance-step>reach+.000001)return;
    }
    const {duration,contact}=timings.swing||{duration:1,contact:.5};
    g.enemySwing={dx:distance?x/distance:0,dz:distance?z/distance:1,time:0,duration,contact,blade,checked:false};
    g.enemyWalking=false;
  }
  const s=g.enemySwing;
  s.time=Math.min(s.duration,s.time+dt);
  if(!s.checked&&s.time+1e-8>=s.contact){
    s.checked=true;
    const hit=bladeTouchesPlayer(g,s);
    g.lastStrike=!hit?'Miss · no damage':protectedRoll(g.roll)?'Evaded · protected at contact':'Hit · −1 HP';
    if(hit)takeHit(g,'player',1,timings.player);
  }
  if(s.time+1e-8>=s.duration)g.enemySwing=null;
}
function spendStamina(g,action,cost){
  if(g.stamina+1e-8<cost){
    g.denied={action,cost};return false;
  }
  g.stamina=Math.max(0,g.stamina-cost);
  g.rest=1;g.denied=null;
  return true;
}
export function tickRound(g,keys,speed,damage,dt,attack,timings={}){
  advanceReactions(g,dt);
  if(g.outcome)return;
  const x=Number(keys.has('KeyD'))-Number(keys.has('KeyA')),z=Number(keys.has('KeyS'))-Number(keys.has('KeyW'));
  const length=Math.hypot(x,z);
  const beforeX=g.x,beforeZ=g.z;
  const {cost,regen,attackCost=15}=timings.stamina||staminaDefaults;
  if(!g.roll&&g.attackTime===null){
    const wait=Math.min(dt,g.rest);
    g.rest-=wait;
    g.stamina=Math.min(100,g.stamina+(dt-wait)*regen);
    if(g.denied&&g.stamina+1e-8>=g.denied.cost)g.denied=null;
  }
  const attempt=g.rollTap&&!g.roll&&!g.playerReaction&&g.attackTime===null;
  if(attempt&&spendStamina(g,'Roll',cost)){
    if(length){g.dx=x/length;g.dz=z/length;}
    g.roll={...rollDefaults,...timings.roll,dx:g.dx,dz:g.dz,time:0};
  }
  g.rollTap=false;
  const rolling=g.roll;
  if(rolling){
    const remaining=Math.min(dt,rolling.duration-rolling.time);
    const stride=2.4*remaining/rolling.duration;
    g.x=clamp(g.x+rolling.dx*stride,8.3);g.z=clamp(g.z+rolling.dz*stride,6.3);
    rolling.time+=remaining;
    if(rolling.time+1e-9>=rolling.duration)g.roll=null;
  }else if(length&&!g.playerReaction){
    g.dx=x/length;g.dz=z/length;
    g.x=clamp(g.x+g.dx*speed*dt,8.3);g.z=clamp(g.z+g.dz*speed*dt,6.3);
  }
  g.walking=g.x!==beforeX||g.z!==beforeZ;
  g.reload=Math.max(0,g.reload-dt);g.flash=Math.max(0,g.flash-dt);
  const trigger=!attempt&&!rolling&&!g.playerReaction&&(g.fireTap||keys.has('Space'));
  let fireNow=false;
  if(attack){
    if(trigger&&g.attackTime===null&&spendStamina(g,'Attack',attackCost)){g.attackTime=0;g.attackReleased=false;}
    if(g.attackTime!==null){
      g.attackTime=Math.min(attack.duration,g.attackTime+dt);
      if(!g.attackReleased&&g.attackTime+1e-8>=attack.release){fireNow=true;g.attackReleased=true;}
      if(g.attackTime+1e-8>=attack.duration)g.attackTime=null;
    }
  }else{
    g.attackTime=null;
    fireNow=trigger&&g.reload<=1e-8&&spendStamina(g,'Attack',attackCost);
  }
  if(fireNow){
    g.shotsFired++;
    g.shots.push({x:g.x+g.dx*.46,z:g.z+g.dz*.46,dx:g.dx,dz:g.dz,life:1.8});
    g.reload=.25;
  }
  g.fireTap=false;
  g.shots=g.shots.filter(s=>{
    s.x+=s.dx*11*dt;s.z+=s.dz*11*dt;s.life-=dt;
    if(!g.training&&Math.hypot(s.x-g.ex,s.z-g.ez)<.63){
      if(!g.staminaDrill)takeHit(g,'enemy',damage,timings.enemy);if(damage>0)g.flash=.16;return false;
    }
    return s.life>0&&Math.abs(s.x)<9&&Math.abs(s.z)<7;
  });
  if(g.outcome){g.shots=[];return;}
  if(!g.training&&!g.staminaDrill)advanceEnemy(g,dt,timings);
}
export function arenaLab(){
  return `<section class="code-lab final-arena"><div class="panel-label">PLAYTEST</div><h3>Relay Arena</h3><p>Fight the sentinel with the speed and damage from your code. Move with WASD. Hold Space to fire. Tap Shift to roll in the current movement direction, or along your last heading when standing still.</p>
    <div class="arena-loadout"><span>Move speed <b data-speed></b></span><span>Damage per hit <b data-damage></b></span></div>
    <div data-config-errors role="status"></div><div class="combat-hud"><span>SCOUT <b data-hp>3/3</b> <em data-player-state></em></span><span>SENTINEL <b data-enemy>3/3</b> <em data-enemy-state></em></span></div>
    <div class="stamina-hud"><label for="stamina-meter">Stamina <b data-stamina>100 / 100</b></label><progress id="stamina-meter" max="100" value="100"></progress><small data-stamina-state></small><small class="reserve" data-reserve></small><span data-stamina-notice role="status"></span></div>
    <canvas width="640" height="440" tabindex="0" aria-label="Battle arena. WASD to move, Space to fire, Shift to roll, Escape to pause, R to restart after the round."></canvas>
    <div class="arena-actions"><button class="primary" data-round>Start battle</button><span data-result role="status"></span></div>
    <div class="touch-controls" aria-label="Touch controls">${[['KeyW','↑','Move up'],['KeyA','←','Move left'],['KeyS','↓','Move down'],['KeyD','→','Move right'],['Space','Fire','Fire'],['ShiftLeft','Roll','Roll']].map(([k,g,label])=>`<button data-control="${k}" aria-label="${label}">${g}</button>`).join('')}</div><div class="enemy-drill"><h4>Dodge the sentinel</h4><p>Wait for the amber line, then move sideways with A or D. Stand still on your next try to compare.</p><button class="secondary" data-drill>Practice a swing</button> <output data-strike aria-live="polite"></output><a class="lib-link" href="#/enemy-attack">Enemy attack timing guide →</a></div><details class="roll-panel"><summary>Roll through the blade</summary><p>Start a swing test. Face the sentinel, then tap Shift midway through its wind-up to roll into the blade. <b>Evaded</b> means the blade touched you during protection. <b>Miss</b> means it passed clear.</p><button class="secondary" data-roll-drill>Practice a timed roll</button><fieldset><legend>Protected interval · 24 fps preview</legend><label>First protected frame <input type="range" min="1" data-safe-start></label><label>First vulnerable frame after protection <input type="range" min="2" data-safe-end></label><output data-safe-summary></output></fieldset><a class="lib-link" href="#/lesson/dodge-roll">Roll animation lesson →</a></details><details class="reaction-practice"><summary>Practice hit &amp; fall</summary><p>Start a stationary test with 3 HP each. Each hit removes one point. Reset to repeat or start a battle to fight normally.</p><div><button class="secondary" data-hit-target="player">Hit player</button><button class="secondary" data-hit-target="enemy">Hit enemy</button><button class="secondary" data-practice-reset>Reset practice</button></div><a class="lib-link" href="#/reactions">Hit and death screenshot guide →</a></details>${characterControls()}${characterControls('enemy')}<div class="arena-editors"><h3>Tune this round</h3><p>Edit a function body and start a fresh round to run your code. Roll cost is points per roll. Recovery is points per second after a one-second rest.</p>
    ${[movement,combat,'roll-cost','stamina-regen','attack-cost'].map((id,i)=>`<label for="tune-${i}">${tuningLabels[i]} code</label><textarea id="tune-${i}" data-tune="${id}" rows="3" spellcheck="false" maxlength="12000" autocapitalize="off"></textarea>${explainPanel(id,draft(id))}`).join('')}
    <button class="secondary" data-stamina-drill>Apply &amp; test stamina</button><p>The sentinel stays still and absorbs practice shots. Hold Space, release it, then tap Shift to test your remaining stamina.</p><a class="lib-link" href="#/lesson/roll-stamina">Roll stamina workshop →</a> <a class="lib-link" href="#/lesson/shared-stamina">Attack and roll workshop →</a>
    <button class="primary" data-replay>Apply &amp; fight again</button><small data-compare></small>
    <button class="secondary" data-kit>Download tuned Godot kit</button><span data-export-status role="status"></span><a class="lib-link" href="#/own-project">Use this kit in my project →</a></div></section>`;
}
export function paint(ctx,g,character,enemyModel,walking,dt){
  const w=640,h=440,px=x=>320+x*33,pz=z=>215+z*28;
  ctx.fillStyle='#151420';ctx.fillRect(0,0,w,h);
  ctx.fillStyle='#29243c';ctx.fillRect(23,19,594,392);
  ctx.strokeStyle='#443951';ctx.lineWidth=1;
  for(let x=-9;x<=9;x++){ctx.beginPath();ctx.moveTo(px(x),19);ctx.lineTo(px(x),411);ctx.stroke();}
  for(let z=-7;z<=7;z++){ctx.beginPath();ctx.moveTo(23,pz(z));ctx.lineTo(617,pz(z));ctx.stroke();}
  ctx.strokeStyle='#837099';ctx.lineWidth=3;ctx.strokeRect(23,19,594,392);
  ctx.strokeStyle='#655478';ctx.strokeRect(292,191,56,48);
  const swing=g.enemySwing;
  if(swing){
    const [a,b]=bladeSegment(g,swing);
    ctx.save();ctx.strokeStyle=swing.checked?'#ffe9a8':'#f1a34e';ctx.lineCap='round';
    ctx.lineWidth=9;ctx.globalAlpha=swing.checked?.28:.16;
    ctx.beginPath();ctx.moveTo(px(a[0]),pz(a[1]));ctx.lineTo(px(b[0]),pz(b[1]));ctx.stroke();
    ctx.lineWidth=swing.checked?4:2;ctx.globalAlpha=.95;
    if(!swing.checked)ctx.setLineDash([3,4]);ctx.stroke();ctx.restore();
  }
  function bot(x,z,dx,dz,enemy){
    const body=enemy?'#ee806f':'#63dcea',rim=enemy?'#ffc2ab':'#c4fbff';
    ctx.save();ctx.translate(px(x),pz(z));ctx.fillStyle='#12111b';ctx.beginPath();ctx.ellipse(0,4,17,11,0,0,Math.PI*2);ctx.fill();
    const r=enemy?g.enemyReaction:g.playerReaction;
    const t=r?Math.min(1,r.time/r.duration):0;
    if(r?.kind==='death'){ctx.translate(0,5*t);ctx.rotate(1.5*Math.min(1,t*1.6));ctx.scale(1,1-.35*t);}
    if(r?.kind==='hit'){const recoil=Math.sin(Math.PI*t);ctx.translate(-dx*5*recoil,-dz*5*recoil);ctx.rotate(-.5*recoil);}
    ctx.rotate(Math.atan2(dz,dx)+Math.PI/2);
    if(!enemy&&g.roll)ctx.scale(1,Math.cos(2*Math.PI*g.roll.time/g.roll.duration));
    ctx.fillStyle=enemy?'#844752':'#357888';ctx.fillRect(-14,-5,6,18);ctx.fillRect(8,-5,6,18);
    ctx.fillStyle=enemy&&g.flash>0?'#fff':body;ctx.beginPath();ctx.roundRect(-10,-11,20,22,6);ctx.fill();ctx.fillStyle='#232235';ctx.fillRect(-7,-7,14,6);
    ctx.fillStyle=rim;ctx.fillRect(-5,-6,9,2);ctx.fillRect(7,-17,4,11);ctx.restore();
  }
  if(g.roll){
    ctx.save();ctx.strokeStyle=protectedRoll(g.roll)?'#66edc5':'#b4abcd';ctx.lineWidth=3;
    ctx.beginPath();ctx.ellipse(px(g.x),pz(g.z),20,13,0,0,Math.PI*2);ctx.stroke();ctx.restore();
  }
  if(!character?.draw(ctx,g,walking,dt))bot(g.x,g.z,g.dx,g.dz,false);
  if(!g.training&&!enemyModel?.draw(ctx,g,g.enemyWalking&&!g.outcome,dt))bot(g.ex,g.ez,swing?.dx??g.x-g.ex,swing?.dz??g.z-g.ez,true);
  if(swing&&!swing.blade){
    const [a,b]=bladeSegment(g,swing);
    const t=swing.time,angle=t<swing.contact?-1.4*(1-t/swing.contact):.85*(t-swing.contact)/Math.max(.001,swing.duration-swing.contact);
    const vx=b[0]-a[0],vz=b[1]-a[1];
    ctx.save();ctx.strokeStyle='#ffbc65';ctx.lineWidth=5;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(px(a[0]),pz(a[1]));ctx.lineTo(px(a[0]+vx*Math.cos(angle)-vz*Math.sin(angle)),pz(a[1]+vx*Math.sin(angle)+vz*Math.cos(angle)));ctx.stroke();ctx.restore();
  }
  ctx.strokeStyle='#a8f6ff';ctx.lineWidth=4;ctx.lineCap='round';
  for(const s of g.shots){ctx.beginPath();ctx.moveTo(px(s.x-.25*s.dx),pz(s.z-.25*s.dz));ctx.lineTo(px(s.x),pz(s.z));ctx.stroke();}
}
export function mountArena(app){
  const el=app.querySelector('.final-arena');if(!el)return;
  const canvas=el.querySelector('canvas[tabindex]'),ctx=canvas.getContext('2d'),button=el.querySelector('[data-round]'),status=el.querySelector('[data-result]');
  const keys=new Set(),signalController=new AbortController(),options={signal:signalController.signal};
  let character,enemyModel;
  let round=newRound(),phase='ready',speed,damage,frame,last,bank=0;
  const editors=[...el.querySelectorAll('[data-tune]')],replay=el.querySelector('[data-replay]'),kit=el.querySelector('[data-kit]');
  for(const editor of editors)editor.value=draft(editor.dataset.tune);
  let previous, candidate, staminaTuning=staminaDefaults;
  let windowTiming={start:rollDefaults.start,end:rollDefaults.end};
  try{
    const t=JSON.parse(localStorage.getItem(rollKey));
    if(t&&Number.isFinite(t.start)&&Number.isFinite(t.end)&&0<=t.start&&t.start<t.end&&t.end<=1)windowTiming=t;
  }catch{}
  const startFrame=el.querySelector('[data-safe-start]'),endFrame=el.querySelector('[data-safe-end]');
  function frameCount(){return Math.max(2,Math.round((character?.rollDuration||.75)*24));}
  function syncWindow(){
    const n=frameCount(),first=Math.min(n,1+Math.ceil(windowTiming.start*n-1e-9)),end=Math.max(first+1,1+Math.ceil(windowTiming.end*n-1e-9));
    startFrame.max=end-1;endFrame.min=first+1;endFrame.max=n+1;
    startFrame.value=first;endFrame.value=end;
    const duration=character?.rollDuration||.75;
    const summary='Frames '+first+'–'+(end-1)+' protected · frame '+end+' vulnerable ('+(windowTiming.start*duration).toFixed(3)+'–'+(windowTiming.end*duration).toFixed(3)+' s)';
    const label=el.querySelector('[data-safe-summary]');if(label.textContent!==summary)label.textContent=summary;
  }
  for(const control of [startFrame,endFrame])control.addEventListener('input',()=>{
    pause();const n=frameCount();
    windowTiming={start:(Number(startFrame.value)-1)/n,end:(Number(endFrame.value)-1)/n};
    try{localStorage.setItem(rollKey,JSON.stringify(windowTiming));}catch{}
    syncWindow();
  });
  function load(){
    const values=editors.map(editor=>runChallenge(editor.dataset.tune,editor.value));
    candidate=values.map(r=>r.value);
    el.querySelector('[data-speed]').textContent=candidate[0]===undefined?'Fix code':candidate[0]+' m/s';
    el.querySelector('[data-damage]').textContent=candidate[1]??'Fix code';
    el.querySelector('[data-config-errors]').innerHTML=values.map((r,i)=>r.kind==='preview'?'':`<p><button data-jump="${i}" data-line="${r.line}">${tuningLabels[i]} · line ${r.line}</button> — ${esc(r.message)}</p>`).join('');
    const invalid=values.some(r=>r.kind!=='preview');el.querySelector('[data-stamina-drill]').disabled=button.disabled=replay.disabled=kit.disabled=el.querySelector('[data-drill]').disabled=el.querySelector('[data-roll-drill]').disabled=invalid;
    return !invalid;
  }
  el.querySelector('[data-config-errors]').addEventListener('click',e=>{
    const b=e.target.closest('[data-jump]');if(!b)return;
    const editor=editors[Number(b.dataset.jump)],lines=editor.value.split('\n'),index=Number(b.dataset.line)-1;
    const offset=lines.slice(0,index).reduce((n,row)=>n+row.length+1,0);
    editor.focus();editor.setSelectionRange(offset,offset+(lines[index]?.length||0));
  });
  for(const editor of editors)editor.addEventListener('input',()=>{
    el.querySelector('[data-explain="'+editor.dataset.tune+'"] ol').innerHTML=lineNotes(editor.dataset.tune,editor.value);
    pause();phase='ready';button.textContent='Start battle';saveDraft(editor.dataset.tune,editor.value);load();status.textContent='Edited · start a fresh round to apply';
  });
  replay.addEventListener('click',()=>{pause();phase='ready';start();canvas.scrollIntoView({block:'nearest'});});
  kit.addEventListener('click',async()=>{
    if(!load())return;
    const message=el.querySelector('[data-export-status]');
    if(character?.loading||enemyModel?.loading){message.textContent='Wait for the character to finish opening, then download the kit.';return;}
    try{await downloadKit(candidate[0],candidate[1],character?.model,enemyModel?.model,windowTiming,{cost:candidate[2],regen:candidate[3],attackCost:candidate[4]});message.textContent='Kit downloaded. Extract battle_lab into your project folder.';}
    catch{message.textContent='The kit could not be downloaded. Reload the page and try again.';}
  });
  function draw(walking=false,dt=0){
    syncWindow();
    paint(ctx,round,character,enemyModel,walking,dt);
    el.querySelector('[data-hp]').textContent=round.hp+'/3';
    el.querySelector('[data-enemy]').textContent=round.enemyHP+'/3';
    const meter=el.querySelector('#stamina-meter');
    meter.value=round.stamina;
    const points=Math.floor(round.stamina+1e-8);
    el.querySelector('[data-stamina]').textContent=points+' / 100';
    el.querySelector('[data-stamina-state]').textContent=round.stamina>=100?'Full':round.roll?'Rolling':round.attackTime!==null?'Attacking':round.rest>1e-8?'Resting':staminaTuning.regen?'Recovering':'Recovery set to 0';
    el.querySelector('[data-reserve]').textContent='Shots fired: '+round.shotsFired+' · '+(round.stamina+1e-8>=staminaTuning.cost?'Roll affordable':'Below roll cost')+' ('+staminaTuning.cost+')';
    const notice=el.querySelector('[data-stamina-notice]');
    const message=round.denied?round.denied.action+' blocked · need '+round.denied.cost+' stamina':'';
    if(notice.textContent!==message)notice.textContent=message;
    const strike=el.querySelector('[data-strike]');
    if(strike.textContent!==round.lastStrike)strike.textContent=round.lastStrike;
    for(const actor of ['player','enemy']){
      const r=round[actor+'Reaction'],label=r?.kind==='death'?(r.time>=r.duration?'Fallen':'Falling'):r?'Hit':actor==='player'&&round.roll?(protectedRoll(round.roll)?'Roll · protected':'Roll · vulnerable'):actor==='enemy'&&round.enemySwing?(round.enemySwing.checked?'Recovering':'Winding up'):'';
      el.querySelector('[data-'+actor+'-state]').textContent=label;
    }
  }
  function pause(){
    if(phase!=='playing')return;
    phase='paused';round.fireTap=round.rollTap=false;keys.clear();cancelAnimationFrame(frame);button.textContent='Resume battle';status.textContent='Paused';
  }
  function animate(now){
    const dt=Math.min(.1,(now-last)/1000);bank+=dt;last=now;
    const timings={stamina:staminaTuning,player:character?.reactionDurations,enemy:enemyModel?.reactionDurations,swing:enemyModel?.attack,roll:{...windowTiming,duration:character?.rollDuration||.75}};
    while(bank>=1/60){
      if(phase==='practice')advanceReactions(round,1/60);
      else tickRound(round,keys,speed,damage,1/60,character?.attack,timings);
      bank-=1/60;
    }
    draw(round.walking&&!round.outcome,dt);
    if(phase==='practice'){
      if(!poseFinished(round))frame=requestAnimationFrame(animate);
      else if(round.outcome)status.textContent=round.outcome+' · Final pose held';
      return;
    }
    if(round.outcome&&poseFinished(round)){phase='ended';keys.clear();button.textContent='Restart battle';status.textContent=round.outcome+' · Press R to restart';}
    else frame=requestAnimationFrame(animate);
  }
  function practice(target){
    cancelAnimationFrame(frame);keys.clear();
    if(phase!=='practice'||!target)round=newRound();
    phase='practice';button.textContent='Start battle';
    if(target&&!round.outcome)takeHit(round,target,1,(target==='player'?character:enemyModel)?.reactionDurations);
    status.textContent=round.outcome||'Practice · '+(target?target+' hit':'ready');
    bank=0;last=performance.now();draw();frame=requestAnimationFrame(animate);
  }
  for(const hit of el.querySelectorAll('[data-hit-target]'))hit.addEventListener('click',()=>practice(hit.dataset.hitTarget));
  el.querySelector('[data-practice-reset]').addEventListener('click',()=>practice(null));
  function start(){
    cancelAnimationFrame(frame);
    if(phase==='playing'){pause();return;}
    if(phase!=='paused'){
      if(!load())return;
      [speed,damage]=candidate;staminaTuning={cost:candidate[2],regen:candidate[3],attackCost:candidate[4]};round=newRound();
      el.querySelector('[data-compare]').textContent=previous?'Previous round: '+previous[0]+' m/s · '+previous[1]+' damage. This round: '+speed+' m/s · '+damage+' damage.':'';
      if(previous&&(previous[2]!==staminaTuning.cost||previous[3]!==staminaTuning.regen)){
        el.querySelector('[data-compare]').textContent+=' Roll cost: '+previous[2]+' → '+staminaTuning.cost+'. Recovery: '+previous[3]+' → '+staminaTuning.regen+' points/s.';
      }
      if(previous&&previous[4]!==staminaTuning.attackCost)el.querySelector('[data-compare]').textContent+=' Attack cost: '+previous[4]+' → '+staminaTuning.attackCost+' points.';
      previous=candidate.slice();
    }
    phase='playing';status.textContent=round.staminaDrill?'Stamina drill · sentinel waiting':'Battle in progress';button.textContent='Pause battle';bank=0;last=performance.now();
    canvas.focus({preventScroll:true});draw();frame=requestAnimationFrame(animate);
  }
  for(const drill of el.querySelectorAll('[data-drill],[data-roll-drill]'))drill.addEventListener('click',()=>{
    if(!load())return;
    pause();phase='ready';start();round.ez=round.z-2.25;draw();canvas.scrollIntoView({block:'nearest'});
  });
  el.querySelector('[data-stamina-drill]').addEventListener('click',()=>{
    if(!load())return;
    pause();phase='ready';start();round.staminaDrill=true;status.textContent='Stamina drill · sentinel waiting';
    canvas.scrollIntoView({block:'nearest'});
  });
  button.addEventListener('click',start);
  canvas.addEventListener('keydown',e=>{
    if(e.code==='KeyR'&&phase==='ended'){e.preventDefault();start();return;}
    if(e.code==='Escape'){pause();return;}
    if(phase==='playing'&&keysUsed.has(e.code)){e.preventDefault();keys.add(e.code);if(e.code==='Space'&&!e.repeat)round.fireTap=true;if(e.code.startsWith('Shift')&&!e.repeat)round.rollTap=true;}
  });
  canvas.addEventListener('keyup',e=>{if(keysUsed.has(e.code)){e.preventDefault();keys.delete(e.code);}});
  canvas.addEventListener('blur',e=>{if(e.relatedTarget!==button)pause();else keys.clear();});
  for(const control of el.querySelectorAll('[data-control]')){
    control.addEventListener('pointerdown',e=>{if(phase!=='playing')return;e.preventDefault();canvas.focus({preventScroll:true});control.setPointerCapture(e.pointerId);keys.add(control.dataset.control);if(control.dataset.control==='Space')round.fireTap=true;if(control.dataset.control==='ShiftLeft')round.rollTap=true;});
    control.addEventListener('lostpointercapture',()=>keys.delete(control.dataset.control));
  }
  el.addEventListener('focusout',e=>{if(!el.contains(e.relatedTarget))pause();});
  window.addEventListener('blur',pause,options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();},options);
  window.addEventListener('storage',e=>{
    const editor=editors.find(t=>e.key==='battle-lab.code.v1.'+t.dataset.tune);
    if(editor&&editor!==document.activeElement){pause();phase='ready';button.textContent='Start battle';editor.value=draft(editor.dataset.tune);el.querySelector('[data-explain="'+editor.dataset.tune+'"] ol').innerHTML=lineNotes(editor.dataset.tune,editor.value);load();}
  },options);
  character=mountCharacter(el,draw,()=>{pause();round.roll=null;round.attackTime=null;round.attackReleased=false;});
  enemyModel=mountCharacter(el,draw,()=>{pause();round.enemySwing=null;},'enemy');
  load();draw();
  return ()=>{character.dispose();enemyModel.dispose();signalController.abort();cancelAnimationFrame(frame);keys.clear();};
}
