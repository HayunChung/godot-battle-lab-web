import {parameters} from './direction-values.js';
import {esc} from './ui.js';
import {screenshot} from './screenshot.js';

// Each anchor is resolved against the tuned project files during the site build.
export const editorLessons = {
  camera: {
    field:'Size', run:'Walk to the floor edge with WASD. Look at how much of the opposite edge remains visible.',
    effect:'A larger Size shows more floor; the pilots appear smaller.',
    why:'Camera3D reads Size directly when it draws the orthographic view.'
  },
  guard: {
    field:'Guard Window', run:'Click the game, press R, then tap G when the bar is three quarters full. Repeat at the same point.',
    effect:'At that input time, 0.25 seconds remain until impact. A window of at least 0.25 s blocks the hit; a shorter one expires.',
    why:'The guard script compares the time left at the first press with the window saved on GuardPractice.',
    refs:[['practice/guard.gd','elif IMPACT - pressed_at <= guard_window:',3]]
  },
  audio: {
    field:'Volume dB', run:'Keep the device volume fixed. Press R, then tap G just before the bar fills. Listen for the successful guard.',
    effect:'A value closer to 0 dB plays the same WAV louder. An expired guard stays silent.',
    why:'A successful guard emits this signal. Its listener starts GuardSound, whose AudioStreamPlayer applies Volume dB.',
    refs:[['practice/guard.gd','guard_blocked.emit()',1],['practice/guard.gd','guard_blocked.connect($GuardSound.play)',1]]
  },
  message: {
    field:'Result Seconds', run:'Press R and let the bar fill without guarding. Watch from the first “Hit” until “Press R when ready.”',
    effect:'The larger value keeps the result on screen longer after the strike.',
    why:'When the strike finishes, result_seconds starts a countdown. At zero the label returns to the ready prompt.',
    refs:[['practice/guard.gd','result_left = result_seconds',1],['practice/guard.gd','result_left = maxf(0.0, result_left - delta)',3]]
  },
  blend: {
    field:'Blend Rate', run:'Hold W for a second, release it and watch the legs settle back into idle. Repeat the same movement.',
    effect:'A larger rate moves the blend toward its target faster, especially just after release.',
    why:'Player inherits this movement script. It advances the blend value and sends it to AnimationTree.',
    refs:[['stages/animated_player.gd','blend = move_toward(',2]]
  },
  impact: {
    field:'Expansion Seconds', run:'Face the enemy and tap Space. Watch the orange ring from first contact to maximum size.',
    effect:'A longer expansion takes more time to reach the same maximum size. The shrink time stays at 0.12 s.',
    why:'Each projectile hit creates an Impact instance. Its first tween reads this duration.',
    refs:[['scripts/impact.gd','Vector3.ONE * 2.5, expansion_seconds',2]]
  },
  attack: {
    field:'Attack Release Seconds', run:'Stand still and tap Space once. Watch the firing hand and the first instant the projectile appears.',
    effect:'A larger release time places the shot later in the same attack animation.',
    why:'During the attack, the player checks elapsed time against the saved release time, then fires once.',
    refs:[['scripts/player.gd','if not released and elapsed >=',3]]
  },
  contact: {
    field:'Attack Contact Fraction', run:'Stand still in front of the enemy. Watch its blade and the instant the player loses HP. Repeat from the same position.',
    effect:'A larger fraction checks the blade later in the swing. The swing can miss if the blade has already passed.',
    why:'The enemy converts the fraction to seconds, samples that pose and checks the weapon against the player.',
    refs:[['scripts/enemy.gd','var contact_time := attack_contact_fraction',6]]
  },
  reaction: {
    field:'Fall Speed', run:'Aim at the enemy and fire until its HP reaches zero. Watch from the final hit until the body settles.',
    effect:'A larger multiplier plays the fall faster. Compare the fall after a lethal hit.',
    why:'The Reactions child advances the death clip clock at the saved multiplier and samples that time.',
    refs:[['scripts/reactions.gd','elapsed = minf(elapsed + delta * (fall_speed',4]]
  },
  outline: {
    field:'Theme Overrides → Constants → Outline Size', run:'Roll with Shift until the game denies the next roll. Read the stamina caption over the floor.',
    effect:'A larger outline makes the edge around each letter thicker; zero removes the outline.',
    why:'Label draws its letters with the saved theme override. The arena script supplies the caption text.',
    refs:[['scripts/arena.gd','caption.text +=',1]]
  },
  sparks: {
    field:'Amount', run:'Look at the particles above the upper-right side of the lobby. Watch for several seconds.',
    effect:'A larger Amount makes that corner denser at the same particle lifetime.',
    why:'The lobby instances MenuArt. Its CPUParticles2D node reads Amount directly to set the particle count.'
  },
  ring: {
    field:'Hit Cue Seconds', run:'Choose Local PvP. Facing the orange pilot, tap Space once and watch the ring under the pilot that loses HP.',
    effect:'A larger duration leaves the ring enlarged longer after each confirmed hit.',
    why:'Duel animates the damaged pilot’s ring back to its resting scale over hit_cue_seconds.',
    refs:[['scripts/duel.gd','hit_tweens[slot].tween_property(',1]]
  },
  network: {
    field:'Hit Cue Seconds', run:'Open Debug → Customize Run Instances and enable two instances. Press F5. In Network PvP host in one window and join 127.0.0.1 in the other. Both click Ready, then Enter arena after loading. After the countdown, hit P2 and watch the guest ring.',
    effect:'A larger duration keeps the confirmed ring visible longer in both windows. Stop both and relaunch the saved project for each run.',
    why:'The guest copies the host’s HP and redraws. The same Duel tween runs on a confirmed drop in both modes.',
    refs:[['scripts/duel.gd','hp.assign(state.hp)',5],['scripts/duel.gd','hit_tweens[slot].tween_property(',1]]
  }
};

export function lessonRecord(kind,value,source) {
  const key=kind==='network'?'ring':kind;
  const [label,unit,min,max,,initial,,,property,start]=parameters[key];
  const lesson=editorLessons[kind];
  const fmt=n=>String(n)+(unit?' '+unit:'');
  const threshold=kind==='guard'?0.25:(min+max)/2;
  const other=value<threshold?max:min;
  const assignment=property+' = '+value;
  const consumer=source.reads[0];
  const inspect=consumer
    ? `In FileSystem double-click res://${consumer.file}. In the script editor scroll to line ${consumer.line} in ${consumer.func}(). Match the line with the excerpt above. ${lesson.why}`
    : `Keep ${source.tree} selected. Compare the Inspector field with the scene assignment above. ${lesson.why}`;
  const steps=[
    ['Open your copy','Click Download my Godot project. Extract the ZIP. In the Godot 4.4.1 Project Manager choose Import, select project.godot in the extracted folder and open it.'],
    ['Find your saved value',`In FileSystem double-click res://${source.file}. In the local Scene tree select ${source.tree}. In Inspector open ${lesson.field}. Confirm it reads ${fmt(value)}.`],
    ['Trace the effect',inspect],
    ['Run the original',`Press F5 to play res://${start}.tscn. ${lesson.run} Press F8 to stop.`],
    ['Make one edit',`Return to res://${source.file}. Select ${source.tree} again, click the numeric field for ${lesson.field}, enter ${other}, then press Enter. Save the scene with Ctrl+S (⌘S on Mac).`],
    ['Check the difference',`Press F5 and repeat the same action. ${lesson.effect} Press F8. To match your web preview again, set ${lesson.field} back to ${value}, save and run once more.`]
  ];
  const exampleEdit=initial<threshold?max:min;
  const photoNames=['import',kind+'-pick',kind+'-code',kind+'-before',kind+'-edit',kind+'-compare'];
  const captions=[
    'In the Godot Project Manager, click the outlined Import button.',
    `Select ${source.tree} in the Scene dock (teal). In Inspector, filter for ${lesson.field.split(' → ').at(-1)} and find the outlined row (gold). Example capture: ${fmt(initial)}. Your copy opens with ${fmt(value)}.`,
    source.reads.length
      ? source.reads.map(r=>`Open res://${r.file} at line ${r.line}.`).join(' ')+' The outline marks the code to read.'
      : `Godot reads this built-in field directly. Match the outlined ${lesson.field} field to ${property} in the scene.`,
    'Click the outlined Run Project triangle or press F5. The game view below shows the example playtest.',
    `Click the number inside the gold outline, type ${other}, press Enter and save. The example capture shows ${fmt(exampleEdit)}.`,
    kind==='audio'
      ? `Both captures show a successful guard. Listen in Godot at ${fmt(value)}, then ${fmt(other)} to compare the volume.`
      : `Example playtest at the same point with ${fmt(initial)} and ${fmt(exampleEdit)}. Repeat the action above with your own values.`
  ];
  const photos=photoNames.map((name,i)=>({filename:name+'.webp',caption:captions[i]}));
  return {label,assignment,steps,source,why:lesson.why,photos};
}

export function sourceView(record) {
  const {assignment,source,why}=record;
  return `<h5>Where this value goes</h5><p><code>res://${esc(source.file)} · line ${source.line}</code></p>
  <p>Scene tree · ${esc(source.tree)}</p><pre><code>${esc(source.header)}\n<strong data-live-property>${esc(assignment)}</strong></code></pre>
  <p>${esc(why)}</p>${source.reads.map(r=>`<p><code>res://${esc(r.file)} · line ${r.line} · ${esc(r.func)}()</code></p><pre><code>${esc(r.code)}</code></pre>`).join('')}`;
}

export function editorSteps(record) {
  return '<h5>Try it in the downloaded project</h5><ol>'+record.steps.map(([title,body],i)=>{
    const {filename,caption}=record.photos[i];
    return `<li><p><b>${esc(title)}.</b> ${esc(body)}</p>${screenshot('./assets/direction-editor/'+filename,caption,true)}</li>`;
  }).join('')+'</ol>';
}

export function portableLesson(record) {
  const {label,assignment,steps,source,why}=record;
  return [`# ${label} — Godot editor practice`,`res://${source.file}, line ${source.line} · ${source.tree}`,
    '~~~ini\n'+source.header+'\n'+assignment+'\n~~~',why,
    ...source.reads.map(r=>`res://${r.file}, line ${r.line} · ${r.func}()\n\n~~~gdscript\n${r.code}\n~~~`),
    ...steps.map(([title,body],i)=>`${i+1}. **${title}.** ${body}\n\n   ![${record.photos[i].caption}](workshop-images/${record.photos[i].filename})\n\n   ${record.photos[i].caption}`)].join('\n\n')+'\n';
}
