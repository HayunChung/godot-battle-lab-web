const names={host:'Host',guest:'Guest'};

export const sharedPhotoDialog=`<dialog class="evidence-viewer" aria-labelledby="evidence-photo-title">
  <header><div><h3 id="evidence-photo-title"></h3><p data-point-hint aria-live="polite"></p></div>
    <button class="secondary" data-stop-sharing>Turn off View together</button>
    <button class="secondary" data-close-photo autofocus>Close</button></header>
  <div class="evidence-stage"><div class="evidence-picture" tabindex="0" role="button" aria-label="Mark a point on this screenshot. Arrow keys move the marker. Enter places a marker.">
    <img alt=""><span class="evidence-pin" aria-hidden="true" hidden></span></div></div>
  <p data-photo-error role="status"></p></dialog>`;

export function mountSharedPhoto(root,photoUrl,change,state){
  const dialog=root.querySelector('.evidence-viewer'),picture=dialog.querySelector('.evidence-picture');
  const img=picture.querySelector('img'),pin=picture.querySelector('.evidence-pin');
  const stop=dialog.querySelector('[data-stop-sharing]'),error=dialog.querySelector('[data-photo-error]');
  let shown=null,shared=false,dismissedSession=null,queue=Promise.resolve();

  function render(photo,isShared){
    const src=photoUrl(photo.step,photo.side,photo.id);
    if(img.getAttribute('src')!==src){
      picture.hidden=true;
      const sizePicture=()=>{
        picture.style.setProperty('--ratio',String(img.naturalWidth/img.naturalHeight));
        picture.hidden=false;
      };
      img.onload=sizePicture;
      img.onerror=()=>{error.textContent='Could not load this screenshot.';};
      error.textContent='';img.src=src;
      if(img.complete && img.naturalWidth)sizePicture();
    }
    shown=photo;shared=isShared;
    const title=names[photo.side]+' screenshot · Test '+photo.number;
    img.alt=title;dialog.querySelector('h3').textContent=title;
    stop.hidden=!shared;
    const point=photo.point;
    pin.hidden=!point;
    if(point){pin.style.left=point.x*100+'%';pin.style.top=point.y*100+'%';}
    const hint=(shared?'Viewing together. ':'Viewing independently. ')+(point?
      (names[point.role]||'You')+' marked '+Math.round(point.x*100)+'% across, '+Math.round(point.y*100)+'% down.':'Select the problem area on the screenshot.');
    const label=dialog.querySelector('[data-point-hint]');
    if(label.textContent!==hint)label.textContent=hint;
    if(!dialog.open)dialog.showModal();
  }
  function closeLocal(){
    shown=null;shared=false;
    if(dialog.open)dialog.close();
  }
  function update(latest){
    const view=latest.historyView;
    if(latest.role && view?.together && view.photo && view.photo.session!==dismissedSession)render(view.photo,true);
    else if(shared && shown){
      if(!view?.together)render({...shown,session:null},false);
      else closeLocal();
    }
  }
  async function open(card,step){
    const latest=state(),number=Number(card.dataset.testNumber),side=card.dataset.photoSide,id=card.dataset.evidencePhoto;
    if(latest.role && latest.historyView?.together){
      const opened=await change('photo-open',{role:latest.role,step,number,side,photoId:id,session:latest.historyView.photo?.session??null,
        epoch:latest.historyView.epoch,advance:latest.advance});
      if(!opened)card.closest('[data-pad-history]').querySelector('[data-episode-status]').textContent='Could not open the shared screenshot. Select it again.';
    }else render({step,number,side,id,point:null},false);
  }
  function act(action,fields={}){
    if(!shown)return;
    if(!shared){
      if(action==='photo-close')closeLocal();
      else if(action==='photo-point')render({...shown,point:{...fields,role:state().role}},false);
      return;
    }
    const photo=shown,{role,advance,historyView}=state();
    const args={role,step:photo.step,session:photo.session,epoch:historyView.epoch,...fields};
    if(action==='history-mode')Object.assign(args,{enabled:false,number:photo.number,advance});
    queue=queue.then(async()=>{
      if(!dialog.isConnected || !shared || shown?.session!==photo.session)return;
      if(await change(action,args))error.textContent='';
      else if(action==='photo-close' && shown?.session===photo.session){
        dismissedSession=photo.session;closeLocal();
      }else error.textContent='Could not share this change. Try again.';
    });
  }
  stop.onclick=()=>act('history-mode');
  dialog.querySelector('[data-close-photo]').onclick=()=>act('photo-close');
  dialog.oncancel=e=>{e.preventDefault();act('photo-close');};
  picture.onclick=e=>{
    if(!img.complete||!img.naturalWidth)return;
    const rect=img.getBoundingClientRect();
    const clamp=v=>Math.min(1,Math.max(0,v));
    act('photo-point',{x:clamp((e.clientX-rect.left)/rect.width),y:clamp((e.clientY-rect.top)/rect.height)});
  };
  picture.onkeydown=e=>{
    if(!['Enter',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
    e.preventDefault();
    const point=shown?.point||{x:.5,y:.5};
    const x=point.x+(e.key==='ArrowRight'?.02:e.key==='ArrowLeft'?-.02:0);
    const y=point.y+(e.key==='ArrowDown'?.02:e.key==='ArrowUp'?-.02:0);
    act('photo-point',{x:Math.min(1,Math.max(0,x)),y:Math.min(1,Math.max(0,y))});
  };
  return {open,update};
}
