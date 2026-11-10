import {sharedPhotoDialog,mountSharedPhoto} from './shared-photo-viewer.js';
import {padHistoryPanel,mountPadHistory} from './room-pad-history.js';
import {padTests,expectedPadResult,padResultLabel} from './pad-results.js';
import {testHistoryPanel,mountTestHistory} from './duel-test-history.js';
import {filePicker,mountFilePicker} from './file-picker.js';
import {screenshotForUpload} from './room-photo.js';
import {pairChecklistLesson as lesson} from './duel-pair-checklist.js';
import {ORIGINAL,PUBLIC} from './device-sync.js';
import {esc} from './ui.js';
import {screenshot,stepHelp} from './screenshot.js';

const roles=['host','guest'];
const names={host:'Host · P1',guest:'Guest · P2'};
const stepLabels=new Map(lesson.steps.map((s,i)=>[s.id,(i+1)+'. '+s.title]));
const endpoint=location.origin===new URL(PUBLIC).origin?ORIGINAL+'/api/duel-room':'/api/duel-room';
const roomPath=room=>'#/duel-room/'+room;
const memory=new Map();

async function request(body){
  const {photo,...fields}=body;
  let payload=JSON.stringify(fields);
  if(photo){
    const form=new FormData();
    form.set('report',payload);form.set('photo',await screenshotForUpload(photo),'godot.jpg');payload=form;
  }
  const response=await fetch(endpoint,{method:'POST',credentials:'omit',cache:'no-store',body:payload,signal:AbortSignal.timeout(photo?45000:10000)});
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

const recentKey='battle-lab.recent-room';
let recentRoom='';
export function recentRoomLink(){
  let room=recentRoom;
  try{room=localStorage.getItem(recentKey)||room;}catch{}
  return /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/.test(room)?`<a class="lib-link" href="${roomPath(room)}">Return to shared room →</a>`:'';
}
export const roomEntry=()=>`<section class="panel"><h2>Practice with a friend</h2><p>Create one room and send its link to your friend. Choose one role each to check the same list together.</p><button class="primary" data-create-room>Create shared room</button> ${recentRoomLink()} <span role="status" data-create-status></span></section>`;

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
  return `<div class="page duel-room">${sharedPhotoDialog}<a class="lib-link" href="#/lesson/duel-pair-checklist">← Two-computer duel lesson</a><h1>Shared duel checklist</h1>
  <section class="panel"><h2>Invite your friend</h2><p>Send this room link to your friend. Open the Godot project on both computers and choose one role each below.</p>
  <label>Room link <input data-room-link readonly></label> <button class="secondary" data-room-copy>Copy room link</button>
  <p><a class="lib-link" href="./downloads/battle-lab.zip" download>Download the Godot project ↓</a></p>
  <div class="room-role-picker">${roles.map(role=>`<button class="secondary" data-claim="${role}" disabled>Choose ${names[role]}</button>`).join(' ')} <button class="secondary" data-release hidden>Release my role</button></div>
  <p data-room-status role="status">Connecting to the room…</p><button type="button" class="secondary" data-report-pdf disabled>Download test report (PDF)</button> <span data-pdf-status role="status"></span></section>
  <section class="panel"><h2>Run the duel together</h2><div class="room-presence">${roles.map(r=>`<p><strong>${names[r]}</strong> <span data-viewing="${r}">Waiting for player</span></p>`).join('')}</div><p>Open a step to compare screens. When both players are on that step and confirm it, both checklists open the next one.</p><button class="secondary" data-review-mode disabled>Retest open steps together</button><p data-review-status role="status"></p><p data-room-total>0 of ${lesson.steps.length} checkpoints confirmed by both players</p>
  ${lesson.steps.map((step,i)=>`<details class="room-step" data-step-id="${step.id}" ${i===0?'open':''}><summary>${i+1}. ${esc(step.title)} <small data-marks="${step.id}"></small> <small data-readers></small></summary>
  <div class="pair-roles">${roles.map(role=>`<div><b>${names[role]}</b><p>${esc(step[role])}</p><label><input type="checkbox" data-room-role="${role}" data-id="${step.id}" disabled> ${Object.hasOwn(padTests,step.id)?'My pad: '+padResultLabel(step.id,expectedPadResult(step.id,role)):(role==='host'?'Host':'Guest')+' confirmed'}</label></div>`).join('')}</div>
  <section data-comparison="${step.id}" hidden><h3>Compare Godot screens · <span data-current-test></span></h3><div class="room-screens">${roles.map(role=>`<div><b>${names[role]}</b><div data-room-photo="${role}">No screenshot shared</div><p class="room-observation" data-observation="${role}" data-id="${step.id}" hidden></p><p data-role-retest="${role}"></p></div>`).join('')}</div><p data-resolution role="status"></p><p data-first-resolved hidden></p>${Object.hasOwn(padTests,step.id)?padHistoryPanel(step.id):''}<div data-retest-actions hidden><button class="secondary" data-retest="different">Still different</button> <button class="secondary" data-retest="resolved">Resolved on my screen</button></div>${testHistoryPanel(step.id)}</section>
  ${screenshot('./assets/'+step.image+'.webp',step.caption,true)}${stepHelp(step.help)}<p><strong>What you should see</strong> · ${esc(step.expected)}</p><div data-note-form="${step.id}" hidden>${Object.hasOwn(padTests,step.id)?`<label>What happened on your pad?<select data-pad-result><option value="">Choose an observation</option><option value="yes">${padResultLabel(step.id,true)}</option><option value="no">${padResultLabel(step.id,false)}</option></select></label>`:''}<label>What did you see in Godot?<textarea rows="2" maxlength="600" placeholder="Example: My P2 health stayed at 3/3 after the hit."></textarea></label>${filePicker('Godot screenshot (PNG, JPEG or WebP, up to 20 MB)','image/png,image/jpeg,image/webp','data-photo-input')}<label data-number-picker hidden>Save to <select data-target-test></select></label><button class="secondary" data-save-note="${step.id}">Share difference</button><p>${Object.hasOwn(padTests,step.id)?'To keep a fix screenshot, select the next test under Save to. Both players can add evidence to that test before confirming the fix. ':''}Share a note, a screenshot, or both. Each player can share one report per test. Share your next capture in the next test to keep both versions. Both players use the same test numbers.</p><span data-note-status role="status"></span></div></details>`).join('')}</section></div>`;
}

export function mountRoom(root,room,linkedStep){
  let landing=stepLabels.has(linkedStep)?linkedStep:null;
  let inspecting=landing;
  const ticket=ticketFor(room);
  let active=true, busy=false, reading=false, latest=null, pendingCheck=null;
  const status=root.querySelector('[data-room-status]');
  const link=root.querySelector('[data-room-link]');
  const roomUrl=new URL(roomPath(room),location.href).href;
  link.value=roomUrl;
  const call=(action,fields={})=>request({room,ticket,action,...fields});
  const photoUrl=(step,r,id)=>endpoint.replace('/duel-room','/duel-photo')+'/'+[room,r,step,id].map(encodeURIComponent).join('/');
  const {draw:drawHistory,archive}=mountTestHistory(root,call,photoUrl);
  const photoViewer=mountSharedPhoto(root,photoUrl,change,()=>latest);
  const drawEpisodes=mountPadHistory(archive,photoUrl);
  const resetFiles=new Map();
  for(const form of root.querySelectorAll('[data-note-form]'))resetFiles.set(form,mountFilePicker(form.querySelector('[data-photo-input]')));
  let displayed=null,queuedView=null;
  let exporting=false;
  function paint(){
    if(!latest||!active)return;
    photoViewer.update(latest);
    root.querySelector('[data-report-pdf]').disabled=exporting||busy;
    for(const b of root.querySelectorAll('[data-claim]')){
      const role=b.dataset.claim;
      b.textContent=latest.role===role?'You are '+names[role]:latest.occupied[role]?names[role]+' · taken':'Choose '+names[role];
      b.disabled=busy||!!latest.role||latest.occupied[role];
    }
    const release=root.querySelector('[data-release]');
    release.hidden=!latest.role;release.disabled=busy;
    const startingRetest=step=>latest.review?.[step]===(latest.archivedCounts[step]||0)+1;
    for(const box of root.querySelectorAll('[data-room-role]')){
      box.checked=pendingCheck?.role===box.dataset.roomRole && pendingCheck.step===box.dataset.id
        ? pendingCheck.checked : !startingRetest(box.dataset.id) && !!latest.checks[box.dataset.roomRole][box.dataset.id];
      box.disabled=busy||latest.role!==box.dataset.roomRole;
    }
    for(const role of roles){
      const label=root.querySelector('[data-viewing="'+role+'"]');
      const recent=Date.now()-latest.seen[role]<45000;
      const pick=latest.historyView?.picks[role]?.[latest.views[role]];
      label.textContent=!latest.occupied[role]?'Waiting for player':(recent?'Viewing ':'Last viewed ')+stepLabels.get(latest.views[role])+(pick?' · Test '+pick:'');
    }
    const isOpen=step=>((latest.archivedCounts[step]||0)>0 || roles.some(r=>latest.notes[r][step]||latest.photos[r][step])) && !roles.every(r=>latest.retests[r][step]==='resolved');
    const openCount=lesson.steps.filter(s=>isOpen(s.id)).length;
    const mode=root.querySelector('[data-review-mode]');
    mode.textContent=latest.review?'Show all steps for both players':'Retest open steps together';
    mode.disabled=busy||!latest.role||(!latest.review&&!openCount);
    mode.setAttribute('aria-pressed',String(!!latest.review));
    const selected=landing || (latest.role && latest.views[latest.role]) || inspecting;
    if(inspecting && selected!==inspecting)inspecting=null;
    for(const panel of root.querySelectorAll('[data-step-id]')){
      const keepRetest=latest.targeted?.step===panel.dataset.stepId && selected===panel.dataset.stepId;
      const keepShared=latest.historyView?.together && latest.historyView.move?.step===panel.dataset.stepId && selected===panel.dataset.stepId;
      panel.hidden=!!latest.review && !isOpen(panel.dataset.stepId) && panel.dataset.stepId!==inspecting && !keepRetest && !keepShared;
    }
    root.querySelector('[data-review-status]').textContent=latest.review?(openCount?openCount+' open checkpoints in this shared retest.':'No open issues remain. Download a fresh PDF for the joint fix results.'):'';

    if(selected && selected!==displayed){
      const moving=displayed!==null;
      for(const panel of root.querySelectorAll('[data-step-id]')){
        panel.open=panel.dataset.stepId===selected;
        if(panel.open && (moving||landing))panel.querySelector('summary').scrollIntoView({block:'start'});
      }
      displayed=selected;
    }
    if(!selected)displayed=null;
    for(const node of root.querySelectorAll('[data-observation]')){
      const role=node.dataset.observation,step=node.dataset.id,note=latest.notes[role][step];
      node.textContent=note?(latest.checks[role][step]?'Retested · ':'Difference · ')+note:'';
      node.hidden=!note;
    }
    for(const section of root.querySelectorAll('[data-comparison]')){
      const step=section.dataset.comparison;
      section.hidden=!latest.archivedCounts[step]&&!roles.some(r=>latest.notes[r][step]||latest.photos?.[r][step]);
      if(section.hidden)continue;
      const current=(latest.archivedCounts?.[step]||0)+1;
      section.querySelector('[data-current-test]').textContent=latest.review?.[step]===current?'Test '+current+' / next retest: Test '+(current+1):'Test '+current;
      const first=section.querySelector('[data-first-resolved]'),n=latest.firstResolved?.[step];
      first.hidden=!n;first.textContent=n?'First resolved by both players in Test '+n:'';
      if(latest.lastResolved?.[step]>n)first.textContent+=' · Latest joint fix: Test '+latest.lastResolved[step];
      const timeline=section.querySelector('[data-pad-history]');
      if(timeline)void drawEpisodes(timeline,latest,false,busy);
      void drawHistory(section.querySelector('[data-test-history]'),latest);
      for(const r of roles){
        const slot=section.querySelector('[data-room-photo="'+r+'"]'),id=latest.photos?.[r][step]||'';
        if((slot.dataset.photoId||'')!==id){
          slot.dataset.photoId=id;
          if(id){
            const path=photoUrl(step,r,id);
            slot.innerHTML=screenshot(path,names[r]+' · '+stepLabels.get(step),true);
          }else slot.textContent='No screenshot shared';
        }
        const result=startingRetest(step)?null:latest.retests?.[r][step];
        section.querySelector('[data-role-retest="'+r+'"]').textContent=result==='resolved'?'Retest: resolved':result==='different'?'Retest: still different':'Retest pending';
      }
      const resolved=roles.every(r=>latest.retests?.[r][step]==='resolved');
      section.querySelector('[data-resolution]').textContent=resolved?'Resolved by both players':'Open · both players must confirm the fix';
      section.querySelector('[data-retest-actions]').hidden=!latest.role;
      for(const b of section.querySelectorAll('[data-retest]')){
        b.disabled=busy;b.setAttribute('aria-pressed',String(!startingRetest(step)&&latest.retests?.[latest.role]?.[step]===b.dataset.retest));
      }
    }
    for(const form of root.querySelectorAll('[data-note-form]')){
      form.hidden=!latest.role;
      if(!latest.role)continue;
      const step=form.dataset.noteForm,current=(latest.archivedCounts?.[step]||0)+1,role=latest.role;
      const existing=!!latest.archivedCounts[step]||roles.some(r=>latest.notes[r][step]||latest.photos?.[r][step]);
      const needsNext=latest.review?.[step]===current || !!(latest.notes[role][step]||latest.photos?.[role][step]) || roles.every(r=>latest.retests?.[r][step]==='resolved');
      const target=form.querySelector('[data-target-test]'),choices=needsNext?[current+1]:existing?[current,current+1]:[current];
      if(target.dataset.choices!==choices.join(',')){
        // Keep an explicitly selected test if a partner starts it while this player is composing.
        const previous=Number(target.value);
        const stale=previous && !choices.includes(previous) && !busy && (form.querySelector('textarea').value.trim() || form.querySelector('input').files.length);
        target.innerHTML=(stale?'<option value="" disabled>Test '+previous+' closed · choose a test</option>':'')+choices.map(n=>`<option value="${n}">Test ${n}</option>`).join('');
        target.value=stale?'':String(choices.includes(previous)?previous:choices[0]);target.dataset.choices=choices.join(',');
      }
      form.querySelector('[data-number-picker]').hidden=false;
      form.querySelector('[data-save-note]').disabled=busy||!form.querySelector('[data-target-test]').value||!(form.querySelector('[data-pad-result]')?.value || form.querySelector('textarea').value.trim() || form.querySelector('input').files.length);
    }
    let complete=0;
    for(const node of root.querySelectorAll('[data-marks]')){
      const checked=roles.filter(r=>latest.checks[r][node.dataset.marks]);
      const report=!!latest.archivedCounts[node.dataset.marks]||roles.some(r=>latest.notes[r][node.dataset.marks]||latest.photos?.[r][node.dataset.marks]);
      const done=report?roles.every(r=>latest.retests?.[r][node.dataset.marks]==='resolved'):checked.length===2;
      if(done)complete++;
      const step=node.dataset.marks;
      const readers=roles.filter(r=>latest.occupied[r] && Date.now()-latest.seen[r]<45000 && latest.views[r]===step);
      node.parentElement.querySelector('[data-readers]').textContent=readers.length?'Viewing: '+readers.map(r=>names[r]).join(' + '):'';
      const differences=roles.filter(r=>latest.notes[r][step]&&!latest.checks[r][step]);
      node.textContent=report?(done?'Resolved by both players · Test '+((latest.archivedCounts?.[step]||0)+1):'Open · retest needed'):checked.length===2?'Both confirmed':[...checked.map(r=>names[r]+' confirmed'),...differences.map(r=>names[r]+' reported a difference')].join(' · ');
    }
    root.querySelector('[data-room-total]').textContent=complete+' of '+lesson.steps.length+' checkpoints confirmed by both players';
  }
  function accept(result){
    if(!active)return;
    if(!latest){
      recentRoom=room;
      try{localStorage.setItem(recentKey,room);}catch{}
    }
    if(!latest||result.revision>=latest.revision)latest=result;
    paint();
  }
  const readyMessage=()=>latest?.role?'Connected. Your checks are shared with your friend.':'Connected. Choose an available role.';
  async function read(){
    if(!active||busy||reading||document.hidden)return;
    reading=true;
    try{
      accept(await call('read'));
      if(active && !busy && latest.role && landing){
        const target=landing;
        if(latest.views[latest.role]===target || await change('view',{role:latest.role,step:target,advance:latest.advance}))landing=null;
      }
      if(active&&!busy && status.textContent!==readyMessage())status.textContent=readyMessage();
    }
    catch(e){if(active&&!busy)status.textContent=e.message.startsWith('Room not found')?e.message:'Connection interrupted. Reconnecting…';}
    finally{reading=false;}
  }
  async function change(action,fields){
    if(busy)return;
    busy=true;pendingCheck=action==='check'?fields:null;paint();status.textContent='Saving…';
    try{accept(await call(action,fields));if(active)status.textContent=readyMessage();return true;}
    catch(e){if(active){status.textContent='Change unconfirmed. '+e.message;try{accept(await call('read'));}catch{}}}
    finally{
      pendingCheck=null;busy=false;paint();
      const next=queuedView;
      queuedView=null;
      if(active && next && latest?.role && latest.advance===next.advance && displayed!==next.step){
        void change('view',{role:latest.role,...next});
      }
    }
  }
  root.onclick=async e=>{
    if(e.target.closest('[data-review-mode]') && latest?.role){
      landing=inspecting=null;
      await change('review',{role:latest.role,step:displayed,enabled:!latest.review});return;
    }
    if(e.target.closest('[data-report-pdf]')){
      if(exporting||busy||!latest)return;
      exporting=true;paint();
      const message=root.querySelector('[data-pdf-status]');
      const progress=text=>{message.textContent=text;};
      try{
        progress('Preparing shared test report…');
        const [snapshot,{makeDuelReport}]=await Promise.all([call('read'),import('../vendor/duel-report.js')]);
        const pdf=await makeDuelReport({steps:lesson.steps,snapshot,history:(step,number)=>call('history',{step,number}),photoUrl,room,roomUrl,progress});
        if(active){
          const url=URL.createObjectURL(pdf),a=document.createElement('a');
          a.href=url;a.download='Godot-duel-'+room.slice(0,8)+'-'+new Date().toISOString().slice(0,10)+'.pdf';
          document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
          progress('PDF downloaded.');
        }
      }catch{progress('Could not download the complete report. Check your connection and try again.');}
      finally{exporting=false;paint();}
      return;
    }
    const summary=e.target.closest('.room-step > summary');
    if(summary && (latest?.role || busy)){
      e.preventDefault();
      const step=summary.parentElement.dataset.stepId;
      landing=inspecting=null;
      if(busy){queuedView={step,advance:latest.advance};return;}
      if(step!==displayed)await change('view',{role:latest.role,step,advance:latest.advance});
      return;
    }
    const timeline=e.target.closest('[data-pad-history]');
    if(timeline){
      const photoButton=e.target.closest('[data-enlarge]');
      if(photoButton){
        e.stopPropagation();
        const card=photoButton.closest('[data-evidence-photo]');
        if(card && !busy)await photoViewer.open(card,timeline.dataset.padHistory);
        return;
      }
      const attempt=e.target.closest('[data-episode-test]'),start=e.target.closest('[data-retry-pad]');
      const toggle=e.target.closest('[data-history-mode]');
      if(toggle || attempt || e.target.closest('[data-reload-episodes]')){
        if((toggle||attempt) && latest?.role){
          if(busy)return;
          const fields={role:latest.role,step:timeline.dataset.padHistory,epoch:latest.historyView?.epoch||0,
            advance:latest.advance,number:Number(attempt?.dataset.episodeTest||timeline.dataset.shown)};
          if(toggle)fields.enabled=!latest.historyView?.together;
          if(!await change(toggle?'history-mode':'history-pick',fields)){
            timeline.querySelector('[data-episode-status]').textContent=status.textContent;return;
          }
        }else if(attempt)timeline.dataset.selected=attempt.dataset.episodeTest;
        await drawEpisodes(timeline,latest,true,busy);
        if(attempt)timeline.querySelector('[data-episode-evidence] h5')?.focus();
        return;
      }
      if(start && latest?.role && !busy){
        const step=timeline.dataset.padHistory;
        landing=inspecting=null;
        if(await change('retry-pad',{role:latest.role,step,number:Number(start.dataset.attempt),
          reportVersion:Number(start.dataset.version),failed:Number(start.dataset.retryPad)})){
          timeline.closest('[data-comparison]').querySelector('[data-retest="resolved"]').focus();
        }else timeline.querySelector('[data-episode-status]').textContent=status.textContent;
        return;
      }
    }
    const retry=e.target.closest('[data-history-retry]');
    if(retry){void drawHistory(retry.closest('[data-test-history]'),latest,true);return;}
    const retest=e.target.closest('[data-retest]');
    if(retest && latest?.role){
      const step=retest.closest('[data-comparison]').dataset.comparison;
      await change('retest',{step,role:latest.role,result:retest.dataset.retest,reportVersion:latest.reportVersions?.[step]||0,advance:latest.advance});
      return;
    }
    const save=e.target.closest('[data-save-note]');
    if(save && latest?.role){
      const form=save.closest('[data-note-form]'),input=form.querySelector('textarea'),text=input.value;
      const picker=form.querySelector('[data-photo-input]'),photo=picker.files[0];
      const observed=form.querySelector('[data-pad-result]')?.value;
      const success=await change('note',{role:latest.role,step:save.dataset.saveNote,number:Number(form.querySelector('[data-target-test]').value),text,photo,padResult:observed?observed==='yes':undefined});
      if(success && picker.files[0]===photo)resetFiles.get(form)();
      if(success && observed && form.querySelector('[data-pad-result]').value===observed)form.querySelector('[data-pad-result]').value='';
      if(success && input.value===text)input.value='';
      form.querySelector('[data-note-status]').textContent=success?'Difference shared.':status.textContent+' Your draft is here to retry.';
      paint();return;
    }
    if(e.target.closest('[data-room-copy]')){
      try{await navigator.clipboard.writeText(link.value);status.textContent='Room link copied.';}catch{link.select();status.textContent='Copy the selected room link.';}
    }
    const claim=e.target.closest('[data-claim]');
    if(claim){
      const claimed=await change('claim',{role:claim.dataset.claim});
      if(claimed&&landing)void read();
    }
    if(e.target.closest('[data-release]')&&latest?.role)change('release',{role:latest.role});
  };
  root.oninput=e=>{
    const form=e.target.closest('[data-note-form]');
    if(form){form.querySelector('[data-save-note]').disabled=busy||!form.querySelector('[data-target-test]').value||!(form.querySelector('[data-pad-result]')?.value || form.querySelector('textarea').value.trim() || form.querySelector('input').files.length);form.querySelector('[data-note-status]').textContent='';}
  };
  root.onchange=e=>{
    const box=e.target;
    if(box.closest('[data-test-history]')){void drawHistory(box.closest('[data-test-history]'),latest);return;}
    if(box.dataset.roomRole)change('check',{role:box.dataset.roomRole,step:box.dataset.id,checked:box.checked,reportVersion:latest.reportVersions?.[box.dataset.id]||0,advance:latest.advance});
  };
  read();
  const timer=setInterval(read,1000);
  document.addEventListener('visibilitychange',read);
  return ()=>{active=false;clearInterval(timer);document.removeEventListener('visibilitychange',read);};
}
