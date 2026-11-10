// Interpreter for the function-body subset used by the embedded course exercises.
// Learner text is tokenized and interpreted as data; it never runs as JavaScript.
class PracticeError extends Error {
  constructor(line,message){super(message);this.line=line;}
}
const fail=(line,message)=>{throw new PracticeError(line,message);};
const precedence={'or':1,'and':2,'==':3,'!=':3,'<':3,'>':3,'<=':3,'>=':3,'+':4,'-':4,'*':5};
function tokens(source,line){
  const pattern=/\s+|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\d+(?:\.\d+)?|[A-Za-z_]\w*|==|!=|<=|>=|:=|\+=|-=|[.:=+*(),<>\-]/gy;
  const result=[];
  for(let i=0;i<source.length;){
    pattern.lastIndex=i;
    const match=pattern.exec(source);
    if(!match)fail(line,/["']/.test(source[i])?'This text is missing its closing quotation mark. Use matching quotes at both ends.':'The practice runner cannot read “'+source[i]+'” here. Check the supported syntax below the editor.');
    i=pattern.lastIndex;
    if(!/^\s|^#/.test(match[0]))result.push(match[0]);
  }
  return result;
}
const isName=s=>/^[a-zA-Z_]\w*$/.test(s||'')&&!['true','false','and','or','not','if','else','for','in','var','pass'].includes(s);
function statement(list,line){
  let pos=0;
  const take=()=>list[pos++],peek=()=>list[pos];
  function need(s,why){if(take()!==s)fail(line,why);}
  function name(){const s=take();if(!isName(s))fail(line,'Give this value a name, such as health. Start with a letter or underscore.');return s;}
  function expr(min=0){
    const t=take();let left;
    if(t==='('){left=expr();need(')','Close the group with a matching ).');}
    else if(['-','+','not'].includes(t))left={op:'unary',t,a:expr(t==='not'?3:6)};
    else if(t!==undefined&&/^\d/.test(t))left={op:'literal',v:Number(t),kind:t.includes('.')?'float':'int'};
    else if(t&&/^["']/.test(t))left={op:'literal',v:t.slice(1,-1).replace(/\\([ntr"'\\])/g,(_,c)=>({n:'\n',t:'\t',r:'\r'}[c]??c)),kind:'String'};
    else if(t==='true'||t==='false')left={op:'literal',v:t==='true',kind:'bool'};
    else if(isName(t))left={op:'read',name:t};
    else fail(line,'An expression needs a value here. Try a number, quoted text, or a variable you have already defined.');
    while(Object.hasOwn(precedence,peek())&&precedence[peek()]>=min){
      const operator=take();left={op:'binary',t:operator,a:left,b:expr(precedence[operator]+1)};
    }
    return left;
  }
  const head=take();let node;
  if(head==='if'||head==='else'||head==='for'){
    node={op:head,children:[]};
    if(head==='if'){
      node.expr=expr();
      if(peek()==='=')fail(line,'A single = stores a value. To ask whether two values are equal inside if, write ==.');
    }
    if(head==='for'){node.name=name();need('in','A loop reads “for hp in health_values:”. Put in between the name and the list.');node.expr=expr();}
    need(':','End this block header with a colon (:), then indent the instructions it controls.');
  }else if(head==='var'){
    node={op:'var',name:name()};
    if(peek()===':'){take();node.type=name();if(!['int','float','String','bool'].includes(node.type))fail(line,'Use int for whole numbers, float for decimals, String for text, or bool for true/false.');}
    const assign=take();
    if(!['=',':='].includes(assign))fail(line,'Give the variable a starting value with =, such as var health = 3.');
    node.expr=expr();node.infer=assign===':=';
  }else if(head==='return'){node={op:'return',expr:expr()};
  }else if(head==='pass'){node={op:'pass'};}
  else if(head==='print'||head==='fired'){
    node={op:head,args:[]};
    if(head==='fired'){need('.','Use fired.emit(amount) to send the signal.');need('emit','Use emit to announce this signal to its listener.');}
    need('(','Put the values for this call inside parentheses, for example print(health).');
    if(peek()!==')'){node.args.push(expr());while(peek()===','){take();node.args.push(expr());}}
    need(')','Close this call with ). Separate multiple values with a comma.');
  }else if(isName(head)&&['=','+=','-='].includes(peek())){
    node={op:'set',name:head,operator:take(),expr:expr()};
  }else fail(line,'This function-body runner understands var, assignments, print(), fired.emit(), for, if/else and pass. Enter only the indented body shown by the prompt.');
  if(pos<list.length)fail(line,'Unexpected “'+peek()+'”. Check for an extra word, missing operator, or a second instruction on this line.');
  return {...node,line};
}
function parse(code){
  const blocks=[{indent:0,nodes:[]}];
  let previous=null,indentStyle;
  for(const [index,raw] of code.split(/\r?\n/).entries()){
    const line=index+1,lead=raw.match(/^\s*/)[0],list=tokens(raw.slice(lead.length),line);
    if(!list.length)continue;
    const indent=lead.replace(/\t/g,'    ').length;
    const style=lead.includes('\t')?'tabs':'spaces';
    if(indent&&((lead.includes(' ')&&lead.includes('\t'))||(indentStyle&&style!==indentStyle)))fail(line,'Use the same indentation throughout. Four spaces per level works well.');
    if(indent)indentStyle=style;
    let block=blocks.at(-1);
    if(previous?.children){
      if(indent<=block.indent)fail(line,'Line '+previous.line+' opens a block. Indent this instruction underneath it, or add an indented pass.');
      block={indent,nodes:previous.children};blocks.push(block);
    }else{
      while(blocks.length>1&&indent<block.indent){blocks.pop();block=blocks.at(-1);}
      if(indent!==block.indent)fail(line,'This line starts at a different depth. Align it with its neighbors, or indent one level beneath an if, else, or for.');
    }
    const node=statement(list,line);
    if(node.op==='else'&&block.nodes.at(-1)?.op!=='if')fail(line,'Align else: with the if: that chooses between the two paths.');
    block.nodes.push(node);previous=node;
  }
  if(previous?.children)fail(previous.line,'This block is empty. Add an indented instruction beneath its colon.');
  return blocks[0].nodes;
}
function binary(op,a,b,line){
  if(['==','!='].includes(op))return op==='=='?a===b:a!==b;
  if(op==='+'&&typeof a==='string'&&typeof b==='string')return a+b;
  if(typeof a!=='number'||typeof b!=='number')fail(line,'This operator needs numbers. Quoted digits are text. Use print("HP: ", hp) to display text beside a number.');
  return ({'+':()=>a+b,'-':()=>a-b,'*':()=>a*b,'<':()=>a<b,'<=':()=>a<=b,'>':()=>a>b,'>=':()=>a>=b})[op]();
}
function execute(tree,inputs,signal,allowReturn=false){
  const returned={};
  const output=[],events=[],visits=[];
  let budget=2000;
  const root=new Map(Object.entries(inputs).map(([k,v])=>[k,{v}]));
  const scopes=[root];
  const decisions=[];
  function binding(name,line){
    for(let i=scopes.length-1;i>=0;i--)if(scopes[i].has(name))return scopes[i].get(name);
    fail(line,'“'+name+'” has no value here. Check its spelling and capitals, or declare it with var before using it.');
  }
  function value(e,line){
    if(e.op==='literal')return e.v;
    if(e.op==='read')return binding(e.name,line).v;
    const a=value(e.a,line);
    if(e.op==='unary'){
      if(e.t==='not')return !a;
      if(typeof a!=='number')fail(line,'A plus or minus sign here needs a number.');
      return e.t==='-'?-a:a;
    }
    if(e.t==='and')return Boolean(a&&value(e.b,line));
    if(e.t==='or')return Boolean(a||value(e.b,line));
    const result=binary(e.t,a,value(e.b,line),line);
    if(typeof result==='string'&&result.length>4000)fail(line,'This text became too long for a practice run. Try a shorter message.');
    return result;
  }
  function assign(slot,v,line){
    const types={int:Number.isInteger,float:x=>typeof x==='number',String:x=>typeof x==='string',bool:x=>typeof x==='boolean'};
    if(slot.type&&!types[slot.type](v))fail(line,'This variable expects '+slot.type+'. '+({int:'Use a whole number, such as 3.',float:'Use a number, such as 4.5.',String:'Put text inside matching quotes.',bool:'Use true or false.'}[slot.type]));
    slot.v=v;
  }
  function run(nodes,local){
    scopes.push(local);
    let condition;
    for(const n of nodes){
      const line=n.line;
      if(--budget<0)fail(line,'This run took too many steps. Check whether a loop was placed inside another loop.');
      visits.push(line);
      if(n.op==='return'){
        if(!allowReturn)fail(line,'This practice function returns void. Use print() to display a value.');
        returned.value=value(n.expr,line);returned.line=line;throw returned;
      }
      if(n.op==='if'){condition=Boolean(value(n.expr,line));if(condition){decisions.push({line,condition});run(n.children,new Map());decisions.pop();}}
      if(n.op==='else'&&!condition){decisions.push({line,condition:'else'});run(n.children,new Map());decisions.pop();}
      if(n.op==='for'){
        const items=value(n.expr,line);if(!Array.isArray(items))fail(line,'This loop needs the list health_values. Each turn gives hp one value from that list.');
        for(const item of items)run(n.children,new Map([[n.name,{v:item}]]));
      }
      if(n.op==='var'){
        if(local.has(n.name))fail(line,'“'+n.name+'” already exists here. Remove var to change its value.');
        const v=value(n.expr,line),type=n.type||(n.infer?(n.expr.kind||({number:Number.isInteger(v)?'int':'float',string:'String',boolean:'bool'}[typeof v])):null);
        const slot={type};assign(slot,v,line);local.set(n.name,slot);
      }
      if(n.op==='set'){const slot=binding(n.name,line),v=value(n.expr,line);assign(slot,n.operator==='='?v:binary(n.operator[0],slot.v,v,line),line);}
      if(n.op==='print'||n.op==='fired'){
        const args=n.args.map(e=>value(e,line));
        if(n.op==='fired'){
          if(!signal)fail(line,'This exercise has no fired signal. Use print() to display your result.');
          if(args.length!==1||!Number.isInteger(args[0]))fail(line,'fired expects one whole-number argument. Put the amount between the parentheses.');
          events.push({line,v:args[0]});output.push({line,text:'Shots fired: '+args[0]});
        }else output.push({line,text:args.join(''),decision:decisions.at(-1)});
      }
    }
    scopes.pop();
  }
  try{run(tree,new Map());return {output,events,visits};}
  catch(e){if(e===returned)return {output,events,visits,returned};e.output=output;throw e;}
}
export const challenges={
 'pvp-ready-room':{
   title:'Gate the arena on both pilots',signature:'func check_ready(p1_ready: bool, p2_ready: bool) -> void:',
   prompt:'Print "Load" only when both pilots have accepted. Print "Wait" for every other combination.',
   starter:'if p1_ready:\n    print("Load")\nelse:\n    print("Wait")',
   cases:[false,true].flatMap(p1_ready=>[false,true].map(p2_ready=>({inputs:{p1_ready,p2_ready},expected:[p1_ready && p2_ready?'Load':'Wait']}))),
   hint:'Combine the two slot values with and.'
 },
 'pvp-loading':{
   title:'Choose the loading screen action',signature:'func show_status(status: String) -> void:',
   prompt:'The loader reports "loading", "loaded", or "failed". Print "Progress", "Enter", or "Retry" for the corresponding report.',
   starter:'if status == "loaded":\n    print("Enter")\nelse:\n    print("Progress")',
   cases:[['loading','Progress'],['loaded','Enter'],['failed','Retry']].map(([status,action])=>({inputs:{status},expected:[action]})),
   hint:'Inside the else branch, test for a failed load before showing progress.'
 },
 'pvp-results':{
   title:'Choose the result panel',signature:'func show_result(p1_wins: int, p2_wins: int, target: int) -> void:',
   prompt:'Print "Match result" if either player reaches the target. Otherwise print "Next round". Test different scores and targets.',
   starter:'if p1_wins >= target:\n    print("Match result")\nelse:\n    print("Next round")',
   cases:[[1,1,2],[2,0,2],[0,2,2],[2,2,3],[0,1,1]].map(([p1_wins,p2_wins,target])=>({inputs:{p1_wins,p2_wins,target},expected:[Math.max(p1_wins,p2_wins)>=target?'Match result':'Next round']})),
   hint:'Compare both scores against the same target and combine the comparisons with or.'
 },
 'attack-cost':{preview:'stamina',inputs:{},starter:'var shot_cost: float = 15.0\nreturn shot_cost'},
 'roll-cost':{preview:'stamina',inputs:{},starter:'var roll_cost: float = 40.0\nreturn roll_cost'},
 'stamina-regen':{preview:'stamina',inputs:{},starter:'var points_per_second: float = 20.0\nreturn points_per_second'},
 'wasd-movement':{preview:'motion',title:'Tune the scout’s speed',signature:'func horizontal_velocity(direction_x: float) -> float:',prompt:'Run the scout for one second with D held. Then change speed from 4.0 to 8.0 and run again. The flag marks the original 4 m finish. Try zero or a negative velocity, too.',starter:'var speed: float = 4.0\nreturn direction_x * speed',inputs:{direction_x:1},guide:'direction_x is 1 while D is held. Return horizontal velocity in meters per second. The preview applies it for one second. In motion.gd, the same value goes into velocity.x before move_and_slide().'},
 'health-and-pursuit':{preview:'combat',title:'Tune the damage per hit',signature:'func hit_damage() -> int:',prompt:'The sentinel starts each run with 3 HP. Run the attack, change attack_power from 1 to 2, then run again. Watch each impact and compare how many shots it takes to win.',starter:'var attack_power: int = 1\nreturn attack_power',inputs:{},guide:'Return a whole number of damage points per hit. The preview applies up to three hits, stopping at zero health. In the reference game, projectile.gd passes this amount to take_damage().'},
 variables:{title:'Spend one health point',signature:'func _ready() -> void:',prompt:'Create an integer named health with 3 points. Subtract 1, then print the label and the remaining health. The first line is ready for you.',starter:'var health: int = 3\n# Subtract one point here.\nprint("Health: ", health)',cases:[{inputs:{},expected:['Health: 2']}],hint:'Start with 3, subtract 1 before printing, and keep the space after Health:.'},
 'functions-and-signals':{title:'Send the shot count',signature:'func shoot(amount: int) -> void:',prompt:'Write the body of shoot. Double the incoming amount and send that number through fired. The connected listener prints each signal. The runner calls your function with 2 and again with 5.',starter:'# Store twice the incoming amount.\n# Send it to the listener using fired.emit(...).\npass',cases:[{inputs:{amount:2},expected:['Shots fired: 4'],signal:4},{inputs:{amount:5},expected:['Shots fired: 10'],signal:10}],hint:'Use the incoming amount so the same function works for both calls. Send the doubled value once with fired.emit().'},
 'conditions-and-loops':{title:'Report each target',signature:'func report_targets(health_values: Array[int]) -> void:',prompt:'Loop over health_values in order. Print "Active" when hp is greater than zero and "Disabled" otherwise. Try both supplied lists, including an empty-health target.',starter:'for hp in health_values:\n    # Replace pass with your if / else decision.\n    pass',cases:[{inputs:{health_values:[0,2,1]},expected:['Disabled','Active','Active']},{inputs:{health_values:[3,0]},expected:['Active','Disabled']}],hint:'Check hp > 0 for each target. Keep both print calls inside the loop, each beneath its own branch.'}
};
export function runChallenge(id,code){
  const c=challenges[id],runs=[];
  try{
    if(code.length>12000||code.split('\n').length>200)fail(1,'Keep this practice function under 200 lines and 12,000 characters.');
    const tree=parse(code);
    if(c.preview){
      const {returned,visits,output}=execute(tree,c.inputs,false,true);
      if(!returned)fail(visits.at(-1)||1,'Return a number so the preview knows which value to apply. Add return followed by your calculated value.');
      const v=returned.value;
      if(!Number.isFinite(v))fail(returned.line,'Return a number, such as 4, without quotation marks.');
      if(c.preview==='stamina'&&(v<0||v>100))fail(returned.line,'Return a value between 0 and 100. The full stamina bar holds 100 points.');
      if(c.preview==='combat'&&(!Number.isSafeInteger(v)||v<0))fail(returned.line,'Damage counts whole health points. Return zero or a positive whole number.');
      return {kind:'preview',value:v,runs:[output.map(o=>o.text)]};
    }
    for(const test of c.cases){
      const {output,events,visits}=execute(tree,test.inputs,test.signal!==undefined);
      runs.push(output.map(o=>o.text));
      const i=test.expected.findIndex((s,j)=>s!==output[j]?.text);
      const missingSignal=test.signal!==undefined&&(events.length!==1||events[0].v!==test.signal);
      if(i!==-1||output.length!==test.expected.length||missingSignal){
        const at=i===-1?test.expected.length:i;
        const line=output[at]?.line||visits.at(-1)||1;
        const branch=output[at]?.decision;
        const trace=branch?' The '+(branch.condition==='else'?'else branch':'true branch')+' on line '+branch.line+' led here.':'';
        const diff=missingSignal?'The listener must receive one fired signal carrying '+test.signal+'.':output[at]?'This line printed “'+output[at].text+'”. '+(test.expected[at]===undefined?'No further output was expected.':'Expected “'+test.expected[at]+'”.'):'After this line the run ended before it printed “'+test.expected[at]+'”.';
        return {kind:'mismatch',line,message:diff+trace+' '+c.hint,runs};
      }
    }
    return {kind:'success',message:'All practice cases passed.',runs};
  }catch(e){
    if(e instanceof RangeError)return {kind:'error',line:1,message:'This expression is too deeply nested for a practice run. Split it into smaller variables and run again.',runs};
    if(!(e instanceof PracticeError))throw e;
    if(e.output)runs.push(e.output.map(o=>o.text));
    return {kind:'error',message:e.message,line:e.line,runs};
  }
}

// Use the same grammar as Run so the explanation follows the learner's edits.
const expressionWords={'+':'plus','-':'minus','*':'times','==':'is equal to','!=':'is different from','<':'is less than','>':'is greater than','<=':'is at most','>=':'is at least',and:'and',or:'or'};
function describeValue(expr){
  if(expr.op==='literal')return typeof expr.v==='string'?'“'+expr.v+'”':String(expr.v);
  if(expr.op==='read')return expr.name;
  if(expr.op==='unary')return ({'-':'negative ','+':'positive ',not:'not '})[expr.t]+describeValue(expr.a);
  const part=node=>node.op==='binary'?'('+describeValue(node)+')':describeValue(node);
  return part(expr.a)+' '+expressionWords[expr.t]+' '+part(expr.b);
}
const resultLabels={'attack-cost':'stamina paid for one attack','roll-cost':'stamina paid for one roll','stamina-regen':'points recovered per second','health-and-pursuit':'damage dealt by one hit','wasd-movement':'horizontal movement speed'};
export function explainCode(code,id){
  const notes=[];
  for(const [index,source] of code.split(/\r?\n/).slice(0,200).entries()){
    if(!source.trim())continue;
    let meaning;
    try{
      const list=tokens(source.trim(),index+1);
      if(!list.length)meaning='A note for you. The game skips this line.';
      else{
        const n=statement(list,index+1),v=n.expr?describeValue(n.expr):'';
        switch(n.op){
          case 'var':{
            const type={float:' It can hold decimals.',int:' It holds whole numbers.',String:' It holds text.',bool:' It holds true or false.'}[n.type]||'';
            meaning='Create a value named '+n.name+' and set it to '+v+'.'+type;break;
          }
          case 'set':meaning=n.operator==='='?'Set '+n.name+' to '+v+'.':(n.operator==='+='?'Add '+v+' to ':'Subtract '+v+' from ')+n.name+' and save the new value.';break;
          case 'return':meaning='Send '+v+' back as the '+(resultLabels[id]||'result')+' and finish this function.';break;
          case 'print':meaning='Show '+(n.args.map(describeValue).join(' followed by ')||'a blank line')+' in the output.';break;
          case 'fired':meaning='Send the fired signal with '+n.args.map(describeValue).join(', ')+'. Its listener receives this value.';break;
          case 'if':meaning='Run the indented lines only when '+v+'.';break;
          case 'else':meaning='Run this branch when the preceding if condition was false.';break;
          case 'for':meaning='Visit each item in '+v+'. Call the current item '+n.name+' while running the indented lines.';break;
          case 'pass':meaning='Leave this spot empty for now. Execution continues.';break;
        }
      }
    }catch(e){meaning=e instanceof PracticeError?e.message:'Split this long expression into smaller lines.';}
    notes.push({line:index+1,source:source.trim(),meaning});
  }
  return notes;
}
