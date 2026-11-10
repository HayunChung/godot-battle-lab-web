import {effectsReadings} from './effects-module.js';
import {matchReadings} from './match-flow-lessons.js';
import {duelReadings} from './duel-lessons.js';
import {gameFlowReadings} from './game-flow-lessons.js';
// Scene and import settings below can be inspected in Godot. GDScript entries are executable lines.
const line = (code, meaning) => ({ code, meaning });

export const lessonReadings = {
  ...Object.fromEntries(Object.entries(matchReadings).map(([id,lines])=>[id,{file:'res://scripts/match_flow.gd',lines}])),
  ...effectsReadings,
  ...duelReadings,
  ...gameFlowReadings,
  'editor-tour': {
    file: 'res://scenes/arena.tscn',
    lines: [
      line('[node name="Arena" type="Node3D"]', 'Godot writes this scene entry when you save. Arena is the name in the Scene dock. Node3D gives it the Position, Rotation and Scale fields you see in the Inspector.'),
      line('[node name="Floor" type="StaticBody3D" parent="."]', 'The dot names the root of this scene as the parent. Expand Arena in the reference scene to find Floor one level beneath it.')
    ]
  },
  'nodes-and-collisions': {
    file: 'res://scenes/arena.tscn',
    lines: [
      line('size = Vector3(18, 0.5, 14)', 'Both the visible box and the collision box use this Size setting. Read the numbers as width along X, height along Y and depth along Z, in meters.'),
      line('position = Vector3(0, -0.25, 0)', 'Floor is half a meter thick. Moving its center down by a quarter meter puts its top surface at Y = 0.'),
      line('shape = SubResource("TileShape")', 'The collision node uses the box named TileShape from this same scene file. Enable Debug → Visible Collision Shapes and run the arena to see where the player can stand.')
    ]
  },
  'asset-import': {
    file: 'res://assets/scout.glb.import',
    lines: [
      line('source_file="res://assets/scout.glb"', 'This saved import setting identifies the original Blender export. Replace that file and Godot can reimport the updated scout at the same path.'),
      line('nodes/root_scale=1.0', 'A scale multiplier of one preserves the imported size. Compare the scout with a one-meter reference in the viewport.'),
      line('animation/import=true', 'The checked Animation import option tells Godot to read clips from the GLB. Open Advanced Import Settings and preview idle and walk.')
    ]
  },
  variables: {
    file: 'res://practice/properties.gd',
    lines: [
      line('@export var speed: float = 4.0', 'var gives a value the name speed. float allows decimals, 4.0 is its starting value, and @export makes a Speed field appear in the Inspector.'),
      line('func _ready() -> void:', 'Godot calls _ready once when this node and its children are ready. The colon begins its indented instructions. void means the function returns no value.'),
      line('print("Scout speed: ", speed)', 'The quoted words stay the same. Godot looks up the current value of speed after the comma. Set Speed to 6.5 and run this practice scene to see Scout speed: 6.5 in Output.')
    ]
  },
  'functions-and-signals': {
    file: 'res://practice/signals.gd',
    lines: [
      line('signal fired(amount: int)', 'Declare an event named fired that carries a whole number. The name amount describes the value a listener will receive.'),
      line('fired.connect(_on_fired)', 'Register _on_fired as the listener. Leaving off the parentheses gives Godot the function to call later.'),
      line('shoot()', 'The parentheses call shoot now. In this practice scene _ready makes that call once after connecting the listener.'),
      line('fired.emit(1)', 'Send the value 1 to the connected listener. Its print instruction displays Shots fired: 1. Change the argument to 2 to see Shots fired: 2 from that single event.')
    ]
  },
  'conditions-and-loops': {
    file: 'res://practice/targets.gd',
    lines: [
      line('var health_values: Array[int] = [0, 2, 1]', 'The square brackets hold three whole-number health values, in order. Each entry represents a different practice target.'),
      line('for hp in health_values:', 'Repeat the indented instructions for each entry. On successive passes the name hp refers to 0, then 2, then 1.'),
      line('if hp > 0:', 'The greater-than sign asks whether this target has health left. Zero goes to else, so Output shows Disabled target: 0 first, followed by Active target: 2 and Active target: 1.')
    ]
  },
  'character-body': {
    file: 'res://scenes/arena.tscn',
    lines: [
      line('[node name="Player" parent="." instance=ExtResource("2")]', 'This saved scene setting places the player scene inside Arena. Expand Player in its own scene to find the moving body, capsule and visual model.'),
      line('position = Vector3(0, 16, 9)', 'Select Camera3D to see this position. The middle number puts the fixed camera 16 meters above the origin. The last moves it 9 meters toward positive Z.'),
      line('rotation_degrees = Vector3(-60.64, 0, 0)', 'The camera tilts down around its X axis to look at the arena. Since it is a child of Arena, it stays put when Player moves.')
    ]
  },
  'wasd-movement': {
    file: 'res://stages/motion.gd',
    lines: [
      line('var axes := Input.get_vector("move_left", "move_right", "move_forward", "move_back")', 'Read the four input actions as one direction. Holding D produces (1, 0). Holding W and D splits a unit of direction between two axes, keeping diagonal travel at the same speed.'),
      line('var direction := Vector3(axes.x, 0, axes.y)', 'The 2D input becomes a direction on the arena floor. Its second component goes into Z. The middle zero leaves vertical movement to gravity.'),
      line('velocity.x = direction.x * speed', 'The star means multiply. With D held and speed set to 4, the requested sideways velocity is 4 meters per second. The following line handles depth in the same way.'),
      line('move_and_slide()', 'Apply the body’s velocity for this physics tick and check surfaces along its path. A correctly aligned floor blocks downward movement.')
    ]
  },
  'animation-blend': {
    file: 'res://stages/animated_player.gd',
    lines: [
      line('super(delta)', 'Run the movement script inherited by this player first. The animation can now read the velocity from the same physics tick.'),
      line('var moving := Vector2(velocity.x, velocity.z).length() > 0.01', 'Measure horizontal speed. Above 0.01 meters per second, moving becomes true. Falling straight down leaves it false.'),
      line('$AnimationTree.set("parameters/blend_position", 1.0 if moving else 0.0)', 'The dollar sign finds the AnimationTree child. Give its blend control 1 for the walk pose or 0 for idle. Hold D, then release it to compare those endpoints.')
    ]
  },
  hitboxes: {
    file: 'res://scenes/projectile.tscn',
    lines: [
      line('[node name="Projectile" type="Area3D" groups=["projectiles"]]', 'Area3D lets the pulse detect an overlap. The group name also gives Arena a way to find active shots when the round ends.'),
      line('collision_mask = 4', 'In the Inspector this selects checkbox 3, the enemy hurtbox layer. The saved values for boxes 1, 2 and 3 are 1, 2 and 4.'),
      line('shape = SubResource("Shape")', 'The projectile collision node uses the sphere saved as Shape. Its radius of 0.18 meters defines where overlaps count.')
    ]
  },
  'health-and-pursuit': {
    file: 'res://scripts/enemy.gd',
    lines: [
      line('var offset := player.global_position - global_position', 'Subtract the enemy’s world position from the player’s to get an arrow pointing toward the player. The next line removes its height.'),
      line('var direction := offset.normalized()', 'Keep the arrow’s heading and reduce it to length one when the actors are apart. Multiplying by speed now gives predictable pursuit speed at any distance.'),
      line('health = maxi(0, health - amount)', 'Subtract incoming damage from this enemy’s HP. maxi chooses the larger result, so a 2-point hit against 1 remaining HP leaves 0.'),
      line('health_changed.emit(health)', 'Tell listeners how much HP remains. The arena updates the HUD and checks whether the enemy has fallen.')
    ]
  },
  'projectiles-and-restart': {
    file: 'res://scripts/arena.gd',
    lines: [
      line('if player.health == 0 or enemy.health == 0:', 'Two equals signs compare values. Either character reaching zero is enough to end the round.'),
      line('var result := "VICTORY" if enemy.health == 0 else "DEFEAT"', 'Pick the word for the HUD. Enemy at zero gives VICTORY. When the player reaches zero with the enemy alive, the word is DEFEAT.'),
      line('if finished and event.is_action_pressed("restart"):', 'Both conditions must hold. Pressing R during play leaves the battle alone. Pressing R on the result screen runs the next instruction.'),
      line('get_tree().reload_current_scene()', 'Load a fresh copy of the arena from disk. The characters return to their saved positions with their starting health.')
    ]
  },
  'install-arena-kit': {
    file: 'res://battle_lab/scenes/arena.tscn',
    lines: [
      line('[ext_resource type="PackedScene" path="res://battle_lab/scenes/player.tscn" id="2"]', 'This kit scene setting starts its search at the folder containing your project.godot. Extract battle_lab there so the player scene can be found.'),
      line('[node name="Player" parent="." instance=ExtResource("2")]', 'The matching 2 refers to the saved player scene above. Run the kit arena with F6 to see that player appear inside your own project.')
    ]
  },
  'custom-character': {
    file: 'res://battle_lab/scenes/player.tscn',
    lines: [
      line('[node name="Hero" parent="Model" instance=ExtResource("2")]', 'In a kit downloaded with your character, Hero places the imported rig inside Model. Player keeps its controller and collision capsule while Model turns the rig.'),
      line('root_node = NodePath("../Model/Hero")', 'From AnimationTree, two dots go up to Player. Follow Model and then Hero to reach the root used by the imported animation tracks.'),
      line('anim_player = NodePath("../Model/Hero/AnimationPlayer")', 'Look one level deeper for the imported clip library. After mapping idle and walk, moving and releasing a direction key should animate the same rig.')
    ]
  },
  'player-attack-animation': {
    file: 'res://battle_lab/scripts/player.gd',
    lines: [
      line('@export var attack_release_seconds: float = 1.0 / 3.0', 'The custom attack controller exposes a release time in seconds. At 24 frames per second, frame 9 is eight intervals after frame 1, or one third of a second.'),
      line('if not released and elapsed >= clampf(attack_release_seconds, 0.0, attack.length):', 'Wait until the animation clock reaches the release time. The check also asks whether this attack has already fired. clampf keeps the chosen time inside the clip.'),
      line('released = true', 'Remember that this attack reached release. The next line fires the pulse once, and later ticks of the same swing skip it.')
    ]
  },
  'damage-reactions': {
    file: 'res://battle_lab/scripts/reactions.gd',
    lines: [
      line('actor.connect("health_changed", _health_changed)', 'Listen for the parent character’s health updates. This lets the same reaction controller respond on the player or enemy.'),
      line('state = &"death" if value <= 0 else &"hit"', 'Choose a clip after HP drops. A remaining value of 2 selects hit. Zero selects death. The ampersand makes each clip name a Godot StringName.'),
      line('clips.seek(elapsed, true)', 'Show the imported pose at the current reaction time immediately. At the end of death the clock stops advancing and the final pose stays on screen.')
    ]
  },
  'enemy-weapon-timing': {
    file: 'res://battle_lab/scripts/enemy.gd',
    lines: [
      line('var contact_time := attack_contact_fraction * attack_duration', 'Multiply the chosen point on the clip by its length. Halfway through a one-second swing is 0.5 seconds, frame 13 in the example starting at frame 1 and running at 24 fps.'),
      line('contact_checked = true', 'Mark this swing’s contact test as used. Staying inside blade range on the following frame cannot deal another hit from this same swing.'),
      line('if _weapon_reaches_player():', 'Check the player’s position against the blade segment at the contact pose. Stepping clear during the wind-up makes this condition false.'),
      line('player.take_damage(1)', 'Request one point of damage on a connecting swing. A player inside the protected portion of a roll can ignore this request.')
    ]
  },
  'dodge-roll': {
    file: 'res://battle_lab/stages/roll_player.gd',
    lines: [
      line('var fraction := roll_elapsed / roll_duration', 'Divide time spent rolling by the whole clip length. A value of 0.5 describes the midpoint regardless of the clip’s duration.'),
      line('@export_range(0, 1, 0.001) var roll_safe_start: float = 4.0 / 18.0', 'The sample runs from frame 1 to frame 19, spanning 18 intervals. Protection starts at frame 5, four intervals from the beginning.'),
      line('@export_range(0, 1, 0.001) var roll_safe_end: float = 12.0 / 18.0', 'Frame 13 is twelve intervals from the beginning. The protection test excludes this endpoint, so contact on frame 13 can hurt even though the roll is still playing.')
    ]
  },
  'roll-stamina': {
    file: 'res://battle_lab/stages/roll_player.gd',
    lines: [
      line('const MAX_STAMINA := 100.0', 'Set the upper limit of the stamina bar. A new player starts at this value.'),
      line('if _spend_stamina(roll_stamina_cost):', 'Ask the shared pool to pay for a roll. The roll starts only if payment succeeds. With a cost of 40, the first roll changes a full bar from 100 to 60.'),
      line('stamina_wait = 1.0', 'At the end of a roll, set a one-second recovery delay. When recovery is allowed again, the default rate adds 20 points per second until the bar reaches 100.')
    ]
  },
  'shared-stamina': {
    file: 'res://battle_lab/stages/roll_player.gd',
    lines: [
      line('if _spend_stamina(attack_stamina_cost):', 'An attack asks the same pool used by rolling to pay its own price. Set attacks to 20, rolls to 40 and recovery to 0. Three paid attacks leave exactly enough for one roll.'),
      line('if stamina + 0.000001 < cost:', 'Check the balance before subtracting. The tiny allowance absorbs rounding from fractional recovery. A shortage returns false on the next line and spends nothing.'),
      line('stamina = maxf(0.0, stamina - cost)', 'Subtract the price once and keep the balance at or above zero. Paying 40 from a balance of 40 leaves an empty bar.'),
      line('stamina_changed.emit(stamina)', 'Send the new balance to the HUD. Both actions update the same bar, so the next roll immediately reflects what the last shot cost.')
    ]
  }
};
