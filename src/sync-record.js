import {readProgress} from './progress.js';

export const blankRecord=()=>({version:1,fields:{},completed:[]});

export function capture(record,state,drafts,time) {
  const put=(name,value)=>{
    if(record.fields[name]?.[1]!==value)record.fields[name]=[time,value];
  };
  if(state.last)put('last',state.last);
  for(const [id,step] of Object.entries(state.active))put('step/'+id,step);
  for(const [id,answers] of Object.entries(state.responses)){
    for(const [step,value] of Object.entries(answers))put('answer/'+id+'/'+step,value);
  }
  for(const [id,code] of Object.entries(drafts))put('code/'+id,code);
  record.completed=[...new Set([...record.completed,...state.completed])].sort();
  return record;
}

export function mergeRecords(a,b) {
  const fields={...a.fields};
  for(const [name,entry] of Object.entries(b.fields)){
    if(!Array.isArray(entry)||!Number.isFinite(entry[0])||!Object.hasOwn(b.fields,name)||name==='__proto__')continue;
    const old=fields[name];
    if(!old||old[0]<entry[0]||(old[0]===entry[0]&&JSON.stringify(old[1])<JSON.stringify(entry[1])))fields[name]=entry;
  }
  return {version:1,fields,completed:[...new Set([...a.completed,...b.completed])].sort()};
}

export function unpack(record,lessons,challengeIds) {
  const value=name=>record.fields[name]?.[1];
  const raw={version:1,last:value('last'),active:{},responses:{},completed:record.completed};
  for(const l of lessons){
    raw.active[l.id]=value('step/'+l.id);
    const answers={};
    for(const s of l.steps){
      const keys=s.host?[s.id,s.id+'-host',s.id+'-guest']:[s.id];
      for(const key of keys)answers[key]=value('answer/'+l.id+'/'+key);
    }
    answers.quiz=record.completed.includes(l.id)?l.answer:value('answer/'+l.id+'/quiz');
    raw.responses[l.id]=answers;
  }
  const drafts={};
  for(const id of challengeIds){
    const code=value('code/'+id);
    if(typeof code==='string'&&code.length<=12000)drafts[id]=code;
  }
  return {state:readProgress(JSON.stringify(raw),lessons),drafts};
}
