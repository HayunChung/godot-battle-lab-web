const step=(id,title,image,caption,directions,expected)=>({id,title,image,caption,directions,body:directions.join('\n'),expected});

export const settingsReading={file:'res://scripts/hit_rumble.gd',lines:[
  {code:'const SAVE_PATH := "user://battle_lab_vibration.cfg"',meaning:'Godot resolves user:// to the writable data directory for this game and operating-system user. Each computer has its own file.'},
  {code:'var error := config.save(SAVE_PATH)',meaning:'Write the three preferences when the player chooses Save. A successful write also updates the running hit response.'},
  {code:'if enabled and device >= 0 and strength > 0.0:',meaning:'A confirmed hit reaches the motors only if the receiving player has enabled vibration, has an assigned controller and selected a positive strength.'}
]};
export const settingsLesson={
  id:'duel-vibration-settings',title:'Save your own vibration settings',minutes:18,
  concept:'A hit belongs to the shared match. Its vibration settings belong to the person holding the controller. Each game receives the same target and uses preferences saved on its own computer.',
  analogy:'Like a Blender input preference, this setting follows the local user when the program restarts.',
  diagram:['Open the settings window → choose three values','Save → write this computer’s user:// file','Next hit or next launch → use local preferences'],
  steps:[
    step('form','Build the settings controls','rumble-settings/controls','Godot Scene dock · Open rumble_settings.tscn and expand Panel → Form to find the toggle, sliders and buttons.',[
      'Download and extract the updated reference project. In Project Manager click Import and select project.godot. In FileSystem double-click scenes/rumble_settings.tscn. Use Scene → Save Scene As to make scenes/my_rumble_settings.tscn for the exercise.',
      'Expand Panel → Form. Select Enabled (CheckButton) and inspect its Text. Select Strength and Duration (HSlider). In Inspector → Range, Strength uses Min 0, Max 1, Step 0.05. Duration uses Min 0.05, Max 1, Step 0.01. A Duration of 0.35 represents 350 milliseconds.',
      'Practice building one control in your copy. Remove Strength, select Form, click Add Child Node (+), choose HSlider and rename it Strength. Set its range as above. Drag it below StrengthLabel. Right-click it in the tree and enable Access as Unique Name so the script can find %Strength. Save.'
    ],'Form has one Enabled toggle and two adjustable sliders. Strength has a % marker beside its name.'),
    step('signals','Connect the buttons and instance the window','rumble-settings/signals','Godot Script editor · The settings script connects Open, Cancel and Save in _ready(). The sliders update their value labels.',[
      'Select the root of your settings scene and click its script icon. In scripts/rumble_settings.gd find _ready(). Trace $Open.pressed to open_settings(), %Save.pressed to _save(), and %Cancel.pressed to close_settings(). Connections are made once when the scene enters the tree.',
      'Open scenes/duel.tscn and use Scene → Save Scene As to save scenes/my_duel.tscn. Under HUD, remove the existing RumbleSettings instance in your copy. Select HUD, click Instantiate Child Scene (chain icon), choose my_rumble_settings.tscn and name the instance RumbleSettings.',
      'Select that instance. In Inspector set Receiver Path to the duel’s HitRumble node (../../HitRumble). Save. Press F6 on my_duel.tscn. Click Vibration settings, change a slider and click Cancel. Reopen it to verify that the old value returns.'
    ],'The window opens on top of the duel. Dragging the slider changes its numeric label. Cancel discards the edit.'),
    step('storage','Save and restore three local preferences','rumble-settings/storage','Godot Script editor · hit_rumble.gd stores enabled, strength and duration in a ConfigFile under user://.',[
      'Press F8. In the duel Scene dock select HitRumble and open its script. Find SAVE_PATH and save_preferences(). The Save button passes the checkbox state and the two slider values. Follow config.set_value() for all three keys, then config.save(SAVE_PATH).',
      'Find _ready() in hit_rumble.gd. It loads that file when the scene opens. On the first run the Inspector values are the defaults. Find play_hit(): the enabled check gates vibration after the local controller has been chosen.',
      'Press F6 on your duel. Open Vibration settings, enable vibration, set Strength to 0.85 and Duration to 0.35 s, then click Save. In the editor choose Project → Open User Data Folder and find battle_lab_vibration.cfg. Look for the three settings under [vibration].'
    ],'Saving creates a preference file in this computer’s game data folder. Open the window again to read the saved values.'),
    step('restart','Change settings during a duel and relaunch','rumble-settings/ingame','Running Godot game · Use Vibration settings during play, then choose Save to apply the change on this computer.',[
      'Run the duel scene, choose a bot or Local PvP, then click Vibration settings. Switch Vibrate on hit off and save. The next hit still produces sparks and changes HP. Open the window again and check that the switch is off and your chosen slider values remain.',
      'Press F8 to terminate the game process. Press F6 on the same duel scene to launch a new process, open Vibration settings, and read all three controls again. Try changing Strength and closing with Cancel to verify the saved value returns.',
      'You can reach the same Vibration settings button from the lobby’s Settings screen. Save there, then open the duel and compare the values.'
    ],'After a full restart the switch is still off, Strength is 0.85 and Duration is 0.35 s.'),
    step('pair','Give the host and guest different settings','duel-hit/paired','Two Godot peers · Both players see the same damage. The vibration settings window on each computer controls its own pad.',[
      'Use the same project on two computers, with one rumble-capable pad each. Run scenes/duel.tscn on both. Choose Network PvP; P1 hosts and P2 joins using the host’s reachable IP. Both click Ready and Enter arena.',
      'P1 opens Vibration settings, turns vibration off and saves. P2 enables vibration, sets Strength to 0.85 and Duration to 0.35 s, then saves. The match keeps running while either window is open. Each player can reopen the window to confirm their own values.',
      'At spawn have P2 shoot P1 once, then have P1 shoot P2. Both see both hits. P1 feels no pulse when hit. P2 feels their chosen pulse when hit. Reverse the switches, save and repeat. Both players stop with F8, relaunch and check that each still has their own last choice.'
    ],'Changing P1’s settings leaves P2’s three values intact. The confirmed target and score still agree on both screens.')
  ],
  files:['scenes/rumble_settings.tscn','scripts/rumble_settings.gd','scripts/hit_rumble.gd','scenes/duel.tscn','scripts/duel.gd'],
  question:'Which values should the host send when P2 takes damage?',options:['The host’s saved vibration strength and duration','The confirmed target; P2 reads their own preferences','Every player’s settings file'],answer:1,feedback:'The guest needs the hit target. It already has its local motor preferences.',
  troubleshooting:[
    {symptom:'The settings button is disabled in my copied duel.',fix:'Click HUD → RumbleSettings. Set Receiver Path to ../../HitRumble. Run the duel scene with F6. The settings scene alone has no duel receiver.'},
    {symptom:'My Inspector edit no longer changes the pulse.',fix:'Open Vibration settings in the running game, change the value and click Save. A saved local preference takes priority over the scene default.'},
    {symptom:'Two instances on one computer show the same values after a restart.',fix:'Both instances running as the same operating-system user share this project’s user:// folder. Test the host and guest on separate computers for independent preferences.'}
  ],references:[{label:'Godot 4.4 · ConfigFile',url:'https://docs.godotengine.org/en/4.4/classes/class_configfile.html'}]
};
