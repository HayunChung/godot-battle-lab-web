import {pairChecklistLesson as lesson} from './duel-pair-checklist.js';
import {ORIGINAL,PUBLIC} from './device-sync.js';
import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

const roles=['host','guest'];
const names={host:'Host · P1',guest:'Guest · P2'};
const endpoint=location.origin===new URL(PUBLIC).origin?ORIGINAL+'/api/duel-room':'/api/duel-room';
const roomPath=room=>'#/duel-room/'+room;
const memory=new Map();

async function request(body){
  const response=await fetch(endpoint,{method:'POST',credentials:'omit',cache:'no-store',headers:{'Content-Type':'text/plain'},body:JSON.stringify(body),signal:AbortSignal.timeout(10000)});
  const result=await response.json();
  if(!response.ok)throw Error(result.error||'Connection failed.');
  return result;
}
function ticketFor(room){
  const key='battle-lab.duel-room.'+room;
  let ticket=memory.get(key);
  try{ticket=localStorage.getItem(key)||ticket;}catch{}
  if(!ticket){
    ticket=Array.from(crypto.getRandomValues(new Uint8Array(32)),n=>n.toString(16).padStart(2,'0')).join('');
    try{localStorage.setItem(key,ticket);}catch{}
  }
  memory.set(key,ticket);
  return ticket;
}

export const roomEntry='<section class="panel"><h2>Practice with a friend</h2><p>Create one room and send its link to your friend. Choose one role each to check the same list together.</p><button class="primary" data-create-room>Create shared room</button> <span role="status" data-create-status></span></section>';

export async function createRoom(button){
  button.disabled=true;
  const status=button.parentElement.querySelector('[data-create-status]');
  status.textContent='Creating room…';
  try{
    const {room}=await request({action:'create'});
    if(button.isConnected)location.hash=roomPath(room);
  }catch{status.textContent='Could not create the room. Check your connection and try again.';button.disabled=false;}
}

export function roomPage(){
  return `<div class="page duel-room"><a class="lib-link" href="#/lesson/duel-pair-checklist">← Two-computer duel lesson</a><h1>Shared duel checklist</h1>
  <section class="panel"><h2>Invite your friend</h2><p>Send this room link to your friend. Open the Godot project on both computers and choose one role each below.</p>
  <label>Room link <input data-room-link readonly></label> <button class="secondary" data-room-copy>Copy room link</button>
  <p><a class="lib-link" href="./downloads/battle-lab.zip" download>Download the Godot project ↓</a></p>
  <div class="room-role-picker">${roles.map(role=>`<button class="secondary" data-claim="${role}" disabled>Choose ${names[role]}</button>`).join(' ')} <button class="secondary" data-release hidden>Release my role</button></div>
  <p data-room-status role="status">Connecting to the room…</p></section>
  <section class="panel"><h2>Run the duel together</h2><p data-room-total>0 of ${lesson.steps.length} checkpoints confirmed by both players</p>
  ${lesson.steps.map((step,i)=>`<details class="room-step" ${i===0?'open':''}><summary>${i+1}. ${esc(step.title)} <small data-marks="${step.id}"></small></summary>
  <div class="pair-roles">${roles.map(role=>`<div><b>${names[role]}</b><p>${esc(step[role])}</p><label><input type="checkbox" data-room-role="${role}" data-id="${step.id}" disabled> ${role==='host'?'Host':'Guest'} confirmed</label></div>`).join('')}</div>
  ${screenshot('./assets/'+step.image+'.webp',step.caption,true)}<p><strong>What you should see</strong> · ${esc(step.expected)}</p></details>`).join('')}</section></div>`;
}

export function mountRoom(root,room){
  const ticket=ticketFor(room);
  let active=true, busy=false, reading=false, latest=null, pendingCheck=null;
  const status=root.querySelector('[data-room-status]');
  const link=root.querySelector('[data-room-link]');
  link.value=location.href;
  const call=(action,fields={})=>request({room,ticket,action,...fields});
  function paint(){
    if(!latest||!active)return;
    for(const b of root.querySelectorAll('[data-claim]')){
      const role=b.dataset.claim;
      b.textContent=latest.role===role?'You are '+names[role]:latest.occupied[role]?names[role]+' · taken':'Choose '+names[role];
      b.disabled=busy||!!latest.role||latest.occupied[role];
    }
    const release=root.querySelector('[data-release]');
    release.hidden=!latest.role;release.disabled=busy;
    for(const box of root.querySelectorAll('[data-room-role]')){
      box.checked=pendingCheck?.role===box.dataset.roomRole && pendingCheck.step===box.dataset.id
        ? pendingCheck.checked : !!latest.checks[box.dataset.roomRole][box.dataset.id];
      box.disabled=busy||latest.role!==box.dataset.roomRole;
    }
    let complete=0;
    for(const node of root.querySelectorAll('[data-marks]')){
      const checked=roles.filter(r=>latest.checks[r][node.dataset.marks]);
      if(checked.length===2)complete++;
      node.textContent=checked.length===2?'Both confirmed':checked.map(r=>names[r]+' confirmed').join('');
    }
    root.querySelector('[data-room-total]').textContent=complete+' of '+lesson.steps.length+' checkpoints confirmed by both players';
  }
  function accept(result){
    if(!active)return;
    if(!latest||result.revision>=latest.revision)latest=result;
    paint();
  }
  const readyMessage=()=>latest?.role?'Connected. Your checks are shared with your friend.':'Connected. Choose an available role.';
  async function read(){
    if(!active||busy||reading||document.hidden)return;
    reading=true;
    try{accept(await call('read'));if(active&&!busy)status.textContent=readyMessage();}
    catch(e){if(active&&!busy)status.textContent=e.message.startsWith('Room not found')?e.message:'Connection interrupted. Reconnecting…';}
    finally{reading=false;}
  }
  async function change(action,fields){
    if(busy)return;
    busy=true;pendingCheck=action==='check'?fields:null;paint();status.textContent='Saving…';
    try{accept(await call(action,fields));if(active)status.textContent=readyMessage();}
    catch(e){if(active){status.textContent='Change unconfirmed. '+e.message;try{accept(await call('read'));}catch{}}}
    finally{pendingCheck=null;busy=false;paint();}
  }
  root.onclick=async e=>{
    if(e.target.closest('[data-room-copy]')){
      try{await navigator.clipboard.writeText(link.value);status.textContent='Room link copied.';}catch{link.select();status.textContent='Copy the selected room link.';}
    }
    const claim=e.target.closest('[data-claim]');
    if(claim)change('claim',{role:claim.dataset.claim});
    if(e.target.closest('[data-release]')&&latest?.role)change('release',{role:latest.role});
  };
  root.onchange=e=>{
    const box=e.target;
    if(box.dataset.roomRole)change('check',{role:box.dataset.roomRole,step:box.dataset.id,checked:box.checked});
  };
  read();
  const timer=setInterval(read,1000);
  document.addEventListener('visibilitychange',read);
  return ()=>{active=false;clearInterval(timer);document.removeEventListener('visibilitychange',read);};
}
