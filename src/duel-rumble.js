const step=(id,title,image,caption,directions,expected)=>({id,title,image,caption,directions,body:directions.join('\n'),expected});

export const rumbleReading={file:'res://scripts/hit_rumble.gd',lines:[
  {code:'var own_slot := 1 if mode == "client" else 0',meaning:'The host controls P1 (slot 0). The guest controls P2 (slot 1). Each computer works this out locally.'},
  {code:'if mode in ["host", "client", "bot"] and target == own_slot:',meaning:'Only the computer controlling the pilot who lost health continues to its gamepad.'},
  {code:'Input.start_joy_vibration(device, strength, strength, duration)',meaning:'Send a pulse to this local device ID. The two strength arguments drive its weak and strong motors. Duration is measured in seconds.'}
]};

export const rumbleLesson={
  id:'duel-hit-rumble',title:'Vibrate the hit player’s gamepad',minutes:15,
  concept:'Both players see the sparks. Only the player who took damage should feel the impact. Use the target already confirmed by the host, then choose a controller from the devices attached to this computer.',
  analogy:'The hit flash works like a visible animation track for the audience. The vibration is a separate cue addressed to one performer.',
  diagram:['Host confirms which pilot lost HP','Each computer checks who owns that pilot','The hit player’s local pad receives one pulse'],
  steps:[
    step('connect','Check one controller on each computer','gamepad/diagnostic','Godot input diagnostic · A connected controller adds its name, device ID and live input values.',[
      'Download the updated Godot reference project on both computers and extract it. In Godot 4.4.1 click Import, select project.godot and open the project. Connect one vibration-capable controller per computer.',
      'In FileSystem double-click scenes/gamepad_check.tscn and press F6. Move the left stick and press Xbox X. Look for those inputs beside your controller’s name on each computer. Press F8. If the list is empty, follow the Gamepad setup lesson linked above.'
    ],'Both players can identify their own pad in Godot. Device IDs belong to the computer that lists them.'),
    step('strength','Set the force on the duel scene','duel-rumble/strength','Godot Inspector · Select Duel → HitRumble and edit Strength. Both motors use this value.',[
      'In FileSystem open scenes/duel.tscn. In the Scene dock expand Duel and click HitRumble. In the right-hand Inspector find Strength and Duration.',
      'Start with Strength at 0.55. Click its number, enter 0.85, press Enter and save with Ctrl+S or ⌘S. Keep Duration at 0.18 for this comparison. A value of 0 mutes this computer’s impact vibration.'
    ],'HitRumble displays the saved strength. Switching between the pilots leaves their existing HitFX scenes intact.'),
    step('duration','Lengthen one pulse','duel-rumble/duration','Godot Inspector · Duration is in seconds. Compare 0.18 s with 0.35 s while keeping Strength fixed.',[
      'With HitRumble still selected, edit Duration from 0.18 to 0.35 and press Enter. Save duel.tscn. Keep Strength fixed while comparing the two lengths in the match.',
      'For matching settings, give your friend the saved project or enter the same values on both computers. If you have already saved a preference in Vibration settings, change it there to feel the new pulse. Your saved values take priority over the Inspector defaults.'
    ],'The Inspector shows a 0.35-second pulse. Each computer uses its own saved values when its pilot is hit.'),
    step('route','Connect vibration to confirmed damage','duel-rumble/routing','Godot Script editor · Follow the target check and the local device ID to start_joy_vibration.',[
      'Using an older copy of the previous 3D duel? Copy scripts/hit_rumble.gd from the download into its scripts folder. Open duel.tscn, select Duel, click Add Child Node (+), choose Node and rename it HitRumble. Drag hit_rumble.gd from FileSystem onto HitRumble and save. In the supplied project this node and script are already attached.',
      'Open scripts/duel.gd. Find func _play_hit(target and locate $HitRumble.play_hit(target, mode) directly below the HitFX call. This is the connection to add when upgrading your own duel copy. The reference project already includes it.',
      'Click the script icon beside HitRumble. In device_for_hit(), compare target with own_slot. A guest owns slot 1 even when their local controller is device 0. In play_hit(), find Input.start_joy_vibration and trace its last argument back to Duration.',
      'Try the connection yourself. In duel.gd comment out only the $HitRumble.play_hit line on one computer, save and run the paired test below. Restore the line and save before the final run.'
    ],'Commenting out that line silences the local impact while damage and sparks still work. Restoring it reconnects the pulse.'),
    step('pair','Trade one hit in each direction','duel-hit/paired','Godot network match · P2 has hit P1. Both screens show P1 at 2/3 HP. In this case the host should feel the pulse.',[
      'Both players open duel.tscn and press F6. Choose Network PvP. P1 clicks Host a match. P2 enters the host’s reachable IP and clicks Join host. Both choose Ready, wait for loading, click Enter arena and wait for the countdown.',
      'Stay at spawn. P1 taps X once (or Space). When P2 goes from 3 to 2 HP, both see the flash and only P2’s pad should pulse. Wait for it to stop. P2 then taps X once. Only P1’s pad should pulse as P1 drops to 2 HP.',
      'Turn away briefly and fire into empty space. Both health values should hold and both pads should stay quiet. To compare settings, stop with F8, change just one Inspector value on the receiving computer, save, rejoin and repeat the same shot. Try Strength 0 once and check that the visible hit still plays.'
    ],'Each player feels only the hits they take. A miss produces no pulse, and one hit stops vibrating after the selected duration.')
  ],
  files:['scenes/duel.tscn','scripts/duel.gd','scripts/hit_rumble.gd','scripts/gamepad.gd'],
  question:'P2 fires and the host confirms damage to P1. Which controller should receive the vibration call?',
  options:['The host’s local P1 controller','The guest’s local P2 controller','Every controller on both computers'],answer:0,feedback:'P1 took the damage and belongs to the host. Both computers still play the visible hit.',
  troubleshooting:[
    {symptom:'Inputs work, but I feel no vibration.',fix:'Test with a known rumble-capable pad and check vibration in its device settings. Try a USB data cable. Open the native Godot project, check Strength is above 0 on the receiving computer and confirm its pilot actually lost HP.'},
    {symptom:'The shooter or a spare pad vibrates.',fix:'Check the target passed from _play_hit. Use the same first local pad that moves your network pilot. Disconnect extra pads for the two-computer exercise. In same-computer Local PvP, a single pad belongs to P2.'}
  ],references:[{label:'Godot 4.4 · start_joy_vibration',url:'https://docs.godotengine.org/en/4.4/classes/class_input.html#class-input-method-start-joy-vibration'}]
};
