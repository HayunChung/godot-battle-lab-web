import {blankRecord,capture,mergeRecords,unpack} from './sync-record.js';
import {challenges} from './gd-practice.js';

export const PUBLIC='https://hayunchung.github.io/godot-battle-lab-web/';
export const ORIGINAL='https://godot-battle-lab.humbleray65.chatgpt.site';
const SLOT='battle-lab.paired-progress.v1';
const codePrefix='battle-lab.code.v1.';
const validKey=k=>typeof k==='string'&&/^[0-9a-f]{64}$/.test(k);
const ids=Object.keys(challenges);

export function deviceSync(lessons,getState,apply) {
  let key='',record=blankRecord(),timer,running,dirty=false;
  let status='Progress is saved in this browser.';
  let local;
  try{local=JSON.parse(localStorage.getItem(SLOT));}catch{}
  if(validKey(local?.key)&&local?.record?.version===1){
    key=local.key;record=local.record;
  }
  function tell(text) {
    status=text;
    for(const node of document.querySelectorAll('[data-sync-status]'))node.textContent=status;
  }
  function store() {
    try{localStorage.setItem(SLOT,JSON.stringify({key,record}));return true;}catch{return false;}
  }
  function readDrafts(){
    const drafts={};
    try{for(const id of ids){const v=localStorage.getItem(codePrefix+id);if(v!==null)drafts[id]=v;}}catch{}
    return drafts;
  }
  function changed(){
    if(!key)return;
    const now=Date.now();
    capture(record,getState(),readDrafts(),now);
    if(getState().last)record.fields.last=[now,getState().last];
    store();dirty=true;tell('Saving progress…');
    clearTimeout(timer);timer=setTimeout(()=>refresh(),250);
  }
  async function request(action,secret,extra={}){
    const r=await fetch(ORIGINAL+'/api/progress',{method:'POST',credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',headers:{'Content-Type':'text/plain'},body:JSON.stringify({action,key:secret,...extra}),signal:AbortSignal.timeout(15000)});
    if(r.status===404 && action==='read')return null;
    if(r.status===409)return {conflict:true};
    if(!r.ok)throw Error('Connection failed');
    return r.json();
  }
  function applyRecord() {
    const {state,drafts}=unpack(record,lessons,ids);
    let draftChanged=false;
    try{for(const [id,value] of Object.entries(drafts)){
      if(localStorage.getItem(codePrefix+id)!==value){localStorage.setItem(codePrefix+id,value);draftChanged=true;}
    }}catch{}
    apply(state,draftChanged);
  }
  async function exchange(){
    let again=true;
    while(again){
      dirty=false;
      const remote=await request('read',key);
      if(!remote)throw Error('Link not found');
      record=mergeRecords(remote.document,record);
      // Reconcile local state before awaiting another write, so new edits build on this merge.
      applyRecord();store();
      if(JSON.stringify(record)!==JSON.stringify(remote.document)){
        const saved=await request('save',key,{revision:remote.revision,document:record});
        if(saved.conflict){dirty=true;continue;}
      }
      again=dirty;
    }
    tell('Progress is synced.');
    return true;
  }
  function refresh(){
    if(!key)return Promise.resolve(false);
    if(running)return running;
    running=exchange().catch(()=>{tell('Sync is unavailable. Your progress is kept on this device.');return false;}).finally(()=>{running=null;});
    return running;
  }
  async function connect(secret){
    if(running)await running;
    if(secret && !validKey(secret))throw Error('Invalid personal link.');
    if(key && secret && secret!==key)throw Error('This browser is paired with a different link. Use another browser profile to open this link.');
    if(!key){
      const localRecord=capture(blankRecord(),getState(),readDrafts(),secret?0:Date.now());
      if(secret){
        const remote=await request('read',secret);
        if(!remote)throw Error('This personal link could not be found.');
        record=mergeRecords(localRecord,remote.document);key=secret;
      }else{
        const generated=Array.from(crypto.getRandomValues(new Uint8Array(32)),v=>v.toString(16).padStart(2,'0')).join('');
        const saved=await request('save',generated,{revision:0,document:localRecord});
        if(saved.conflict)throw Error('Please try creating the link again.');
        key=generated;record=localRecord;
      }
      applyRecord();store();
    }
    if(!await refresh())throw Error('Cannot reach sync yet. Reconnect and try again.');
    return PUBLIC+'#/pair/'+key;
  }
  window.addEventListener('online',refresh);
  window.addEventListener('focus',refresh);
  window.addEventListener('battle-code-changed',changed);
  document.addEventListener('visibilitychange',()=>{if(!document.hidden||dirty)refresh();});
  setInterval(()=>{if(key&&!document.hidden)refresh();},20000);
  return {changed,refresh,connect,get paired(){return Boolean(key);},get status(){return status;}};
}
