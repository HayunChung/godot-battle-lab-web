// Project-specific names link back to their declaration or the exact use in each file.
const references = new Map();

export function indexSource(path,source) {
  if(references.has(path))return;
  const entries=new Map();
  references.set(path,entries);
  const lines=source.split('\n');
  function add(name,index,meaning,priority) {
    if((entries.get(name)?.priority??-1)>=priority)return;
    const usage='Open res://'+path+' at line '+(index+1)+'.';
    entries.set(name,{meaning,usage,example:lines[index].trim(),priority});
  }
  let scope='';
  lines.forEach((raw,index)=>{
    const line=raw.trim();
    const declaration=line.match(/\b(func|signal|class_name|class|const|var|enum|for)\s+(\w+)/);
    if(declaration){
      const [,kind,name]=declaration;
      if(kind==='func')scope=name;
      const labels={func:'function',var:'variable',const:'constant',signal:'signal',enum:'set of named values',class_name:'script class',class:'class',for:'loop variable'};
      add(name,index,'The '+labels[kind]+' '+name+' declared in '+path.split('/').pop()+'.',2);
      if(kind==='func'){
        for(const param of (line.match(/\((.*?)\)/)?.[1]||'').split(',')){
          const id=param.trim().match(/^\w+/)?.[0];
          if(id)add(id,index,'An argument passed to '+name+' when the function is called.',1);
        }
      }
    }
    const node=line.match(/^\[node name="([^"]+)"(?: type="([^"]+)")?/);
    if(node)add(node[1],index,'The '+(node[2]||'instanced')+' node named '+node[1]+' in this scene.',2);
    const code=line.replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|#.*$/g,' ');
    for(const token of code.match(/[A-Za-z_]\w*/g)||[]){
      add(token,index,scope?'Used inside the '+scope+' function in '+path.split('/').pop()+'.':'Used in '+path.split('/').pop()+'.',0);
    }
  });
}
export function sourceReference(path,term){return references.get(path)?.get(term);}
