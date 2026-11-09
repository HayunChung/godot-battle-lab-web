// Keep workshop steps independent of guide routes so existing bookmarks remain useful.
const action=(id,title,body,expected,image)=>({id,title,body,expected,image});
const traces={
 'shared-stamina':['return shot_cost','Give the arena the number of stamina points to charge at the start of each attack.'],
 'roll-stamina':['stamina_regen_per_second * delta','Multiply points per second by the elapsed seconds to find the points earned in one update.'],
 'install-arena-kit':['res://battle_lab/scenes/arena.tscn','res:// starts at the folder containing project.godot. The rest is the path to the scene.'],
 'custom-character':['parameters/blend_position','The blend position selects how much idle or walk contributes to the pose.'],
 'player-attack-animation':['attack_release_seconds','This value is measured from the start of the attack clip, in seconds.'],
 'damage-reactions':['health_changed.emit(health)','The actor sends its remaining health to the reaction controller after taking damage.'],
 'enemy-weapon-timing':['attack_contact_fraction * attack_duration','Multiply the fraction by the clip length to get the contact time in seconds.'],
 'dodge-roll':['roll_elapsed / roll_duration','Divide the elapsed seconds by the clip length. A value of 0.5 is halfway through the roll.']
};
function lesson(id,title,minutes,guide,concept,analogy,diagram,steps,question,options,answer,feedback,symptom,fix){
 return {id,title,minutes,guide,concept,analogy,diagram,steps,question,options,answer,feedback,
   walkthrough:[{line:traces[id][0],explanation:traces[id][1]}],files:id==='shared-stamina'?['stages/roll_player.gd','scripts/player.gd']:['dodge-roll','roll-stamina'].includes(id)?['stages/roll_player.gd']:[],troubleshooting:[{symptom,fix}]};
}
export const workshop={
 title:'Your Character in Combat',description:'Bring your own rig into the arena and time both sides of a fight.',
 lessons:[
 lesson('install-arena-kit','Bring the arena into your project',10,'own-project',
 'A Godot project starts in the folder containing project.godot. The kit stores its scenes and scripts together so their resource paths resolve in your project.',
 'Like linking a collection from another .blend file, you keep the arena in its own folder and instance its scene where needed.',
 ['Host project','battle_lab/scenes/arena.tscn','Run the current scene with F6'],[
 action('host','Prepare the host project','Open your project in Godot 4.4.1, or create a Compatibility project using the illustrated setup guide. Locate the folder containing project.godot.','The project opens and the FileSystem dock shows res://.','setup/create-project'),
 action('install','Install and play the kit','Download the tuned Godot kit in Relay Arena. Unzip battle_lab beside project.godot. Return to the editor, allow import to finish, open battle_lab/scenes/arena.tscn and press F6.','The scout moves with WASD in your host project.','setup/project-kit')],
 'Which folder should contain battle_lab?',['The folder containing project.godot','Inside the .godot cache','Inside the Blender installation'],0,'F6 runs the arena in the host project while preserving your chosen main scene.','The scene shows missing resources.','Check for a nested battle_lab/battle_lab folder. The scene must be at res://battle_lab/scenes/arena.tscn.'),
 lesson('custom-character','Replace the scout and connect locomotion',15,'character',
 'An imported rig supplies the visual model. The player root owns movement and collision. Idle and walk share the same skeleton, so movement input can blend between them.',
 'Think of Model as a parent Empty that turns the entire character while its armature plays actions.',
 ['Player → Model → Hero','Map idle and walk','Input drives the animation blend'],[
 action('export','Export a rig with idle and walk','Select the armature and skinned meshes. Export one glTF Binary with Animation → Actions enabled. Keep a named idle and walk action on the same rig.','The GLB contains the mesh, materials, skeleton and both clips.','character-guide/blender-export'),
 action('move','Test the replacement','In the arena open Use my Blender character. Load your GLB, pick the idle and walk clips, then start a battle. Hold D and release it. Check the facing correction if the model moves sideways.','The model walks while moving and returns to idle when input stops.','character-guide/browser-arena')],
 'Which part should you replace?',['The collision root','The visual model beneath Player','The entire arena'],1,'The controller keeps its existing collision and movement while the visual rig changes clips.','The character slides without walking.','Preview the walk action and check that idle and walk are mapped to different clips.'),
 lesson('player-attack-animation','Release a shot on the attack pose',12,'attack',
 'Separate the button press from the release. The animation clock drives one projectile when it crosses the release time.',
 'The release is the keyed pose at which a thrown object leaves the hand.',
 ['Space → wind-up','Release time → one pulse','Recovery → idle or walk'],[
 action('key','Find the release frame','Open the sample player .blend. In Action Editor select attack. Scrub from the preparation through the extended firing pose. Record the frame where the hand releases the shot.','One frame identifies the release, with recovery poses after it.','attack-guide/blender-attack'),
 action('fire','Match the projectile to the pose','Load the example player in the arena. Select the attack clip, scrub Release time and use Show release pose. Tap Space in a battle and watch the pulse leave the hand.','One attack emits one projectile and returns to locomotion.','attack-guide/browser-release')],
 'When should the projectile appear?',['Every frame of the attack','When the clip finishes','When the attack clock crosses the release time'],2,'A single release check ties the projectile to the keyed pose and allows recovery to finish.','Holding Space produces a shot before the pose.','Check the selected clip and its release time, then export a fresh kit.'),
 lesson('damage-reactions','Connect flinch and fall on both rigs',12,'reactions',
 'A health change chooses a reaction. Surviving actors flinch and recover. Zero HP selects a one-shot fall whose last pose is held.',
 'The final pose of a death action works like an extended hold on a Blender timeline.',
 ['Damage → remaining HP','Above zero → hit','Zero → death → hold'],[
 action('map','Map both reaction sets','Export hit and death actions for each rig. Load the player and enemy GLBs in their respective arena panels and select each actor’s hit and death clips.','Each actor has its own two reaction selections.','reactions-guide/blender-death'),
 action('damage','Compare surviving and lethal hits','Open Practice hit & fall. Hit enemy once, then two more times. Reset practice and repeat for the player.','The first hit recovers. The third hit holds the fallen pose at 0 HP.','reactions-guide/browser-practice')],
 'At 0 HP which action should own the final pose?',['Walk','Death','Hit'],1,'Holding the final death pose prevents an immediate return to idle.','Both actors pop upright.','Check that death has a grounded final key and that locomotion stays paused after the round ends.'),
 lesson('enemy-weapon-timing','Make the sentinel strike and miss',15,'enemy-attack',
 'The sentinel chases, locks its direction, and checks the weapon against the scout once at the contact pose. A player who leaves that line before contact takes no damage.',
 'Place a contact marker where the blade reaches a practice target. The game checks the player at that same pose.',
 ['Pursuit → locked swing','Contact pose → blade test','Recovery → pursuit'],[
 action('contact','Choose the blade contact pose','Open the Sentinel example. Scrub the attack to frame 13. Export the rig, mesh and blade together. Select the enemy attack in the arena and set contact to 50% for this one-second clip.','Show contact pose displays the extended blade.','enemy-attack-guide/blender-contact'),
 action('sidestep','Compare a hit and a sidestep','Click Practice a swing. Stand still once. Start again and hold A or D when the amber line appears.','The stationary scout loses 1 HP. The sidestep reports Miss and preserves HP.','enemy-attack-guide/browser-dodge')],
 'Which event should test the blade against the scout?',['Entering pursuit range','Every recovery frame','The contact pose'],2,'After contact the enemy must finish recovery before another swing can deal damage.','Damage happens on the wrong pose.','Scrub the clip and divide elapsed frames before contact by its full frame span.'),
 lesson('dodge-roll','Roll through a weapon strike',16,'roll',
 'A roll moves the player in one locked direction. Its animation clock opens a short protected interval. If the blade overlaps the player during that interval, the player keeps their HP.',
 'Use two timeline markers like an exposure sheet. One marks the first protected pose, the other marks the first vulnerable pose after it.',
 ['Shift → lock movement direction','Start ≤ roll time < end','Protected contact → keep HP'],[
 action('animate','Export a forward roll','Open the Beacon Pilot Blender example. Choose roll in the Action Editor. Follow the illustrated guide to check the tuck and recovery and export the action with the rig.','The in-place clip turns through one forward roll over frames 1–19.','roll-guide/blender-roll'),
 action('window','Set the protected frames','Load the example player and select the roll clip. In Roll through the blade choose frame 5 for the start and frame 13 for the end. Download the kit and inspect Roll Safe Start and Roll Safe End on Player.','Frame 5 is protected. Frame 13 is vulnerable again.','roll-guide/godot-window'),
 action('evade','Roll into contact','Click Practice a timed roll. Face the approaching sentinel. Tap Shift roughly halfway through its wind-up. Repeat once standing still.','Evaded means contact during protection with unchanged HP. A stationary hit removes 1 HP.','roll-guide/browser-roll')],
 'With protection starting at frame 5 and ending before frame 13, which frame allows damage?',['Frame 5','Frame 9','Frame 13'],2,'The start is included. Protection ends as soon as the clock reaches the end marker.','I see Miss instead of Evaded.','Miss means the blade cleared your body. Face the enemy and roll toward it a little later to overlap the blade during its contact pose.'),
 lesson('roll-stamina','Balance your dodge stamina',14,'stamina',
 'A successful roll spends stamina once. While the scout is rolling and for one second after it lands, recovery waits. After that the bar fills at the rate your code returns. A roll needs enough points before it can move or protect the scout.',
 'Picture a Blender driver controlling a 0–100 gauge. One keyed event drops the value. A hold follows the tumble, then a ramp brings the value back to full. Your recovery rate sets the slope of that ramp.',
 ['Shift → check available points','Enough → spend and roll','After landing → rest → refill'],[
 action('deplete','Try an unaffordable roll','In Tune this round keep cost at 40 and recovery at 20. Click Apply & test stamina. Tap Shift twice, letting each roll finish. Tap again immediately after the second landing.','The bar reads 20 / 100. The third request is blocked, and the scout gains no protection.','stamina-guide/browser-block'),
 action('rebalance','Run a different stamina budget','Set Roll cost code to return 60. Set Stamina recovery code to return 20 * 2. Click Apply & test stamina. Roll once and try again as soon as you land. Wait until the gauge reaches 60, then retry.','One roll leaves 40. After one second of rest, half a second of recovery earns the missing 20 points.'),
 action('install','Install your tuned scout','Download the tuned Godot kit. Extract battle_lab beside project.godot. Open its player.tscn, select Player and compare Roll Stamina Cost and Stamina Regen Per Second with your code results.','The Player Inspector shows 60 and 40 for this experiment.','stamina-guide/godot-inspector'),
 action('play','Check the gauge in Godot','Open battle_lab/scenes/arena.tscn, press F6, and test two quick rolls while moving away from the sentinel. Wait for enough points and press Shift again.','The HUD shows spending and recovery, and another roll becomes possible at the cost threshold.','stamina-guide/godot-play')],
 'A roll costs 60. You have 40 points and regain 40 per second. How long after landing can you roll again?',['0.5 seconds','1.5 seconds','3 seconds'],1,'Wait one second, then earn the missing 20 points in half a second.','I keep seeing a block even after waiting.','Check the recovery code returns a positive number. Apply it to a fresh round and let the last roll finish before timing the delay.'),
 lesson('shared-stamina','Save enough stamina to roll',12,'shared-budget',
 'The scout has one balance for attacks and rolls. Starting an attack spends its cost once. After the action, recovery waits one second. If the next action costs more than the remaining balance, the scout cannot start it.',
 'Think of two Blender controls driven by one custom property. Firing and rolling read the same stamina value, so changing it with one action changes what the other can do.',
 ['Space → pay attack cost','Balance after firing → compare with roll cost','Shift → roll or show the shortfall'],[
 action('price','Read and edit the cost','Choose Edit attack cost code. Change 15.0 to 20.0, keep roll cost at 40 and set recovery to return 0. Read the two lines under the editor and choose Apply & test stamina.','Every attack spends 20. The stationary target lets you keep firing without ending the round.'),
 action('reserve','Find the last affordable shot','Fire three shots. Release Space, finish the attack and tap Shift. Reset the drill and repeat with four shots before tapping Shift.','Three shots leave exactly 40 for a roll. Four leave 20 and the HUD reports Roll blocked.','shared-stamina/browser-reserve'),
 action('install','Use this budget in your own project','Download the tuned kit and extract battle_lab beside project.godot. Select Player in player.tscn. Compare Attack Stamina Cost, Roll Stamina Cost and Stamina Regen Per Second with the three values you ran.','Both costs are on the same player and use one stamina gauge.','shared-stamina/godot-inspector'),
 action('fight','Check it in Godot','Open arena.tscn and press F6. Aim away from the enemy and repeat the three-shot and four-shot experiments in fresh rounds. Restore recovery to 20 after the test.','A blocked request spends nothing and the scout can act again once it can pay the cost.','shared-stamina/godot-play')],
 'At 100 stamina, with recovery off, a shot costs 20 and a roll costs 40. How many shots can you take and still roll immediately after the attack?',['Two','Three','Four'],1,'Three shots spend 60. The remaining 40 exactly covers the roll.','I fired the right number of shots but the roll did not start.','Release Space and wait for attack recovery before pressing Shift. Check that the displayed balance covers the roll cost.')
 ]};
