// Paths in the lessons refer to the complete reference project. The installable kit
// places the same scenes and scripts inside battle_lab in the learner's project.
const step = (id, title, directions, expected) => ({id, title, directions, body:directions.join("\n"), expected});
const reading = (code, meaning) => ({code, meaning});

export const gameFlowReadings = {
  'game-lobby': {
    file: 'res://scripts/lobby.gd',
    lines: [
      reading('start.pressed.connect(_start_battle)', 'start refers to the button. pressed is the event the button sends. connect gives Godot the name of the function to call when that event happens.'),
      reading('func _start_battle() -> void:', 'Define the instructions that run when Start is pressed. The parentheses are empty because the button sends no extra information. void means this function returns no value.'),
      reading('get_tree().change_scene_to_file("res://scenes/arena.tscn")', 'Ask the running game to replace the lobby with the arena. The text in quotes is the saved scene’s location inside the reference project.')
    ]
  },
  'guided-tutorial': {
    file: 'res://scripts/tutorial.gd',
    lines: [
      reading('var step := 0', 'Give the tutorial a bookmark named step. Zero is the starting position, where the player learns movement.'),
      reading('if walked > 0.25:', 'Measure how far the scout has walked across the floor during ordinary movement. A quarter meter of walking completes this step. A roll counts in a later step.'),
      reading('if step == 1 and child.is_in_group("projectiles"):', 'When a child enters the training scene, check whether it belongs to the projectile group and the firing prompt is active. The tutorial waits for a pulse to actually exist, so an attack that fails to fire cannot complete this step.'),
      reading('if player.rolling:', 'Check whether the player controller has started a roll. The prompt advances once a roll is under way.'),
      reading('step += 1', 'Add one to the bookmark. Once the requested action succeeds, the tutorial can show the instruction for the following action.')
    ]
  },
  'game-settings': {
    file: 'res://scripts/settings.gd',
    lines: [
      reading('const SAVE_PATH := "user://battle_lab_settings.cfg"', 'Give the settings file a fixed name. user:// points to the current player’s writable data folder for this Godot project.'),
      reading('var config := ConfigFile.new()', 'Create a container that can read and write named preferences. The save call below writes the container to disk.'),
      reading('toggle.button_pressed = config.get_value("display", "large_hud", false)', 'Look in the display section for large_hud. Restore that choice to the checkbox. A new installation uses false, so the regular HUD size appears first.'),
      reading('config.set_value("display", "large_hud", enabled)', 'Put the checkbox state into the named setting. enabled is true when the switch is on and false when it is off.'),
      reading('var error := config.save(SAVE_PATH)', 'Write the new value to disk and keep the result in error. The notice uses that result to say whether saving succeeded.')
    ]
  }
};

export const gameFlow = {
  title: 'Lobby, Tutorial & Settings',
  description: 'Build a front door for the arena, teach the controls, and remember the player’s display preference.',
  lessons: [
    {
      id: 'game-lobby', title: 'Build a lobby for your arena', minutes: 12,
      concept: 'A lobby gives players a choice before combat begins. Each button sends a pressed signal. The connected function decides which scene opens.',
      analogy: 'Think of the lobby as a collection in the Blender Outliner. A parent holds related items together. A VBoxContainer also arranges its child controls from top to bottom.',
      diagram: ['Button · player chooses Start', 'pressed · call _start_battle', 'SceneTree · load arena.tscn'],
      steps: [
        step("layout", "Arrange the lobby buttons", [
          "For this first pass open the reference project in Godot. In FileSystem double-click scenes/lobby.tscn and choose 2D above the viewport. Expand Center → VBox in the Scene dock and select Start.",
          "In the Inspector change the button’s Text from Start battle to Launch. Save and press F6. Check the button says Launch, stop with F8, and restore Start battle.",
          "To build your own version in the reference project, choose Scene → New Scene → User Interface. Name the root Lobby. Add CenterContainer as Center, then VBoxContainer as VBox beneath it. Select Center and choose Layout → Anchors Preset → Full Rect.",
          "Under VBox add a Label and three Buttons. Give the buttons the node names Start, Tutorial and Settings and set their Text to Start battle, Tutorial and Settings. Save this scene separately as res://scenes/my_lobby.tscn."
        ], "The preview shows Launch after your text edit. Once restored, the button reads Start battle again. In a new layout the three buttons stack vertically."),
        step("connect", "Follow a click into the arena", [
          "If you built my_lobby.tscn, drag the existing scripts/lobby.gd from FileSystem onto its Lobby root. Save and press F6. The script looks for the three button names you created under Center/VBox.",
          "In the supplied lobby, open the existing script instead. Find the connection to _start_battle, then find the function of that name. Read its scene path.",
          "Double-click the lobby scene you want to test in FileSystem, press F6 and choose Start battle. Stop the game, run the lobby again, and try Tutorial and Settings."
        ], "The battle button opens the playable arena. The other buttons open the practice room and the settings screen."),
        step("install", "Make the lobby your starting scene", [
          "For your own project, download the tuned kit from Relay Arena. Extract its battle_lab folder beside your project.godot and let Godot import the files.",
          "Open battle_lab/scenes/lobby.tscn and press F6 to test it.",
          "To start there whenever you play your project, right-click this lobby.tscn in FileSystem and choose Set as Main Scene. Press F5."
        ], "F5 opens the lobby in your own project. In the supplied reference, F5 opens the arena until you change the main scene.")
      ],
      question: 'You changed a button’s visible Text. What determines which scene opens when you press it?',
      options: ['The button’s color', 'The function connected to pressed and the path it loads', 'The order of scenes in FileSystem'], answer: 1,
      feedback: 'The label tells the player what to expect. The signal connection and its handler perform the scene change.',
      troubleshooting: [{symptom:'F5 still starts directly in combat.',fix:'Open lobby.tscn and press F6 to check it on its own. Set that file as the Main Scene in FileSystem before trying F5 again.'},{symptom:'A scene path is missing in my project.',fix:'Check that there is one battle_lab folder beside project.godot. Use the scripts from the installed kit, whose paths include that folder.'}],
      files: ['scenes/lobby.tscn','scripts/lobby.gd','scenes/menu_art.tscn']
    },
    {
      id: 'guided-tutorial', title: 'Teach the controls one action at a time', minutes: 12,
      concept: 'A tutorial remembers which action it is waiting for. It checks whether the scout walked far enough, released a shot, or started rolling, then advances the counter and updates the prompt. A safe practice room lets players repeat a key without losing a fight.',
      analogy: 'Imagine reviewing three poses on a Blender timeline. The playhead tells you which pose to inspect. Here the step number tells the game which input to check.',
      diagram: ['Move · WASD', 'Attack · Space', 'Roll · Shift', 'Finish · enter battle'],
      steps: [
        step("prompt", "Find the first instruction", [
          "Open scenes/tutorial.tscn in the reference project, or battle_lab/scenes/tutorial.tscn in your installed kit. Inspect its Player, Floor and Camera3D. This room reuses the arena layout and leaves out the enemy.",
          "Under the HUD CanvasLayer, Prompt is a Label, and the Actions row holds Back and Start buttons. To make this overlay yourself, add CanvasLayer as HUD, a Label named Prompt, and an HBoxContainer named Actions. Add two Button children named Back and Start to Actions. Enable Disabled on Start in the Inspector.",
          "Run the current scene with F6. Read the first prompt before pressing anything.",
          "Try Space first, let the pulse leave the room, then hold D to walk more than a quarter meter."
        ], "Pressing Space early leaves movement as the current instruction. A movement input advances the prompt to attacking."),
        step("advance", "Trace the step counter", [
          "Select the Training root and open its scripts/tutorial.gd script.",
          "If building your own copy, attach that script to the root and match the Player, HUD/Prompt and HUD/Actions child paths shown in the source scene. Start at step zero and read the measurement for each stage.",
          "In the game, finish movement, press Space and read the next prompt. Press Shift to roll.",
          "In the browser preview, try the same sequence with the on-screen controls."
        ], "Each correct action unlocks the following instruction. The battle option becomes available after the roll."),
        step("finish", "Connect practice to a real round", [
          "Enter battle from the completed tutorial. Move with WASD and fire with Space in the arena.",
          "Stop with F8, open the lobby, press F6 and select Tutorial again.",
          "In your own project keep the matching tutorial script and scene together inside the kit."
        ], "You can start a playable round after training. Entering the tutorial again begins with movement.")
      ],
      question: 'The prompt asks for movement, but the player presses the attack key. What should the tutorial do?',
      options: ['Unlock battle immediately', 'Advance to rolling', 'Keep the movement prompt until the matching action occurs'], answer: 2,
      feedback: 'Checking the result of the action for the current step keeps the prompts and the player’s practice in the same order.',
      troubleshooting: [{symptom:'The first prompt never changes.',fix:'Click inside the running Godot game window and try W, A, S or D. In the reference project, check that the move actions are present in Project Settings → Input Map.'},{symptom:'I ran the tutorial again and saw the first instruction.',fix:'The step counter starts fresh when the tutorial scene opens. Finish all three inputs in a single visit to unlock battle.'}],
      files: ['scenes/tutorial.tscn','scripts/tutorial.gd','scenes/menu_art.tscn']
    },
    {
      id: 'game-settings', title: 'Save a readable HUD size', minutes: 10,
      concept: 'The HUD is the text and indicators drawn over a game, including health. A settings screen can change its size. Save the choice to a file so the arena can read it in the next scene and after a fresh launch.',
      analogy: 'Blender can remember a display preference between sessions. The Large HUD choice works the same way: the checkbox edits a value, and the game reads that value when it draws the interface.',
      diagram: ['Large HUD · on or off', 'ConfigFile · save the choice', 'Arena HUD · read it on entry'],
      steps: [
        step("toggle", "Compare both text sizes", [
          "Run scenes/lobby.tscn with F6. Open Settings and try both positions of Large HUD text.",
          "Examine scenes/settings.tscn in the editor. To build this control, add a CheckButton named LargeHUD and a Label named Preview beneath Center/VBox. Under Settings use a CenterContainer named Center with Full Rect anchors and a VBoxContainer child named VBox.",
          "The supplied scene also has a Notice label for save feedback and a Back button.",
          "Leave the larger size enabled, return to the lobby and start the arena. Compare the health text with your earlier round."
        ], "The health display uses the larger text size. Switching the preference back restores the smaller size."),
        step("store", "Find where the choice lives", [
          "Open scripts/settings.gd. Look for ConfigFile, then find user://battle_lab_settings.cfg.",
          "Attach this script to the Settings root in your own copy. Follow toggled.connect(_save_size) from the checkbox’s value to the named setting and the save call.",
          "In Godot, choose Project → Open User Data Folder after changing the option. Open the .cfg file in a text editor and inspect the stored value."
        ], "A settings file appears in the project’s user data folder. The preference is stored as true or false."),
        step("restore", "Test a fresh launch", [
          "Stop the running game with F8. Run the lobby again, open Settings and check the saved choice before touching the checkbox.",
          "Change it back and repeat.",
          "Try the browser preview as well: change the setting, reload this lesson in the same browser and reopen Settings."
        ], "The Godot game and the browser preview each remember their own setting when storage is available.")
      ],
      question: 'Which location should hold the player’s HUD preference after the game closes?',
      options: ['A file under user://', 'A local variable inside one button callback', 'The label’s current text'], answer: 0,
      feedback: 'Godot can write the preference to user:// and read it the next time this project starts.',
      troubleshooting: [{symptom:'I cannot find the settings file in FileSystem.',fix:'The FileSystem dock shows project assets under res://. Choose Project → Open User Data Folder to inspect files under user://.'},{symptom:'My browser and Godot show different HUD sizes.',fix:'Each preview stores its own preference. Change the option inside the version you are testing, then reopen its arena.'}],
      files: ['scenes/settings.tscn','scripts/settings.gd','scripts/arena.gd','scenes/menu_art.tscn']
    }
  ]
};

for (const lesson of gameFlow.lessons) {
  lesson.walkthrough = gameFlowReadings[lesson.id].lines.map(({code, meaning}) => ({line:code, explanation:meaning}));
}

const photo = (name, caption) => ['menu-guide/' + name, caption];
export const gameFlowShots = {
  'game-lobby': {
    layout: photo('setup-lobby','Godot 2D editor · Expand Center → VBox, select Start, then find the button’s Text field in the Inspector.'),
    connect: photo('setup-lobby-code','Godot Script editor · Follow the pressed connection to the function that changes the scene.'),
    install: photo('art-lobby','Godot lobby · After choosing the kit lobby as your main scene, this is the first screen to expect from F5.')
  },
  'guided-tutorial': {
    prompt: photo('setup-tutorial','Godot editor · Expand HUD → Actions and select Start. Its Disabled setting keeps battle locked at the start of training.'),
    advance: photo('setup-tutorial-code','Godot Script editor · Locate the projectile check and the physics update that measures player movement.'),
    finish: photo('art-tutorial','Godot game · Check the prompt above the arena. Complete all three actions to enable Start battle.')
  },
  'game-settings': {
    toggle: photo('setup-settings','Godot editor · Select LargeHUD under Center/VBox. Its CheckButton Text property supplies the setting’s visible label.'),
    store: photo('setup-settings-code','Godot Script editor · Inside _save_size, follow config.set_value() to config.save() and the notice that confirms the setting was written.'),
    restore: photo('art-settings','Godot settings · Reopen this screen after a fresh launch and compare the control with your last choice.')
  }
};
