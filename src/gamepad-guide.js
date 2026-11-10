const step = (id,title,image,caption,directions,expected) => ({
  id,title,image,caption,directions,expected,body:directions.join('\n')
});

export const gamepadReading = {
  file:'res://scripts/gamepad_check.gd',
  lines:[
    {code:'var devices := Input.get_connected_joypads()',meaning:'Ask Godot for the device IDs of connected controllers. The diagnostic checks this list on every frame, so you can leave it running while you reconnect.'},
    {code:'if devices.is_empty():',meaning:'When the list has no IDs, display the connection instructions. This gives you a useful checkpoint even if you are completing the lesson with a keyboard.'},
    {code:'if Input.is_joy_button_pressed(device, index):',meaning:'Read one button on one device. The diagnostic adds its Xbox-style label to that device’s row while the button is held.'}
  ]
};

export const gamepadLesson = {
  id:'gamepad-setup',title:'Set up and test a gamepad',minutes:14,
  concept:'The same action can have several inputs. In the solo arena, pressing Space or the left face button fires a pulse. First confirm that Godot sees the device, then inspect the binding that connects the physical button to the action. If you have a keyboard only, follow the keyboard checkpoints through this lesson.',
  analogy:'Blender can run the same command from a menu or a shortcut. A Godot action likewise lets a keyboard key and a controller button ask the game to do the same thing.',
  diagram:['Connect the device → check its ID','Input Map → bind an action','Run a round → observe the result'],
  steps:[
    step('connect','Connect a controller and open the reference project','setup/project-manager','Godot Project Manager · Choose Import to open the complete reference game for this input test.',[
      'For USB, plug the controller into a data-capable cable. For Bluetooth, use a controller model that supports it. On an Xbox Wireless Controller, power it on, then hold the Pair button on its top edge until the Xbox light flashes rapidly.',
      'Windows 11: open Start → Settings → Bluetooth & devices → Add device → Bluetooth. macOS: open Apple menu → System Settings → Bluetooth, find the pad under Nearby Devices and click Connect. For another controller brand, follow its pairing instructions.',
      'Download the project ZIP from this lesson and extract it. In Godot 4.4.1 Project Manager click Import and select its project.godot. Use the finished reference project for this test. Keyboard only? Open the same project and continue to the disconnected-device check.'
    ],'Godot opens the reference game. FileSystem contains scenes/gamepad_check.tscn. A Bluetooth user also sees the controller connected in system settings.'),
    step('diagnostic','Read the device, stick and buttons','gamepad/diagnostic','Godot input diagnostic · This capture shows the waiting state. A connected pad adds a device row and live input values.',[
      'In FileSystem expand scenes and double-click gamepad_check.tscn. Press F6 to run the current scene and click inside the game window. On a laptop hold Fn with the function key if needed.',
      'Read your controller’s name and device ID. Tilt the left stick right, release it, then hold and release the left face button (Xbox X). Watch the X-axis value rise and return near zero, and watch the button label appear and disappear.',
      'Keyboard only: read “No gamepad detected,” then press and release a keyboard key. Confirm the diagnostic still reports no controller. Press F8 to stop before editing the project.'
    ],'With a pad, the displayed row changes as you move and press. With a keyboard only, you can identify the expected no-device state.'),
    step('binding','Inspect and try a second fire binding','gamepad/input-map','Godot Project Settings · Expand fire to compare its key and joypad events. Use the + on that row to add an input.',[
      'Open Project → Project Settings → Input Map and expand fire. Find the Space key and Joypad Button 2, the Xbox X position. Each event activates the same action in the solo arena.',
      'In this reference copy click + beside fire. Press a spare shoulder button, or the J key for the keyboard exercise, then click OK. Close Project Settings. In FileSystem open scenes/arena.tscn, press F6 and click the game. Try the original and the new binding separately, waiting between shots.',
      'Press F8. Reopen the fire row and remove the binding you just added. Keep both original events. If your pilot creeps when the stick is at rest, try increasing the deadzone on each of the four move_ actions slightly and test the same scene again.'
    ],'Both tested bindings can fire a pulse. After cleanup, expanding fire shows the supplied keyboard and joypad bindings.'),
    step('arena','Run a solo round and return to your work','course-shots/arena-fire','Godot game · Aim the scout and fire. A pulse in flight confirms the fire action before any resulting HP change.',[
      'Run scenes/arena.tscn with F6. Point the left stick to move and face the sentinel, then press Xbox X to fire. Tap B to roll and watch the stamina drop. When the round ends, press Y to restart. On an Xbox-style layout X is the left face button, B the right and Y the top.',
      'Keyboard path: use WASD to move and aim, Space to fire, Shift to roll and R after the round ends. Confirm the same movement, pulse, stamina change and fresh starting health. Press F8 to stop.',
      'For the next movement lesson, reopen Battle Lab Work, the project where you built Player and its movement script. Module 7 returns to this reference game to assign controllers in local and network duels.'
    ],'A new round begins with fresh HP. You know which input runs each solo action and which project to open for animation blending.')
  ],
  files:['scenes/gamepad_check.tscn','scripts/gamepad_check.gd','scripts/gamepad.gd'],
  walkthrough:gamepadReading.lines.map(({code,meaning})=>({line:code,explanation:meaning})),
  question:'Godot shows the pad’s name and the X button responds in the diagnostic. Where can you check whether that button fires in the solo arena?',
  options:['Scene → New Scene','Project Settings → Input Map → fire','The animation clip list'],answer:1,
  feedback:'The diagnostic reads raw inputs. The fire action in Input Map connects that button to the solo arena’s firing code.',
  troubleshooting:[
    {symptom:'USB powers the controller but the diagnostic stays empty.',fix:'Try a USB data cable and another port. For Bluetooth, check that this controller model supports Bluetooth, finish pairing in the operating system, and leave the diagnostic open while reconnecting.'},
    {symptom:'The diagnostic sees my pad but a face button has an unexpected label.',fix:'This lesson uses Xbox-style positions. Test the physical left, right and top buttons one at a time. Check the labels in the diagnostic and add the reported button to the solo action in Input Map if needed.'},
    {symptom:'I can move the menu highlight but cannot control the pilot.',fix:'Use the mouse or keyboard to choose a gameplay mode. Click the running game window and move the stick after the round starts. In a network match, both pilots must accept the ready check and enter the arena.'}
  ],
  references:[
    {label:'Godot 4.4 controller input and troubleshooting',url:'https://docs.godotengine.org/en/4.4/tutorials/inputs/controllers_gamepads_joysticks.html'},
    {label:'Windows device setup',url:'https://support.microsoft.com/en-us/windows/hardware/add-a-hardware-device-to-a-windows-device'},
    {label:'Compatible Xbox models for Apple devices',url:'https://support.apple.com/en-us/111101'},
    {label:'Mac controller setup',url:'https://support.apple.com/guide/games/connect-a-game-controller-devf8cec167c/mac'}
  ]
};
