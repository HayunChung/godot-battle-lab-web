import {stepImage, comparison} from './direction-media.js';
import {esc} from './ui.js';

const smash = ['Nintendo · Perfect Shield', 'https://www.smashbros.com/en_US/howtoplay/technique.html'];
const valorant = ['Riot Games · The State of Hit Registration', 'https://playvalorant.com/en-gb/news/dev/the-state-of-hit-registration/'];

// Each exercise opens from the lesson where the learner meets its scene or event.
const workshops = {
  'editor-tour': [
    'Frame both ends of the arena',
    'In the reference project open scenes/arena.tscn and select Camera3D. Turn on Preview in the 3D viewport. Use the orthographic Size control to frame the player, enemy and border in one shot.',
    'Keep Camera3D under Arena and enable Current. Run the scene with F6. Walk to each corner while a friend watches the opposite edge.',
    'Increase Size by two units and repeat. Pick the tighter shot that still shows the floor edges and leaves space between the HUD and both actors.'
  ],
  'variables': [
    'Expose the timing of a perfect guard',
    'Nintendo’s Perfect Shield rewards guarding immediately before impact. Our practice/guard.tscn turns that timing decision into a one-second strike. The 0.18-second window is our exercise value. Download the reference game below and open the scene.',
    'Select GuardPractice and open its attached guard.gd. The @export_range declaration makes guard_window editable in the Inspector. Meter fills as elapsed approaches IMPACT. Press F6, R to begin, then tap G just before it fills.',
    'Change Guard Window from 0.18 to 0.35. Try G about three quarters of the way through each run. That input expires at the original setting and blocks at the wider setting. Restore 0.18 before the conditions exercise.', smash
  ],
  'functions-and-signals': [
    'Give a successful guard its own sound',
    'Open practice/guard.tscn. Drop a short WAV into FileSystem, add an AudioStreamPlayer child named GuardSound under GuardPractice, and drag the WAV into Stream. Leave Autoplay off.',
    'In guard.gd declare signal guard_blocked above the variables. Add func _ready() -> void: with the indented line guard_blocked.connect($GuardSound.play.bind(0.0)). In the perfect-guard branch, directly after setting the success text, add guard_blocked.emit() at the same indentation.',
    'Run with F6. Try an early tap, a last-moment tap and no tap, pressing R for each strike. Only the successful guard should sound. Lower Volume dB on GuardSound and repeat with the text still visible.'
  ],
  'conditions-and-loops': [
    'Resolve a strike once and explain the outcome',
    'Open practice/guard.gd beside guard.tscn. Follow R resetting pressed_at to -1 and G recording elapsed on the first press. In _physics_process the bar advances until IMPACT, then running becomes false so the result remains on screen.',
    'In the final if/elif/else block, keep the missing-input check first. For a recorded input compute IMPACT - pressed_at and compare it with guard_window. Give each branch a distinct Cue.text explaining whether the guard was missing, on time or expired.',
    'At a 0.18 window, test three rounds with F6 and R. Skip G, tap near halfway, then tap near 90%. Expect missing, expired and blocked. Hold G after an early press and verify the guard still expires.', smash
  ],
  'animation-blend': [
    'Soften the transition from a planted foot to a step',
    'Open player.tscn and preview idle and walk at the two ends of the AnimationTree blend graph. Watch the hips when you drag slowly between them.',
    'In stages/animated_player.gd add a member var blend := 0.0. In _physics_process after moving is computed, add blend = move_toward(blend, 1.0 if moving else 0.0, delta * 6.0). Pass blend as the second argument of the existing AnimationTree.set call.',
    'Run the movement lesson scene and tap W repeatedly. Compare rates 3 and 10. Choose the slowest transition that still plants the feet promptly on release.'
  ],
  'projectiles-and-restart': [
    'Build an impact that reads at game-camera distance',
    'Open scenes/impact.tscn. Its TorusMesh makes a hollow silhouette. Open scripts/impact.gd and follow the two scale tweens, first expanding over 0.12 seconds and then shrinking before queue_free.',
    'In scripts/projectile.gd find _on_area_entered. It creates IMPACT under the arena and sets its global_position to the projectile position. To try another design, duplicate impact.tscn, edit its mesh material, and point the IMPACT preload at the copy.',
    'Run Arena. Fire past the enemy, then land one shot. Only the hit should burst. Double the first tween duration, compare two rapid hits, and shorten it if the older ring hides the next contact.'
  ],
  'player-attack-animation': [
    'Put the release on a readable silhouette',
    'In Blender’s Action Editor scrub the attack at game-camera scale. Key a drawn-back pose, an extended release and a relaxed recovery. Leave space between the weapon hand and torso at release.',
    'Export the action with the character GLB. In the player attack workshop load that GLB, select its attack clip and set the release point to the extended pose. Preview a single shot before downloading the tuned kit.',
    'Shift the release one pose earlier and compare. Watch the hand and projectile together. Keep the version where the shot leaves as the hand opens, then test repeated fire for a clean return to idle.'
  ],
  'enemy-weapon-timing': [
    'Stage an attack the opponent can anticipate',
    'In the enemy attack action, key the weapon high before the swing. Hold the raised silhouette for several frames, then cross the target quickly. Write down the frame where the blade first reaches it.',
    'Export the GLB and load it in the enemy weapon workshop. Set contact time to the contact frame’s offset from clip start divided by clip duration in frames. Preview the pose, then use Practice a swing.',
    'Try staying in range and stepping aside. Lengthen the anticipation in Blender, re-export, and recalculate contact time. The player should be able to read the wind-up while damage still lands on the blade pass.'
  ],
  'damage-reactions': [
    'Give a hit and a knockout different endings',
    'Author a short recoil that comes back to the ready pose and a separate fall that settles on the floor. Scrub the last frames from the arena camera angle.',
    'Export both actions in the GLB. In Practice hit & fall map the two clips to the actor you edited. Trigger a surviving hit, then a final hit. Check both the player and enemy assignments before exporting.',
    'If recoil resembles a knockout, reduce its downward travel. If the final pose pops, hold the last fall pose for a few frames. Re-export and compare the two outcomes again.'
  ],
  'roll-stamina': [
    'Show why a roll was denied',
    'In scenes/arena.tscn select HUD/Stamina/Caption. Add a font outline using Theme Overrides → Constants → Outline Size, starting at 3. Leave room for the full denial message.',
    'Open scripts/arena.gd and trace roll_denied from _ready to _show_stamina_denial and _update_stamina. Edit the wording where the cost is appended to caption.text. Keep both the action name and required amount.',
    'Run the arena and roll until the meter cannot pay. Check the message at the moment of denial and when the required amount regenerates. Resize the window and adjust the caption width if the cost gets clipped.'
  ],
  'game-lobby': [
    'Set the motion behind the lobby buttons',
    'Open scenes/menu_art.tscn and select SparksAnchor/Sparks. In the 2D preview compare two Amount values, such as 8 and 20. Look for particles crossing the title or button text.',
    'Open scenes/lobby.tscn. MenuArt draws behind Center. To give only the lobby a new look, save a copy of menu_art.tscn, replace the lobby instance with that copy at the same sibling position, and keep its mouse filter on Ignore.',
    'Run the lobby with F6. Compare both densities while moving keyboard focus through the buttons. Reduce particle lifetime or amount until the focused button stays easy to find.'
  ],
  'duel-local': [
    'Show which pilot took a confirmed hit',
    'Riot describes separating immediate firing feedback from confirmed damage. In scenes/duel.tscn, each pilot already has a Ring mesh. Use its size to mark the damaged pilot while its position continues following that pilot.',
    'Open scripts/duel.gd and find _draw_round. Compare hp[slot] with displayed_hp[slot]. On a decrease, enlarge the ring, then tween its scale back to resting_scales[slot]. Store the displayed HP after the comparison so the next draw cannot replay the same hit.',
    'Press F6 and choose Local PvP. Miss once, then hit the other pilot. Only the damaged pilot’s ring should pulse. In the Duel root Inspector compare Hit Cue Seconds at 0.12 and 0.35. Rematch and check both rings return to their starting size.', valorant
  ],
  'duel-network': [
    'Keep host and guest hit cues in sync',
    'Open scripts/duel.gd. Follow one hit from tick_pair reducing hp to snapshot copying hp. The guest receives that value in apply_snapshot and calls _draw_round. Both windows run the ring cue from that same decrease.',
    'Run two copies, host one and join from the other. Fire into empty space on the guest, then hit the host. Watch the target ring and score on both windows. A shot in flight has no confirmed damage yet.',
    'Set Hit Cue Seconds to 0.35 in the saved scene and relaunch both copies. Compare one hit and one rematch. Repeated snapshots at the same HP should leave the ring at rest once its tween ends. Multiple hits between snapshots can appear as one pulse.', valorant
  ]
};

export function directionWorkshop(id) {
  const lesson = workshops[id];
  if (!lesson) return '';
  const [title, make, attach, tune, source] = lesson;
  const rig = {
    'player-attack-animation': ['character-guide/Beacon-Pilot.blend','Beacon Pilot'],
    'enemy-weapon-timing': ['reactions-guide/Sentinel.blend','Sentinel'],
    'damage-reactions': ['reactions-guide/Sentinel.blend','Sentinel']
  }[id];
  return `<details class="direction-workshop"><summary>Direction workshop · ${esc(title)}</summary><p><a class="lib-link" href="./downloads/battle-lab.zip" download>Reference Godot project ↓</a>${rig ? ` <a class="lib-link" href="./assets/${rig[0]}" download>${rig[1]} Blender file ↓</a>` : ''}${id === 'functions-and-signals' ? ' <a class="lib-link" href="./assets/direction/guard-cue.wav" download>GuardSound WAV ↓</a>' : ''}</p><ol><li><b>Create.</b> ${esc(make)}${stepImage(id,0)}</li><li><b>Attach.</b> ${esc(attach)}${stepImage(id,1)}</li><li><b>Revise and test.</b> ${esc(tune)}${stepImage(id,2)}</li></ol>${comparison(id)}${source ? `<p><a class="lib-link" href="${esc(source[1])}" target="_blank" rel="noopener">${esc(source[0])} ↗</a></p>` : ''}</details>`;
}
