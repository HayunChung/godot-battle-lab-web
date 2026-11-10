import {settingsLesson,settingsReading} from './duel-vibration-settings.js';
import {rumbleLesson,rumbleReading} from './duel-rumble.js';
import {duelEffectsLesson,duelEffectsReading} from './duel-effects-lesson.js';
const scene = 'scenes/hit_feedback.tscn';
const script = 'scripts/hit_feedback.gd';

const step = (id, title, image, caption, directions, expected) => ({
  id, title, image: 'hit-feedback/' + image, caption, directions, body: directions.join('\n'), expected
});

const openProject = 'Download the reference project on this page and extract the ZIP. In the Godot 4.4.1 Project Manager click Import, open the extracted project.godot, and wait for the editor to finish importing. In FileSystem double-click scenes/hit_feedback.tscn.';
const read = (code, meaning) => ({code, meaning});
const fix = (symptom, remedy) => ({symptom, fix: remedy});

export const effectsReadings = {
  'effects-particles': {file:'res://' + scene, lines:[
    read('amount = 12','The emitter can draw twelve particles during this emission cycle. Changing Amount changes the density of the impact.'),
    read('lifetime = 0.35','Lifetime is measured in seconds. Shorter-lived sparks disappear closer to the impact when their starting speeds stay the same.'),
    read('one_shot = true','Each trigger plays one emission cycle. Another confirmed hit can restart the burst.')
  ]},
  'effects-animation': {file:'res://' + scene, lines:[
    read('resource_name = "hit_flash"','This is the clip the script plays when the target is hit.'),
    read('length = 0.24','The clip spans 0.24 seconds from the starting pose to the return pose.'),
    read('tracks/0/path = NodePath("Target:scale")','This property track writes scale values to the node named Target. Its keys specify how large the target should be at particular times.')
  ]},
  'effects-hit': {file:'res://' + script, lines:[
    read('signal hit','The scene declares one event that the effect can listen for.'),
    read('hit.connect(_play_hit)','Connect the hit signal to a function once when the scene opens. The same connection works for later hits.'),
    read('hit.emit()','Publish a confirmed contact. The connected effect function runs for this hit.'),
    read('burst.restart()','Reset the particle simulation so a rapid second hit starts a fresh burst.'),
    read('animation.play(&"hit_flash")','The preceding stop rewinds the player. Play starts the named clip again on this contact.')
  ]}
};

export const effectsModule = {
  title:'Game Effects in Godot',
  description:'Build a particle burst, key a hit animation, and make them replay together when a shot hits.',
  lessons:[
    {id:'effects-particles', title:'Build a one-shot particle burst', minutes:15,
      concept:'A particle is one small moving mark, such as a spark. An emitter creates a group of those marks. This 2D exercise uses CPUParticles2D to draw sparks over a target. Amount sets their number, Lifetime sets how long they survive, and One Shot lets the burst end on its own.',
      analogy:'Treat the emitter like a Blender particle emitter attached at a point. Moving the emitter changes where the sparks originate. Changing Amount changes how many it produces.',
      diagram:['Confirm a hit at the target','Burst emits a group of sparks','Each spark expires after its Lifetime'],
      steps:[
        step('find','Find and replay the emitter','particles','Godot editor · Select Burst in the Scene dock to see the settings for one emission cycle.',[
          openProject,
          'Press F6 to run the open scene. Click Trigger hit, watch the sparks around the target, then click again. Press F8 to return to the editor. Expand HitFeedback in the Scene dock, select Burst, and find Amount and Time in the Inspector.'
        ],'A short spray appears at each hit. Between hits the target sits still and the emitter is quiet.'),
        step('attach','Add a particle node to your own copy','add-particles','Godot Create New Node · Type CPUParticles2D, select the matching row, then click the outlined Create button.',[
          'Choose Scene → Save Scene As and save scenes/my_hit_feedback.tscn. In the Scene dock rename Burst to ReferenceBurst with F2. Select HitFeedback, click + (Add Child Node), search CPUParticles2D and click Create. Rename the new child Burst. The script now finds this emitter by name.',
          'With the new Burst selected, set Transform → Position to X 500, Y 310, the center of the target. Turn Emitting off. Set Amount to 12 and, under Time, set Lifetime to 0.35, One Shot on and Explosiveness to 1.0. This releases the group together when triggered.',
          'Open Direction and set Spread to 180 degrees. Set Gravity to (0, 0). Set the Initial Velocity minimum to 420 and maximum to 510 pixels per second. Under Scale set the scale amount minimum to 4 and maximum to 7. Save, press F6 and click Trigger hit. Your new sparks use the default white color. To match the sample, use the Color field to choose amber.'
        ],'The new emitter sprays sparks outward from the center and stops. ReferenceBurst stays quiet. Press F8 to edit again.'),
        step('tune','Compare density and duration separately','particle-compare','Godot playtest · Compare two captures of the same burst. Change a single Inspector field between your own runs.',[
          'In the Local Scene tree of my_hit_feedback.tscn select Burst. With Lifetime at 0.35 s, change Amount from 12 to 36. Press Enter, save, press F6 and click Trigger hit. Look for more sparks around the same target. Press F8.',
          'Keep Amount at 36 and change only Lifetime from 0.35 to 0.65 s. Save and trigger the hit again. Watch how long the last sparks remain. For the original appearance, restore Amount to 12 and Lifetime to 0.35.'
        ],'Increasing Amount makes the group denser. Increasing Lifetime at the same speed keeps the sparks visible longer.')
      ],
      files:[scene,script],
      question:'The spark count looks right, but the effect lingers too long. Which change should you try first?',
      options:['Increase Amount','Shorten Lifetime','Move the target'],answer:1,feedback:'Lifetime controls each particle’s time on screen. Keep the other values fixed when comparing two lengths.',
      troubleshooting:[fix('The Inspector shows a script resource.','Click Burst in the Scene dock. FileSystem selects the saved file. The Scene dock selects the emitter whose properties you can edit.'),fix('My copied emitter stays quiet.','Check the name Burst and its parent HitFeedback. Press F6 on the copy and click Trigger hit. F5 launches the main arena.')],
      references:[{label:'CPUParticles2D properties',url:'https://docs.godotengine.org/en/4.4/classes/class_cpuparticles2d.html'}]
    },
    {id:'effects-animation',title:'Key a hit flash with AnimationPlayer',minutes:18,
      concept:'AnimationPlayer changes properties over time. A track names one property on a node. A key stores its value at one moment, and the player fills the time between keys. In hit_flash, one track briefly enlarges the target and another changes its tint.',
      analogy:'The Animation panel works like a small Dope Sheet. Scale and Modulate have separate rows. Scrubbing the playhead lets you inspect the pose at the contact instant.',
      diagram:['Choose the hit_flash clip','Peak the scale at 0.08 s','Return to resting size at 0.24 s'],
      steps:[
        step('inspect','Scrub the supplied animation','animation','Godot editor · Choose AnimationPlayer and hit_flash. Each diamond belongs to the property listed on its row.',[
          openProject,
          'Click AnimationPlayer in the Scene dock. At the bottom open Animation and select hit_flash in the clip list. Expand Target’s tracks if needed. Click the time ruler at 0.00, 0.08 and 0.24 seconds. Watch both the target size and its tint in the 2D viewport.'
        ],'The target starts at normal size, swells briefly, then returns to its original size. Modulate controls its tint.'),
        step('keys','Add a scale track of your own','add-clip','Godot Animation panel · Open Animation → New, enter practice_scale and click OK before inserting the first Scale key.',[
          'Stop playback. Choose Scene → Save Scene As and save scenes/my_flash.tscn. Select AnimationPlayer. In the bottom panel click Animation → New, enter practice_scale and set the animation length to 0.24 seconds. The new clip starts empty.',
          'Move the playhead to 0.00. Select Target in the Scene dock. Under Inspector → Transform → Scale enter X 1 and Y 1, then click the key beside Scale. Confirm Create if Godot offers to create the track. Set the playhead to 0.08, enter X 1.25 and Y 1.25, and click the same key. At 0.24, key X 1 and Y 1. Use the timeline’s time field for an exact time.',
          'Play practice_scale in the Animation panel. The editor previews your new clip. The game’s hit script still plays the supplied hit_flash clip.'
        ],'Three keys appear on Target’s scale track. Scrubbing to the last key returns the target to its resting size.'),
        step('compare','Change the peak of the playable clip','animation-compare','Godot playtest · Compare target sizes at the peak of the hit. Both clips return to the same resting scale.',[
          'In the same scene select AnimationPlayer → hit_flash. Click the middle diamond on the Target scale track at 0.08 s. In the Inspector set its Value to X 1.60 and Y 1.60. Keep the first and last keys at (1, 1).',
          'Save, press F6 and click Trigger hit. Compare the larger pulse with the original scene’s 1.25 peak. Press F8, set the middle key back to 1.25 on both axes, and replay to check the difference.'
        ],'The edited target reaches 160% of its resting size at 0.08 s and returns to 100% at 0.24 s.'),
        step('attach','Make a confirmed hit play your new clip','rename-clip','Godot Rename Animation dialog · After renaming the supplied clip to reference_flash, enter hit_flash for your practice clip and click OK.',[
          'In scenes/my_flash.tscn select AnimationPlayer. Pick the supplied hit_flash clip, open Animation → Rename, and name it reference_flash. Pick your practice_scale clip, choose Animation → Rename again, and name this clip hit_flash. Keep both clips in the same library. Save the scene.',
          'Press F6 and click Trigger hit. The root script now finds your newly keyed clip, so the target changes size while keeping its resting tint. Click empty floor to test a miss, then press F8. To switch back in this copy, first rename your clip practice_scale, then rename reference_flash to hit_flash.'
        ],'A hit plays your scale-only animation and the particle burst. The original clip with the tint track is still available as reference_flash.'),
      ],files:[scene,script],
      question:'You want a stronger punch at impact with the same resting pose. Which key should change?',
      options:['The middle scale key at 0.08 s','The last scale key only','Every key on every track'],answer:0,feedback:'The middle key defines the peak. The first and last keys preserve the resting pose.',
      troubleshooting:[fix('The Animation panel is hidden.','Select the AnimationPlayer node, then click Animation along the bottom edge of the editor.'),fix('F6 still plays the old effect.','Check the scene tab and clip name. The running script requests hit_flash. Change that clip in the scene you run with F6.')],
      references:[{label:'Create animation tracks and keys',url:'https://docs.godotengine.org/en/4.4/tutorials/animation/introduction.html'}]
    },
    {id:'effects-hit',title:'Play both effects on a confirmed hit',minutes:12,
      concept:'A hit signal is a message that a shot reached the target. The game checks the shot first. On contact, one function restarts the sparks and the keyed flash. Both effects can change without changing which shots count.',
      analogy:'A single contact marker on a Blender timeline can guide sparks and a flash. Here the timing comes from the game’s hit test each time you shoot.',
      diagram:['Compare the click with the target polygon','Inside → emit hit','Listener → restart sparks and flash'],
      steps:[
        step('wire','Trace the signal to the effect nodes','event','Godot Script editor · Follow the confirmed hit to the listener that plays the particles and animation.',[
          openProject,
          'In the Scene dock click the script icon beside HitFeedback. Find _resolve_shot and the test using Geometry2D.is_point_in_polygon. It checks whether the shot point falls inside the target polygon. Follow hit.emit() in the hit branch.',
          'Find _ready and hit.connect(_play_hit). In _play_hit, identify the calls that restart Burst and play hit_flash. This is the place to add another response to a confirmed hit.'
        ],'You can point to the line that decides contact and the separate function that plays its visual feedback.'),
        step('miss','Try an empty shot and a repeated hit','event','Godot Script editor · Compare the paths for a shot inside the target and a shot outside it, then try both in the game.',[
          'Press F6. Click empty floor away from the target and buttons. Read the shot status and watch the target. Next click the target itself. Compare its status, sparks and flash. Trigger hit aims the sample shot at the center for repeatable comparisons.',
          'Click Trigger hit twice in quick succession. Watch the second burst begin while the first would still be fading. Press F8. In a combat project, connect this response where damage or a hit is confirmed so misses stay readable.'
        ],'A miss displays “Miss” and leaves the target untouched. A confirmed hit plays both cues, and a quick second hit starts them again.'),
        step('compare','Change the art and repeat the same shots','particle-compare','Godot playtest · Use the same center hit for each capture, then shoot outside the target to check the hit rule.',[
          'Open scenes/my_hit_feedback.tscn from the particle lesson, or save hit_feedback.tscn as a new practice scene. Select Burst and set Amount to 36. Save. Under AnimationPlayer → hit_flash set the middle Target scale key at 0.08 s to (1.60, 1.60) and save again.',
          'Press F6. Click the target once, then click outside it. Repeat with Trigger hit to compare identical contact positions. Write down which setting changed the number of sparks and which changed the silhouette. Restore 12 particles and a (1.25, 1.25) peak if you want the original cue.'
        ],'Hits now show a denser spray and a larger flash. The same empty shot still misses.')
      ],files:[script,scene],
      question:'Where should the game trigger these effects if a player can shoot and miss?',
      options:['On every input press','On every physics tick','After the game confirms contact'],answer:2,feedback:'A confirmed contact is shared by both effects. A miss stays visually distinct.',
      troubleshooting:[fix('Every shot looks like a hit.','Try empty floor inside the running window. Trigger hit always aims at the center. Check that hit.emit() remains inside the successful hit-test branch.'),fix('Only one of the two effects plays.','Check that the children are named Burst and AnimationPlayer and that the selected animation is named hit_flash. In Godot’s Output or Debugger, look for a missing node or clip.')],
      references:[{label:'Connect and emit signals',url:'https://docs.godotengine.org/en/4.4/getting_started/step_by_step/signals.html'}]
    }
  ]
};

effectsModule.lessons.push(duelEffectsLesson,rumbleLesson,settingsLesson);
effectsReadings[settingsLesson.id] = settingsReading;
effectsReadings[rumbleLesson.id] = rumbleReading;
effectsReadings[duelEffectsLesson.id] = duelEffectsReading;
for(const lesson of effectsModule.lessons){
  lesson.walkthrough = effectsReadings[lesson.id].lines.map(({code,meaning})=>({line:code,explanation:meaning}));
}
