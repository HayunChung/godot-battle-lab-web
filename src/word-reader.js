import {engineReference} from './engine-reference.js';
import {sourceReference} from './source-reference.js';
import {codeWords} from './code-words.js';
import {esc} from './ui.js';

const tokens = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|(?:res|user):\/\/[\w./-]+|%[A-Z]\w*|parameters\/blend_position|tracks\/\d+\/path|theme_override_constants\/outline_size|nodes\/root_scale\b|animation\/import\b|@[a-zA-Z_]\w*|[a-zA-Z_]\w*|\d+(?:\.\d+)?|:=|->|==|!=|<=|>=|\+=|-=|\*=|\/=|[^\s]/g;
function wordButton(term,label,path='') {
  return `<button type="button" class="code-word" data-word="${esc(term)}" ${path?`data-word-source="${esc(path)}"`:''} aria-haspopup="dialog" aria-label="Explain ${esc(term)}">${esc(label)}</button>`;
}

export function readableCode(source,scene=false,path='') {
  let result='',end=0;
  for(const match of source.matchAll(tokens)){
    const text=match[0];
    result+=esc(source.slice(end,match.index));
    let term=text;
    if(/^["']/.test(text)){
      const inside=text.slice(1,-1);
      if(Object.hasOwn(codeWords,text))term=text;
      else if(Object.hasOwn(codeWords,inside)||sourceReference(path,inside)?.priority>0)term=inside;
      else if(inside.startsWith('res://'))term='res://';
      else if(inside.startsWith('user://'))term='user://';
      else term='';
    } else if(text.startsWith('%') && text.length>1 && !Object.hasOwn(codeWords,text)){
      term='%';
    } else if(/^(res|user):\/\//.test(text)&&!Object.hasOwn(codeWords,text)){
      term=text.split('://')[0]+'://';
    }
    // Scene sections use brackets and resource names have a different grammar from GDScript.
    if(scene && !/[A-Za-z]/.test(term))term='';
    result+=(Object.hasOwn(codeWords,term)||Object.hasOwn(engineReference,term)||sourceReference(path,term))?wordButton(term,text,path):esc(text);
    end=match.index+text.length;
  }
  return result+esc(source.slice(end));
}

export function wordReference() {
  return `<section class="panel word-library"><h2>Code word reference</h2><label for="find-word">Find a keyword, function or symbol</label><input id="find-word" type="search" placeholder="Try if, get_tree or ==" autocomplete="off"><div data-word-results></div></section>`;
}

export function findWords(container,query) {
  const all=[...new Set([...Object.keys(codeWords),...Object.keys(engineReference)])], value=query.trim().toLowerCase().replace(/^(\w+)\(\)$/,'$1');
  const matches=value?all.filter(term=>term.toLowerCase().includes(value)).sort((a,b)=>Number(b.toLowerCase()===value)-Number(a.toLowerCase()===value)):['if','func','get_tree','change_scene_to_file','connect','return'];
  container.innerHTML=matches.length?matches.map(term=>wordButton(term,term)).join(' '):'<p>No matching term. Try a shorter name.</p>';
}

export function openWord(term,path='') {
  const local=sourceReference(path,term);
  const api=Object.hasOwn(engineReference,term)?engineReference[term]:[];
  const curated=Object.hasOwn(codeWords,term)?codeWords[term]:null;
  if(!curated && !local && !api.length)return;
  const entry=curated || (local?.priority>0?local:null) || (api.length?{
    meaning:'Godot 4.4 '+api[0][0]+'. '+api[0][1],
    usage:local?.usage || 'Select the matching class below to read its definition and usage in the engine reference.',
    example:local?.example || api[0][1]
  }:local);
  const {meaning,usage,example}=entry;
  const links=!curated && api.length && !(local?.priority>0)?api.map(([,label,url])=>`<p><a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a></p>`).join(''):'';

  const dialog=document.querySelector('#word-dialog');
  dialog.innerHTML=`<form method="dialog"><button class="secondary">Close</button></form><div><h2 id="word-title"><code>${esc(term)}</code></h2><p>${esc(meaning)}</p><h3>How to use it</h3><p>${esc(usage)}</p><pre><code>${esc(example)}</code></pre>${links}</div>`;
  dialog.showModal();
}
