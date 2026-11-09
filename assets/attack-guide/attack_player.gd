extends "res://battle_lab/stages/roll_player.gd"

const SHOT := preload("res://battle_lab/scenes/projectile.tscn")
@export var attack_release_seconds: float = 1.0 / 3.0
@onready var clips: AnimationPlayer = $Model/Hero/AnimationPlayer
@onready var locomotion: AnimationTree = $AnimationTree
var attack: Animation
var attacking := false
var elapsed := 0.0
var released := false

func _ready() -> void:
	super()
	if not clips.has_animation(&"attack"):
		push_error("The Hero needs an animation named attack to use this controller.")
		return
	attack = clips.get_animation(&"attack")
	attack.loop_mode = Animation.LOOP_NONE
	# Locomotion uses AnimationTree. Only this script advances the attack clip.
	clips.callback_mode_process = AnimationMixer.ANIMATION_CALLBACK_MODE_PROCESS_MANUAL

func _physics_process(delta: float) -> void:
	super(delta)
	if rolled_this_tick:
		return
	if attack == null:
		return
	if not attacking:
		if not Input.is_action_pressed("battle_lab_fire") and not Input.is_action_just_pressed("battle_lab_fire"):
			return
		if not pay_for_attack():
			return
		attacking = true
		released = false
		elapsed = 0.0
		locomotion.active = false
		clips.play(&"attack")
		clips.advance(0.0)

	elapsed = minf(elapsed + delta, attack.length)
	clips.advance(delta)
	if not released and elapsed >= clampf(attack_release_seconds, 0.0, attack.length):
		released = true
		_fire_pulse()
	if elapsed >= attack.length:
		attacking = false
		stamina_wait = 1.0
		clips.stop()
		locomotion.active = true

func _fire_pulse() -> void:
	var shot := SHOT.instantiate()
	get_parent().add_child(shot)
	shot.global_position = global_position + Vector3.UP * 0.65 + facing * 0.55
	shot.direction = facing

func cancel_attack() -> void:
	# The hit/death driver takes over the imported skeleton immediately.
	if attacking:
		attacking = false
		stamina_wait = 1.0
		clips.stop()
