import {filePicker,mountFilePicker} from './file-picker.js';
import {newRound, tickRound, paint} from './final-arena.js';

const keys = {KeyW:'W', KeyA:'A', KeyS:'S', KeyD:'D', Space:'Fire', ShiftLeft:'Roll'};
const prompts = ['Move with W, A, S or D.', 'Fire one shot with Space.', 'Roll with Shift.', 'Training complete.'];
let largeHud = false;
const settingKey = 'battle-lab.large-hud.v1';

export function menuPractice() {
  return '<section class="code-lab menu-practice" tabindex="-1"><h3>Test the game menu</h3><details class="appearance-controls"><summary>Try your own menu art</summary><p>Preview an image on the lobby, settings screen and training banner. The file stays in this browser tab.</p>'+filePicker('Background image','image/png,image/jpeg,image/webp','data-preview-art')+'<label><input type="checkbox" data-preview-sparks checked> Show drifting particles</label><button class="secondary" data-reset-art>Restore sample image</button><small data-art-message role="status"></small></details><div data-menu-screen></div></section>';
}

export function mountMenuPractice(app) {
  const screen = app.querySelector('[data-menu-screen]');
  if (!screen) return;
  try { largeHud = localStorage.getItem(settingKey) === 'true'; } catch {}
  const picker=app.querySelector('[data-preview-art]');
  const resetFile=mountFilePicker(picker);
  const notice=app.querySelector('[data-art-message]');
  let customImage='';
  const clearImage=()=>{
    if(customImage)URL.revokeObjectURL(customImage);
    customImage='';
    screen.style.removeProperty('--menu-image');
  };
  picker.onchange=async()=>{
    const file=picker.files[0];if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)){notice.textContent='Choose a PNG, JPG or WebP image.';return;}
    const url=URL.createObjectURL(file);
    const image=new Image();image.src=url;
    try{
      await image.decode();
      if(!screen.isConnected || picker.files[0]!==file){URL.revokeObjectURL(url);return;}
      clearImage();customImage=url;
      screen.style.setProperty('--menu-image','url("'+url+'")');
      notice.textContent='Showing '+file.name;
    }catch{URL.revokeObjectURL(url);notice.textContent='This image could not be opened. Try another file.';}
  };
  app.querySelector('[data-reset-art]').onclick=()=>{resetFile();clearImage();notice.textContent='Sample image restored.';};
  app.querySelector('[data-preview-sparks]').onchange=e=>screen.classList.toggle('no-sparks',!e.target.checked);
  let frame, mode, round, step, previous, bank;
  const pressed = new Set();
  const button = (action, title) => '<button class="secondary" data-menu="'+action+'">'+title+'</button>';
  function show(next, focus=true) {
    cancelAnimationFrame(frame);
    pressed.clear();
    mode = next;
    screen.dataset.mode=mode;
    if (mode === 'lobby') {
      screen.innerHTML = '<h4>Relay Arena</h4><div class="menu-buttons">'+button('battle','Start battle')+button('tutorial','Tutorial')+button('settings','Settings')+'</div>';
    } else if (mode === 'settings') {
      screen.innerHTML = '<h4>HUD settings</h4><label><input type="checkbox" data-large> Large HUD text</label><p class="menu-hud">SCOUT 3/3 · SENTINEL 3/3</p><p data-save role="status">Changes save in this browser.</p>'+button('lobby','Back to lobby');
      screen.querySelector('[data-large]').checked = largeHud;
    } else {
      round = newRound();
      round.training = mode === 'tutorial';
      step = 0;
      screen.innerHTML = '<h4>'+ (round.training?'Tutorial':'Relay Arena') +'</h4><p class="menu-hud"></p><p data-prompt role="status"></p><canvas width="640" height="440" tabindex="0" aria-label="Arena. WASD moves, Space fires, Shift rolls."></canvas><div class="touch-controls">'+Object.entries(keys).map(([key,label])=>'<button data-key="'+key+'">'+label+'</button>').join('')+'</div><div class="menu-buttons">'+button('lobby','Back to lobby')+button('battle',round.training?'Enter battle':'Restart battle')+'</div>';
      const canvas = screen.querySelector('canvas'), context = canvas.getContext('2d');
      const hud = screen.querySelector('.menu-hud'), prompt = screen.querySelector('[data-prompt]');
      const enter = screen.querySelector('[data-menu=battle]');
      enter.disabled = round.training;
      const startingZ = round.z;
      function animate(now) {
        bank += Math.min((now-previous)/1000,.1);
        previous = now;
        while (bank >= 1/60) {
          const shotsBefore = round.shotsFired;
          tickRound(round, pressed, 4, 1, 1/60);
          if (round.training) {
            if (step===0 && round.walking && !round.roll && Math.hypot(round.x,round.z-startingZ)>.25) step++;
            else if (step===1 && round.shotsFired>shotsBefore) step++;
            else if (step===2 && round.roll) step++;
          }
          bank -= 1/60;
        }
        paint(context,round,null,null,round.walking,0);
        hud.textContent = 'SCOUT '+round.hp+'/3 · '+(round.training?'':'SENTINEL '+round.enemyHP+'/3 · ')+'STAMINA '+Math.floor(round.stamina);
        const hint = round.training ? prompts[step] : round.outcome || 'WASD to move · Space to fire · Shift to roll';
        if (prompt.textContent!==hint) prompt.textContent = hint;
        if (round.training) enter.disabled = step<3;
        if (!round.outcome) frame=requestAnimationFrame(animate);
      }
      previous=performance.now();bank=0;animate(previous);canvas.focus({preventScroll:true});
    }
    if(mode!=='battle'){
      const surface=mode==='tutorial'?screen.querySelector('[data-prompt]'):screen;
      const dust=document.createElement('span');
      dust.className='menu-dust';dust.setAttribute('aria-hidden','true');
      for(let i=0;i<10;i++){const spark=document.createElement('i');spark.style.setProperty('--i',i);dust.append(spark);}
      // The tutorial updates the prompt text as input is received. Keep its art layer outside that text node.
      if(mode==='tutorial'){const banner=document.createElement('div');banner.className='training-banner';surface.replaceWith(banner);banner.append(dust,surface);}
      else surface.prepend(dust);
    }
    screen.classList.toggle('large-hud',largeHud);
    if (focus && (mode==='settings'||mode==='lobby')) screen.querySelector('input,button').focus({preventScroll:true});
  }
  screen.onclick=e=>{const b=e.target.closest('[data-menu]');if(b)show(b.dataset.menu);};
  screen.onchange=e=>{
    if(!e.target.matches('[data-large]'))return;
    largeHud=e.target.checked;screen.classList.toggle('large-hud',largeHud);
    let message='Saved in this browser.';
    try { localStorage.setItem(settingKey,String(largeHud)); } catch { message='Applied for this session.'; }
    screen.querySelector('[data-save]').textContent=message;
  };
  function down(key,repeat) {
    pressed.add(key);
    if(!repeat && key==='Space')round.fireTap=true;
    if(!repeat && key==='ShiftLeft')round.rollTap=true;
  }
  screen.onkeydown=e=>{
    const key=e.code==='ShiftRight'?'ShiftLeft':e.code;
    if(e.target.tagName==='CANVAS' && key in keys){e.preventDefault();down(key,e.repeat);}
  };
  screen.onkeyup=e=>pressed.delete(e.code==='ShiftRight'?'ShiftLeft':e.code);
  screen.onfocusout=()=>pressed.clear();
  screen.onpointerdown=e=>{
    const b=e.target.closest('[data-key]');if(!b)return;
    e.preventDefault();screen.querySelector('canvas').focus({preventScroll:true});b.setPointerCapture(e.pointerId);down(b.dataset.key,false);
  };
  screen.onlostpointercapture=e=>pressed.delete(e.target.dataset.key);
  const clear=()=>pressed.clear();
  window.addEventListener('blur',clear);show('lobby',false);
  return ()=>{clearImage();cancelAnimationFrame(frame);window.removeEventListener('blur',clear);};
}
