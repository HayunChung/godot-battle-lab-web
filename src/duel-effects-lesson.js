const step = (id, title, image, caption, directions, expected) => ({
  id, title, image:'duel-hit/'+image, caption, directions, body:directions.join('\n'), expected
});

export const duelEffectsReading = {
  file:'res://scripts/duel.gd',
  lines:[
    {code:'var target := 1 - owner_slot',meaning:'The shot carries the shooter’s slot. If P1 fires, the target slot is 1, which selects Pilot2.'},
    {code:'if nearest.distance_to(positions[target]) <= 0.55:',meaning:'The host checks the path traveled by the pulse against the opponent’s position. A miss continues along its path.'},
    {code:'_confirm_hit(target)',meaning:'After contact, the game enters this function to subtract one HP from the target. The spent pulse is removed.'},
    {code:'_play_hit(target)',meaning:'Immediately after subtracting HP, play the local effect on the pilot that took damage.'},
    {code:'network.broadcast_hit(target)',meaning:'In host mode, tell the guest which pilot to animate.'},
    {code:'pilots[target].get_node("HitFX").play_hit()',meaning:'Both games resolve the target slot to their own Pilot1 or Pilot2 and start the shared visual effect on that pilot.'}
  ]
};

export const duelEffectsLesson = {
  id:'duel-hit-effects', title:'Share a 3D hit effect across a network duel', minutes:25,
  concept:'A shot can miss. The host decides when a pulse reaches a pilot, subtracts health, and tells each game which pilot was hit. Each computer then plays its own copy of the same particle burst and keyed flash. The guest sees the effect when the message arrives.',
  analogy:'Like placing the same linked effect collection on two Blender characters, one shared scene defines the look. Each pilot has its own emitter and animation playback.',
  diagram:['Pulse crosses the opponent → host confirms','Host plays HitFX + sends the target slot','Guest receives confirmation → same pilot flashes'],
  steps:[
    step('attach','Instance the effect under each pilot','placement','Godot Scene dock · Each pilot owns one child named HitFX. Open the shared effect scene to edit both copies.',[
      'Download the Godot project from this page, extract it, then click Import in the Godot 4.4.1 Project Manager. Select project.godot. In FileSystem double-click scenes/duel.tscn. Expand Duel → Pilot1 and Pilot2 in the Scene dock. The finished sample has a HitFX child on each pilot.',
      'Practice attaching one in a copy. Choose Scene → Save Scene As and save scenes/my_duel.tscn. Select Pilot2 → HitFX, remove that instance, then select Pilot2. Click Instantiate Child Scene (chain icon) above the tree, search duel_hit.tscn and open it. Keep the child named HitFX and its local position at (0, 0, 0). Save.',
      'Press F6 on my_duel.tscn. Choose Local PvP, keep both pilots at spawn, and tap Space once. The pulse hits P2. Press F8 to stop.'
    ],'Sparks and a flash appear on P2. P1 stays at full health while P2 drops from 3 to 2.'),
    step('burst','Give the 2D sparks a 3D emitter','particles','Godot Inspector · Select Burst in duel_hit.tscn. Amount changes the number of 3D sparks and Lifetime changes how long they remain.',[
      'In FileSystem open scenes/duel_hit.tscn and select HitFX → Burst. In the earlier 2D scene the emitter drew marks on a canvas. Here Burst is a CPUParticles3D node with a mesh for each spark. Its parent places it on the pilot in world space.',
      'Under Inspector find Amount, then expand Time to find Lifetime and One Shot. Start with Amount 12, Lifetime 0.35 seconds and One Shot on. Change only Amount to 36 and save.',
      'Select the my_duel.tscn tab before F6. Run Local PvP, tap Space from spawn, and compare the denser spray on P2. To test the other instance, tap Enter to fire from P2 toward P1. Stop with F8. Restore Amount to 12 or keep your preferred count and save. Burst uses a fixed seed so both copies can reproduce the same spray.'
    ],'One shot produces one burst at the pilot that lost health. Both pilot instances use the same saved particle settings.'),
    step('flash','Key the flash mesh at the impact peak','animation','Godot Animation panel · Select the middle key on the Flash scale track. Its three components control the size of the 3D flash.',[
      'Return to scenes/duel_hit.tscn. Select AnimationPlayer. In the bottom Animation panel choose hit_flash, expand Flash and locate the scale track. Scrub to 0.00, 0.08 and 0.24 seconds. The clip changes a separate mesh at the impact point.',
      'Click the 0.08 s key. Set its Inspector Value to (1.6, 1.6, 1.6) and keep the first and last keys at (1, 1, 1). Save. Run my_duel.tscn again, fire one shot and compare the larger flash. The shot still removes one health point.',
      'Open scripts/duel_hit.gd in FileSystem. Follow play_hit() to the burst and animation restart, then find clear_hit(). It clears leftover visuals when a round resets. Save the project before sharing it with your friend.'
    ],'The flash swells briefly on contact. The pilot’s gameplay size and the 0.55 m hit distance stay the same.'),
    step('confirm','Hook playback to a confirmed hit','authority','Godot Script editor · In duel.gd the successful pulse overlap chooses the target slot. Place the effect call inside this branch.',[
      'Open scripts/duel.gd. Find tick_pair() with Find (Ctrl+F or ⌘F). Locate the nearest.distance_to check. Follow the successful branch into _confirm_hit(target), then locate hp[target] -= 1 inside that function. The guest sends its fire input to the host; the host runs this collision test.',
      'Try a reversible wiring edit in this extracted copy. Put # at the start of the _play_hit(target) call inside _confirm_hit. Leave the HP subtraction in place. Save, run Local PvP and tap Space at spawn. P2 still loses one HP and its existing ground ring can pulse, but the new sparks and flash are absent. Stop, remove the #, save and repeat.',
      'Find _confirm_hit and _play_hit in duel.gd. The local game selects the target pilot’s HitFX child and calls play_hit(). In host mode it also sends the confirmed target through Network. Keep the call in the successful hit branch once.'
    ],'Restoring that single line restores the burst and flash on a landed shot. Pressing fire by itself produces a traveling pulse.'),
    step('receive','Trace the same hit on the guest','guest','Godot Script editor · Follow the host’s reliable hit message to the receiver in duel_network.gd.',[
      'Open scripts/duel_network.gd and find broadcast_hit(). The host sends the target slot and the current phase number to its guest. Find _receive_hit() and the @rpc declaration directly above it. Authority restricts this call to the host. Reliable delivery preserves the order of the hit messages on their channel.',
      'Follow the receiver’s live-phase check. An old round’s message must not play in a new round. After the receiver emits hit_received, open duel.gd and find network.hit_received.connect(_play_hit) in _ready(). This path plays HitFX on the received target. Regular movement and HP snapshots keep updating the displayed match state.',
      'Save all scenes and scripts. Give your friend the same project folder or ZIP, including your changed duel_hit.tscn. Each computer draws the local scene it has on disk, so share new visual settings with both players before comparing.'
    ],'You can trace one target slot from host collision to guest playback. Repeated position or HP snapshots do not start the burst again.'),
    step('pair','Compare a miss, a hit and a fresh round on both computers','paired','Godot playtest · In this reverse-direction test P2 hit P1. Both windows show sparks on P1 and P1 at 2/3 HP.',[
      'Each player imports the same project, opens scenes/duel.tscn and presses F6. Choose Network PvP on both. P1 clicks Host a match. P2 enters P1’s LAN IP and clicks Join host. Across different homes, use the reachable VPN or forwarded address from the internet-duel lesson. Both click Ready, wait for the load, click Enter arena and wait for the countdown.',
      'Test a miss first. P1 briefly taps W to face away from P2, then taps Space. Both screens should show a pulse leaving, with no sparks on either pilot and both at 3 HP. Tap D briefly to face the other pilot again. If you moved too far sideways, line up the pilots along the same lane.',
      'P1 taps Space once and releases it. Both players look at P2 for one burst and one flash, followed by the same P2 health of 2. Wait a second without shooting and check that no extra burst appears. Repeat in the reverse direction with P2 firing. The screenshot shows this reverse shot from full health. On gamepad, aim with the left stick and tap X to fire.',
      'Let P1 finish P2, compare the round score and click Next round on both. Win a second round for P1, compare the same final 2–0 result, then have both choose Rematch. Accept and load again. Check both pilots at 3 HP and the score at 0–0 before the first new shot. Stop both games with F8.'
    ],'Both games identify the same damaged pilot, show the same effect on that pilot and agree on the score. A fresh round begins with no leftover burst.')
  ],
  files:['scenes/duel.tscn','scenes/duel_hit.tscn','scripts/duel_hit.gd','scripts/duel.gd','scripts/duel_network.gd'],
  question:'P2 presses fire, but the pulse goes past P1. When should the guest see HitFX on P1?',
  options:['Immediately on P2’s input','When a later HP snapshot arrives with any value','Only when the host confirms a hit on P1'],
  answer:2,feedback:'The host confirms contact and sends the target. A miss produces no hit event.',
  troubleshooting:[
    {symptom:'P2 loses HP but its new effect is missing.',fix:'Select Pilot2 in scenes/duel.tscn. Check the child is named HitFX and uses scenes/duel_hit.tscn. Restore _play_hit(target) inside _confirm_hit and check that tick_pair calls _confirm_hit on contact. Check the Debugger for a missing child or animation.'},
    {symptom:'The guest sees sparks on a miss or two bursts for one hit.',fix:'Check that the guest starts the new effect only from the confirmed-hit event. Remove extra calls added to input handling or apply_snapshot(). Keep one receiver connection in _ready().'},
    {symptom:'The sparks have different sizes or counts.',fix:'Both stop with F8 and reopen the same saved project version. Check Burst → Amount and the middle Flash scale key in both copies. Network delivery can shift the time the guest first sees the effect.'},
    {symptom:'The computers cannot join.',fix:'Start one host on UDP 7000 and enter its reachable numeric IP on the guest. For different homes, open the Module 7 internet-duel lesson and follow its connection checks.'}
  ],
  references:[
    {label:'Godot 4.4 multiplayer authority, delivery modes and channels',url:'https://docs.godotengine.org/en/4.4/tutorials/networking/high_level_multiplayer.html'},
    {label:'CPUParticles3D properties',url:'https://docs.godotengine.org/en/4.4/classes/class_cpuparticles3d.html'}
  ],
  walkthrough:duelEffectsReading.lines.map(({code,meaning})=>({line:code,explanation:meaning}))
};
