extends Node
# A separate physics clock lets death finish after Arena freezes the actor.
@onready var actor: CharacterBody3D = get_parent()
@onready var model: Node3D = actor.get_node("Model")
@onready var tree: AnimationTree = actor.get_node_or_null("AnimationTree")
var clips: AnimationPlayer
var state: StringName = &""
var elapsed := 0.0
var duration := 0.0
var authored := false
var baseline_position: Vector3
var baseline_roll: float
var previous_health: int

func _ready() -> void:
	for child in model.find_children("*", "AnimationPlayer", true, false):
		clips = child
		break
	previous_health = actor.get("health")
	actor.connect("health_changed", _health_changed)
	if clips:
		for name in [&"idle", &"walk"]:
			if clips.has_animation(name):
				clips.get_animation(name).loop_mode = Animation.LOOP_LINEAR
		clips.callback_mode_process = AnimationMixer.ANIMATION_CALLBACK_MODE_PROCESS_MANUAL

func _health_changed(value: int) -> void:
	var dropped := value < previous_health
	previous_health = value
	if not dropped or state == &"death":
		return
	if state.is_empty():
		baseline_position = model.position
		baseline_roll = model.rotation.z
	else:
		# A second hit or a lethal interruption starts from the same visual origin.
		model.position = baseline_position
		model.rotation.z = baseline_roll
	if actor.has_method("cancel_attack"):
		actor.call("cancel_attack")
	actor.set_physics_process(false)
	actor.velocity = Vector3.ZERO
	if tree:
		tree.active = false
	state = &"death" if value <= 0 else &"hit"
	elapsed = 0.0
	authored = clips != null and clips.has_animation(state)
	duration = 0.9 if state == &"death" else 0.35
	if authored:
		var action := clips.get_animation(state)
		action.loop_mode = Animation.LOOP_NONE
		duration = maxf(0.001, action.length)
		clips.play(state)
		clips.seek(0.0, true)
	elif clips:
		clips.pause()

func _physics_process(delta: float) -> void:
	if state.is_empty():
		# An enemy imported without an AnimationTree uses its own locomotion clips.
		if not tree and clips and actor.is_physics_processing() and actor.get("attacking") != true:
			var next := &"walk" if Vector2(actor.velocity.x, actor.velocity.z).length() > 0.01 else &"idle"
			if clips.has_animation(next):
				if clips.current_animation != next:
					clips.play(next)
				clips.advance(delta)
		return
	if elapsed >= duration:
		return
	elapsed = minf(elapsed + delta, duration)
	if authored:
		# Explicit sampling keeps the last death key visible until restart.
		clips.seek(elapsed, true)
	else:
		var t := elapsed / duration
		if state == &"death":
			var fall := smoothstep(0.0, 1.0, t)
			model.rotation.z = baseline_roll - fall * PI * 0.47
			model.position.y = baseline_position.y + fall * 0.28
		else:
			var recoil := sin(t * PI)
			model.rotation.z = baseline_roll - recoil * 0.32
			model.position.y = baseline_position.y + recoil * 0.10
	if elapsed < duration or state == &"death":
		return
	state = &""
	model.position = baseline_position
	model.rotation.z = baseline_roll
	if clips:
		clips.stop()
	if tree:
		tree.active = true
	if actor.get_parent().get("finished") != true:
		actor.set_physics_process(true)
