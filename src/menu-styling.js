import {screenshot} from './screenshot.js';
import {esc} from './ui.js';

const screens={
  'game-lobby':{
    scene:'lobby', title:'Lobby background', path:'MenuArt',
    place:'Open lobby.tscn. In the Scene dock, MenuArt sits directly beneath Lobby, before Center. The image draws first, then Center draws the title and buttons on top.',
    test:'Run lobby.tscn with F6. Resize the window and click Start battle. The image should fill the window and the button should still open the arena.'
  },
  'guided-tutorial':{
    scene:'tutorial',title:'Tutorial prompt banner',path:'HUD/PromptArt',
    place:'Open tutorial.tscn. Expand HUD in the Scene dock. PromptArt sits above Prompt in the list so the text draws in front of the picture. Select PromptArt in the 2D view, choose the Top Left anchor preset and set Position to (18, 18) and Size to (364, 82) in Layout → Transform.',
    test:'Press F6 and walk until the firing prompt appears. The artwork stays behind the instruction while the arena floor, character and action buttons remain visible.'
  },
  'game-settings':{
    scene:'settings',title:'Settings background',path:'MenuArt',
    place:'Open settings.tscn. MenuArt belongs under Settings, before Center. Keep LargeHUD, Preview, Notice and Back inside Center/VBox so the settings script can find them.',
    test:'Run settings.tscn with F6. Try both HUD text sizes. Confirm that the preview stays readable and that clicking Back returns to the lobby.'
  }
};

function figure(path,caption){
  const url='./assets/menu-guide/'+path+'.webp';
  return screenshot(url, caption, true);
}

export function menuStyling(id){
  const s=screens[id];
  if(!s)return '';
  return `<details class="menu-style-guide"><summary>Customize this screen · ${s.title}</summary>
  <p>Open the downloaded Godot project. The three menus share one art scene, like three linked instances of a Blender collection. In an installed kit, look inside the battle_lab folder for the same files.</p>
  <h4>1. Replace the image</h4><ol>
  <li>Copy a PNG, JPG or WebP from your computer into the project’s assets folder. Return to Godot and wait for the thumbnail to appear in FileSystem.</li>
  <li>Double-click <code>scenes/menu_art.tscn</code>. Select <code>Picture</code> in the Scene dock. Drag your image from FileSystem onto <b>Texture</b> in the Inspector.</li>
  <li>Use <b>Expand Mode → Ignore Size</b> and <b>Stretch Mode → Keep Aspect Covered</b>. This fills the frame and crops the edges. Choose Keep Aspect Centered if every edge of your illustration must remain visible.</li></ol>
  ${figure('art-picture','Godot editor · Select Picture to change the TextureRect image and how it fits its frame.')}
  <h4>2. Add drifting particles</h4><ol>
  <li>In the supplied scene expand <code>SparksAnchor</code> and select <code>Sparks</code>. Starting with a blank scene? Add a Control as the anchor, place it near the upper right, then use Add Child Node to add <code>CPUParticles2D</code> under it.</li>
  <li>Enable <b>Emitting</b>. Try <b>Amount</b> 24 and <b>Lifetime</b> 3 seconds. Set Gravity to (0, 0), Direction to (−0.5, −1) and Initial Velocity Min/Max to 14 and 28. Negative Y sends particles upward in Godot 2D.</li>
  <li>Change Amount to 8 and watch the corner become quieter. In the Color section, edit the Color Ramp gradient to fade the last stop to zero alpha. Save with Ctrl+S or Command+S.</li></ol>
  ${figure('art-sparks','Godot editor · Select Sparks to compare its particle count, lifetime and emission settings.')}
  <h4>3. Place it on this screen</h4><p>${s.place} When building from scratch, drag <code>menu_art.tscn</code> from FileSystem into this parent and name the instance <code>${s.path.split('/').pop()}</code>. For a full-screen menu, select Layout → Anchors Preset → Full Rect.</p>
  <p>To give only this screen a different look, open menu_art.tscn, choose Scene → Save Scene As and save a separate copy. Replace this screen’s art instance with that copy in the same tree position.</p>
  ${figure('art-'+s.scene,s.title+' · Run the scene and compare your result with the reference game.')}
  <div class="expected"><b>Check the result</b><p>${s.test}</p></div>
  <details class="trouble"><summary>The image covers the controls or blocks a click.</summary><p>Place the art instance before the controls in the scene tree. On MenuArt, Picture and SparksAnchor, set Mouse → Filter to Ignore. Darken Picture under Visibility → Self Modulate if bright art hides the text.</p></details>
  </details>`;
}
