import {codeWords} from './code-words.js';
import {esc} from './ui.js';

const tokens = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|nodes\/root_scale\b|animation\/import\b|@[a-zA-Z_]\w*|[a-zA-Z_]\w*|\d+(?:\.\d+)?|:=|->|==|!=|<=|>=|\+=|-=|\*=|\/=|[^\s]/g;
function wordButton(term,label) {
  return `<button type="button" class="code-word" data-word="${esc(term)}" aria-haspopup="dialog" aria-label="Explain ${esc(term)}">${esc(label)}</button>`;
}

export function readableCode(source,scene=false) {
  let result='',end=0;
  for(const match of source.matchAll(tokens)){
    const text=match[0];
    result+=esc(source.slice(end,match.index));
    let term=text;
    if(/^["']/.test(text)){
      const inside=text.slice(1,-1);
      if(inside.startsWith('res://'))term='res://';
      else if(inside.startsWith('user://'))term='user://';
      else term=(scene||inside==='parameters/blend_position')?inside:'';
    }
    // Scene sections use brackets and resource names have a different grammar from GDScript.
    if(scene && !/[A-Za-z]/.test(term))term='';
    result+=Object.hasOwn(codeWords,term)?wordButton(term,text):esc(text);
    end=match.index+text.length;
  }
  return result+esc(source.slice(end));
}

export function wordReference() {
  return `<section class="panel word-library"><h2>Code word reference</h2><label for="find-word">Find a keyword, function or symbol</label><input id="find-word" type="search" placeholder="Try if, get_tree or ==" autocomplete="off"><div data-word-results></div></section>`;
}

export function findWords(container,query) {
  const all=Object.keys(codeWords), value=query.trim().toLowerCase().replace(/^(\w+)\(\)$/,'$1');
  const matches=value?all.filter(term=>term.toLowerCase().includes(value)).sort((a,b)=>Number(b.toLowerCase()===value)-Number(a.toLowerCase()===value)):['if','func','get_tree','change_scene_to_file','connect','return'];
  container.innerHTML=matches.length?matches.map(term=>wordButton(term,term)).join(' '):'<p>No matching term. Try a shorter name.</p>';
}

export function openWord(term) {
  if(!Object.hasOwn(codeWords,term))return;
  const {meaning,usage,example}=codeWords[term];
  const dialog=document.querySelector('#word-dialog');
  dialog.innerHTML=`<form method="dialog"><button class="secondary">Close</button></form><div><h2 id="word-title"><code>${esc(term)}</code></h2><p>${esc(meaning)}</p><h3>How to use it</h3><p>${esc(usage)}</p><pre><code>${esc(example)}</code></pre></div>`;
  dialog.showModal();
}
