import {duelShots} from './duel-lessons.js';
import {gameFlowShots} from './game-flow-lessons.js';
// Each caption points to a visible detail in the captured editor, game, or browser lab.
export const lessonShots = {
  ...duelShots,
  ...gameFlowShots,
  'editor-tour': {
    projects: ['setup/create-project', 'Godot Project Manager · Choose Compatibility when creating your working project.'],
    'arena-root': ['setup/editor', 'Godot editor · Find the Scene dock at the upper left. The indented rows belong to the scene root.'],
    inspector: ['setup/editor', 'Godot editor · Select a node in Scene on the left, then look across to its Inspector on the right.']
  },
  'nodes-and-collisions': {
    body: ['course-shots/floor-shape', 'Godot · Find Floor above its mesh and collision children in the Scene dock.'],
    mesh: ['course-shots/floor-shape', 'Godot · The solid platform is the mesh. Compare its edges with the outline of the selected collision box.'],
    shape: ['course-shots/floor-shape', 'Godot · Select the floor’s CollisionShape3D. Its thin box should cover the platform from edge to edge.']
  },
  'asset-import': {
    'import-glb': ['course-shots/scout-import', 'Godot · Double-click the imported scout.glb in FileSystem. Compare its upright pose and cyan material with this preview.'],
    'inspect-clips': ['course-shots/scout-import', 'Godot Advanced Import Settings · Expand AnimationPlayer, select walk and press play below the cyan scout. Compare it with idle.'],
    'blender-route': ['character-guide/blender-export', 'Blender · Look for glTF Binary and the animation export options before saving your GLB.']
  },
  variables: {
    script: ['course-shots/variables-inspector', 'Godot · Select Properties in the practice scene. Its attached script makes Speed available in the Inspector.'],
    export: ['course-shots/variables-output', 'Godot Inspector · Speed now reads 6.5 while the script still shows 4.0. The curved arrow beside Speed restores the default.'],
    output: ['course-shots/variables-output', 'Godot Output · Running Properties with F6 prints Scout speed: 6.5, matching the scene’s Inspector override.'],
    'write-line': ['course-shots/variables', 'Browser practice · Follow health from its assignment into print(). Compare the printed number with the value you typed.']
  },
  'functions-and-signals': {
    wire: ['course-shots/signals-script', 'Godot · In _ready(), read connect before shoot(). This order gives the signal a listener before it fires.'],
    trace: ['course-shots/signals-script', 'Godot · Trace fired from its declaration to emit(), then look for the function registered with connect().'],
    change: ['course-shots/signals-script', 'Godot · Change the number passed to emit(). The receiver gets that number each time the signal fires.'],
    'return-value': ['course-shots/functions-and-signals', 'Browser practice · Compare the input with the returned amount. Doubling 2 gives 4, and doubling 5 gives 10.']
  },
  'conditions-and-loops': {
    list: ['course-shots/targets-script', 'Godot · Read the three starting health values inside the square brackets from left to right.'],
    trace: ['course-shots/conditions-and-loops', 'Browser practice · Follow the output in order. A target with zero health prints Disabled. Positive health prints Active.'],
    boundary: ['course-shots/targets-script', 'Godot · Locate the greater-than sign. With [0, 0, 1], only the last target passes the test.']
  },
  'character-body': {
    player: ['course-shots/player-capsule', 'Godot · In the Scene tree, Player owns Model and CollisionShape3D. Scripts find the visual by the child name Model.'],
    capsule: ['course-shots/player-capsule', 'Godot · Inspect the capsule around the scout. Its bottom meets the character’s feet.'],
    camera: ['course-shots/arena-camera', 'Godot · Select Camera3D and inspect its projection and size. The fixed camera looks down on the floor.'],
    run: ['course-shots/arena-initial', 'Godot game · The finished reference uses this camera angle. At this stage, check the floor and player placement.']
  },
  'wasd-movement': {
    'input-map': ['setup/input-map', 'Godot Input Map · Expand an action to see its key. The action name must match the spelling in the movement script.'],
    'motion-script': ['course-shots/wasd-movement', 'Browser practice · Run a speed change and compare the distance traveled in one second. Apply the same speed in Godot.'],
    compare: ['course-shots/wasd-floor', 'Godot game · Compare the two positions after half a second of diagonal movement. X and Z both change while the scout stays on the floor.']
  },
  'animation-blend': {
    tree: ['character-guide/blend-space', 'Godot · Select AnimationTree to reveal the blend editor beneath the 3D viewport.'],
    points: ['character-guide/blend-space', 'Godot BlendSpace1D · The two points represent idle and walk. Move the blend position between their endpoints.'],
    drive: ['course-shots/wasd-floor', 'Godot game · Try the same moving and standing comparison in your scene and watch for the clip change as you release the keys.']
  },
  hitboxes: {
    layers: ['course-shots/enemy-layers', 'Godot · Find the numbered Layer and Mask boxes in the Inspector. Layer identifies an object, and Mask tells a detector where to look.'],
    'player-hurtbox': ['course-shots/enemy-layers', 'Godot · This example shows the enemy’s collision settings. For the player’s Hurtbox, select only layer 2 and clear its mask.'],
    'enemy-shell': ['course-shots/enemy-layers', 'Godot · Use the Enemy scene tree to distinguish the body shape from the Contact and Hurtbox branches.'],
    'enemy-areas': ['course-shots/enemy-layers', 'Godot · Check which Area3D is selected before editing its numbered boxes. Contact checks for layer 2, while Hurtbox belongs to layer 3.']
  },
  'health-and-pursuit': {
    health: ['course-shots/health-and-pursuit', 'Browser practice · Compare the health readout before and after a hit. Damage lowers the remaining health to a minimum of zero.'],
    pursuit: ['course-shots/arena-initial', 'Godot game · Locate the cyan player and coral enemy on opposite sides of the floor. When the round runs, watch the gap close.'],
    hud: ['course-shots/arena-initial', 'Godot game · Locate the status text over the playfield. It stays in screen space as the characters move.'],
    contact: ['enemy-attack-guide/godot-encounter', 'Godot game · Watch the attacker’s facing direction. Stand in front for one strike, then try stepping out before the next contact.']
  },
  'projectiles-and-restart': {
    impact: ['course-shots/arena-impact', 'Godot game · Look for the brief impact at the enemy and compare its remaining health with the start of the round.'],
    shot: ['course-shots/projectile-shape', 'Godot · Inspect the projectile’s sphere shape. It detects a hit while its mesh makes the shot visible.'],
    fire: ['course-shots/arena-fire', 'Godot game · Find the cyan pulse between the characters. Once fired, it travels independently of the player.'],
    'win-lose': ['course-shots/arena-victory', 'Godot game · VICTORY appears when enemy health reaches zero. Press R and check that a fresh round restores both health values.']
  }
};

// Workshop steps carry their screenshot paths in workshop.js.
export const workshopCaptions = {
  'install-arena-kit': {host:'Godot · Choose a host project and locate the folder containing project.godot.',install:'Project kit · Download the tuned kit, then place its battle_lab folder beside project.godot.'},
  'custom-character': {export:'Blender · Export the rig and its meshes together with named animation actions.',move:'Browser arena · Compare your character’s facing direction while moving and the pose it returns to when you release the key.'},
  'player-attack-animation': {key:'Blender Action Editor · Scrub the attack until the hand reaches the release pose. Record that frame.',fire:'Browser arena · Use the release preview to line up the pulse with the extended hand.'},
  'damage-reactions': {map:'Blender · The death action ends in the fallen pose. Keep hit and death as separate actions for each character.',damage:'Browser practice · Apply one hit to see the reaction. Repeated hits bring health to zero and play the fall.'},
  'enemy-weapon-timing': {contact:'Blender · At the contact pose, note the blade’s position relative to the target and the frame under the playhead.',sidestep:'Browser practice · The amber warning marks the incoming swing. Try crossing out of its path before contact.'},
  'dodge-roll': {animate:'Blender · Scrub the roll action from the first tuck to the recovery pose.',window:'Godot Inspector · Compare Roll Safe Start and Roll Safe End with the two frames chosen in the arena.',evade:'Browser practice · Start the roll during the wind-up so the safe frames overlap the blade’s contact.'},
  'roll-stamina': {deplete:'Browser arena · The gauge shows why another roll is blocked after two quick rolls.',install:'Godot Inspector · Check Roll Stamina Cost and Stamina Regen Per Second on Player.',play:'Godot game · Read the stamina value after a roll and watch it rise again after the recovery delay.'},
  'shared-stamina': {reserve:'Browser practice · Compare the stamina left after three shots and after four. A roll needs 40 points.',install:'Godot Inspector · Attack Stamina Cost and Roll Stamina Cost draw from the same player budget.',fight:'Godot game · Watch the same stamina readout while firing and then attempting to roll.'}
};
lessonShots['roll-stamina'] = {rebalance:['course-shots/roll-stamina-rebalance', 'Browser editor · A roll costs 60. Recovery of 20 × 2 restores 40 points each second once recovery begins.']};
lessonShots['shared-stamina'] = {price:['course-shots/shared-stamina-price', 'Browser editor · shot_cost holds 20.0 and return hands that cost to the arena for each attack.']};

export function stepShot(lessonId, step) {
  return lessonShots[lessonId]?.[step.id] ?? [step.image, step.caption ?? workshopCaptions[lessonId]?.[step.id]];
}
