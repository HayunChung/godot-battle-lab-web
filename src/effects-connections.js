import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

// Each practice starts in a shipped scene from the reference project.
const exercises = {
  'nodes-and-collisions': {
    title:'Light the arena floor',
    steps:[
      'Open scenes/arena.tscn. In the Scene dock select Arena → Light. This DirectionalLight3D lights the whole floor from one direction. Press F6 to see its shadows, then F8.',
      'In Inspector search for Energy. Run once at the original 1.15, then set Energy to 0.45, save and run again. Compare the lit sides of the pilots and the floor under their feet.',
      'Restore Energy to 1.15. To change which way the shadows fall, clear the filter and set Transform → Rotation → Y from −30° to 30°. Save and run. Restore −30° after the comparison.'
    ],
    photo:'effects-practice/lighting',
    caption:'Godot 4.4.1 · Select Light in the Scene dock. In Inspector, the Energy field shows the edited value of 0.45.',
  },
  'pvp-results': {
    title:'Reveal the match winner with a short fade',
    steps:[
      'Open scenes/match_flow.tscn. Open the script on MatchFlow and find _finish_round(). Under if wins.max() >= wins_needed, locate the _card() call that sets the match winner. Insert the two lines below immediately after that call, at the same indentation. Title is the Label at Overlay → Center → Card → Column → Title.',
      'The first line makes the title transparent. The Tween brings only its alpha (opacity) back to 1 over 0.30 seconds. Change 0.30 to 0.75 to compare a slower reveal.',
      'Select MatchFlow and set Wins Needed to 1 for this test. Save, press F6, start the ready check, accept for both pilots and enter the arena. Leave P2 still and fire with P1 until three hits land. Watch the winner appear while the score is already readable. Restore Wins Needed to 2 when finished.'
    ],
    codeStep:0, code:'title.modulate.a = 0.0\ncreate_tween().tween_property(title, "modulate:a", 1.0, 0.30)',
    photo:'effects-practice/victory',
    caption:'Godot 4.4.1 · In _finish_round(), the two selected lines follow the winner card. The else branch below still displays the ordinary round result.',
    next:['effects-animation','Practice changing animation timing'],
  },
  'character-body': {
    title:'Attach a label that follows the pilot',
    steps:[
      'Open scenes/player.tscn. Select the Player root → Add Child Node (+) → Label3D → Create. Rename the new node PilotTag. A child inherits the movement of its parent.',
      'With PilotTag selected, set Text to SCOUT, set Billboard to Enabled so the letters face the camera, and set Transform → Position → Y to 2.2. Set Font Size to 48 and save.',
      'Open scenes/arena.tscn, press F6 and move with A and D. The tag should travel directly above the scout. Stop with F8 and compare Y = 1.6 with Y = 2.2 in player.tscn. Keep the lowest height that clears the head while walking.'
    ],
    photo:'effects-practice/tag',
    caption:'Godot 4.4.1 · PilotTag is selected under Player. The viewport shows the tag above the scout. Its Text field reads SCOUT.',
  },
  'hitboxes': {
    title:'Separate a projectile’s appearance from its hit radius',
    steps:[
      'Open scenes/projectile.tscn. The MeshInstance3D child draws the pulse. Its sibling CollisionShape3D supplies the shape used to detect a hit. Select MeshInstance3D → Inspector → Mesh and click the SphereMesh resource.',
      'Expand its Material resource. Under Emission leave Enabled on and change the emission color to amber (#ff9b42). Under Albedo set Color to the same amber. Save and run scenes/arena.tscn with F6. Fire one shot across empty floor and one at the sentinel.',
      'Press F8. In projectile.tscn set the SphereMesh Radius from 0.16 to 0.24 and Height from 0.32 to 0.48. Expand CollisionShape3D → Shape to verify its Radius still reads 0.18. Replay both shots. The visible pulse is larger, and only a confirmed overlap produces an impact.'
    ],
    photo:'effects-practice/projectile',
    caption:'Godot 4.4.1 · MeshInstance3D is selected. Its StandardMaterial3D shows the amber Emission swatch. CollisionShape3D remains a separate child.',
    next:['effects-hit','Trigger a separate cue when a hit lands'],
  },
  'shared-stamina': {
    title:'Tint the caption when a roll becomes too expensive',
    steps:[
      'Open scenes/arena.tscn and expand HUD → Stamina → Caption. In scripts/arena.gd find _update_stamina(value). This function updates the HUD each time stamina changes. Insert the line below immediately after bar.value = value with the same indentation.',
      'Save and run arena.tscn with F6. Roll twice with Shift before stamina recovers. At the default 40-point roll cost, the caption turns amber while another roll is unaffordable. Stop spending and watch it return to white when enough stamina regenerates.',
      'Change the hex color to #ffc98a and repeat. Check that the amount and the “Need” message remain legible against the arena. The comparison uses the current roll cost, so it also follows later balance edits.'
    ],
    codeStep:0, code:'caption.self_modulate = Color("#ffad60") if value < player.roll_stamina_cost else Color.WHITE',
    photo:'effects-practice/stamina',
    caption:'Godot 4.4.1 · The highlighted line follows bar.value = value inside _update_stamina. It tints the caption when the player cannot afford a roll.',
  },
  'guided-tutorial': {
    title:'Bring in the next instruction as an action succeeds',
    steps:[
      'Open scenes/tutorial.tscn. Select Training and open its script, scripts/tutorial.gd. Find _advance(). It increments step and calls _show_step() after the player completes the current action.',
      'To keep quick consecutive actions smooth, add var prompt_tween: Tween above _ready(). Paste the lines below at the end of _advance(), directly after _show_step(). Indent the block one level inside the function; keep kill() one level deeper.',
      'Save and press F6 on tutorial.tscn. Walk, fire, then roll. After each correct action the new prompt should brighten to full opacity. Wrong actions should leave the current prompt steady. Compare 0.20 and 0.45 seconds while completing the steps quickly.'
    ],
    codeStep:1, code:'if prompt_tween:\n    prompt_tween.kill()\n$HUD/Prompt.modulate.a = 0.4\nprompt_tween = create_tween()\nprompt_tween.tween_property($HUD/Prompt, "modulate:a", 1.0, 0.20)',
    photo:'effects-practice/tutorial',
    caption:'Godot 4.4.1 · In _advance(), the highlighted lines run once after the instruction changes. The next function updates the prompt text.',
    next:['effects-animation','Build a reusable animation with keyframes'],
  },
  'duel-bot': {
    title:'Show the bot’s firing boundary during practice',
    steps:[
      'Open scenes/duel.tscn. Select Pilot2 → Add Child Node (+) → MeshInstance3D → Create and rename it RangeGuide. Set Transform → Position → Y to 0.06. Under Mesh choose New TorusMesh and click the new resource.',
      'Set Outer Radius to 4.05, Inner Radius to 3.95, then select RangeGuide again and set Transform → Scale → Y to 0.2. This makes a thin floor ring centered on the bot’s default 4 m firing boundary. Turn off Visibility → Visible before saving.',
      'In scripts/duel.gd find start_round(kind). Add the first line below directly after mode = kind. Add the second line in show_modes() directly after mode = "". Save, run duel.tscn with F6 and choose Practice against a bot. Stay still while the bot approaches; it stops and fires near the edge of the guide. Choose Leave round, then Local PvP, and check that the guide stays hidden.',
      'Try Bot Range = 5 on the Duel root. Change the torus outer and inner radii to 5.05 and 4.95 and repeat. The script reads Bot Range for firing; the two mesh radii are your illustration of that distance.'
    ],
    codeStep:2, code:'$Pilot2/RangeGuide.visible = kind == "bot"\n\n# In show_modes():\n$Pilot2/RangeGuide.hide()',
    photo:'effects-practice/range',
    caption:'Godot 4.4.1 · RangeGuide is a child of Pilot2. Its TorusMesh Inspector shows Inner Radius 3.95 and Outer Radius 4.05.',
  },
};

export function effectsConnections(id) {
  const e = exercises[id];
  if (!e) return '';
  const link = e.next ? `<a class="lib-link" href="#/lesson/${e.next[0]}">${esc(e.next[1])} →</a>` : '';
  return `<details class="trouble"><summary>Godot effects practice · ${esc(e.title)}</summary><div class="practice-help"><p>Work in your own extracted copy of the <a href="./downloads/battle-lab.zip" download>reference game</a>.</p>${screenshot('./assets/'+e.photo+'.webp', e.caption, true)}<ol>${e.steps.map((s,i)=>`<li>${esc(s)}${i === e.codeStep ? `<pre tabindex="0"><code>${esc(e.code)}</code></pre>` : ''}</li>`).join('')}</ol>${link}</div></details>`;
}
