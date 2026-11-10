import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

const roles=['host','guest'];
const roleName={host:'Host · P1',guest:'Guest · P2'};

export function testHistoryPanel(step){
  return `<section data-test-history="${step}" hidden><h4>Compare test attempts</h4>
    <div class="room-screens"><label>Before <select data-before></select></label><label>After <select data-after></select></label></div>
    <div data-test-grid></div><p data-history-status role="status"></p><button class="secondary" data-history-retry hidden>Retry loading tests</button></section>`;
}

export function mountTestHistory(root,call,photoUrl){
  const cache=new Map();
  async function archive(step,number){
    const key=step+'/'+number;
    if(!cache.has(key))cache.set(key,call('history',{step,number}).catch(e=>{cache.delete(key);throw e;}));
    return cache.get(key);
  }
  return async function draw(panel,latest,force=false){
    const step=panel.dataset.testHistory,current=(latest.archivedCounts?.[step]||0)+1;
    panel.hidden=current<2;
    if(panel.hidden||!panel.closest('details').open)return;
    const before=panel.querySelector('[data-before]'),after=panel.querySelector('[data-after]');
    if(Number(panel.dataset.count)!==current){
      const options=Array.from({length:current},(_,i)=>`<option value="${i+1}">Test ${i+1}</option>`).join('');
      before.innerHTML=options;after.innerHTML=options;
      before.value=String(current-1);after.value=String(current);panel.dataset.count=current;
    }
    const numbers=[Number(before.value),Number(after.value)];
    const live=Object.fromEntries(roles.map(r=>[r,{text:latest.notes[r][step]||'',photo:latest.photos[r][step]||'',result:latest.retests[r][step]||'pending'}]));
    const key=JSON.stringify([numbers,current,numbers.includes(current)?live:null]);
    if(!force&&panel.dataset.key===key)return;
    panel.dataset.key=key;
    const status=panel.querySelector('[data-history-status]'),grid=panel.querySelector('[data-test-grid]'),retry=panel.querySelector('[data-history-retry]');
    status.textContent='Loading test comparison…';retry.hidden=true;
    try{
      const records=await Promise.all(numbers.map(n=>n===current?live:archive(step,n)));
      if(!root.isConnected||panel.dataset.key!==key)return;
      grid.innerHTML=roles.map(r=>`<h5>${roleName[r]}</h5><div class="room-screens">${records.map((attempt,i)=>{
        const {photo,text,result}=attempt[r],label=roleName[r]+' · Test '+numbers[i];
        return `<div><b>Test ${numbers[i]}</b>${photo?screenshot(photoUrl(step,r,photo),label,true):'<p>No screenshot shared</p>'}<p class="room-observation">${esc(text)||'No note shared'}</p><p>${result==='resolved'?'Resolved':result==='different'?'Still different':'Retest pending'}</p></div>`;
      }).join('')}</div>`).join('');
      status.textContent='';
    }catch{
      if(panel.dataset.key!==key)return;
      grid.replaceChildren();status.textContent='Could not load this comparison.';retry.hidden=false;
    }
  };
}
