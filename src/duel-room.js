import {pairChecklistLesson as lesson} from './duel-pair-checklist.js';
import {ORIGINAL,PUBLIC} from './device-sync.js';
import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

const roles=['host','guest'];
const names={host:'Host · P1',guest:'Guest · P2'};
const stepLabels=new Map(lesson.steps.map((s,i)=>[s.id,(i+1)+'. '+s.title]));
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
  <section class="panel"><h2>Run the duel together</h2><div class="room-presence">${roles.map(r=>`<p><strong>${names[r]}</strong> <span data-viewing="${r}">Waiting for player</span></p>`).join('')}</div><p>Open a step to compare screens. When both players are on that step and confirm it, both checklists open the next one.</p><p data-room-total>0 of ${lesson.steps.length} checkpoints confirmed by both players</p>
  ${lesson.steps.map((step,i)=>`<details class="room-step" data-step-id="${step.id}" ${i===0?'open':''}><summary>${i+1}. ${esc(step.title)} <small data-marks="${step.id}"></small> <small data-readers></small></summary>
  <div class="pair-roles">${roles.map(role=>`<div><b>${names[role]}</b><p>${esc(step[role])}</p><label><input type="checkbox" data-room-role="${role}" data-id="${step.id}" disabled> ${role==='host'?'Host':'Guest'} confirmed</label><p class="room-observation" data-observation="${role}" data-id="${step.id}" hidden></p></div>`).join('')}</div>
  ${screenshot('./assets/'+step.image+'.webp',step.caption,true)}<p><strong>What you should see</strong> · ${esc(step.expected)}</p><div data-note-form="${step.id}" hidden><label>What differed on your screen?<textarea rows="2" maxlength="600" placeholder="Example: My P2 health stayed at 3/3 after the hit."></textarea></label><button class="secondary" data-save-note="${step.id}">Share difference</button><p>Sharing clears your confirmation for this step. Compare the notes, retest, then confirm when your result matches.</p><span data-note-status role="status"></span></div></details>`).join('')}</section></div>`;
}

export function mountRoom(root,room){
  const ticket=ticketFor(room);
  let active=true, busy=false, reading=false, latest=null, pendingCheck=null;
  const status=root.querySelector('[data-room-status]');
  const link=root.querySelector('[data-room-link]');
  link.value=location.href;
  const call=(action,fields={})=>request({room,ticket,action,...fields});
  let displayed=null;
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
    for(const role of roles){
      const label=root.querySelector('[data-viewing="'+role+'"]');
      const recent=Date.now()-latest.seen[role]<45000;
      label.textContent=!latest.occupied[role]?'Waiting for player':(recent?'Viewing ':'Last viewed ')+stepLabels.get(latest.views[role]);
    }
    const selected=latest.role && latest.views[latest.role];
    if(selected && selected!==displayed){
      const moving=displayed!==null;
      for(const panel of root.querySelectorAll('[data-step-id]')){
        panel.open=panel.dataset.stepId===selected;
        if(panel.open && moving)panel.querySelector('summary').scrollIntoView({block:'start'});
      }
      displayed=selected;
    }
    if(!selected)displayed=null;
    for(const node of root.querySelectorAll('[data-observation]')){
      const role=node.dataset.observation,step=node.dataset.id,note=latest.notes[role][step];
      node.textContent=note?(latest.checks[role][step]?'Retested · ':'Difference · ')+note:'';
      node.hidden=!note;
    }
    for(const form of root.querySelectorAll('[data-note-form]')){
      form.hidden=!latest.role;
      form.querySelector('button').disabled=busy||!form.querySelector('textarea').value.trim();
    }
    let complete=0;
    for(const node of root.querySelectorAll('[data-marks]')){
      const checked=roles.filter(r=>latest.checks[r][node.dataset.marks]);
      if(checked.length===2)complete++;
      const step=node.dataset.marks;
      const readers=roles.filter(r=>latest.occupied[r] && Date.now()-latest.seen[r]<45000 && latest.views[r]===step);
      node.parentElement.querySelector('[data-readers]').textContent=readers.length?'Viewing: '+readers.map(r=>names[r]).join(' + '):'';
      const differences=roles.filter(r=>latest.notes[r][step]&&!latest.checks[r][step]);
      node.textContent=checked.length===2?'Both confirmed':[...checked.map(r=>names[r]+' confirmed'),...differences.map(r=>names[r]+' reported a difference')].join(' · ');
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
    try{accept(await call(action,fields));if(active)status.textContent=readyMessage();return true;}
    catch(e){if(active){status.textContent='Change unconfirmed. '+e.message;try{accept(await call('read'));}catch{}}}
    finally{pendingCheck=null;busy=false;paint();}
  }
  root.onclick=async e=>{
    const summary=e.target.closest('.room-step > summary');
    if(summary && latest?.role){
      e.preventDefault();
      const step=summary.parentElement.dataset.stepId;
      if(step!==displayed)await change('view',{role:latest.role,step,advance:latest.advance});
      return;
    }
    const save=e.target.closest('[data-save-note]');
    if(save && latest?.role){
      const form=save.closest('[data-note-form]'),input=form.querySelector('textarea'),text=input.value;
      const success=await change('note',{role:latest.role,step:save.dataset.saveNote,text});
      if(success && input.value===text)input.value='';
      form.querySelector('[data-note-status]').textContent=success?'Difference shared.':'Could not confirm the save. Your draft is here to retry.';
      paint();return;
    }
    if(e.target.closest('[data-room-copy]')){
      try{await navigator.clipboard.writeText(link.value);status.textContent='Room link copied.';}catch{link.select();status.textContent='Copy the selected room link.';}
    }
    const claim=e.target.closest('[data-claim]');
    if(claim)change('claim',{role:claim.dataset.claim});
    if(e.target.closest('[data-release]')&&latest?.role)change('release',{role:latest.role});
  };
  root.oninput=e=>{
    const form=e.target.closest('[data-note-form]');
    if(form){form.querySelector('button').disabled=busy||!e.target.value.trim();form.querySelector('[data-note-status]').textContent='';}
  };
  root.onchange=e=>{
    const box=e.target;
    if(box.dataset.roomRole)change('check',{role:box.dataset.roomRole,step:box.dataset.id,checked:box.checked,advance:latest.advance});
  };
  read();
  const timer=setInterval(read,1000);
  document.addEventListener('visibilitychange',read);
  return ()=>{active=false;clearInterval(timer);document.removeEventListener('visibilitychange',read);};
}
