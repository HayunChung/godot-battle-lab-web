const bindings=[
  ['KeyA','KeyD','KeyW','KeyS','Space'],
  ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter']
];
const directions=['Left','Right','Up','Down','Fire'];

export function freshDuel(){
  return {pilots:[{x:-4,z:0,dx:1,dz:0,hp:3,wait:0},{x:4,z:0,dx:-1,dz:0,hp:3,wait:0}],shots:[],result:''};
}
function steering(keys,slot){
  const [left,right,up,down,fire]=bindings[slot];
  return {x:Number(keys.has(right))-Number(keys.has(left)),z:Number(keys.has(down))-Number(keys.has(up)),fire:keys.has(fire)};
}
export function advanceDuel(state,keys,mode,range,dt){
  if(state.result)return;
  const [one,two]=state.pilots;
  const controls=[steering(keys,0),steering(keys,1)];
  if(mode==='bot'){
    const x=one.x-two.x,z=one.z-two.z,d=Math.hypot(x,z);
    if(d>0){two.dx=x/d;two.dz=z/d;}
    controls[1]={x:d>range?two.dx:0,z:d>range?two.dz:0,fire:d<=range};
  }
  state.pilots.forEach((pilot,index)=>{
    const control=controls[index],length=Math.hypot(control.x,control.z);
    if(length){
      pilot.dx=control.x/length;pilot.dz=control.z/length;
      pilot.x=Math.max(-8,Math.min(8,pilot.x+pilot.dx*4*dt));
      pilot.z=Math.max(-6,Math.min(6,pilot.z+pilot.dz*4*dt));
    }
    pilot.wait=Math.max(0,pilot.wait-dt);
    if(control.fire && pilot.wait===0){
      pilot.wait=.45;
      state.shots.push({owner:index,x:pilot.x+pilot.dx*.6,z:pilot.z+pilot.dz*.6,dx:pilot.dx,dz:pilot.dz,life:1.8});
    }
  });
  state.shots=state.shots.filter(s=>{
    s.x+=s.dx*11*dt;s.z+=s.dz*11*dt;s.life-=dt;
    const opponent=state.pilots[1-s.owner];
    if(Math.hypot(opponent.x-s.x,opponent.z-s.z)<=.55){
      opponent.hp=Math.max(0,opponent.hp-1);return false;
    }
    return s.life>0;
  });
  if(!one.hp||!two.hp)state.result=one.hp===two.hp?'Draw':one.hp?'Player 1 wins':mode==='bot'?'Bot wins':'Player 2 wins';
}

function draw(ctx,state){
  const x=v=>300+v*31,z=v=>204+v*29;
  ctx.fillStyle='#151e2b';ctx.fillRect(0,0,600,408);
  ctx.strokeStyle='#29374a';ctx.lineWidth=1;
  for(let i=-8;i<=8;i++){ctx.beginPath();ctx.moveTo(x(i),z(-6));ctx.lineTo(x(i),z(6));ctx.stroke();}
  for(let i=-6;i<=6;i++){ctx.beginPath();ctx.moveTo(x(-8),z(i));ctx.lineTo(x(8),z(i));ctx.stroke();}
  const colors=['#66dcff','#ff9879'];
  state.pilots.forEach((p,i)=>{
    ctx.fillStyle=colors[i];ctx.save();ctx.translate(x(p.x),z(p.z));ctx.rotate(Math.atan2(p.dz,p.dx));
    ctx.beginPath();ctx.moveTo(17,0);ctx.lineTo(-10,-10);ctx.lineTo(-6,0);ctx.lineTo(-10,10);ctx.closePath();ctx.fill();ctx.restore();
    ctx.fillStyle='#eee';ctx.textAlign='center';ctx.font='bold 13px sans-serif';ctx.fillText('P'+(i+1),x(p.x),z(p.z)-17);
  });
  for(const s of state.shots){ctx.fillStyle=colors[s.owner];ctx.beginPath();ctx.arc(x(s.x),z(s.z),4,0,2*Math.PI);ctx.fill();}
}
function controls(i){
  return `<fieldset data-pad="${i}"><legend>Player ${i+1}</legend>${bindings[i].map((key,j)=>`<button class="secondary" type="button" data-duel-key="${key}" aria-label="Player ${i+1} ${directions[j]}">${['←','→','↑','↓','Fire'][j]}</button>`).join(' ')}</fieldset>`;
}
export function duelLab(mode){
  if(mode==='network')return `<section class="code-lab duel-lab" data-packets><h3>Trace one network input</h3><p>This offline exercise follows one packet from the guest to the host and back. For a live match, open this project in Godot on both computers. <a class="lib-link" href="./downloads/battle-lab.zip" download>Download reference project →</a></p><output aria-live="polite"></output><button type="button" class="primary" data-packet-next></button></section>`;
  return `<section class="code-lab duel-lab" data-duel="${mode}"><h3>Try the duel controls</h3><label>Opponent <select data-opponent><option value="bot">Practice bot</option><option value="local">Second player on this keyboard</option></select></label><label data-range>Bot firing range (meters) <input type="range" min="1" max="7" value="4" step=".25"> <output>4</output></label><p data-instructions></p><div class="duel-health" aria-label="Round health"></div><canvas width="600" height="408" tabindex="0" aria-label="Duel training floor"></canvas><div class="duel-controls">${controls(0)}${controls(1)}</div><button type="button" class="primary" data-round-duel>Start round</button> <button type="button" class="secondary" data-pause-duel disabled>Pause</button><p role="status" data-duel-status></p></section>`;
}
export function mountDuelLab(app){
  const packets=app.querySelector('[data-packets]');
  if(packets){
    const sequence=[['Guest wants to move right. Both views show X = 4.0.','Send input'],['Guest → host: direction (1, 0). Health and hit decisions stay with the host.','Simulate on host'],['At 4 m/s, a quarter-second of input moves the guest from X = 4.0 to X = 5.0 on the host.','Deliver snapshot'],['Host → guest: X = 5.0. Both views now show the host’s position.','Trace again']];
    let index=0;
    const show=()=>{packets.querySelector('output').textContent=sequence[index][0];packets.querySelector('button').textContent=sequence[index][1];};
    packets.querySelector('button').onclick=()=>{index=(index+1)%sequence.length;show();};show();return ()=>{};
  }
  const el=app.querySelector('[data-duel]');if(!el)return;
  const canvas=el.querySelector('canvas'),ctx=canvas.getContext('2d'),select=el.querySelector('select'),range=el.querySelector('[data-range] input'),status=el.querySelector('[data-duel-status]'),pause=el.querySelector('[data-pause-duel]');
  const held=new Set();
  let state,frame,previous,bank,running;
  select.value=el.dataset.duel==='local'?'local':'bot';
  function display(){
    const [a,b]=state.pilots;
    el.querySelector('.duel-health').textContent='P1   '+a.hp+'/3     ·     '+(select.value==='bot'?'Bot':'P2')+'   '+b.hp+'/3';
    draw(ctx,state);
  }
  function stop(){running=false;cancelAnimationFrame(frame);held.clear();}
  function reset(){
    stop();state=freshDuel();pause.disabled=true;pause.textContent='Pause';status.textContent='Ready.';
    const bot=select.value==='bot';
    el.querySelector('[data-range]').hidden=!bot;el.querySelector('[data-pad="1"]').hidden=bot;
    el.querySelector('[data-instructions]').textContent='P1 uses WASD and Space. '+(bot?'The bot approaches, then fires in range.':'P2 uses the arrow keys and Enter.')+' Three hits end a round.';
    display();
  }
  function tick(now){
    bank+=Math.min((now-previous)/1000,.1);previous=now;
    while(bank>=1/60){advanceDuel(state,held,select.value,Number(range.value),1/60);bank-=1/60;}
    display();
    if(state.result){stop();status.textContent=state.result+'.';pause.disabled=true;return;}
    frame=requestAnimationFrame(tick);
  }
  function play(){running=true;bank=0;previous=performance.now();pause.disabled=false;pause.textContent='Pause';status.textContent='Round in progress.';canvas.focus({preventScroll:true});frame=requestAnimationFrame(tick);}
  function suspend(){if(!running)return;stop();pause.textContent='Resume';status.textContent='Paused.';}
  select.onchange=reset;range.oninput=()=>{el.querySelector('[data-range] output').value=range.value;};
  el.querySelector('[data-round-duel]').onclick=()=>{reset();play();el.querySelector('[data-round-duel]').textContent='Restart round';};
  pause.onclick=()=>{if(running)suspend();else play();};
  canvas.onkeydown=e=>{if(bindings.flat().includes(e.code)){e.preventDefault();held.add(e.code);}if(e.code==='Escape')suspend();};
  canvas.onkeyup=e=>held.delete(e.code);
  canvas.onblur=()=>held.clear();
  for(const button of el.querySelectorAll('[data-duel-key]')){
    button.onpointerdown=e=>{if(!running)return;e.preventDefault();canvas.focus({preventScroll:true});button.setPointerCapture(e.pointerId);held.add(button.dataset.duelKey);};
    button.onlostpointercapture=()=>held.delete(button.dataset.duelKey);
  }
  window.addEventListener('blur',suspend);reset();
  return ()=>{stop();window.removeEventListener('blur',suspend);};
}
