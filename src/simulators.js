import {icon} from './ui.js';
const demos = {
 'health-and-pursuit':['Trace a damage call','Deal one point at a time. Watch the stored value and the signal sent to the HUD.','<div class="keypad"><button data-hit>take_damage(1)</button><button data-reset>Reset health</button></div>'],
 'functions-and-signals':['Follow the event','Call shoot() to trace the connection between the sender and listener.','<button class="secondary" data-fire>Call shoot()</button>'],
 variables: ['Inspector override','Change Speed and watch what the script reads.','<label>Speed <input type="range" min="0" max="10" step=".5" value="4"></label>'],
 'conditions-and-loops':['Trace the loop','Advance one iteration and inspect the branch Godot takes.','<button class="secondary" data-tick>Next iteration</button>'],
 'wasd-movement':['Trace movement','Toggle direction keys. Opposing keys cancel and diagonals stay within the speed limit.','<div class="keypad">'+['W','A','S','D'].map(k=>'<button aria-pressed="false" data-key="'+k+'">'+k+'</button>').join('')+'</div>'],
 'nodes-and-collisions':['Inspect the floor','Select a node to see the job it performs.','<div class="keypad">'+['Floor','MeshInstance3D','CollisionShape3D'].map((k,i)=>'<button aria-pressed="'+(i===0)+'" data-node="'+i+'">'+k+'</button>').join('')+'</div>']
};
export function simulator(id){
 const d=demos[id];if(!d)return '';
 return '<div class="sim" data-sim="'+id+'"><div class="panel-label">'+icon('terminal',14)+' INTERACTIVE TRACE</div><h3>'+d[0]+'</h3><p>'+d[1]+'</p>'+d[2]+'<output aria-live="polite"></output></div>';
}
export function refreshSim(el,btn){
 if(!el)return;
 const out=el.querySelector('output');
 if(el.dataset.sim==='health-and-pursuit'){
   const before=Number(el.dataset.hp??3);
   const after=btn?.hasAttribute('data-hit')?Math.max(0,before-1):3;
   el.dataset.hp=after;
   out.textContent=btn?.hasAttribute('data-hit')?(before===0?'health = 0 → return (already defeated)':'health = maxi(0, '+before+' − 1) → '+after+'\nhealth_changed.emit('+after+')'):'health = 3';
 }
 if(el.dataset.sim==='functions-and-signals'){
   out.textContent=btn?.hasAttribute('data-fire')?'shoot() → fired.emit(1) → _on_fired(1)\nOutput: Shots fired: 1':'Ready · fired is connected to _on_fired';
 }
 if(el.dataset.sim==='variables')out.textContent='speed = '+Number(el.querySelector('input').value).toFixed(1);
 if(el.dataset.sim==='conditions-and-loops'){
   let i=Number(el.dataset.iter??-1);
   if(btn?.hasAttribute('data-tick'))i=(i+1)%3;
   el.dataset.iter=i;const hp=[0,2,1][i];
   out.textContent=i<0?'health_values = [0, 2, 1]':'Iteration '+(i+1)+'   hp = '+hp+'\n'+(hp>0?'Active target: ':'Disabled target: ')+hp;
 }
 if(el.dataset.sim==='wasd-movement'){
   if(btn?.dataset.key)btn.setAttribute('aria-pressed',btn.getAttribute('aria-pressed')!=='true');
   const keys=[...el.querySelectorAll('[aria-pressed=true]')].map(b=>b.dataset.key);
   const x=+keys.includes('D')-keys.includes('A'), z=+keys.includes('S')-keys.includes('W');
   const norm=Math.hypot(x,z)||1;
   out.textContent='velocity = Vector3('+(4*x/norm).toFixed(2)+', 0, '+(4*z/norm).toFixed(2)+')\nHorizontal speed: '+(x||z?'4.0':'0.0')+' m/s';
 }
 if(el.dataset.sim==='nodes-and-collisions'){
   if(btn?.dataset.node!==undefined)el.querySelectorAll('[data-node]').forEach(b=>b.setAttribute('aria-pressed',b===btn));
   const i=el.querySelector('[aria-pressed=true]').dataset.node;
   out.textContent=['StaticBody3D · stationary body at Y = −0.25 m','BoxMesh · draws the 18 × 0.5 × 14 m platform','BoxShape3D · supplies the physical surface at Y = 0 m'][i];
 }
}
