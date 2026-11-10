import {screenshot} from './screenshot.js';

export function gamepadGuide(){
  return `<div class="page guide-page">
    <header class="page-title"><h1>Play with a gamepad</h1><p>Connect an Xbox-style controller, check what Godot receives, then use it in the arena or a duel.</p><a class="primary" href="./downloads/battle-lab.zip" download>Download the Godot project ↓</a></header>
    <section class="guide-step"><div class="guide-index">1</div><div><h2>Connect one controller</h2>
    <p>Pick one connection method. For USB, plug a compatible controller into your computer with a cable that carries data. A charge-only cable can light the controller without sending inputs.</p>
    <p>For Bluetooth, use a model that supports it. On an Xbox Wireless Controller, turn it on with the Xbox button, then hold the small Pair button on its top edge until the Xbox light flashes rapidly. For another brand, use its pairing instructions.</p>
    <ul><li><b>Windows 11</b> — Open Start → Settings → Bluetooth &amp; devices. Turn Bluetooth on. Under Devices, choose Add device → Bluetooth and select your controller.</li>
    <li><b>Mac</b> — Open the Apple menu → System Settings → Bluetooth. Find the controller under Nearby Devices and click Connect.</li></ul>
    <p>For wireless play, check that the controller is connected in your computer’s Bluetooth settings. Xbox Series X|S controllers support Bluetooth. Older Xbox models vary. <a href="https://support.microsoft.com/en-us/windows/hardware/add-a-hardware-device-to-a-windows-device">Windows device setup</a> · <a href="https://support.apple.com/en-us/111101">Compatible Xbox models</a> · <a href="https://support.apple.com/guide/games/connect-a-game-controller-devf8cec167c/mac">Mac controller setup</a></p></div></section>
    <section class="guide-step"><div class="guide-index">2</div><div><h2>Watch Godot receive a button press</h2>
    <ol><li>Extract the project ZIP. In the Godot 4.4.1 Project Manager, click <b>Import</b>, select the extracted <code>project.godot</code> and open it.</li>
    <li>In the editor’s <b>FileSystem</b> dock, expand <b>scenes</b> and double-click <code>gamepad_check.tscn</code>. Press <b>F6</b> (Run Current Scene). Click inside the game window.</li>
    <li>Find your controller’s name and device ID. Move the left stick right and back to center. Hold the left face button, marked <b>X</b> on Xbox. Check that the stick reading changes and the button press appears. Press <b>F8</b> to stop. On a laptop, you might need Fn with F6 or F8.</li></ol>
    ${screenshot('./assets/gamepad/diagnostic.webp','Godot game · This capture shows the check scene waiting for a controller. A connected pad replaces this message with its name and live inputs.')}
    <p>If the device list is empty, unplug and reconnect the USB cable or check the Bluetooth connection, then repeat this step. If the pad charges without appearing, try a known data cable. If the device appears with unexpected controls, check its firmware and repeat the button test. <a href="https://docs.godotengine.org/en/4.4/tutorials/inputs/controllers_gamepads_joysticks.html#troubleshooting">Godot controller troubleshooting</a></p></div></section>
    <section class="guide-step"><div class="guide-index">3</div><div><h2>Play a solo round</h2>
    <p>Double-click <code>scenes/arena.tscn</code>, press F6 and click the game window. Tilt the <b>left stick</b> to face the sentinel, then tap <b>X</b> to fire. Look for a pulse leaving your pilot and a drop in the enemy’s HP when it hits.</p>
    <p>Release X, point the stick across the floor, and tap <b>B</b> to roll. Watch your pilot travel in that direction and spend stamina. When the round ends, press <b>Y</b> to restart. On an Xbox-style layout, X is the left face button, B is on the right and Y is at the top. Press F8 when finished.</p></div></section>
    <section class="guide-step"><div class="guide-index">4</div><div><h2>Find the binding in Input Map</h2>
    <p>Choose <b>Project → Project Settings → Input Map</b>. Click the disclosure arrow beside <code>fire</code>. The Space key and the joypad’s X button both trigger the same action in the solo arena.</p>
    ${screenshot('./assets/gamepad/input-map.webp','Godot 4.4.1 · Expand fire to inspect its keyboard and controller events. The + on the right adds a binding.')}
    <p>Try an edit in your copy. Click <b>+</b> on the <code>fire</code> row, press a spare shoulder button and click OK. Close Project Settings and run <code>arena.tscn</code> with F6. Fire once with X and once with the extra button. To undo, stop the game, reopen Input Map, expand <code>fire</code> and remove only the new shoulder-button entry.</p>
    <p>A <b>deadzone</b> ignores small stick movements near the center. If the solo pilot creeps when the stick is released, increase the deadzone on the four <code>move_</code> actions a little, then run the scene again. <a href="https://docs.godotengine.org/en/4.4/tutorials/inputs/controllers_gamepads_joysticks.html">Godot 4.4 controller input</a></p></div></section>
    <section class="guide-step"><div class="guide-index">5</div><div><h2>Choose who controls each pilot</h2>
    <p>Open <code>scenes/duel.tscn</code> and press F6. Use the mouse or keyboard for the mode and ready buttons. The duel reads movement from the left stick and shoots with the left face button (Xbox X).</p>
    <ul><li><b>Against the bot</b> — Choose Practice against a bot. Use the first local pad to move and fire.</li>
    <li><b>One computer</b> — Connect the pads before choosing Local PvP. With one pad, P1 uses WASD and Space and the pad controls P2. With two pads, the first controls P1 and the second controls P2. Move each stick separately and check its pilot before firing.</li>
    <li><b>Two computers</b> — Connect one pad to each computer. Choose Network PvP on both, host on one and join from the other. Both click Ready, wait for their local load and click Enter arena. After the countdown, each person uses their own stick and X. Ask your friend to confirm which pilot moved. <a href="#/lesson/duel-network">Follow the host and guest steps</a></li></ul>
    </div></section></div>`;
}
