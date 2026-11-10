function checkpoint(id, title, image, caption, host, guest, expected) {
  const directions = [`Host (P1) · ${host}`, `Guest (P2) · ${guest}`];
  return {id, title, image, caption, host, guest, directions, body:directions.join('\n'), expected};
}

export const pairChecklistReading = {
  file:'res://scripts/network_series.gd',
  lines:[
    {code:'votes[slot] = true',meaning:'Record the press from P1 or P2 for the current step.'},
    {code:'if not votes[0] or not votes[1]:',meaning:'If either player still needs to confirm, show the current checkmarks and wait.'},
    {code:'wins[winner] += 1',meaning:'When the round ends, the host awards its winner one round win.'},
    {code:'wins.assign([0, 0])',meaning:'Both Rematch votes start a new match. The host clears both win counts and shares the new ready check.'}
  ]
};

export const pairChecklistLesson = {
  id:'duel-pair-checklist', title:'Two-computer duel checklist', minutes:15,
  concept:'Work down this list together in the Godot game. One friend hosts as P1 and the other joins as P2. Read the health and round scores aloud after each shot. After comparing results aloud, tick Host confirmed and Guest confirmed in your own checklist. If a physical pad check is pending, leave its box empty and choose the next step above.',
  analogy:'HP counts how many hits a pilot can take this round. Wins counts how many rounds that player has won in this match.',
  diagram:['Both accept and load → countdown','Compare a miss and two hits → finish two rounds','Both rematch → verify the fresh arena'],
  steps:[
    checkpoint('connect','Open the same duel and connect','duel-guide/internet-address','Guest address field in the running Godot game. Replace the pictured example with the host’s IP.',
      'Both friends download and extract the same Godot project. In Godot 4.4.1 click Import, select project.godot, open scenes/duel.tscn and press F6. In Network PvP click Host a match. Read “Hosting on UDP 7000. Waiting for one guest.” On the same LAN, give your friend your LAN IP. From different homes, share your host PC’s numeric VPN IP, or the public IPv4 with UDP 7000 forwarded to your PC as in the internet-duel lesson.',
      'Open the same scene with F6 on your own computer. Choose Network PvP, replace 127.0.0.1 with the host’s reachable numeric IP, then click Join host. For the VPN route, keep both computers connected to the shared VPN. Have the next checkpoint open before joining.',
      'Both see Ready check. The role labels identify Host (P1) and Guest (P2).'),
    checkpoint('ready','Hold the ready gate open for one player','duel-guide/series-ready','Ready check on the host and guest. Compare the P1 and P2 marks under the timer.',
      'Click Ready first. Read the P1 checkmark and P2 waiting mark on your own screen.',
      'Keep Ready untouched long enough to see the same two marks. Then click Ready before the 15-second timer expires. If it expires, both choose Try again.',
      'One vote keeps both screens at Ready check. The second vote takes both to Loading arena.'),
    checkpoint('load','Wait for the slower loader','duel-guide/series-loading','Each copy loads its own arena. The Enter arena button becomes available locally.',
      'Wait for your progress bar to fill, then click Enter arena. Ask the guest to leave their button untouched for a moment.',
      'Wait for your own Enter arena button to become available. Check that the loading screen stays open after the host confirms, then click Enter arena.',
      'The countdown starts after both local loads finish and both players confirm entry.'),
    checkpoint('countdown','Watch the first countdown','duel-checklist/countdown','The host and guest see the Round 1 countdown before controls become active.',
      'Watch Round 1 and Starts in 3. Briefly press and release Space during the countdown. Release it before live play.',
      'Watch the countdown, keep your controls idle and read the first live HUD alongside the host.',
      'At the start of live play both pilots have 3 / 3 HP. Both HUDs show Round 1 and Wins 0 – 0.'),
    checkpoint('pads','Prepare local hit vibration','rumble-preview/trial','The Vibration settings form can send a local test pulse or report that a controller is missing.',
      'During a quiet moment open Vibration settings. With one vibration-capable pad connected, turn on Vibrate on hit, set Strength to 0.55 and Duration to 0.18 s, click Test vibration and choose Save. Tell P2 whether you felt the test.',
      'Repeat on your computer. With a keyboard only, close the settings and use WASD and Space for the remaining checks. If either player has no working pad, leave that person’s physical vibration result pending and continue comparing both screens.',
      'Each player using a working vibration-capable pad feels their own test. A missing pad gives a connection message when Test vibration is pressed. The two screens can still verify damage and effects.'),
    checkpoint('miss','Fire away from the other pilot','duel-guide/network-pair','Use the two live HUDs to compare health. HP stays at 3 / 3 on both pilots during the miss check.',
      'At spawn P1 faces right toward P2. Tap A to turn left and release it. Tap Space once to shoot away from P2. After the pulse leaves, tap D briefly to face P2 again. Stay on this horizontal lane.',
      'Stand still. Watch the shot leave P1 and compare both health numbers. Check for sparks, the flash and any hit vibration.',
      'A pulse travels away. Both pilots stay at full HP, neither pilot flashes and neither equipped pad vibrates.'),
    checkpoint('host-hit','P1 hits P2 once','duel-checklist/p1-hits-p2','P1 fired at P2. Both HUDs show P1 at 3 / 3 and P2 at 2 / 3.',
      'Face P2 and tap Space or gamepad X once, then release. Watch for one burst and flash on P2. Your own equipped pad should stay quiet.',
      'Stay still. Look for the same burst and flash on your pilot and feel for one short pulse in your enabled pad. Read your P2 HP back to P1.',
      'Both HUDs read P1 3 / 3, P2 2 / 3. Only P2’s enabled pad pulses. Wait a second and check that the effect stays finished.'),
    checkpoint('guest-hit','P2 hits P1 once','duel-hit/paired','This separate capture starts from full HP. It shows the guest hitting blue P1. In your continuous run P2 has already lost one HP.',
      'Keep P1 still, watch for one burst and flash on P1 and feel for one short pulse in your enabled pad.',
      'From your starting position facing left, tap Space or X once and release. Watch P1 and check that your own equipped pad stays quiet. Read both HP values back to P1.',
      'In this run both HUDs now read P1 2 / 3, P2 2 / 3 and Wins 0 – 0. Only P1’s enabled pad pulses.'),
    checkpoint('round','Award the first round','duel-checklist/round','Round 1 ends in a P1 win. Both screens show the same round score and Next round button.',
      'Stay aimed at P2 and land two more separate shots, waiting for the first hit before firing again. Read the winner and round score. Click Next round first.',
      'Stand still and stop firing. Compare the winner and score. Wait for P1’s checkmark on the result screen, then click Next round.',
      'Both see Round 1 · P1 wins and round wins P1 1 – 0 P2. Round 2 begins after both votes and a new countdown, with full HP and Wins 1 – 0.'),
    checkpoint('match','Finish the match and compare results','duel-checklist/match-winner','The match result names the winner and lists round wins. A fresh match needs two Rematch votes.',
      'From spawn, fire three separate hits at P2 in round 2. On the final screen read the winner and wins to P2. Click Rematch first.',
      'Keep P2 still. Optionally mute only your own hit vibration before this round’s first shot using Vibration settings → turn off Vibrate on hit → Save. Damage and the flash should still appear on both screens. Check the final score and P1’s Rematch checkmark, then click Rematch.',
      'With the default first-to-two rules, both see Match winner · P1 and round wins P1 2 – 0 P2. The second Rematch vote returns both to Ready check.'),
    checkpoint('reset','Check the new match before firing','duel-checklist/rematch-reset','First live round after a rematch. Both pilots have full health and the match score is zero.',
      'Click Ready, wait for loading, click Enter arena and let the countdown finish. Keep P1 idle. Read the round, wins and both HP values to P2.',
      'Complete Ready and Enter arena on your own screen. Compare both HUDs and look for any old hit flash or vibration. If you muted your pad, restore your preference in Vibration settings. Both press F8 in the editor when done.',
      'Both games show Round 1, Wins 0 – 0 and two pilots at 3 / 3 HP. No old hit replays.')
  ],
  files:['scenes/duel.tscn','scripts/network_series.gd','scripts/duel_network.gd','scripts/duel.gd','scripts/hit_rumble.gd'],
  question:'Both games show the hit on P2. Which physical controller should pulse if both players enabled vibration and have a working pad?',
  options:['Both controllers','Only the guest’s controller','Only the host’s controller'],
  answer:1,feedback:'The guest owns P2. Each computer receives the target slot, and the matching player’s local controller receives the hit pulse.',
  troubleshooting:[
    {symptom:'The guest never reaches Ready check.',fix:'Read the host status first. When the host is waiting on UDP 7000, recheck the numeric address and the LAN, shared VPN or forwarded route from the preceding internet-duel lesson.'},
    {symptom:'A shot changed the wrong number of HP.',fix:'Holding fire repeats shots. Tap and release, wait for the impact, then read both HUDs. Start a fresh match to repeat the score sequence.'},
    {symptom:'The hit is visible but I feel no vibration.',fix:'Open Vibration settings, raise Strength above zero and use Test vibration on that computer. Check Vibrate on hit and choose Save. A sent test message only confirms the software request. Leave the physical check pending until someone feels the motor on a supported pad.'}
  ],
  walkthrough:pairChecklistReading.lines.map(({code,meaning})=>({line:code,explanation:meaning}))
};
