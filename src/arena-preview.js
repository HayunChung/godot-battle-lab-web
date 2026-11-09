const fmt=value=>Number(value.toFixed(2)).toString();
const hits=(power)=>power===0?3:Math.min(3,Math.ceil(3/power));
export function previewFrame(mode,value,t){
  if(mode==='motion'){
    const x=value*Math.min(t,1);
    const edge=Math.max(12,Math.abs(value));
    const reverse=value<0;
    const span=reverse?edge+4:edge;
    const left=reverse?edge/span:0;
    const place=meters=>8+84*(left+meters/span);
    return {scout:place(x),flag:place(4),start:place(0),status:'Position X: '+fmt(x)+' m · '+fmt(Math.min(t,1))+' s',done:t>=1};
  }
  const count=hits(value),completed=Math.min(count,Math.floor((t+1e-9)/0.55)),hp=Math.max(0,3-completed*value);
  return {shot:completed<count?10+78*(t/0.55-completed):null,hp,done:completed===count,status:'Hits: '+completed+' · Sentinel: '+hp+' / 3 HP'+(hp===0?' · Defeated':'')};
}
export function previewMarkup(mode){
  const combat=mode==='combat';
  return `<div class="arena-preview" data-arena="${mode}"><div class="arena-floor" aria-hidden="true"><span class="actor scout"></span>${combat?'<span class="actor sentinel"></span><i class="pulse"></i>':'<span class="flag-marker">4 m</span><span class="origin-marker">0</span>'}</div>${combat?'<progress max="3" value="3" aria-label="Enemy health"></progress>':''}<div class="arena-reading"></div><p class="arena-outcome" role="status"></p></div>`;
}
export function mountPreview(el,result,animate){
  if(!el)return;
  const mode=el.dataset.arena,valid=result?.kind==='preview';
  const value=valid?result.value:(mode==='motion'?4:1);
  const duration=mode==='motion'?1:hits(value)*0.55;
  const scout=el.querySelector('.scout'),pulse=el.querySelector('.pulse'),progress=el.querySelector('progress');
  function paint(t){
    const frame=previewFrame(mode,value,t);
    if(mode==='motion'){
      scout.style.left=frame.scout+'%';
      el.querySelector('.flag-marker').style.left=frame.flag+'%';
      el.querySelector('.origin-marker').style.left=frame.start+'%';
    }else{
      pulse.hidden=frame.shot===null||!valid;
      if(frame.shot!==null)pulse.style.left=frame.shot+'%';
      progress.value=frame.hp;el.classList.toggle('defeated',frame.hp===0);
    }
    el.querySelector('.arena-reading').textContent=frame.status;
    if(valid&&frame.done)el.querySelector('.arena-outcome').textContent=mode==='motion'
      ?'After 1 second: X = '+fmt(value)+' m. Reference: X = 4 m.'
      :'Damage per hit: '+value+'. HP: '+Array.from({length:hits(value)+1},(_,i)=>Math.max(0,3-i*value)).join(' → ')+'.';
  }
  if(!valid){paint(0);return;}
  if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches){paint(duration);return;}
  const start=performance.now();
  function tick(time){
    if(!el.isConnected)return;
    const t=Math.min(duration,(time-start)/1000);
    paint(t);if(t<duration)requestAnimationFrame(tick);
  }
  paint(0);requestAnimationFrame(tick);
}
