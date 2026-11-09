import {section,shot} from './character-guide.js';
const image=(name,caption)=>shot(name,caption,'./assets/shared-stamina/');
export function sharedStaminaGuide(){
 return `<div class="page guide-page"><header class="page-title"><span class="kicker">RELAY ARENA → YOUR PROJECT</span><h1>Save enough stamina to roll</h1><p>Both actions draw from the same 100 points. Find the last shot you can afford before you need to dodge.</p></header>
 <nav class="guide-tabs"><a href="#/lesson/shared-stamina">Open the practice arena →</a><a href="#/stamina">Review roll recovery</a></nav>
 ${section(1,'Set the price of a shot',`<p>Open the lesson, choose <b>Edit attack cost code</b>, and set the cost to 20. Keep the roll cost at 40. For this first comparison, set recovery to 0 so you can count shots at your own pace. Click <b>Apply &amp; test stamina</b>.</p>
 <pre><code>var shot_cost: float = 20.0
return shot_cost</code></pre><ul><li><code>var</code> creates a named value. <code>shot_cost</code> is its name. <code>float</code> allows decimals. <code>= 20.0</code> puts 20 points into it.</li><li><code>return shot_cost</code> gives that number to the arena as the cost of one attack. It is charged once when the attack starts. A shot that misses still costs stamina.</li></ul>
 <p>Change 20 to 10 and you can fire twice as many shots for the same amount. In the editor, expand <b>Read this code line by line</b> to see explanations for the code you actually typed.</p>`)}
 ${section(2,'Compare three shots with four',`<p>The stationary target absorbs shots throughout the drill. Tap Space three times or hold it briefly, watching <b>Shots fired</b>. Release Space after shot three. The bar reads 40 and the HUD says <b>Roll affordable</b>. Tap Shift: that roll spends the remaining 40.</p>
 <p>Click <b>Apply &amp; test stamina</b> again. This time fire four shots, release Space and tap Shift. The bar reads 20, the roll is blocked, and you stay in place. With a custom attack clip, let the firing animation finish before tapping Shift. The attack cannot be interrupted by a roll.</p>
 ${image('browser-reserve','Arena drill · four 20-point shots leave 20. The next 40-point roll is blocked.')}
 <p>Set recovery back to 20 and run again. From 20 points, one second of rest followed by one second of recovery earns enough for a roll. Holding fire can spend newly recovered points. Release Space to save them.</p>`)}
 ${section(3,'Move the same settings into Godot',`<p>After your last edit, click <b>Download tuned Godot kit</b>. Unzip the <code>battle_lab</code> folder next to <code>project.godot</code>. Wait for the Godot FileSystem dock to finish importing. If your project already contains a customized kit, open the new kit in a separate project first and compare the files below.</p>
 ${shot('project-kit','FileSystem · the kit’s scenes live under res://battle_lab/scenes/.','./assets/setup/')}
 <p>Open <code>battle_lab/scenes/player.tscn</code> and click <b>Player</b>. In the Inspector, find <b>Attack Stamina Cost</b>, <b>Roll Stamina Cost</b> and <b>Stamina Regen Per Second</b>. Set them to 20, 40 and 0 to repeat the four-shot experiment, then save.</p>
 ${image('godot-inspector','Godot · the example shows the default attack cost of 15. Your tuned kit shows 20 on the same Player.')}
 <p>In the kit, <code>battle_lab/stages/roll_player.gd</code> owns the balance and both costs. <code>battle_lab/scripts/player.gd</code> asks it for payment when a shot starts. <code>battle_lab/scripts/arena.gd</code> updates the HUD in <code>battle_lab/scenes/arena.tscn</code>. When merging into an older kit, bring these changes across together with the Player scene settings. The tuned kit already includes the firing controller for your selected character.</p>
 <details class="line-guide"><summary>Read the payment check in roll_player.gd</summary><ol>
 <li><code>if stamina + 0.000001 &lt; cost:</code><span>Ask whether the balance is too low. The tiny extra amount accounts for rounding when decimals add up.</span></li>
 <li><code>return false</code><span>If the balance is too low, say “no” and stop here. No points move.</span></li>
 <li><code>stamina = maxf(0.0, stamina - cost)</code><span>Subtract the cost. Keep the result at zero or higher. With 100 points and a cost of 20, the balance becomes 80.</span></li>
 <li><code>stamina_spent.emit()</code><span>Tell listeners that payment succeeded so the HUD can clear its old warning.</span></li>
 <li><code>stamina_changed.emit(stamina)</code><span>Send the updated balance to the gauge.</span></li>
 <li><code>return true</code><span>Say “yes” so the controller can start the requested action.</span></li></ol></details>`)}
 ${section(4,'Check the two possible outcomes',`<p>Open the kit’s <code>arena.tscn</code> and press <b>F6</b>. Move away from the enemy and aim past it so the round stays active while you test. Fire three times, then roll. Restart with F8 followed by F6 to reset stamina to 100. Fire four times, then try rolling again. When you finish comparing, restore recovery to 20 and save.</p>
 ${image('godot-play','Godot playtest with the default costs · two rolls and one shot leave 5. Another attack needs 15.')}
 <p><b>Why did the bar drop before the projectile appeared?</b> The cost is paid as the attack begins. Its release pose determines when the projectile leaves the hand. If an enemy interrupts the wind-up, the spent points stay spent.</p>`)}
 </div>`;
}
