import {section,shot} from './character-guide.js';
const image=(name,caption)=>shot(name,caption,'./assets/stamina-guide/');
export function staminaGuide(){
 return `<div class="page guide-page"><header class="page-title"><span class="kicker">RELAY ARENA → YOUR PROJECT</span><h1>Give each roll a stamina cost</h1><p>Make dodging a choice. Compare two builds of the same scout, then take the one you like into Godot.</p></header>
 <nav class="guide-tabs"><a href="#/lesson/shared-stamina">Next · share stamina with attacks →</a><a href="#/roll">Roll animation and protected frames</a></nav>
 ${section(1,'Spend the bar and try one more roll',`<p>In the lesson arena, find <b>Tune this round</b>. Leave <b>Roll cost code</b> at 40 and <b>Stamina recovery code</b> at 20. Click <b>Apply &amp; test stamina</b>. The scout starts at 100 points and the sentinel waits.</p>
 <p>Tap Shift, wait for the tumble to finish, then immediately tap Shift again. The gauge goes <b>100 → 60 → 20</b>. After the second landing, tap a third time. The scout stays in place and the HUD says <b>Roll blocked</b>. The failed attempt spends nothing. On touch screens use the Roll button.</p>
 ${image('browser-block','Arena drill · two rolls leave 20 points, so the next 40-point roll is blocked.')}
 <p>Wait one second after landing. Recovery then adds 20 points per second, even while walking. From 20 points you need another 20 to afford a roll, so you can roll again about two seconds after landing. Holding Shift only requests one roll.</p>`)}
 ${section(2,'Change the code and compare',`<p>Set the roll cost to 60 using the first function body below. Double the recovery rate using the second. Click <b>Apply &amp; test stamina</b> again. A fresh scout can now roll once. Immediately after landing a second roll is blocked at 40 points. With 40 points per second, recovering the missing 20 takes half a second after the one-second rest.</p>
 <p><b>Roll cost code</b></p><pre><code>var roll_cost: float = 60.0
return roll_cost</code></pre>
 <p><b>Stamina recovery code</b></p><pre><code>var base_rate: float = 20.0
return base_rate * 2.0</code></pre>
 <p><code>var</code> names a value and <code>return</code> hands your result to the arena. Both functions accept a result from 0 to 100. Try a recovery rate of 0 to keep the bar depleted, or a cost of 0 for free rolls. If a line fails, click the error to select that line. Choose <b>Apply &amp; fight again</b> to test your settings against the sentinel.</p>`)}
 ${section(3,'Bring your tested settings into Godot',`<p>In the same arena select <b>Download tuned Godot kit</b>. The archive includes the two values your code returned, your selected models and your roll protection settings. Extract the <code>battle_lab</code> folder beside your own <code>project.godot</code>. If you already edited an older kit, extract the new kit in a separate project first and compare the player’s roll script, the HUD/Stamina branch in arena.tscn, scripts/arena.gd and the Player overrides in player.tscn. Keep any unrelated custom animations and controller changes in your own project.</p>
 ${shot('project-kit','Godot FileSystem · the imported kit lives under res://battle_lab/.','./assets/setup/')}
 <p>Open <code>battle_lab/scenes/player.tscn</code>. Select the <b>Player</b> root in the Scene dock. In the Inspector look for <b>Roll Stamina Cost</b> and <b>Stamina Regen Per Second</b>. Compare the numbers to your last browser run. To try another balance in Godot, edit those properties and save the scene.</p>
 ${image('godot-inspector','Godot · Player shows the default cost 40 and recovery 20. Your tuned example shows 60 and 40 here.')}
 <p>The logic lives in <code>battle_lab/stages/roll_player.gd</code>. It checks the balance before starting the roll, deducts the cost once, and adds recovery rate × elapsed seconds after the rest. The time multiplier keeps the rate independent of how many updates run each second.</p>`)}
 ${section(4,'Verify a blocked roll in your project',`<p>Open <code>battle_lab/scenes/arena.tscn</code> and press <b>F6</b>. Click inside the game, move away from the sentinel, then repeat the same Shift sequence. Watch the stamina gauge while the roll finishes, while it rests and while it fills. A blocked roll gives you no protected frames.</p>
 ${image('godot-play','Godot playtest · the stamina HUD tracks the scout during the fight.')}
 <details class="trouble"><summary>Why is the bar staying still?</summary><p>The one-second delay starts when the roll ends, including an early interruption. After the delay, check that Stamina Regen Per Second is greater than zero and the round is still running. If the HUD is missing, open the arena scene from the same kit as the player.</p></details>`)}
 </div>`;
}
