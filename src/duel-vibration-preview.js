const step=(id,title,image,caption,directions,expected)=>({id,title,image:'rumble-preview/'+image,caption,directions,body:directions.join('\n'),expected});
export const previewReading={file:'res://scripts/rumble_settings.gd',lines:[
  {code:'%Test.pressed.connect(_test_vibration)',meaning:'Find the scene-unique button named Test and call _test_vibration each time it is pressed.'},
  {code:'if not receiver.preview_local(strength_slider.value, duration_slider.value):',meaning:'Read both sliders directly so the controller can try a change before Save. A missing local controller returns false.'},
  {code:'strength_slider.value = receiver.default_strength',meaning:'Put the scene’s original strength back into the control. This edit becomes a preference only when the player clicks Save.'}
]};
export const previewLesson={
  id:'duel-vibration-preview',title:'Test vibration and restore defaults',minutes:12,
  concept:'Use Test vibration to feel one pulse while the settings window stays open. Restore defaults puts the project’s starting values back on the form. Save commits the values currently shown.',
  analogy:'Previewing an animation before saving the file lets you try several timings. The controller test lets you compare timings by touch.',
  diagram:['Test vibration → one local pulse','Restore defaults → refill the form','Save → keep the draft · Cancel → discard it'],
  steps:[
    step('buttons','Add two buttons to the settings form','buttons','Godot Scene dock · Select PreviewActions to add its two Button children and mark each name as unique.',[
      'Extract the updated reference ZIP and import project.godot. In FileSystem open scenes/rumble_settings.tscn. Expand Panel → Form → PreviewActions. The finished example contains Test and Defaults in this HBoxContainer.',
      'To build them yourself, work in a second extracted copy. Remove the PreviewActions row there. Select Form, click Add Child Node (+), create an HBoxContainer and rename it PreviewActions. Drag it directly above Notice.',
      'Select PreviewActions, click + and create a Button. Rename it Test and set Inspector → Text to Test vibration. Add another Button named Defaults with Text set to Restore defaults. Right-click each Button → Access as Unique Name. Save the scene.'
    ],'The two buttons sit side by side. Both node names show a % marker, so the script can refer to %Test and %Defaults.'),
    step('pressed','Connect each pressed signal once','connections','Godot Script editor · In _ready(), each pressed signal connects to its own handler.',[
      'Click the script icon on the RumbleSettings root to open scripts/rumble_settings.gd. In _ready() find %Test.pressed.connect(_test_vibration) and %Defaults.pressed.connect(_restore_defaults). If you are upgrading the previous lesson, add both lines under the Save connection and copy the two handler functions from Source files.',
      'Follow _test_vibration() into scripts/hit_rumble.gd. preview_local() gets the first connected pad on this computer, then passes the current strength to both motors and the current duration in seconds to Input.start_joy_vibration(). Copy _local_pad() and preview_local() if your earlier script lacks them.',
      'To check your connection, comment out the Test connection in the practice copy, save, run scenes/duel.tscn with F6 and click Test vibration. Stop with F8, restore the line, save and repeat. Even without a pad the restored handler gives you a connection message.'
    ],'Test vibration gives feedback immediately. The host and guest exchange no network message for this button.'),
    step('defaults','Restore the project’s starting values','defaults','Godot Script editor · _restore_defaults changes the switch and sliders. _save writes the preferences.',[
      'In scripts/hit_rumble.gd find the @onready lines for default_strength and default_duration. They capture the scene’s Inspector values before _ready() loads the saved preferences. Add them to your earlier script if needed.',
      'Return to scripts/rumble_settings.gd. Find _restore_defaults(). It switches Vibrate on hit on, then assigns the two captured values to the sliders. Keep save_preferences() in _save(), so the player can still cancel a reset.',
      'Run duel.tscn. Open Vibration settings, turn Vibrate on hit off, move both sliders and click Restore defaults. In the standard project expect On, 0.55 and 0.18 s. A project downloaded with tuned defaults uses its own starting values.'
    ],'The form shows the project defaults. The earlier saved values are still available by choosing Cancel and reopening the window.'),
    step('try','Compare pulses and check your friend’s pad','trial','Running Godot duel · The draft is 0.75 / 0.30 s. With no pad connected, Test vibration shows the connection prompt. Restore defaults returns the standard sliders to 0.55 / 0.18 s.',[
      'Connect one vibration-capable pad per computer. Start the network duel from Module 7. Stay at spawn and leave both pilots idle so hit feedback does not overlap the test.',
      'On P1 open Vibration settings. Try Strength 0.25 and Duration 0.10 s, click Test vibration, then try 0.85 and 0.35 s. Only P1 should feel each pulse. The test also works with Vibrate on hit switched off: that switch controls combat hits. Trade roles and repeat on P2.',
      'Click Cancel, reopen and check the previously saved values. Then choose Restore defaults → Save, stop with F8, relaunch with F6 and verify the defaults persisted on this computer. Your friend can reopen their settings to confirm their values stayed the same.'
    ],'Each player can audition their own pad before saving. Testing leaves the match score, the saved settings and the other computer’s pad untouched.')
  ],
  files:['scenes/rumble_settings.tscn','scripts/rumble_settings.gd','scripts/hit_rumble.gd','scripts/duel.gd','scenes/duel.tscn'],
  question:'You click Restore defaults, Test vibration and then Cancel. Which settings will the window show when you reopen it?',options:['The values you last saved','The project defaults','The other player’s values'],answer:0,feedback:'Cancel discards the draft. Testing a pulse and filling the form with defaults do not write the local file.',
  troubleshooting:[{symptom:'I see a test message but feel no pulse.',fix:'Raise Strength above zero and use a rumble-capable pad. With several devices connected, the network duel and test use the first local pad. Try the controller diagnostic and disconnect spare devices.'},{symptom:'Godot reports that %Test or %Defaults is missing.',fix:'Open rumble_settings.tscn. Check the node names and use Access as Unique Name on each button. Text in the Inspector is its visible label.'}],
  references:[{label:'Godot 4.4 · Controller vibration',url:'https://docs.godotengine.org/en/4.4/classes/class_input.html#class-input-method-start-joy-vibration'}]
};
