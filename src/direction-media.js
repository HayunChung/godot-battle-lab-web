import {tuner,bindTuner} from './direction-tuner.js';
import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

const folder = './assets/direction/';
const shots = {
  'editor-tour': [
    ['course-shots/arena-camera','FileSystem → scenes → arena.tscn. Double-click the scene, then click Camera3D in the Scene dock. In the 3D viewport toolbar tick Preview.'],
    ['course-shots/arena-camera','In the Camera3D Inspector, keep Projection on Orthogonal. Click Current to make this camera active during play.'],
    ['course-shots/arena-initial','Click Size, enter 14, save, then press F6. Stop with F8, enter 16, save and repeat. Look at both ends of the floor.']
  ],
  variables: [
    ['direction/guard','In FileSystem double-click practice/guard.tscn. In Scene click its top row, GuardPractice. The Inspector on the right shows Guard Window.'],
    ['direction/guard-branch','Click the script icon beside GuardPractice. Find the comparison with guard_window. Select the root again to return to its Inspector.'],
    ['direction/guard-result','Click Guard Window, enter 0.35, press Enter and save. F6 runs this scene. Click the game, press R, then tap G when the bar is three quarters full.']
  ],
  'functions-and-signals': [
    ['direction/sound','Select GuardPractice → + (Add Child Node). Search AudioStreamPlayer → Create. Press F2 to rename it GuardSound. Drag the supplied WAV into FileSystem, then onto the Stream slot shown on the right.'],
    ['direction/sound-code','Click the script icon on GuardPractice. Add the signal and _ready connection shown here. In the successful elif branch put guard_blocked.emit() directly below the success text, at the same indentation.'],
    ['direction/sound','Click GuardSound → Inspector → Volume dB. Try −6, save, run F6 and make a successful guard. Stop, enter −18 and repeat. Keep Autoplay unchecked.']
  ],
  'conditions-and-loops': [
    ['direction/guard','Double-click practice/guard.tscn → GuardPractice → script icon. Find _input. R starts a fresh trial. G records the first press.'],
    ['direction/guard-branch','Scroll down to _physics_process. Click the quoted text after the final else. Compare a generic “Hit” with “Hit • guard expired”. Keep the indentation and the other two outcomes.'],
    ['direction/message-result','Save → F6 → R. Tap G at three quarters with Guard Window at 0.18. The finished bar stays visible so you can read the reason.']
  ],
  'animation-blend': [
    ['character-guide/blend-space','Double-click scenes/player.tscn → select AnimationTree → open the blend graph below the viewport. Drag the blend cursor from idle at 0 to walk at 1.'],
    ['direction/blend-code','Double-click stages/animated_player.gd in FileSystem. In the original code shown here, locate the final set call. Insert the blend member at the top and move_toward inside _physics_process as described above.'],
    ['course-shots/wasd-floor','Save the script, open scenes/arena.tscn and press F6. Tap W and release. Stop with F8, change the multiplier from 3 to 10 and repeat the same input.']
  ],
  'projectiles-and-restart': [
    ['direction/impact','Double-click scenes/impact.tscn and click Impact. In Inspector click the Mesh resource to inspect the torus. Use Scene → Save Scene As for your variation.'],
    ['direction/projectile','Double-click scripts/projectile.gd. Find the IMPACT preload at the top and enter the copied scene path. Scroll to _on_area_entered to see where Godot places it.'],
    ['direction/impact-code','Open scripts/impact.gd and find the first tween_property call. Change only its 0.12 to 0.24. Save, open arena.tscn and press F6. Fire at the enemy with Space.']
  ],
  'player-attack-animation': [
    ['attack-guide/blender-attack','Blender · Open Beacon-Pilot.blend. Select the armature → Pose Mode. In Dope Sheet → Action Editor choose attack. Click frame 9. Select the arm bone, pose it, then press I over the viewport to key the pose.'],
    ['attack-guide/blender-export','Blender · Switch to Object Mode. Select the rig and meshes → File → Export → glTF 2.0. Choose GLB, Selected Objects and Animation → Actions. Export, then choose the GLB and attack clip in the lesson arena.'],
    ['attack-guide/godot-inspector','Godot · Download the tuned kit from the arena and extract battle_lab beside project.godot. Open battle_lab/scenes/player.tscn → Player → Attack Release Seconds. Compare frame 5 (0.167 s) with frame 9 (0.333 s). Save and run the arena scene.']
  ],
  'enemy-weapon-timing': [
    ['enemy-attack-guide/blender-windup','Blender · Open Sentinel.blend. Select the armature → Pose Mode → Dope Sheet → Action Editor → attack. Click frame 10 to inspect the raised blade, then frame 13 for contact. Hover over the timeline and press M to mark that frame.'],
    ['enemy-attack-guide/blender-export','Blender · Object Mode → select the rig, enemy and weapon → File → Export → glTF 2.0. Enable Selected Objects and Animation → Actions. Export the GLB and select its attack clip in the enemy workshop.'],
    ['enemy-attack-guide/godot-timing','Godot · Open the tuned kit’s battle_lab/scenes/enemy.tscn → Enemy → Attack Contact Fraction. Try 0.75, then 0.50 for the sample’s frame 13. Save, open arena.tscn and press F6 for each run.']
  ],
  'damage-reactions': [
    ['reactions-guide/blender-hit','Blender · Select the rig → Pose Mode → Dope Sheet → Action Editor → hit. Click frame 3 to pose the recoil. Key the selected bones with I, then restore the ready pose at frame 9.'],
    ['reactions-guide/blender-death','Blender · Choose death in the action dropdown. In the Action Editor select the landing keys at frame 17 and press Shift+D, type 24, then Enter. The copy at frame 41 holds the pose for one second. Export both actions via File → Export → glTF 2.0 → Animation → Actions.'],
    ['reactions-guide/godot-setup','In the arena assign the exported Hit clip and Death clip, then download the tuned kit. In Godot double-click the imported foe.glb → expand AnimationPlayer and select death to preview it. Open the kit’s arena.tscn → F6 and deliver a final hit.']
  ],
  'roll-stamina': [
    ['direction/caption','Open scenes/arena.tscn. Expand HUD → Stamina → click Caption. In the Inspector filter type outline_size. Expand Theme Overrides → Constants and enable Outline Size.'],
    ['direction/stamina-code','Double-click scripts/arena.gd → find _update_stamina. Follow the caption.text line that appends the denied action and its required cost.'],
    ['stamina-guide/godot-play','Set Outline Size to 3, save, then F6. Roll with Shift until the bar cannot pay. Compare with 0 while reading the cost over the game background.']
  ],
  'game-lobby': [
    ['menu-guide/art-sparks','Double-click scenes/menu_art.tscn, expand SparksAnchor and click Sparks. In Inspector set Amount to 8 and keep Lifetime at 3.'],
    ['menu-guide/art-lobby','In lobby.tscn find MenuArt above Center. For a lobby-only variation use Save Scene As on menu_art.tscn, then drag the copy from FileSystem to the lobby tree in place of the old instance. Keep it above Center.'],
    ['menu-guide/lobby','Save → F6 on lobby.tscn. Press Tab to move focus. Stop, set Amount to 20 in the lobby artwork and rerun. Watch the upper-right corner.']
  ],
  'duel-local': [
    ['duel-guide/setup-tree','Open scenes/duel.tscn. Expand Pilot2 and click Ring. This orange mesh will pulse when P2 takes damage.'],
    ['direction/ring-code','Open scripts/duel.gd. Use Find to jump to func _draw_round. The tween enlarges Ring only when hp is lower than displayed_hp.'],
    ['direction/duel','Click the Duel root → Hit Cue Seconds. Enter 0.12, save and press F6 → Local PvP. Face P2 and fire. Stop, change to 0.35, and repeat.']
  ],
  'duel-network': [
    ['direction/snapshot','Double-click scripts/duel.gd. Find apply_snapshot and follow hp.assign(state.hp) down to _draw_round(). This is the guest’s confirmed HP update.'],
    ['duel-guide/network-pair','Run the same saved project in two windows. In Duel modes → Network PvP choose Host in one. Join 127.0.0.1 in the other. Hit the amber pilot and watch both scores.'],
    ['direction/duel','Stop both copies. Select Duel in duel.tscn → Inspector → Hit Cue Seconds → enter 0.35 and save. Relaunch both copies before comparing the guest ring.']
  ]
};

// Values and sample times match the paired captures from the reference scene.
const comparisons = {
  'editor-tour':['camera','Size 14','Size 16','Look at the space beyond the floor edges.',0],
  variables:['guard','Window 0.18 s','Window 0.35 s','G is pressed at 0.75 s in both trials. Read the outcome when the bar reaches one second.',9],
  'functions-and-signals':['audio','−6 dB','−18 dB','Play the same guard chime at each Inspector level.'],
  'conditions-and-loops':['message','Generic hit text','Reason for the hit','The same early guard fails in both trials. Read the final label.',9],
  'animation-blend':['blend','Blend rate 3/s','Blend rate 10/s','Movement starts together and releases at 0.67 s. Watch the feet return to idle.',6],
  'projectiles-and-restart':['impact','Expand in 0.12 s','Expand in 0.24 s','Two impacts use the same ring. Follow its outer edge before it shrinks.',2],
  'player-attack-animation':['attack','Release at frame 5','Release at frame 9','Watch the space in front of the firing hand as the arm extends.',1],
  'enemy-weapon-timing':['contact','Contact at 75%','Contact at 50%','Watch when the scout recoils relative to the blade crossing its body.',4],
  'damage-reactions':['reaction','Cut to idle on landing','Hold the final pose','Both take a lethal hit. Compare the silhouette after the landing at frame 17.',8],
  'roll-stamina':['outline','Outline size 0','Outline size 3','Compare the same denial caption at the same stamina level.',0],
  'game-lobby':['sparks','8 particles','20 particles','A close-up of the lobby’s upper-right corner shows the change in density.',4],
  'duel-local':['ring','Hit cue 0.12 s','Hit cue 0.35 s','Two hits land on P2. Watch how long the orange ring stays enlarged after each hit.',2],
  'duel-network':['network','Guest cue 0.12 s','Guest cue 0.35 s','Both guest views receive identical HP updates. Compare their rings after the score drops.',2]
};

export function stepImage(id, index) {
  const [path, caption] = shots[id][index];
  return screenshot('./assets/' + path + '.webp', caption, true);
}

function setFrame(panel, index) {
  panel.style.setProperty('--frame-x', (index % 4) * 100 / 3 + '%');
  panel.style.setProperty('--frame-y', Math.floor(index / 4) * 50 + '%');
  panel.querySelector('output').textContent = (index / 8).toFixed(3) + ' s';
}

export function liveTuner(id) { return tuner(comparisons[id][0]); }

export function comparison(id) {
  const [name, before, after, note, initial] = comparisons[id];
  const prefix = '<section class="cue-compare"><h4>Compare before and after</h4><p>' + esc(note) + '</p>';
  if (name === 'audio') return prefix + '<div class="cue-audio">' + [before,after].map((value,i) => `<button type="button" class="secondary" data-cue-gain="${i ? -18 : -6}">Play ${i ? 'after' : 'before'} · ${value}</button>`).join('') + `</div><a class="lib-link" href="${folder}guard-cue.wav" download>Download this WAV for GuardSound ↓</a></section>`;
  const still = ['camera','outline'].includes(name);
  const ratio = {guard:'352/94',message:'352/94',outline:'307/45',sparks:'240/169'}[name] || '480/327';
  return prefix + `<div class="cue-pair" style="--frame-x:${initial%4*100/3}%;--frame-y:${Math.floor(initial/4)*50}%;--cue-ratio:${ratio}"><div class="cue-options" role="group" aria-label="Comparison view">${['Both','Before','After'].map((label,i)=>`<button type="button" class="secondary" data-cue-view="${i}" aria-pressed="${i===0}">${label}</button>`).join('')}</div><div class="cue-samples">${[before,after].map((value,i)=>`<figure><figcaption><b>${i?'After':'Before'}</b> · ${esc(value)}</figcaption><div role="img" aria-label="${esc(value)}" class="cue-frame ${still?'cue-still':''}" style="background-image:url('${folder}${name}-${i}.webp')"></div></figure>`).join('')}</div>${still?'':`<label class="cue-time">Compare at the same time <input type="range" min="0" max="11" step="1" value="${initial}" aria-label="Comparison time"><output>${(initial/8).toFixed(3)} s</output></label><button type="button" class="secondary" data-cue-play>Replay both</button>`}</div></section>`;
}

export function bindComparison(container) {
  bindTuner(container);
  const panel = container.querySelector('.cue-pair');
  const range = panel?.querySelector('input');
  for (const button of panel?.querySelectorAll('[data-cue-view]') || []) {
    button.onclick = () => {
      const view = Number(button.dataset.cueView);
      panel.querySelector('.cue-samples').classList.toggle('cue-single', view !== 0);
      panel.querySelectorAll('figure').forEach((figure,i) => { figure.hidden = view !== 0 && view !== i+1; });
      for (const peer of panel.querySelectorAll('[data-cue-view]')) peer.setAttribute('aria-pressed', String(peer === button));
    };
  }
  if (range) {
    const button = panel.querySelector('[data-cue-play]');
    let timer;
    const stop = () => { clearInterval(timer); timer = null; button.textContent = 'Replay both'; };
    range.oninput = () => { stop(); setFrame(panel, Number(range.value)); };
    button.onclick = () => {
      if (timer) { stop(); return; }
      range.value = 0;
      setFrame(panel, 0);
      button.textContent = 'Pause';
      timer = setInterval(() => {
        if (!panel.isConnected || !panel.closest('details').open || Number(range.value) === 11) { stop(); return; }
        range.value = Number(range.value) + 1;
        setFrame(panel, Number(range.value));
      }, 125);
    };
  }
  const audioButtons = container.querySelectorAll('[data-cue-gain]');
  if (audioButtons.length) {
    const sound = new Audio();
    for (const button of audioButtons) button.onclick = () => {
      sound.src = folder + `guard-minus-${Math.abs(Number(button.dataset.cueGain))}.wav`;
      sound.currentTime = 0;
      sound.play().catch(() => { button.textContent = 'Playback unavailable · download WAV below'; });
    };
  }
}
