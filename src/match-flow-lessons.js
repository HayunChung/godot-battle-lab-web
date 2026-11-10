const files=['scenes/match_flow.tscn','scripts/match_flow.gd'];
const step=(id,title,image,caption,directions,expected)=>({id,title,image:'match-flow/'+image,caption,directions,expected,body:directions.join('\n')});
const read=(code,meaning)=>({code,meaning});
const troubleshoot=(symptom,fix)=>({symptom,fix});

export const matchReadings={
  'pvp-ready-room':[
    read('accepted.assign([false, false])','Start every ready check with two empty slots, including a rematch between the same players.'),
    read('if phase != Phase.READY or accepted[slot]:','A press belongs to one player and one phase. Returning here ignores an extra press from the same player.'),
    read('if accepted.all(func(value): return value):','Only two accepted slots let the room start loading. The anonymous function returns each slot’s boolean value.')],
  'pvp-loading':[
    read('var error := ResourceLoader.load_threaded_request(arena_path, "PackedScene")','Queue the arena resource and its dependencies. Check the immediate error before polling.'),
    read('var status := ResourceLoader.load_threaded_get_status(arena_path, progress)','Godot writes the fraction loaded into progress. The status tells you whether to wait, collect the scene, or show Retry.'),
    read('arena_scene = ResourceLoader.load_threaded_get(arena_path) as PackedScene','Collect the scene in the LOADED branch; collecting it early can block the UI.'),
    read('duel.set_physics_process(false)','Freeze the duel controller for the countdown. Live play starts when the countdown branch re-enables it.')],
  'pvp-results':[
    read('if phase != Phase.LIVE or duel.result == "":','A result counts once, after the duel controller has resolved all shots in its tick.'),
    read('wins[winner] += 1','Award a point only for unequal final HP. A draw enters the round history with both scores unchanged.'),
    read('if wins.max() >= wins_needed:','A player who reaches the target gets the match result screen. Otherwise the next round reuses the same series score.')],
};

export const matchLessons=[
  {id:'pvp-ready-room',title:'Build a two-player ready check',minutes:15,
    concept:'A local room has an opponent but still needs two decisions before play. Store consent per player, stop accepting input after the deadline, and restart with empty slots after a decline.',
    analogy:'Like two separate visibility switches in an Outliner, each ready button controls one slot. Enabling one switch twice leaves the other untouched.',
    diagram:['Room · request ready check','P1 + P2 accept → load','Decline or timeout → room'],
    steps:[
      step('room','Build the room panel','room','Godot game · The local room shows the win target and a button to request both players’ acceptance.',[
        'Download the reference project below, unzip, and import project.godot in Godot 4.4.1. Open scenes/match_flow.tscn. F6 runs the whole lifecycle. You can also open scenes/lobby.tscn and choose Local match series.',
        'Inspect Overlay → Center → Card → Column. A CanvasLayer keeps the panel over the duel. CenterContainer centers the PanelContainer; VBoxContainer stacks Title, Detail, Progress, First, Second and Back. To rebuild the screen, add those exact nodes and names, then attach scripts/match_flow.gd to the MatchFlow root. The full scene and script are in Source files.'],
        'Request ready check replaces the room with two player buttons and a deadline.'),
      step('accept','Connect both accept buttons','accept','Godot game · P1 has accepted; exactly one slot remains and the deadline is still running.',[
        'Open scripts/match_flow.gd. In _ready, follow First.pressed to _first_pressed and Second.pressed to _accept(1). First calls _accept(0) during READY. Each player controls one boolean.',
        'Inside _accept, check the phase and accepted[slot], set only that slot, disable its button, then call _begin_load only when both slots are true. Run F6. Press P1 first and leave P2 pending. Try P2 first on your next run.'],
        'One player cannot use the same button twice to start the match. Either player can accept first.'),
      step('decline','Recover from a decline or timeout','expired','Godot game · An expired check returns to the room with a reason and a fresh request button.',[
        'Stop with F8. Select MatchFlow → Inspector → Ready Seconds, enter 4 and save. Run, accept once, and let four seconds pass. In _process, follow seconds_left to the return to _room.',
        'Request again and press Decline. Request a third time. Check that neither pilot is accepted, then accept both before the timer runs out. Restore Ready Seconds to 15.'],
        'Decline and expiry each explain the return to the room. The next check begins at 0 / 2.'),
    ],question:'P1 presses Accept twice. What allows the loader to begin?',options:['Two presses have happened','Each pilot’s own slot is true','The panel is visible'],answer:1,feedback:'Counting unique player slots keeps one pilot from accepting for two.',
    troubleshooting:[troubleshoot('The second button is missing.','Run match_flow.tscn and press Request ready check. Second is shown only during READY.'),troubleshoot('An input survives the last match.','Reset accepted in _ready_check and guard _accept with the current phase.')],files},
  {id:'pvp-loading',title:'Load the arena and gate the first input',minutes:18,
    concept:'Loading measures the local machine’s work. A pre-round countdown gives both players a readable start after that work finishes. The course uses a real PackedScene load and a separate countdown clock.',
    analogy:'Loading a linked Blender collection brings its dependent assets into memory. Placing an instance creates an object you can see and manipulate.',
    diagram:['Request the arena → poll status','Loaded → Enter arena','Countdown → enable combat'],
    steps:[
      step('request','Start a background scene load','loading','Godot game · The loading panel owns a ProgressBar while the scene request is outstanding.',[
        'Open scenes/match_flow.tscn. In Overlay → Center → Card → Column click Progress. Use a ProgressBar with Min Value 0 and Max Value 100. Leave it hidden in the room.',
        'In scripts/match_flow.gd open _begin_load. Enter LOADING, clear the bar, show it, then call load_threaded_request. Keep Arena Path as a file path so the packed arena can be requested here. An immediate error takes the player to Retry.'],
        'Accept both players. The arena loads, then Arena loaded becomes visible. A cached arena can finish before you see a partial percentage.'),
      step('poll','Wire progress, failure and retry','loaded','Godot game · Enter arena appears only after the PackedScene is available.',[
        'In _poll_load read load_threaded_get_status. For IN_PROGRESS, multiply progress[0] by 100. For LOADED, collect the scene with load_threaded_get, then show Enter arena. Send a failed status to _load_error.',
        'Test the error path in your extracted copy: select MatchFlow and set Arena Path to scenes/settings.tscn with the file picker. F6, accept both and press Enter arena. The loaded scene cannot start a duel, so it shows Arena unavailable. Try Retry load, then Return to room. Stop and restore scenes/duel.tscn before continuing.'],
        'A load error leaves a usable room or retry button. Restoring the duel path lets the next attempt start.'),
      step('countdown','Hold combat until the start','countdown','Godot game · Both pilots have spawned; the overlay counts down before either can move or fire.',[
        'In _start_round instantiate the packed scene, add it to the tree, start the local round, then disable the duel root’s physics process. Its controller owns movement, projectiles and damage.',
        'Set Countdown Seconds to 5 in MatchFlow’s Inspector. Run and hold a movement key during the countdown. In _process follow COUNTDOWN to LIVE, where the panel hides and physics is enabled. Compare with 1 second, then restore 3.'],
        'Both pilots keep their starting positions and 3 HP until the countdown ends. Held movement takes effect when LIVE starts.'),
    ],question:'Which condition tells your loading screen that it can safely collect the arena?',options:['The progress bar was visible for three seconds','P1 has pressed Space','The resource status is THREAD_LOAD_LOADED'],answer:2,feedback:'The status reports when the resource can be collected. The countdown begins after the arena is ready.',
    troubleshooting:[troubleshoot('The loader seems instantaneous.','Inspect the persistent Arena loaded screen. The sample project is small and Godot may already have the resources cached.'),troubleshoot('Damage happens during the countdown.','Disable the duel root’s physics updates immediately after start_round. Enable them only in the transition to LIVE.')],files},
  {id:'pvp-results',title:'Build round and match result screens',minutes:20,
    concept:'A duel resolves its shots and publishes a round result. The series screen consumes that result once, records the final HP and round wins, and chooses Next round or a final match summary.',
    analogy:'A frame is one sample within an action. Likewise a round result is one entry within a match; starting another round keeps the previous entries.',
    diagram:['Live duel → final HP','Draw / win → round history','Win target → result → rematch or leave'],
    steps:[
      step('round','Capture the last combat tick','round','Godot game · The round panel shows each pilot’s final HP and the series score before the next round.',[
        'Open scripts/match_flow.gd → _finish_round. Wait for a nonempty duel.result during LIVE, then lock physics. Increase one win counter only when HP differs and append the result and HP to history.',
        'Run scenes/match_flow.tscn with F6. After the countdown, keep both pilots facing each other. Hold Space for P1 alone until three hits land. On the panel read Round wins and the saved HP, then choose Next round.'],
        'The score increments once while the panel remains open. Next round refreshes HP to 3 / 3 and keeps the match score.'),
      step('draw','Handle a tied round','draw','Godot game · A draw appears in the history with both HP at zero; neither player gains a round win.',[
        'Test a fresh match with both pilots at their spawn points. Hold Space and Enter before the countdown ends so they fire together. Release when the draw appears.',
        'Trace duel.gd → tick_pair: both inputs fire, all shots for that tick resolve, then the result is chosen. The series controller records a draw and offers Next round. Compare this to a clean P2 win by holding only Enter.'],
        'A simultaneous knockout is a draw. Both win counters stay unchanged, and the next decisive round can still end the match.'),
      step('match','Build the final panel and rematch path','result','Godot game · Match winner, series score, recent round history and two exit choices share the final panel.',[
        'In MatchFlow → Inspector change Wins Needed to 1. Save, run and win one round. In _finish_round find the comparison against wins_needed. Set Title and Detail from the winning slot and history, label First as Play again and Back as Leave to lobby.',
        'Choose Play again. Verify fresh consent, empty history, and a 0 – 0 series score after both accept. Finish a second match and choose Leave to lobby. Restore Wins Needed to 2 and confirm the first decisive round now shows Next round.'],
        'A rematch starts at the ready check. Leaving opens the lobby. The result card shows the latest five rounds when repeated draws extend the series.'),
    ],question:'What should survive when players choose Next round?',options:['The previous round wins and history','All old projectiles','The losing player’s zero HP'],answer:0,feedback:'The series controller owns wins and history. Each round resets the duel actors and shots.',
    troubleshooting:[troubleshoot('One victory adds many points.','Exit LIVE as soon as the round is consumed. _finish_round checks the phase before changing wins.'),troubleshoot('P2 fires but fails to produce a draw.','Use a fresh round and have both players hold fire during the countdown. Different first-shot ticks can produce a decisive victory.')],files},
];

for(const lesson of matchLessons)lesson.walkthrough=matchReadings[lesson.id].map(({code,meaning})=>({line:code,explanation:meaning}));
