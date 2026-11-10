import {padTests,expectedPadResult,padResultLabel,padValue,recurrenceHistory} from './pad-results.js';
import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

const roles=['host','guest'];
const names={host:'Host · P1',guest:'Guest · P2'};

export function padHistoryPanel(step){
  return `<section data-pad-history="${step}" class="pad-history"><h4>Pad recurrence history</h4>
    <p data-episode-count role="status"></p>
    <div data-browse-controls hidden><button class="secondary" data-history-mode aria-pressed="false">View together</button>
    <p data-browse-hint></p><div class="room-screens" aria-label="Test selection" aria-live="polite">
    ${roles.map(r=>`<p><b>${names[r]}</b> <span data-browsing="${r}"></span></p>`).join('')}</div></div><div data-episode-list></div>
    <div data-episode-evidence></div><p data-episode-status role="status"></p>
    <button class="secondary" data-reload-episodes hidden>Retry loading history</button></section>`;
}

export function mountPadHistory(archive,photoUrl){
  return async function draw(panel,latest,force=false,busy=false){
    if(!panel.closest('[data-step-id]').open)return;
    const id=panel.dataset.padHistory,current=(latest.archivedCounts[id]||0)+1;
    const step={id,current,firstResolved:latest.firstResolved[id],lastResolved:latest.lastResolved?.[id]};
    const live=Object.fromEntries(roles.map(r=>[r,{
      text:latest.notes[r][id],photo:latest.photos[r][id],result:latest.retests[r][id],
      padResult:latest.padResults?.[r]?.[id]??(latest.checks[r][id]?expectedPadResult(id,r):undefined)
    }]));
    const browsing=latest.historyView;
    const here=roles.map(r=>latest.occupied[r] && latest.views[r]===id);
    const online=roles.map(r=>Date.now()-latest.seen[r]<45000);
    const key=JSON.stringify([step,live,panel.dataset.selected,latest.targeted,latest.role,browsing,here,online,latest.views,latest.occupied,busy]);
    if(!force && panel.dataset.key===key)return;
    panel.dataset.key=key;
    const list=panel.querySelector('[data-episode-list]'),detail=panel.querySelector('[data-episode-evidence]');
    const status=panel.querySelector('[data-episode-status]'),retry=panel.querySelector('[data-reload-episodes]');
    retry.hidden=true;
    if(!list._rows && !panel.querySelector('[data-episode-count]').textContent)status.textContent='Loading recurrence history…';
    try{
      const attempts=new Map([[current,live]]);
      if(step.firstResolved && step.firstResolved!==current)attempts.set(step.firstResolved,await archive(id,step.firstResolved));
      const episodes=await recurrenceHistory(step,attempts,archive);
      if(!panel.isConnected || panel.dataset.key!==key)return;
      const count=panel.querySelector('[data-episode-count]');
      const summary=episodes.length+' '+(episodes.length===1?'recurrence':'recurrences');
      if(count.textContent!==summary)count.textContent=summary;
      const stages=episodes.flatMap(e=>[e.passed,e.failed,e.fixed].filter(Boolean));
      const fallback=episodes.at(-1)?.failed;
      const chosen=r=>browsing?.picks[r]?.[id];
      const visibleNumber=n=>stages.includes(n)?n:fallback;
      const selected=visibleNumber(latest.role?chosen(latest.role):Number(panel.dataset.selected));
      panel.dataset.shown=selected||'';
      panel.querySelector('[data-browse-controls]').hidden=!episodes.length;
      const mode=panel.querySelector('[data-history-mode]');
      mode.disabled=busy||!latest.role;
      mode.setAttribute('aria-pressed',String(!!browsing?.together));
      mode.textContent='View together: '+(browsing?.together?'On':'Off');
      panel.querySelector('[data-browse-hint]').textContent=browsing?.together?'Choose a test or enlarge a screenshot to view it together. Select a spot on the photo to show your friend.':'Each player can compare a different test.';
      roles.forEach((r,i)=>{
        const otherStep=latest.views[r],otherPick=browsing?.picks[r]?.[otherStep];
        const prefix=online[i]?'Viewing ':'Last viewed ';
        const elsewhere=padTests[otherStep] && otherPick?prefix+padTests[otherStep]+' · Test '+otherPick:'At another step';
        const msg=!latest.occupied[r]?'Waiting for player':here[i]?prefix+'Test '+visibleNumber(chosen(r)):elsewhere;
        const label=panel.querySelector('[data-browsing="'+r+'"]');
        if(episodes.length && label.textContent!==msg)label.textContent=msg;
      });
      const active=latest.targeted?.step===id && latest.targeted.number===current;
      const negative=roles.some(r=>live[r].result==='different' ||
        (typeof live[r].padResult==='boolean' && live[r].padResult!==expectedPadResult(id,r)));
      const rows=episodes.map((e,i)=>{
        const buttons=[['Joint pass',e.passed],['Failed again',e.failed],['Joint fix',e.fixed]].map(([label,n])=>n?
          `<button class="secondary" ${busy?'disabled':''} data-episode-test="${n}" aria-pressed="${selected===n}">${label} · Test ${n}</button>`:
          '<span>Joint fix pending</span>').join(' ');
        const changed=roles.map(r=>{
          const actual=padValue(step,attempts.get(e.failed)[r],r,'relapse'),normal=expectedPadResult(id,r);
          return `${names[r]}: ${padResultLabel(id,normal)} → ${typeof actual==='boolean'?padResultLabel(id,actual):'Unrecorded'}${typeof actual==='boolean' && normal!==actual?' (changed)':''}`;
        }).join(' · ');
        const action=e.fixed?'':!latest.role?'<p>Choose a role to retest together.</p>':active&&!negative?
          `<p>Retesting together · Test ${current}. Run this step in Godot, then each choose a result below.</p>`:
          `<button class="primary" data-retry-pad="${e.failed}" data-attempt="${current}" data-version="${latest.reportVersions[id]||0}">Retest this recurrence together</button>`;
        return `<div class="pad-episode"><b>Recurrence ${i+1}</b><div class="episode-tests">${buttons}</div><p>${changed}</p>${action}</div>`;
      }).join('');
      if(list._rows!==rows){
        const focus=document.activeElement;
        const index=[...list.querySelectorAll('button')].indexOf(focus);
        list.innerHTML=rows;list._rows=rows;
        if(index>=0)list.querySelectorAll('button')[index]?.focus({preventScroll:true});
      }
      if(selected){
        const data=attempts.get(selected);
        const phase=episodes.some(e=>e.failed===selected)?'relapse':'fixed';
        const cards=roles.map(r=>{
          const entry=data[r],value=padValue(step,entry,r,phase);
          const label=names[r]+' · Test '+selected;
          return `<div data-photo-side="${r}" data-evidence-photo="${esc(entry.photo||'')}" data-test-number="${selected}"><b>${names[r]}</b><p>Pad: ${typeof value==='boolean'?padResultLabel(id,value):'Unrecorded'}</p>
            ${entry.photo?screenshot(photoUrl(id,r,entry.photo),label,true):'<p>No screenshot shared</p>'}
            <p class="room-observation">${esc(entry.text||'No note shared')}</p></div>`;
        }).join('');
        const markup=`<h5 tabindex="-1">Test ${selected} · player observations</h5><div class="room-screens">${cards}</div>`;
        if(detail._markup!==markup){detail.innerHTML=markup;detail._markup=markup;}
        const move=browsing?.move;
        if(browsing?.together && move?.step===id && panel.dataset.move!==String(move.sequence)){
          panel.dataset.move=String(move.sequence);
          if(latest.role && move.role!==latest.role && move.number===selected)detail.scrollIntoView({block:'nearest'});
        }
      }else{detail.replaceChildren();detail._markup='';}
      status.textContent='';
    }catch{
      if(panel.dataset.key!==key)return;
      list.replaceChildren();list._rows='';detail.replaceChildren();detail._markup='';
      status.textContent='Could not load the recurrence history.';retry.hidden=false;
    }
  };
}
