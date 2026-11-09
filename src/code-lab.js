import {challenges,runChallenge,explainCode} from './gd-practice.js';
import {icon,esc} from './ui.js';
import {previewMarkup,mountPreview} from './arena-preview.js';
const drafts=new Map(),results=new Map();
const key=id=>'battle-lab.code.v1.'+id;
export function draft(id){
  try{
    const saved=localStorage.getItem(key(id));
    if(saved!==null)drafts.set(id,saved);
  }catch{}
  return drafts.get(id)??challenges[id].starter;
}
export function saveDraft(id,code){
  drafts.set(id,code);results.delete(id);
  try{localStorage.setItem(key(id),code);window.dispatchEvent(new Event("battle-code-changed"));}catch{}
}
export function lineNotes(id,code){
  return explainCode(code,id).map(n=>`<li><small>Line ${n.line}</small><code>${esc(n.source)}</code><span>${esc(n.meaning)}</span></li>`).join('');
}
export function explainPanel(id,code){
  return `<details class="line-guide" data-explain="${id}"><summary>Read this code line by line</summary><ol>${lineNotes(id,code)}</ol></details>`;
}
function numbers(code){return code.split('\n').map((_,i)=>i+1).join('\n');}
function inputLabel(inputs){
  return Object.entries(inputs).map(([name,v])=>name+' = '+JSON.stringify(v)).join(', ')||'On scene start';
}
function report(id,r){
  const c=challenges[id];
  const arena=c.preview?previewMarkup(c.preview):'';
  if(!r||r.kind==='preview'){
    const lines=r?.runs?.[0]||[];
    return arena+(lines.length?'<pre>'+esc(lines.join('\n'))+'</pre>':'');
  }
  return `<div class="run-result ${r.kind}"><strong role="status">${r.kind==='success'?'Passed':r.kind==='error'?'Code error':'Check your result'}</strong>
    ${r.line?`<button type="button" data-error-line="${r.line}">Go to line ${r.line}</button>`:''}<p>${esc(r.message)}</p>
    ${r.runs.map((lines,i)=>`<div class="case-output"><small>${esc(inputLabel(c.cases?.[i]?.inputs||c.inputs))} · Actual output</small><pre>${esc(lines.join('\n')||'(no output)')}</pre></div>`).join('')}</div>`;
}
export function codeLab(id){
  if(!Object.hasOwn(challenges,id))return '';
  const c=challenges[id],code=draft(id);
  return `<section class="code-lab" data-code-lab="${id}"><div class="panel-label">${icon('code',15)} CODING PRACTICE</div><h3>${esc(c.title)}</h3><p>${esc(c.prompt)}</p>
    <label for="practice-source">Your GDScript</label><div class="signature"><code>${esc(c.signature)}</code></div>
    <div class="edit-wrap"><pre class="line-nums" aria-hidden="true">${numbers(code)}</pre><textarea id="practice-source" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="body-help" maxlength="12000"></textarea></div>
    <small id="body-help">Enter the function body starting at line 1. Indent nested blocks with four spaces.</small>
    ${explainPanel(id,code)}<button class="primary" type="button" data-run-code>${icon('play',14)} Run code</button><div class="code-response" aria-live="${c.preview?'off':'polite'}">${report(id,results.get(id))}</div>
    <details class="trouble"><summary>${c.preview?'How the preview works':'Expected output &amp; supported syntax'}</summary><div class="practice-help">${c.preview?esc(c.guide):c.cases.map(t=>`<small>${esc(inputLabel(t.inputs))}</small><pre>${esc(t.expected.join('\n'))}</pre>`).join('')}<p>This browser runner supports the subset used here: variables, numbers, text, comparisons, +, −, *, assignments, print(), signal emission, and for / if / else. Run full scripts in the downloadable Godot project.</p></div></details></section>`;
}
export function mountCodeLab(app){
  const el=app.querySelector('[data-code-lab]');if(!el)return;
  const id=el.dataset.codeLab,ta=el.querySelector('textarea'),gutter=el.querySelector('.line-nums'),out=el.querySelector('.code-response');
  ta.value=draft(id);
  mountPreview(out.querySelector('[data-arena]'),results.get(id),false);
  function sync(){
    el.querySelector('[data-explain] ol').innerHTML=lineNotes(id,ta.value);
    saveDraft(id,ta.value);if(!out.dataset.editing){out.innerHTML=report(id,null);mountPreview(out.querySelector('[data-arena]'),null,false);out.dataset.editing='1';}
    gutter.textContent=numbers(ta.value);gutter.scrollTop=ta.scrollTop;
  }
  ta.addEventListener('input',sync);
  ta.addEventListener('scroll',()=>{gutter.scrollTop=ta.scrollTop;});
  function run(){const result=runChallenge(id,ta.value);results.set(id,result);out.innerHTML=report(id,result);delete out.dataset.editing;mountPreview(out.querySelector('[data-arena]'),result,true);}
  el.querySelector('[data-run-code]').addEventListener('click',run);
  ta.addEventListener('keydown',e=>{
    if(e.isComposing)return;
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();run();return;}
    if(e.key==='Enter'){
      e.preventDefault();
      const before=ta.value.slice(0,ta.selectionStart).split('\n').at(-1);
      const indent=before.match(/^\s*/)[0]+(before.trimEnd().endsWith(':')?'    ':'');
      ta.setRangeText('\n'+indent,ta.selectionStart,ta.selectionEnd,'end');sync();
    }
  });
  out.addEventListener('click',e=>{
    const button=e.target.closest('[data-error-line]');if(!button)return;
    const idx=Number(button.dataset.errorLine)-1,rows=ta.value.split('\n');
    const start=rows.slice(0,idx).reduce((sum,row)=>sum+row.length+1,0);
    ta.focus();ta.setSelectionRange(start,start+(rows[idx]?.length||0));ta.scrollTop=Math.max(0,idx*21-42);
  });
}
