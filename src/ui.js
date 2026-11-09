const glyphs = {
 grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
 box:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5m-9 5v10"/>',
 book:'<path d="M12 6c-3-2-6-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Zm0 0v14"/>',
 folder:'<path d="M3 6h6l2 3h10v10H3z"/>', arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',back:'<path d="m14 6-6 6 6 6"/>', down:'<path d="m7 10 5 5 5-5"/>', right:'<path d="m9 6 6 6-6 6"/>',
 layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 10 10 5 10-5M2 18l10 5 10-5"/>', check:'<path d="m4 12 5 5L20 6"/>', target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',expand:'<path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',game:'<path d="M7 7h10c2 0 3 2 4 6s1 6-1 6c-2 0-4-4-6-4h-4c-2 0-4 4-6 4-2 0-2-2-1-6s2-6 4-6Z"/><path d="M7 9v4m-2-2h4m7-1h.01m2 3h.01"/>',file:'<path d="M5 2h9l5 5v15H5zM14 2v6h5"/>',copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',play:'<path d="m8 4 12 8-12 8z"/>',terminal:'<path d="m4 6 6 6-6 6m9 0h7"/>',bolt:'<path d="m14 2-11 12h8l-1 8L21 9h-8z"/>', search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>', flag:'<path d="M4 22V3c5-3 10 3 16 0v11c-7 3-11-3-16 0"/>'};
export const icon=(key,size=18)=>`<svg class="icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${glyphs[key]||glyphs.box}</svg>`;
export const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const pad=n=>String(n).padStart(2,'0');
export const glossary=[
 ['Script','A text file attached to a node. It tells that node what to do. A .gd file uses GDScript. Think of adding behavior to one object in the Outliner.'],
 ['Variable','A named value you can read or change, like a custom property on a Blender object. In var health: int = 3, the name is health and its starting value is 3.'],
 ['Type','The kind of value a slot accepts. int holds a whole number, float a decimal, bool true or false, String text, and Vector3 three coordinates.'],
 ['Expression','A calculation that produces a value. With health equal to 3, health - 1 produces 2. Use = to store the result and == to compare two values.'],
 ['Function','Named instructions grouped with func. A call runs them. Parentheses hold input values called arguments. return sends a value back to the caller.'],
 ['Indentation','The space at the start of a line. After a colon, indent the lines that belong inside a function, loop or condition. Use the editor’s Tab key consistently.'],
 ['Node and scene','A node performs one job. A scene saves a tree of nodes, much like an organized collection of Blender objects that can be reused together.'],
 ['Signal','An announcement that another node can listen for. A damage signal can update a health display without the sender needing the label’s path.'],
 ['Physics tick','One fixed simulation update. Godot calls _physics_process(delta) each tick. delta is elapsed time in seconds, like the time between animation samples.'],
 ['Vector3','A triple of X, Y and Z values. Use it for positions, directions or velocities. Godot uses Y for up and −Z for forward.'],
 ['Instance','A live copy created from a saved scene, comparable to placing a linked collection in Blender. Each projectile has its own position and lifetime.'],
 ['Collision mask','The set of physics layers a detector watches. The layer says where an object belongs. A mask chooses which layers are considered.'],
 ['Node path','A route through the scene tree. $Model/AnimationPlayer starts at the node running the script, then finds the named children. Names are case-sensitive.'],
 ['Debugger','The bottom editor panel that reports runtime errors. Click the top stack frame to jump to the script line, inspect the values, fix it, then run again.']
];
