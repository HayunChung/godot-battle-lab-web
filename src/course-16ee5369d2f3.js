var me={camera:["Camera size","m",10,22,.1,14,"scenes/arena","Camera3D","size","scenes/arena"],guard:["Guard window","s",.05,.5,.01,.18,"practice/guard","GuardPractice","guard_window","practice/guard"],audio:["Guard sound","dB",-36,0,1,-6,"practice/guard","GuardSound","volume_db","practice/guard"],message:["Result display time","s",.2,3,.05,1.5,"practice/guard","GuardPractice","result_seconds","practice/guard"],blend:["Idle / walk blend rate","/s",1,15,.1,6,"scenes/player","Player","blend_rate","scenes/arena"],impact:["Impact expansion","s",.04,.5,.01,.12,"scenes/impact","Impact","expansion_seconds","scenes/arena"],attack:["Shot release","s",0,1,.01,.33,"scenes/player","Player","attack_release_seconds","scenes/arena"],contact:["Swing contact fraction","",0,1,.01,.5,"scenes/enemy","Enemy","attack_contact_fraction","scenes/arena"],reaction:["Fall playback speed","\xD7",.25,2,.05,1,"scenes/enemy","Reactions","fall_speed","scenes/arena"],outline:["Caption outline","px",0,10,1,3,"scenes/arena","Caption","theme_override_constants/outline_size","scenes/arena"],sparks:["Lobby particles","particles",1,64,1,20,"scenes/menu_art","Sparks","amount","scenes/lobby"],ring:["Confirmed hit cue","s",.08,.5,.01,.22,"scenes/duel","Duel","hit_cue_seconds","scenes/duel"]};function it(e){return Object.fromEntries(Object.entries(me).map(([t,[,,n,o,a,s]])=>{let i=e?.[t],c=Number.isFinite(i)?Math.max(n,Math.min(o,i)):s;return[t,Number((n+Math.round((c-n)/a)*a).toFixed(3))]}))}var Ln=new TextEncoder,jn=new TextDecoder;function Rt(e,t,n,o,a){let s=jn.decode(e[t]).split(/(?=^\[)/m),i=s.findIndex(u=>u.startsWith('[node name="'+n+'" '));if(i<0)throw Error("Missing "+t+" / "+n);let c=s[i].trimEnd().split(`
`),l=c.findIndex(u=>u.startsWith(o+" = ")),h=o+" = "+a;l<0?c.push(h):c[l]=h,s[i]=c.join(`
`)+`

`,e[t]=Ln.encode(s.join(""))}function Gn(e,t,n){let o=it(t);for(let[s,[,,,,,,i,c,l]]of Object.entries(me)){let h=i+".tscn";Rt(e,h,c,l,o[s])}let a=me[n==="network"?"ring":n][9];return e["project.godot"]=Ln.encode(jn.decode(e["project.godot"]).replace(/^run\/main_scene=.*$/m,'run/main_scene="res://'+a+'.tscn"')),e}var lt="scenes/hit_feedback.tscn",It="scenes/duel_hit.tscn",Dt="scenes/duel.tscn",ct=[{node:"HitRumble",property:"strength",label:"Rumble strength",min:0,max:1,step:.05,initial:.55},{node:"HitRumble",property:"duration",label:"Pulse duration (seconds)",min:.05,max:1,step:.01,initial:.18}],dt=[{node:"Burst",property:"amount",label:"Particle count",min:1,max:64,step:1,initial:12},{node:"Burst",property:"lifetime",label:"Particle lifetime (seconds)",min:.1,max:1.5,step:.05,initial:.35},{node:"AnimationPlayer",property:"speed_scale",label:"Animation playback speed (\xD7)",min:.25,max:2,step:.05,initial:1}],Hn="battle-lab.hit-feedback.v1";function Nn(e){let t=e==="duel-hit-rumble",n=e==="duel-hit-effects"||t,o=t?Dt:n?It:lt;return`<details class="trouble effects-preview"><summary>${t?"Tune and download your vibration settings":"Preview and tune the hit in Godot"}</summary><div class="cue-tuner">
  <p>${t?"Set the values to use on your controller in the downloaded Godot project.":n?"Replay a pulse hitting P2 in the actual duel scene.":"Run the preview and click the hexagon, then the empty floor."} ${t?"Use the two-computer exercise to feel the difference.":"Change one setting and replay the hit."}</p>
  ${(t?ct:dt).map(s=>`<label class="tuner-control">${s.label} <output></output><input type="range" data-effect="${s.property}" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.initial}"></label>`).join("")}
  ${t?"":'<div class="live-stage"></div><button type="button" class="secondary" data-effect-play>Run Godot preview</button>'}
  <p>In <code>res://${o}</code>, select the node below to edit the same setting in the Inspector. ${t?"Open <code>scripts/hit_rumble.gd</code> to see how the selected device uses these values.":n?"The confirmed target in <code>scripts/duel.gd</code> selects the pilot\u2019s <code>HitFX</code>. Give both players the same tuned ZIP.":"The hit signal in <code>scripts/hit_feedback.gd</code> calls <code>_play_hit()</code> to restart the particles and play the animation."}</p>
  <pre data-effect-source></pre>${n?"<p>In Godot\u2019s Script editor, use Go to Line (Ctrl+L or \u2318L) to follow one confirmed hit.</p><pre data-hit-code></pre>":""}<button type="button" class="primary" data-effect-download>Download my effects project \u2193</button>
  <p>The ZIP includes this lesson and its screenshots in <code>MY-EFFECTS-LESSON.md</code>.</p><p role="status"></p></div></details>`}function zn(e,t,n){let o=e.querySelector(".effects-preview");if(!o)return;let a=t.id==="duel-hit-rumble",s=t.id==="duel-hit-effects"||a,i=a?ct:dt,c=s?"duel-hit":"hit-feedback",l=a?Dt:s?It:lt,h=s?"scenes/duel.tscn":lt,u=[...o.querySelectorAll("input[type=range]")],d={};try{d=JSON.parse(localStorage.getItem(Hn))||{}}catch{}for(let v of u){let T=d[v.dataset.effect];Number.isFinite(T)&&(v.value=String(T))}let f=()=>Object.fromEntries(u.map(v=>[v.dataset.effect,v.valueAsNumber])),S=(v,T,C,F=i)=>{for(let D of F)Rt(v,C,D.node,D.property,T[D.property])};function g(){let v=f();for(let F of u)F.parentElement.querySelector("output").textContent=F.value;let T={[l]:new TextEncoder().encode(n[l])};S(T,v,l);let C=new TextDecoder().decode(T[l]).split(`
`);o.querySelector("[data-effect-source]").textContent=i.map(F=>{let D=C.findIndex(O=>O.startsWith('[node name="'+F.node+'" ')),P=C.findIndex((O,z)=>z>D&&O.startsWith(F.property+" = "));return F.node+" \xB7 line "+(P+1)+" \xB7 "+C[P]}).join(`
`)}if(s){let v=a?[["duel.gd","$HitRumble.play_hit(target, mode)"],["hit_rumble.gd","Input.start_joy_vibration(device, strength, strength, duration)"]]:[["duel.gd","_confirm_hit(target)"],["duel_network.gd","hit_received.emit(target)"],["duel.gd",'pilots[target].get_node("HitFX").play_hit()'],["duel_hit.gd","$Burst.restart(true)"],["duel_hit.gd",'$AnimationPlayer.play(&"hit_flash")']];o.querySelector("[data-hit-code]").textContent=v.map(([T,C])=>{let F=n["scripts/"+T].split(`
`);return"scripts/"+T+" \xB7 line "+(F.findIndex(D=>D.trim()===C)+1)+`
`+C}).join(`

`)}let x=o.querySelector("[data-effect-play]"),y;function w(){if(!o.isConnected||!o.open)return;let v={kind:c,values:f()};if(y){y.contentWindow?.configureDirection?.(v);return}y=document.createElement("iframe"),y.title="Godot hit feedback practice",y.src="./assets/godot-preview/index.html#"+encodeURIComponent(JSON.stringify(v)),y.onload=()=>y?.contentWindow?.configureDirection?.({kind:c,values:f()}),o.querySelector(".live-stage").append(y),x.textContent="Replay hit"}x&&(x.onclick=w);let p;o.oninput=()=>{g();try{localStorage.setItem(Hn,JSON.stringify({...d,...f()}))}catch{}clearTimeout(p),x&&(p=setTimeout(w,120))},o.ontoggle=()=>{o.open||(clearTimeout(p),y?.remove(),y=null,x&&(x.textContent="Run Godot preview"))};let m=o.querySelector("[data-effect-download]"),k=o.querySelector("[role=status]");m.onclick=async()=>{let v=f();m.disabled=!0,k.textContent="Preparing your Godot project\u2026";try{let[T,C]=await Promise.all([import("../vendor/fflate.js"),fetch("./downloads/battle-lab.zip")]);if(!C.ok)throw Error();let F=T.unzipSync(new Uint8Array(await C.arrayBuffer())),D={...d,...v};for(let R of[...dt,...ct]){let q=D[R.property];D[R.property]=Number.isFinite(q)?Math.min(R.max,Math.max(R.min,q)):R.initial}for(let R of[lt,It])S(F,D,R,dt);S(F,D,Dt,ct);let P=["# "+t.title,"Open "+h+". Press F6 to run and F8 to stop. Edit "+l+" for these settings.",...i.map(R=>"- "+R.node+" \u2192 "+R.property+" = "+v[R.property])];for(let R of t.steps)P.push("## "+R.title,...R.directions,"Check: "+R.expected,"!["+R.caption+"](workshop-images/"+R.image.split("/").pop()+".webp)");await Promise.all([...new Set(t.steps.map(R=>R.image))].map(async R=>{let q=await fetch("./assets/"+R+".webp");if(!q.ok)throw Error();F["workshop-images/"+R.split("/").pop()+".webp"]=new Uint8Array(await q.arrayBuffer())})),F["workshop-images/.gdignore"]=new Uint8Array,F["MY-EFFECTS-LESSON.md"]=T.strToU8(P.join(`

`));let O=T.strFromU8(F["project.godot"]).replace(/^run\/main_scene=.*$/m,'run/main_scene="res://'+h+'"');F["project.godot"]=T.strToU8(O);let z=document.createElement("a");z.href=URL.createObjectURL(new Blob([T.zipSync(F)],{type:"application/zip"})),z.download=a?"battle-lab-hit-rumble.zip":s?"battle-lab-duel-hit.zip":"battle-lab-hit-feedback.zip",z.click(),setTimeout(()=>URL.revokeObjectURL(z.href),1e3),k.textContent="Extract the ZIP, import project.godot, then press F5 to play your settings."}catch{k.textContent="Could not prepare the project. Try downloading again."}finally{m.disabled=!1}},g()}function Un(){return`<details class="trouble flow-research"><summary>How PvP games take players from a lobby to a rematch</summary>
    <div class="practice-help">
    <h4>Before the fight</h4>
    <ul>
      <li><strong>Enter a room and confirm both players.</strong> League of Legends treats declining a ready check and letting it expire as ways to miss a match. Build the room entry in the <a href="#/lesson/game-lobby">lobby lesson</a>. In the <a href="#/lesson/pvp-ready-room">ready-room exercise</a>, use the two local player controls. Accept with one pilot and decline with the other, then try letting the clock expire. In both cases the arena should stay closed. <a href="https://www.leagueoflegends.com/en-us/news/game-updates/patch-14-17-notes/">Riot Games \xB7 Ready checks</a></li>
      <li><strong>Load the arena, then start the clock.</strong> League of Legends opens a loading screen after champion selection. Rocket League exposes separate events for the countdown and the start of active play. In the <a href="#/lesson/pvp-loading">loading exercise</a>, check the arena resource status, handle a failed load, and begin the countdown after the scene is available. Try to score before the countdown finishes. <a href="https://support.riotgames.com/en-us/league-of-legends/connectivity/league-of-legends-not-launching-after-champion-selection">Riot Games \xB7 Loading after selection</a> \xB7 <a href="https://www.rocketleague.com/developer/stats-api">Rocket League \xB7 Match events</a></li>
    </ul>
    <h4>During the match</h4>
    <ul>
      <li><strong>Decide who scored.</strong> VALORANT resolves hits on its server. Build health and knockouts in the <a href="#/lesson/duel-local">two-player duel</a>. Then open the <a href="#/lesson/duel-network">network lesson</a> to see how the host owns combat state. Compare both windows after one hit. <a href="https://playvalorant.com/en-gb/news/dev/the-state-of-hit-registration/">Riot Games \xB7 Hit registration</a></li>
      <li><strong>Separate a round win from the match win.</strong> In Street Fighter Alpha 2, the first fighter to win two rounds takes the match. In the <a href="#/lesson/pvp-results">results exercise</a>, split the first two rounds between the pilots. The next win must produce the final result. Also test the exercise's draw rule and check both scores. <a href="https://captown.capcom.com/uploads/game/manual/41/sfzero2_en_G.f3d07429-1642-47ba-8ca9-900b0fd1ebe6.pdf">Capcom \xB7 Street Fighter Alpha 2 manual, p. 5 (PDF)</a></li>
    </ul>
    <h4>After the fight or a lost connection</h4>
    <ul>
      <li><strong>Show the result and offer a next action.</strong> League of Legends Arena added a post-game scoreboard for eliminated teams. TEKKEN 8 added a rematch option after a completed set in Quick Match and Group Match. Build the <a href="#/lesson/pvp-results">result panel</a> with a winner, final score, and controls to leave or start a fresh ready check. Try each exit once. Then play the <a href="#/lesson/duel-network">two-computer series</a> and compare both result screens before accepting a rematch. <a href="https://www.leagueoflegends.com/en-us/news/game-updates/patch-25-16-notes/">Riot Games \xB7 Arena post-game scoreboard</a> \xB7 <a href="https://en.bandainamcoent.eu/tekken/news/tekken-8-patch-111">Bandai Namco \xB7 TEKKEN 8 rematch options</a></li>
      <li><strong>Handle an interrupted game separately.</strong> League of Legends can offer a remake vote when a teammate is absent early enough. For a two-person duel, practice the simpler recovery path. Close one running copy during the <a href="#/lesson/duel-network">LAN exercise</a>, read the surviving player's status, then use the <a href="#/lesson/duel-internet">connection lesson</a> to host and join again. This starts a new session. Resuming the same round would also require identifying the returning player and restoring the host's current match state. <a href="https://support.riotgames.com/en-us/league-of-legends/gameplay/remake-faq">Riot Games \xB7 Remake conditions</a></li>
    </ul>
    <h4>Which screens depend on your rules?</h4>
    <p>VALORANT uses agent selection, a buy phase, and attacking and defending teams with a Spike objective. Add those steps when players choose characters, spend round currency, or contest an objective. The practice duel has two fixed pilots and a round score. <a href="https://playvalorant.com/en-us/news/announcements/beginners-guide/">Riot Games \xB7 VALORANT beginner\u2019s guide</a></p>
    <p>Overwatch\u2019s role queue groups players by their chosen roles. Its competitive progress screen tracks changes in rank. A room between friends already has opponents. A public ranked mode would also need a player pool, matchmaking rules, and persistent player records. <a href="https://overwatch.blizzard.com/en-us/news/23060961/">Blizzard \xB7 Role queue</a> \xB7 <a href="https://overwatch.blizzard.com/en-us/news/patch-notes/live/2024/02/">Blizzard \xB7 Competitive progress</a></p>
    </div></details>`}var Wn={camera:{file:"scenes/arena.tscn",header:'[node name="Camera3D" type="Camera3D" parent="."]',tree:"Arena \u2192 Camera3D",line:78,reads:[]},guard:{file:"practice/guard.tscn",header:'[node name="GuardPractice" type="VBoxContainer"]',tree:"GuardPractice",line:12,reads:[{file:"practice/guard.gd",line:41,func:"_physics_process",code:`elif IMPACT - pressed_at <= guard_window:
	$Cue.text = "Perfect guard \u2022 damage blocked"
	guard_blocked.emit()`}]},audio:{file:"practice/guard.tscn",header:'[node name="GuardSound" type="AudioStreamPlayer" parent="."]',tree:"GuardPractice \u2192 GuardSound",line:28,reads:[{file:"practice/guard.gd",line:43,func:"_physics_process",code:"guard_blocked.emit()"},{file:"practice/guard.gd",line:13,func:"_ready",code:"guard_blocked.connect($GuardSound.play)"}]},message:{file:"practice/guard.tscn",header:'[node name="GuardPractice" type="VBoxContainer"]',tree:"GuardPractice",line:13,reads:[{file:"practice/guard.gd",line:38,func:"_physics_process",code:"result_left = result_seconds"},{file:"practice/guard.gd",line:30,func:"_physics_process",code:`result_left = maxf(0.0, result_left - delta)
if result_left == 0.0:
	$Cue.text = "Press R when ready."`}]},blend:{file:"scenes/player.tscn",header:'[node name="Player" type="CharacterBody3D"]',tree:"Player",line:30,reads:[{file:"stages/animated_player.gd",line:15,func:"_physics_process",code:`blend = move_toward(blend, 1.0 if moving else 0.0, delta * blend_rate)
$AnimationTree.set("parameters/blend_position", blend)`}]},impact:{file:"scenes/impact.tscn",header:'[node name="Impact" type="MeshInstance3D"]',tree:"Impact",line:20,reads:[{file:"scripts/impact.gd",line:7,func:"_ready",code:`tween.tween_property(self, "scale", Vector3.ONE * 2.5, expansion_seconds)
tween.tween_property(self, "scale", Vector3.ONE * 0.01, 0.12)`}]},attack:{file:"scenes/player.tscn",header:'[node name="Player" type="CharacterBody3D"]',tree:"Player",line:31,reads:[{file:"scripts/player.gd",line:42,func:"_physics_process",code:`if not released and elapsed >= clampf(attack_release_seconds, 0.0, attack.length):
	released = true
	_fire_pulse()`}]},contact:{file:"scenes/enemy.tscn",header:'[node name="Enemy" type="CharacterBody3D"]',tree:"Enemy",line:56,reads:[{file:"scripts/enemy.gd",line:77,func:"_advance_attack",code:`var contact_time := attack_contact_fraction * attack_duration
if not contact_checked and attack_elapsed + 0.000001 >= contact_time:
	contact_checked = true
	_sample_attack(contact_time)
	if _weapon_reaches_player():
		player.take_damage(1)`}]},reaction:{file:"scenes/enemy.tscn",header:'[node name="Reactions" type="Node" parent="."]',tree:"Enemy \u2192 Reactions",line:97,reads:[{file:"scripts/reactions.gd",line:71,func:"_physics_process",code:`elapsed = minf(elapsed + delta * (fall_speed if state == &"death" else 1.0), duration)
if authored:
	# Explicit sampling keeps the last death key visible until restart.
	clips.seek(elapsed, true)`}]},outline:{file:"scenes/arena.tscn",header:'[node name="Caption" type="Label" parent="HUD/Stamina"]',tree:"Arena \u2192 HUD \u2192 Stamina \u2192 Caption",line:109,reads:[{file:"scripts/arena.gd",line:44,func:"_update_stamina",code:'caption.text += "   \xB7   %s: Need %s" % [denied_action, String.num(stamina_needed, 2)]'}]},sparks:{file:"scenes/menu_art.tscn",header:'[node name="Sparks" type="CPUParticles2D" parent="SparksAnchor"]',tree:"MenuArt \u2192 SparksAnchor \u2192 Sparks",line:32,reads:[]},ring:{file:"scenes/duel.tscn",header:'[node name="Duel" type="Node3D"]',tree:"Duel",line:60,reads:[{file:"scripts/duel.gd",line:239,func:"_draw_round",code:'hit_tweens[slot].tween_property(ring, "scale", resting_scales[slot], hit_cue_seconds)'}]},network:{file:"scenes/duel.tscn",header:'[node name="Duel" type="Node3D"]',tree:"Duel",line:60,reads:[{file:"scripts/duel.gd",line:224,func:"apply_snapshot",code:`hp.assign(state.hp)
moving.assign(state.moving)
shots.assign(state.shots)
result = state.result
_draw_round()`},{file:"scripts/duel.gd",line:239,func:"_draw_round",code:'hit_tweens[slot].tween_property(ring, "scale", resting_scales[slot], hit_cue_seconds)'}]}};var qn={grid:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',box:'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm-9 5 9 5 9-5m-9 5v10"/>',book:'<path d="M12 6c-3-2-6-2-10-1v14c4-1 7-1 10 1 3-2 6-2 10-1V5c-4-1-7-1-10 1Zm0 0v14"/>',folder:'<path d="M3 6h6l2 3h10v10H3z"/>',arrow:'<path d="M4 12h15m-6-6 6 6-6 6"/>',back:'<path d="m14 6-6 6 6 6"/>',down:'<path d="m7 10 5 5 5-5"/>',right:'<path d="m9 6 6 6-6 6"/>',layers:'<path d="m12 3 10 5-10 5L2 8l10-5Zm-10 10 10 5 10-5M2 18l10 5 10-5"/>',check:'<path d="m4 12 5 5L20 6"/>',target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',code:'<path d="m8 6-6 6 6 6m8-12 6 6-6 6m-3-15-2 18"/>',clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',download:'<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',expand:'<path d="M4 9V4h5m6 0h5v5m0 6v5h-5m-6 0H4v-5"/>',close:'<path d="m5 5 14 14M19 5 5 19"/>',menu:'<path d="M3 6h18M3 12h18M3 18h18"/>',game:'<path d="M7 7h10c2 0 3 2 4 6s1 6-1 6c-2 0-4-4-6-4h-4c-2 0-4 4-6 4-2 0-2-2-1-6s2-6 4-6Z"/><path d="M7 9v4m-2-2h4m7-1h.01m2 3h.01"/>',file:'<path d="M5 2h9l5 5v15H5zM14 2v6h5"/>',copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',play:'<path d="m8 4 12 8-12 8z"/>',terminal:'<path d="m4 6 6 6-6 6m9 0h7"/>',bolt:'<path d="m14 2-11 12h8l-1 8L21 9h-8z"/>',search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',flag:'<path d="M4 22V3c5-3 10 3 16 0v11c-7 3-11-3-16 0"/>'},I=(e,t=18)=>`<svg class="icon" aria-hidden="true" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${qn[e]||qn.box}</svg>`,b=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),fe=e=>String(e).padStart(2,"0"),Vn=[["Script","A text file attached to a node. It tells that node what to do. A .gd file uses GDScript. Think of adding behavior to one object in the Outliner."],["Variable","A named value you can read or change, like a custom property on a Blender object. In var health: int = 3, the name is health and its starting value is 3."],["Type","The kind of value a slot accepts. int holds a whole number, float a decimal, bool true or false, String text, and Vector3 three coordinates."],["Expression","A calculation that produces a value. With health equal to 3, health - 1 produces 2. Use = to store the result and == to compare two values."],["Function","Named instructions grouped with func. A call runs them. Parentheses hold input values called arguments. return sends a value back to the caller."],["Indentation","The space at the start of a line. After a colon, indent the lines that belong inside a function, loop or condition. Use the editor\u2019s Tab key consistently."],["Node and scene","A node performs one job. A scene saves a tree of nodes, much like an organized collection of Blender objects that can be reused together."],["Signal","An announcement that another node can listen for. A damage signal can update a health display without the sender needing the label\u2019s path."],["Physics tick","One fixed simulation update. Godot calls _physics_process(delta) each tick. delta is elapsed time in seconds, like the time between animation samples."],["Vector3","A triple of X, Y and Z values. Use it for positions, directions or velocities. Godot uses Y for up and \u2212Z for forward."],["Instance","A live copy created from a saved scene, comparable to placing a linked collection in Blender. Each projectile has its own position and lifetime."],["Collision mask","The set of physics layers a detector watches. The layer says where an object belongs. A mask chooses which layers are considered."],["Node path","A route through the scene tree. $Model/AnimationPlayer starts at the node running the script, then finds the named children. Names are case-sensitive."],["Debugger","The bottom editor panel that reports runtime errors. Click the top stack frame to jump to the script line, inspect the values, fix it, then run again."]];function te(e,t,n=!1){return`<figure class="guide-photo${n?" lesson-photo":""}"><button type="button" class="photo-trigger" data-enlarge aria-haspopup="dialog" aria-label="Enlarge screenshot: ${b(t)}"><img loading="lazy" src="${b(e)}" alt="${b(t)}"></button><figcaption>${b(t)} <button type="button" class="photo-link" data-enlarge aria-haspopup="dialog">View full size</button></figcaption></figure>`}var yo={camera:{field:"Size",run:"Walk to the floor edge with WASD. Look at how much of the opposite edge remains visible.",effect:"A larger Size shows more floor; the pilots appear smaller.",why:"Camera3D reads Size directly when it draws the orthographic view."},guard:{field:"Guard Window",run:"Click the game, press R, then tap G when the bar is three quarters full. Repeat at the same point.",effect:"At that input time, 0.25 seconds remain until impact. A window of at least 0.25 s blocks the hit; a shorter one expires.",why:"The guard script compares the time left at the first press with the window saved on GuardPractice.",refs:[["practice/guard.gd","elif IMPACT - pressed_at <= guard_window:",3]]},audio:{field:"Volume dB",run:"Keep the device volume fixed. Press R, then tap G just before the bar fills. Listen for the successful guard.",effect:"A value closer to 0 dB plays the same WAV louder. An expired guard stays silent.",why:"A successful guard emits this signal. Its listener starts GuardSound, whose AudioStreamPlayer applies Volume dB.",refs:[["practice/guard.gd","guard_blocked.emit()",1],["practice/guard.gd","guard_blocked.connect($GuardSound.play)",1]]},message:{field:"Result Seconds",run:"Press R and let the bar fill without guarding. Watch from the first \u201CHit\u201D until \u201CPress R when ready.\u201D",effect:"The larger value keeps the result on screen longer after the strike.",why:"When the strike finishes, result_seconds starts a countdown. At zero the label returns to the ready prompt.",refs:[["practice/guard.gd","result_left = result_seconds",1],["practice/guard.gd","result_left = maxf(0.0, result_left - delta)",3]]},blend:{field:"Blend Rate",run:"Hold W for a second, release it and watch the legs settle back into idle. Repeat the same movement.",effect:"A larger rate moves the blend toward its target faster, especially just after release.",why:"Player inherits this movement script. It advances the blend value and sends it to AnimationTree.",refs:[["stages/animated_player.gd","blend = move_toward(",2]]},impact:{field:"Expansion Seconds",run:"Face the enemy and tap Space. Watch the orange ring from first contact to maximum size.",effect:"A longer expansion takes more time to reach the same maximum size. The shrink time stays at 0.12 s.",why:"Each projectile hit creates an Impact instance. Its first tween reads this duration.",refs:[["scripts/impact.gd","Vector3.ONE * 2.5, expansion_seconds",2]]},attack:{field:"Attack Release Seconds",run:"Stand still and tap Space once. Watch the firing hand and the first instant the projectile appears.",effect:"A larger release time places the shot later in the same attack animation.",why:"During the attack, the player checks elapsed time against the saved release time, then fires once.",refs:[["scripts/player.gd","if not released and elapsed >=",3]]},contact:{field:"Attack Contact Fraction",run:"Stand still in front of the enemy. Watch its blade and the instant the player loses HP. Repeat from the same position.",effect:"A larger fraction checks the blade later in the swing. The swing can miss if the blade has already passed.",why:"The enemy converts the fraction to seconds, samples that pose and checks the weapon against the player.",refs:[["scripts/enemy.gd","var contact_time := attack_contact_fraction",6]]},reaction:{field:"Fall Speed",run:"Aim at the enemy and fire until its HP reaches zero. Watch from the final hit until the body settles.",effect:"A larger multiplier plays the fall faster. Compare the fall after a lethal hit.",why:"The Reactions child advances the death clip clock at the saved multiplier and samples that time.",refs:[["scripts/reactions.gd","elapsed = minf(elapsed + delta * (fall_speed",4]]},outline:{field:"Theme Overrides \u2192 Constants \u2192 Outline Size",run:"Roll with Shift until the game denies the next roll. Read the stamina caption over the floor.",effect:"A larger outline makes the edge around each letter thicker; zero removes the outline.",why:"Label draws its letters with the saved theme override. The arena script supplies the caption text.",refs:[["scripts/arena.gd","caption.text +=",1]]},sparks:{field:"Amount",run:"Look at the particles above the upper-right side of the lobby. Watch for several seconds.",effect:"A larger Amount makes that corner denser at the same particle lifetime.",why:"The lobby instances MenuArt. Its CPUParticles2D node reads Amount directly to set the particle count."},ring:{field:"Hit Cue Seconds",run:"Choose Local PvP. Facing the orange pilot, tap Space once and watch the ring under the pilot that loses HP.",effect:"A larger duration leaves the ring enlarged longer after each confirmed hit.",why:"Duel animates the damaged pilot\u2019s ring back to its resting scale over hit_cue_seconds.",refs:[["scripts/duel.gd","hit_tweens[slot].tween_property(",1]]},network:{field:"Hit Cue Seconds",run:"Open Debug \u2192 Customize Run Instances and enable two instances. Press F5. In Network PvP host in one window and join 127.0.0.1 in the other. Both click Ready, then Enter arena after loading. After the countdown, hit P2 and watch the guest ring.",effect:"A larger duration keeps the confirmed ring visible longer in both windows. Stop both and relaunch the saved project for each run.",why:"The guest copies the host\u2019s HP and redraws. The same Duel tween runs on a confirmed drop in both modes.",refs:[["scripts/duel.gd","hp.assign(state.hp)",5],["scripts/duel.gd","hit_tweens[slot].tween_property(",1]]}};function Et(e,t,n){let o=e==="network"?"ring":e,[a,s,i,c,,l,,,h,u]=me[o],d=yo[e],f=C=>String(C)+(s?" "+s:""),S=e==="guard"?.25:(i+c)/2,g=t<S?c:i,x=h+" = "+t,y=n.reads[0],w=y?`In FileSystem double-click res://${y.file}. In the script editor scroll to line ${y.line} in ${y.func}(). Match the line with the excerpt above. ${d.why}`:`Keep ${n.tree} selected. Compare the Inspector field with the scene assignment above. ${d.why}`,p=[["Open your copy","Click Download my Godot project. Extract the ZIP. In the Godot 4.4.1 Project Manager choose Import, select project.godot in the extracted folder and open it."],["Find your saved value",`In FileSystem double-click res://${n.file}. In the local Scene tree select ${n.tree}. In Inspector open ${d.field}. Confirm it reads ${f(t)}.`],["Trace the effect",w],["Run the original",`Press F5 to play res://${u}.tscn. ${d.run} Press F8 to stop.`],["Make one edit",`Return to res://${n.file}. Select ${n.tree} again, click the numeric field for ${d.field}, enter ${g}, then press Enter. Save the scene with Ctrl+S (\u2318S on Mac).`],["Check the difference",`Press F5 and repeat the same action. ${d.effect} Press F8. To match your web preview again, set ${d.field} back to ${t}, save and run once more.`]],m=l<S?c:i,k=["import",e+"-pick",e+"-code",e+"-before",e+"-edit",e+"-compare"],v=["In the Godot Project Manager, click the outlined Import button.",`Select ${n.tree} in the Scene dock (teal). In Inspector, filter for ${d.field.split(" \u2192 ").at(-1)} and find the outlined row (gold). Example capture: ${f(l)}. Your copy opens with ${f(t)}.`,n.reads.length?n.reads.map(C=>`Open res://${C.file} at line ${C.line}.`).join(" ")+" The outline marks the code to read.":`Godot reads this built-in field directly. Match the outlined ${d.field} field to ${h} in the scene.`,"Click the outlined Run Project triangle or press F5. The game view below shows the example playtest.",`Click the number inside the gold outline, type ${g}, press Enter and save. The example capture shows ${f(m)}.`,e==="audio"?`Both captures show a successful guard. Listen in Godot at ${f(t)}, then ${f(g)} to compare the volume.`:`Example playtest at the same point with ${f(l)} and ${f(m)}. Repeat the action above with your own values.`],T=k.map((C,F)=>({filename:C+".webp",caption:v[F]}));return{label:a,assignment:x,steps:p,source:n,why:d.why,photos:T}}function Kn(e){let{assignment:t,source:n,why:o}=e;return`<h5>Where this value goes</h5><p><code>res://${b(n.file)} \xB7 line ${n.line}</code></p>
  <p>Scene tree \xB7 ${b(n.tree)}</p><pre><code>${b(n.header)}
<strong data-live-property>${b(t)}</strong></code></pre>
  <p>${b(o)}</p>${n.reads.map(a=>`<p><code>res://${b(a.file)} \xB7 line ${a.line} \xB7 ${b(a.func)}()</code></p><pre><code>${b(a.code)}</code></pre>`).join("")}`}function Yn(e){return"<h5>Try it in the downloaded project</h5><ol>"+e.steps.map(([t,n],o)=>{let{filename:a,caption:s}=e.photos[o];return`<li><p><b>${b(t)}.</b> ${b(n)}</p>${te("./assets/direction-editor/"+a,s,!0)}</li>`}).join("")+"</ol>"}function Xn(e){let{label:t,assignment:n,steps:o,source:a,why:s}=e;return[`# ${t} \u2014 Godot editor practice`,`res://${a.file}, line ${a.line} \xB7 ${a.tree}`,`~~~ini
`+a.header+`
`+n+`
~~~`,s,...a.reads.map(i=>`res://${i.file}, line ${i.line} \xB7 ${i.func}()

~~~gdscript
${i.code}
~~~`),...o.map(([i,c],l)=>`${l+1}. **${i}.** ${c}

   ![${e.photos[l].caption}](workshop-images/${e.photos[l].filename})

   ${e.photos[l].caption}`)].join(`

`)+`
`}var Jn="battle-lab.direction-values.v1",re=it({});function Mt(){try{let e=localStorage.getItem(Jn);e&&(re=it(JSON.parse(e)))}catch{}return re}var $t=e=>e==="network"?"ring":e;function Zn(e){let t=$t(e),[n,o,a,s,i]=me[t],c=Mt()[t];return`<section class="cue-tuner" data-cue-kind="${e}"><h4>Tune in Godot</h4>
    <label class="tuner-control">${b(n)} <output data-live-value>${c} ${b(o)}</output>
    <input type="range" data-live-range min="${a}" max="${s}" step="${i}" value="${c}"></label>
    <div class="live-stage"></div>
    <button type="button" class="secondary" data-live-run>${e==="audio"?"Play guard sound":"Run live Godot preview"}</button>
    <div class="tuner-source"></div>
    <button type="button" class="primary" data-live-export>Download my Godot project \u2193</button>
    <p role="status" data-live-status></p><div class="tuner-exercise"></div><p>The ZIP includes every workshop\u2019s settings and a copy of this exercise in <code>MY-WORKSHOP.md</code>.</p>
  </section>`}var Fe,Ft;async function bo(e){if(Fe??=new AudioContext,await Fe.resume(),!Ft){let o=await fetch("./assets/direction/guard-cue.wav");if(!o.ok)throw Error("The guard sound could not be loaded.");Ft=await Fe.decodeAudioData(await o.arrayBuffer())}let t=Fe.createBufferSource(),n=Fe.createGain();t.buffer=Ft,n.gain.value=10**(e/20),t.connect(n).connect(Fe.destination),t.start()}async function vo(e,t,n){let[o,a]=await Promise.all([import("../vendor/fflate.js"),fetch("./downloads/direction-project.zip")]);if(!a.ok)throw Error("The project could not be loaded. Try again.");let s=o.unzipSync(new Uint8Array(await a.arrayBuffer()));Gn(s,e,t);let i=Et(t,e[$t(t)],n);await Promise.all(i.photos.map(async({filename:l})=>{let h=await fetch("./assets/direction-editor/"+l);if(!h.ok)throw Error("A workshop screenshot could not be loaded. Try the download again.");s["workshop-images/"+l]=new Uint8Array(await h.arrayBuffer())})),s["workshop-images/.gdignore"]=new Uint8Array,s["MY-WORKSHOP.md"]=o.strToU8(Xn(i));let c=document.createElement("a");c.href=URL.createObjectURL(new Blob([o.zipSync(s)],{type:"application/zip"})),c.download="battle-lab-my-direction.zip",c.click(),setTimeout(()=>URL.revokeObjectURL(c.href),1e3)}function Qn(e,t){let n=e.querySelector("[data-cue-kind]");if(!n)return;let{cueKind:o}=n.dataset,a=$t(o),[,s]=me[a],i=t[o];function c(y){let w=Et(o,y,i);n.querySelector(".tuner-source").innerHTML=Kn(w),n.querySelector(".tuner-exercise").innerHTML=Yn(w)}c(re[a]);let l=n.querySelector("[data-live-range]"),h=n.querySelector("[data-live-run]"),u=n.querySelector("[data-live-status]"),d=null,f;function S(){if(!n.isConnected||!n.closest("details").open)return;if(o==="audio"){bo(re.audio).catch(()=>{u.textContent="Audio playback is unavailable in this browser."});return}let y={kind:o,values:{...re}};d?d.contentWindow?.configureDirection?.(y):(d=document.createElement("iframe"),d.title="Live Godot preview \xB7 "+me[a][0],d.src="./assets/godot-preview/index.html#"+encodeURIComponent(JSON.stringify(y)),d.onload=()=>d?.contentWindow?.configureDirection?.({kind:o,values:{...re}}),n.querySelector(".live-stage").append(d),h.textContent="Replay preview")}l.oninput=()=>{Mt(),re[a]=l.valueAsNumber;try{localStorage.setItem(Jn,JSON.stringify(re))}catch{}n.querySelector("[data-live-value]").textContent=re[a]+" "+s,c(re[a]),u.textContent="",clearTimeout(f),f=setTimeout(S,100)},h.onclick=S;let g=n.closest("details");g.addEventListener("toggle",()=>{!g.open&&d&&(d.remove(),d=null,h.textContent="Run live Godot preview")});let x=n.querySelector("[data-live-export]");x.onclick=async()=>{x.disabled=!0,u.textContent="Preparing project\u2026";try{await vo({...Mt(),[a]:l.valueAsNumber},o,i),u.textContent="Project ready. Open project.godot in the extracted folder."}catch(y){u.textContent=y.message}finally{x.disabled=!1}}}var Ot="./assets/direction/",wo={"editor-tour":[["course-shots/arena-camera","FileSystem \u2192 scenes \u2192 arena.tscn. Double-click the scene, then click Camera3D in the Scene dock. In the 3D viewport toolbar tick Preview."],["course-shots/arena-camera","In the Camera3D Inspector, keep Projection on Orthogonal. Click Current to make this camera active during play."],["course-shots/arena-initial","Click Size, enter 14, save, then press F6. Stop with F8, enter 16, save and repeat. Look at both ends of the floor."]],variables:[["direction/guard","In FileSystem double-click practice/guard.tscn. In Scene click its top row, GuardPractice. The Inspector on the right shows Guard Window."],["direction/guard-branch","Click the script icon beside GuardPractice. Find the comparison with guard_window. Select the root again to return to its Inspector."],["direction/guard-result","Click Guard Window, enter 0.35, press Enter and save. F6 runs this scene. Click the game, press R, then tap G when the bar is three quarters full."]],"functions-and-signals":[["direction/sound","Select GuardPractice \u2192 + (Add Child Node). Search AudioStreamPlayer \u2192 Create. Press F2 to rename it GuardSound. Drag the supplied WAV into FileSystem, then onto the Stream slot shown on the right."],["direction/sound-code","Click the script icon on GuardPractice. Add the signal and _ready connection shown here. In the successful elif branch put guard_blocked.emit() directly below the success text, at the same indentation."],["direction/sound","Click GuardSound \u2192 Inspector \u2192 Volume dB. Try \u22126, save, run F6 and make a successful guard. Stop, enter \u221218 and repeat. Keep Autoplay unchecked."]],"conditions-and-loops":[["direction/guard","Double-click practice/guard.tscn \u2192 GuardPractice \u2192 script icon. Find _input. R starts a fresh trial. G records the first press."],["direction/guard-branch","Scroll down to _physics_process. Click the quoted text after the final else. Compare a generic \u201CHit\u201D with \u201CHit \u2022 guard expired\u201D. Keep the indentation and the other two outcomes."],["direction/message-result","Save \u2192 F6 \u2192 R. Tap G at three quarters with Guard Window at 0.18. The finished bar stays visible so you can read the reason."]],"animation-blend":[["character-guide/blend-space","Double-click scenes/player.tscn \u2192 select AnimationTree \u2192 open the blend graph below the viewport. Drag the blend cursor from idle at 0 to walk at 1."],["direction/blend-code","Double-click stages/animated_player.gd in FileSystem. In the original code shown here, locate the final set call. Insert the blend member at the top and move_toward inside _physics_process as described above."],["course-shots/wasd-floor","Save the script, open scenes/arena.tscn and press F6. Tap W and release. Stop with F8, change the multiplier from 3 to 10 and repeat the same input."]],"projectiles-and-restart":[["direction/impact","Double-click scenes/impact.tscn and click Impact. In Inspector click the Mesh resource to inspect the torus. Use Scene \u2192 Save Scene As for your variation."],["direction/projectile","Double-click scripts/projectile.gd. Find the IMPACT preload at the top and enter the copied scene path. Scroll to _on_area_entered to see where Godot places it."],["direction/impact-code","Open scripts/impact.gd and find the first tween_property call. Change only its 0.12 to 0.24. Save, open arena.tscn and press F6. Fire at the enemy with Space."]],"player-attack-animation":[["attack-guide/blender-attack","Blender \xB7 Open Beacon-Pilot.blend. Select the armature \u2192 Pose Mode. In Dope Sheet \u2192 Action Editor choose attack. Click frame 9. Select the arm bone, pose it, then press I over the viewport to key the pose."],["attack-guide/blender-export","Blender \xB7 Switch to Object Mode. Select the rig and meshes \u2192 File \u2192 Export \u2192 glTF 2.0. Choose GLB, Selected Objects and Animation \u2192 Actions. Export, then choose the GLB and attack clip in the lesson arena."],["attack-guide/godot-inspector","Godot \xB7 Download the tuned kit from the arena and extract battle_lab beside project.godot. Open battle_lab/scenes/player.tscn \u2192 Player \u2192 Attack Release Seconds. Compare frame 5 (0.167 s) with frame 9 (0.333 s). Save and run the arena scene."]],"enemy-weapon-timing":[["enemy-attack-guide/blender-windup","Blender \xB7 Open Sentinel.blend. Select the armature \u2192 Pose Mode \u2192 Dope Sheet \u2192 Action Editor \u2192 attack. Click frame 10 to inspect the raised blade, then frame 13 for contact. Hover over the timeline and press M to mark that frame."],["enemy-attack-guide/blender-export","Blender \xB7 Object Mode \u2192 select the rig, enemy and weapon \u2192 File \u2192 Export \u2192 glTF 2.0. Enable Selected Objects and Animation \u2192 Actions. Export the GLB and select its attack clip in the enemy workshop."],["enemy-attack-guide/godot-timing","Godot \xB7 Open the tuned kit\u2019s battle_lab/scenes/enemy.tscn \u2192 Enemy \u2192 Attack Contact Fraction. Try 0.75, then 0.50 for the sample\u2019s frame 13. Save, open arena.tscn and press F6 for each run."]],"damage-reactions":[["reactions-guide/blender-hit","Blender \xB7 Select the rig \u2192 Pose Mode \u2192 Dope Sheet \u2192 Action Editor \u2192 hit. Click frame 3 to pose the recoil. Key the selected bones with I, then restore the ready pose at frame 9."],["reactions-guide/blender-death","Blender \xB7 Choose death in the action dropdown. In the Action Editor select the landing keys at frame 17 and press Shift+D, type 24, then Enter. The copy at frame 41 holds the pose for one second. Export both actions via File \u2192 Export \u2192 glTF 2.0 \u2192 Animation \u2192 Actions."],["reactions-guide/godot-setup","In the arena assign the exported Hit clip and Death clip, then download the tuned kit. In Godot double-click the imported foe.glb \u2192 expand AnimationPlayer and select death to preview it. Open the kit\u2019s arena.tscn \u2192 F6 and deliver a final hit."]],"roll-stamina":[["direction/caption","Open scenes/arena.tscn. Expand HUD \u2192 Stamina \u2192 click Caption. In the Inspector filter type outline_size. Expand Theme Overrides \u2192 Constants and enable Outline Size."],["direction/stamina-code","Double-click scripts/arena.gd \u2192 find _update_stamina. Follow the caption.text line that appends the denied action and its required cost."],["stamina-guide/godot-play","Set Outline Size to 3, save, then F6. Roll with Shift until the bar cannot pay. Compare with 0 while reading the cost over the game background."]],"game-lobby":[["menu-guide/art-sparks","Double-click scenes/menu_art.tscn, expand SparksAnchor and click Sparks. In Inspector set Amount to 8 and keep Lifetime at 3."],["menu-guide/art-lobby","In lobby.tscn find MenuArt above Center. For a lobby-only variation use Save Scene As on menu_art.tscn, then drag the copy from FileSystem to the lobby tree in place of the old instance. Keep it above Center."],["menu-guide/lobby","Save \u2192 F6 on lobby.tscn. Press Tab to move focus. Stop, set Amount to 20 in the lobby artwork and rerun. Watch the upper-right corner."]],"duel-local":[["duel-guide/setup-tree","Open scenes/duel.tscn. Expand Pilot2 and click Ring. This orange mesh will pulse when P2 takes damage."],["direction/ring-code","Open scripts/duel.gd. Use Find to jump to func _draw_round. The tween enlarges Ring only when hp is lower than displayed_hp."],["direction/duel","Click the Duel root \u2192 Hit Cue Seconds. Enter 0.12, save and press F6 \u2192 Local PvP. Face P2 and fire. Stop, change to 0.35, and repeat."]],"duel-network":[["direction/snapshot","Double-click scripts/duel.gd. Find apply_snapshot and follow hp.assign(state.hp) down to _draw_round(). This is the guest\u2019s confirmed HP update."],["duel-guide/network-pair","Run the same saved project in two windows. In Duel modes \u2192 Network PvP choose Host in one. Join 127.0.0.1 in the other. Both click Ready, then Enter arena after loading. After the countdown, hit the amber pilot and watch both scores."],["direction/duel","Stop both copies. Select Duel in duel.tscn \u2192 Inspector \u2192 Hit Cue Seconds \u2192 enter 0.35 and save. Relaunch both copies before comparing the guest ring."]]},ea={"editor-tour":["camera","Size 14","Size 16","Look at the space beyond the floor edges.",0],variables:["guard","Window 0.18 s","Window 0.35 s","G is pressed at 0.75 s in both trials. Read the outcome when the bar reaches one second.",9],"functions-and-signals":["audio","\u22126 dB","\u221218 dB","Play the same guard chime at each Inspector level."],"conditions-and-loops":["message","Generic hit text","Reason for the hit","The same early guard fails in both trials. Read the final label.",9],"animation-blend":["blend","Blend rate 3/s","Blend rate 10/s","Movement starts together and releases at 0.67 s. Watch the feet return to idle.",6],"projectiles-and-restart":["impact","Expand in 0.12 s","Expand in 0.24 s","Two impacts use the same ring. Follow its outer edge before it shrinks.",2],"player-attack-animation":["attack","Release at frame 5","Release at frame 9","Watch the space in front of the firing hand as the arm extends.",1],"enemy-weapon-timing":["contact","Contact at 75%","Contact at 50%","Watch when the scout recoils relative to the blade crossing its body.",4],"damage-reactions":["reaction","Cut to idle on landing","Hold the final pose","Both take a lethal hit. Compare the silhouette after the landing at frame 17.",8],"roll-stamina":["outline","Outline size 0","Outline size 3","Compare the same denial caption at the same stamina level.",0],"game-lobby":["sparks","8 particles","20 particles","A close-up of the lobby\u2019s upper-right corner shows the change in density.",4],"duel-local":["ring","Hit cue 0.12 s","Hit cue 0.35 s","Two hits land on P2. Watch how long the orange ring stays enlarged after each hit.",2],"duel-network":["network","Guest cue 0.12 s","Guest cue 0.35 s","Both guest views receive identical HP updates. Compare their rings after the score drops.",2]};function ht(e,t){let[n,o]=wo[e][t];return te("./assets/"+n+".webp",o,!0)}function Bt(e,t){e.style.setProperty("--frame-x",t%4*100/3+"%"),e.style.setProperty("--frame-y",Math.floor(t/4)*50+"%"),e.querySelector("output").textContent=(t/8).toFixed(3)+" s"}function ta(e){return Zn(ea[e][0])}function na(e){let[t,n,o,a,s]=ea[e],i='<section class="cue-compare"><h4>Compare before and after</h4><p>'+b(a)+"</p>";if(t==="audio")return i+'<div class="cue-audio">'+[n,o].map((h,u)=>`<button type="button" class="secondary" data-cue-gain="${u?-18:-6}">Play ${u?"after":"before"} \xB7 ${h}</button>`).join("")+`</div><a class="lib-link" href="${Ot}guard-cue.wav" download>Download this WAV for GuardSound \u2193</a></section>`;let c=["camera","outline"].includes(t),l={guard:"352/94",message:"352/94",outline:"307/45",sparks:"240/169"}[t]||"480/327";return i+`<div class="cue-pair" style="--frame-x:${s%4*100/3}%;--frame-y:${Math.floor(s/4)*50}%;--cue-ratio:${l}"><div class="cue-options" role="group" aria-label="Comparison view">${["Both","Before","After"].map((h,u)=>`<button type="button" class="secondary" data-cue-view="${u}" aria-pressed="${u===0}">${h}</button>`).join("")}</div><div class="cue-samples">${[n,o].map((h,u)=>`<figure><figcaption><b>${u?"After":"Before"}</b> \xB7 ${b(h)}</figcaption><div role="img" aria-label="${b(h)}" class="cue-frame ${c?"cue-still":""}" style="background-image:url('${Ot}${t}-${u}.webp')"></div></figure>`).join("")}</div>${c?"":`<label class="cue-time">Compare at the same time <input type="range" min="0" max="11" step="1" value="${s}" aria-label="Comparison time"><output>${(s/8).toFixed(3)} s</output></label><button type="button" class="secondary" data-cue-play>Replay both</button>`}</div></section>`}function aa(e,t){Qn(e,t);let n=e.querySelector(".cue-pair"),o=n?.querySelector("input");for(let s of n?.querySelectorAll("[data-cue-view]")||[])s.onclick=()=>{let i=Number(s.dataset.cueView);n.querySelector(".cue-samples").classList.toggle("cue-single",i!==0),n.querySelectorAll("figure").forEach((c,l)=>{c.hidden=i!==0&&i!==l+1});for(let c of n.querySelectorAll("[data-cue-view]"))c.setAttribute("aria-pressed",String(c===s))};if(o){let s=n.querySelector("[data-cue-play]"),i,c=()=>{clearInterval(i),i=null,s.textContent="Replay both"};o.oninput=()=>{c(),Bt(n,Number(o.value))},s.onclick=()=>{if(i){c();return}o.value=0,Bt(n,0),s.textContent="Pause",i=setInterval(()=>{if(!n.isConnected||!n.closest("details").open||Number(o.value)===11){c();return}o.value=Number(o.value)+1,Bt(n,Number(o.value))},125)}}let a=e.querySelectorAll("[data-cue-gain]");if(a.length){let s=new Audio;for(let i of a)i.onclick=()=>{s.src=Ot+`guard-minus-${Math.abs(Number(i.dataset.cueGain))}.wav`,s.currentTime=0,s.play().catch(()=>{i.textContent="Playback unavailable \xB7 download WAV below"})}}}var _o={"nodes-and-collisions":{title:"Light the arena floor",steps:["Open scenes/arena.tscn. In the Scene dock select Arena \u2192 Light. This DirectionalLight3D lights the whole floor from one direction. Press F6 to see its shadows, then F8.","In Inspector search for Energy. Run once at the original 1.15, then set Energy to 0.45, save and run again. Compare the lit sides of the pilots and the floor under their feet.","Restore Energy to 1.15. To change which way the shadows fall, clear the filter and set Transform \u2192 Rotation \u2192 Y from \u221230\xB0 to 30\xB0. Save and run. Restore \u221230\xB0 after the comparison."],photo:"effects-practice/lighting",caption:"Godot 4.4.1 \xB7 Select Light in the Scene dock. In Inspector, the Energy field shows the edited value of 0.45."},"pvp-results":{title:"Reveal the match winner with a short fade",steps:["Open scenes/match_flow.tscn. Open the script on MatchFlow and find _finish_round(). Under if wins.max() >= wins_needed, locate the _card() call that sets the match winner. Insert the two lines below immediately after that call, at the same indentation. Title is the Label at Overlay \u2192 Center \u2192 Card \u2192 Column \u2192 Title.","The first line makes the title transparent. The Tween brings only its alpha (opacity) back to 1 over 0.30 seconds. Change 0.30 to 0.75 to compare a slower reveal.","Select MatchFlow and set Wins Needed to 1 for this test. Save, press F6, start the ready check, accept for both pilots and enter the arena. Leave P2 still and fire with P1 until three hits land. Watch the winner appear while the score is already readable. Restore Wins Needed to 2 when finished."],codeStep:0,code:`title.modulate.a = 0.0
create_tween().tween_property(title, "modulate:a", 1.0, 0.30)`,photo:"effects-practice/victory",caption:"Godot 4.4.1 \xB7 In _finish_round(), the two selected lines follow the winner card. The else branch below still displays the ordinary round result.",next:["effects-animation","Practice changing animation timing"]},"character-body":{title:"Attach a label that follows the pilot",steps:["Open scenes/player.tscn. Select the Player root \u2192 Add Child Node (+) \u2192 Label3D \u2192 Create. Rename the new node PilotTag. A child inherits the movement of its parent.","With PilotTag selected, set Text to SCOUT, set Billboard to Enabled so the letters face the camera, and set Transform \u2192 Position \u2192 Y to 2.2. Set Font Size to 48 and save.","Open scenes/arena.tscn, press F6 and move with A and D. The tag should travel directly above the scout. Stop with F8 and compare Y = 1.6 with Y = 2.2 in player.tscn. Keep the lowest height that clears the head while walking."],photo:"effects-practice/tag",caption:"Godot 4.4.1 \xB7 PilotTag is selected under Player. The viewport shows the tag above the scout. Its Text field reads SCOUT."},hitboxes:{title:"Separate a projectile\u2019s appearance from its hit radius",steps:["Open scenes/projectile.tscn. The MeshInstance3D child draws the pulse. Its sibling CollisionShape3D supplies the shape used to detect a hit. Select MeshInstance3D \u2192 Inspector \u2192 Mesh and click the SphereMesh resource.","Expand its Material resource. Under Emission leave Enabled on and change the emission color to amber (#ff9b42). Under Albedo set Color to the same amber. Save and run scenes/arena.tscn with F6. Fire one shot across empty floor and one at the sentinel.","Press F8. In projectile.tscn set the SphereMesh Radius from 0.16 to 0.24 and Height from 0.32 to 0.48. Expand CollisionShape3D \u2192 Shape to verify its Radius still reads 0.18. Replay both shots. The visible pulse is larger, and only a confirmed overlap produces an impact."],photo:"effects-practice/projectile",caption:"Godot 4.4.1 \xB7 MeshInstance3D is selected. Its StandardMaterial3D shows the amber Emission swatch. CollisionShape3D remains a separate child.",next:["effects-hit","Trigger a separate cue when a hit lands"]},"shared-stamina":{title:"Tint the caption when a roll becomes too expensive",steps:["Open scenes/arena.tscn and expand HUD \u2192 Stamina \u2192 Caption. In scripts/arena.gd find _update_stamina(value). This function updates the HUD each time stamina changes. Insert the line below immediately after bar.value = value with the same indentation.","Save and run arena.tscn with F6. Roll twice with Shift before stamina recovers. At the default 40-point roll cost, the caption turns amber while another roll is unaffordable. Stop spending and watch it return to white when enough stamina regenerates.","Change the hex color to #ffc98a and repeat. Check that the amount and the \u201CNeed\u201D message remain legible against the arena. The comparison uses the current roll cost, so it also follows later balance edits."],codeStep:0,code:'caption.self_modulate = Color("#ffad60") if value < player.roll_stamina_cost else Color.WHITE',photo:"effects-practice/stamina",caption:"Godot 4.4.1 \xB7 The highlighted line follows bar.value = value inside _update_stamina. It tints the caption when the player cannot afford a roll."},"guided-tutorial":{title:"Bring in the next instruction as an action succeeds",steps:["Open scenes/tutorial.tscn. Select Training and open its script, scripts/tutorial.gd. Find _advance(). It increments step and calls _show_step() after the player completes the current action.","To keep quick consecutive actions smooth, add var prompt_tween: Tween above _ready(). Paste the lines below at the end of _advance(), directly after _show_step(). Indent the block one level inside the function; keep kill() one level deeper.","Save and press F6 on tutorial.tscn. Walk, fire, then roll. After each correct action the new prompt should brighten to full opacity. Wrong actions should leave the current prompt steady. Compare 0.20 and 0.45 seconds while completing the steps quickly."],codeStep:1,code:`if prompt_tween:
    prompt_tween.kill()
$HUD/Prompt.modulate.a = 0.4
prompt_tween = create_tween()
prompt_tween.tween_property($HUD/Prompt, "modulate:a", 1.0, 0.20)`,photo:"effects-practice/tutorial",caption:"Godot 4.4.1 \xB7 In _advance(), the highlighted lines run once after the instruction changes. The next function updates the prompt text.",next:["effects-animation","Build a reusable animation with keyframes"]},"duel-bot":{title:"Show the bot\u2019s firing boundary during practice",steps:["Open scenes/duel.tscn. Select Pilot2 \u2192 Add Child Node (+) \u2192 MeshInstance3D \u2192 Create and rename it RangeGuide. Set Transform \u2192 Position \u2192 Y to 0.06. Under Mesh choose New TorusMesh and click the new resource.","Set Outer Radius to 4.05, Inner Radius to 3.95, then select RangeGuide again and set Transform \u2192 Scale \u2192 Y to 0.2. This makes a thin floor ring centered on the bot\u2019s default 4 m firing boundary. Turn off Visibility \u2192 Visible before saving.",'In scripts/duel.gd find start_round(kind). Add the first line below directly after mode = kind. Add the second line in show_modes() directly after mode = "". Save, run duel.tscn with F6 and choose Practice against a bot. Stay still while the bot approaches; it stops and fires near the edge of the guide. Choose Leave round, then Local PvP, and check that the guide stays hidden.',"Try Bot Range = 5 on the Duel root. Change the torus outer and inner radii to 5.05 and 4.95 and repeat. The script reads Bot Range for firing; the two mesh radii are your illustration of that distance."],codeStep:2,code:`$Pilot2/RangeGuide.visible = kind == "bot"

# In show_modes():
$Pilot2/RangeGuide.hide()`,photo:"effects-practice/range",caption:"Godot 4.4.1 \xB7 RangeGuide is a child of Pilot2. Its TorusMesh Inspector shows Inner Radius 3.95 and Outer Radius 4.05."}};function oa(e){let t=_o[e];if(!t)return"";let n=t.next?`<a class="lib-link" href="#/lesson/${t.next[0]}">${b(t.next[1])} \u2192</a>`:"";return`<details class="trouble"><summary>Godot effects practice \xB7 ${b(t.title)}</summary><div class="practice-help"><p>Work in your own extracted copy of the <a href="./downloads/battle-lab.zip" download>reference game</a>.</p>${te("./assets/"+t.photo+".webp",t.caption,!0)}<ol>${t.steps.map((o,a)=>`<li>${b(o)}${a===t.codeStep?`<pre tabindex="0"><code>${b(t.code)}</code></pre>`:""}</li>`).join("")}</ol>${n}</div></details>`}var sa=["Nintendo \xB7 Perfect Shield","https://www.smashbros.com/en_US/howtoplay/technique.html"],ra=["Riot Games \xB7 The State of Hit Registration","https://playvalorant.com/en-gb/news/dev/the-state-of-hit-registration/"],ko={"editor-tour":["Frame both ends of the arena","In the reference project open scenes/arena.tscn and select Camera3D. Turn on Preview in the 3D viewport. Use the orthographic Size control to frame the player, enemy and border in one shot.","Keep Camera3D under Arena and enable Current. Run the scene with F6. Walk to each corner while a friend watches the opposite edge.","Increase Size by two units and repeat. Pick the tighter shot that still shows the floor edges and leaves space between the HUD and both actors."],variables:["Expose the timing of a perfect guard","Nintendo\u2019s Perfect Shield rewards guarding immediately before impact. Our practice/guard.tscn turns that timing decision into a one-second strike. The 0.18-second window is our exercise value. Download the reference game below and open the scene.","Select GuardPractice and open its attached guard.gd. The @export_range declaration makes guard_window editable in the Inspector. Meter fills as elapsed approaches IMPACT. Press F6, R to begin, then tap G just before it fills.","Change Guard Window from 0.18 to 0.35. Try G about three quarters of the way through each run. That input expires at the original setting and blocks at the wider setting. Restore 0.18 before the conditions exercise.",sa],"functions-and-signals":["Give a successful guard its own sound","Open practice/guard.tscn. Drop a short WAV into FileSystem, add an AudioStreamPlayer child named GuardSound under GuardPractice, and drag the WAV into Stream. Leave Autoplay off.","In guard.gd declare signal guard_blocked above the variables. Add func _ready() -> void: with the indented line guard_blocked.connect($GuardSound.play.bind(0.0)). In the perfect-guard branch, directly after setting the success text, add guard_blocked.emit() at the same indentation.","Run with F6. Try an early tap, a last-moment tap and no tap, pressing R for each strike. Only the successful guard should sound. Lower Volume dB on GuardSound and repeat with the text still visible."],"conditions-and-loops":["Resolve a strike once and explain the outcome","Open practice/guard.gd beside guard.tscn. Follow R resetting pressed_at to -1 and G recording elapsed on the first press. In _physics_process the bar advances until IMPACT, then running becomes false so the result remains on screen.","In the final if/elif/else block, keep the missing-input check first. For a recorded input compute IMPACT - pressed_at and compare it with guard_window. Give each branch a distinct Cue.text explaining whether the guard was missing, on time or expired.","At a 0.18 window, test three rounds with F6 and R. Skip G, tap near halfway, then tap near 90%. Expect missing, expired and blocked. Hold G after an early press and verify the guard still expires.",sa],"animation-blend":["Soften the transition from a planted foot to a step","Open player.tscn and preview idle and walk at the two ends of the AnimationTree blend graph. Watch the hips when you drag slowly between them.","In stages/animated_player.gd add a member var blend := 0.0. In _physics_process after moving is computed, add blend = move_toward(blend, 1.0 if moving else 0.0, delta * 6.0). Pass blend as the second argument of the existing AnimationTree.set call.","Run the movement lesson scene and tap W repeatedly. Compare rates 3 and 10. Choose the slowest transition that still plants the feet promptly on release."],"projectiles-and-restart":["Build an impact that reads at game-camera distance","Open scenes/impact.tscn. Its TorusMesh makes a hollow silhouette. Open scripts/impact.gd and follow the two scale tweens, first expanding over 0.12 seconds and then shrinking before queue_free.","In scripts/projectile.gd find _on_area_entered. It creates IMPACT under the arena and sets its global_position to the projectile position. To try another design, duplicate impact.tscn, edit its mesh material, and point the IMPACT preload at the copy.","Run Arena. Fire past the enemy, then land one shot. Only the hit should burst. Double the first tween duration, compare two rapid hits, and shorten it if the older ring hides the next contact."],"player-attack-animation":["Put the release on a readable silhouette","In Blender\u2019s Action Editor scrub the attack at game-camera scale. Key a drawn-back pose, an extended release and a relaxed recovery. Leave space between the weapon hand and torso at release.","Export the action with the character GLB. In the player attack workshop load that GLB, select its attack clip and set the release point to the extended pose. Preview a single shot before downloading the tuned kit.","Shift the release one pose earlier and compare. Watch the hand and projectile together. Keep the version where the shot leaves as the hand opens, then test repeated fire for a clean return to idle."],"enemy-weapon-timing":["Stage an attack the opponent can anticipate","In the enemy attack action, key the weapon high before the swing. Hold the raised silhouette for several frames, then cross the target quickly. Write down the frame where the blade first reaches it.","Export the GLB and load it in the enemy weapon workshop. Set contact time to the contact frame\u2019s offset from clip start divided by clip duration in frames. Preview the pose, then use Practice a swing.","Try staying in range and stepping aside. Lengthen the anticipation in Blender, re-export, and recalculate contact time. The player should be able to read the wind-up while damage still lands on the blade pass."],"damage-reactions":["Give a hit and a knockout different endings","Author a short recoil that comes back to the ready pose and a separate fall that settles on the floor. Scrub the last frames from the arena camera angle.","Export both actions in the GLB. In Practice hit & fall map the two clips to the actor you edited. Trigger a surviving hit, then a final hit. Check both the player and enemy assignments before exporting.","If recoil resembles a knockout, reduce its downward travel. If the final pose pops, hold the last fall pose for a few frames. Re-export and compare the two outcomes again."],"roll-stamina":["Show why a roll was denied","In scenes/arena.tscn select HUD/Stamina/Caption. Add a font outline using Theme Overrides \u2192 Constants \u2192 Outline Size, starting at 3. Leave room for the full denial message.","Open scripts/arena.gd and trace roll_denied from _ready to _show_stamina_denial and _update_stamina. Edit the wording where the cost is appended to caption.text. Keep both the action name and required amount.","Run the arena and roll until the meter cannot pay. Check the message at the moment of denial and when the required amount regenerates. Resize the window and adjust the caption width if the cost gets clipped."],"game-lobby":["Set the motion behind the lobby buttons","Open scenes/menu_art.tscn and select SparksAnchor/Sparks. In the 2D preview compare two Amount values, such as 8 and 20. Look for particles crossing the title or button text.","Open scenes/lobby.tscn. MenuArt draws behind Center. To give only the lobby a new look, save a copy of menu_art.tscn, replace the lobby instance with that copy at the same sibling position, and keep its mouse filter on Ignore.","Run the lobby with F6. Compare both densities while moving keyboard focus through the buttons. Reduce particle lifetime or amount until the focused button stays easy to find."],"duel-local":["Show which pilot took a confirmed hit","Riot describes separating immediate firing feedback from confirmed damage. In scenes/duel.tscn, each pilot already has a Ring mesh. Use its size to mark the damaged pilot while its position continues following that pilot.","Open scripts/duel.gd and find _draw_round. Compare hp[slot] with displayed_hp[slot]. On a decrease, enlarge the ring, then tween its scale back to resting_scales[slot]. Store the displayed HP after the comparison so the next draw cannot replay the same hit.","Press F6 and choose Local PvP. Miss once, then hit the other pilot. Only the damaged pilot\u2019s ring should pulse. In the Duel root Inspector compare Hit Cue Seconds at 0.12 and 0.35. Rematch and check both rings return to their starting size.",ra],"duel-network":["Keep host and guest hit cues in sync","Open scripts/duel.gd. Follow one hit from tick_pair reducing hp to snapshot copying hp. The guest receives that value in apply_snapshot and calls _draw_round. Both windows run the ring cue from that same decrease.","Run two copies, host one and join from the other. Each pilot clicks Ready, waits for the load, and confirms Enter arena. After the countdown, fire into empty space on the guest, then hit the host. Watch the target ring and score on both windows. A shot in flight has no confirmed damage yet.","Set Hit Cue Seconds to 0.35 in the saved scene and relaunch both copies. Compare one hit and one rematch. Repeated snapshots at the same HP should leave the ring at rest once its tween ends. Multiple hits between snapshots can appear as one pulse.",ra]};function ia(e){let t=ko[e];if(!t)return oa(e);let[n,o,a,s,i]=t,c={"player-attack-animation":["character-guide/Beacon-Pilot.blend","Beacon Pilot"],"enemy-weapon-timing":["reactions-guide/Sentinel.blend","Sentinel"],"damage-reactions":["reactions-guide/Sentinel.blend","Sentinel"]}[e];return`<details class="direction-workshop"><summary>Direction workshop \xB7 ${b(n)}</summary><p><a class="lib-link" href="./downloads/battle-lab.zip" download>Reference Godot project \u2193</a>${c?` <a class="lib-link" href="./assets/${c[0]}" download>${c[1]} Blender file \u2193</a>`:""}${e==="functions-and-signals"?' <a class="lib-link" href="./assets/direction/guard-cue.wav" download>GuardSound WAV \u2193</a>':""}</p>${ta(e)}<ol><li><b>Create.</b> ${b(o)}${ht(e,0)}</li><li><b>Attach.</b> ${b(a)}${ht(e,1)}</li><li><b>Revise and test.</b> ${b(s)}${ht(e,2)}</li></ol>${na(e)}${i?`<p><a class="lib-link" href="${b(i[1])}" target="_blank" rel="noopener">${b(i[0])} \u2197</a></p>`:""}</details>`}var So={"game-lobby":{scene:"lobby",title:"Lobby background",path:"MenuArt",place:"Open lobby.tscn. In the Scene dock, MenuArt sits directly beneath Lobby, before Center. The image draws first, then Center draws the title and buttons on top.",test:"Run lobby.tscn with F6. Resize the window and click Start battle. The image should fill the window and the button should still open the arena."},"guided-tutorial":{scene:"tutorial",title:"Tutorial prompt banner",path:"HUD/PromptArt",place:"Open tutorial.tscn. Expand HUD in the Scene dock. PromptArt sits above Prompt in the list so the text draws in front of the picture. Select PromptArt in the 2D view, choose the Top Left anchor preset and set Position to (18, 18) and Size to (364, 82) in Layout \u2192 Transform.",test:"Press F6 and walk until the firing prompt appears. The artwork stays behind the instruction while the arena floor, character and action buttons remain visible."},"game-settings":{scene:"settings",title:"Settings background",path:"MenuArt",place:"Open settings.tscn. MenuArt belongs under Settings, before Center. Keep LargeHUD, Preview, Notice and Back inside Center/VBox so the settings script can find them.",test:"Run settings.tscn with F6. Try both HUD text sizes. Confirm that the preview stays readable and that clicking Back returns to the lobby."}};function Lt(e,t){let n="./assets/menu-guide/"+e+".webp";return te(n,t,!0)}function la(e){let t=So[e];return t?`<details class="menu-style-guide"><summary>Customize this screen \xB7 ${t.title}</summary>
  <p>Open the downloaded Godot project. The three menus share one art scene, like three linked instances of a Blender collection. In an installed kit, look inside the battle_lab folder for the same files.</p>
  <h4>1. Replace the image</h4><ol>
  <li>Copy a PNG, JPG or WebP from your computer into the project\u2019s assets folder. Return to Godot and wait for the thumbnail to appear in FileSystem.</li>
  <li>Double-click <code>scenes/menu_art.tscn</code>. Select <code>Picture</code> in the Scene dock. Drag your image from FileSystem onto <b>Texture</b> in the Inspector.</li>
  <li>Use <b>Expand Mode \u2192 Ignore Size</b> and <b>Stretch Mode \u2192 Keep Aspect Covered</b>. This fills the frame and crops the edges. Choose Keep Aspect Centered if every edge of your illustration must remain visible.</li></ol>
  ${Lt("art-picture","Godot editor \xB7 Select Picture to change the TextureRect image and how it fits its frame.")}
  <h4>2. Add drifting particles</h4><ol>
  <li>In the supplied scene expand <code>SparksAnchor</code> and select <code>Sparks</code>. Starting with a blank scene? Add a Control as the anchor, place it near the upper right, then use Add Child Node to add <code>CPUParticles2D</code> under it.</li>
  <li>Enable <b>Emitting</b>. Try <b>Amount</b> 24 and <b>Lifetime</b> 3 seconds. Set Gravity to (0, 0), Direction to (\u22120.5, \u22121) and Initial Velocity Min/Max to 14 and 28. Negative Y sends particles upward in Godot 2D.</li>
  <li>Change Amount to 8 and watch the corner become quieter. In the Color section, edit the Color Ramp gradient to fade the last stop to zero alpha. Save with Ctrl+S or Command+S.</li></ol>
  ${Lt("art-sparks","Godot editor \xB7 Select Sparks to compare its particle count, lifetime and emission settings.")}
  <h4>3. Place it on this screen</h4><p>${t.place} When building from scratch, drag <code>menu_art.tscn</code> from FileSystem into this parent and name the instance <code>${t.path.split("/").pop()}</code>. For a full-screen menu, select Layout \u2192 Anchors Preset \u2192 Full Rect.</p>
  <p>To give only this screen a different look, open menu_art.tscn, choose Scene \u2192 Save Scene As and save a separate copy. Replace this screen\u2019s art instance with that copy in the same tree position.</p>
  ${Lt("art-"+t.scene,t.title+" \xB7 Run the scene and compare your result with the reference game.")}
  <div class="expected"><b>Check the result</b><p>${t.test}</p></div>
  <details class="trouble"><summary>The image covers the controls or blocks a click.</summary><p>Place the art instance before the controls in the scene tree. On MenuArt, Picture and SparksAnchor, set Mouse \u2192 Filter to Ignore. Darken Picture under Visibility \u2192 Self Modulate if bright art hides the text.</p></details>
  </details>`:""}var r=(e,t,n)=>({meaning:e,usage:t,example:n}),Ue={target:r("The slot number of the pilot that can be hit.","Use the number inside square brackets to look up that pilot\u2019s HP.","hp[target] -= 1"),owner_slot:r("The pilot number stored on a fired pulse.","Use 0 for P1 and 1 for P2. Subtract it from one to find the opponent.","var target := 1 - owner_slot"),positions:r("A list of the two pilots\u2019 positions on the arena floor.","Read slot zero for P1 or slot one for P2. Each entry has two floor coordinates.","positions[0] - positions[1]"),in_range:r("A yes/no answer to the bot\u2019s distance check.","Use this result as a condition. A distance equal to the limit counts as close enough.","var in_range := offset.length() <= bot_range"),bot_range:r("The distance in meters at which the practice bot stops to shoot.","Select Duel and change Bot Range in the Inspector. Compare 2 meters with 7.","offset.length() <= bot_range"),prefix:r("Text placed before an action name to identify its pilot.","Join duel_p1_ or duel_p2_ and the word shoot to read one pilot\u2019s action.",'prefix + "shoot"'),peer:r("The connection object for one running copy of the game.","Create it, start a host or guest connection, then give it to Godot\u2019s multiplayer system.","var peer := ENetMultiplayerPeer.new()"),ENetMultiplayerPeer:r("Godot\u2019s connection type for sending game messages using UDP.","Call new() to create an instance. On that instance call create_server or create_client.","ENetMultiplayerPeer.new()"),create_server:r("Opens a listening host and returns a status code.","Pass the port number and maximum guest count. OK means listening started.","peer.create_server(PORT, 1)"),PORT:r("The number that identifies the duel service on the host computer.","Both copies must use the same number. This project uses UDP 7000.","const PORT := 7000"),create_client:r("Starts a guest connection and returns an immediate status code.","Pass the address first and the port second. Wait for the connection signal to know the host answered.","peer.create_client(host_address, PORT)"),address:r("The text a guest entered into the IP field.","Pass it to join_game. The function trims it before validating it.","var host_address := address.strip_edges()"),strip_edges:r("A String function that removes extra whitespace at the start and end.","Call it with empty parentheses. It returns a cleaned copy and leaves characters inside the address alone.","address.strip_edges()"),is_valid_ip_address:r("A String function that checks the spelling of an IPv4 or IPv6 address.","Call it with no arguments. It returns true for a valid numeric IP even if no computer is listening there.","host_address.is_valid_ip_address()"),multiplayer:r("The networking interface attached to this node.","Use its signals to react when a peer connects or disconnects. The duel sets up its own interface at startup.","multiplayer.connected_to_server.connect(_connected_to_host)"),connected_to_server:r("The signal Godot sends to a guest after it connects to the server.","Connect a function that takes no arguments. Starting a connection and receiving this signal are two separate moments.","multiplayer.connected_to_server.connect(_connected_to_host)"),_connected_to_host:r("The example\u2019s function that starts the guest side of the duel after connection succeeds.","Pass its name to connect without parentheses so Godot can call it later.","multiplayer.connected_to_server.connect(_connected_to_host)"),JOIN_TIMEOUT_MS:r("The maximum waiting time for a connection in milliseconds.","Set it to 8000 for eight seconds. The script compares elapsed time with this constant before returning to the join menu.","const JOIN_TIMEOUT_MS := 8000"),host_address:r("Text telling the guest where to find the host.","Use 127.0.0.1 for two local windows, the host\u2019s LAN IP on one network, or the host\u2019s shared VPN or reachable public IP across the internet.","peer.create_client(host_address, PORT)"),Series:r("The Network node\u2019s child that coordinates match phases.","Select Duel \u2192 Network \u2192 Series to inspect Wins Needed and Arena Path.","$Series.epoch"),epoch:r("A number the host advances on each phase change.","Include it with input so an old shot cannot carry over into a new round.",'return phase == "live" and packet_epoch == epoch'),_receive_input:r("The duel function that accepts a guest\u2019s movement direction and fire choice.","Call it remotely on the host with rpc_id. The host checks the sender before keeping the input.","_receive_input.rpc_id(HOST_ID, direction, fire, $Series.epoch)"),rpc_id:r("Runs a function marked for remote calls on one named peer.","Use the target peer number first, then the arguments expected by the receiving function.","_receive_input.rpc_id(HOST_ID, direction, fire, $Series.epoch)"),HOST_ID:r("The peer number assigned to the network host.","Send input to this constant. Godot reserves peer number 1 for the server.","const HOST_ID := 1"),fire:r("A yes/no value telling the host whether the guest is pressing shoot.","Send it alongside direction. The host applies the shot cooldown and resolves damage.","_receive_input.rpc_id(HOST_ID, direction, fire, $Series.epoch)"),Control:r("The base node type for Godot interface elements.","Place controls under a layout parent. Anchors let a background follow the edges of its parent as the window changes size.",'[node name="MenuArt" type="Control"]'),Texture2D:r("A two-dimensional image resource that Godot can draw.","Import an image into the project and drag it from FileSystem into a TextureRect\u2019s Texture field.",'[ext_resource type="Texture2D" path="res://assets/menu-backdrop.webp" id="1"]'),TextureRect:r("A Control that draws a texture inside a rectangle.","Give it a texture, use Full Rect anchors and choose Keep Aspect Covered to fill a menu with your own image.",'[node name="Picture" type="TextureRect" parent="."]'),texture:r("The image resource that this TextureRect draws.","Drop a PNG or WebP from FileSystem into the Inspector\u2019s Texture field. The scene file links that resource by ID.",'texture = ExtResource("1")'),expand_mode:r("Controls how the texture\u2019s original size contributes to the rectangle\u2019s minimum size.","Choose Ignore Size to let the layout determine the background rectangle. Its saved setting is 1.","expand_mode = 1"),stretch_mode:r("Controls how the image fits inside its rectangle.","Choose Keep Aspect Covered for a full background. Godot preserves proportions and crops the part extending beyond the rectangle.","stretch_mode = 6"),mouse_filter:r("Determines how a Control handles pointer events.","Set decorations to Ignore in the Inspector so they leave clicks for the menu buttons. Godot saves Ignore as 2.","mouse_filter = 2"),self_modulate:r("A color multiplied into this node\u2019s own drawing.","Use it to tint or darken a background for text readability. Its alpha component sets opacity.","self_modulate = Color(0.55, 0.55, 0.67, 1)"),Color:r("A color value with red, green, blue and alpha components.","Supply values from 0 to 1. Set the last number, alpha, to 1 for full opacity or 0 for transparency.","Color(0.55, 0.55, 0.67, 1)"),anchor_right:r("The location of a Control\u2019s right edge as a fraction of its parent\u2019s width, before offsets.","Use 1.0 to anchor to the right side. In the Full Rect preset the four offsets are zero.","anchor_right = 1.0"),anchor_bottom:r("The location of a Control\u2019s bottom edge as a fraction of its parent\u2019s height, before offsets.","Use 1.0 to follow the bottom of the parent when the game window resizes.","anchor_bottom = 1.0"),clip_contents:r("Keeps the drawing of child nodes inside this Control\u2019s rectangle.","Turn it on for a tutorial banner so the picture and drifting sparks stay within its bounds.","clip_contents = true"),CPUParticles2D:r("A node that repeatedly emits small moving 2D particles using the CPU.","Look under the Sparks node\u2019s Inspector for Amount, Lifetime, Direction and Initial Velocity. Run the scene to see the particles drift.",'[node name="Sparks" type="CPUParticles2D" parent="SparksAnchor"]'),emitting:r("Whether the particle node is producing new particles.","Select the emitter and toggle Emitting to compare the animated and still versions.","$SparksAnchor/Sparks.emitting = true"),lifetime:r("How many seconds a particle lives after it appears.","Increase this value to let sparks drift farther before they disappear. The menu sample uses three seconds.","lifetime = 3.0"),preprocess:r("How much particle time is simulated before the effect is first shown.","Set this to the lifetime to start with sparks already visible instead of watching the emitter fill up.","preprocess = 3.0"),color_ramp:r("A gradient that changes a particle\u2019s color and opacity over its lifetime.","Set low alpha at the first and last gradient points so each spark fades in and out.",'color_ramp = SubResource("SparkFade")'),initial_velocity_min:r("The slow end of the particle starting-speed range, in pixels per second.","Change the minimum and maximum together to control how fast the sparks spread.","initial_velocity_min = 14.0"),initial_velocity_max:r("The fast end of the particle starting-speed range, in pixels per second.","Raise this value to allow some sparks to travel faster while retaining slower ones.","initial_velocity_max = 28.0"),function:r("A named set of instructions that can be called when needed.","Define the function with func. To run it, write its name followed by parentheses with any required inputs.",`func doubled(amount: int) -> int:
    return amount * 2

func _ready() -> void:
    print(doubled(3))`),method:r("A function that belongs to an object or class.","Read the expression to the left of the dot to find the object. Then call its method with parentheses. Here the object is a ConfigFile.","config.save(SAVE_PATH)"),parameter:r("An input name in a function definition.","Declare the parameter between parentheses, give it a type if desired and read the name inside the function body.",`func doubled(amount: int) -> int:
    return amount * 2`),argument:r("A value supplied when you call a function.","Match each argument to the corresponding parameter. Here the integer 3 becomes amount inside doubled, which returns 6.","print(doubled(3))"),pass:r("An instruction that does nothing.","Use pass as a temporary function body while building a script. Replace it with the instruction you want to run.",`func shoot() -> void:
    pass`),if:r("Asks a yes-or-no question.","Put a condition after if and end with a colon. Indent the instructions that should run when the answer is true. With hp equal to 2, this prints Active. Inside an expression such as 26 if enabled else 16, the same check chooses which value to use.",`if hp > 0:
    print("Active")`),else:r("Chooses the other path when the if condition is false.","Align else with its if, add a colon and indent the alternative instructions. In an expression, put the two possible values on either side of the condition.",'var pose := "walk" if moving else "idle"'),elif:r("Checks another condition when earlier choices were false.","Place elif after an if block. Godot takes the first branch whose condition is true.",`if hp == 0:
    print("Defeated")
elif hp == 1:
    print("One point left")`),and:r("Combines two checks. Both must be true.","Put and between conditions that must hold at the same time. A shot advances training only during the firing step.",`if step == 1 and child.is_in_group("projectiles"):
    _advance()`),or:r("Combines checks so either one can succeed.","Use or when either condition should lead to the same instruction.",`if player.health == 0 or enemy.health == 0:
    print("Round over")`),not:r("Flips a true-or-false value.","Place not before a flag or condition. This body runs while the shot is still waiting for release.",`if not released:
    print("Preparing shot")`),true:r("The yes value of a Boolean.","Assign true to record that an event happened or to switch an option on.","released = true"),false:r("The no value of a Boolean.","Use false as a starting value for a switch that the player can turn on.","var large_hud := false"),null:r("A value that means there is no object here.","Check for null before using a reference that can be empty.",`if player == null:
    return`),var:r("Creates a named place to keep a value that can change.","Write var, a name and an initial value. Later lines can read the name or assign a new value to it.",`var health: int = 3
health -= 1`),const:r("Gives a fixed value a name.","Assign it once where it is declared. Later instructions can use the name wherever they need that same value.","const MAX_STAMINA := 100.0"),func:r("Defines a named set of instructions called a function.","Write the name, parameters in parentheses and a colon. Indent the body underneath. Call it from another function with an argument, for example doubled(3), to get 6.",`func doubled(amount: int) -> int:
    return amount * 2`),return:r("Ends this call and sends a result back to its caller.","Put the result after return. A function declared void can use return on its own to stop early.",`func hit_damage() -> int:
    return 2`),extends:r("Gives a script the abilities of its parent class or script.","Place extends at the top of the file. A script extending CharacterBody3D can use its velocity and move_and_slide().","extends CharacterBody3D"),super:r("Runs the inherited version of the current method.","Inside an overriding method, pass any arguments the parent expects. The animated player calls its parent movement code before choosing a pose.",`func _physics_process(delta: float) -> void:
    super(delta)`),for:r("Repeats a block once for each item.","Choose a temporary name for one item and put the collection after in. This loop gives hp the values 0, 2 and 1 in order.",`for hp in [0, 2, 1]:
    print(hp)`),in:r("Links a loop item to its collection or tests membership.","In a for line, the name on the left receives each item from the collection on the right.",`for hp in health_values:
    print(hp)`),match:r("Chooses a block by comparing one value with several patterns.","Write match and a value. Indent the possible values, each followed by a colon and its own instructions.",`match step:
    0:
        print("Move")
    1:
        print("Fire")`),signal:r("Declares an event that other code can listen for.","Choose an event name and the information it carries. Connect a listener once, then emit the signal when the event occurs.","signal fired(amount: int)"),"@export":r("Lets you edit a script variable in the Godot Inspector.","Put @export before the variable, attach the script and select the node. Type a new value into its Inspector field.","@export var speed: float = 4.0"),"@export_range":r("Shows an Inspector number field with a range and increment.","Pass the minimum, maximum and step size in that order. Here the slider moves from 0 to 1 in steps of 0.001.","@export_range(0, 1, 0.001) var roll_safe_start: float = 0.2"),"@onready":r("Waits until the node is ready before setting this variable.","Use it when the starting value needs a child node that must already exist in the scene.","@onready var start: Button = $Center/VBox/Start"),":":r("Introduces a type or opens an indented block.","After a variable or parameter name, put its type after the colon. At the end of an if or func line, indent the instructions on the next line.",`var hp: int = 3
if hp > 0:
    print(hp)`),":=":r("Assigns a starting value and asks Godot to infer its type.","Use it in a declaration where Godot can determine the type from the right-hand side. Here 0 makes step an integer.","var step := 0"),"=":r("Stores the value on the right in the name or property on the left.","Use one equals sign to set a value. Reading the name later gives you that stored value.","health = 2"),"==":r("Checks whether two values are equal.","Use this in a condition. The expression produces true or false and leaves both values unchanged.",`if health == 0:
    print("Defeated")`),"!=":r("Checks whether two values are different.","Use it to run an instruction when two values do not match.",`if health != 0:
    print("Still alive")`),">":r("Checks whether the left value is greater than the right.","Use it for thresholds. Exactly zero health makes this check false.",`if hp > 0:
    print("Active")`),"<":r("Checks whether the left value is smaller than the right.","Compare the current balance with a cost. Equal values pass the affordability test because this shortage check is false.",`if stamina < cost:
    return false`),">=":r("Checks whether the left value reaches or exceeds the right.","Use it when the exact threshold should count, such as the frame that releases a shot.",`if elapsed >= attack_release_seconds:
    released = true`),"<=":r("Checks whether the left value is smaller than or equal to the right.","Use it to include zero when deciding whether a character falls.",`if health <= 0:
    print("Defeated")`),"+":r("Adds values together.","Use it with numbers to find a total, or with vectors to combine displacements.","var total := 20 + 40"),"-":r("Subtracts values or gives one value a negative sign.","Subtract damage from health. Subtract two world positions to get a vector from the second position toward the first.","var remaining := 3 - 1"),"*":r("Multiplies two values.","Use it to scale a speed, amount or vector. A speed of 4 for 0.5 seconds covers 2 meters.","var distance := 4.0 * 0.5"),"/":r("Divides one number by another. A slash inside a node or file path separates levels.","For a fractional result, use a float such as 1.0. In $Model/AnimationPlayer the slash leads from Model to its child.","var halfway := 0.5 / 1.0"),"+=":r("Adds to a value and stores the new total in the same name.","Use it for a counter. If step contains 1, this line leaves it holding 2.","step += 1"),"-=":r("Subtracts from a value and stores what remains.","Use it to spend a point or reduce vertical speed as gravity acts.","health -= 1"),"->":r("Introduces the return type of a function.","Place it after the parameter list. int promises a whole-number result. void means the caller receives no result.",`func hit_damage() -> int:
    return 2`),".":r("Gets something that belongs to the value on its left.","Read a chain from left to right. get_tree() first supplies the scene manager, then the dot selects the manager\u2019s change_scene_to_file method.",'get_tree().change_scene_to_file("res://scenes/arena.tscn")'),",":r("Separates inputs or items in a list.","Inside a function call, supply arguments in the order the function expects. Vector3 takes X, then Y, then Z.","Vector3(0, 16, 9)"),"(":r("Opens a function\u2019s input list, a call or a grouped calculation.","In a definition, list the names that will receive values. In a call, give actual values. Empty parentheses call a function that needs no arguments here.","get_tree()"),")":r("Closes the matching opening parenthesis.","Finish the current argument list before chaining another method or starting a block.",'print("Scout speed: ", speed)'),"[":r("Starts a list, index, type parameter or scene entry.","In GDScript [0, 2, 1] builds a list. Array[int] specifies its item type. Use values[0] to read its first item.",`var values: Array[int] = [0, 2, 1]
print(values[0])`),"]":r("Closes the matching square bracket.","Close a list or index after its last item. In a .tscn file, brackets enclose node and resource declarations.","var targets := [0, 2, 1]"),"#":r("Starts a comment that Godot skips.","Place a note after # or put # before an instruction to try running without that line.",`# Show the current value
print(health)`),$:r("Looks up a node by its path from the node running this script.","Put the child name after $. Match capitalization in the Scene dock and use a slash to reach a deeper child.",'$AnimationTree.set("parameters/blend_position", 1.0)'),"&":r("Immediately before quoted text, creates a StringName.","Use this spelling for names Godot looks up repeatedly, such as an animation. Elsewhere the same symbol can be a bitwise operator.",'var clip := &"death"'),'"':r("Marks the beginning or end of literal text.","Put messages, action names and paths between matching quotation marks. Without quotes, Godot looks for an identifier.",'print("Scout speed: ", speed)'),"%":r("Formats placeholders in a string or gives an integer remainder.","After a format string, supply the values for its placeholders. Here %d displays a whole number.",'print("Step %d" % 2)'),int:r("A whole-number type.","Use it for things you count in whole units, such as health points or shots.","var health: int = 3"),float:r("A number type that can hold fractions.","Use it for distances, speeds, seconds and proportions. Include a decimal point in a float literal.","var speed: float = 4.0"),bool:r("A type with two possible values, true and false.","Use it for switches and the results of comparisons.","var moving: bool = speed > 0.0"),void:r("Says that a function performs an action and returns no value.","Write it after the return arrow for callbacks that update the scene or print a message.",`func _ready() -> void:
    print("Ready")`),Array:r("An ordered collection of values.","Put values in square brackets. Add [int] after Array to limit it to integers. Read the first value at index 0.","var health_values: Array[int] = [0, 2, 1]"),StringName:r("A reusable name that Godot can compare efficiently.","Use an ampersand immediately before a quoted animation or state name.",'var state: StringName = &"hit"'),Vector2:r("A pair of numbers named x and y.","Construct it by passing the two components. Here X and Z from the 3D velocity become a pair for measuring horizontal speed.","var floor_speed := Vector2(velocity.x, velocity.z).length()"),Vector3:r("Three numbers named x, y and z, like Blender transform fields.","Construct it with the components in that order. Godot uses Y for height, so this example points along the floor.","var forward := Vector3(0, 0, -1)"),NodePath:r("A route to a node written as names separated by slashes.","Pass path text to its constructor. Two dots go up one parent before the path continues down through named children.",'NodePath("../Model/Hero/AnimationPlayer")'),Node:r("The basic scene-tree item that can run a script and own children.","Extend Node for a logic-only practice scene that needs no position or visible mesh.","extends Node"),Node3D:r("A scene node with a 3D transform.","Use it to parent objects so they can move, turn or scale together.",'[node name="Arena" type="Node3D"]'),StaticBody3D:r("A physics body for stationary surfaces such as the arena floor.","Add a CollisionShape3D child with a shape matching the visible mesh.",'[node name="Floor" type="StaticBody3D" parent="."]'),CharacterBody3D:r("A physics body moved by your own character code.","Set its velocity in physics updates and call move_and_slide() to move against the floor and walls.","extends CharacterBody3D"),Area3D:r("A 3D region that can detect overlaps.","Give it a collision shape and set its mask to the layers it should detect.",'[node name="Projectile" type="Area3D"]'),MeshInstance3D:r("Draws a mesh in the game world.","Select this node and set its Mesh in the Inspector to give it a visible shape.",'[node name="Model" type="MeshInstance3D" parent="."]'),CollisionShape3D:r("Supplies a shape to a physics body or Area3D.","Add it as a child of the body or area, then choose a Shape resource in the Inspector.",'[node name="CollisionShape3D" type="CollisionShape3D" parent="."]'),AnimationTree:r("Controls how animations are selected and blended.","Select the AnimationTree child and set its blend-position parameter from the player script.",'$AnimationTree.set("parameters/blend_position", 1.0)'),AnimationPlayer:r("A node that owns named animation clips and plays them.","Get the player on the model and ask it to play a clip that exists in its library.",'$Model/AnimationPlayer.play("idle")'),PackedScene:r("A saved scene resource that you can turn into a live node tree.","Load the scene, instantiate a copy, then add the result to the running scene.",`var shot = preload("res://scenes/projectile.tscn").instantiate()
add_child(shot)`),Input:r("Godot\u2019s built-in reader for keyboard, controller and other input.","Ask Input about action names from Project Settings \u2192 Input Map.",'Input.get_vector("move_left", "move_right", "move_forward", "move_back")'),ConfigFile:r("A Godot object that reads and writes settings grouped into named sections.","Create it with new(), set a section and key, then call save() with a writable path.",`var config := ConfigFile.new()
config.set_value("display", "large_hud", true)
config.save("user://battle_lab_settings.cfg")`),get_tree:r("A Node method that returns the SceneTree managing the running game.","Call it with empty parentheses from a node that is already in the scene. Use the returned object to switch scenes, restart or look up groups.",'get_tree().change_scene_to_file("res://scenes/arena.tscn")'),change_scene_to_file:r("Asks the SceneTree to replace the current scene with one saved on disk.","Call it on get_tree(). Pass the quoted path to the .tscn you want to open. In a downloaded kit, use the matching res://battle_lab/ path.",'get_tree().change_scene_to_file("res://scenes/arena.tscn")'),reload_current_scene:r("Asks the SceneTree to load the current scene again.","Call it with no arguments when the player requests a restart. New character instances start with their saved scene values.","get_tree().reload_current_scene()"),connect:r("Registers a function to receive a signal later.","On a signal, pass the function name without (). The button will call it on a press. On a node, use the two-argument form with a signal name and a handler.","start.pressed.connect(_start_battle)"),emit:r("Sends a signal to all the functions connected to it.","Call emit on the signal. Supply values that match the parameters in the signal declaration.","fired.emit(1)"),_ready:r("A built-in callback Godot calls when this node and its children are ready.","Define it to connect buttons or read child nodes when the scene starts.",`func _ready() -> void:
    start.pressed.connect(_start_battle)`),_physics_process:r("A callback Godot runs on its fixed physics schedule.","Declare its delta parameter to receive the elapsed time in seconds. Use it when updating movement and checking training steps.",`func _physics_process(delta: float) -> void:
    velocity.y -= gravity * delta
    move_and_slide()`),print:r("Writes values to Godot\u2019s Output panel.","Give it one or more arguments. Quoted text is printed literally, and variable names print their current values.",'print("Scout speed: ", speed)'),get_vector:r("Reads four input actions and returns a Vector2 with length at most one.","Pass negative X, positive X, negative Y, positive Y in that order. A diagonal keyboard input splits the direction across both axes.",'var axes := Input.get_vector("move_left", "move_right", "move_forward", "move_back")'),move_and_slide:r("Moves a CharacterBody3D using its velocity and handles sliding on surfaces.","Call it during the physics update after setting velocity in meters per second. Godot accounts for the physics tick duration.",`velocity.x = direction.x * speed
move_and_slide()`),length:r("For a vector, length() measures its size. On an Animation, length is the clip\u2019s duration in seconds.","Use parentheses when calling the vector method. Read attack.length directly when attack is an Animation resource.",`var gap := offset.length()
var seconds := attack.length`),normalized:r("Returns a copy of a vector with length one when the original has a direction.","Subtract positions to get the offset, then normalize it to use only its direction. A zero vector stays zero.","var direction := offset.normalized()"),set:r("Changes a property using its name or parameter path.","Give the property path first and the new value second. The AnimationTree\u2019s blend space expects a number.",'$AnimationTree.set("parameters/blend_position", 1.0)'),maxi:r("Returns the larger of two integers.","Use zero as one argument to keep health from dropping below zero.","health = maxi(0, health - amount)"),maxf:r("Returns the larger of two floats.","Pass zero and the new balance to keep a fractional stamina value above or at zero.","stamina = maxf(0.0, stamina - cost)"),clampf:r("Keeps a float between a lower and an upper limit.","Pass the value, minimum and maximum. A release time beyond the end of the clip becomes the clip length.","clampf(attack_release_seconds, 0.0, attack.length)"),is_action_pressed:r("Checks whether an input action is pressed.","On an input event, pass the action name to test that event. On Input, the same method name checks the current held state.",`if event.is_action_pressed("restart"):
    get_tree().reload_current_scene()`),is_in_group:r("Checks whether a node belongs to a named group.","Pass the exact group name in quotes. The result is true or false, ready to use in an if condition.",`if child.is_in_group("projectiles"):
    _advance()`),new:r("Constructs a new object of the named class.","Write the class name, a dot and new(). Store the returned object if you want to use it again.","var config := ConfigFile.new()"),set_value:r("Puts one value into a ConfigFile object in memory.","Pass the section, the key and the new value. Call save afterward to keep it across launches.",'config.set_value("display", "large_hud", enabled)'),get_value:r("Reads one setting from a ConfigFile object.","Pass section, key and a default value. Load the file first. A missing key gives you the default.",'var large := bool(config.get_value("display", "large_hud", false))'),save:r("Writes a ConfigFile\u2019s contents to disk.","Pass a writable user:// path. Check the returned error code against OK before showing a success message.",`var error := config.save(SAVE_PATH)
if error == OK:
    print("Saved")`),load:r("On a ConfigFile, reads settings from a file into that object.","Pass the same path used for save. At global scope, Godot also has a separate load(path) function for loading project resources.","config.load(SAVE_PATH)"),seek:r("Moves an AnimationPlayer\u2019s playback position to a time in seconds.","Pass the time first and true second to update the displayed pose immediately.","clips.seek(elapsed, true)"),preload:r("Loads a resource from a fixed path when the script is loaded.","Give it a quoted project path. Store the result and reuse it when spawning projectiles.",'const SHOT := preload("res://scenes/projectile.tscn")'),instantiate:r("Creates a new node tree from a PackedScene.","Call instantiate() on the saved resource. Add the returned node to the scene tree so it can run.",`var shot := SHOT.instantiate()
add_child(shot)`),add_child:r("Attaches a node beneath another node in the tree.","Pass the node you already created. A live parent brings that child into the running game.",`var shot := SHOT.instantiate()
add_child(shot)`),grab_focus:r("Moves keyboard or controller focus to a Control.","Call this on the first usable button when the menu opens. Enter can then activate it.","start.grab_focus()"),add_theme_font_size_override:r("Overrides a named font size on one Control.","Give the theme property name and the desired pixel size.",'$Center/VBox/Preview.add_theme_font_size_override("font_size", 26)'),pressed:r("A button signal sent when the button is activated.","Connect the signal to the handler you want the button to run.","start.pressed.connect(_start_battle)"),toggled:r("A toggle-button signal carrying the new on-or-off value.","Connect a function with one Boolean parameter to receive the new state.","toggle.toggled.connect(_save_size)"),button_pressed:r("The on-or-off state stored by a toggle button.","Assign true to show it as on or read the property to get its current value.","toggle.button_pressed = true"),_start_battle:r("The project\u2019s function for leaving the lobby and entering combat.","Pass its name to connect() to schedule it for a click. Add () only when you want to run it immediately.","start.pressed.connect(_start_battle)"),_on_fired:r("The practice script\u2019s listener for the fired signal.","Define it with one integer parameter matching the emitted argument.",`func _on_fired(amount: int) -> void:
    print("Shots fired: ", amount)`),shoot:r("The practice script\u2019s function for announcing a shot.","Call shoot() in the reference scene. The browser exercise has a version with an amount parameter supplied by its runner.",`func shoot() -> void:
    fired.emit(1)`),_spend_stamina:r("A player helper that checks a cost, pays it when affordable and returns whether it succeeded.","Pass the cost of the requested action. Put the call inside if so the action starts only after payment.",`if _spend_stamina(roll_stamina_cost):
    _start_roll()`),_weapon_reaches_player:r("An enemy helper that tests the blade against the player at contact time.","Call it at the contact instant. A true result lets the enemy request damage.",`if _weapon_reaches_player():
    player.take_damage(1)`),take_damage:r("The character\u2019s method for receiving damage.","Call it on the character that was hit. Pass the hit\u2019s damage as a number.","player.take_damage(1)"),_health_changed:r("The reaction controller\u2019s handler for a health update.","Register it with the actor\u2019s health_changed signal. Its parameter receives the updated HP.",'actor.connect("health_changed", _health_changed)'),_advance:r("The tutorial\u2019s helper for moving to the next instruction.","Call it when the current goal succeeds. It increments the step and refreshes the prompt.","_advance()"),_save_size:r("The settings script\u2019s handler for a Large HUD change.","Connect it to toggled. The CheckButton supplies the new Boolean value.","toggle.toggled.connect(_save_size)"),hit_damage:r("The combat exercise\u2019s function for calculating damage per hit.","Return an integer from its body. The preview subtracts that many points for each landed shot.",`func hit_damage() -> int:
    return 2`),horizontal_velocity:r("The movement exercise\u2019s function for computing sideways speed.","Multiply the incoming X direction by the movement speed, then return the result.",`func horizontal_velocity(direction_x: float) -> float:
    return direction_x * 4.0`),report_targets:r("The loop exercise\u2019s function for inspecting a list of target health values.","Accept an Array[int], loop through it and print the result for each item.",`func report_targets(health_values: Array[int]) -> void:
    for hp in health_values:
        print(hp)`),"res://":r("A path starting at the folder that contains project.godot.","Use this prefix for assets shipped with the game. Match every folder and file name.",'get_tree().change_scene_to_file("res://scenes/arena.tscn")'),"user://":r("A writable data folder Godot chooses for this game and user.","Use it for saved settings. Open Project \u2192 Open User Data Folder in Godot to inspect the file.",'const SAVE_PATH := "user://battle_lab_settings.cfg"'),node:r("In a saved .tscn file, this starts one entry in the scene tree.","Read name for its label, type for its class and parent for its location. Godot writes these entries when you save the scene.",'[node name="Floor" type="StaticBody3D" parent="."]'),name:r("The label of a node in the scene tree.","Scripts that use a path such as $Player rely on the node having this exact name.",'[node name="Player" type="CharacterBody3D"]'),type:r("The kind of node or resource Godot should create.","Read the quoted class name. A Node3D holds a transform and a Button handles interaction.",'[node name="Arena" type="Node3D"]'),parent:r("Identifies the node that owns this place in the scene hierarchy.",'In a .tscn node entry, parent="." places this node directly beneath the scene root.','[node name="Model" type="Node3D" parent="."]'),ext_resource:r("Declares a separate project resource used by this scene.","Find the path and id in the entry. Another line can reference the same resource using ExtResource and that id.",'[ext_resource type="PackedScene" path="res://scenes/player.tscn" id="2"]'),ExtResource:r("Refers to an external resource declared in this scene file.","Read the quoted ID, then match it with the id on an ext_resource entry to find its project path.",'[node name="Player" parent="." instance=ExtResource("2")]'),SubResource:r("Refers to a resource stored inside this same scene file.","Match the quoted ID with a sub_resource declaration to see its values. Here the shape belongs to the floor.",'shape = SubResource("TileShape")'),path:r("The resource\u2019s address inside the project.","Find the path field in an ext_resource entry or locate the same file in Godot\u2019s FileSystem dock.",'path="res://scenes/player.tscn"'),id:r("A short identifier that connects one scene-file entry to another.","Find the same ID in ExtResource or SubResource to see which resource a property uses.",'id="2"'),instance:r("Identifies a saved scene placed inside this scene.","Use the resource ID to find the source scene. In the editor, dragging player.tscn onto Arena creates this relationship.",'[node name="Player" parent="." instance=ExtResource("2")]'),groups:r("Names the groups a node belongs to.","Add a group in the Node dock. Running code can then find all marked nodes or check one node\u2019s membership.",'groups=["projectiles"]'),position:r("A node\u2019s location relative to its parent.","For a Node3D, set a Vector3 in meters. A negative Y places the floor\u2019s center below the origin.","position = Vector3(0, -0.25, 0)"),global_position:r("A node\u2019s position measured in world coordinates.","Use it to compare two characters that might have different parents. Subtract your own world position to point toward the other character.","var offset := player.global_position - global_position"),rotation_degrees:r("A Node3D\u2019s rotation relative to its parent, expressed in degrees.","Read the X, Y and Z angles in order. The arena camera uses a negative X rotation to look downward.","rotation_degrees = Vector3(-60.64, 0, 0)"),size:r("For the arena\u2019s box mesh or box collision shape, the full width, height and depth.","Set the same three measurements on both boxes to align the visible floor and its collision surface.","size = Vector3(18, 0.5, 14)"),shape:r("The resource describing the space a collision node occupies.","Assign a Shape3D to CollisionShape3D\u2019s Shape in the Inspector. The saved scene records that resource reference.",'shape = SubResource("TileShape")'),collision_layer:r("The physics layers this object belongs to.","Tick its own category in the Inspector. Values are bit flags, so the second checkbox has the saved value 2.","collision_layer = 2"),collision_mask:r("The physics layers this object checks for.","Tick the category of the target. A projectile looking for layer 3 uses the saved mask value 4.","collision_mask = 4"),source_file:r("The original asset that Godot imports.","Read its path in the .import file. Replace the GLB at that path to update the imported asset.",'source_file="res://assets/scout.glb"'),"nodes/root_scale":r("The scale multiplier used by Godot\u2019s 3D importer for the imported root.","Read or adjust the import setting in the Import dock. At 1.0 the importer preserves the authored scale factor.","nodes/root_scale=1.0"),"animation/import":r("The import option that includes animations from the source model.","Enable it for a GLB with animation clips and reimport the asset.","animation/import=true"),anim_player:r("The AnimationTree property pointing to its AnimationPlayer.","Select the AnimationTree and choose the player containing the clips. The path begins at the tree node.",'anim_player = NodePath("../Model/Hero/AnimationPlayer")'),root_node:r("The animation mixer\u2019s starting node for resolving track paths.","Match the path to the root that the imported clips animate. This project points to the custom Hero.",'root_node = NodePath("../Model/Hero")'),"parameters/blend_position":r("The value selecting a point on this one-dimensional animation blend space.","Pass this property path to AnimationTree.set(). In the course graph, 0 selects idle and 1 selects walk.",'$AnimationTree.set("parameters/blend_position", 1.0)'),velocity:r("A CharacterBody3D\u2019s current movement speed and direction in meters per second.","Set horizontal components from input, update the vertical component for gravity, then move the body.","velocity.x = direction.x * speed"),x:r("The first component of a vector. In Godot\u2019s 3D arena it measures the X axis.","Use a dot to read or set one component. Positive X points to the right in this arena view.","velocity.x = direction.x * speed"),y:r("The second component of a vector. In 3D, positive Y points up.","For a Vector2 input, y is its second on-screen direction. In this movement script it becomes Z on the 3D floor.","var direction := Vector3(axes.x, 0, axes.y)"),z:r("The third component of a 3D vector, along the depth axis.","Set velocity.z for forward and backward movement. Negative Z is the scout\u2019s initial forward direction.","velocity.z = direction.z * speed"),FORWARD:r("A built-in Vector3 direction pointing down the negative Z axis.","Use it as a starting direction before the character receives any movement input.","var facing := Vector3.FORWARD"),delta:r("The time, in seconds, since the previous update.","Multiply a per-second change by delta to apply one update\u2019s share. With 20 points per second, 0.1 seconds earns 2 points.","var earned := 20.0 * delta"),speed:r("The movement rate chosen for this scout.","Change the exported Speed field in the Inspector or the number in the movement exercise. Holding one direction uses the full speed.","@export var speed: float = 4.0"),axes:r("The two-number input direction read from the four movement actions.","Read axes.x and axes.y, then map them onto X and Z to move across the 3D floor.","var direction := Vector3(axes.x, 0, axes.y)"),direction:r("A vector pointing where movement should go. On CPUParticles2D it sets the emitter\u2019s base direction in 2D.","Multiply a unit direction by speed to control distance without changing the heading.","velocity.x = direction.x * speed"),direction_x:r("The horizontal direction passed to the browser movement function.","Multiply by your chosen speed. A value of 1 gives full speed to the right and 0 gives no sideways movement.","return direction_x * speed"),facing:r("The player\u2019s remembered heading. In the duel, facing stores a heading for each pilot.","Start it with Vector3.FORWARD and update it from movement. Firing can reuse the last heading after the keys are released.","var facing := Vector3.FORWARD"),moving:r("A true-or-false result indicating horizontal motion.","Check the length of the horizontal velocity and use this flag to choose idle or walk.","var moving := Vector2(velocity.x, velocity.z).length() > 0.01"),gravity:r("In the character script, this number sets downward acceleration. On CPUParticles2D, Gravity is a Vector2 acceleration for the sparks.","Subtract gravity times delta from vertical velocity while airborne.","velocity.y -= gravity * delta"),health:r("The number of hit points remaining on this character.","Subtract incoming damage and keep the result at or above zero.","health = maxi(0, health - amount)"),health_values:r("The collection of practice targets\u2019 hit-point values.","Put one integer in the list per target, then visit them with a for loop.","var health_values: Array[int] = [0, 2, 1]"),hp:r("A short name for hit points. In the practice loop it holds one target\u2019s value. In the duel it is a list with one entry per pilot.","Use hp in the practice loop. In duel.gd, use hp[0] for P1 or hp[1] for P2.",`for hp in health_values:
    print(hp > 0)`),amount:r("A quantity. As a function parameter it receives a value from the caller. On a particle emitter, Amount controls how many particles it emits in an emission cycle.","Check the function or signal declaration to see what the quantity measures. The damage receiver subtracts it from health.",`func _on_fired(amount: int) -> void:
    print(amount)`),fired:r("The practice script\u2019s signal announcing a shot count.","Declare fired with an integer amount, connect a listener and emit it with the count to deliver.","fired.emit(1)"),health_changed:r("A signal announcing a character\u2019s updated health.","After changing HP, emit the remaining number so the HUD and reactions can use it.","health_changed.emit(health)"),player:r("A reference to the player node in this scene or script.","Use a dot to access the player\u2019s properties and methods. The tutorial finds its Player child once.","@onready var player = $Player"),enemy:r("A reference to the opponent in this arena.","Read its health to decide whether the round is over.",`if enemy.health == 0:
    print("VICTORY")`),actor:r("The character that this reaction controller observes.","Connect to that character\u2019s signal so the same controller can animate either the scout or the sentinel.",'actor.connect("health_changed", _health_changed)'),offset:r("The displacement from the enemy to the player.","Subtract world positions in this order to get both the direction and gap to the target.","var offset := player.global_position - global_position"),result:r("The text chosen for the end-of-round message.","Select a message based on enemy health, then display it in the HUD.",'var result := "VICTORY" if enemy.health == 0 else "DEFEAT"'),finished:r("A flag recording that the round has ended.","Combine it with the restart input check so R restarts after a win or loss.",`if finished and event.is_action_pressed("restart"):
    get_tree().reload_current_scene()`),event:r("The input event passed to an input callback.","Ask the event whether it represents the restart action. Its argument name comes from the callback declaration.",`if event.is_action_pressed("restart"):
    print("Restart pressed")`),SHOT:r("The projectile scene resource stored for repeated use.","Preload the scene once and instantiate it each time the player releases a projectile.","var shot := SHOT.instantiate()"),shot:r("One newly created projectile node.","Add this instance to the arena, then give it a starting position and direction.","get_parent().add_child(shot)"),spent:r("A projectile flag recording that its one hit has already been used.","Return early when spent is true so one pulse cannot damage the target twice.",`if spent:
    return`),attack_release_seconds:r("The time from the start of the attack clip to projectile release.","Choose the time corresponding to the extended-hand pose. At 24 fps, eight frame intervals take one third of a second.","@export var attack_release_seconds: float = 1.0 / 3.0"),released:r("A flag recording whether this attack has already fired its pulse.","Set it when the animation reaches release so later ticks skip the same shot.","released = true"),elapsed:r("The time already played, in seconds, for the current action.","Compare it with the chosen release time or use it to seek to an animation pose.","clips.seek(elapsed, true)"),attack:r("In the release-timing excerpt, the Animation resource for the attack clip.","Read its length property to keep release time within the clip\u2019s duration.","var latest_release := attack.length"),clips:r("The AnimationPlayer used by the reaction controller.","Use it to apply a pose from the currently selected hit or death clip.","clips.seek(elapsed, true)"),state:r("The reaction controller\u2019s name for the current response.","Choose the death name at zero health and the hit name while health remains.",'state = &"death" if value <= 0 else &"hit"'),value:r("The argument supplied to the health-change handler in the reaction code.","Compare this remaining HP against zero before choosing a clip.",`if value <= 0:
    print("Play the fall")`),attack_contact_fraction:r("The fraction of an enemy attack clip at which the blade can hit.","Multiply it by the clip duration to convert from a fraction to seconds.","var contact_time := attack_contact_fraction * attack_duration"),attack_duration:r("The full length of one enemy swing, measured in seconds.","Use it with the contact fraction. A 1-second swing at a 0.5 fraction checks for contact at 0.5 seconds.","var contact_time := attack_contact_fraction * attack_duration"),contact_time:r("The instant, in seconds from attack start, when the blade is checked.","Calculate it from the configured contact fraction and attack duration.","var contact_time := attack_contact_fraction * attack_duration"),contact_checked:r("A flag recording that the current swing already tested for a hit.","Set it when you check contact, including on a miss. Reset it for the next swing.","contact_checked = true"),roll_elapsed:r("The time already spent performing this roll.","Divide it by the total duration to locate the player within the roll animation.","var fraction := roll_elapsed / roll_duration"),roll_duration:r("The total length of the current roll in seconds.","Use it to convert the elapsed time into a fraction from start to finish.","var fraction := roll_elapsed / roll_duration"),fraction:r("A progress value where zero is the start and one is the end.","Compare this value against the safe start and end points to tell whether the roll protects the player.","var fraction := roll_elapsed / roll_duration"),roll_safe_start:r("The first protected point within the roll, expressed as a fraction.","For a clip spanning 18 frame intervals, 4/18 starts protection at frame 5 when frame 1 is the beginning.","var roll_safe_start := 4.0 / 18.0"),roll_safe_end:r("The point within the roll where protection ends.","For the sample clip, 12/18 corresponds to frame 13. Protection ends as this frame begins.","var roll_safe_end := 12.0 / 18.0"),rolling:r("A flag that is true while the player controller performs a roll.","Read player.rolling in the tutorial to check that the requested roll actually started.",`if player.rolling:
    _advance()`),MAX_STAMINA:r("The fixed upper limit of the player\u2019s stamina pool.","Use the same limit for a fresh round and for capping recovery.","const MAX_STAMINA := 100.0"),stamina:r("The number of points currently available for attacking or rolling.","Compare it with the requested cost before subtracting the price.","stamina = maxf(0.0, stamina - cost)"),stamina_changed:r("A signal carrying the new shared stamina balance.","Emit it after the stored balance changes so the HUD can redraw the gauge.","stamina_changed.emit(stamina)"),stamina_wait:r("The time left before stamina can regenerate.","Assign 1.0 to start a one-second rest before recovery begins.","stamina_wait = 1.0"),cost:r("The price of the action passed to the stamina helper.","Check whether the current balance covers this quantity before spending it.",`if stamina < cost:
    return false`),roll_stamina_cost:r("The player setting for the price of one accepted roll.","Pass it to _spend_stamina before starting the roll.",`if _spend_stamina(roll_stamina_cost):
    _start_roll()`),attack_stamina_cost:r("The player setting for the price of one accepted attack.","Pass it to the same payment function used by rolling. A cost of 20 leaves 80 points after one shot from a full bar.",`if _spend_stamina(attack_stamina_cost):
    print("Attack paid")`),stamina_regen_per_second:r("The number of points recovered in a full second once recovery begins.","Multiply by the update duration to calculate how much to restore now.","var earned := stamina_regen_per_second * delta"),shot_cost:r("The attack price you choose in the browser tuning exercise.","Edit its numeric value and return it so the preview can charge that price for one shot.",`var shot_cost: float = 20.0
return shot_cost`),roll_cost:r("The roll price you choose in the browser tuning exercise.","Return it from the tuning function and run the drill to see how many rolls the gauge can fund.",`var roll_cost: float = 40.0
return roll_cost`),points_per_second:r("The recovery rate you choose in the browser stamina exercise.","Return this number to set how quickly stamina fills after the rest period.",`var points_per_second: float = 20.0
return points_per_second`),attack_power:r("The whole number of HP one landed shot removes in the combat exercise.","Return this value, run the exercise and count how many hits bring a 3-HP target to zero.",`var attack_power: int = 2
return attack_power`),start:r("The lobby script\u2019s name for its Start battle button.","Use the reference to connect the button or give it initial keyboard focus.","start.pressed.connect(_start_battle)"),step:r("The tutorial\u2019s counter for the current instruction, starting at zero.","Compare it with the stage you are checking. Increase it when the requested action succeeds.","step += 1"),walked:r("The distance accumulated during ordinary walking in the tutorial.","Compare it with 0.25 meters to decide when to show the firing prompt.",`if walked > 0.25:
    _advance()`),child:r("Here, the new node supplied to the child_entered_tree callback.","Inspect it when it enters the training scene to see whether a real projectile was created.",`if child.is_in_group("projectiles"):
    print("A pulse entered")`),SAVE_PATH:r("The fixed file address used by the settings script.","Pass the same path to load and save so the next run finds the player\u2019s previous choice.",'const SAVE_PATH := "user://battle_lab_settings.cfg"'),config:r("The settings script\u2019s ConfigFile object held in memory.","Use its methods to load the file, read or change values, and save your changes to disk.",'config.set_value("display", "large_hud", true)'),toggle:r("The settings script\u2019s reference to the Large HUD CheckButton.","Read or set button_pressed to match the saved choice and listen for toggled to detect a new choice.","toggle.button_pressed = true"),enabled:r("The Boolean argument sent by the Large HUD toggle.","Save this argument in the display section when the switch changes.",'config.set_value("display", "large_hud", enabled)'),error:r("The return code from an operation such as saving a file.","Compare this value with Godot\u2019s OK constant. Show the success message only if the operation succeeded.",`var error := config.save(SAVE_PATH)
if error == OK:
    print("Saved")`),OK:r("Godot\u2019s success value for operations that return an error code.","Compare the return value from ConfigFile.save() with OK to check whether the write succeeded.",`if config.save(SAVE_PATH) == OK:
    print("Saved")`)};var xo=/#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|nodes\/root_scale\b|animation\/import\b|@[a-zA-Z_]\w*|[a-zA-Z_]\w*|\d+(?:\.\d+)?|:=|->|==|!=|<=|>=|\+=|-=|\*=|\/=|[^\s]/g;function ca(e,t){return`<button type="button" class="code-word" data-word="${b(e)}" aria-haspopup="dialog" aria-label="Explain ${b(e)}">${b(t)}</button>`}function Te(e,t=!1){let n="",o=0;for(let a of e.matchAll(xo)){let s=a[0];n+=b(e.slice(o,a.index));let i=s;if(/^["']/.test(s)){let c=s.slice(1,-1);c.startsWith("res://")?i="res://":c.startsWith("user://")?i="user://":i=t||c==="parameters/blend_position"?c:""}t&&!/[A-Za-z]/.test(i)&&(i=""),n+=Object.hasOwn(Ue,i)?ca(i,s):b(s),o=a.index+s.length}return n+b(e.slice(o))}function da(){return'<section class="panel word-library"><h2>Code word reference</h2><label for="find-word">Find a keyword, function or symbol</label><input id="find-word" type="search" placeholder="Try if, get_tree or ==" autocomplete="off"><div data-word-results></div></section>'}function jt(e,t){let n=Object.keys(Ue),o=t.trim().toLowerCase().replace(/^(\w+)\(\)$/,"$1"),a=o?n.filter(s=>s.toLowerCase().includes(o)).sort((s,i)=>+(i.toLowerCase()===o)-+(s.toLowerCase()===o)):["if","func","get_tree","change_scene_to_file","connect","return"];e.innerHTML=a.length?a.map(s=>ca(s,s)).join(" "):"<p>No matching term. Try a shorter name.</p>"}function ha(e){if(!Object.hasOwn(Ue,e))return;let{meaning:t,usage:n,example:o}=Ue[e],a=document.querySelector("#word-dialog");a.innerHTML=`<form method="dialog"><button class="secondary">Close</button></form><div><h2 id="word-title"><code>${b(e)}</code></h2><p>${b(t)}</p><h3>How to use it</h3><p>${b(n)}</p><pre><code>${b(o)}</code></pre></div>`,a.showModal()}var We="godot-battle-lab.v1";function Gt(){return{version:1,last:null,active:{},responses:{},completed:[]}}function qe(e,t){let n=Gt();try{let o=JSON.parse(e);if(o?.version!==1)return n;for(let a of t){let s=a.id,i=[...a.steps.map(l=>l.id),"quiz"];o.last===s&&(n.last=s),i.includes(o.active?.[s])&&(n.active[s]=o.active[s]);let c={};for(let l of i){let h=o.responses?.[s]?.[l];(l==="quiz"?Number.isInteger(h)&&h>=0&&h<a.options.length:h===!0)&&(c[l]=h)}n.responses[s]=c,Array.isArray(o.completed)&&o.completed.includes(s)&&pt(a,c)&&n.completed.push(s)}}catch{}return n}function pt(e,t={}){return e.steps.every(n=>t[n.id]===!0)&&t.quiz===e.answer}var Ht=()=>({version:1,fields:{},completed:[]});function Nt(e,t,n,o){let a=(s,i)=>{e.fields[s]?.[1]!==i&&(e.fields[s]=[o,i])};t.last&&a("last",t.last);for(let[s,i]of Object.entries(t.active))a("step/"+s,i);for(let[s,i]of Object.entries(t.responses))for(let[c,l]of Object.entries(i))a("answer/"+s+"/"+c,l);for(let[s,i]of Object.entries(n))a("code/"+s,i);return e.completed=[...new Set([...e.completed,...t.completed])].sort(),e}function zt(e,t){let n={...e.fields};for(let[o,a]of Object.entries(t.fields)){if(!Array.isArray(a)||!Number.isFinite(a[0])||!Object.hasOwn(t.fields,o)||o==="__proto__")continue;let s=n[o];(!s||s[0]<a[0]||s[0]===a[0]&&JSON.stringify(s[1])<JSON.stringify(a[1]))&&(n[o]=a)}return{version:1,fields:n,completed:[...new Set([...e.completed,...t.completed])].sort()}}function pa(e,t,n){let o=i=>e.fields[i]?.[1],a={version:1,last:o("last"),active:{},responses:{},completed:e.completed};for(let i of t){a.active[i.id]=o("step/"+i.id);let c={};for(let l of i.steps)o("answer/"+i.id+"/"+l.id)===!0&&(c[l.id]=!0);c.quiz=e.completed.includes(i.id)?i.answer:o("answer/"+i.id+"/quiz"),a.responses[i.id]=c}let s={};for(let i of n){let c=o("code/"+i);typeof c=="string"&&c.length<=12e3&&(s[i]=c)}return{state:qe(JSON.stringify(a),t),drafts:s}}var Ve=class extends Error{constructor(t,n){super(n),this.line=t}},N=(e,t)=>{throw new Ve(e,t)},Ut={or:1,and:2,"==":3,"!=":3,"<":3,">":3,"<=":3,">=":3,"+":4,"-":4,"*":5};function fa(e,t){let n=/\s+|#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\d+(?:\.\d+)?|[A-Za-z_]\w*|==|!=|<=|>=|:=|\+=|-=|[.:=+*(),<>\-]/gy,o=[];for(let a=0;a<e.length;){n.lastIndex=a;let s=n.exec(e);s||N(t,/["']/.test(e[a])?"This text is missing its closing quotation mark. Use matching quotes at both ends.":"The practice runner cannot read \u201C"+e[a]+"\u201D here. Check the supported syntax below the editor."),a=n.lastIndex,/^\s|^#/.test(s[0])||o.push(s[0])}return o}var Wt=e=>/^[a-zA-Z_]\w*$/.test(e||"")&&!["true","false","and","or","not","if","else","for","in","var","pass"].includes(e);function ga(e,t){let n=0,o=()=>e[n++],a=()=>e[n];function s(u,d){o()!==u&&N(t,d)}function i(){let u=o();return Wt(u)||N(t,"Give this value a name, such as health. Start with a letter or underscore."),u}function c(u=0){let d=o(),f;for(d==="("?(f=c(),s(")","Close the group with a matching ).")):["-","+","not"].includes(d)?f={op:"unary",t:d,a:c(d==="not"?3:6)}:d!==void 0&&/^\d/.test(d)?f={op:"literal",v:Number(d),kind:d.includes(".")?"float":"int"}:d&&/^["']/.test(d)?f={op:"literal",v:d.slice(1,-1).replace(/\\([ntr"'\\])/g,(S,g)=>({n:`
`,t:"	",r:"\r"})[g]??g),kind:"String"}:d==="true"||d==="false"?f={op:"literal",v:d==="true",kind:"bool"}:Wt(d)?f={op:"read",name:d}:N(t,"An expression needs a value here. Try a number, quoted text, or a variable you have already defined.");Object.hasOwn(Ut,a())&&Ut[a()]>=u;){let S=o();f={op:"binary",t:S,a:f,b:c(Ut[S]+1)}}return f}let l=o(),h;if(l==="if"||l==="else"||l==="for")h={op:l,children:[]},l==="if"&&(h.expr=c(),a()==="="&&N(t,"A single = stores a value. To ask whether two values are equal inside if, write ==.")),l==="for"&&(h.name=i(),s("in","A loop reads \u201Cfor hp in health_values:\u201D. Put in between the name and the list."),h.expr=c()),s(":","End this block header with a colon (:), then indent the instructions it controls.");else if(l==="var"){h={op:"var",name:i()},a()===":"&&(o(),h.type=i(),["int","float","String","bool"].includes(h.type)||N(t,"Use int for whole numbers, float for decimals, String for text, or bool for true/false."));let u=o();["=",":="].includes(u)||N(t,"Give the variable a starting value with =, such as var health = 3."),h.expr=c(),h.infer=u===":="}else if(l==="return")h={op:"return",expr:c()};else if(l==="pass")h={op:"pass"};else if(l==="print"||l==="fired"){if(h={op:l,args:[]},l==="fired"&&(s(".","Use fired.emit(amount) to send the signal."),s("emit","Use emit to announce this signal to its listener.")),s("(","Put the values for this call inside parentheses, for example print(health)."),a()!==")")for(h.args.push(c());a()===",";)o(),h.args.push(c());s(")","Close this call with ). Separate multiple values with a comma.")}else Wt(l)&&["=","+=","-="].includes(a())?h={op:"set",name:l,operator:o(),expr:c()}:N(t,"This function-body runner understands var, assignments, print(), fired.emit(), for, if/else and pass. Enter only the indented body shown by the prompt.");return n<e.length&&N(t,"Unexpected \u201C"+a()+"\u201D. Check for an extra word, missing operator, or a second instruction on this line."),{...h,line:t}}function To(e){let t=[{indent:0,nodes:[]}],n=null,o;for(let[a,s]of e.split(/\r?\n/).entries()){let i=a+1,c=s.match(/^\s*/)[0],l=fa(s.slice(c.length),i);if(!l.length)continue;let h=c.replace(/\t/g,"    ").length,u=c.includes("	")?"tabs":"spaces";h&&(c.includes(" ")&&c.includes("	")||o&&u!==o)&&N(i,"Use the same indentation throughout. Four spaces per level works well."),h&&(o=u);let d=t.at(-1);if(n?.children)h<=d.indent&&N(i,"Line "+n.line+" opens a block. Indent this instruction underneath it, or add an indented pass."),d={indent:h,nodes:n.children},t.push(d);else{for(;t.length>1&&h<d.indent;)t.pop(),d=t.at(-1);h!==d.indent&&N(i,"This line starts at a different depth. Align it with its neighbors, or indent one level beneath an if, else, or for.")}let f=ga(l,i);f.op==="else"&&d.nodes.at(-1)?.op!=="if"&&N(i,"Align else: with the if: that chooses between the two paths."),d.nodes.push(f),n=f}return n?.children&&N(n.line,"This block is empty. Add an indented instruction beneath its colon."),t[0].nodes}function ua(e,t,n,o){return["==","!="].includes(e)?e==="=="?t===n:t!==n:e==="+"&&typeof t=="string"&&typeof n=="string"?t+n:((typeof t!="number"||typeof n!="number")&&N(o,'This operator needs numbers. Quoted digits are text. Use print("HP: ", hp) to display text beside a number.'),{"+":()=>t+n,"-":()=>t-n,"*":()=>t*n,"<":()=>t<n,"<=":()=>t<=n,">":()=>t>n,">=":()=>t>=n}[e]())}function ma(e,t,n,o=!1){let a={},s=[],i=[],c=[],l=2e3,u=[new Map(Object.entries(t).map(([y,w])=>[y,{v:w}]))],d=[];function f(y,w){for(let p=u.length-1;p>=0;p--)if(u[p].has(y))return u[p].get(y);N(w,"\u201C"+y+"\u201D has no value here. Check its spelling and capitals, or declare it with var before using it.")}function S(y,w){if(y.op==="literal")return y.v;if(y.op==="read")return f(y.name,w).v;let p=S(y.a,w);if(y.op==="unary")return y.t==="not"?!p:(typeof p!="number"&&N(w,"A plus or minus sign here needs a number."),y.t==="-"?-p:p);if(y.t==="and")return!!(p&&S(y.b,w));if(y.t==="or")return!!(p||S(y.b,w));let m=ua(y.t,p,S(y.b,w),w);return typeof m=="string"&&m.length>4e3&&N(w,"This text became too long for a practice run. Try a shorter message."),m}function g(y,w,p){let m={int:Number.isInteger,float:k=>typeof k=="number",String:k=>typeof k=="string",bool:k=>typeof k=="boolean"};y.type&&!m[y.type](w)&&N(p,"This variable expects "+y.type+". "+{int:"Use a whole number, such as 3.",float:"Use a number, such as 4.5.",String:"Put text inside matching quotes.",bool:"Use true or false."}[y.type]),y.v=w}function x(y,w){u.push(w);let p;for(let m of y){let k=m.line;if(--l<0&&N(k,"This run took too many steps. Check whether a loop was placed inside another loop."),c.push(k),m.op==="return")throw o||N(k,"This practice function returns void. Use print() to display a value."),a.value=S(m.expr,k),a.line=k,a;if(m.op==="if"&&(p=!!S(m.expr,k),p&&(d.push({line:k,condition:p}),x(m.children,new Map),d.pop())),m.op==="else"&&!p&&(d.push({line:k,condition:"else"}),x(m.children,new Map),d.pop()),m.op==="for"){let v=S(m.expr,k);Array.isArray(v)||N(k,"This loop needs the list health_values. Each turn gives hp one value from that list.");for(let T of v)x(m.children,new Map([[m.name,{v:T}]]))}if(m.op==="var"){w.has(m.name)&&N(k,"\u201C"+m.name+"\u201D already exists here. Remove var to change its value.");let v=S(m.expr,k),C={type:m.type||(m.infer?m.expr.kind||{number:Number.isInteger(v)?"int":"float",string:"String",boolean:"bool"}[typeof v]:null)};g(C,v,k),w.set(m.name,C)}if(m.op==="set"){let v=f(m.name,k),T=S(m.expr,k);g(v,m.operator==="="?T:ua(m.operator[0],v.v,T,k),k)}if(m.op==="print"||m.op==="fired"){let v=m.args.map(T=>S(T,k));m.op==="fired"?(n||N(k,"This exercise has no fired signal. Use print() to display your result."),(v.length!==1||!Number.isInteger(v[0]))&&N(k,"fired expects one whole-number argument. Put the amount between the parentheses."),i.push({line:k,v:v[0]}),s.push({line:k,text:"Shots fired: "+v[0]})):s.push({line:k,text:v.join(""),decision:d.at(-1)})}}u.pop()}try{return x(e,new Map),{output:s,events:i,visits:c}}catch(y){if(y===a)return{output:s,events:i,visits:c,returned:a};throw y.output=s,y}}var _e={"pvp-ready-room":{title:"Gate the arena on both pilots",signature:"func check_ready(p1_ready: bool, p2_ready: bool) -> void:",prompt:'Print "Load" only when both pilots have accepted. Print "Wait" for every other combination.',starter:`if p1_ready:
    print("Load")
else:
    print("Wait")`,cases:[!1,!0].flatMap(e=>[!1,!0].map(t=>({inputs:{p1_ready:e,p2_ready:t},expected:[e&&t?"Load":"Wait"]}))),hint:"Combine the two slot values with and."},"pvp-loading":{title:"Choose the loading screen action",signature:"func show_status(status: String) -> void:",prompt:'The loader reports "loading", "loaded", or "failed". Print "Progress", "Enter", or "Retry" for the corresponding report.',starter:`if status == "loaded":
    print("Enter")
else:
    print("Progress")`,cases:[["loading","Progress"],["loaded","Enter"],["failed","Retry"]].map(([e,t])=>({inputs:{status:e},expected:[t]})),hint:"Inside the else branch, test for a failed load before showing progress."},"pvp-results":{title:"Choose the result panel",signature:"func show_result(p1_wins: int, p2_wins: int, target: int) -> void:",prompt:'Print "Match result" if either player reaches the target. Otherwise print "Next round". Test different scores and targets.',starter:`if p1_wins >= target:
    print("Match result")
else:
    print("Next round")`,cases:[[1,1,2],[2,0,2],[0,2,2],[2,2,3],[0,1,1]].map(([e,t,n])=>({inputs:{p1_wins:e,p2_wins:t,target:n},expected:[Math.max(e,t)>=n?"Match result":"Next round"]})),hint:"Compare both scores against the same target and combine the comparisons with or."},"attack-cost":{preview:"stamina",inputs:{},starter:`var shot_cost: float = 15.0
return shot_cost`},"roll-cost":{preview:"stamina",inputs:{},starter:`var roll_cost: float = 40.0
return roll_cost`},"stamina-regen":{preview:"stamina",inputs:{},starter:`var points_per_second: float = 20.0
return points_per_second`},"wasd-movement":{preview:"motion",title:"Tune the scout\u2019s speed",signature:"func horizontal_velocity(direction_x: float) -> float:",prompt:"Run the scout for one second with D held. Then change speed from 4.0 to 8.0 and run again. The flag marks the original 4 m finish. Try zero or a negative velocity, too.",starter:`var speed: float = 4.0
return direction_x * speed`,inputs:{direction_x:1},guide:"direction_x is 1 while D is held. Return horizontal velocity in meters per second. The preview applies it for one second. In motion.gd, the same value goes into velocity.x before move_and_slide()."},"health-and-pursuit":{preview:"combat",title:"Tune the damage per hit",signature:"func hit_damage() -> int:",prompt:"The sentinel starts each run with 3 HP. Run the attack, change attack_power from 1 to 2, then run again. Watch each impact and compare how many shots it takes to win.",starter:`var attack_power: int = 1
return attack_power`,inputs:{},guide:"Return a whole number of damage points per hit. The preview applies up to three hits, stopping at zero health. In the reference game, projectile.gd passes this amount to take_damage()."},variables:{title:"Spend one health point",signature:"func _ready() -> void:",prompt:"Create an integer named health with 3 points. Subtract 1, then print the label and the remaining health. The first line is ready for you.",starter:`var health: int = 3
# Subtract one point here.
print("Health: ", health)`,cases:[{inputs:{},expected:["Health: 2"]}],hint:"Start with 3, subtract 1 before printing, and keep the space after Health:."},"functions-and-signals":{title:"Send the shot count",signature:"func shoot(amount: int) -> void:",prompt:"Write the body of shoot. Double the incoming amount and send that number through fired. The connected listener prints each signal. The runner calls your function with 2 and again with 5.",starter:`# Store twice the incoming amount.
# Send it to the listener using fired.emit(...).
pass`,cases:[{inputs:{amount:2},expected:["Shots fired: 4"],signal:4},{inputs:{amount:5},expected:["Shots fired: 10"],signal:10}],hint:"Use the incoming amount so the same function works for both calls. Send the doubled value once with fired.emit()."},"conditions-and-loops":{title:"Report each target",signature:"func report_targets(health_values: Array[int]) -> void:",prompt:'Loop over health_values in order. Print "Active" when hp is greater than zero and "Disabled" otherwise. Try both supplied lists, including an empty-health target.',starter:`for hp in health_values:
    # Replace pass with your if / else decision.
    pass`,cases:[{inputs:{health_values:[0,2,1]},expected:["Disabled","Active","Active"]},{inputs:{health_values:[3,0]},expected:["Active","Disabled"]}],hint:"Check hp > 0 for each target. Keep both print calls inside the loop, each beneath its own branch."}};function ut(e,t){let n=_e[e],o=[];try{(t.length>12e3||t.split(`
`).length>200)&&N(1,"Keep this practice function under 200 lines and 12,000 characters.");let a=To(t);if(n.preview){let{returned:s,visits:i,output:c}=ma(a,n.inputs,!1,!0);s||N(i.at(-1)||1,"Return a number so the preview knows which value to apply. Add return followed by your calculated value.");let l=s.value;return Number.isFinite(l)||N(s.line,"Return a number, such as 4, without quotation marks."),n.preview==="stamina"&&(l<0||l>100)&&N(s.line,"Return a value between 0 and 100. The full stamina bar holds 100 points."),n.preview==="combat"&&(!Number.isSafeInteger(l)||l<0)&&N(s.line,"Damage counts whole health points. Return zero or a positive whole number."),{kind:"preview",value:l,runs:[c.map(h=>h.text)]}}for(let s of n.cases){let{output:i,events:c,visits:l}=ma(a,s.inputs,s.signal!==void 0);o.push(i.map(d=>d.text));let h=s.expected.findIndex((d,f)=>d!==i[f]?.text),u=s.signal!==void 0&&(c.length!==1||c[0].v!==s.signal);if(h!==-1||i.length!==s.expected.length||u){let d=h===-1?s.expected.length:h,f=i[d]?.line||l.at(-1)||1,S=i[d]?.decision,g=S?" The "+(S.condition==="else"?"else branch":"true branch")+" on line "+S.line+" led here.":"",x=u?"The listener must receive one fired signal carrying "+s.signal+".":i[d]?"This line printed \u201C"+i[d].text+"\u201D. "+(s.expected[d]===void 0?"No further output was expected.":"Expected \u201C"+s.expected[d]+"\u201D."):"After this line the run ended before it printed \u201C"+s.expected[d]+"\u201D.";return{kind:"mismatch",line:f,message:x+g+" "+n.hint,runs:o}}}return{kind:"success",message:"All practice cases passed.",runs:o}}catch(a){if(a instanceof RangeError)return{kind:"error",line:1,message:"This expression is too deeply nested for a practice run. Split it into smaller variables and run again.",runs:o};if(!(a instanceof Ve))throw a;return a.output&&o.push(a.output.map(s=>s.text)),{kind:"error",message:a.message,line:a.line,runs:o}}}var Ao={"+":"plus","-":"minus","*":"times","==":"is equal to","!=":"is different from","<":"is less than",">":"is greater than","<=":"is at most",">=":"is at least",and:"and",or:"or"};function Me(e){if(e.op==="literal")return typeof e.v=="string"?"\u201C"+e.v+"\u201D":String(e.v);if(e.op==="read")return e.name;if(e.op==="unary")return{"-":"negative ","+":"positive ",not:"not "}[e.t]+Me(e.a);let t=n=>n.op==="binary"?"("+Me(n)+")":Me(n);return t(e.a)+" "+Ao[e.t]+" "+t(e.b)}var Po={"attack-cost":"stamina paid for one attack","roll-cost":"stamina paid for one roll","stamina-regen":"points recovered per second","health-and-pursuit":"damage dealt by one hit","wasd-movement":"horizontal movement speed"};function ya(e,t){let n=[];for(let[o,a]of e.split(/\r?\n/).slice(0,200).entries()){if(!a.trim())continue;let s;try{let i=fa(a.trim(),o+1);if(!i.length)s="A note for you. The game skips this line.";else{let c=ga(i,o+1),l=c.expr?Me(c.expr):"";switch(c.op){case"var":{let h={float:" It can hold decimals.",int:" It holds whole numbers.",String:" It holds text.",bool:" It holds true or false."}[c.type]||"";s="Create a value named "+c.name+" and set it to "+l+"."+h;break}case"set":s=c.operator==="="?"Set "+c.name+" to "+l+".":(c.operator==="+="?"Add "+l+" to ":"Subtract "+l+" from ")+c.name+" and save the new value.";break;case"return":s="Send "+l+" back as the "+(Po[t]||"result")+" and finish this function.";break;case"print":s="Show "+(c.args.map(Me).join(" followed by ")||"a blank line")+" in the output.";break;case"fired":s="Send the fired signal with "+c.args.map(Me).join(", ")+". Its listener receives this value.";break;case"if":s="Run the indented lines only when "+l+".";break;case"else":s="Run this branch when the preceding if condition was false.";break;case"for":s="Visit each item in "+l+". Call the current item "+c.name+" while running the indented lines.";break;case"pass":s="Leave this spot empty for now. Execution continues.";break}}}catch(i){s=i instanceof Ve?i.message:"Split this long expression into smaller lines."}n.push({line:o+1,source:a.trim(),meaning:s})}return n}var Co="https://hayunchung.github.io/godot-battle-lab-web/",mt="https://godot-battle-lab.humbleray65.chatgpt.site",ba="battle-lab.paired-progress.v1",qt="battle-lab.code.v1.",va=e=>typeof e=="string"&&/^[0-9a-f]{64}$/.test(e),wa=Object.keys(_e);function _a(e,t,n){let o="",a=Ht(),s,i,c=!1,l="Progress is saved in this browser.",h;try{h=JSON.parse(localStorage.getItem(ba))}catch{}va(h?.key)&&h?.record?.version===1&&(o=h.key,a=h.record);function u(m){l=m;for(let k of document.querySelectorAll("[data-sync-status]"))k.textContent=l}function d(){try{return localStorage.setItem(ba,JSON.stringify({key:o,record:a})),!0}catch{return!1}}function f(){let m={};try{for(let k of wa){let v=localStorage.getItem(qt+k);v!==null&&(m[k]=v)}}catch{}return m}function S(){if(!o)return;let m=Date.now();Nt(a,t(),f(),m),t().last&&(a.fields.last=[m,t().last]),d(),c=!0,u("Saving progress\u2026"),clearTimeout(s),s=setTimeout(()=>w(),250)}async function g(m,k,v={}){let T=await fetch(mt+"/api/progress",{method:"POST",credentials:"omit",cache:"no-store",referrerPolicy:"no-referrer",headers:{"Content-Type":"text/plain"},body:JSON.stringify({action:m,key:k,...v}),signal:AbortSignal.timeout(15e3)});if(T.status===404&&m==="read")return null;if(T.status===409)return{conflict:!0};if(!T.ok)throw Error("Connection failed");return T.json()}function x(){let{state:m,drafts:k}=pa(a,e,wa),v=!1;try{for(let[T,C]of Object.entries(k))localStorage.getItem(qt+T)!==C&&(localStorage.setItem(qt+T,C),v=!0)}catch{}n(m,v)}async function y(){let m=!0;for(;m;){c=!1;let k=await g("read",o);if(!k)throw Error("Link not found");if(a=zt(k.document,a),x(),d(),JSON.stringify(a)!==JSON.stringify(k.document)&&(await g("save",o,{revision:k.revision,document:a})).conflict){c=!0;continue}m=c}return u("Progress is synced."),!0}function w(){return o?i||(i=y().catch(()=>(u("Sync is unavailable. Your progress is kept on this device."),!1)).finally(()=>{i=null}),i):Promise.resolve(!1)}async function p(m){if(i&&await i,m&&!va(m))throw Error("Invalid personal link.");if(o&&m&&m!==o)throw Error("This browser is paired with a different link. Use another browser profile to open this link.");if(!o){let k=Nt(Ht(),t(),f(),m?0:Date.now());if(m){let v=await g("read",m);if(!v)throw Error("This personal link could not be found.");a=zt(k,v.document),o=m}else{let v=Array.from(crypto.getRandomValues(new Uint8Array(32)),C=>C.toString(16).padStart(2,"0")).join("");if((await g("save",v,{revision:0,document:k})).conflict)throw Error("Please try creating the link again.");o=v,a=k}x(),d()}if(!await w())throw Error("Cannot reach sync yet. Reconnect and try again.");return Co+"#/pair/"+o}return window.addEventListener("online",w),window.addEventListener("focus",w),window.addEventListener("battle-code-changed",S),document.addEventListener("visibilitychange",()=>{(!document.hidden||c)&&w()}),setInterval(()=>{o&&!document.hidden&&w()},2e4),{changed:S,refresh:w,connect:p,get paired(){return!!o},get status(){return l}}}var Vt=[["KeyA","KeyD","KeyW","KeyS","Space"],["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Enter"]],Ro=["Left","Right","Up","Down","Fire"];function Io(){return{pilots:[{x:-4,z:0,dx:1,dz:0,hp:3,wait:0},{x:4,z:0,dx:-1,dz:0,hp:3,wait:0}],shots:[],result:""}}function ka(e,t){let[n,o,a,s,i]=Vt[t];return{x:Number(e.has(o))-Number(e.has(n)),z:Number(e.has(s))-Number(e.has(a)),fire:e.has(i)}}function Do(e,t,n,o,a){if(e.result)return;let[s,i]=e.pilots,c=[ka(t,0),ka(t,1)];if(n==="bot"){let l=s.x-i.x,h=s.z-i.z,u=Math.hypot(l,h);u>0&&(i.dx=l/u,i.dz=h/u),c[1]={x:u>o?i.dx:0,z:u>o?i.dz:0,fire:u<=o}}e.pilots.forEach((l,h)=>{let u=c[h],d=Math.hypot(u.x,u.z);d&&(l.dx=u.x/d,l.dz=u.z/d,l.x=Math.max(-8,Math.min(8,l.x+l.dx*4*a)),l.z=Math.max(-6,Math.min(6,l.z+l.dz*4*a))),l.wait=Math.max(0,l.wait-a),u.fire&&l.wait===0&&(l.wait=.45,e.shots.push({owner:h,x:l.x+l.dx*.6,z:l.z+l.dz*.6,dx:l.dx,dz:l.dz,life:1.8}))}),e.shots=e.shots.filter(l=>{l.x+=l.dx*11*a,l.z+=l.dz*11*a,l.life-=a;let h=e.pilots[1-l.owner];return Math.hypot(h.x-l.x,h.z-l.z)<=.55?(h.hp=Math.max(0,h.hp-1),!1):l.life>0}),(!s.hp||!i.hp)&&(e.result=s.hp===i.hp?"Draw":s.hp?"Player 1 wins":n==="bot"?"Bot wins":"Player 2 wins")}function Eo(e,t){let n=s=>300+s*31,o=s=>204+s*29;e.fillStyle="#151e2b",e.fillRect(0,0,600,408),e.strokeStyle="#29374a",e.lineWidth=1;for(let s=-8;s<=8;s++)e.beginPath(),e.moveTo(n(s),o(-6)),e.lineTo(n(s),o(6)),e.stroke();for(let s=-6;s<=6;s++)e.beginPath(),e.moveTo(n(-8),o(s)),e.lineTo(n(8),o(s)),e.stroke();let a=["#66dcff","#ff9879"];t.pilots.forEach((s,i)=>{e.fillStyle=a[i],e.save(),e.translate(n(s.x),o(s.z)),e.rotate(Math.atan2(s.dz,s.dx)),e.beginPath(),e.moveTo(17,0),e.lineTo(-10,-10),e.lineTo(-6,0),e.lineTo(-10,10),e.closePath(),e.fill(),e.restore(),e.fillStyle="#eee",e.textAlign="center",e.font="bold 13px sans-serif",e.fillText("P"+(i+1),n(s.x),o(s.z)-17)});for(let s of t.shots)e.fillStyle=a[s.owner],e.beginPath(),e.arc(n(s.x),o(s.z),4,0,2*Math.PI),e.fill()}function Sa(e){return`<fieldset data-pad="${e}"><legend>Player ${e+1}</legend>${Vt[e].map((t,n)=>`<button class="secondary" type="button" data-duel-key="${t}" aria-label="Player ${e+1} ${Ro[n]}">${["\u2190","\u2192","\u2191","\u2193","Fire"][n]}</button>`).join(" ")}</fieldset>`}function xa(e){return e==="network"?'<section class="code-lab duel-lab" data-packets><h3>Trace one network input</h3><p>This offline exercise follows one packet from the guest to the host and back. For a live match, open this project in Godot on both computers. <a class="lib-link" href="./downloads/battle-lab.zip" download>Download reference project \u2192</a></p><output aria-live="polite"></output><button type="button" class="primary" data-packet-next></button></section>':`<section class="code-lab duel-lab" data-duel="${e}"><h3>Try the duel controls</h3><label>Opponent <select data-opponent><option value="bot">Practice bot</option><option value="local">Second player on this keyboard</option></select></label><label data-range>Bot firing range (meters) <input type="range" min="1" max="7" value="4" step=".25"> <output>4</output></label><p data-instructions></p><div class="duel-health" aria-label="Round health"></div><canvas width="600" height="408" tabindex="0" aria-label="Duel training floor"></canvas><div class="duel-controls">${Sa(0)}${Sa(1)}</div><button type="button" class="primary" data-round-duel>Start round</button> <button type="button" class="secondary" data-pause-duel disabled>Pause</button><p role="status" data-duel-status></p></section>`}function Ta(e){let t=e.querySelector("[data-packets]");if(t){let v=[["Guest wants to move right. Both views show X = 4.0.","Send input"],["Guest \u2192 host: direction (1, 0). Health and hit decisions stay with the host.","Simulate on host"],["At 4 m/s, a quarter-second of input moves the guest from X = 4.0 to X = 5.0 on the host.","Deliver snapshot"],["Host \u2192 guest: X = 5.0. Both views now show the host\u2019s position.","Trace again"]],T=0,C=()=>{t.querySelector("output").textContent=v[T][0],t.querySelector("button").textContent=v[T][1]};return t.querySelector("button").onclick=()=>{T=(T+1)%v.length,C()},C(),()=>{}}let n=e.querySelector("[data-duel]");if(!n)return;let o=n.querySelector("canvas"),a=o.getContext("2d"),s=n.querySelector("select"),i=n.querySelector("[data-range] input"),c=n.querySelector("[data-duel-status]"),l=n.querySelector("[data-pause-duel]"),h=new Set,u,d,f,S,g;s.value=n.dataset.duel==="local"?"local":"bot";function x(){let[v,T]=u.pilots;n.querySelector(".duel-health").textContent="P1   "+v.hp+"/3     \xB7     "+(s.value==="bot"?"Bot":"P2")+"   "+T.hp+"/3",Eo(a,u)}function y(){g=!1,cancelAnimationFrame(d),h.clear()}function w(){y(),u=Io(),l.disabled=!0,l.textContent="Pause",c.textContent="Ready.";let v=s.value==="bot";n.querySelector("[data-range]").hidden=!v,n.querySelector('[data-pad="1"]').hidden=v,n.querySelector("[data-instructions]").textContent="P1 uses WASD and Space. "+(v?"The bot approaches, then fires in range.":"P2 uses the arrow keys and Enter.")+" Three hits end a round.",x()}function p(v){for(S+=Math.min((v-f)/1e3,.1),f=v;S>=1/60;)Do(u,h,s.value,Number(i.value),1/60),S-=1/60;if(x(),u.result){y(),c.textContent=u.result+".",l.disabled=!0;return}d=requestAnimationFrame(p)}function m(){g=!0,S=0,f=performance.now(),l.disabled=!1,l.textContent="Pause",c.textContent="Round in progress.",o.focus({preventScroll:!0}),d=requestAnimationFrame(p)}function k(){g&&(y(),l.textContent="Resume",c.textContent="Paused.")}s.onchange=w,i.oninput=()=>{n.querySelector("[data-range] output").value=i.value},n.querySelector("[data-round-duel]").onclick=()=>{w(),m(),n.querySelector("[data-round-duel]").textContent="Restart round"},l.onclick=()=>{g?k():m()},o.onkeydown=v=>{Vt.flat().includes(v.code)&&(v.preventDefault(),h.add(v.code)),v.code==="Escape"&&k()},o.onkeyup=v=>h.delete(v.code),o.onblur=()=>h.clear();for(let v of n.querySelectorAll("[data-duel-key]"))v.onpointerdown=T=>{g&&(T.preventDefault(),o.focus({preventScroll:!0}),v.setPointerCapture(T.pointerId),h.add(v.dataset.duelKey))},v.onlostpointercapture=()=>h.delete(v.dataset.duelKey);return window.addEventListener("blur",k),w(),()=>{y(),window.removeEventListener("blur",k)}}function ft(e,t,n){return`<div class="file-picker"><span>${b(e)}</span><div class="file-choice">
    <button type="button" class="secondary" aria-label="Choose file for ${b(e)}">Choose file</button>
    <input type="file" hidden aria-label="${b(e)}" accept="${b(t)}" ${n}>
    <span class="file-name" aria-live="polite">No file selected</span>
  </div></div>`}function gt(e){let t=e.parentElement,n=t.querySelector(".file-name");return t.querySelector("button").addEventListener("click",()=>e.click()),e.addEventListener("change",()=>{n.textContent=e.files[0]?.name||"No file selected"}),()=>{e.value="",n.textContent="No file selected"}}function Kt(e){if(e.byteLength<20)throw Error("This file is too short to be a GLB.");let t=new DataView(e);if(t.getUint32(0,!0)!==1179937895||t.getUint32(4,!0)!==2||t.getUint32(8,!0)!==e.byteLength||t.getUint32(16,!0)!==1313821514)throw Error("Export a glTF Binary (.glb) version 2 file from Blender.");let n=20+t.getUint32(12,!0);if(n>e.byteLength)throw Error("The GLB is incomplete. Export it again.");let o=JSON.parse(new TextDecoder().decode(new Uint8Array(e,20,n-20)));if([...o.buffers||[],...o.images||[]].some(a=>a.uri&&!a.uri.startsWith("data:")))throw Error("Pack the images into a single GLB so the arena can open them locally.");if(o.animations?.length<2||!o.animations)throw Error("This GLB needs two animation clips. Export both idle and walk actions, then choose the file again.");return{json:o,end:n}}function Yt(e){let{json:t,end:n}=Kt(e.bytes);if(e.idle===e.walk)throw Error("Choose different clips for idle and walk.");let o=t.animations;t.animations=[{...o[e.idle],name:"idle"},{...o[e.walk],name:"walk"}];for(let l of["attack","hit","death","roll"]){let h=e[l];Number.isInteger(h)&&h>=0&&h<o.length&&t.animations.push({...o[h],name:l})}let a=new TextEncoder().encode(JSON.stringify(t)),s=Math.ceil(a.length/4)*4,i=new Uint8Array(20+s+e.bytes.byteLength-n);i.set(new Uint8Array(e.bytes,0,20)),i.fill(32,20,20+s),i.set(a,20),i.set(new Uint8Array(e.bytes,n),20+s);let c=new DataView(i.buffer);return c.setUint32(8,i.length,!0),c.setUint32(12,s,!0),i}var Xt=new Map,yt={hit:.35,death:.9},Fo={attack:/attack|shoot|fire/i,hit:/hit|hurt|flinch|stagger/i,death:/death|die|dead|collapse|fall/i,roll:/roll|dodge|evade|somersault/i};function $e(e,t){return"data-"+(e==="enemy"?"enemy-":"")+t}function Aa(e,t){return"data-"+(e==="enemy"?"enemy":"hero")+"-"+t}function Jt(e="player"){let t=e==="enemy",n=t?"Enemy ":"",o=c=>Aa(e,c),a=c=>c[0].toUpperCase()+c.slice(1)+" clip",s=(c,l=!1)=>{let h=l?$e(e,c+"-clip"):$e(e,"clip")+'="'+c+'"';return`<label>${t?"Enemy "+c+" clip":a(c)}${l?" (optional)":""}<select ${h}></select></label>`},i=t?`${s("attack",!0)}<div data-enemy-contact-controls hidden><label>Contact point in the attack<input type="range" min="0" max="1" step="0.001" value="0.5" data-enemy-contact></label><output data-enemy-contact-time></output><button type="button" class="secondary" data-enemy-pose>Show contact pose</button><p>Scrub until the striking limb reaches its target. Damage is checked once at that pose.</p></div><a class="lib-link" href="#/enemy-attack">Enemy attack timing guide \u2192</a>`:`${s("attack",!0)}<div data-release-controls hidden><label>Release time (seconds)<input type="range" min="0" step="0.001" data-release></label><output data-release-time></output><button type="button" class="secondary" data-pose>Show release pose</button></div><a class="lib-link" href="#/attack">Attack animation screenshot guide \u2192</a>`;return`<details class="${t?"enemy-controls":"hero-controls"}" data-character-role="${e}"><summary>${t?"Use a Blender enemy":"Use my Blender character"}</summary><p>Choose a local GLB with idle and walk clips. Hook up optional attack, hit, ${t?"and death":"death, and roll"} clips for this ${t?"enemy":"player"}. Your tuned kit includes the selected model.</p><a class="lib-link" href="#/character">Blender-to-arena screenshot guide \u2192</a>
  ${ft(t?"Enemy GLB":"Character GLB",".glb,model/gltf-binary",o("file"))}<button class="secondary" ${o("demo")}>Try the example ${t?"enemy":"character"}</button>
  <div ${o("picker")} hidden><div class="hero-thumbnail" ${$e(e,"model-view")}></div>${s("idle")}${s("walk")}${i}${s("hit",!0)}${s("death",!0)}${t?"":s("roll",!0)}<label>${n}Facing correction<select ${o("turn")}><option value="0">0\xB0</option><option value="90">90\xB0</option><option value="180">180\xB0</option><option value="270">270\xB0</option></select></label><button class="secondary" ${o("reset")}>Restore ${t?"sentinel":"scout"}</button></div><p ${o("status")} role="status"></p></details>`}function Zt(e,t,n,o="player"){let a=o==="enemy",s=e.querySelector('[data-character-role="'+o+'"]'),i=D=>s.querySelector("["+Aa(o,D)+"]"),c=i("picker"),l=i("status"),h=i("file"),u=gt(h),d=["idle","walk","attack","hit","death"];a||d.push("roll");let f=d.slice(2),S={};for(let D of d){let P=f.includes(D)?$e(o,D+"-clip"):$e(o,"clip")+'="'+D+'"';S[D]=c.querySelector("["+P+"]")}let g=c.querySelector(a?"[data-enemy-contact]":"[data-release]"),x=i("turn"),y=c.querySelector("["+$e(o,"model-view")+"]"),w,p,m=0;function k(){for(let O of d){let z=S[O];if(f.includes(O))for(let R of z.options){let q=Number(R.value);R.disabled=q>=0&&d.some(W=>W!==O&&p[W]===q)}z.value=p[O]}p.timing=null;let D=p.attack>=0;if(c.querySelector(a?"[data-enemy-contact-controls]":"[data-release-controls]").hidden=!D,!D)return;let P=w.durations[p.attack];if(a){let O=P*p.contact,z=w.bladeAt(p.attack,O,p.turn*Math.PI/180);p.timing={duration:P,contact:O,blade:z},g.value=p.contact,c.querySelector("[data-enemy-contact-time]").textContent=Math.round(p.contact*100)+"% \xB7 "+O.toFixed(3)+" s / "+P.toFixed(3)+" s";return}p.release=Math.max(0,Math.min(p.release,P)),p.timing={duration:P,release:p.release},g.max=P,g.value=p.release,c.querySelector("[data-release-time]").textContent=p.release.toFixed(3)+" s / "+P.toFixed(3)+" s"}function v(){n(),m++,delete l.dataset.busy,w?.dispose(),w=null,p=null,Xt.delete(o),y.replaceChildren(),c.hidden=!0,u(),l.textContent=a?"Sentinel restored.":"Scout restored.",t()}async function T(D,P,O){n();let z=++m;l.dataset.busy="true",l.textContent="Opening "+P+"\u2026";try{let R=await D(),{json:q}=Kt(R),W=q.animations.map((H,G)=>H.name||"Clip "+(G+1)),{openCharacter:he}=await import("../vendor/character-renderer.js");if(z!==m)return;let se=await he(R,{frameScale:a?2:1});if(z!==m){se.dispose();return}let Z=O?.idle??Math.max(0,W.findIndex(H=>/idle/i.test(H))),_=W.findIndex((H,G)=>G!==Z&&/walk/i.test(H)),j=O?.walk??(_>=0?_:W.findIndex((H,G)=>G!==Z));w?.dispose(),w=se,y.replaceChildren(w.image),w.image.setAttribute("aria-label","Selected "+o+" preview"),p={bytes:R,name:P,idle:Z,walk:j,attack:-1,hit:-1,death:-1,roll:-1,release:0,contact:O?.contact??.5,turn:O?.turn??0,scale:w.scale,offset:w.offset};let L=new Set([Z,j]);for(let H of f){let G=O?.[H]??W.findIndex((ee,pe)=>!L.has(pe)&&w.durations[pe]>0&&Fo[H].test(ee));p[H]=G,G>=0&&L.add(G)}!a&&p.attack>=0&&(p.release=O?.release??w.durations[p.attack]/3),Xt.set(o,p),c.hidden=!1;for(let H of d){let G=f.includes(H),ee=W.map((pe,ue)=>G&&w.durations[ue]<=0?"":`<option value="${ue}">${b(pe)}</option>`).join("");S[H].innerHTML=(G?'<option value="-1">'+(H==="attack"?a?"Use built-in strike":"None \xB7 instant shot":H==="roll"?"Use built-in tumble":"Use built-in reaction")+"</option>":"")+ee}k(),x.value=p.turn,l.textContent=P+" is ready. "+(a?"Practice a swing to test the attack. Land a shot to see the hit reaction.":"Start battle and use WASD to switch from idle to walk."),t()}catch(R){z===m&&(l.textContent=R.message+" Current character: "+(p?.name||(a?"sentinel":"scout"))+".",u())}finally{z===m&&delete l.dataset.busy}}h.addEventListener("change",()=>{let D=h.files[0];if(D){if(D.size>64*1024*1024){l.textContent="Use a game-ready GLB smaller than 64 MB.";return}T(()=>D.arrayBuffer(),D.name)}}),i("demo").addEventListener("click",()=>{u(),T(async()=>{let D=await fetch(a?"./assets/reactions-guide/enemy.glb":"./assets/character-guide/hero.glb");if(!D.ok)throw Error("Could not open the example GLB.");return D.arrayBuffer()},a?"Example enemy":"Example hero")});function C(){!p||p.attack<0||(n(),w.draw(p.attack,Math.PI*.8+p.turn*Math.PI/180,0,a?p.timing.contact:p.release),c.dataset.playing=a?"contact-preview":"release-preview")}c.querySelector(a?"[data-enemy-pose]":"[data-pose]").addEventListener("click",C),g.addEventListener("input",()=>{!p||p.attack<0||(a?p.contact=g.valueAsNumber:p.release=g.valueAsNumber,k(),C())}),c.addEventListener("change",D=>{if(!p||D.target===g)return;n();let P=d.find(O=>S[O]===D.target);if(P){let O=Number(D.target.value);if(P==="idle"||P==="walk"){let z=P==="idle"?"walk":"idle";O===p[z]&&(p[z]=p[P]);for(let R of f)p[R]===O&&(p[R]=-1)}p[P]=O,P==="attack"&&O>=0&&(a?p.contact=.5:p.release=w.durations[O]/3)}else D.target===x&&(p.turn=Number(x.value));k(),t()}),i("reset").addEventListener("click",v);let F=Xt.get(o);return F&&T(()=>F.bytes,F.name,F),{get loading(){return l.dataset.busy==="true"},get model(){return p},get attack(){return p?.timing},get rollDuration(){return w?.durations[p?.roll]||.75},get reactionDurations(){return p?{hit:w.durations[p.hit]||yt.hit,death:w.durations[p.death]||yt.death}:yt},draw(D,P,O,z){if(!w)return!1;let R=a?P.enemySwing:null,q=!a&&!P.playerReaction&&!P.outcome?P.roll:null,W=a?R?.dx??P.x-P.ex:q?.dx??P.dx,he=a?R?.dz??P.z-P.ez:q?.dz??P.dz,se=Math.atan2(-W,-he)+p.turn*Math.PI/180,Z=a?P.enemyReaction:P.playerReaction,_=a?R?.time:P.attackTime,j=p.attack>=0&&_!=null&&!P.outcome,L=Z?.kind||(q?"roll":j?"attack":O?"walk":"idle");if(q){let G=Math.max(0,Math.min(1,q.time/q.duration));p.roll>=0?w.draw(p.roll,se,0,G*w.durations[p.roll]):w.drawTumble(p.idle,Math.atan2(-W,-he),p.turn*Math.PI/180,G)}else if(Z&&p[L]<0){let G=Math.min(1,Math.max(0,Z.time/yt[L])),ee=L==="death"?1.49*G:.43*Math.sin(Math.PI*G);w.draw(p.idle,se,0,0,ee,L==="death"?G:0)}else if(R&&p.attack<0&&!Z&&!P.outcome){let G=Math.sin(Math.PI*Math.min(1,R.time/R.duration));w.draw(p.idle,se,0,0,-.32*G)}else{let G=Z?Math.min(w.durations[p[L]],Z.time):j?_:null,ee=L==="death"?G/w.durations[p.death]:0;w.draw(p[L],se,z,G,0,ee)}c.dataset.playing=R&&!Z&&!P.outcome?"attack":L;let H=62*w.frameScale;return D.drawImage(w.image,320+33*(a?P.ex:P.x)-H/2,207+28*(a?P.ez:P.z)-H/2,H,H),!0},dispose(){m++,w?.dispose()}}}var Qt=e=>Number(e.toFixed(2)).toString(),en=e=>e===0?3:Math.min(3,Math.ceil(3/e));function Mo(e,t,n){if(e==="motion"){let i=t*Math.min(n,1),c=Math.max(12,Math.abs(t)),l=t<0,h=l?c+4:c,u=l?c/h:0,d=f=>8+84*(u+f/h);return{scout:d(i),flag:d(4),start:d(0),status:"Position X: "+Qt(i)+" m \xB7 "+Qt(Math.min(n,1))+" s",done:n>=1}}let o=en(t),a=Math.min(o,Math.floor((n+1e-9)/.55)),s=Math.max(0,3-a*t);return{shot:a<o?10+78*(n/.55-a):null,hp:s,done:a===o,status:"Hits: "+a+" \xB7 Sentinel: "+s+" / 3 HP"+(s===0?" \xB7 Defeated":"")}}function Pa(e){let t=e==="combat";return`<div class="arena-preview" data-arena="${e}"><div class="arena-floor" aria-hidden="true"><span class="actor scout"></span>${t?'<span class="actor sentinel"></span><i class="pulse"></i>':'<span class="flag-marker">4 m</span><span class="origin-marker">0</span>'}</div>${t?'<progress max="3" value="3" aria-label="Enemy health"></progress>':""}<div class="arena-reading"></div><p class="arena-outcome" role="status"></p></div>`}function bt(e,t,n){if(!e)return;let o=e.dataset.arena,a=t?.kind==="preview",s=a?t.value:o==="motion"?4:1,i=o==="motion"?1:en(s)*.55,c=e.querySelector(".scout"),l=e.querySelector(".pulse"),h=e.querySelector("progress");function u(S){let g=Mo(o,s,S);o==="motion"?(c.style.left=g.scout+"%",e.querySelector(".flag-marker").style.left=g.flag+"%",e.querySelector(".origin-marker").style.left=g.start+"%"):(l.hidden=g.shot===null||!a,g.shot!==null&&(l.style.left=g.shot+"%"),h.value=g.hp,e.classList.toggle("defeated",g.hp===0)),e.querySelector(".arena-reading").textContent=g.status,a&&g.done&&(e.querySelector(".arena-outcome").textContent=o==="motion"?"After 1 second: X = "+Qt(s)+" m. Reference: X = 4 m.":"Damage per hit: "+s+". HP: "+Array.from({length:en(s)+1},(x,y)=>Math.max(0,3-y*s)).join(" \u2192 ")+".")}if(!a){u(0);return}if(!n||matchMedia("(prefers-reduced-motion: reduce)").matches){u(i);return}let d=performance.now();function f(S){if(!e.isConnected)return;let g=Math.min(i,(S-d)/1e3);u(g),g<i&&requestAnimationFrame(f)}u(0),requestAnimationFrame(f)}var tn=new Map,vt=new Map,Ca=e=>"battle-lab.code.v1."+e;function Be(e){try{let t=localStorage.getItem(Ca(e));t!==null&&tn.set(e,t)}catch{}return tn.get(e)??_e[e].starter}function an(e,t){tn.set(e,t),vt.delete(e);try{localStorage.setItem(Ca(e),t),window.dispatchEvent(new Event("battle-code-changed"))}catch{}}function Ke(e,t){return ya(t,e).map(n=>`<li><small>Line ${n.line}</small><code>${Te(n.source)}</code><span>${b(n.meaning)}</span></li>`).join("")}function on(e,t){return`<details class="line-guide" data-explain="${e}"><summary>Read this code line by line</summary><ol>${Ke(e,t)}</ol></details>`}function Ra(e){return e.split(`
`).map((t,n)=>n+1).join(`
`)}function Ia(e){return Object.entries(e).map(([t,n])=>t+" = "+JSON.stringify(n)).join(", ")||"On scene start"}function nn(e,t){let n=_e[e],o=n.preview?Pa(n.preview):"";if(!t||t.kind==="preview"){let a=t?.runs?.[0]||[];return o+(a.length?"<pre>"+b(a.join(`
`))+"</pre>":"")}return`<div class="run-result ${t.kind}"><strong role="status">${t.kind==="success"?"Passed":t.kind==="error"?"Code error":"Check your result"}</strong>
    ${t.line?`<button type="button" data-error-line="${t.line}">Go to line ${t.line}</button>`:""}<p>${b(t.message)}</p>
    ${t.runs.map((a,s)=>`<div class="case-output"><small>${b(Ia(n.cases?.[s]?.inputs||n.inputs))} \xB7 Actual output</small><pre>${b(a.join(`
`)||"(no output)")}</pre></div>`).join("")}</div>`}function Da(e){if(!Object.hasOwn(_e,e))return"";let t=_e[e],n=Be(e);return`<section class="code-lab" data-code-lab="${e}"><div class="panel-label">${I("code",15)} CODING PRACTICE</div><h3>${b(t.title)}</h3><p>${b(t.prompt)}</p>
    <label for="practice-source">Your GDScript</label><div class="signature"><code>${Te(t.signature)}</code></div>
    <div class="edit-wrap"><pre class="line-nums" aria-hidden="true">${Ra(n)}</pre><textarea id="practice-source" spellcheck="false" autocapitalize="off" autocomplete="off" aria-describedby="body-help" maxlength="12000"></textarea></div>
    <small id="body-help">Enter the function body starting at line 1. Indent nested blocks with four spaces.</small>
    ${on(e,n)}<button class="primary" type="button" data-run-code>${I("play",14)} Run code</button><div class="code-response" aria-live="${t.preview?"off":"polite"}">${nn(e,vt.get(e))}</div>
    <details class="trouble"><summary>${t.preview?"How the preview works":"Expected output &amp; supported syntax"}</summary><div class="practice-help">${t.preview?b(t.guide):t.cases.map(o=>`<small>${b(Ia(o.inputs))}</small><pre>${b(o.expected.join(`
`))}</pre>`).join("")}<p>This browser runner supports the subset used here: variables, numbers, text, comparisons, +, \u2212, *, assignments, print(), signal emission, and for / if / else. Run full scripts in the downloadable Godot project.</p></div></details></section>`}function Ea(e){let t=e.querySelector("[data-code-lab]");if(!t)return;let n=t.dataset.codeLab,o=t.querySelector("textarea"),a=t.querySelector(".line-nums"),s=t.querySelector(".code-response");o.value=Be(n),bt(s.querySelector("[data-arena]"),vt.get(n),!1);function i(){t.querySelector("[data-explain] ol").innerHTML=Ke(n,o.value),an(n,o.value),s.dataset.editing||(s.innerHTML=nn(n,null),bt(s.querySelector("[data-arena]"),null,!1),s.dataset.editing="1"),a.textContent=Ra(o.value),a.scrollTop=o.scrollTop}o.addEventListener("input",i),o.addEventListener("scroll",()=>{a.scrollTop=o.scrollTop});function c(){let l=ut(n,o.value);vt.set(n,l),s.innerHTML=nn(n,l),delete s.dataset.editing,bt(s.querySelector("[data-arena]"),l,!0)}t.querySelector("[data-run-code]").addEventListener("click",c),o.addEventListener("keydown",l=>{if(!l.isComposing){if(l.key==="Enter"&&(l.ctrlKey||l.metaKey)){l.preventDefault(),c();return}if(l.key==="Enter"){l.preventDefault();let h=o.value.slice(0,o.selectionStart).split(`
`).at(-1),u=h.match(/^\s*/)[0]+(h.trimEnd().endsWith(":")?"    ":"");o.setRangeText(`
`+u,o.selectionStart,o.selectionEnd,"end"),i()}}}),s.addEventListener("click",l=>{let h=l.target.closest("[data-error-line]");if(!h)return;let u=Number(h.dataset.errorLine)-1,d=o.value.split(`
`),f=d.slice(0,u).reduce((S,g)=>S+g.length+1,0);o.focus(),o.setSelectionRange(f,f+(d[u]?.length||0)),o.scrollTop=Math.max(0,u*21-42)})}var $o=new TextEncoder,Bo=new TextDecoder,Oo=e=>"battle_lab/scenes/"+e+".tscn";function Lo(e,t,n){e[t]=$o.encode(n(Bo.decode(e[t])))}function Fa(e,t,n){e["battle_lab/assets/foe.glb"]=n,Lo(e,Oo("enemy"),o=>{let a=t.turn*Math.PI/180,[s,i,c]=t.offset,l=t.scale,h='[node name="Model" type="Node3D" parent="."]',u=h+`

[node name="Foe" parent="Model" instance=ExtResource("Foe")]
position = Vector3(`+[Math.cos(a)*s+Math.sin(a)*c,i,-Math.sin(a)*s+Math.cos(a)*c].join(", ")+`)
rotation = Vector3(0, `+a+`, 0)
scale = Vector3(`+[l,l,l].join(", ")+")";return o.split(/(?=^\[)/m).filter(d=>!/^\[node [^\n]*parent="Model"/.test(d)).join("").replace(h,u).replace('script = ExtResource("1")',`script = ExtResource("1")
attack_contact_fraction = `+(Number.isFinite(t.contact)?Math.max(0,Math.min(1,t.contact)):.5)).replace(/load_steps=(\d+)/,(d,f)=>"load_steps="+(Number(f)+1)).replace(`
[ext_resource`,`
[ext_resource type="PackedScene" path="res://battle_lab/assets/foe.glb" id="Foe"]

[ext_resource`)})}async function Ma(e,t,n,o,a,s){if(!Number.isFinite(e)||!Number.isSafeInteger(t)||t<0)throw Error("Invalid tuning");let[{zipSync:i,unzipSync:c,strToU8:l,strFromU8:h},u]=await Promise.all([import("../vendor/fflate.js"),fetch("./downloads/arena-kit.zip")]);if(!u.ok)throw Error("Download unavailable");let d=c(new Uint8Array(await u.arrayBuffer()));if(d["battle_lab/tuning.gd"]=l(`extends RefCounted

const MOVE_SPEED: float = `+e+`
const ATTACK_POWER: int = `+t+`
`),a){let{start:g,end:x}=a;if(!Number.isFinite(g)||!Number.isFinite(x)||g<0||x>1||x<g)throw Error("Invalid roll window");let y="battle_lab/scenes/player.tscn",w='script = ExtResource("1")';d[y]=l(h(d[y]).replace(w,w+`
roll_safe_start = `+g+`
roll_safe_end = `+x))}if(s){let{cost:g,regen:x,attackCost:y=15}=s;if(![g,x,y].every(m=>Number.isFinite(m)&&m>=0&&m<=100))throw Error("Invalid stamina tuning");let w="battle_lab/scenes/player.tscn",p='script = ExtResource("1")';d[w]=l(h(d[w]).replace(p,p+`
roll_stamina_cost = `+g+`
stamina_regen_per_second = `+x+`
attack_stamina_cost = `+y))}if(n){let g="battle_lab/",x=g+"scenes/player.tscn",y=g+"stages/animated_player.gd";d[g+"assets/hero.glb"]=Yt(n);let w=n.turn*Math.PI/180,[p,m,k]=n.offset,T=`[node name="Model" type="Node3D" parent="."]

[node name="Hero" parent="Model" instance=ExtResource("2")]
position = Vector3(`+[Math.cos(w)*p+Math.sin(w)*k,m,-Math.sin(w)*p+Math.cos(w)*k].join(", ")+`)
rotation = Vector3(0, `+w+`, 0)
scale = Vector3(`+[n.scale,n.scale,n.scale].join(", ")+")";if(d[x]=l(h(d[x]).replace("assets/scout.glb","assets/hero.glb").replace('[node name="Model" parent="." instance=ExtResource("2")]',T).replace('NodePath("../Model")','NodePath("../Model/Hero")').replace("../Model/AnimationPlayer","../Model/Hero/AnimationPlayer")),n.attack>=0){let C=await fetch("./assets/attack-guide/attack_player.gd");if(!C.ok)throw Error("Attack controller is unavailable.");d[g+"scripts/player.gd"]=l(await C.text());let F='script = ExtResource("1")';d[x]=l(h(d[x]).replace(F,F+`
attack_release_seconds = `+n.release))}d[y]=l(h(d[y]).replace("$Model/AnimationPlayer","$Model/Hero/AnimationPlayer"))}o&&Fa(d,o,Yt(o));let f=URL.createObjectURL(new Blob([i(d)],{type:"application/zip"})),S=document.createElement("a");S.href=f,S.download="battle-lab-tuned.zip",S.click(),setTimeout(()=>URL.revokeObjectURL(f),1e3)}var jo="wasd-movement",Go="health-and-pursuit",La=["Move speed","Attack power","Roll cost","Stamina recovery","Attack stamina cost"],ja={cost:40,regen:20,attackCost:15},$a=new Set(["KeyW","KeyA","KeyS","KeyD","Space","ShiftLeft","ShiftRight"]),rn={start:4/18,end:12/18,duration:.75},Ba="battle-lab.roll-window.v1";function _t(e){return!!(e&&e.time+1e-9>=e.start*e.duration&&e.time+1e-9<e.end*e.duration)}var wt=(e,t)=>Math.max(-t,Math.min(t,e));function Ye(){return{stamina:100,rest:0,denied:null,shotsFired:0,x:0,z:2.8,ex:0,ez:-3,hp:3,enemyHP:3,dx:0,dz:-1,shots:[],roll:null,rollTap:!1,fireTap:!1,attackTime:null,attackReleased:!1,reload:0,enemySwing:null,lastStrike:"",flash:0,outcome:"",playerReaction:null,enemyReaction:null}}var Ho={hit:.35,death:.9};function cn(e,t,n,o=Ho){if(e.outcome||n<=0||t==="player"&&_t(e.roll))return;let a=t==="player"?"hp":"enemyHP";e[a]=Math.max(0,e[a]-n);let s=e[a]===0?"death":"hit";e[t+"Reaction"]={kind:s,time:0,duration:o[s]},(t==="player"||s==="death")&&(e.roll=null,e.rollTap=!1),t==="player"&&(e.attackTime=null,e.attackReleased=!1,e.fireTap=!1),(t==="enemy"||s==="death")&&(e.enemySwing=null),s==="death"&&(e.outcome=t==="player"?"Defeat":"Victory",e.shots=[],e.walking=e.enemyWalking=!1)}function Ga(e,t){for(let n of["playerReaction","enemyReaction"]){let o=e[n];o&&(o.time=Math.min(o.duration,o.time+t),o.kind==="hit"&&o.time>=o.duration&&(e[n]=null))}}function Oa(e){return[e.playerReaction,e.enemyReaction].every(t=>!t||t.kind==="death"&&t.time>=t.duration)}var No={baseRight:0,baseForward:.35,tipRight:0,tipForward:1.55},zo=.12,Uo=.37;function ln(e,t){let n=t.blade||No,o=(a,s)=>[e.ex+t.dx*s-t.dz*a,e.ez+t.dz*s+t.dx*a];return[o(n.baseRight,n.baseForward),o(n.tipRight,n.tipForward)]}function Wo(e,t){let[[n,o],[a,s]]=ln(e,t),i=a-n,c=s-o,l=i*i+c*c,h=l?Math.max(0,Math.min(1,((e.x-n)*i+(e.z-o)*c)/l)):0;return Math.hypot(e.x-(n+h*i),e.z-(o+h*c))<=zo+Uo}function qo(e,t,n){if(e.enemyWalking=!1,e.enemyReaction)return;if(!e.enemySwing){let a=e.x-e.ex,s=e.z-e.ez,i=Math.hypot(a,s),c=n.swing?.blade,l=c?Math.min(1.6,Math.max(.4,Math.max(c.baseForward,c.tipForward)+.25)):1.6;if(i>l){let d=Math.min(i-l,1.35*t);if(e.ex+=d*a/i,e.ez+=d*s/i,e.enemyWalking=!0,i-d>l+1e-6)return}let{duration:h,contact:u}=n.swing||{duration:1,contact:.5};e.enemySwing={dx:i?a/i:0,dz:i?s/i:1,time:0,duration:h,contact:u,blade:c,checked:!1},e.enemyWalking=!1}let o=e.enemySwing;if(o.time=Math.min(o.duration,o.time+t),!o.checked&&o.time+1e-8>=o.contact){o.checked=!0;let a=Wo(e,o);e.lastStrike=a?_t(e.roll)?"Evaded \xB7 protected at contact":"Hit \xB7 \u22121 HP":"Miss \xB7 no damage",a&&cn(e,"player",1,n.player)}o.time+1e-8>=o.duration&&(e.enemySwing=null)}function sn(e,t,n){return e.stamina+1e-8<n?(e.denied={action:t,cost:n},!1):(e.stamina=Math.max(0,e.stamina-n),e.rest=1,e.denied=null,!0)}function dn(e,t,n,o,a,s,i={}){if(Ga(e,a),e.outcome)return;let c=Number(t.has("KeyD"))-Number(t.has("KeyA")),l=Number(t.has("KeyS"))-Number(t.has("KeyW")),h=Math.hypot(c,l),u=e.x,d=e.z,{cost:f,regen:S,attackCost:g=15}=i.stamina||ja;if(!e.roll&&e.attackTime===null){let m=Math.min(a,e.rest);e.rest-=m,e.stamina=Math.min(100,e.stamina+(a-m)*S),e.denied&&e.stamina+1e-8>=e.denied.cost&&(e.denied=null)}let x=e.rollTap&&!e.roll&&!e.playerReaction&&e.attackTime===null;x&&sn(e,"Roll",f)&&(h&&(e.dx=c/h,e.dz=l/h),e.roll={...rn,...i.roll,dx:e.dx,dz:e.dz,time:0}),e.rollTap=!1;let y=e.roll;if(y){let m=Math.min(a,y.duration-y.time),k=2.4*m/y.duration;e.x=wt(e.x+y.dx*k,8.3),e.z=wt(e.z+y.dz*k,6.3),y.time+=m,y.time+1e-9>=y.duration&&(e.roll=null)}else h&&!e.playerReaction&&(e.dx=c/h,e.dz=l/h,e.x=wt(e.x+e.dx*n*a,8.3),e.z=wt(e.z+e.dz*n*a,6.3));e.walking=e.x!==u||e.z!==d,e.reload=Math.max(0,e.reload-a),e.flash=Math.max(0,e.flash-a);let w=!x&&!y&&!e.playerReaction&&(e.fireTap||t.has("Space")),p=!1;if(s?(w&&e.attackTime===null&&sn(e,"Attack",g)&&(e.attackTime=0,e.attackReleased=!1),e.attackTime!==null&&(e.attackTime=Math.min(s.duration,e.attackTime+a),!e.attackReleased&&e.attackTime+1e-8>=s.release&&(p=!0,e.attackReleased=!0),e.attackTime+1e-8>=s.duration&&(e.attackTime=null))):(e.attackTime=null,p=w&&e.reload<=1e-8&&sn(e,"Attack",g)),p&&(e.shotsFired++,e.shots.push({x:e.x+e.dx*.46,z:e.z+e.dz*.46,dx:e.dx,dz:e.dz,life:1.8}),e.reload=.25),e.fireTap=!1,e.shots=e.shots.filter(m=>(m.x+=m.dx*11*a,m.z+=m.dz*11*a,m.life-=a,!e.training&&Math.hypot(m.x-e.ex,m.z-e.ez)<.63?(e.staminaDrill||cn(e,"enemy",o,i.enemy),o>0&&(e.flash=.16),!1):m.life>0&&Math.abs(m.x)<9&&Math.abs(m.z)<7)),e.outcome){e.shots=[];return}!e.training&&!e.staminaDrill&&qo(e,a,i)}function Ha(){return`<section class="code-lab final-arena"><div class="panel-label">PLAYTEST</div><h3>Relay Arena</h3><p>Fight the sentinel with the speed and damage from your code. Move with WASD. Hold Space to fire. Tap Shift to roll in the current movement direction, or along your last heading when standing still.</p>
    <div class="arena-loadout"><span>Move speed <b data-speed></b></span><span>Damage per hit <b data-damage></b></span></div>
    <div data-config-errors role="status"></div><div class="combat-hud"><span>SCOUT <b data-hp>3/3</b> <em data-player-state></em></span><span>SENTINEL <b data-enemy>3/3</b> <em data-enemy-state></em></span></div>
    <div class="stamina-hud"><label for="stamina-meter">Stamina <b data-stamina>100 / 100</b></label><progress id="stamina-meter" max="100" value="100"></progress><small data-stamina-state></small><small class="reserve" data-reserve></small><span data-stamina-notice role="status"></span></div>
    <canvas width="640" height="440" tabindex="0" aria-label="Battle arena. WASD to move, Space to fire, Shift to roll, Escape to pause, R to restart after the round."></canvas>
    <div class="arena-actions"><button class="primary" data-round>Start battle</button><span data-result role="status"></span></div>
    <div class="touch-controls" aria-label="Touch controls">${[["KeyW","\u2191","Move up"],["KeyA","\u2190","Move left"],["KeyS","\u2193","Move down"],["KeyD","\u2192","Move right"],["Space","Fire","Fire"],["ShiftLeft","Roll","Roll"]].map(([e,t,n])=>`<button data-control="${e}" aria-label="${n}">${t}</button>`).join("")}</div><div class="enemy-drill"><h4>Dodge the sentinel</h4><p>Wait for the amber line, then move sideways with A or D. Stand still on your next try to compare.</p><button class="secondary" data-drill>Practice a swing</button> <output data-strike aria-live="polite"></output><a class="lib-link" href="#/enemy-attack">Enemy attack timing guide \u2192</a></div><details class="roll-panel"><summary>Roll through the blade</summary><p>Start a swing test. Face the sentinel, then tap Shift midway through its wind-up to roll into the blade. <b>Evaded</b> means the blade touched you during protection. <b>Miss</b> means it passed clear.</p><button class="secondary" data-roll-drill>Practice a timed roll</button><fieldset><legend>Protected interval \xB7 24 fps preview</legend><label>First protected frame <input type="range" min="1" data-safe-start></label><label>First vulnerable frame after protection <input type="range" min="2" data-safe-end></label><output data-safe-summary></output></fieldset><a class="lib-link" href="#/lesson/dodge-roll">Roll animation lesson \u2192</a></details><details class="reaction-practice"><summary>Practice hit &amp; fall</summary><p>Start a stationary test with 3 HP each. Each hit removes one point. Reset to repeat or start a battle to fight normally.</p><div><button class="secondary" data-hit-target="player">Hit player</button><button class="secondary" data-hit-target="enemy">Hit enemy</button><button class="secondary" data-practice-reset>Reset practice</button></div><a class="lib-link" href="#/reactions">Hit and death screenshot guide \u2192</a></details>${Jt()}${Jt("enemy")}<div class="arena-editors"><h3>Tune this round</h3><p>Edit a function body and start a fresh round to run your code. Roll cost is points per roll. Recovery is points per second after a one-second rest.</p>
    ${[jo,Go,"roll-cost","stamina-regen","attack-cost"].map((e,t)=>`<label for="tune-${t}">${La[t]} code</label><textarea id="tune-${t}" data-tune="${e}" rows="3" spellcheck="false" maxlength="12000" autocapitalize="off"></textarea>${on(e,Be(e))}`).join("")}
    <button class="secondary" data-stamina-drill>Apply &amp; test stamina</button><p>The sentinel stays still and absorbs practice shots. Hold Space, release it, then tap Shift to test your remaining stamina.</p><a class="lib-link" href="#/lesson/roll-stamina">Roll stamina workshop \u2192</a> <a class="lib-link" href="#/lesson/shared-stamina">Attack and roll workshop \u2192</a>
    <button class="primary" data-replay>Apply &amp; fight again</button><small data-compare></small>
    <button class="secondary" data-kit>Download tuned Godot kit</button><span data-export-status role="status"></span><a class="lib-link" href="#/own-project">Use this kit in my project \u2192</a></div></section>`}function hn(e,t,n,o,a,s){let l=f=>320+f*33,h=f=>215+f*28;e.fillStyle="#151420",e.fillRect(0,0,640,440),e.fillStyle="#29243c",e.fillRect(23,19,594,392),e.strokeStyle="#443951",e.lineWidth=1;for(let f=-9;f<=9;f++)e.beginPath(),e.moveTo(l(f),19),e.lineTo(l(f),411),e.stroke();for(let f=-7;f<=7;f++)e.beginPath(),e.moveTo(23,h(f)),e.lineTo(617,h(f)),e.stroke();e.strokeStyle="#837099",e.lineWidth=3,e.strokeRect(23,19,594,392),e.strokeStyle="#655478",e.strokeRect(292,191,56,48);let u=t.enemySwing;if(u){let[f,S]=ln(t,u);e.save(),e.strokeStyle=u.checked?"#ffe9a8":"#f1a34e",e.lineCap="round",e.lineWidth=9,e.globalAlpha=u.checked?.28:.16,e.beginPath(),e.moveTo(l(f[0]),h(f[1])),e.lineTo(l(S[0]),h(S[1])),e.stroke(),e.lineWidth=u.checked?4:2,e.globalAlpha=.95,u.checked||e.setLineDash([3,4]),e.stroke(),e.restore()}function d(f,S,g,x,y){let w=y?"#ee806f":"#63dcea",p=y?"#ffc2ab":"#c4fbff";e.save(),e.translate(l(f),h(S)),e.fillStyle="#12111b",e.beginPath(),e.ellipse(0,4,17,11,0,0,Math.PI*2),e.fill();let m=y?t.enemyReaction:t.playerReaction,k=m?Math.min(1,m.time/m.duration):0;if(m?.kind==="death"&&(e.translate(0,5*k),e.rotate(1.5*Math.min(1,k*1.6)),e.scale(1,1-.35*k)),m?.kind==="hit"){let v=Math.sin(Math.PI*k);e.translate(-g*5*v,-x*5*v),e.rotate(-.5*v)}e.rotate(Math.atan2(x,g)+Math.PI/2),!y&&t.roll&&e.scale(1,Math.cos(2*Math.PI*t.roll.time/t.roll.duration)),e.fillStyle=y?"#844752":"#357888",e.fillRect(-14,-5,6,18),e.fillRect(8,-5,6,18),e.fillStyle=y&&t.flash>0?"#fff":w,e.beginPath(),e.roundRect(-10,-11,20,22,6),e.fill(),e.fillStyle="#232235",e.fillRect(-7,-7,14,6),e.fillStyle=p,e.fillRect(-5,-6,9,2),e.fillRect(7,-17,4,11),e.restore()}if(t.roll&&(e.save(),e.strokeStyle=_t(t.roll)?"#66edc5":"#b4abcd",e.lineWidth=3,e.beginPath(),e.ellipse(l(t.x),h(t.z),20,13,0,0,Math.PI*2),e.stroke(),e.restore()),n?.draw(e,t,a,s)||d(t.x,t.z,t.dx,t.dz,!1),!t.training&&!o?.draw(e,t,t.enemyWalking&&!t.outcome,s)&&d(t.ex,t.ez,u?.dx??t.x-t.ex,u?.dz??t.z-t.ez,!0),u&&!u.blade){let[f,S]=ln(t,u),g=u.time,x=g<u.contact?-1.4*(1-g/u.contact):.85*(g-u.contact)/Math.max(.001,u.duration-u.contact),y=S[0]-f[0],w=S[1]-f[1];e.save(),e.strokeStyle="#ffbc65",e.lineWidth=5,e.lineCap="round",e.beginPath(),e.moveTo(l(f[0]),h(f[1])),e.lineTo(l(f[0]+y*Math.cos(x)-w*Math.sin(x)),h(f[1]+y*Math.sin(x)+w*Math.cos(x))),e.stroke(),e.restore()}e.strokeStyle="#a8f6ff",e.lineWidth=4,e.lineCap="round";for(let f of t.shots)e.beginPath(),e.moveTo(l(f.x-.25*f.dx),h(f.z-.25*f.dz)),e.lineTo(l(f.x),h(f.z)),e.stroke()}function Na(e){let t=e.querySelector(".final-arena");if(!t)return;let n=t.querySelector("canvas[tabindex]"),o=n.getContext("2d"),a=t.querySelector("[data-round]"),s=t.querySelector("[data-result]"),i=new Set,c=new AbortController,l={signal:c.signal},h,u,d=Ye(),f="ready",S,g,x,y,w=0,p=[...t.querySelectorAll("[data-tune]")],m=t.querySelector("[data-replay]"),k=t.querySelector("[data-kit]");for(let _ of p)_.value=Be(_.dataset.tune);let v,T,C=ja,F={start:rn.start,end:rn.end};try{let _=JSON.parse(localStorage.getItem(Ba));_&&Number.isFinite(_.start)&&Number.isFinite(_.end)&&0<=_.start&&_.start<_.end&&_.end<=1&&(F=_)}catch{}let D=t.querySelector("[data-safe-start]"),P=t.querySelector("[data-safe-end]");function O(){return Math.max(2,Math.round((h?.rollDuration||.75)*24))}function z(){let _=O(),j=Math.min(_,1+Math.ceil(F.start*_-1e-9)),L=Math.max(j+1,1+Math.ceil(F.end*_-1e-9));D.max=L-1,P.min=j+1,P.max=_+1,D.value=j,P.value=L;let H=h?.rollDuration||.75,G="Frames "+j+"\u2013"+(L-1)+" protected \xB7 frame "+L+" vulnerable ("+(F.start*H).toFixed(3)+"\u2013"+(F.end*H).toFixed(3)+" s)",ee=t.querySelector("[data-safe-summary]");ee.textContent!==G&&(ee.textContent=G)}for(let _ of[D,P])_.addEventListener("input",()=>{W();let j=O();F={start:(Number(D.value)-1)/j,end:(Number(P.value)-1)/j};try{localStorage.setItem(Ba,JSON.stringify(F))}catch{}z()});function R(){let _=p.map(L=>ut(L.dataset.tune,L.value));T=_.map(L=>L.value),t.querySelector("[data-speed]").textContent=T[0]===void 0?"Fix code":T[0]+" m/s",t.querySelector("[data-damage]").textContent=T[1]??"Fix code",t.querySelector("[data-config-errors]").innerHTML=_.map((L,H)=>L.kind==="preview"?"":`<p><button data-jump="${H}" data-line="${L.line}">${La[H]} \xB7 line ${L.line}</button> \u2014 ${b(L.message)}</p>`).join("");let j=_.some(L=>L.kind!=="preview");return t.querySelector("[data-stamina-drill]").disabled=a.disabled=m.disabled=k.disabled=t.querySelector("[data-drill]").disabled=t.querySelector("[data-roll-drill]").disabled=j,!j}t.querySelector("[data-config-errors]").addEventListener("click",_=>{let j=_.target.closest("[data-jump]");if(!j)return;let L=p[Number(j.dataset.jump)],H=L.value.split(`
`),G=Number(j.dataset.line)-1,ee=H.slice(0,G).reduce((pe,ue)=>pe+ue.length+1,0);L.focus(),L.setSelectionRange(ee,ee+(H[G]?.length||0))});for(let _ of p)_.addEventListener("input",()=>{t.querySelector('[data-explain="'+_.dataset.tune+'"] ol').innerHTML=Ke(_.dataset.tune,_.value),W(),f="ready",a.textContent="Start battle",an(_.dataset.tune,_.value),R(),s.textContent="Edited \xB7 start a fresh round to apply"});m.addEventListener("click",()=>{W(),f="ready",Z(),n.scrollIntoView({block:"nearest"})}),k.addEventListener("click",async()=>{if(!R())return;let _=t.querySelector("[data-export-status]");if(h?.loading||u?.loading){_.textContent="Wait for the character to finish opening, then download the kit.";return}try{await Ma(T[0],T[1],h?.model,u?.model,F,{cost:T[2],regen:T[3],attackCost:T[4]}),_.textContent="Kit downloaded. Extract battle_lab into your project folder."}catch{_.textContent="The kit could not be downloaded. Reload the page and try again."}});function q(_=!1,j=0){z(),hn(o,d,h,u,_,j),t.querySelector("[data-hp]").textContent=d.hp+"/3",t.querySelector("[data-enemy]").textContent=d.enemyHP+"/3";let L=t.querySelector("#stamina-meter");L.value=d.stamina;let H=Math.floor(d.stamina+1e-8);t.querySelector("[data-stamina]").textContent=H+" / 100",t.querySelector("[data-stamina-state]").textContent=d.stamina>=100?"Full":d.roll?"Rolling":d.attackTime!==null?"Attacking":d.rest>1e-8?"Resting":C.regen?"Recovering":"Recovery set to 0",t.querySelector("[data-reserve]").textContent="Shots fired: "+d.shotsFired+" \xB7 "+(d.stamina+1e-8>=C.cost?"Roll affordable":"Below roll cost")+" ("+C.cost+")";let G=t.querySelector("[data-stamina-notice]"),ee=d.denied?d.denied.action+" blocked \xB7 need "+d.denied.cost+" stamina":"";G.textContent!==ee&&(G.textContent=ee);let pe=t.querySelector("[data-strike]");pe.textContent!==d.lastStrike&&(pe.textContent=d.lastStrike);for(let ue of["player","enemy"]){let rt=d[ue+"Reaction"],go=rt?.kind==="death"?rt.time>=rt.duration?"Fallen":"Falling":rt?"Hit":ue==="player"&&d.roll?_t(d.roll)?"Roll \xB7 protected":"Roll \xB7 vulnerable":ue==="enemy"&&d.enemySwing?d.enemySwing.checked?"Recovering":"Winding up":"";t.querySelector("[data-"+ue+"-state]").textContent=go}}function W(){f==="playing"&&(f="paused",d.fireTap=d.rollTap=!1,i.clear(),cancelAnimationFrame(x),a.textContent="Resume battle",s.textContent="Paused")}function he(_){let j=Math.min(.1,(_-y)/1e3);w+=j,y=_;let L={stamina:C,player:h?.reactionDurations,enemy:u?.reactionDurations,swing:u?.attack,roll:{...F,duration:h?.rollDuration||.75}};for(;w>=1/60;)f==="practice"?Ga(d,1/60):dn(d,i,S,g,1/60,h?.attack,L),w-=1/60;if(q(d.walking&&!d.outcome,j),f==="practice"){Oa(d)?d.outcome&&(s.textContent=d.outcome+" \xB7 Final pose held"):x=requestAnimationFrame(he);return}d.outcome&&Oa(d)?(f="ended",i.clear(),a.textContent="Restart battle",s.textContent=d.outcome+" \xB7 Press R to restart"):x=requestAnimationFrame(he)}function se(_){cancelAnimationFrame(x),i.clear(),(f!=="practice"||!_)&&(d=Ye()),f="practice",a.textContent="Start battle",_&&!d.outcome&&cn(d,_,1,(_==="player"?h:u)?.reactionDurations),s.textContent=d.outcome||"Practice \xB7 "+(_?_+" hit":"ready"),w=0,y=performance.now(),q(),x=requestAnimationFrame(he)}for(let _ of t.querySelectorAll("[data-hit-target]"))_.addEventListener("click",()=>se(_.dataset.hitTarget));t.querySelector("[data-practice-reset]").addEventListener("click",()=>se(null));function Z(){if(cancelAnimationFrame(x),f==="playing"){W();return}if(f!=="paused"){if(!R())return;[S,g]=T,C={cost:T[2],regen:T[3],attackCost:T[4]},d=Ye(),t.querySelector("[data-compare]").textContent=v?"Previous round: "+v[0]+" m/s \xB7 "+v[1]+" damage. This round: "+S+" m/s \xB7 "+g+" damage.":"",v&&(v[2]!==C.cost||v[3]!==C.regen)&&(t.querySelector("[data-compare]").textContent+=" Roll cost: "+v[2]+" \u2192 "+C.cost+". Recovery: "+v[3]+" \u2192 "+C.regen+" points/s."),v&&v[4]!==C.attackCost&&(t.querySelector("[data-compare]").textContent+=" Attack cost: "+v[4]+" \u2192 "+C.attackCost+" points."),v=T.slice()}f="playing",s.textContent=d.staminaDrill?"Stamina drill \xB7 sentinel waiting":"Battle in progress",a.textContent="Pause battle",w=0,y=performance.now(),n.focus({preventScroll:!0}),q(),x=requestAnimationFrame(he)}for(let _ of t.querySelectorAll("[data-drill],[data-roll-drill]"))_.addEventListener("click",()=>{R()&&(W(),f="ready",Z(),d.ez=d.z-2.25,q(),n.scrollIntoView({block:"nearest"}))});t.querySelector("[data-stamina-drill]").addEventListener("click",()=>{R()&&(W(),f="ready",Z(),d.staminaDrill=!0,s.textContent="Stamina drill \xB7 sentinel waiting",n.scrollIntoView({block:"nearest"}))}),a.addEventListener("click",Z),n.addEventListener("keydown",_=>{if(_.code==="KeyR"&&f==="ended"){_.preventDefault(),Z();return}if(_.code==="Escape"){W();return}f==="playing"&&$a.has(_.code)&&(_.preventDefault(),i.add(_.code),_.code==="Space"&&!_.repeat&&(d.fireTap=!0),_.code.startsWith("Shift")&&!_.repeat&&(d.rollTap=!0))}),n.addEventListener("keyup",_=>{$a.has(_.code)&&(_.preventDefault(),i.delete(_.code))}),n.addEventListener("blur",_=>{_.relatedTarget!==a?W():i.clear()});for(let _ of t.querySelectorAll("[data-control]"))_.addEventListener("pointerdown",j=>{f==="playing"&&(j.preventDefault(),n.focus({preventScroll:!0}),_.setPointerCapture(j.pointerId),i.add(_.dataset.control),_.dataset.control==="Space"&&(d.fireTap=!0),_.dataset.control==="ShiftLeft"&&(d.rollTap=!0))}),_.addEventListener("lostpointercapture",()=>i.delete(_.dataset.control));return t.addEventListener("focusout",_=>{t.contains(_.relatedTarget)||W()}),window.addEventListener("blur",W,l),document.addEventListener("visibilitychange",()=>{document.hidden&&W()},l),window.addEventListener("storage",_=>{let j=p.find(L=>_.key==="battle-lab.code.v1."+L.dataset.tune);j&&j!==document.activeElement&&(W(),f="ready",a.textContent="Start battle",j.value=Be(j.dataset.tune),t.querySelector('[data-explain="'+j.dataset.tune+'"] ol').innerHTML=Ke(j.dataset.tune,j.value),R())},l),h=Zt(t,q,()=>{W(),d.roll=null,d.attackTime=null,d.attackReleased=!1}),u=Zt(t,q,()=>{W(),d.enemySwing=null},"enemy"),R(),q(),()=>{h.dispose(),u.dispose(),c.abort(),cancelAnimationFrame(x),i.clear()}}var za={KeyW:"W",KeyA:"A",KeyS:"S",KeyD:"D",Space:"Fire",ShiftLeft:"Roll"},Vo=["Move with W, A, S or D.","Fire one shot with Space.","Roll with Shift.","Training complete."],Oe=!1,Ua="battle-lab.large-hud.v1";function Wa(){return'<section class="code-lab menu-practice" tabindex="-1"><h3>Test the game menu</h3><details class="appearance-controls"><summary>Try your own menu art</summary><p>Preview an image on the lobby, settings screen and training banner. The file stays in this browser tab.</p>'+ft("Background image","image/png,image/jpeg,image/webp","data-preview-art")+'<label><input type="checkbox" data-preview-sparks checked> Show drifting particles</label><button class="secondary" data-reset-art>Restore sample image</button><small data-art-message role="status"></small></details><div data-menu-screen></div></section>'}function qa(e){let t=e.querySelector("[data-menu-screen]");if(!t)return;try{Oe=localStorage.getItem(Ua)==="true"}catch{}let n=e.querySelector("[data-preview-art]"),o=gt(n),a=e.querySelector("[data-art-message]"),s="",i=()=>{s&&URL.revokeObjectURL(s),s="",t.style.removeProperty("--menu-image")};n.onchange=async()=>{let p=n.files[0];if(!p)return;if(!["image/png","image/jpeg","image/webp"].includes(p.type)){a.textContent="Choose a PNG, JPG or WebP image.";return}let m=URL.createObjectURL(p),k=new Image;k.src=m;try{if(await k.decode(),!t.isConnected||n.files[0]!==p){URL.revokeObjectURL(m);return}i(),s=m,t.style.setProperty("--menu-image",'url("'+m+'")'),a.textContent="Showing "+p.name}catch{URL.revokeObjectURL(m),a.textContent="This image could not be opened. Try another file."}},e.querySelector("[data-reset-art]").onclick=()=>{o(),i(),a.textContent="Sample image restored."},e.querySelector("[data-preview-sparks]").onchange=p=>t.classList.toggle("no-sparks",!p.target.checked);let c,l,h,u,d,f,S=new Set,g=(p,m)=>'<button class="secondary" data-menu="'+p+'">'+m+"</button>";function x(p,m=!0){if(cancelAnimationFrame(c),S.clear(),l=p,t.dataset.mode=l,l==="lobby")t.innerHTML='<h4>Relay Arena</h4><div class="menu-buttons">'+g("battle","Start battle")+g("tutorial","Tutorial")+g("settings","Settings")+"</div>";else if(l==="settings")t.innerHTML='<h4>HUD settings</h4><label><input type="checkbox" data-large> Large HUD text</label><p class="menu-hud">SCOUT 3/3 \xB7 SENTINEL 3/3</p><p data-save role="status">Changes save in this browser.</p>'+g("lobby","Back to lobby"),t.querySelector("[data-large]").checked=Oe;else{let P=function(O){for(f+=Math.min((O-d)/1e3,.1),d=O;f>=1/60;){let R=h.shotsFired;dn(h,S,4,1,1/60),h.training&&(u===0&&h.walking&&!h.roll&&Math.hypot(h.x,h.z-D)>.25||u===1&&h.shotsFired>R||u===2&&h.roll)&&u++,f-=1/60}hn(v,h,null,null,h.walking,0),T.textContent="SCOUT "+h.hp+"/3 \xB7 "+(h.training?"":"SENTINEL "+h.enemyHP+"/3 \xB7 ")+"STAMINA "+Math.floor(h.stamina);let z=h.training?Vo[u]:h.outcome||"WASD to move \xB7 Space to fire \xB7 Shift to roll";C.textContent!==z&&(C.textContent=z),h.training&&(F.disabled=u<3),h.outcome||(c=requestAnimationFrame(P))};h=Ye(),h.training=l==="tutorial",u=0,t.innerHTML="<h4>"+(h.training?"Tutorial":"Relay Arena")+'</h4><p class="menu-hud"></p><p data-prompt role="status"></p><canvas width="640" height="440" tabindex="0" aria-label="Arena. WASD moves, Space fires, Shift rolls."></canvas><div class="touch-controls">'+Object.entries(za).map(([O,z])=>'<button data-key="'+O+'">'+z+"</button>").join("")+'</div><div class="menu-buttons">'+g("lobby","Back to lobby")+g("battle",h.training?"Enter battle":"Restart battle")+"</div>";let k=t.querySelector("canvas"),v=k.getContext("2d"),T=t.querySelector(".menu-hud"),C=t.querySelector("[data-prompt]"),F=t.querySelector("[data-menu=battle]");F.disabled=h.training;let D=h.z;d=performance.now(),f=0,P(d),k.focus({preventScroll:!0})}if(l!=="battle"){let k=l==="tutorial"?t.querySelector("[data-prompt]"):t,v=document.createElement("span");v.className="menu-dust",v.setAttribute("aria-hidden","true");for(let T=0;T<10;T++){let C=document.createElement("i");C.style.setProperty("--i",T),v.append(C)}if(l==="tutorial"){let T=document.createElement("div");T.className="training-banner",k.replaceWith(T),T.append(v,k)}else k.prepend(v)}t.classList.toggle("large-hud",Oe),m&&(l==="settings"||l==="lobby")&&t.querySelector("input,button").focus({preventScroll:!0})}t.onclick=p=>{let m=p.target.closest("[data-menu]");m&&x(m.dataset.menu)},t.onchange=p=>{if(!p.target.matches("[data-large]"))return;Oe=p.target.checked,t.classList.toggle("large-hud",Oe);let m="Saved in this browser.";try{localStorage.setItem(Ua,String(Oe))}catch{m="Applied for this session."}t.querySelector("[data-save]").textContent=m};function y(p,m){S.add(p),!m&&p==="Space"&&(h.fireTap=!0),!m&&p==="ShiftLeft"&&(h.rollTap=!0)}t.onkeydown=p=>{let m=p.code==="ShiftRight"?"ShiftLeft":p.code;p.target.tagName==="CANVAS"&&m in za&&(p.preventDefault(),y(m,p.repeat))},t.onkeyup=p=>S.delete(p.code==="ShiftRight"?"ShiftLeft":p.code),t.onfocusout=()=>S.clear(),t.onpointerdown=p=>{let m=p.target.closest("[data-key]");m&&(p.preventDefault(),t.querySelector("canvas").focus({preventScroll:!0}),m.setPointerCapture(p.pointerId),y(m.dataset.key,!1))},t.onlostpointercapture=p=>S.delete(p.target.dataset.key);let w=()=>S.clear();return window.addEventListener("blur",w),x("lobby",!1),()=>{i(),cancelAnimationFrame(c),window.removeEventListener("blur",w)}}var kt=(e,t,n,o,a,s)=>({id:e,title:t,image:n,caption:o,directions:a,expected:s,body:a.join(`
`)}),pn={file:"res://scripts/gamepad_check.gd",lines:[{code:"var devices := Input.get_connected_joypads()",meaning:"Ask Godot for the device IDs of connected controllers. The diagnostic checks this list on every frame, so you can leave it running while you reconnect."},{code:"if devices.is_empty():",meaning:"When the list has no IDs, display the connection instructions. This gives you a useful checkpoint even if you are completing the lesson with a keyboard."},{code:"if Input.is_joy_button_pressed(device, index):",meaning:"Read one button on one device. The diagnostic adds its Xbox-style label to that device\u2019s row while the button is held."}]},Va={id:"gamepad-setup",title:"Set up and test a gamepad",minutes:14,concept:"The same action can have several inputs. In the solo arena, pressing Space or the left face button fires a pulse. First confirm that Godot sees the device, then inspect the binding that connects the physical button to the action. If you have a keyboard only, follow the keyboard checkpoints through this lesson.",analogy:"Blender can run the same command from a menu or a shortcut. A Godot action likewise lets a keyboard key and a controller button ask the game to do the same thing.",diagram:["Connect the device \u2192 check its ID","Input Map \u2192 bind an action","Run a round \u2192 observe the result"],steps:[kt("connect","Connect a controller and open the reference project","setup/project-manager","Godot Project Manager \xB7 Choose Import to open the complete reference game for this input test.",["For USB, plug the controller into a data-capable cable. For Bluetooth, use a controller model that supports it. On an Xbox Wireless Controller, power it on, then hold the Pair button on its top edge until the Xbox light flashes rapidly.","Windows 11: open Start \u2192 Settings \u2192 Bluetooth & devices \u2192 Add device \u2192 Bluetooth. macOS: open Apple menu \u2192 System Settings \u2192 Bluetooth, find the pad under Nearby Devices and click Connect. For another controller brand, follow its pairing instructions.","Download the project ZIP from this lesson and extract it. In Godot 4.4.1 Project Manager click Import and select its project.godot. Use the finished reference project for this test. Keyboard only? Open the same project and continue to the disconnected-device check."],"Godot opens the reference game. FileSystem contains scenes/gamepad_check.tscn. A Bluetooth user also sees the controller connected in system settings."),kt("diagnostic","Read the device, stick and buttons","gamepad/diagnostic","Godot input diagnostic \xB7 This capture shows the waiting state. A connected pad adds a device row and live input values.",["In FileSystem expand scenes and double-click gamepad_check.tscn. Press F6 to run the current scene and click inside the game window. On a laptop hold Fn with the function key if needed.","Read your controller\u2019s name and device ID. Tilt the left stick right, release it, then hold and release the left face button (Xbox X). Watch the X-axis value rise and return near zero, and watch the button label appear and disappear.","Keyboard only: read \u201CNo gamepad detected,\u201D then press and release a keyboard key. Confirm the diagnostic still reports no controller. Press F8 to stop before editing the project."],"With a pad, the displayed row changes as you move and press. With a keyboard only, you can identify the expected no-device state."),kt("binding","Inspect and try a second fire binding","gamepad/input-map","Godot Project Settings \xB7 Expand fire to compare its key and joypad events. Use the + on that row to add an input.",["Open Project \u2192 Project Settings \u2192 Input Map and expand fire. Find the Space key and Joypad Button 2, the Xbox X position. Each event activates the same action in the solo arena.","In this reference copy click + beside fire. Press a spare shoulder button, or the J key for the keyboard exercise, then click OK. Close Project Settings. In FileSystem open scenes/arena.tscn, press F6 and click the game. Try the original and the new binding separately, waiting between shots.","Press F8. Reopen the fire row and remove the binding you just added. Keep both original events. If your pilot creeps when the stick is at rest, try increasing the deadzone on each of the four move_ actions slightly and test the same scene again."],"Both tested bindings can fire a pulse. After cleanup, expanding fire shows the supplied keyboard and joypad bindings."),kt("arena","Run a solo round and return to your work","course-shots/arena-fire","Godot game \xB7 Aim the scout and fire. A pulse in flight confirms the fire action before any resulting HP change.",["Run scenes/arena.tscn with F6. Point the left stick to move and face the sentinel, then press Xbox X to fire. Tap B to roll and watch the stamina drop. When the round ends, press Y to restart. On an Xbox-style layout X is the left face button, B the right and Y the top.","Keyboard path: use WASD to move and aim, Space to fire, Shift to roll and R after the round ends. Confirm the same movement, pulse, stamina change and fresh starting health. Press F8 to stop.","For the next movement lesson, reopen Battle Lab Work, the project where you built Player and its movement script. Module 7 returns to this reference game to assign controllers in local and network duels."],"A new round begins with fresh HP. You know which input runs each solo action and which project to open for animation blending.")],files:["scenes/gamepad_check.tscn","scripts/gamepad_check.gd","scripts/gamepad.gd"],walkthrough:pn.lines.map(({code:e,meaning:t})=>({line:e,explanation:t})),question:"Godot shows the pad\u2019s name and the X button responds in the diagnostic. Where can you check whether that button fires in the solo arena?",options:["Scene \u2192 New Scene","Project Settings \u2192 Input Map \u2192 fire","The animation clip list"],answer:1,feedback:"The diagnostic reads raw inputs. The fire action in Input Map connects that button to the solo arena\u2019s firing code.",troubleshooting:[{symptom:"USB powers the controller but the diagnostic stays empty.",fix:"Try a USB data cable and another port. For Bluetooth, check that this controller model supports Bluetooth, finish pairing in the operating system, and leave the diagnostic open while reconnecting."},{symptom:"The diagnostic sees my pad but a face button has an unexpected label.",fix:"This lesson uses Xbox-style positions. Test the physical left, right and top buttons one at a time. Check the labels in the diagnostic and add the reported button to the solo action in Input Map if needed."},{symptom:"I can move the menu highlight but cannot control the pilot.",fix:"Use the mouse or keyboard to choose a gameplay mode. Click the running game window and move the stick after the round starts. In a network match, both pilots must accept the ready check and enter the arena."}],references:[{label:"Godot 4.4 controller input and troubleshooting",url:"https://docs.godotengine.org/en/4.4/tutorials/inputs/controllers_gamepads_joysticks.html"},{label:"Windows device setup",url:"https://support.microsoft.com/en-us/windows/hardware/add-a-hardware-device-to-a-windows-device"},{label:"Compatible Xbox models for Apple devices",url:"https://support.apple.com/en-us/111101"},{label:"Mac controller setup",url:"https://support.apple.com/guide/games/connect-a-game-controller-devf8cec167c/mac"}]};var Xe=(e,t,n,o,a,s)=>({id:e,title:t,image:n,caption:o,directions:a,body:a.join(`
`),expected:s}),Ka={file:"res://scripts/hit_rumble.gd",lines:[{code:'var own_slot := 1 if mode == "client" else 0',meaning:"The host controls P1 (slot 0). The guest controls P2 (slot 1). Each computer works this out locally."},{code:'if mode in ["host", "client", "bot"] and target == own_slot:',meaning:"Only the computer controlling the pilot who lost health continues to its gamepad."},{code:"Input.start_joy_vibration(device, strength, strength, duration)",meaning:"Send a pulse to this local device ID. The two strength arguments drive its weak and strong motors. Duration is measured in seconds."}]},un={id:"duel-hit-rumble",title:"Vibrate the hit player\u2019s gamepad",minutes:15,concept:"Both players see the sparks. Only the player who took damage should feel the impact. Use the target already confirmed by the host, then choose a controller from the devices attached to this computer.",analogy:"The hit flash works like a visible animation track for the audience. The vibration is a separate cue addressed to one performer.",diagram:["Host confirms which pilot lost HP","Each computer checks who owns that pilot","The hit player\u2019s local pad receives one pulse"],steps:[Xe("connect","Check one controller on each computer","gamepad/diagnostic","Godot input diagnostic \xB7 A connected controller adds its name, device ID and live input values.",["Download the updated Godot reference project on both computers and extract it. In Godot 4.4.1 click Import, select project.godot and open the project. Connect one vibration-capable controller per computer.","In FileSystem double-click scenes/gamepad_check.tscn and press F6. Move the left stick and press Xbox X. Look for those inputs beside your controller\u2019s name on each computer. Press F8. If the list is empty, follow the Gamepad setup lesson linked above."],"Both players can identify their own pad in Godot. Device IDs belong to the computer that lists them."),Xe("strength","Set the force on the duel scene","duel-rumble/strength","Godot Inspector \xB7 Select Duel \u2192 HitRumble and edit Strength. Both motors use this value.",["In FileSystem open scenes/duel.tscn. In the Scene dock expand Duel and click HitRumble. In the right-hand Inspector find Strength and Duration.","Start with Strength at 0.55. Click its number, enter 0.85, press Enter and save with Ctrl+S or \u2318S. Keep Duration at 0.18 for this comparison. A value of 0 mutes this computer\u2019s impact vibration."],"HitRumble displays the saved strength. Switching between the pilots leaves their existing HitFX scenes intact."),Xe("duration","Lengthen one pulse","duel-rumble/duration","Godot Inspector \xB7 Duration is in seconds. Compare 0.18 s with 0.35 s while keeping Strength fixed.",["With HitRumble still selected, edit Duration from 0.18 to 0.35 and press Enter. Save duel.tscn. Keep Strength fixed while comparing the two lengths in the match.","For matching settings, give your friend the saved project or enter the same values on both computers. You can also choose a softer setting on your own computer."],"The Inspector shows a 0.35-second pulse. Each computer uses its own saved values when its pilot is hit."),Xe("route","Connect vibration to confirmed damage","duel-rumble/routing","Godot Script editor \xB7 Follow the target check and the local device ID to start_joy_vibration.",["Using an older copy of the previous 3D duel? Copy scripts/hit_rumble.gd from the download into its scripts folder. Open duel.tscn, select Duel, click Add Child Node (+), choose Node and rename it HitRumble. Drag hit_rumble.gd from FileSystem onto HitRumble and save. In the supplied project this node and script are already attached.","Open scripts/duel.gd. Find func _play_hit(target and locate $HitRumble.play_hit(target, mode) directly below the HitFX call. This is the connection to add when upgrading your own duel copy. The reference project already includes it.","Click the script icon beside HitRumble. In device_for_hit(), compare target with own_slot. A guest owns slot 1 even when their local controller is device 0. In play_hit(), find Input.start_joy_vibration and trace its last argument back to Duration.","Try the connection yourself. In duel.gd comment out only the $HitRumble.play_hit line on one computer, save and run the paired test below. Restore the line and save before the final run."],"Commenting out that line silences the local impact while damage and sparks still work. Restoring it reconnects the pulse."),Xe("pair","Trade one hit in each direction","duel-hit/paired","Godot network match \xB7 P2 has hit P1. Both screens show P1 at 2/3 HP. In this case the host should feel the pulse.",["Both players open duel.tscn and press F6. Choose Network PvP. P1 clicks Host a match. P2 enters the host\u2019s reachable IP and clicks Join host. Both choose Ready, wait for loading, click Enter arena and wait for the countdown.","Stay at spawn. P1 taps X once (or Space). When P2 goes from 3 to 2 HP, both see the flash and only P2\u2019s pad should pulse. Wait for it to stop. P2 then taps X once. Only P1\u2019s pad should pulse as P1 drops to 2 HP.","Turn away briefly and fire into empty space. Both health values should hold and both pads should stay quiet. To compare settings, stop with F8, change just one Inspector value on the receiving computer, save, rejoin and repeat the same shot. Try Strength 0 once and check that the visible hit still plays."],"Each player feels only the hits they take. A miss produces no pulse, and one hit stops vibrating after the selected duration.")],files:["scenes/duel.tscn","scripts/duel.gd","scripts/hit_rumble.gd","scripts/gamepad.gd"],question:"P2 fires and the host confirms damage to P1. Which controller should receive the vibration call?",options:["The host\u2019s local P1 controller","The guest\u2019s local P2 controller","Every controller on both computers"],answer:0,feedback:"P1 took the damage and belongs to the host. Both computers still play the visible hit.",troubleshooting:[{symptom:"Inputs work, but I feel no vibration.",fix:"Test with a known rumble-capable pad and check vibration in its device settings. Try a USB data cable. Open the native Godot project, check Strength is above 0 on the receiving computer and confirm its pilot actually lost HP."},{symptom:"The shooter or a spare pad vibrates.",fix:"Check the target passed from _play_hit. Use the same first local pad that moves your network pilot. Disconnect extra pads for the two-computer exercise. In same-computer Local PvP, a single pad belongs to P2."}],references:[{label:"Godot 4.4 \xB7 start_joy_vibration",url:"https://docs.godotengine.org/en/4.4/classes/class_input.html#class-input-method-start-joy-vibration"}]};var Le=(e,t,n,o,a,s)=>({id:e,title:t,image:"duel-hit/"+n,caption:o,directions:a,body:a.join(`
`),expected:s}),mn={file:"res://scripts/duel.gd",lines:[{code:"var target := 1 - owner_slot",meaning:"The shot carries the shooter\u2019s slot. If P1 fires, the target slot is 1, which selects Pilot2."},{code:"if nearest.distance_to(positions[target]) <= 0.55:",meaning:"The host checks the path traveled by the pulse against the opponent\u2019s position. A miss continues along its path."},{code:"_confirm_hit(target)",meaning:"After contact, the game enters this function to subtract one HP from the target. The spent pulse is removed."},{code:"_play_hit(target)",meaning:"Immediately after subtracting HP, play the local effect on the pilot that took damage."},{code:"network.broadcast_hit(target)",meaning:"In host mode, tell the guest which pilot to animate."},{code:'pilots[target].get_node("HitFX").play_hit()',meaning:"Both games resolve the target slot to their own Pilot1 or Pilot2 and start the shared visual effect on that pilot."}]},fn={id:"duel-hit-effects",title:"Share a 3D hit effect across a network duel",minutes:25,concept:"A shot can miss. The host decides when a pulse reaches a pilot, subtracts health, and tells each game which pilot was hit. Each computer then plays its own copy of the same particle burst and keyed flash. The guest sees the effect when the message arrives.",analogy:"Like placing the same linked effect collection on two Blender characters, one shared scene defines the look. Each pilot has its own emitter and animation playback.",diagram:["Pulse crosses the opponent \u2192 host confirms","Host plays HitFX + sends the target slot","Guest receives confirmation \u2192 same pilot flashes"],steps:[Le("attach","Instance the effect under each pilot","placement","Godot Scene dock \xB7 Each pilot owns one child named HitFX. Open the shared effect scene to edit both copies.",["Download the Godot project from this page, extract it, then click Import in the Godot 4.4.1 Project Manager. Select project.godot. In FileSystem double-click scenes/duel.tscn. Expand Duel \u2192 Pilot1 and Pilot2 in the Scene dock. The finished sample has a HitFX child on each pilot.","Practice attaching one in a copy. Choose Scene \u2192 Save Scene As and save scenes/my_duel.tscn. Select Pilot2 \u2192 HitFX, remove that instance, then select Pilot2. Click Instantiate Child Scene (chain icon) above the tree, search duel_hit.tscn and open it. Keep the child named HitFX and its local position at (0, 0, 0). Save.","Press F6 on my_duel.tscn. Choose Local PvP, keep both pilots at spawn, and tap Space once. The pulse hits P2. Press F8 to stop."],"Sparks and a flash appear on P2. P1 stays at full health while P2 drops from 3 to 2."),Le("burst","Give the 2D sparks a 3D emitter","particles","Godot Inspector \xB7 Select Burst in duel_hit.tscn. Amount changes the number of 3D sparks and Lifetime changes how long they remain.",["In FileSystem open scenes/duel_hit.tscn and select HitFX \u2192 Burst. In the earlier 2D scene the emitter drew marks on a canvas. Here Burst is a CPUParticles3D node with a mesh for each spark. Its parent places it on the pilot in world space.","Under Inspector find Amount, then expand Time to find Lifetime and One Shot. Start with Amount 12, Lifetime 0.35 seconds and One Shot on. Change only Amount to 36 and save.","Select the my_duel.tscn tab before F6. Run Local PvP, tap Space from spawn, and compare the denser spray on P2. To test the other instance, tap Enter to fire from P2 toward P1. Stop with F8. Restore Amount to 12 or keep your preferred count and save. Burst uses a fixed seed so both copies can reproduce the same spray."],"One shot produces one burst at the pilot that lost health. Both pilot instances use the same saved particle settings."),Le("flash","Key the flash mesh at the impact peak","animation","Godot Animation panel \xB7 Select the middle key on the Flash scale track. Its three components control the size of the 3D flash.",["Return to scenes/duel_hit.tscn. Select AnimationPlayer. In the bottom Animation panel choose hit_flash, expand Flash and locate the scale track. Scrub to 0.00, 0.08 and 0.24 seconds. The clip changes a separate mesh at the impact point.","Click the 0.08 s key. Set its Inspector Value to (1.6, 1.6, 1.6) and keep the first and last keys at (1, 1, 1). Save. Run my_duel.tscn again, fire one shot and compare the larger flash. The shot still removes one health point.","Open scripts/duel_hit.gd in FileSystem. Follow play_hit() to the burst and animation restart, then find clear_hit(). It clears leftover visuals when a round resets. Save the project before sharing it with your friend."],"The flash swells briefly on contact. The pilot\u2019s gameplay size and the 0.55 m hit distance stay the same."),Le("confirm","Hook playback to a confirmed hit","authority","Godot Script editor \xB7 duel.gd lines 190\u2013193 test contact. Lines 275\u2013284 subtract HP and play the effect on the target.",["Open scripts/duel.gd. Find tick_pair() with Find (Ctrl+F or \u2318F). Locate the nearest.distance_to check. Follow the successful branch into _confirm_hit(target), then locate hp[target] -= 1 inside that function. The guest sends its fire input to the host; the host runs this collision test.","Try a reversible wiring edit in this extracted copy. Put # at the start of the _play_hit(target) call inside _confirm_hit. Leave the HP subtraction in place. Save, run Local PvP and tap Space at spawn. P2 still loses one HP and its existing ground ring can pulse, but the new sparks and flash are absent. Stop, remove the #, save and repeat.","Find _confirm_hit and _play_hit in duel.gd. The local game selects the target pilot\u2019s HitFX child and calls play_hit(). In host mode it also sends the confirmed target through Network. Keep the call in the successful hit branch once."],"Restoring that single line restores the burst and flash on a landed shot. Pressing fire by itself produces a traveling pulse."),Le("receive","Trace the same hit on the guest","guest","Godot Script editor \xB7 duel_network.gd lines 136\u2013144 send and receive the hit. In duel.gd line 66 connects the received target to _play_hit.",["Open scripts/duel_network.gd and find broadcast_hit(). The host sends the target slot and the current phase number to its guest. Find _receive_hit() and the @rpc declaration directly above it. Authority restricts this call to the host. Reliable delivery preserves the order of the hit messages on their channel.","Follow the receiver\u2019s live-phase check. An old round\u2019s message must not play in a new round. After the receiver emits hit_received, open duel.gd and find network.hit_received.connect(_play_hit) in _ready(). This path plays HitFX on the received target. Regular movement and HP snapshots keep updating the displayed match state.","Save all scenes and scripts. Give your friend the same project folder or ZIP, including your changed duel_hit.tscn. Each computer draws the local scene it has on disk, so share new visual settings with both players before comparing."],"You can trace one target slot from host collision to guest playback. Repeated position or HP snapshots do not start the burst again."),Le("pair","Compare a miss, a hit and a fresh round on both computers","paired","Godot playtest \xB7 In this reverse-direction test P2 hit P1. Both windows show sparks on P1 and P1 at 2/3 HP.",["Each player imports the same project, opens scenes/duel.tscn and presses F6. Choose Network PvP on both. P1 clicks Host a match. P2 enters P1\u2019s LAN IP and clicks Join host. Across different homes, use the reachable VPN or forwarded address from the internet-duel lesson. Both click Ready, wait for the load, click Enter arena and wait for the countdown.","Test a miss first. P1 briefly taps W to face away from P2, then taps Space. Both screens should show a pulse leaving, with no sparks on either pilot and both at 3 HP. Tap D briefly to face the other pilot again. If you moved too far sideways, line up the pilots along the same lane.","P1 taps Space once and releases it. Both players look at P2 for one burst and one flash, followed by the same P2 health of 2. Wait a second without shooting and check that no extra burst appears. Repeat in the reverse direction with P2 firing. The screenshot shows this reverse shot from full health. On gamepad, aim with the left stick and tap X to fire.","Let P1 finish P2, compare the round score and click Next round on both. Win a second round for P1, compare the same final 2\u20130 result, then have both choose Rematch. Accept and load again. Check both pilots at 3 HP and the score at 0\u20130 before the first new shot. Stop both games with F8."],"Both games identify the same damaged pilot, show the same effect on that pilot and agree on the score. A fresh round begins with no leftover burst.")],files:["scenes/duel.tscn","scenes/duel_hit.tscn","scripts/duel_hit.gd","scripts/duel.gd","scripts/duel_network.gd"],question:"P2 presses fire, but the pulse goes past P1. When should the guest see HitFX on P1?",options:["Immediately on P2\u2019s input","When a later HP snapshot arrives with any value","Only when the host confirms a hit on P1"],answer:2,feedback:"The host confirms contact and sends the target. A miss produces no hit event.",troubleshooting:[{symptom:"P2 loses HP but its new effect is missing.",fix:"Select Pilot2 in scenes/duel.tscn. Check the child is named HitFX and uses scenes/duel_hit.tscn. Restore _play_hit(target) inside _confirm_hit and check that tick_pair calls _confirm_hit on contact. Check the Debugger for a missing child or animation."},{symptom:"The guest sees sparks on a miss or two bursts for one hit.",fix:"Check that the guest starts the new effect only from the confirmed-hit event. Remove extra calls added to input handling or apply_snapshot(). Keep one receiver connection in _ready()."},{symptom:"The sparks have different sizes or counts.",fix:"Both stop with F8 and reopen the same saved project version. Check Burst \u2192 Amount and the middle Flash scale key in both copies. Network delivery can shift the time the guest first sees the effect."},{symptom:"The computers cannot join.",fix:"Start one host on UDP 7000 and enter its reachable numeric IP on the guest. For different homes, open the Module 7 internet-duel lesson and follow its connection checks."}],references:[{label:"Godot 4.4 multiplayer authority, delivery modes and channels",url:"https://docs.godotengine.org/en/4.4/tutorials/networking/high_level_multiplayer.html"},{label:"CPUParticles3D properties",url:"https://docs.godotengine.org/en/4.4/classes/class_cpuparticles3d.html"}],walkthrough:mn.lines.map(({code:e,meaning:t})=>({line:e,explanation:t}))};var Je="scenes/hit_feedback.tscn",St="scripts/hit_feedback.gd",ie=(e,t,n,o,a,s)=>({id:e,title:t,image:"hit-feedback/"+n,caption:o,directions:a,body:a.join(`
`),expected:s}),gn="Download the reference project on this page and extract the ZIP. In the Godot 4.4.1 Project Manager click Import, open the extracted project.godot, and wait for the editor to finish importing. In FileSystem double-click scenes/hit_feedback.tscn.",ae=(e,t)=>({code:e,meaning:t}),je=(e,t)=>({symptom:e,fix:t}),Ze={"effects-particles":{file:"res://"+Je,lines:[ae("amount = 12","The emitter can draw twelve particles during this emission cycle. Changing Amount changes the density of the impact."),ae("lifetime = 0.35","Lifetime is measured in seconds. Shorter-lived sparks disappear closer to the impact when their starting speeds stay the same."),ae("one_shot = true","Each trigger plays one emission cycle. Another confirmed hit can restart the burst.")]},"effects-animation":{file:"res://"+Je,lines:[ae('resource_name = "hit_flash"',"This is the clip the script plays when the target is hit."),ae("length = 0.24","The clip spans 0.24 seconds from the starting pose to the return pose."),ae('tracks/0/path = NodePath("Target:scale")',"This property track writes scale values to the node named Target. Its keys specify how large the target should be at particular times.")]},"effects-hit":{file:"res://"+St,lines:[ae("signal hit","The scene declares one event that the effect can listen for."),ae("hit.connect(_play_hit)","Connect the hit signal to a function once when the scene opens. The same connection works for later hits."),ae("hit.emit()","Publish a confirmed contact. The connected effect function runs for this hit."),ae("burst.restart()","Reset the particle simulation so a rapid second hit starts a fresh burst."),ae('animation.play(&"hit_flash")',"The preceding stop rewinds the player. Play starts the named clip again on this contact.")]}},xt={title:"Game Effects in Godot",description:"Build a particle burst, key a hit animation, and make them replay together when a shot hits.",lessons:[{id:"effects-particles",title:"Build a one-shot particle burst",minutes:15,concept:"A particle is one small moving mark, such as a spark. An emitter creates a group of those marks. This 2D exercise uses CPUParticles2D to draw sparks over a target. Amount sets their number, Lifetime sets how long they survive, and One Shot lets the burst end on its own.",analogy:"Treat the emitter like a Blender particle emitter attached at a point. Moving the emitter changes where the sparks originate. Changing Amount changes how many it produces.",diagram:["Confirm a hit at the target","Burst emits a group of sparks","Each spark expires after its Lifetime"],steps:[ie("find","Find and replay the emitter","particles","Godot editor \xB7 Select Burst in the Scene dock to see the settings for one emission cycle.",[gn,"Press F6 to run the open scene. Click Trigger hit, watch the sparks around the target, then click again. Press F8 to return to the editor. Expand HitFeedback in the Scene dock, select Burst, and find Amount and Time in the Inspector."],"A short spray appears at each hit. Between hits the target sits still and the emitter is quiet."),ie("attach","Add a particle node to your own copy","add-particles","Godot Create New Node \xB7 Type CPUParticles2D, select the matching row, then click the outlined Create button.",["Choose Scene \u2192 Save Scene As and save scenes/my_hit_feedback.tscn. In the Scene dock rename Burst to ReferenceBurst with F2. Select HitFeedback, click + (Add Child Node), search CPUParticles2D and click Create. Rename the new child Burst. The script now finds this emitter by name.","With the new Burst selected, set Transform \u2192 Position to X 500, Y 310, the center of the target. Turn Emitting off. Set Amount to 12 and, under Time, set Lifetime to 0.35, One Shot on and Explosiveness to 1.0. This releases the group together when triggered.","Open Direction and set Spread to 180 degrees. Set Gravity to (0, 0). Set the Initial Velocity minimum to 420 and maximum to 510 pixels per second. Under Scale set the scale amount minimum to 4 and maximum to 7. Save, press F6 and click Trigger hit. Your new sparks use the default white color. To match the sample, use the Color field to choose amber."],"The new emitter sprays sparks outward from the center and stops. ReferenceBurst stays quiet. Press F8 to edit again."),ie("tune","Compare density and duration separately","particle-compare","Godot playtest \xB7 Compare two captures of the same burst. Change a single Inspector field between your own runs.",["In the Local Scene tree of my_hit_feedback.tscn select Burst. With Lifetime at 0.35 s, change Amount from 12 to 36. Press Enter, save, press F6 and click Trigger hit. Look for more sparks around the same target. Press F8.","Keep Amount at 36 and change only Lifetime from 0.35 to 0.65 s. Save and trigger the hit again. Watch how long the last sparks remain. For the original appearance, restore Amount to 12 and Lifetime to 0.35."],"Increasing Amount makes the group denser. Increasing Lifetime at the same speed keeps the sparks visible longer.")],files:[Je,St],question:"The spark count looks right, but the effect lingers too long. Which change should you try first?",options:["Increase Amount","Shorten Lifetime","Move the target"],answer:1,feedback:"Lifetime controls each particle\u2019s time on screen. Keep the other values fixed when comparing two lengths.",troubleshooting:[je("The Inspector shows a script resource.","Click Burst in the Scene dock. FileSystem selects the saved file. The Scene dock selects the emitter whose properties you can edit."),je("My copied emitter stays quiet.","Check the name Burst and its parent HitFeedback. Press F6 on the copy and click Trigger hit. F5 launches the main arena.")],references:[{label:"CPUParticles2D properties",url:"https://docs.godotengine.org/en/4.4/classes/class_cpuparticles2d.html"}]},{id:"effects-animation",title:"Key a hit flash with AnimationPlayer",minutes:18,concept:"AnimationPlayer changes properties over time. A track names one property on a node. A key stores its value at one moment, and the player fills the time between keys. In hit_flash, one track briefly enlarges the target and another changes its tint.",analogy:"The Animation panel works like a small Dope Sheet. Scale and Modulate have separate rows. Scrubbing the playhead lets you inspect the pose at the contact instant.",diagram:["Choose the hit_flash clip","Peak the scale at 0.08 s","Return to resting size at 0.24 s"],steps:[ie("inspect","Scrub the supplied animation","animation","Godot editor \xB7 Choose AnimationPlayer and hit_flash. Each diamond belongs to the property listed on its row.",[gn,"Click AnimationPlayer in the Scene dock. At the bottom open Animation and select hit_flash in the clip list. Expand Target\u2019s tracks if needed. Click the time ruler at 0.00, 0.08 and 0.24 seconds. Watch both the target size and its tint in the 2D viewport."],"The target starts at normal size, swells briefly, then returns to its original size. Modulate controls its tint."),ie("keys","Add a scale track of your own","add-clip","Godot Animation panel \xB7 Open Animation \u2192 New, enter practice_scale and click OK before inserting the first Scale key.",["Stop playback. Choose Scene \u2192 Save Scene As and save scenes/my_flash.tscn. Select AnimationPlayer. In the bottom panel click Animation \u2192 New, enter practice_scale and set the animation length to 0.24 seconds. The new clip starts empty.","Move the playhead to 0.00. Select Target in the Scene dock. Under Inspector \u2192 Transform \u2192 Scale enter X 1 and Y 1, then click the key beside Scale. Confirm Create if Godot offers to create the track. Set the playhead to 0.08, enter X 1.25 and Y 1.25, and click the same key. At 0.24, key X 1 and Y 1. Use the timeline\u2019s time field for an exact time.","Play practice_scale in the Animation panel. The editor previews your new clip. The game\u2019s hit script still plays the supplied hit_flash clip."],"Three keys appear on Target\u2019s scale track. Scrubbing to the last key returns the target to its resting size."),ie("compare","Change the peak of the playable clip","animation-compare","Godot playtest \xB7 Compare target sizes at the peak of the hit. Both clips return to the same resting scale.",["In the same scene select AnimationPlayer \u2192 hit_flash. Click the middle diamond on the Target scale track at 0.08 s. In the Inspector set its Value to X 1.60 and Y 1.60. Keep the first and last keys at (1, 1).","Save, press F6 and click Trigger hit. Compare the larger pulse with the original scene\u2019s 1.25 peak. Press F8, set the middle key back to 1.25 on both axes, and replay to check the difference."],"The edited target reaches 160% of its resting size at 0.08 s and returns to 100% at 0.24 s."),ie("attach","Make a confirmed hit play your new clip","rename-clip","Godot Rename Animation dialog \xB7 After renaming the supplied clip to reference_flash, enter hit_flash for your practice clip and click OK.",["In scenes/my_flash.tscn select AnimationPlayer. Pick the supplied hit_flash clip, open Animation \u2192 Rename, and name it reference_flash. Pick your practice_scale clip, choose Animation \u2192 Rename again, and name this clip hit_flash. Keep both clips in the same library. Save the scene.","Press F6 and click Trigger hit. The root script now finds your newly keyed clip, so the target changes size while keeping its resting tint. Click empty floor to test a miss, then press F8. To switch back in this copy, first rename your clip practice_scale, then rename reference_flash to hit_flash."],"A hit plays your scale-only animation and the particle burst. The original clip with the tint track is still available as reference_flash.")],files:[Je,St],question:"You want a stronger punch at impact with the same resting pose. Which key should change?",options:["The middle scale key at 0.08 s","The last scale key only","Every key on every track"],answer:0,feedback:"The middle key defines the peak. The first and last keys preserve the resting pose.",troubleshooting:[je("The Animation panel is hidden.","Select the AnimationPlayer node, then click Animation along the bottom edge of the editor."),je("F6 still plays the old effect.","Check the scene tab and clip name. The running script requests hit_flash. Change that clip in the scene you run with F6.")],references:[{label:"Create animation tracks and keys",url:"https://docs.godotengine.org/en/4.4/tutorials/animation/introduction.html"}]},{id:"effects-hit",title:"Play both effects on a confirmed hit",minutes:12,concept:"A hit signal is a message that a shot reached the target. The game checks the shot first. On contact, one function restarts the sparks and the keyed flash. Both effects can change without changing which shots count.",analogy:"A single contact marker on a Blender timeline can guide sparks and a flash. Here the timing comes from the game\u2019s hit test each time you shoot.",diagram:["Compare the click with the target polygon","Inside \u2192 emit hit","Listener \u2192 restart sparks and flash"],steps:[ie("wire","Trace the signal to the effect nodes","event","Godot Script editor \xB7 Follow the confirmed hit to the listener that plays the particles and animation.",[gn,"In the Scene dock click the script icon beside HitFeedback. Find _resolve_shot and the test using Geometry2D.is_point_in_polygon. It checks whether the shot point falls inside the target polygon. Follow hit.emit() in the hit branch.","Find _ready and hit.connect(_play_hit). In _play_hit, identify the calls that restart Burst and play hit_flash. This is the place to add another response to a confirmed hit."],"You can point to the line that decides contact and the separate function that plays its visual feedback."),ie("miss","Try an empty shot and a repeated hit","event","Godot Script editor \xB7 Compare the paths for a shot inside the target and a shot outside it, then try both in the game.",["Press F6. Click empty floor away from the target and buttons. Read the shot status and watch the target. Next click the target itself. Compare its status, sparks and flash. Trigger hit aims the sample shot at the center for repeatable comparisons.","Click Trigger hit twice in quick succession. Watch the second burst begin while the first would still be fading. Press F8. In a combat project, connect this response where damage or a hit is confirmed so misses stay readable."],"A miss displays \u201CMiss\u201D and leaves the target untouched. A confirmed hit plays both cues, and a quick second hit starts them again."),ie("compare","Change the art and repeat the same shots","particle-compare","Godot playtest \xB7 Use the same center hit for each capture, then shoot outside the target to check the hit rule.",["Open scenes/my_hit_feedback.tscn from the particle lesson, or save hit_feedback.tscn as a new practice scene. Select Burst and set Amount to 36. Save. Under AnimationPlayer \u2192 hit_flash set the middle Target scale key at 0.08 s to (1.60, 1.60) and save again.","Press F6. Click the target once, then click outside it. Repeat with Trigger hit to compare identical contact positions. Write down which setting changed the number of sparks and which changed the silhouette. Restore 12 particles and a (1.25, 1.25) peak if you want the original cue."],"Hits now show a denser spray and a larger flash. The same empty shot still misses.")],files:[St,Je],question:"Where should the game trigger these effects if a player can shoot and miss?",options:["On every input press","On every physics tick","After the game confirms contact"],answer:2,feedback:"A confirmed contact is shared by both effects. A miss stays visually distinct.",troubleshooting:[je("Every shot looks like a hit.","Try empty floor inside the running window. Trigger hit always aims at the center. Check that hit.emit() remains inside the successful hit-test branch."),je("Only one of the two effects plays.","Check that the children are named Burst and AnimationPlayer and that the selected animation is named hit_flash. In Godot\u2019s Output or Debugger, look for a missing node or clip.")],references:[{label:"Connect and emit signals",url:"https://docs.godotengine.org/en/4.4/getting_started/step_by_step/signals.html"}]}]};xt.lessons.push(fn,un);Ze[un.id]=Ka;Ze[fn.id]=mn;for(let e of xt.lessons)e.walkthrough=Ze[e.id].lines.map(({code:t,meaning:n})=>({line:t,explanation:n}));var yn=["scenes/match_flow.tscn","scripts/match_flow.gd"],ge=(e,t,n,o,a,s)=>({id:e,title:t,image:"match-flow/"+n,caption:o,directions:a,expected:s,body:a.join(`
`)}),le=(e,t)=>({code:e,meaning:t}),Ge=(e,t)=>({symptom:e,fix:t}),bn={"pvp-ready-room":[le("accepted.assign([false, false])","Start every ready check with two empty slots, including a rematch between the same players."),le("if phase != Phase.READY or accepted[slot]:","A press belongs to one player and one phase. Returning here ignores an extra press from the same player."),le("if accepted.all(func(value): return value):","Only two accepted slots let the room start loading. The anonymous function returns each slot\u2019s boolean value.")],"pvp-loading":[le('var error := ResourceLoader.load_threaded_request(arena_path, "PackedScene")',"Queue the arena resource and its dependencies. Check the immediate error before polling."),le("var status := ResourceLoader.load_threaded_get_status(arena_path, progress)","Godot writes the fraction loaded into progress. The status tells you whether to wait, collect the scene, or show Retry."),le("arena_scene = ResourceLoader.load_threaded_get(arena_path) as PackedScene","Collect the scene in the LOADED branch; collecting it early can block the UI."),le("duel.set_physics_process(false)","Freeze the duel controller for the countdown. Live play starts when the countdown branch re-enables it.")],"pvp-results":[le('if phase != Phase.LIVE or duel.result == "":',"A result counts once, after the duel controller has resolved all shots in its tick."),le("wins[winner] += 1","Award a point only for unequal final HP. A draw enters the round history with both scores unchanged."),le("if wins.max() >= wins_needed:","A player who reaches the target gets the match result screen. Otherwise the next round reuses the same series score.")]},vn=[{id:"pvp-ready-room",title:"Build a two-player ready check",minutes:15,concept:"A local room has an opponent but still needs two decisions before play. Store consent per player, stop accepting input after the deadline, and restart with empty slots after a decline.",analogy:"Like two separate visibility switches in an Outliner, each ready button controls one slot. Enabling one switch twice leaves the other untouched.",diagram:["Room \xB7 request ready check","P1 + P2 accept \u2192 load","Decline or timeout \u2192 room"],steps:[ge("room","Build the room panel","room","Godot game \xB7 The local room shows the win target and a button to request both players\u2019 acceptance.",["Download the reference project below, unzip, and import project.godot in Godot 4.4.1. Open scenes/match_flow.tscn. F6 runs the whole lifecycle. You can also open scenes/lobby.tscn and choose Local match series.","Inspect Overlay \u2192 Center \u2192 Card \u2192 Column. A CanvasLayer keeps the panel over the duel. CenterContainer centers the PanelContainer; VBoxContainer stacks Title, Detail, Progress, First, Second and Back. To rebuild the screen, add those exact nodes and names, then attach scripts/match_flow.gd to the MatchFlow root. The full scene and script are in Source files."],"Request ready check replaces the room with two player buttons and a deadline."),ge("accept","Connect both accept buttons","accept","Godot game \xB7 P1 has accepted; exactly one slot remains and the deadline is still running.",["Open scripts/match_flow.gd. In _ready, follow First.pressed to _first_pressed and Second.pressed to _accept(1). First calls _accept(0) during READY. Each player controls one boolean.","Inside _accept, check the phase and accepted[slot], set only that slot, disable its button, then call _begin_load only when both slots are true. Run F6. Press P1 first and leave P2 pending. Try P2 first on your next run."],"One player cannot use the same button twice to start the match. Either player can accept first."),ge("decline","Recover from a decline or timeout","expired","Godot game \xB7 An expired check returns to the room with a reason and a fresh request button.",["Stop with F8. Select MatchFlow \u2192 Inspector \u2192 Ready Seconds, enter 4 and save. Run, accept once, and let four seconds pass. In _process, follow seconds_left to the return to _room.","Request again and press Decline. Request a third time. Check that neither pilot is accepted, then accept both before the timer runs out. Restore Ready Seconds to 15."],"Decline and expiry each explain the return to the room. The next check begins at 0 / 2.")],question:"P1 presses Accept twice. What allows the loader to begin?",options:["Two presses have happened","Each pilot\u2019s own slot is true","The panel is visible"],answer:1,feedback:"Counting unique player slots keeps one pilot from accepting for two.",troubleshooting:[Ge("The second button is missing.","Run match_flow.tscn and press Request ready check. Second is shown only during READY."),Ge("An input survives the last match.","Reset accepted in _ready_check and guard _accept with the current phase.")],files:yn},{id:"pvp-loading",title:"Load the arena and gate the first input",minutes:18,concept:"Loading measures the local machine\u2019s work. A pre-round countdown gives both players a readable start after that work finishes. The course uses a real PackedScene load and a separate countdown clock.",analogy:"Loading a linked Blender collection brings its dependent assets into memory. Placing an instance creates an object you can see and manipulate.",diagram:["Request the arena \u2192 poll status","Loaded \u2192 Enter arena","Countdown \u2192 enable combat"],steps:[ge("request","Start a background scene load","loading","Godot game \xB7 The loading panel owns a ProgressBar while the scene request is outstanding.",["In the extracted reference project, double-click scenes/match_flow.tscn in FileSystem. In Overlay \u2192 Center \u2192 Card \u2192 Column click Progress. Use a ProgressBar with Min Value 0 and Max Value 100. Leave it hidden in the room.","In scripts/match_flow.gd open _begin_load. Enter LOADING, clear the bar, show it, then call load_threaded_request. Keep Arena Path as a file path so the packed arena can be requested here. An immediate error takes the player to Retry."],"Accept both players. The arena loads, then Arena loaded becomes visible. A cached arena can finish before you see a partial percentage."),ge("poll","Wire progress, failure and retry","loaded","Godot game \xB7 Enter arena appears only after the PackedScene is available.",["In _poll_load read load_threaded_get_status. For IN_PROGRESS, multiply progress[0] by 100. For LOADED, collect the scene with load_threaded_get, then show Enter arena. Send a failed status to _load_error.","Test the error path in your extracted copy: select MatchFlow and set Arena Path to scenes/settings.tscn with the file picker. F6, accept both and press Enter arena. The loaded scene cannot start a duel, so it shows Arena unavailable. Try Retry load, then Return to room. Stop and restore scenes/duel.tscn before continuing."],"A load error leaves a usable room or retry button. Restoring the duel path lets the next attempt start."),ge("countdown","Hold combat until the start","countdown","Godot game \xB7 Both pilots have spawned; the overlay counts down before either can move or fire.",["In _start_round instantiate the packed scene, add it to the tree, start the local round, then disable the duel root\u2019s physics process. Its controller owns movement, projectiles and damage.","Set Countdown Seconds to 5 in MatchFlow\u2019s Inspector. Run and hold a movement key during the countdown. In _process follow COUNTDOWN to LIVE, where the panel hides and physics is enabled. Compare with 1 second, then restore 3."],"Both pilots keep their starting positions and 3 HP until the countdown ends. Held movement takes effect when LIVE starts.")],question:"Which condition tells your loading screen that it can safely collect the arena?",options:["The progress bar was visible for three seconds","P1 has pressed Space","The resource status is THREAD_LOAD_LOADED"],answer:2,feedback:"The status reports when the resource can be collected. The countdown begins after the arena is ready.",troubleshooting:[Ge("The loader seems instantaneous.","Inspect the persistent Arena loaded screen. The sample project is small and Godot may already have the resources cached."),Ge("Damage happens during the countdown.","Disable the duel root\u2019s physics updates immediately after start_round. Enable them only in the transition to LIVE.")],files:yn},{id:"pvp-results",title:"Build round and match result screens",minutes:20,concept:"A duel resolves its shots and publishes a round result. The series screen consumes that result once, records the final HP and round wins, and chooses Next round or a final match summary.",analogy:"A frame is one sample within an action. Likewise a round result is one entry within a match; starting another round keeps the previous entries.",diagram:["Live duel \u2192 final HP","Draw / win \u2192 round history","Win target \u2192 result \u2192 rematch or leave"],steps:[ge("round","Capture the last combat tick","round","Godot game \xB7 The round panel shows each pilot\u2019s final HP and the series score before the next round.",["Open scripts/match_flow.gd \u2192 _finish_round. Wait for a nonempty duel.result during LIVE, then lock physics. Increase one win counter only when HP differs and append the result and HP to history.","In the reference project, double-click scenes/match_flow.tscn and press F6. Click Request ready check, then P1 \xB7 Accept and P2 \xB7 Accept before the timer expires. Click Enter arena when loading finishes. After the countdown, leave both pilots facing each other at their starting positions. Hold Space for P1 alone until three hits land. On the panel read Round wins and the saved HP, then choose Next round."],"The score increments once while the panel remains open. Next round refreshes HP to 3 / 3 and keeps the match score."),ge("draw","Handle a tied round","draw","Godot game \xB7 A draw appears in the history with both HP at zero; neither player gains a round win.",["Test a fresh match with both pilots at their spawn points. Hold Space and Enter before the countdown ends so they fire together. Release when the draw appears.","Trace duel.gd \u2192 tick_pair: both inputs fire, all shots for that tick resolve, then the result is chosen. The series controller records a draw and offers Next round. Compare this to a clean P2 win by holding only Enter."],"A simultaneous knockout is a draw. Both win counters stay unchanged, and the next decisive round can still end the match."),ge("match","Build the final panel and rematch path","result","Godot game \xB7 Match winner, series score, recent round history and two exit choices share the final panel.",["In MatchFlow \u2192 Inspector change Wins Needed to 1. Save, run and win one round. In _finish_round find the comparison against wins_needed. Set Title and Detail from the winning slot and history, label First as Play again and Back as Leave to lobby.","Choose Play again. Verify fresh consent, empty history, and a 0 \u2013 0 series score after both accept. Finish a second match and choose Leave to lobby. Restore Wins Needed to 2 and confirm the first decisive round now shows Next round."],"A rematch starts at the ready check. Leaving opens the lobby. The result card shows the latest five rounds when repeated draws extend the series.")],question:"What should survive when players choose Next round?",options:["The previous round wins and history","All old projectiles","The losing player\u2019s zero HP"],answer:0,feedback:"The series controller owns wins and history. Each round resets the duel actors and shots.",troubleshooting:[Ge("One victory adds many points.","Exit LIVE as soon as the round is consumed. _finish_round checks the phase before changing wins."),Ge("P2 fires but fails to produce a draw.","Use a fresh round and have both players hold fire during the countdown. Different first-shot ticks can produce a decisive victory.")],files:yn}];for(let e of vn)e.walkthrough=bn[e.id].map(({code:t,meaning:n})=>({line:t,explanation:n}));var Q=(e,t,n,o,a,s)=>({id:e,title:t,directions:n,body:n.join(`
`),expected:o,image:a,caption:s}),J=(e,t)=>({code:e,meaning:t}),ke=(e,t)=>({symptom:e,fix:t}),wn="res://scripts/duel.gd",_n={"duel-setup":{file:wn,lines:[J("var hp: Array[int] = [3, 3]","Make a list of two whole numbers. Slot 0 stores the first pilot\u2019s health. Slot 1 stores the second pilot\u2019s health. Both start with three hit points."),J("var target := 1 - owner_slot","Find the other pilot. A shot fired by slot 0 targets slot 1. A shot fired by slot 1 targets slot 0."),J("hp[target] -= 1","Read the opponent\u2019s current health, subtract one, then write it back into the same slot. A hit changes 3 to 2. The game then removes that pulse.")]},"duel-bot":{file:wn,lines:[J("var offset := positions[0] - positions[1]","Subtract the bot\u2019s floor position from the player\u2019s. The result is an arrow pointing from the bot to the player."),J("var in_range := offset.length() <= bot_range","Measure that arrow in meters. If its length is at most the firing distance, store true. At 4 meters with a range of 4, the bot can fire."),J("facing[1] = offset.normalized()","Save the direction of the arrow with a length of one. The bot can aim at its target without making distant shots faster.")]},"duel-local":{file:wn,lines:[J('return Input.get_vector(prefix + "left", prefix + "right", prefix + "up", prefix + "down")',"Join the pilot\u2019s prefix to four action names. Godot reads left, right, up and down in that order and returns a floor direction whose length is at most one."),J('return Input.is_action_pressed(prefix + "shoot")',"Return true while this pilot\u2019s fire key is held. The shared cooldown decides when the next shot can leave.")]},"duel-internet":{file:"res://scripts/duel_network.gd",lines:[J("const PORT := 7000","Both games use UDP port 7000. It is already in the script, so the guest types only the host\u2019s IP address into Godot."),J("var error := peer.create_server(PORT, 1)","On the host, open port 7000 and allow one guest. A successful call puts the room into its waiting state."),J("var host_address := address.strip_edges()","On the guest, take the text from the address box and remove spaces at either end. The result is the address the client will use."),J("if not host_address.is_valid_ip_address():","Check the text before sending anything. If it fails the IP-format check, show a message and return. A correctly formatted address may still be unreachable."),J("var error := peer.create_client(host_address, PORT)","Start reaching the host at that IP and port. An immediate OK means Godot started trying. When the connection succeeds, both players enter a ready check."),J("multiplayer.connected_to_server.connect(_connected_to_host)","Connect the success signal to our function once at startup. The empty-argument function runs later when the guest has actually connected."),J("const JOIN_TIMEOUT_MS := 8000","Give this example about eight seconds to hear back. If time expires, it restores the connection menu so you can correct the address and retry.")]},"duel-network":{file:"res://scripts/duel_network.gd",lines:[J("var peer := ENetMultiplayerPeer.new()","Make the connection object. It can listen for a guest or connect to a host. Each running game creates its own object."),J("var error := peer.create_server(PORT, 1)","Listen on UDP port 7000. The second argument allows one guest, giving the match two pilots including the host. OK means the port opened."),J("var error := peer.create_client(host_address, PORT)","Ask to connect to the machine at host_address on the same port. OK means the attempt started. Wait for the connected signal before playing."),J("_receive_input.rpc_id(HOST_ID, direction, fire, $Series.epoch)","Send the guest\u2019s direction and fire button to peer 1, the host. The last argument identifies the phase, so a delayed input from an earlier round is ignored. The host moves both pilots, checks hits and sends its resulting game state back.")]}},Qe=["scenes/duel.tscn","scripts/duel.gd","scripts/duel_network.gd"],Tt={title:"Bot & Player Duels",description:"Build one duel arena, then choose a practice bot, a second keyboard player or a network opponent.",lessons:[{id:"duel-setup",title:"Set up a two-pilot arena",minutes:10,duelMode:"local",concept:"Two pilots share one set of rules. Each has three hit points, faces its last movement direction and loses one point per hit. Only the source of the second pilot\u2019s decisions changes.",analogy:"Think of two copies of a Blender rig. Both use the same controls, but each copy has its own pose. Here each pilot has its own position, aim and health.",diagram:["Choose an opponent","Read two sets of controls","Move \u2192 fire \u2192 resolve hits"],steps:[Q("scene","Find the duel scene",["Open the reference project in Godot 4.4.1. In FileSystem, open scenes/duel.tscn. Select Duel in the Scene panel and expand its children.","Locate Pilot1 and Pilot2. HUD contains the buttons and health display. Network carries messages between two copies of the game. Press F6 to run this scene."],"The mode picker offers bot, local PvP and network PvP.","setup-tree","Godot editor \xB7 Compare the two pilot nodes under Duel with the two scouts on the floor."),Q("install","Add the duel to your own project",["Open the Module 5 lesson \u201CBring the arena into your project\u201D for the project kit download. Extract the battle_lab folder beside your own project.godot. If you installed an older kit, back up your edits and merge the updated folder, including scenes/duel.tscn and the scripts folder with network_series.gd.",'In Godot FileSystem open battle_lab/scenes/duel.tscn and press F6. To enter from your own menu, add a Button named Duels, select it, open Node \u2192 Signals, and connect pressed() to your menu script. In that callback call get_tree().change_scene_to_file("res://battle_lab/scenes/duel.tscn"). The reference lobby already has a Duel modes button.',"Choose Local PvP. With both pilots at their starting positions, hold Space. Watch P2 lose three points, then choose Rematch."],"The first pilot wins. Rematch restores both pilots to 3/3.","setup-menu","Godot game \xB7 Local PvP opens a two-player round. Back to lobby returns to the menu.")],question:"A shot belongs to slot 1. Which health entry should it change?",options:["hp[0], the other pilot","hp[1], the shooter","Both entries"],answer:0,feedback:"1 \u2212 1 gives target slot 0. A pilot\u2019s pulse can only hit its opponent.",troubleshooting:[ke("Godot cannot find a scene.","Check your path in FileSystem. The standalone project uses res://scenes/. The kit uses res://battle_lab/scenes/. Keep the kit folder together so its dependencies load.")],files:Qe},{id:"duel-bot",title:"Teach a bot when to shoot",minutes:8,duelMode:"bot",concept:"At each physics tick the bot asks one question. Is the player close enough? Outside firing range it approaches. Inside range it aims, stops and fires.",analogy:"A Blender distance driver can change a property when two objects get close. The bot uses that same distance test to switch from walking to firing.",diagram:["Player position \u2212 bot position","Measure distance in meters","Outside \u2192 approach \xB7 inside \u2192 fire"],steps:[Q("range","Set the firing distance",["Open scenes/duel.tscn. Select the Duel root and find Bot Range in the Inspector. Set it to 2, save, and press F6.","Choose Practice against a bot. Stay still and watch how close the amber scout gets before its first pulse. Stop with F8. Repeat with Bot Range set to 7."],"At 7 meters the bot starts firing farther away. Its projectiles still travel at the same speed.","bot-code","Godot \xB7 Find the range check that decides whether the bot advances or fires."),Q("kite","Cross the range boundary",["In the browser lab choose Practice bot, set its range to 4, and start. Move sideways with W or S to cross the first pulse\u2019s path.","Walk away with A. Watch the bot resume pursuit. Face it by tapping D, release D, then fire with Space. Repeat this experiment in the Godot scene."],"The bot follows when you leave its range. Pulses that already left its weapon continue along their original line.","bot-play","Godot game \xB7 Compare the gap between the pilots with the flight path of a pulse.")],question:"The gap is 5 meters and Bot Range is 4. What happens next?",options:["Fire immediately","Move toward the player","Remove the player"],answer:1,feedback:"5 \u2264 4 is false. The bot keeps moving until the distance test succeeds.",troubleshooting:[ke("Changing range seems to have no effect.","Save the scene before F6. Edit the Duel root in the Local tree. Changes in Remote belong to the current running round.")],files:Qe},{id:"duel-local",title:"Assign two local pilots",minutes:8,duelMode:"local",concept:"An input action gives a key a job such as move left. Separate action sets let two people share a keyboard. In Godot\u2019s local duel, the pilots can also use different controller device IDs.",analogy:"Like naming controls L_hand and R_hand on a rig, the prefix on an input action tells the game which pilot should respond.",diagram:["WASD + Space \u2192 P1","Arrows + Enter \u2192 P2","Two inputs \u2192 one round"],steps:[Q("bindings","Give each pilot its own keys",["Open scripts/duel.gd and find _enter_tree(). Read the duel_p1_ and duel_p2_ bindings. The scene creates these actions when it opens.","To change P2 fire, open Project \u2192 Project Settings \u2192 Input Map. Add duel_p2_shoot, press its + button, press your preferred key and confirm. The script keeps bindings you define here."],"One pilot uses the first action set and the other uses the second. A saved custom binding is available on the next launch.","local-controls","Godot editor \xB7 Follow the two prefixes to see which physical keys each pilot reads."),Q("round","Run a two-person match",["Press F6 on duel.tscn and choose Local PvP. One person moves with WASD and shoots with Space. The second uses the arrow keys and Enter, or your custom binding.","For keyboard plus one gamepad, connect the pad before choosing Local PvP. Have P1 test WASD and Space, then have P2 test only the pad\u2019s left stick and X. With two pads, the first pad controls P1 and the second controls P2. Move them one at a time and watch which pilot responds.","Tap a direction before firing to aim. Stand in the opponent\u2019s line and count three hits. Choose Rematch and swap pilots. You can also try the default controls in the browser below."],"Each tested input moves its assigned pilot. The round ends at zero HP and a rematch resets both positions and scores.","local-play","Godot game \xB7 Read each pilot\u2019s HP separately in the shared Local PvP view.")],question:"Both pilots move left when A is pressed. What should you inspect?",options:["The camera height","The material on the floor","Whether both pilots read the same input prefix"],answer:2,feedback:"Each prefix must point to its pilot\u2019s actions. Four directions go into get_vector in left, right, up, down order.",troubleshooting:[ke("Some keys stop registering when both players hold several.","Try each player separately. If the keys work alone, map one of the overlapping keys to another part of the keyboard in Input Map. In the browser, click Start round to focus the floor.")],files:Qe},{id:"duel-network",title:"Host and join a network duel",minutes:24,duelMode:"network",concept:"Two computers share a match. Each pilot confirms readiness and finishes loading locally. The host opens combat, resolves the shots, and sends one score and winner to both result screens.",analogy:"Think of one artist posing the master rig and a second viewport displaying that pose. A snapshot records the current pose so both viewers see the same result.",diagram:["Both ready \u2192 both arenas loaded","Countdown \u2192 host resolves hits","Shared result \u2192 both choose rematch"],steps:[Q("host","Start a host on one computer",["On each computer download the same project ZIP below and extract it. In the Godot 4.4.1 Project Manager click Import, select the extracted project.godot and open the project. In FileSystem double-click scenes/duel.tscn and press F6. For a one-computer rehearsal, first stop with F8. Choose Debug \u2192 Customize Run Instances, enable multiple instances, set the count to 2, and run duel.tscn with F6. Put the two game windows side by side.","Choose Network PvP in each window. In the first, click Host a match. Keep this window running while the guest joins."],"The host waits for one guest. It is player 1.","network-host","Godot game \xB7 Select Host a match on the first copy. One host listens for one guest."),Q("connection","Read how the connection starts",["Open scripts/duel_network.gd. Find host_game() and join_game(). Each makes a new peer. The host opens a port, while the guest needs both the host address and that port.","Find the matching create_server and create_client lines below the screenshot. Select each underlined function to inspect its inputs and return value. Leave both copies on the network screen for the next step."],"Both functions use the same PORT constant. Only the guest supplies a host address.","network-code","Godot Script editor \xB7 Compare the create_server call in the hosting function with create_client in the joining function."),Q("join","Choose the guest address",["On one computer, put 127.0.0.1 in the second window\u2019s address field and click Join host. On separate computers, use the host address described below.","For two computers, connect both to the same local network. Find the host\u2019s IPv4 address in its Wi-Fi or Ethernet details (Windows: Network & internet \u2192 connection properties; macOS: Network \u2192 connection \u2192 Details \u2192 TCP/IP). Enter that address on the guest. Allow Godot\u2019s incoming local-network traffic on the host.","For a friend on another Wi-Fi, continue to the next lesson, Play a friend over the internet. It walks both players through the address to share and the checks to make if joining times out."],"Joining opens the ready check on each computer. P1 is the host and P2 is the guest.","network-join","Godot game \xB7 Enter the host address on the guest. 127.0.0.1 is for the two-window test."),Q("ready","Let only one pilot accept",["Read this step together before joining. The ready check gives both pilots 15 seconds. On the host, click Ready. Leave the guest button untouched long enough to see the P1 checkmark and pending P2 on both screens.",'Click Ready on the guest before the timer runs out. If it expires, both click Try again to start a fresh check. Once the loading screen is waiting, in the Godot editor, select Duel \u2192 Network \u2192 Series in the Scene dock and click its script icon. In _vote(), find votes[slot] = true and the test for both entries. Only their second acceptance triggers _transition("loading").'],"The room stays in the ready check with one acceptance. The second acceptance opens the loading screen on both computers.","series-ready","Godot host and guest \xB7 Only P1 has confirmed. Compare the status and the available action in each window."),Q("loading","Hold the faster computer at the loading gate",["In duel.tscn, select HUD \u2192 Series \u2192 Card \u2192 Column \u2192 Progress to locate the loading bar. Select Network \u2192 Series. Its Arena Path in the Inspector points to scenes/network_arena.tscn. In the running host window click Enter arena as soon as it becomes available. Ask the guest to wait before clicking it. Try WASD and Space on the host. Watch both screens for a countdown.","On the guest click Enter arena. In _poll_load(), THREAD_LOAD_LOADED lets each machine instantiate the arena; _render() enables confirmation when its stage exists. Watch the shared three-second countdown finish. Each computer reads its own keyboard or its first connected pad. Use the mouse or keyboard to confirm the menus, then use WASD and Space or the left stick and Xbox X after the countdown. Leave both pilots at spawn for the scoring test."],"One pilot can finish first. Both must finish and confirm before the countdown starts. Holding fire during the waiting screens cannot score a hit.","series-loading","Godot host and guest \xB7 P1 is waiting for P2. A local load completion alone cannot start combat."),Q("result","Compare a round result and the final winner",["Leave the host still at spawn. On the guest hold Space or the pad\u2019s X button until three hits land, then release. Read the round winner and P1\u2013P2 score on each computer. Both choose Next round. Check that both pilots return to full health while P2 keeps the point.","Repeat with only the guest firing. After the second P2 win, compare the match winner, the final score and the last round on both screens. In network_series.gd, find wins[winner] += 1 in _process(). The host compares wins.max() to Wins Needed, then _sync() delivers its score and winner. Select Network \u2192 Series in the Scene dock to find Wins Needed in the Inspector."],"Both windows show P2 as the match winner and a 0\u20132 score after two straight guest wins.","series-result","Godot host and guest \xB7 Both computers display the result produced by the host."),Q("rematch","Request a rematch and play again",["At the match result, have only P2 choose Rematch. Keep the host on the result screen. Compare both windows, then let P1 choose Rematch too.","On both computers repeat the ready check and the loading confirmation. After the countdown each player has full health and the series starts at 0\u20130. This time have P1 fire first. To test leaving, stop one copy with F8. Read the other window\u2019s status, host again, and rejoin.","In the packet exercise below, send one movement input. Follow it to the host and back to see which computer decides the new position."],"A single request keeps the result visible. Both requests start a fresh series over the existing connection. Leaving ends the connection for the other pilot.","series-rematch","Godot host and guest \xB7 P2 has chosen a rematch. P1 still has a choice while the result stays on screen.")],question:"Which machine should decide whether a network shot dealt damage?",options:["Whichever screen draws it first","The host, after checking the shot against the opponent","Both independently"],answer:1,feedback:"The guest requests movement and firing. The host checks collisions once and shares the resulting HP with both pilots.",troubleshooting:[ke("The second PC keeps trying to connect.","Use the host\u2019s LAN address, check that both copies are running the same project, and start the host first. Guest Wi-Fi can isolate devices. On the host, allow incoming UDP on port 7000."),ke("Host reports that the port is in use.","Stop the earlier hosting window or leave its match. Only one host can listen on the same address and port at a time."),ke("One pilot is waiting after loading.","Have each person read their status. The other computer must finish its local load and press Enter arena too. If either disconnects, start a fresh host and join it again.")],files:[...Qe,"scripts/network_series.gd","scenes/network_arena.tscn"]},{id:"duel-internet",title:"Play a friend over the internet",minutes:18,duelMode:"network",concept:"Pick who will host before opening the arena. The host\u2019s computer runs the room. The guest needs an address that reaches that computer from another network. A private mesh VPN gives two friends that route across the internet.",analogy:"Two Blender projects can each contain a Camera at the same local path. In the same way, two homes can both have a computer called 192.168.1.10. A shared VPN gives the guest a way to address the particular machine running your duel.",diagram:["Host \xB7 open one room","Guest \xB7 enter the host\u2019s reachable IP","Both \xB7 compare movement and health"],steps:[Q("prepare","Both players \xB7 open the same game",["Each person downloads the reference game below, unzips it, imports project.godot into Godot 4.4.1 and opens scenes/duel.tscn. Press F6 on each computer.","Choose Network PvP \u2192 Host or join on both screens. Decide who is P1 (host) and who is P2 (guest). Keep both games open. The learning site is your guide. The room runs in the host\u2019s desktop game."],"Both computers show the Network PvP menu with Host a match, an address field and Join host.","setup-menu","Godot mode picker \xB7 Both players select the third option, Network PvP."),Q("route","Host \xB7 give your friend a reachable address",["Private VPN route using Tailscale: both people install the desktop app, sign in with their own accounts and connect. The host opens the Tailscale admin console \u2192 Machines, finds the computer running Godot, opens its menu and chooses Share. Send a sharing invitation privately to your friend.","The guest accepts the invitation with the account used by their desktop app. Check that the shared host appears online. The host copies the numeric Tailscale IPv4 address next to that machine and sends it to the guest. Both leave the VPN connected. You can skip router forwarding for this route.","Alternative for a host with a public IPv4: reserve the host PC\u2019s LAN address in the router. Under Port Forwarding, forward external UDP 7000 to that LAN address on internal port 7000. Allow inbound UDP 7000 for the game in the host firewall. Read the public IPv4 from the router\u2019s Internet/WAN status and send it to the guest. The guest can join from another home or a mobile hotspot.","The picture shows the Godot field where the guest will use the address. 100.80.10.20 is an illustration. Replace it with the address from your host."],"You and your friend agree on one route. The guest has the host\u2019s numeric VPN IPv4 or reachable public IPv4.","internet-address","Godot guest view \xB7 The example VPN address goes in the field between Host a match and Join host."),Q("open-room","Host \xB7 start the room and wait",["On the host PC click Host a match. Read the status under Join host. \u201CHosting on UDP 7000. Waiting for one guest.\u201D means the game is ready to receive one connection.","Tell your friend to join now. Leave this window open and keep the computer awake. The address field on the hosting screen is for joining rooms and does not set the host\u2019s address."],"The host sees the waiting message and stays on this screen until the guest connects.","internet-host","Godot host view \xB7 The waiting message confirms this copy opened UDP 7000."),Q("enter","Guest \xB7 join from your own connection",["On the other computer select the address field. Replace 127.0.0.1 with the IP your friend sent. Type only the numbers and dots. Omit https://, spaces inside the address and :7000.","Click Join host once. On the ready screen, click Ready on the host first, compare the checkmarks on both screens, then click Ready on the guest. Once each computer has loaded, each person clicks Enter arena. Wait for the countdown before using WASD and Space."],"The guest reaches the same ready and loading gates as the host. Run the result and rematch steps from Host and join a network duel over this connection.","series-ready","Godot host and guest \xB7 These two local processes show the same ready check you will see over your network."),Q("diagnose","If joining fails \xB7 check in this order",["Read the host screen first. If it never said \u201CWaiting for one guest\u201D, close any other hosting copy and click Host a match again. A room holds one guest. If someone already joined, leave the round and host again.","Check what the guest typed. An immediate format error means the text is invalid. A timeout means no connection was established. Ask the host to resend their address. 127.0.0.1 points back to the guest. A home address starting with 192.168 cannot be used directly across households.","Follow your chosen route. VPN: check both apps are online, the share was accepted for the correct host, and the network access rules permit the guest to reach it on UDP 7000. Public IPv4: verify the router rule uses UDP, both ports are 7000 and the destination is the host PC\u2019s current LAN address. Check the host firewall for that app, port and network interface.","If direct forwarding still fails, inspect the router\u2019s WAN IPv4. A private address or one in 100.64.0.0\u2013100.127.255.255 on the WAN interface can indicate another router or carrier-grade NAT (an ISP sharing one public address). Switch both players to the VPN route. A 100.x address inside the VPN app is normal.","Isolate the problem. Leave the internet room, then run the preceding lesson\u2019s two-window test on the host with 127.0.0.1. If it works, return to the remote route and firewall checks. If it fails, reopen identical game versions and confirm duel.tscn runs on both. Start a fresh host and retry from the guest."],"You can distinguish a host that never opened, an invalid address and a valid address that received no reply. After correcting the cause, the guest can press Join host again.","internet-failure","Godot guest view \xB7 A connection attempt with no listening host returns to the menu. Read the status below Join host before retrying.")],question:"Your friend is at another house. You shared your host PC through the VPN and the room is waiting. Which address goes into their Godot window?",options:["Their own VPN IPv4","The host PC\u2019s VPN IPv4 shown in the connected VPN app","127.0.0.1:7000"],answer:1,feedback:"The VPN carries traffic to the host PC. Godot supplies UDP port 7000 from the project, so only the host IP belongs in the field.",troubleshooting:[ke("Where do I find the first failing step?","Open the last illustrated step, If joining fails. Check the host status, the guest address, then your chosen network route."),ke("It stopped working after we finished a round.","After a round both choose Next round. After the final result both choose Rematch, accept the new ready check and confirm loading again. After either person leaves, the host must open a new room before the guest joins again.")],files:Qe}]};for(let e of Tt.lessons)e.walkthrough=_n[e.id].lines.map(({code:t,meaning:n})=>({line:t,explanation:n}));var Ya=Object.fromEntries(Tt.lessons.map(e=>[e.id,Object.fromEntries(e.steps.map(t=>[t.id,["duel-guide/"+t.image,t.caption]]))]));var ye=(e,t,n,o)=>({id:e,title:t,directions:n,body:n.join(`
`),expected:o}),ne=(e,t)=>({code:e,meaning:t}),kn={"game-lobby":{file:"res://scripts/lobby.gd",lines:[ne("start.pressed.connect(_start_battle)","start refers to the button. pressed is the event the button sends. connect gives Godot the name of the function to call when that event happens."),ne("func _start_battle() -> void:","Define the instructions that run when Start is pressed. The parentheses are empty because the button sends no extra information. void means this function returns no value."),ne('get_tree().change_scene_to_file("res://scenes/arena.tscn")',"Ask the running game to replace the lobby with the arena. The text in quotes is the saved scene\u2019s location inside the reference project.")]},"guided-tutorial":{file:"res://scripts/tutorial.gd",lines:[ne("var step := 0","Give the tutorial a bookmark named step. Zero is the starting position, where the player learns movement."),ne("if walked > 0.25:","Measure how far the scout has walked across the floor during ordinary movement. A quarter meter of walking completes this step. A roll counts in a later step."),ne('if step == 1 and child.is_in_group("projectiles"):',"When a child enters the training scene, check whether it belongs to the projectile group and the firing prompt is active. The tutorial waits for a pulse to actually exist, so an attack that fails to fire cannot complete this step."),ne("if player.rolling:","Check whether the player controller has started a roll. The prompt advances once a roll is under way."),ne("step += 1","Add one to the bookmark. Once the requested action succeeds, the tutorial can show the instruction for the following action.")]},"game-settings":{file:"res://scripts/settings.gd",lines:[ne('const SAVE_PATH := "user://battle_lab_settings.cfg"',"Give the settings file a fixed name. user:// points to the current player\u2019s writable data folder for this Godot project."),ne("var config := ConfigFile.new()","Create a container that can read and write named preferences. The save call below writes the container to disk."),ne('toggle.button_pressed = config.get_value("display", "large_hud", false)',"Look in the display section for large_hud. Restore that choice to the checkbox. A new installation uses false, so the regular HUD size appears first."),ne('config.set_value("display", "large_hud", enabled)',"Put the checkbox state into the named setting. enabled is true when the switch is on and false when it is off."),ne("var error := config.save(SAVE_PATH)","Write the new value to disk and keep the result in error. The notice uses that result to say whether saving succeeded.")]}},Sn={title:"Lobby, Tutorial & Settings",description:"Build a front door for the arena, teach the controls, and remember the player\u2019s display preference.",lessons:[{id:"game-lobby",title:"Build a lobby for your arena",minutes:12,concept:"A lobby gives players a choice before combat begins. Each button sends a pressed signal. The connected function decides which scene opens.",analogy:"Think of the lobby as a collection in the Blender Outliner. A parent holds related items together. A VBoxContainer also arranges its child controls from top to bottom.",diagram:["Button \xB7 player chooses Start","pressed \xB7 call _start_battle","SceneTree \xB7 load arena.tscn"],steps:[ye("layout","Arrange the lobby buttons",["For this first pass open the reference project in Godot. In FileSystem double-click scenes/lobby.tscn and choose 2D above the viewport. Expand Center \u2192 VBox in the Scene dock and select Start.","In the Inspector change the button\u2019s Text from Start battle to Launch. Save and press F6. Check the button says Launch, stop with F8, and restore Start battle.","To build your own version in the reference project, choose Scene \u2192 New Scene \u2192 User Interface. Name the root Lobby. Add CenterContainer as Center, then VBoxContainer as VBox beneath it. Select Center and choose Layout \u2192 Anchors Preset \u2192 Full Rect.","Under VBox add a Label and three Buttons. Give the buttons the node names Start, Tutorial and Settings and set their Text to Start battle, Tutorial and Settings. Save this scene separately as res://scenes/my_lobby.tscn."],"The preview shows Launch after your text edit. Once restored, the button reads Start battle again. In a new layout the three buttons stack vertically."),ye("connect","Follow a click into the arena",["If you built my_lobby.tscn, drag the existing scripts/lobby.gd from FileSystem onto its Lobby root. Save and press F6. The script looks for the three button names you created under Center/VBox.","In the supplied lobby, open the existing script instead. Find the connection to _start_battle, then find the function of that name. Read its scene path.","Double-click the lobby scene you want to test in FileSystem, press F6 and choose Start battle. Stop the game, run the lobby again, and try Tutorial and Settings."],"The battle button opens the playable arena. The other buttons open the practice room and the settings screen."),ye("install","Make the lobby your starting scene",["For your own project, download the tuned kit from Relay Arena. Extract its battle_lab folder beside your project.godot and let Godot import the files.","Open battle_lab/scenes/lobby.tscn and press F6 to test it.","To start there whenever you play your project, right-click this lobby.tscn in FileSystem and choose Set as Main Scene. Press F5."],"F5 opens the lobby in your own project. In the supplied reference, F5 opens the arena until you change the main scene.")],question:"You changed a button\u2019s visible Text. What determines which scene opens when you press it?",options:["The button\u2019s color","The function connected to pressed and the path it loads","The order of scenes in FileSystem"],answer:1,feedback:"The label tells the player what to expect. The signal connection and its handler perform the scene change.",troubleshooting:[{symptom:"F5 still starts directly in combat.",fix:"Open lobby.tscn and press F6 to check it on its own. Set that file as the Main Scene in FileSystem before trying F5 again."},{symptom:"A scene path is missing in my project.",fix:"Check that there is one battle_lab folder beside project.godot. Use the scripts from the installed kit, whose paths include that folder."}],files:["scenes/lobby.tscn","scripts/lobby.gd","scenes/menu_art.tscn"]},{id:"guided-tutorial",title:"Teach the controls one action at a time",minutes:12,concept:"A tutorial remembers which action it is waiting for. It checks whether the scout walked far enough, released a shot, or started rolling, then advances the counter and updates the prompt. A safe practice room lets players repeat a key without losing a fight.",analogy:"Imagine reviewing three poses on a Blender timeline. The playhead tells you which pose to inspect. Here the step number tells the game which input to check.",diagram:["Move \xB7 WASD","Attack \xB7 Space","Roll \xB7 Shift","Finish \xB7 enter battle"],steps:[ye("prompt","Find the first instruction",["Open scenes/tutorial.tscn in the reference project, or battle_lab/scenes/tutorial.tscn in your installed kit. Inspect its Player, Floor and Camera3D. This room reuses the arena layout and leaves out the enemy.","Under the HUD CanvasLayer, Prompt is a Label, and the Actions row holds Back and Start buttons. To make this overlay yourself, add CanvasLayer as HUD, a Label named Prompt, and an HBoxContainer named Actions. Add two Button children named Back and Start to Actions. Enable Disabled on Start in the Inspector.","Run the current scene with F6. Read the first prompt before pressing anything.","Try Space first, let the pulse leave the room, then hold D to walk more than a quarter meter."],"Pressing Space early leaves movement as the current instruction. A movement input advances the prompt to attacking."),ye("advance","Trace the step counter",["Select the Training root and open its scripts/tutorial.gd script.","If building your own copy, attach that script to the root and match the Player, HUD/Prompt and HUD/Actions child paths shown in the source scene. Start at step zero and read the measurement for each stage.","In the game, finish movement, press Space and read the next prompt. Press Shift to roll.","In the browser preview, try the same sequence with the on-screen controls."],"Each correct action unlocks the following instruction. The battle option becomes available after the roll."),ye("finish","Connect practice to a real round",["Enter battle from the completed tutorial. Move with WASD and fire with Space in the arena.","Stop with F8, open the lobby, press F6 and select Tutorial again.","In your own project keep the matching tutorial script and scene together inside the kit."],"You can start a playable round after training. Entering the tutorial again begins with movement.")],question:"The prompt asks for movement, but the player presses the attack key. What should the tutorial do?",options:["Unlock battle immediately","Advance to rolling","Keep the movement prompt until the matching action occurs"],answer:2,feedback:"Checking the result of the action for the current step keeps the prompts and the player\u2019s practice in the same order.",troubleshooting:[{symptom:"The first prompt never changes.",fix:"Click inside the running Godot game window and try W, A, S or D. In the reference project, check that the move actions are present in Project Settings \u2192 Input Map."},{symptom:"I ran the tutorial again and saw the first instruction.",fix:"The step counter starts fresh when the tutorial scene opens. Finish all three inputs in a single visit to unlock battle."}],files:["scenes/tutorial.tscn","scripts/tutorial.gd","scenes/menu_art.tscn"]},{id:"game-settings",title:"Save a readable HUD size",minutes:10,concept:"The HUD is the text and indicators drawn over a game, including health. A settings screen can change its size. Save the choice to a file so the arena can read it in the next scene and after a fresh launch.",analogy:"Blender can remember a display preference between sessions. The Large HUD choice works the same way: the checkbox edits a value, and the game reads that value when it draws the interface.",diagram:["Large HUD \xB7 on or off","ConfigFile \xB7 save the choice","Arena HUD \xB7 read it on entry"],steps:[ye("toggle","Compare both text sizes",["Run scenes/lobby.tscn with F6. Open Settings and try both positions of Large HUD text.","Examine scenes/settings.tscn in the editor. To build this control, add a CheckButton named LargeHUD and a Label named Preview beneath Center/VBox. Under Settings use a CenterContainer named Center with Full Rect anchors and a VBoxContainer child named VBox.","The supplied scene also has a Notice label for save feedback and a Back button.","Leave the larger size enabled, return to the lobby and start the arena. Compare the health text with your earlier round."],"The health display uses the larger text size. Switching the preference back restores the smaller size."),ye("store","Find where the choice lives",["Open scripts/settings.gd. Look for ConfigFile, then find user://battle_lab_settings.cfg.","Attach this script to the Settings root in your own copy. Follow toggled.connect(_save_size) from the checkbox\u2019s value to the named setting and the save call.","In Godot, choose Project \u2192 Open User Data Folder after changing the option. Open the .cfg file in a text editor and inspect the stored value."],"A settings file appears in the project\u2019s user data folder. The preference is stored as true or false."),ye("restore","Test a fresh launch",["Stop the running game with F8. Run the lobby again, open Settings and check the saved choice before touching the checkbox.","Change it back and repeat.","Try the browser preview as well: change the setting, reload this lesson in the same browser and reopen Settings."],"The Godot game and the browser preview each remember their own setting when storage is available.")],question:"Which location should hold the player\u2019s HUD preference after the game closes?",options:["A file under user://","A local variable inside one button callback","The label\u2019s current text"],answer:0,feedback:"Godot can write the preference to user:// and read it the next time this project starts.",troubleshooting:[{symptom:"I cannot find the settings file in FileSystem.",fix:"The FileSystem dock shows project assets under res://. Choose Project \u2192 Open User Data Folder to inspect files under user://."},{symptom:"My browser and Godot show different HUD sizes.",fix:"Each preview stores its own preference. Change the option inside the version you are testing, then reopen its arena."}],files:["scenes/settings.tscn","scripts/settings.gd","scripts/arena.gd","scenes/menu_art.tscn"]}]};for(let e of Sn.lessons)e.walkthrough=kn[e.id].lines.map(({code:t,meaning:n})=>({line:t,explanation:n}));var be=(e,t)=>["menu-guide/"+e,t],Xa={"game-lobby":{layout:be("setup-lobby","Godot 2D editor \xB7 Expand Center \u2192 VBox, select Start, then find the button\u2019s Text field in the Inspector."),connect:be("setup-lobby-code","Godot Script editor \xB7 Follow the pressed connection to the function that changes the scene."),install:be("art-lobby","Godot lobby \xB7 After choosing the kit lobby as your main scene, this is the first screen to expect from F5.")},"guided-tutorial":{prompt:be("setup-tutorial","Godot editor \xB7 Expand HUD \u2192 Actions and select Start. Its Disabled setting keeps battle locked at the start of training."),advance:be("setup-tutorial-code","Godot Script editor \xB7 Locate the projectile check and the physics update that measures player movement."),finish:be("art-tutorial","Godot game \xB7 Check the prompt above the arena. Complete all three actions to enable Start battle.")},"game-settings":{toggle:be("setup-settings","Godot editor \xB7 Select LargeHUD under Center/VBox. Its CheckButton Text property supplies the setting\u2019s visible label."),store:be("setup-settings-code","Godot Script editor \xB7 Inside _save_size, follow config.set_value() to config.save() and the notice that confirms the setting was written."),restore:be("art-settings","Godot settings \xB7 Reopen this screen after a fresh launch and compare the control with your last choice.")}};var A=(e,t)=>({code:e,meaning:t}),Ja={...Object.fromEntries(Object.entries(bn).map(([e,t])=>[e,{file:"res://scripts/match_flow.gd",lines:t}])),"gamepad-setup":pn,...Ze,..._n,...kn,"editor-tour":{file:"res://scenes/arena.tscn",lines:[A('[node name="Arena" type="Node3D"]',"Godot writes this scene entry when you save. Arena is the name in the Scene dock. Node3D gives it the Position, Rotation and Scale fields you see in the Inspector."),A('[node name="Floor" type="StaticBody3D" parent="."]',"The dot names the root of this scene as the parent. Expand Arena in the reference scene to find Floor one level beneath it.")]},"nodes-and-collisions":{file:"res://scenes/arena.tscn",lines:[A("size = Vector3(18, 0.5, 14)","Both the visible box and the collision box use this Size setting. Read the numbers as width along X, height along Y and depth along Z, in meters."),A("position = Vector3(0, -0.25, 0)","Floor is half a meter thick. Moving its center down by a quarter meter puts its top surface at Y = 0."),A('shape = SubResource("TileShape")',"The collision node uses the box named TileShape from this same scene file. Enable Debug \u2192 Visible Collision Shapes and run the arena to see where the player can stand.")]},"asset-import":{file:"res://assets/scout.glb.import",lines:[A('source_file="res://assets/scout.glb"',"This saved import setting identifies the original Blender export. Replace that file and Godot can reimport the updated scout at the same path."),A("nodes/root_scale=1.0","A scale multiplier of one preserves the imported size. Compare the scout with a one-meter reference in the viewport."),A("animation/import=true","The checked Animation import option tells Godot to read clips from the GLB. Open Advanced Import Settings and preview idle and walk.")]},variables:{file:"res://practice/properties.gd",lines:[A("@export var speed: float = 4.0","var gives a value the name speed. float allows decimals, 4.0 is its starting value, and @export makes a Speed field appear in the Inspector."),A("func _ready() -> void:","Godot calls _ready once when this node and its children are ready. The colon begins its indented instructions. void means the function returns no value."),A('print("Scout speed: ", speed)',"The quoted words stay the same. Godot looks up the current value of speed after the comma. Set Speed to 6.5 and run this practice scene to see Scout speed: 6.5 in Output.")]},"functions-and-signals":{file:"res://practice/signals.gd",lines:[A("signal fired(amount: int)","Declare an event named fired that carries a whole number. The name amount describes the value a listener will receive."),A("fired.connect(_on_fired)","Register _on_fired as the listener. Leaving off the parentheses gives Godot the function to call later."),A("shoot()","The parentheses call shoot now. In this practice scene _ready makes that call once after connecting the listener."),A("fired.emit(1)","Send the value 1 to the connected listener. Its print instruction displays Shots fired: 1. Change the argument to 2 to see Shots fired: 2 from that single event.")]},"conditions-and-loops":{file:"res://practice/targets.gd",lines:[A("var health_values: Array[int] = [0, 2, 1]","The square brackets hold three whole-number health values, in order. Each entry represents a different practice target."),A("for hp in health_values:","Repeat the indented instructions for each entry. On successive passes the name hp refers to 0, then 2, then 1."),A("if hp > 0:","The greater-than sign asks whether this target has health left. Zero goes to else, so Output shows Disabled target: 0 first, followed by Active target: 2 and Active target: 1.")]},"character-body":{file:"res://scenes/arena.tscn",lines:[A('[node name="Player" parent="." instance=ExtResource("2")]',"This saved scene setting places the player scene inside Arena. Expand Player in its own scene to find the moving body, capsule and visual model."),A("position = Vector3(0, 16, 9)","Select Camera3D to see this position. The middle number puts the fixed camera 16 meters above the origin. The last moves it 9 meters toward positive Z."),A("rotation_degrees = Vector3(-60.64, 0, 0)","The camera tilts down around its X axis to look at the arena. Since it is a child of Arena, it stays put when Player moves.")]},"wasd-movement":{file:"res://stages/motion.gd",lines:[A('var axes := Input.get_vector("move_left", "move_right", "move_forward", "move_back")',"Read the four input actions as one direction. Holding D produces (1, 0). Holding W and D splits a unit of direction between two axes, keeping diagonal travel at the same speed."),A("var direction := Vector3(axes.x, 0, axes.y)","The 2D input becomes a direction on the arena floor. Its second component goes into Z. The middle zero leaves vertical movement to gravity."),A("velocity.x = direction.x * speed","The star means multiply. With D held and speed set to 4, the requested sideways velocity is 4 meters per second. The following line handles depth in the same way."),A("move_and_slide()","Apply the body\u2019s velocity for this physics tick and check surfaces along its path. A correctly aligned floor blocks downward movement.")]},"animation-blend":{file:"res://stages/animated_player.gd",lines:[A("super(delta)","Run the movement script inherited by this player first. The animation can now read the velocity from the same physics tick."),A("var moving := Vector2(velocity.x, velocity.z).length() > 0.01","Measure horizontal speed. Above 0.01 meters per second, moving becomes true. Falling straight down leaves it false."),A('$AnimationTree.set("parameters/blend_position", 1.0 if moving else 0.0)',"The dollar sign finds the AnimationTree child. Give its blend control 1 for the walk pose or 0 for idle. Hold D, then release it to compare those endpoints.")]},hitboxes:{file:"res://scenes/projectile.tscn",lines:[A('[node name="Projectile" type="Area3D" groups=["projectiles"]]',"Area3D lets the pulse detect an overlap. The group name also gives Arena a way to find active shots when the round ends."),A("collision_mask = 4","In the Inspector this selects checkbox 3, the enemy hurtbox layer. The saved values for boxes 1, 2 and 3 are 1, 2 and 4."),A('shape = SubResource("Shape")',"The projectile collision node uses the sphere saved as Shape. Its radius of 0.18 meters defines where overlaps count.")]},"health-and-pursuit":{file:"res://scripts/enemy.gd",lines:[A("var offset := player.global_position - global_position","Subtract the enemy\u2019s world position from the player\u2019s to get an arrow pointing toward the player. The next line removes its height."),A("var direction := offset.normalized()","Keep the arrow\u2019s heading and reduce it to length one when the actors are apart. Multiplying by speed now gives predictable pursuit speed at any distance."),A("health = maxi(0, health - amount)","Subtract incoming damage from this enemy\u2019s HP. maxi chooses the larger result, so a 2-point hit against 1 remaining HP leaves 0."),A("health_changed.emit(health)","Tell listeners how much HP remains. The arena updates the HUD and checks whether the enemy has fallen.")]},"projectiles-and-restart":{file:"res://scripts/arena.gd",lines:[A("if player.health == 0 or enemy.health == 0:","Two equals signs compare values. Either character reaching zero is enough to end the round."),A('var result := "VICTORY" if enemy.health == 0 else "DEFEAT"',"Pick the word for the HUD. Enemy at zero gives VICTORY. When the player reaches zero with the enemy alive, the word is DEFEAT."),A('if finished and event.is_action_pressed("restart"):',"Both conditions must hold. Pressing R during play leaves the battle alone. Pressing R on the result screen runs the next instruction."),A("get_tree().reload_current_scene()","Load a fresh copy of the arena from disk. The characters return to their saved positions with their starting health.")]},"install-arena-kit":{file:"res://battle_lab/scenes/arena.tscn",lines:[A('[ext_resource type="PackedScene" path="res://battle_lab/scenes/player.tscn" id="2"]',"This kit scene setting starts its search at the folder containing your project.godot. Extract battle_lab there so the player scene can be found."),A('[node name="Player" parent="." instance=ExtResource("2")]',"The matching 2 refers to the saved player scene above. Run the kit arena with F6 to see that player appear inside your own project.")]},"custom-character":{file:"res://battle_lab/scenes/player.tscn",lines:[A('[node name="Hero" parent="Model" instance=ExtResource("2")]',"In a kit downloaded with your character, Hero places the imported rig inside Model. Player keeps its controller and collision capsule while Model turns the rig."),A('root_node = NodePath("../Model/Hero")',"From AnimationTree, two dots go up to Player. Follow Model and then Hero to reach the root used by the imported animation tracks."),A('anim_player = NodePath("../Model/Hero/AnimationPlayer")',"Look one level deeper for the imported clip library. After mapping idle and walk, moving and releasing a direction key should animate the same rig.")]},"player-attack-animation":{file:"res://battle_lab/scripts/player.gd",lines:[A("@export var attack_release_seconds: float = 1.0 / 3.0","The custom attack controller exposes a release time in seconds. At 24 frames per second, frame 9 is eight intervals after frame 1, or one third of a second."),A("if not released and elapsed >= clampf(attack_release_seconds, 0.0, attack.length):","Wait until the animation clock reaches the release time. The check also asks whether this attack has already fired. clampf keeps the chosen time inside the clip."),A("released = true","Remember that this attack reached release. The next line fires the pulse once, and later ticks of the same swing skip it.")]},"damage-reactions":{file:"res://battle_lab/scripts/reactions.gd",lines:[A('actor.connect("health_changed", _health_changed)',"Listen for the parent character\u2019s health updates. This lets the same reaction controller respond on the player or enemy."),A('state = &"death" if value <= 0 else &"hit"',"Choose a clip after HP drops. A remaining value of 2 selects hit. Zero selects death. The ampersand makes each clip name a Godot StringName."),A("clips.seek(elapsed, true)","Show the imported pose at the current reaction time immediately. At the end of death the clock stops advancing and the final pose stays on screen.")]},"enemy-weapon-timing":{file:"res://battle_lab/scripts/enemy.gd",lines:[A("var contact_time := attack_contact_fraction * attack_duration","Multiply the chosen point on the clip by its length. Halfway through a one-second swing is 0.5 seconds, frame 13 in the example starting at frame 1 and running at 24 fps."),A("contact_checked = true","Mark this swing\u2019s contact test as used. Staying inside blade range on the following frame cannot deal another hit from this same swing."),A("if _weapon_reaches_player():","Check the player\u2019s position against the blade segment at the contact pose. Stepping clear during the wind-up makes this condition false."),A("player.take_damage(1)","Request one point of damage on a connecting swing. A player inside the protected portion of a roll can ignore this request.")]},"dodge-roll":{file:"res://battle_lab/stages/roll_player.gd",lines:[A("var fraction := roll_elapsed / roll_duration","Divide time spent rolling by the whole clip length. A value of 0.5 describes the midpoint regardless of the clip\u2019s duration."),A("@export_range(0, 1, 0.001) var roll_safe_start: float = 4.0 / 18.0","The sample runs from frame 1 to frame 19, spanning 18 intervals. Protection starts at frame 5, four intervals from the beginning."),A("@export_range(0, 1, 0.001) var roll_safe_end: float = 12.0 / 18.0","Frame 13 is twelve intervals from the beginning. The protection test excludes this endpoint, so contact on frame 13 can hurt even though the roll is still playing.")]},"roll-stamina":{file:"res://battle_lab/stages/roll_player.gd",lines:[A("const MAX_STAMINA := 100.0","Set the upper limit of the stamina bar. A new player starts at this value."),A("if _spend_stamina(roll_stamina_cost):","Ask the shared pool to pay for a roll. The roll starts only if payment succeeds. With a cost of 40, the first roll changes a full bar from 100 to 60."),A("stamina_wait = 1.0","At the end of a roll, set a one-second recovery delay. When recovery is allowed again, the default rate adds 20 points per second until the bar reaches 100.")]},"shared-stamina":{file:"res://battle_lab/stages/roll_player.gd",lines:[A("if _spend_stamina(attack_stamina_cost):","An attack asks the same pool used by rolling to pay its own price. Set attacks to 20, rolls to 40 and recovery to 0. Three paid attacks leave exactly enough for one roll."),A("if stamina + 0.000001 < cost:","Check the balance before subtracting. The tiny allowance absorbs rounding from fractional recovery. A shortage returns false on the next line and spends nothing."),A("stamina = maxf(0.0, stamina - cost)","Subtract the price once and keep the balance at or above zero. Paying 40 from a balance of 40 leaves an empty bar."),A("stamina_changed.emit(stamina)","Send the new balance to the HUD. Both actions update the same bar, so the next roll immediately reflects what the last shot cost.")]}};var xn={...Ya,...Xa,"editor-tour":{projects:["setup/create-project","Godot Project Manager \xB7 Choose Compatibility when creating your working project."],"arena-root":["setup/editor","Godot editor \xB7 Find the Scene dock at the upper left. The indented rows belong to the scene root."],inspector:["setup/editor","Godot editor \xB7 Select a node in Scene on the left, then look across to its Inspector on the right."]},"nodes-and-collisions":{body:["course-shots/floor-shape","Godot \xB7 Find Floor above its mesh and collision children in the Scene dock."],mesh:["course-shots/floor-shape","Godot \xB7 The solid platform is the mesh. Compare its edges with the outline of the selected collision box."],shape:["course-shots/floor-shape","Godot \xB7 Select the floor\u2019s CollisionShape3D. Its thin box should cover the platform from edge to edge."]},"asset-import":{"import-glb":["course-shots/scout-import","Godot \xB7 Double-click the imported scout.glb in FileSystem. Compare its upright pose and cyan material with this preview."],"inspect-clips":["course-shots/scout-import","Godot Advanced Import Settings \xB7 Expand AnimationPlayer, select walk and press play below the cyan scout. Compare it with idle."],"blender-route":["character-guide/blender-export","Blender \xB7 Look for glTF Binary and the animation export options before saving your GLB."]},variables:{script:["course-shots/variables-inspector","Godot \xB7 Select Properties in the practice scene. Its attached script makes Speed available in the Inspector."],export:["course-shots/variables-output","Godot Inspector \xB7 Speed now reads 6.5 while the script still shows 4.0. The curved arrow beside Speed restores the default."],output:["course-shots/variables-output","Godot Output \xB7 Running Properties with F6 prints Scout speed: 6.5, matching the scene\u2019s Inspector override."],"write-line":["course-shots/variables","Browser practice \xB7 Follow health from its assignment into print(). Compare the printed number with the value you typed."]},"functions-and-signals":{wire:["course-shots/signals-script","Godot \xB7 In _ready(), read connect before shoot(). This order gives the signal a listener before it fires."],trace:["course-shots/signals-script","Godot \xB7 Trace fired from its declaration to emit(), then look for the function registered with connect()."],change:["course-shots/signals-script","Godot \xB7 Change the number passed to emit(). The receiver gets that number each time the signal fires."],"return-value":["course-shots/functions-and-signals","Browser practice \xB7 Compare the input with the returned amount. Doubling 2 gives 4, and doubling 5 gives 10."]},"conditions-and-loops":{list:["course-shots/targets-script","Godot \xB7 Read the three starting health values inside the square brackets from left to right."],trace:["course-shots/conditions-and-loops","Browser practice \xB7 Follow the output in order. A target with zero health prints Disabled. Positive health prints Active."],boundary:["course-shots/targets-script","Godot \xB7 Locate the greater-than sign. With [0, 0, 1], only the last target passes the test."]},"character-body":{player:["course-shots/player-capsule","Godot \xB7 In the Scene tree, Player owns Model and CollisionShape3D. Scripts find the visual by the child name Model."],capsule:["course-shots/player-capsule","Godot \xB7 Inspect the capsule around the scout. Its bottom meets the character\u2019s feet."],camera:["course-shots/arena-camera","Godot \xB7 Select Camera3D and inspect its projection and size. The fixed camera looks down on the floor."],run:["course-shots/arena-initial","Godot game \xB7 The finished reference uses this camera angle. At this stage, check the floor and player placement."]},"wasd-movement":{"input-map":["setup/input-map","Godot Input Map \xB7 Expand an action to see its key. The action name must match the spelling in the movement script."],"motion-script":["course-shots/wasd-movement","Browser practice \xB7 Run a speed change and compare the distance traveled in one second. Apply the same speed in Godot."],compare:["course-shots/wasd-floor","Godot game \xB7 Compare the two positions after half a second of diagonal movement. X and Z both change while the scout stays on the floor."]},"animation-blend":{tree:["character-guide/blend-space","Godot \xB7 Select AnimationTree to reveal the blend editor beneath the 3D viewport."],points:["character-guide/blend-space","Godot BlendSpace1D \xB7 The two points represent idle and walk. Move the blend position between their endpoints."],drive:["course-shots/wasd-floor","Godot game \xB7 Try the same moving and standing comparison in your scene and watch for the clip change as you release the keys."]},hitboxes:{layers:["course-shots/enemy-layers","Godot \xB7 Find the numbered Layer and Mask boxes in the Inspector. Layer identifies an object, and Mask tells a detector where to look."],"player-hurtbox":["course-shots/enemy-layers","Godot \xB7 This example shows the enemy\u2019s collision settings. For the player\u2019s Hurtbox, select only layer 2 and clear its mask."],"enemy-shell":["course-shots/enemy-layers","Godot \xB7 Use the Enemy scene tree to distinguish the body shape from the Contact and Hurtbox branches."],"enemy-areas":["course-shots/enemy-layers","Godot \xB7 Check which Area3D is selected before editing its numbered boxes. Contact checks for layer 2, while Hurtbox belongs to layer 3."]},"health-and-pursuit":{health:["course-shots/health-and-pursuit","Browser practice \xB7 Compare the health readout before and after a hit. Damage lowers the remaining health to a minimum of zero."],pursuit:["course-shots/arena-initial","Godot game \xB7 Locate the cyan player and coral enemy on opposite sides of the floor. When the round runs, watch the gap close."],hud:["course-shots/arena-initial","Godot game \xB7 Locate the status text over the playfield. It stays in screen space as the characters move."],contact:["enemy-attack-guide/godot-encounter","Godot game \xB7 Watch the attacker\u2019s facing direction. Stand in front for one strike, then try stepping out before the next contact."]},"projectiles-and-restart":{impact:["course-shots/arena-impact","Godot game \xB7 Look for the brief impact at the enemy and compare its remaining health with the start of the round."],shot:["course-shots/projectile-shape","Godot \xB7 Inspect the projectile\u2019s sphere shape. It detects a hit while its mesh makes the shot visible."],fire:["course-shots/arena-fire","Godot game \xB7 Find the cyan pulse between the characters. Once fired, it travels independently of the player."],"win-lose":["course-shots/arena-victory","Godot game \xB7 VICTORY appears when enemy health reaches zero. Press R and check that a fresh round restores both health values."]}},Ko={"install-arena-kit":{host:"Godot \xB7 Choose a host project and locate the folder containing project.godot.",install:"Project kit \xB7 Download the tuned kit, then place its battle_lab folder beside project.godot."},"custom-character":{export:"Blender \xB7 Export the rig and its meshes together with named animation actions.",move:"Browser arena \xB7 Compare your character\u2019s facing direction while moving and the pose it returns to when you release the key."},"player-attack-animation":{key:"Blender Action Editor \xB7 Scrub the attack until the hand reaches the release pose. Record that frame.",fire:"Browser arena \xB7 Use the release preview to line up the pulse with the extended hand."},"damage-reactions":{map:"Blender \xB7 The death action ends in the fallen pose. Keep hit and death as separate actions for each character.",damage:"Browser practice \xB7 Apply one hit to see the reaction. Repeated hits bring health to zero and play the fall."},"enemy-weapon-timing":{contact:"Blender \xB7 At the contact pose, note the blade\u2019s position relative to the target and the frame under the playhead.",sidestep:"Browser practice \xB7 The amber warning marks the incoming swing. Try crossing out of its path before contact."},"dodge-roll":{animate:"Blender \xB7 Scrub the roll action from the first tuck to the recovery pose.",window:"Godot Inspector \xB7 Compare Roll Safe Start and Roll Safe End with the two frames chosen in the arena.",evade:"Browser practice \xB7 Start the roll during the wind-up so the safe frames overlap the blade\u2019s contact."},"roll-stamina":{deplete:"Browser arena \xB7 The gauge shows why another roll is blocked after two quick rolls.",install:"Godot Inspector \xB7 Check Roll Stamina Cost and Stamina Regen Per Second on Player.",play:"Godot game \xB7 Read the stamina value after a roll and watch it rise again after the recovery delay."},"shared-stamina":{reserve:"Browser practice \xB7 Compare the stamina left after three shots and after four. A roll needs 40 points.",install:"Godot Inspector \xB7 Attack Stamina Cost and Roll Stamina Cost draw from the same player budget.",fight:"Godot game \xB7 Watch the same stamina readout while firing and then attempting to roll."}};xn["roll-stamina"]={rebalance:["course-shots/roll-stamina-rebalance","Browser editor \xB7 A roll costs 60. Recovery of 20 \xD7 2 restores 40 points each second once recovery begins."]};xn["shared-stamina"]={price:["course-shots/shared-stamina-price","Browser editor \xB7 shot_cost holds 20.0 and return hands that cost to the arena for each attack."]};function Za(e,t){return xn[e]?.[t.id]??[t.image,t.caption??Ko[e]?.[t.id]]}var Tn="./assets/character-guide/",Y=(e,t,n=Tn)=>te(n+e+".webp",t),B=(e,t,n)=>`<section class="guide-step"><div class="guide-index">${e}</div><div><h2>${t}</h2>${n}</div></section>`,An='<a class="lib-link" href="#/character">Use a Blender character \xB7 illustrated guide \u2192</a>';function Qa(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">BLENDER \u2192 GODOT 4.4.1</span><h1>Play as your character</h1><p>Export a rigged character, keep the arena controller, and let movement choose between idle and walk.</p></header>
 <div class="guide-tabs"><a download href="${Tn}Beacon-Pilot.blend">Download Blender example</a><a download href="${Tn}hero.glb">Download exported GLB</a><a href="#/lesson/projectiles-and-restart">Open Relay Arena \u2192</a><a href="#/attack">Add an attack animation \u2192</a><a href="#/reactions">Add hit and death actions \u2192</a></div>
 ${B(1,"Prepare two actions on the same rig",`<p>Open your character\u2019s .blend file, or follow along with <b>Beacon Pilot</b> above. The screenshots use Blender 4.2. Select the armature and open <b>Dope Sheet \u2192 Action Editor</b>. Pick the idle action and preview it with Space. Do the same for the walk. Both should deform the same mesh through its Armature modifier.</p>${Y("action-editor","Action Editor \xB7 walk is active; keyed poses alternate the arms and legs.")}<p>Give the actions distinct names, ideally <code>idle</code> and <code>walk</code>. Preserve each action with the shield (Fake User) or an NLA strip before switching. If you are making them now, keyframe a relaxed pose, a slight breathing pose, then the starting pose for idle. For walk, keyframe opposite leg and arm swings, swap sides halfway through, and repeat the first pose at the end. Keep the walk in place; the player controller supplies world movement.</p>${Y("blender-actions","Beacon Pilot in Blender \xB7 the rig and its animation actions.")}<p><b>Check before export:</b> scrub both actions, check that the feet are near ground level, and confirm the mesh follows the bones. Beacon Pilot faces Blender +Y, which exports facing Godot \u2212Z with the standard axis conversion.</p>`)}
 ${B(2,"Export one self-contained GLB",`<p>Switch to <b>Object Mode</b>. Select the character mesh or meshes and the armature together. Choose <b>File \u2192 Export \u2192 glTF 2.0</b>. Set Format to <b>glTF Binary (.glb)</b>, enable <b>Selected Objects</b> in Include, keep materials and skinning enabled, and enable <b>Animation</b> with mode <b>Actions</b>. Keep the default +Y Up conversion. Use the standard uncompressed export for this walkthrough.</p>${Y("blender-export","glTF export settings \xB7 save the mesh, materials, rig and animation clips together.")}<p>Name the file <code>hero.glb</code> and click <b>Export glTF 2.0</b>. Missing a clip? Recheck that its action belongs to this rig and is retained in the .blend; select the rig along with the mesh and export again.</p>`)}
 ${B(3,"Try it in the browser arena",`<p>Open the final lesson and expand <b>Use my Blender character</b>. Choose your GLB or click <b>Try the example character</b>. Match <b>Idle clip</b> and <b>Walk clip</b> to your actions. Click <b>Start battle</b>. Stand still, hold D, then release. The model should idle, move right with a walk cycle, and settle back into idle. Space fires in your last input direction. If the character looks sideways or backward, adjust <b>Facing correction</b> and try again.</p>${Y("browser-arena","Browser arena \xB7 choose a GLB, match both clips and try the character with WASD.")}<p>To take this exact selection into your own Godot project, choose <b>Download tuned Godot kit</b>. The kit includes a copy of your GLB with the chosen locomotion clips labeled idle and walk, the visual alignment, and the current speed and damage. Extract its <code>battle_lab</code> folder beside <code>project.godot</code>, then jump to step 6. Steps 4\u20135 show the manual replacement for a kit you already installed.</p><a class="primary" href="#/lesson/projectiles-and-restart">Try my GLB in Relay Arena \u2192</a> <a class="lib-link" href="#/own-project">Kit installation screenshots \u2192</a>`)}
 ${B(4,"Replace the visual model in an existing player scene",`<p>Copy <code>hero.glb</code> into <code>res://battle_lab/assets/</code> and wait for import to finish. Double-click the GLB in FileSystem to open Advanced Import Settings. Expand AnimationPlayer, select each clip, and check its preview. Keep Animation \u2192 Import enabled. Close the dialog.</p>${Y("import","Advanced Import Settings \xB7 Beacon Pilot and its imported idle and walk clips.")}<p>Open <code>battle_lab/scenes/player.tscn</code>. In Scene, select the existing <b>Model</b> instance and delete that child. Keep the Player root, its script, both collision shapes, Hurtbox and AnimationTree.</p><p>Select Player, add a <b>Node3D</b> child named <code>Model</code>, and drag your GLB from FileSystem onto Model. Rename the new instance <code>Hero</code>. The movement script turns Model when you change direction. Adjust <b>Hero</b>\u2019s local Y position, uniform scale and Y rotation until its feet meet the floor and its body fits the capsule. For the standalone reference game, open <code>res://scenes/player.tscn</code> and import into <code>res://assets/</code>.</p>${Y("player-tree","Player scene \xB7 Model is the facing pivot; Hero is the replaceable artwork below it.")}<pre>Player (CharacterBody3D)
\u251C\u2500 CollisionShape3D
\u251C\u2500 Model (Node3D)
\u2502  \u2514\u2500 Hero (imported scene)
\u2502     \u2514\u2500 AnimationPlayer
\u251C\u2500 AnimationTree
\u2514\u2500 Hurtbox</pre><p>Use the imported scene\u2019s tree to confirm the AnimationPlayer path. If your model needs a larger capsule, inspect both the body shape and the Hurtbox shape. The enemy uses a separate scene.</p>`)}
 ${B(5,"Connect idle and walk to the controller",`<p>Select <b>AnimationTree</b> in player.tscn. In the Inspector, assign <b>Anim Player</b> to <code>../Model/Hero/AnimationPlayer</code> and set the animation <b>Root Node</b> to <code>../Model/Hero</code>. These paths start at AnimationTree: <code>..</code> goes up to Player, then the path descends through Model and Hero. If your importer nested AnimationPlayer more deeply, use its actual path and the same animation root used by that player.</p><p>Open the existing <b>BlendSpace1D</b> resource. Its point at <b>0</b> uses <code>idle</code>; its point at <b>1</b> uses <code>walk</code>. The supplied tree already contains both points. If you exported different names, select those clips for the two points and use the same exact names in the script below, or rename the Blender actions and re-export.</p>${Y("blend-space","BlendSpace1D \xB7 the selected point at 1.0 uses walk in the Inspector. The point at 0 is idle.")}<p>Open <code>battle_lab/stages/animated_player.gd</code>. In <code>_ready()</code>, change the existing AnimationPlayer lookup to match your new tree. Keep the existing indentation, loop setup and movement function. The relevant lines inside _ready() should read:</p><pre><code>var clips: AnimationPlayer = $Model/Hero/AnimationPlayer
for clip in ["idle", "walk"]:
    clips.get_animation(clip).loop_mode = Animation.LOOP_LINEAR
$AnimationTree.active = true</code></pre><p>The kit selects blend position 1 when horizontal velocity exceeds its movement threshold and 0 when the player stops. Save both the script and the scene. If the Debugger reports a null clip, compare the imported clip names and letter case with both the script and the blend points.</p>`)}
 ${B(6,"Play the Godot scene",`<p>Open <code>res://battle_lab/scenes/arena.tscn</code> and run the current scene with <b>F6</b>. Click the game window. Watch one idle loop, hold a movement key for a few steps, and release it. Press Space to check firing and let the enemy approach to check the hurtbox. Stop with <b>F8</b>.</p>${Y("playtest","Godot playtest \xB7 Beacon Pilot walks diagonally and fires in the arena.")}<p><b>If the model slides:</b> preview walk in AnimationPlayer, then check that the tree is active and its 1 endpoint uses that clip. <b>If the body drifts away from its collision:</b> remove forward root translation from the walk in Blender. <b>If the model floats or faces sideways:</b> adjust the Hero child\u2019s local transform, save player.tscn and rerun the arena.</p>`)}
 <a class="primary" href="#/attack">Next: fire on an attack pose \u2192</a></div>`}var Pn=(e,t)=>Y(e,t,"./assets/shared-stamina/");function eo(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">RELAY ARENA \u2192 YOUR PROJECT</span><h1>Save enough stamina to roll</h1><p>Both actions draw from the same 100 points. Find the last shot you can afford before you need to dodge.</p></header>
 <nav class="guide-tabs"><a href="#/lesson/shared-stamina">Open the practice arena \u2192</a><a href="#/stamina">Review roll recovery</a></nav>
 ${B(1,"Set the price of a shot",`<p>Open the lesson, choose <b>Edit attack cost code</b>, and set the cost to 20. Keep the roll cost at 40. For this first comparison, set recovery to 0 so you can count shots at your own pace. Click <b>Apply &amp; test stamina</b>.</p>
 <pre><code>var shot_cost: float = 20.0
return shot_cost</code></pre><ul><li><code>var</code> creates a named value. <code>shot_cost</code> is its name. <code>float</code> allows decimals. <code>= 20.0</code> puts 20 points into it.</li><li><code>return shot_cost</code> gives that number to the arena as the cost of one attack. It is charged once when the attack starts. A shot that misses still costs stamina.</li></ul>
 <p>Change 20 to 10 and you can fire twice as many shots for the same amount. In the editor, expand <b>Read this code line by line</b> to see explanations for the code you actually typed.</p>`)}
 ${B(2,"Compare three shots with four",`<p>The stationary target absorbs shots throughout the drill. Tap Space three times or hold it briefly, watching <b>Shots fired</b>. Release Space after shot three. The bar reads 40 and the HUD says <b>Roll affordable</b>. Tap Shift: that roll spends the remaining 40.</p>
 <p>Click <b>Apply &amp; test stamina</b> again. This time fire four shots, release Space and tap Shift. The bar reads 20, the roll is blocked, and you stay in place. With a custom attack clip, let the firing animation finish before tapping Shift. The attack cannot be interrupted by a roll.</p>
 ${Pn("browser-reserve","Arena drill \xB7 four 20-point shots leave 20. The next 40-point roll is blocked.")}
 <p>Set recovery back to 20 and run again. From 20 points, one second of rest followed by one second of recovery earns enough for a roll. Holding fire can spend newly recovered points. Release Space to save them.</p>`)}
 ${B(3,"Move the same settings into Godot",`<p>After your last edit, click <b>Download tuned Godot kit</b>. Unzip the <code>battle_lab</code> folder next to <code>project.godot</code>. Wait for the Godot FileSystem dock to finish importing. If your project already contains a customized kit, open the new kit in a separate project first and compare the files below.</p>
 ${Y("project-kit","FileSystem \xB7 the kit\u2019s scenes live under res://battle_lab/scenes/.","./assets/setup/")}
 <p>Open <code>battle_lab/scenes/player.tscn</code> and click <b>Player</b>. In the Inspector, find <b>Attack Stamina Cost</b>, <b>Roll Stamina Cost</b> and <b>Stamina Regen Per Second</b>. Set them to 20, 40 and 0 to repeat the four-shot experiment, then save.</p>
 ${Pn("godot-inspector","Godot \xB7 the example shows the default attack cost of 15. Your tuned kit shows 20 on the same Player.")}
 <p>In the kit, <code>battle_lab/stages/roll_player.gd</code> owns the balance and both costs. <code>battle_lab/scripts/player.gd</code> asks it for payment when a shot starts. <code>battle_lab/scripts/arena.gd</code> updates the HUD in <code>battle_lab/scenes/arena.tscn</code>. When merging into an older kit, bring these changes across together with the Player scene settings. The tuned kit already includes the firing controller for your selected character.</p>
 <details class="line-guide"><summary>Read the payment check in roll_player.gd</summary><ol>
 <li><code>if stamina + 0.000001 &lt; cost:</code><span>Ask whether the balance is too low. The tiny extra amount accounts for rounding when decimals add up.</span></li>
 <li><code>return false</code><span>If the balance is too low, say \u201Cno\u201D and stop here. No points move.</span></li>
 <li><code>stamina = maxf(0.0, stamina - cost)</code><span>Subtract the cost. Keep the result at zero or higher. With 100 points and a cost of 20, the balance becomes 80.</span></li>
 <li><code>stamina_spent.emit()</code><span>Tell listeners that payment succeeded so the HUD can clear its old warning.</span></li>
 <li><code>stamina_changed.emit(stamina)</code><span>Send the updated balance to the gauge.</span></li>
 <li><code>return true</code><span>Say \u201Cyes\u201D so the controller can start the requested action.</span></li></ol></details>`)}
 ${B(4,"Check the two possible outcomes",`<p>Open the kit\u2019s <code>arena.tscn</code> and press <b>F6</b>. Move away from the enemy and aim past it so the round stays active while you test. Fire three times, then roll. Restart with F8 followed by F6 to reset stamina to 100. Fire four times, then try rolling again. When you finish comparing, restore recovery to 20 and save.</p>
 ${Pn("godot-play","Godot playtest with the default costs \xB7 two rolls and one shot leave 5. Another attack needs 15.")}
 <p><b>Why did the bar drop before the projectile appeared?</b> The cost is paid as the attack begins. Its release pose determines when the projectile leaves the hand. If an enemy interrupts the wind-up, the spent points stay spent.</p>`)}
 </div>`}var Cn=(e,t)=>Y(e,t,"./assets/stamina-guide/");function to(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">RELAY ARENA \u2192 YOUR PROJECT</span><h1>Give each roll a stamina cost</h1><p>Make dodging a choice. Compare two builds of the same scout, then take the one you like into Godot.</p></header>
 <nav class="guide-tabs"><a href="#/lesson/shared-stamina">Next \xB7 share stamina with attacks \u2192</a><a href="#/roll">Roll animation and protected frames</a></nav>
 ${B(1,"Spend the bar and try one more roll",`<p>In the lesson arena, find <b>Tune this round</b>. Leave <b>Roll cost code</b> at 40 and <b>Stamina recovery code</b> at 20. Click <b>Apply &amp; test stamina</b>. The scout starts at 100 points and the sentinel waits.</p>
 <p>Tap Shift, wait for the tumble to finish, then immediately tap Shift again. The gauge goes <b>100 \u2192 60 \u2192 20</b>. After the second landing, tap a third time. The scout stays in place and the HUD says <b>Roll blocked</b>. The failed attempt spends nothing. On touch screens use the Roll button.</p>
 ${Cn("browser-block","Arena drill \xB7 two rolls leave 20 points, so the next 40-point roll is blocked.")}
 <p>Wait one second after landing. Recovery then adds 20 points per second, even while walking. From 20 points you need another 20 to afford a roll, so you can roll again about two seconds after landing. Holding Shift only requests one roll.</p>`)}
 ${B(2,"Change the code and compare",`<p>Set the roll cost to 60 using the first function body below. Double the recovery rate using the second. Click <b>Apply &amp; test stamina</b> again. A fresh scout can now roll once. Immediately after landing a second roll is blocked at 40 points. With 40 points per second, recovering the missing 20 takes half a second after the one-second rest.</p>
 <p><b>Roll cost code</b></p><pre><code>var roll_cost: float = 60.0
return roll_cost</code></pre>
 <p><b>Stamina recovery code</b></p><pre><code>var base_rate: float = 20.0
return base_rate * 2.0</code></pre>
 <p><code>var</code> names a value and <code>return</code> hands your result to the arena. Both functions accept a result from 0 to 100. Try a recovery rate of 0 to keep the bar depleted, or a cost of 0 for free rolls. If a line fails, click the error to select that line. Choose <b>Apply &amp; fight again</b> to test your settings against the sentinel.</p>`)}
 ${B(3,"Bring your tested settings into Godot",`<p>In the same arena select <b>Download tuned Godot kit</b>. The archive includes the two values your code returned, your selected models and your roll protection settings. Extract the <code>battle_lab</code> folder beside your own <code>project.godot</code>. If you already edited an older kit, extract the new kit in a separate project first and compare the player\u2019s roll script, the HUD/Stamina branch in arena.tscn, scripts/arena.gd and the Player overrides in player.tscn. Keep any unrelated custom animations and controller changes in your own project.</p>
 ${Y("project-kit","Godot FileSystem \xB7 the imported kit lives under res://battle_lab/.","./assets/setup/")}
 <p>Open <code>battle_lab/scenes/player.tscn</code>. Select the <b>Player</b> root in the Scene dock. In the Inspector look for <b>Roll Stamina Cost</b> and <b>Stamina Regen Per Second</b>. Compare the numbers to your last browser run. To try another balance in Godot, edit those properties and save the scene.</p>
 ${Cn("godot-inspector","Godot \xB7 Player shows the default cost 40 and recovery 20. Your tuned example shows 60 and 40 here.")}
 <p>The logic lives in <code>battle_lab/stages/roll_player.gd</code>. It checks the balance before starting the roll, deducts the cost once, and adds recovery rate \xD7 elapsed seconds after the rest. The time multiplier keeps the rate independent of how many updates run each second.</p>`)}
 ${B(4,"Verify a blocked roll in your project",`<p>Open <code>battle_lab/scenes/arena.tscn</code> and press <b>F6</b>. Click inside the game, move away from the sentinel, then repeat the same Shift sequence. Watch the stamina gauge while the roll finishes, while it rests and while it fills. A blocked roll gives you no protected frames.</p>
 ${Cn("godot-play","Godot playtest \xB7 the stamina HUD tracks the scout during the fight.")}
 <details class="trouble"><summary>Why is the bar staying still?</summary><p>The one-second delay starts when the roll ends, including an early interruption. After the delay, check that Stamina Regen Per Second is greater than zero and the round is still running. If the HUD is missing, open the arena scene from the same kit as the player.</p></details>`)}
 </div>`}var et=(e,t)=>Y(e,t,"./assets/roll-guide/");function no(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">BLENDER \u2192 GODOT 4.4.1</span><h1>Roll through the blade</h1><p>Use the same two frames to time a dodge in Blender, the browser arena and your own Godot project.</p></header>
 <nav class="guide-tabs"><a href="#/lesson/roll-stamina">Next \xB7 add a stamina cost \u2192</a><a download href="./assets/character-guide/Beacon-Pilot.blend">Player Blender file</a><a download href="./assets/character-guide/hero.glb">Animated player GLB</a></nav>
 ${B(1,"Key the roll in place",`<p>Open Beacon Pilot in Blender. Select the armature, open <b>Dope Sheet \u2192 Action Editor</b> and select <code>roll</code>. Enable <b>Marker \u2192 Show Pose Markers</b>. At 24 fps, scrub the 19 frames from the standing pose, through the tuck, to the landing. Watch the rotation from the side.</p>${et("blender-roll","Blender \xB7 the roll action and its two safety markers on the rig timeline.")}
 <p>For your own character create a retained action named <code>roll</code>. In Pose Mode key the starting pose at frame 1. Tuck the limbs, key intermediate forward rotations through the inverted pose near frame 9, then untuck and land facing forward at frame 19. Keep horizontal translation on the game controller. Preview the full turn before exporting.</p>`)}
 ${B(2,"Export and map your action",`<p>In Object Mode select the rig and its skinned meshes. Choose <b>File \u2192 Export \u2192 glTF 2.0</b>. Select glTF Binary (.glb), Selected Objects, Animation and Actions. Set animation start to zero. Confirm roll, idle and walk are included and export the file.</p>${et("blender-export","Blender \xB7 export the player rig and retained actions to a single GLB.")}
 <p>In the lesson\u2019s arena, expand <b>Use my Blender character</b>, load the GLB and select <b>Roll clip</b>. Or choose the example character to use the same 0.75-second action shown here. A character without a mapped roll uses the built-in tumble.</p>`)}
 ${B(3,"Choose which frames protect the scout",`<p>In <b>Roll through the blade</b>, set <b>First protected frame</b> to 5 and <b>First vulnerable frame after protection</b> to 13. The scout can still be hit on frames 1\u20134 and from frame 13 onward. The interval covers frames 5\u201312.</p>
 <p>A Blender marker labels a pose. To reproduce it in the game, convert its position to a fraction of the clip. Subtract frame 1 from both markers and divide by the 18 intervals between frames 1 and 19. The start is <b>4/18 \u2248 0.2222</b> and the end is <b>12/18 \u2248 0.6667</b>. At 24 fps, protection starts at 0.167 seconds and ends at 0.500 seconds. For other clips, the browser shows a 24 fps preview and saves fractions of the full clip duration.</p>`)}
 ${B(4,"Time Shift against the sentinel",`<p>Click <b>Practice a timed roll</b>. The scout starts facing the enemy. Wait for the amber wind-up line, count about a quarter of a second, then tap either <b>Shift</b> key. With no WASD input the scout rolls forward along its last heading. With WASD held it locks that direction for this roll. On a phone, tap <b>Roll</b>.</p>
 ${et("browser-roll","Browser arena \xB7 Evaded records a weapon overlap during the protected interval. The scout keeps 3 HP.")}
 <p>Repeat while standing still to see <b>Hit</b>. Roll sideways clear of the blade to see <b>Miss</b>. A late roll can still be interrupted during its vulnerable opening frames. For a timing comparison, move the first protected frame later, then retry. Return it to frame 5 for the example.</p><a class="primary" href="#/lesson/dodge-roll">Practice in the roll lesson \u2192</a>`)}
 ${B(5,"Inspect the same window in your Godot project",`<p>Choose <b>Download tuned Godot kit</b> after selecting your clips and safety window. Extract <code>battle_lab</code> beside <code>project.godot</code>. Open <code>battle_lab/scenes/player.tscn</code>, select the <b>Player</b> root, then find <b>Roll Safe Start</b> and <b>Roll Safe End</b> in the Inspector. These values are fractions. The kit carries the settings you tested.</p>${et("godot-window","Godot \xB7 the Player Inspector exposes the start and end of the protected interval.")}
 <p>Open <code>battle_lab/scenes/arena.tscn</code>, press <b>F6</b> and click inside the game. Stand in the enemy\u2019s path, then tap Shift during the wind-up. Try a second round with both values close together to feel how a narrower window changes the timing. R restarts a finished fight.</p>${et("godot-roll","Godot playtest \xB7 the player rolls through the enemy\u2019s blade.")}
 <details class="trouble"><summary>My model slides, rolls twice or takes damage</summary><p>Check that the roll clip is mapped, the armature rotates through one turn and the root has no horizontal travel. Shift triggers once per press; release it before the next attempt. The protection check uses the roll clock at the enemy\u2019s contact pose. Adjust the two values on Player and retest.</p></details>`)}
 </div>`}var Ae=(e,t)=>Y(e,t,"./assets/enemy-attack-guide/");function ao(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">BLENDER \u2192 GODOT 4.4.1</span><h1>Time an enemy weapon strike</h1><p>Give the sentinel a readable swing. It chases the scout, plants its feet, then checks whether the blade reaches the scout on the contact pose.</p></header>
 <nav class="guide-tabs"><a class="primary" href="#/lesson/projectiles-and-restart">Practice in Relay Arena \u2192</a><a download href="./assets/reactions-guide/Sentinel.blend">Enemy Blender file</a><a download href="./assets/reactions-guide/enemy.glb">Animated enemy GLB</a></nav>
 ${B(1,"Pose the weapon and mark contact",`<p>Open the sample in Blender. Select the enemy armature, switch a Dope Sheet to <b>Action Editor</b> and choose <code>attack</code>. Scrub frames 1\u201325. Watch the hand pull back, the weapon reach the target, and the arm settle.</p>
 ${Ae("blender-windup","Blender \xB7 frame 10. The raised blade gives the scout time to react before impact.")}
 ${Ae("blender-contact","Blender \xB7 scrub to the contact marker and inspect the blade at full reach.")}
 <p>On your own rig, parent a weapon bone named <code>Weapon.R</code> to the hand. Put its head at the hilt, point its local +Y axis along the blade, and bind the weapon mesh to it. For a blade of your own length, add a child bone named <code>WeaponTip</code> with its head at the point of the blade. Parent it to <code>Weapon.R</code> so both follow the swing. Keep both bones in the exported skin (leave Deformation Bones Only off if you use a non-deforming marker). The example uses a 0.99 m tip offset along local +Y. Create an action on the armature, name it <code>attack</code> and enable the shield beside its name to keep it. In Pose Mode, key the ready pose at frame 1, draw the arm back, then key the impact pose at frame 13. Key a recovery pose at frame 25. Keep the feet planted so the game can own the enemy\u2019s position.</p>
 <p>At the impact frame, place the pointer over the Timeline, press <b>M</b> to add a marker and rename it <b>Contact</b>. It is a note for you. The game uses the time you set below.</p>`)}
 ${B(2,"Export the enemy with its actions",`<p>In Object Mode select the enemy armature, its body meshes and its weapon. Choose <b>File \u2192 Export \u2192 glTF 2.0</b>. Choose <b>glTF Binary (.glb)</b>, turn on <b>Selected Objects</b>, enable <b>Animation \u2192 Actions</b>, and set the clips to start at zero. Save the GLB with idle, walk, attack, hit and death on the same rig.</p>
 ${Ae("blender-export","Blender \xB7 export the weapon, its rig and the enemy\u2019s actions together.")}
 <p><b>Find the time.</b> At 24 frames per second, frame 13 is (13 \u2212 1) \xF7 24 = <b>0.50 seconds</b> after frame 1. The example lasts (25 \u2212 1) \xF7 24 = 1 second, so contact is <b>50%</b> through the clip. For your own action, divide the frames before contact by the full frame span. For example, contact at frame 9 in a 1\u201325 action is 8 \xF7 24, about 33%.</p>`)}
 ${B(3,"Compare a hit with a dodge",`<p>Open Relay Arena and expand <b>Use a Blender enemy</b>. Load your GLB or choose <b>Try the example enemy</b>. Select your swing in <b>Enemy attack clip</b>. Adjust <b>Contact point in the attack</b> and click <b>Show contact pose</b> until the weapon reaches the target. If the enemy faces sideways, adjust its facing correction.</p>
 ${Ae("browser-timing","Enemy clip settings \xB7 preview the blade at 50%, or 0.500 seconds into this example.")}
 <p>Click <b>Practice a swing</b> and leave the scout still. The sentinel closes the gap and locks its aim. Watch the amber line during the wind-up. At contact the scout should go from 3 HP to 2 HP. Click the same button again, wait for the line, then hold <b>A</b> or <b>D</b> to step across it. This time the swing should miss and HP should stay at 3. You can also back away with <b>S</b> or shoot with <b>Space</b> to interrupt the swing.</p>
 ${Ae("browser-dodge","Relay Arena \xB7 a sidestep clears the locked strike and the scout keeps all three health points.")}
 <a class="primary" href="#/lesson/projectiles-and-restart">Practice a swing \u2192</a>`)}
 ${B(4,"Set the contact pose in Godot",`<p>In the arena, choose <b>Download tuned Godot kit</b>. Extract <code>battle_lab</code> beside your own <code>project.godot</code>. In the Godot FileSystem dock, open <code>battle_lab/scenes/enemy.tscn</code> and select the <b>Enemy</b> root. Its script controls pursuit, the swing and damage. The chosen action is packaged as <code>attack</code>. In the Inspector, <b>Attack Contact Fraction</b> is the fraction of the clip where damage is tested. Use 0.5 for the example. Try 0.75, save, run the scene again and compare where the blade is when the check happens. Restore 0.5 to match the demonstrated pose.</p>
 ${Ae("godot-timing","Godot \xB7 select the enemy and inspect the attack timing for its weapon.")}
 <p>Open <code>battle_lab/scenes/arena.tscn</code> and press <b>F6</b>. Stand in front of the enemy for one swing, then move sideways during the next wind-up. The swing snapshots its facing when it starts. Once its clock crosses contact, it checks the player\u2019s current hurtbox against the blade and consumes that swing\u2019s single damage opportunity. At the end of recovery the sentinel can aim again.</p>
 ${Ae("godot-encounter","Godot playtest \xB7 at 0.500 s the weapon reaches the scout and its health drops to 2/3.")}
 <details class="trouble"><summary>My attack lands early, late or on the wrong side</summary><p>Scrub the exported clip to the frame where the blade reaches forward. Check the start frame and the clip length when calculating contact. If the weapon points away, correct the model\u2019s facing. For a different weapon length or an off-centre swing, place the <code>WeaponTip</code> bone head on the blade tip, re-export and reload the GLB. Both the browser and Godot use that marker. Without it, the example uses a 0.99 m offset. You can also edit <code>WEAPON_TIP</code> in <code>battle_lab/scripts/enemy.gd</code> for a Godot-only adjustment. If your rig has no Weapon.R bone, the kit displays a fallback blade with a fixed reach. Check both a stationary hit and a sideways miss before increasing damage.</p></details>`)}
 </div>`}var X=(e,t,n,o,a)=>({id:e,title:t,body:n,expected:o,image:a}),oo={"shared-stamina":["return shot_cost","Give the arena the number of stamina points to charge at the start of each attack."],"roll-stamina":["stamina_regen_per_second * delta","Multiply points per second by the elapsed seconds to find the points earned in one update."],"install-arena-kit":["res://battle_lab/scenes/arena.tscn","res:// starts at the folder containing project.godot. The rest is the path to the scene."],"custom-character":["parameters/blend_position","The blend position selects how much idle or walk contributes to the pose."],"player-attack-animation":["attack_release_seconds","This value is measured from the start of the attack clip, in seconds."],"damage-reactions":["health_changed.emit(health)","The actor sends its remaining health to the reaction controller after taking damage."],"enemy-weapon-timing":["attack_contact_fraction * attack_duration","Multiply the fraction by the clip length to get the contact time in seconds."],"dodge-roll":["roll_elapsed / roll_duration","Divide the elapsed seconds by the clip length. A value of 0.5 is halfway through the roll."]};function Se(e,t,n,o,a,s,i,c,l,h,u,d,f,S){return{id:e,title:t,minutes:n,guide:o,concept:a,analogy:s,diagram:i,steps:c,question:l,options:h,answer:u,feedback:d,walkthrough:[{line:oo[e][0],explanation:oo[e][1]}],files:e==="shared-stamina"?["stages/roll_player.gd","scripts/player.gd"]:["dodge-roll","roll-stamina"].includes(e)?["stages/roll_player.gd"]:[],troubleshooting:[{symptom:f,fix:S}]}}var so={title:"Your Character in Combat",description:"Bring your own rig into the arena and time both sides of a fight.",lessons:[Se("install-arena-kit","Bring the arena into your project",10,"own-project","A Godot project starts in the folder containing project.godot. The kit stores its scenes and scripts together so their resource paths resolve in your project.","Like linking a collection from another .blend file, you keep the arena in its own folder and instance its scene where needed.",["Host project","battle_lab/scenes/arena.tscn","Run the current scene with F6"],[X("host","Prepare the host project","Open Battle Lab Work in Godot 4.4.1. In FileSystem right-click res:// and reveal it in Finder or File Explorer. Leave that folder open beside the editor. The kit folder will sit beside that project.godot file.","The project opens and the FileSystem dock shows res://.","setup/create-project"),X("install","Install and play the kit","On this page click Open the arena and download your tuned kit. In Relay Arena, scroll to Tune this round and click Download tuned Godot kit. Extract the ZIP, then copy the inner battle_lab folder beside project.godot in your open project folder. Return to the editor, allow import to finish, open battle_lab/scenes/arena.tscn and press F6. Walk and fire with WASD and Space, or use the left stick and Xbox X. In the kit these bindings are registered when the arena opens.","The scout moves and fires inside your own project.","setup/project-kit")],"Which folder should contain battle_lab?",["The folder containing project.godot","Inside the .godot cache","Inside the Blender installation"],0,"F6 runs the arena in the host project while preserving your chosen main scene.","The scene shows missing resources.","Check for a nested battle_lab/battle_lab folder. The scene must be at res://battle_lab/scenes/arena.tscn."),Se("custom-character","Replace the scout and connect locomotion",15,"character","An imported rig supplies the visual model. The player root owns movement and collision. Idle and walk share the same skeleton, so movement input can blend between them.","Think of Model as a parent Empty that turns the entire character while its armature plays actions.",["Player \u2192 Model \u2192 Hero","Map idle and walk","Input drives the animation blend"],[X("export","Export a rig with idle and walk","Open What & why \u2192 Open the illustrated walkthrough \u2192 Download Blender example. In Blender open Beacon-Pilot.blend. Its armature (the bones) already has idle and walk actions. In Object Mode select the armature and its meshes. Choose File \u2192 Export \u2192 glTF 2.0, select glTF Binary (.glb), enable Selected Objects and Animation \u2192 Actions, then export your GLB.","The GLB contains the mesh, materials, skeleton and both clips.","character-guide/blender-export"),X("move","Test the replacement","In the arena open Use my Blender character. Load your GLB, pick the idle and walk clips, then start a battle. Hold D and release it. Check the facing correction if the model moves sideways.","The model walks while moving and returns to idle when input stops.","character-guide/browser-arena")],"Which part should you replace?",["The collision root","The visual model beneath Player","The entire arena"],1,"The controller keeps its existing collision and movement while the visual rig changes clips.","The character slides without walking.","Preview the walk action and check that idle and walk are mapped to different clips."),Se("player-attack-animation","Release a shot on the attack pose",12,"attack","Separate the button press from the release. The animation clock drives one projectile when it crosses the release time.","The release is the keyed pose at which a thrown object leaves the hand.",["Space \u2192 wind-up","Release time \u2192 one pulse","Recovery \u2192 idle or walk"],[X("key","Find the release frame","Open the sample player .blend. In Action Editor select attack. Scrub from the preparation through the extended firing pose. Record the frame where the hand releases the shot.","One frame identifies the release, with recovery poses after it.","attack-guide/blender-attack"),X("fire","Match the projectile to the pose","Load the example player in the arena. Select the attack clip, scrub Release time and use Show release pose. Tap Space in a battle and watch the pulse leave the hand.","One attack emits one projectile and returns to locomotion.","attack-guide/browser-release")],"When should the projectile appear?",["Every frame of the attack","When the clip finishes","When the attack clock crosses the release time"],2,"A single release check ties the projectile to the keyed pose and allows recovery to finish.","Holding Space produces a shot before the pose.","Check the selected clip and its release time, then export a fresh kit."),Se("damage-reactions","Connect flinch and fall on both rigs",12,"reactions","A health change chooses a reaction. Surviving actors flinch and recover. Zero HP selects a one-shot fall whose last pose is held.","The final pose of a death action works like an extended hold on a Blender timeline.",["Damage \u2192 remaining HP","Above zero \u2192 hit","Zero \u2192 death \u2192 hold"],[X("map","Map both reaction sets","Export hit and death actions for each rig. Load the player and enemy GLBs in their respective arena panels and select each actor\u2019s hit and death clips.","Each actor has its own two reaction selections.","reactions-guide/blender-death"),X("damage","Compare surviving and lethal hits","Open Practice hit & fall. Hit enemy once, then two more times. Reset practice and repeat for the player.","The first hit recovers. The third hit holds the fallen pose at 0 HP.","reactions-guide/browser-practice")],"At 0 HP which action should own the final pose?",["Walk","Death","Hit"],1,"Holding the final death pose prevents an immediate return to idle.","Both actors pop upright.","Check that death has a grounded final key and that locomotion stays paused after the round ends."),Se("enemy-weapon-timing","Make the sentinel strike and miss",15,"enemy-attack","The sentinel chases, locks its direction, and checks the weapon against the scout once at the contact pose. A player who leaves that line before contact takes no damage.","Place a contact marker where the blade reaches a practice target. The game checks the player at that same pose.",["Pursuit \u2192 locked swing","Contact pose \u2192 blade test","Recovery \u2192 pursuit"],[X("contact","Choose the blade contact pose","Open the Sentinel example. Scrub the attack to frame 13. Export the rig, mesh and blade together. Select the enemy attack in the arena and set contact to 50% for this one-second clip.","Show contact pose displays the extended blade.","enemy-attack-guide/blender-contact"),X("sidestep","Compare a hit and a sidestep","Click Practice a swing. Stand still once. Start again and hold A or D when the amber line appears.","The stationary scout loses 1 HP. The sidestep reports Miss and preserves HP.","enemy-attack-guide/browser-dodge")],"Which event should test the blade against the scout?",["Entering pursuit range","Every recovery frame","The contact pose"],2,"After contact the enemy must finish recovery before another swing can deal damage.","Damage happens on the wrong pose.","Scrub the clip and divide elapsed frames before contact by its full frame span."),Se("dodge-roll","Roll through a weapon strike",16,"roll","A roll moves the player in one locked direction. Its animation clock opens a short protected interval. If the blade overlaps the player during that interval, the player keeps their HP.","Use two timeline markers like an exposure sheet. One marks the first protected pose, the other marks the first vulnerable pose after it.",["Shift \u2192 lock movement direction","Start \u2264 roll time < end","Protected contact \u2192 keep HP"],[X("animate","Export a forward roll","Open the Beacon Pilot Blender example. Choose roll in the Action Editor. Follow the illustrated guide to check the tuck and recovery and export the action with the rig.","The in-place clip turns through one forward roll over frames 1\u201319.","roll-guide/blender-roll"),X("window","Set the protected frames","Load the example player and select the roll clip. In Roll through the blade choose frame 5 for the start and frame 13 for the end. Download the kit and inspect Roll Safe Start and Roll Safe End on Player.","Frame 5 is protected. Frame 13 is vulnerable again.","roll-guide/godot-window"),X("evade","Roll into contact","Click Practice a timed roll. Face the approaching sentinel. Tap Shift roughly halfway through its wind-up. Repeat once standing still.","Evaded means contact during protection with unchanged HP. A stationary hit removes 1 HP.","roll-guide/browser-roll")],"With protection starting at frame 5 and ending before frame 13, which frame allows damage?",["Frame 5","Frame 9","Frame 13"],2,"The start is included. Protection ends as soon as the clock reaches the end marker.","I see Miss instead of Evaded.","Miss means the blade cleared your body. Face the enemy and roll toward it a little later to overlap the blade during its contact pose."),Se("roll-stamina","Balance your dodge stamina",14,"stamina","A successful roll spends stamina once. While the scout is rolling and for one second after it lands, recovery waits. After that the bar fills at the rate your code returns. A roll needs enough points before it can move or protect the scout.","Picture a Blender driver controlling a 0\u2013100 gauge. One keyed event drops the value. A hold follows the tumble, then a ramp brings the value back to full. Your recovery rate sets the slope of that ramp.",["Shift \u2192 check available points","Enough \u2192 spend and roll","After landing \u2192 rest \u2192 refill"],[X("deplete","Try an unaffordable roll","In Tune this round keep cost at 40 and recovery at 20. Click Apply & test stamina. Tap Shift twice, letting each roll finish. Tap again immediately after the second landing.","The bar reads 20 / 100. The third request is blocked, and the scout gains no protection.","stamina-guide/browser-block"),X("rebalance","Run a different stamina budget","Set Roll cost code to return 60. Set Stamina recovery code to return 20 * 2. Click Apply & test stamina. Roll once and try again as soon as you land. Wait until the gauge reaches 60, then retry.","One roll leaves 40. After one second of rest, half a second of recovery earns the missing 20 points."),X("install","Install your tuned scout","Download the tuned Godot kit. Extract battle_lab beside project.godot. Open its player.tscn, select Player and compare Roll Stamina Cost and Stamina Regen Per Second with your code results.","The Player Inspector shows 60 and 40 for this experiment.","stamina-guide/godot-inspector"),X("play","Check the gauge in Godot","Open battle_lab/scenes/arena.tscn, press F6, and test two quick rolls while moving away from the sentinel. Wait for enough points and press Shift again.","The HUD shows spending and recovery, and another roll becomes possible at the cost threshold.","stamina-guide/godot-play")],"A roll costs 60. You have 40 points and regain 40 per second. How long after landing can you roll again?",["0.5 seconds","1.5 seconds","3 seconds"],1,"Wait one second, then earn the missing 20 points in half a second.","I keep seeing a block even after waiting.","Check the recovery code returns a positive number. Apply it to a fresh round and let the last roll finish before timing the delay."),Se("shared-stamina","Save enough stamina to roll",12,"shared-budget","The scout has one balance for attacks and rolls. Starting an attack spends its cost once. After the action, recovery waits one second. If the next action costs more than the remaining balance, the scout cannot start it.","Think of two Blender controls driven by one custom property. Firing and rolling read the same stamina value, so changing it with one action changes what the other can do.",["Space \u2192 pay attack cost","Balance after firing \u2192 compare with roll cost","Shift \u2192 roll or show the shortfall"],[X("price","Read and edit the cost","Choose Edit attack cost code. Change 15.0 to 20.0, keep roll cost at 40 and set recovery to return 0. Read the two lines under the editor and choose Apply & test stamina.","Every attack spends 20. The stationary target lets you keep firing without ending the round."),X("reserve","Find the last affordable shot","Fire three shots. Release Space, finish the attack and tap Shift. Reset the drill and repeat with four shots before tapping Shift.","Three shots leave exactly 40 for a roll. Four leave 20 and the HUD reports Roll blocked.","shared-stamina/browser-reserve"),X("install","Use this budget in your own project","Download the tuned kit and extract battle_lab beside project.godot. Select Player in player.tscn. Compare Attack Stamina Cost, Roll Stamina Cost and Stamina Regen Per Second with the three values you ran.","Both costs are on the same player and use one stamina gauge.","shared-stamina/godot-inspector"),X("fight","Check it in Godot","Open arena.tscn and press F6. Aim away from the enemy and repeat the three-shot and four-shot experiments in fresh rounds. Restore recovery to 20 after the test.","A blocked request spends nothing and the scout can act again once it can pay the cost.","shared-stamina/godot-play")],"At 100 stamina, with recovery off, a shot costs 20 and a roll costs 40. How many shots can you take and still roll immediately after the attack?",["Two","Three","Four"],1,"Three shots spend 60. The remaining 40 exactly covers the roll.","I fired the right number of shots but the roll did not start.","Release Space and wait for attack recovery before pressing Shift. Check that the displayed balance covers the roll cost.")]};var M=(e,t,n,o)=>({id:e,title:t,expected:o,body:Array.isArray(n)?n.join(`
`):n,directions:Array.isArray(n)?n:void 0}),U=(e,t)=>({symptom:e,fix:t}),$=(e,t)=>({line:e,explanation:t}),ce=[{title:"The Bridge",description:"Bring a Blender asset into a scene with a floor, a material, and a collision shape.",lessons:[{id:"editor-tour",title:"Find your way around Godot",minutes:8,concept:"A project holds your files. A scene is a saved tree of nodes. A node is one thing in that tree, such as a mesh or a camera. The scene tree tells you what exists, the viewport shows where it is, and the Inspector lets you change its properties.",analogy:"Select an object in Blender\u2019s Outliner and its orange outline appears in the viewport. Godot links selection in the same way. The Scene dock corresponds to the Outliner, the Inspector to the Properties editor, and FileSystem to the files on disk.",diagram:["FileSystem \xB7 project files","Scene \xB7 selected node","Inspector \xB7 editable properties"],steps:[M("projects","Prepare two project folders",["On this site open Resource library \u2192 Reference game \u2192 Download project. Extract the ZIP so you can see project.godot. This folder holds the finished example.","In the Godot 4.4.1 Standard Project Manager choose Create, enter Battle Lab Work, choose a separate empty folder, select Compatibility, and click Create & Edit. Build your arena in Battle Lab Work.","If you already completed the illustrated setup, reopen Battle Lab Work and continue with your saved Arena scene."],"The editor opens on the 3D workspace. The FileSystem dock shows res://, the root of your new project."),M("arena-root","Create the first scene","If res://scenes/arena.tscn already exists, double-click it and check the root is Arena, then move to the next exercise step. To create it in an empty project, click 3D Scene in the Scene dock. Select the new Node3D, press F2 and rename it Arena. In FileSystem, right-click res://, choose Create New \u2192 Folder and name it scenes. Choose Scene \u2192 Save Scene As, enter the scenes folder and save arena.tscn. A .tscn file remembers a scene\u2019s tree and properties.","The scene tab reads arena. The Scene dock contains one root named Arena and FileSystem contains res://scenes/arena.tscn."),M("inspector","Move the root, then undo","Select Arena. In the Inspector expand Transform \u2192 Position and change X from 0 to 2. Watch the transform gizmo move along the red axis. Use Edit \u2192 Undo to restore X to 0. Orbit the view by dragging the middle mouse button and scroll to zoom. The editor view is separate from the game camera you will add later.","Arena is back at (0, 0, 0). Orbiting changes your view without changing any Position field.")],question:"You know the name of a node and want to edit its position. Which pair of panels do you use?",options:["FileSystem \u2192 Output","Scene \u2192 Inspector","Inspector \u2192 Import"],answer:1,feedback:"Select the node in Scene, then edit Transform \u2192 Position in Inspector. FileSystem selects saved resources on disk.",troubleshooting:[U("Only a flat canvas is visible.","Click 3D at the top of the editor, then select Arena in the Scene dock."),U("I moved the view and lost the origin.","Select Arena in Scene, move the pointer over the 3D viewport, and press F to frame the selection.")],walkthrough:[$("res://scenes/arena.tscn","res:// starts inside this project\u2019s folder. scenes is the folder you made. The .tscn extension marks a Godot text scene."),$("Arena \u2192 Transform \u2192 Position","A property has a name and a value. Position has three components: X is sideways, Y is height, and Z is depth.")],files:[]},{id:"nodes-and-collisions",title:"Build a floor that holds weight",minutes:10,concept:"A Node3D gives children a position, rotation, and scale. A MeshInstance3D draws a mesh. A StaticBody3D gives physics a stationary object, and its CollisionShape3D child defines what a moving body can touch. Put the drawing and the physical shape under the same body so they travel together.",analogy:"A Blender object can look solid before you enable rigid-body physics. Godot makes that distinction visible in the tree. Parenting the mesh and collision shape to Floor works like parenting two Blender objects to one Empty.",diagram:["Floor \xB7 StaticBody3D","\u251C\u2500 MeshInstance3D \xB7 visible box","\u2514\u2500 CollisionShape3D \xB7 physical box"],steps:[M("body","Add the stationary body","Open arena.tscn. Select Arena and use the + above the Scene tree (Add Child Node). Search for StaticBody3D, create it, and rename it Floor. Set its Transform \u2192 Position to (0, -0.25, 0). In Godot, one world unit is conventionally one meter.","Floor is indented one level below Arena. Its Y position is -0.25."),M("mesh","Give the floor a visible surface","Select Floor, add a MeshInstance3D child and leave its name unchanged. In Inspector, open the dropdown beside Mesh \u2192 New BoxMesh. Click the BoxMesh resource to expand it. Set Size to (18, 0.5, 14). Leave the node\u2019s local Position at (0, 0, 0) and Scale at (1, 1, 1).","A wide, thin platform appears. Its center is below the origin and its top surface is at Y = 0."),M("shape","Match the physics shape","Select Floor again before adding a CollisionShape3D child. In its Shape dropdown choose New BoxShape3D. Expand that resource and enter the same Size (18, 0.5, 14). Save the scene. Select CollisionShape3D to inspect its wire outline over the box.","Floor has two sibling children. The collision outline hugs the visible box and the shape warning disappears.")],question:"The floor is visible, but a falling body passes through. Which part gives Floor a physical surface?",options:["The BoxMesh material","The editor grid","A BoxShape3D on its CollisionShape3D child"],answer:2,feedback:"StaticBody3D participates in physics using an attached shape. BoxMesh supplies the pixels you see.",troubleshooting:[U("The CollisionShape3D shows a yellow warning.","Confirm its parent is Floor (StaticBody3D) and assign a BoxShape3D in the Shape field. Drag the node onto Floor if its indentation is wrong."),U("The collision box looks too tall or has shifted.","Set both child positions to zero and their scales to one. Edit the two resources\u2019 Size fields, then apply the height offset only to Floor.")],walkthrough:[$("Floor.position.y = -0.25","This is the floor\u2019s center, measured relative to Arena. A 0.5 m thick box extends 0.25 m to either side, so its top is at zero."),$("MeshInstance3D / CollisionShape3D","The two nodes serve different systems. Later, Debug \u2192 Visible Collision Shapes lets you inspect the physics layer while the scene runs.")],files:[]},{id:"asset-import",title:"Import an animated scout",minutes:14,concept:"Godot imports a glTF file as a scene that can carry geometry, materials, hierarchy, and animation. A .glb packages glTF data into a single binary file. An instance is a placed copy that keeps a link to that source scene. We will keep collision in a separate scene so mesh reimports preserve our gameplay setup.",analogy:"Placing a linked collection in Blender gives you a transform for the placement while keeping the original artwork reusable. Placing a GLB scene in Godot follows the same pattern.",diagram:["scout.glb \xB7 source asset","Model \xB7 placed instance","AnimationPlayer \xB7 imported clips"],steps:[M("import-glb","Import the provided GLB","Create an assets folder under res://. In Finder or File Explorer copy the downloaded scout.glb into that folder (the reference archive also contains assets/scout.glb). Return to Godot and allow import to finish. Drag scout.glb from FileSystem onto Arena in the Scene dock. Rename the instance ImportPreview and leave its scale at (1, 1, 1).","The cyan scout appears as an instance under Arena and the GLB is listed in FileSystem."),M("inspect-clips","Inspect material, orientation, and clips","Double-click the GLB in FileSystem to open Advanced Import Settings. Inspect the model preview and expand its animation entries. Select idle, then walk, and use the preview playback controls to compare the motions. Check the scout has color and stands upright. Close the import window; retain the supplied import settings. Select ImportPreview in Arena, delete that instance, and save. The source file stays in assets for the player scene.","Both clip names are present, the model previews with its material, and Arena contains just the floor again."),M("blender-route","Trace a Blender re-export","For your own artwork, use meter-scale geometry in Blender, apply object scale with Ctrl+A \u2192 Scale in Object Mode, name the actions idle and walk, and ensure each is included by your glTF exporter\u2019s animation mode. File \u2192 Export \u2192 glTF 2.0, choose glTF Binary (.glb), enable Materials and Animations, and export into assets. To try a .blend directly, install Blender on the Godot machine, save the .blend under res://assets, and set Editor \u2192 Editor Settings \u2192 FileSystem \u2192 Import \u2192 Blender \u2192 Blender Path to its installation if detection fails. Godot asks Blender to convert it during import. The supplied GLB works by itself.","You can identify the two available import paths and use the supplied GLB without installing Blender.")],question:"Which file can a teammate import with its materials and clips when Blender is unavailable on their machine?",options:["The supplied scout.glb","A .blend that requires Blender conversion","A screenshot of the viewport"],answer:0,feedback:"GLB contains the exported scene data. Godot reads it directly, including the two animation tracks used later.",troubleshooting:[U("A custom mesh arrives, but its walk clip is missing.","Inspect the GLB\u2019s animation list. In Blender, confirm the action has keyframes and is included in the export, enable Animations, then export over the same file."),U("My edits disappear after reimport.","Place the imported scene as a child of a separate .tscn. Set gameplay collision and scripts on that separate scene. Make changes to source geometry in Blender.")],walkthrough:[$("assets/scout.glb \u2192 Model","The file is a reusable resource. Model will be the name of one instance inside the player."),$("idle / walk","These clip names are lookup keys. A later script selects motion through a blend value, so spelling and capitalization must match the imported resource.")],files:[]}]},{title:"GDScript for Visual Minds",description:"Read variables, signals and decisions, then use them to build a playable match from ready check to rematch.",lessons:[{id:"variables",title:"Turn a number into a control",minutes:12,concept:"A script is a text file of instructions attached to a node. A variable gives a value a name so you can use it again. A type describes what that name can hold: int for whole numbers, float for decimals, bool for true or false, and String for text. Mark a variable with @export to expose it in the Inspector.",analogy:"In Blender you might give a rig a custom property named \u201Cstride length.\u201D The animator can change that input without editing a driver. An exported GDScript variable gives a level designer the same kind of control.",diagram:["speed \xB7 named variable","Inspector \xB7 set a value","Output \xB7 read the result"],steps:[M("script","Attach your first script",["Use Scene \u2192 New Scene; choose Other Node \u2192 Node, and name the root Properties. Create a practice folder in FileSystem.","Save the scene as res://practice/properties.tscn. Select Properties and use Attach Script above the Scene dock. Keep GDScript selected, set Path to res://practice/properties.gd, and click Create.","On this page expand What & why \u2192 Source files \u2192 practice/properties.gd and click Copy.","In Godot click inside the script editor, select all template text, paste and save. Use the same Source files panel when a later step asks you to copy a script."],"A script icon appears beside Properties. Clicking it opens a file beginning with extends Node."),M("export","Set a value without editing code","Select Properties in the Scene dock. Locate Speed near the top of its Inspector. Start with the script\u2019s default of 4.0, then enter 6.5 and save the scene. This edits the instance\u2019s value; the script still contains its default.","Speed reads 6.5 on Properties. A revert arrow appears beside the edited value."),M("output","Run one scene and read the result","Choose Run Current Scene (F6), then inspect the Output panel at the bottom of the editor. Stop with F8. Compare the printed value with Speed in the Inspector, use its revert arrow, and run the scene again. F6 runs the scene you are editing; F5 runs the project\u2019s main scene.","The first run reports 6.5. After reverting, running again reports the default 4.0."),M("write-line","Write an instruction of your own",'Stop the scene. At the end of the indented print line inside _ready, press Enter. Keep the same indentation and type print("Double speed: ", speed * 2). Save and run the current scene. Then put # at the start of your new instruction and run again. A # turns the rest of the line into a comment. Remove # to restore your instruction.',"With Speed back at 4.0, your new line prints Double speed: 8.0. Commenting it out suppresses only that line.")],question:"The script gives speed a default of 4.0. One scene instance overrides it to 6.5. Which value will that instance read?",options:["4.0","6.5","10.5"],answer:1,feedback:"The Inspector stores a per-instance override. The script default supplies the starting value and the revert target.",troubleshooting:[U("Speed does not appear.","Save the script, clear any red errors, and select the Properties node itself in Scene. Selecting the script file in FileSystem shows different properties."),U("The editor highlights a pasted line in red.","A line starting with # is a comment. A line below a function ending in : needs one level of indentation. Replace the entire script with the provided source, including its original indentation.")],walkthrough:[$("extends Node","This script adds behavior to a Node. The node already knows how to belong to a scene tree."),$("@export var speed: float = 4.0","Read from left to right: expose in Inspector, declare a variable, name it speed, require a decimal number, give it a default."),$("func _ready() -> void:","func introduces a function, a named group of instructions. Godot calls _ready when this node enters a ready scene. Empty parentheses mean no inputs. void means the function sends no result back."),$('print("Scout speed: ", speed)',"Indented lines belong to the function above. print sends its arguments to Output. Text inside quotes stays literal; an unquoted variable name reads its current value.")],files:["practice/properties.gd","practice/guard.gd","practice/guard.tscn"]},{id:"functions-and-signals",title:"Send a signal when you fire",minutes:12,concept:"A function call asks a particular piece of code to run now. A signal announces that an event happened. First connect a receiving function, then emit the signal with any data the receiver needs. This lets a firing script tell a counter or HUD about a shot without rewriting the counter itself.",analogy:"Think of a keyframed marker at the exact moment a blaster recoils. An animation event at that marker can cue a flash and a sound. One Godot signal can likewise notify several interested receivers.",diagram:["shoot() \xB7 call","fired.emit(1) \xB7 announce","receiver \xB7 gets amount = 1"],steps:[M("wire","Create the signal practice scene","Create another scene with a plain Node root named Signals. Save it as practice/signals.tscn, attach a GDScript at res://practice/signals.gd, replace the template with the source below, and save. Read from _ready downward: find the connection line and the call to shoot().","You can point to the line that connects fired and the later line that initiates a shot."),M("trace","Follow the event into the receiver","Find the signal declaration. Read the name and type inside its parentheses. Find the matching emit call inside shoot(). Follow the signal to the function passed into connect. That function receives the supplied value as a local argument. Run the current scene and look in Output.","One shot delivers the integer 1 to the receiver."),M("change","Change the delivered amount","Stop the run. In the call that emits fired, change the argument from 1 to 3; leave the receiver alone. Save, run this scene, and compare the new output. Restore the original 1 and save before continuing.","The receiver reports 3 after the change. One emit delivered a different amount through the same connection."),M("return-value","Write a function that returns a number","Stop the scene. At the very end of signals.gd, start a new line with no indentation and type func doubled(amount: int) -> int: then press Enter. On the indented line type return amount * 2. Now add an indented print(doubled(3)) after shoot() inside _ready. Save and run. The int after the arrow describes the value the caller receives; return ends the call and hands that value back.","Output includes the original shot notification and a separate 6. Changing the input in doubled(3) changes the returned number without modifying the function.")],question:"What happens when fired emits before its receiver has been connected?",options:["The receiver gets that earlier shot at the next frame.","Godot connects the receiver automatically.","That receiver misses the shot."],answer:2,feedback:"A connection listens from the moment it is made. Connect before calling shoot() to catch its first emission.",troubleshooting:[U("The receiver never prints.","Check that the connect call runs before shoot(). Pass the receiver function by name to connect; adding () would try to call it there."),U("I see a type error after changing the argument.",'Use the whole number 3 without quotes. An int argument accepts a whole number, while "3" is text.')],walkthrough:[$("signal fired(amount: int)","Declare an event and describe the one piece of data it carries. This line alone sends nothing."),$("fired.connect(_on_fired)","Register the receiving function. Its name here describes where the event should go."),$("shoot()","Parentheses call the function. Godot jumps into its indented body, then continues after the call."),$("fired.emit(1)","Emit once. The value 1 becomes the receiving function\u2019s argument for this call; that argument is in scope inside the receiver.")],files:["practice/signals.gd","practice/guard.gd","practice/guard.tscn"]},{id:"conditions-and-loops",title:"Decide which targets are alive",minutes:10,concept:"An array keeps several values in order. A for loop takes one value at a time. An if condition asks a yes/no question about the current value, and else runs when the answer is false. Tracing a loop means writing down what happens on each pass before you press Play.",analogy:"Imagine checking every bone in a rig and enabling a constraint only when its influence is above zero. The bones are your collection, the repeated inspection is a loop, and the threshold is your condition.",diagram:["Health list \xB7 0, 2, 1","Test each \xB7 HP greater than 0?","Results \xB7 down, alive, alive"],steps:[M("list","Create the target list exercise","Create a Node scene named Targets. Save practice/targets.tscn, attach res://practice/targets.gd, replace the template with the source below, and save. Locate the list with three entries. Read it left to right: one target has 0 health, the next has 2, and the last has 1.","You can identify three separate items inside the square brackets."),M("trace","Predict each branch and run","Before running, write three rows on paper: 0 \u2192 false, 2 \u2192 true, 1 \u2192 true. Locate the line indented under if and the alternative under else. Run the current scene and watch Output. Compare each entry with your rows.","Two of the three targets take the live branch; the zero-health target takes the other one."),M("boundary","Try a boundary value","Change the list to [0, 0, 1], save, and run again. Count the targets that still pass. Stop and restore [0, 2, 1]. The comparison uses >, which excludes a value equal to zero. You will use that same boundary when an enemy takes its last hit.","Only the final target passes with [0, 0, 1].")],question:"A loop checks hp > 0 for each value in [3, 0, 0, 1]. How many times does the live branch run?",options:["2","4","1"],answer:0,feedback:"3 and 1 are greater than zero. Both zeroes reach the alternative branch.",troubleshooting:[U("The same result prints outside the loop.","Check indentation. The branch must be inside the loop, and each branch action must be indented one more level."),U("Zero health still counts as alive.","Inspect the operator. >= includes equality; use > to require a strictly positive number.")],walkthrough:[$("[0, 2, 1]","Brackets build an array; commas separate its elements. The first element is at index 0."),$("for hp in health_values:","The loop variable temporarily holds the next element. A colon starts the indented instructions to repeat."),$("if hp > 0:","The comparison returns a bool. Godot executes this branch only when the comparison is true."),$("else:","Use the same indentation as if. Its body executes for this element when the comparison is false.")],files:["practice/targets.gd","practice/guard.gd","practice/guard.tscn"]},...vn]},{title:"Making Things Move",description:"Build a character, read keyboard and gamepad input, and blend idle and walk.",lessons:[{id:"character-body",title:"Assemble the player and camera",minutes:16,concept:"A CharacterBody3D is a movable physics body you control with code. Put the scout art and a simple collider under that body. Moving the parent carries both children. A fixed Camera3D in the arena determines what the player sees at runtime.",analogy:"Think of the character body as a rig\u2019s master control. The mesh follows the master, while a simple capsule acts like a proxy mesh used to solve collisions cheaply. The game camera works like Blender\u2019s active render camera.",diagram:["Player \xB7 CharacterBody3D","\u251C\u2500 Model \xB7 scout.glb","\u2514\u2500 CollisionShape3D \xB7 capsule"],steps:[M("player","Make a reusable player scene",["Return to Battle Lab Work for this module. Check that FileSystem contains your scenes/arena.tscn and assets/scout.glb.","Choose Scene \u2192 New Scene \u2192 Other Node \u2192 CharacterBody3D. Rename the root Player. Save it as res://scenes/player.tscn.","Drag assets/scout.glb from FileSystem onto the Player root in Scene. Rename the instance Model with a capital M; its name is the path the movement script will use."],"The player scene contains Player \u2192 Model. Opening arena.tscn in another tab leaves the reusable player scene on disk."),M("capsule","Fit the body around the scout","Add a CollisionShape3D directly under Player. Set Shape to New CapsuleShape3D. Set Radius to 0.38 and Height to 1.3, then set the CollisionShape3D node\u2019s Position Y to 0.65. Select the shape and orbit the mesh to check that the bottom sits at the character origin. Save the player scene.","The capsule extends upward from the character\u2019s feet, encloses the center of the mesh, and has no missing-shape warning."),M("camera","Place the scout and frame the floor","Open arena.tscn. Drag scenes/player.tscn onto Arena and keep its instance named Player. Give it Position (0, 0.1, 3). Add a Camera3D as a direct child of Arena. Set Position to (0, 16, 9), Rotation Degrees X to -60.64, Projection to Orthogonal, Size to 14, and enable Current. Add a DirectionalLight3D to Arena and set Rotation Degrees to (-60, -30, 0). Save.","Camera preview shows the floor and player from above. The light illuminates the scout when the game runs."),M("run","Make Arena the main scene","Right-click arena.tscn in FileSystem and choose Set as Main Scene, then run the project with F5. Stop with F8. If the dock asks for the main scene on the first run, choose Select Current while arena.tscn is open. Use Arena as the main scene through the movement and combat modules. In later lessons F6 lets you test a different open scene.","The game window shows a lit floor and a stationary scout. Changing the editor view no longer changes the game camera.")],question:"Where should the fixed Camera3D live so it stays put when Player moves?",options:["Under Model","Under Arena, beside Player","Under the player collider"],answer:1,feedback:"Player and the camera share a parent. Moving Player leaves its sibling Camera3D in place.",troubleshooting:[U("The game is gray or empty.","Use F5 to run Arena, check Camera3D is Current, and verify its X rotation is negative. The small sun and environment toggles in the editor only preview lighting; add a real light to the scene."),U("The scout appears twice.","Remove the temporary ImportPreview instance from Arena. Keep the GLB inside the reusable Player scene.")],walkthrough:[$("Player / Model","The slash reads as \u201Cchild of.\u201D Model lives inside Player, so changing Player\u2019s transform also moves Model in world space."),$("Camera3D \u2192 Orthogonal","This camera projection keeps equal-size objects the same size at different depths, similar to Blender\u2019s orthographic view.")],files:[]},{id:"wasd-movement",title:"Move with a direction vector",minutes:18,concept:"Input actions give keys meaningful names. Input.get_vector reads four actions into a two-dimensional direction with length at most one. Map its axes to the floor\u2019s X and Z axes, scale by speed, then let the physics body move and slide against the floor.",analogy:"A Blender transform gizmo has an axis and an amount. Here direction chooses the axis and speed chooses the amount traveled each second. The Y component is reserved for gravity.",diagram:["W + D \xB7 input axes","Vector3 \xB7 X, 0, Z","velocity \u2192 move_and_slide()"],steps:[M("input-map","Bind the six actions","Open Project \u2192 Project Settings \u2192 Input Map. Type move_left into Add New Action and click Add. Click its +, press the physical A key, confirm the event, and repeat for move_right = D, move_forward = W, move_back = S, fire = Space, restart = R. Use these exact lower-case names including underscores. Close Project Settings.","All six actions have a key event beneath them. Expanding move_forward shows W."),M("motion-script","Give Player a movement script","Create a stages folder under res://. Open player.tscn and select its CharacterBody3D root. Click Attach Script, set Path to res://stages/motion.gd, and create it. Replace all template text with the motion.gd source below, then save the script and scene. Its $Model lookup depends on the child name from the previous lesson.","The script editor accepts the code. Player now exposes Speed in the Inspector."),M("compare","Test speed, gravity, and facing","Run the project with F5. Walk along one axis, then hold W+D. Release both keys and check the scout keeps its last heading. Stop, open Arena, temporarily set the Player instance\u2019s Position Y to 2, and run again. Watch it drop onto the floor. Restore the original starting position and save.","W travels up-screen, D travels right, diagonals do not boost speed, and the raised scout settles on the platform.")],question:"Why does holding W+D avoid the usual diagonal speed boost?",options:["Gravity cancels horizontal speed.","The camera clips the extra distance.","Input.get_vector limits the combined vector\u2019s length to one."],answer:2,feedback:"The input vector caps the combined length before multiplying by speed, so a diagonal covers the same distance per second as a straight path.",troubleshooting:[U("The player will not respond to a key.","Read the first red line in Debugger. Compare each action in Input Map to get_vector, including underscores. Click inside the running game window to give it keyboard focus."),U("The scout falls through the floor.","Stop, enable Debug \u2192 Visible Collision Shapes and rerun. Confirm Floor has its BoxShape3D, Player has its capsule, and Floor is on physics layer 1 with Player masking layer 1."),U("A node path error mentions Model.","Open player.tscn. The GLB instance must be named Model, directly under the node that owns motion.gd.")],walkthrough:[$("var facing := Vector3.FORWARD","The := operator assigns a value and infers its type. This member variable remembers the last direction across updates; Vector3.FORWARD is (0, 0, -1)."),$("func _physics_process(delta: float) -> void:","Godot calls this repeatedly at physics intervals. delta is the number of seconds covered by this update."),$("Vector3(axes.x, 0, axes.y)","Place the input\u2019s horizontal component in X, keep vertical world Y zero, and place the input\u2019s second component in Z."),$("velocity.y -= gravity * delta","Subtract this tick\u2019s change in vertical speed. The shorthand -= means subtract from the current value. Multiplying acceleration by seconds produces a velocity change."),$("move_and_slide()","CharacterBody3D consumes velocity in units per second and handles the time step internally. The final clampf calls keep the scout inside the floor edges.")],files:["stages/motion.gd"]},Va,{id:"animation-blend",title:"Blend idle and walk",minutes:16,concept:"AnimationPlayer holds named clips. AnimationTree decides how to sample them. A BlendSpace1D lays clips along one number line: idle at 0 and walk at 1. The script reads horizontal speed and chooses a point on that line after movement runs.",analogy:"Imagine two NLA strips mixed by a single driver. Godot\u2019s blend position plays the role of that driver. It can choose an endpoint or mix between the two poses.",diagram:["0.0 \xB7 idle","BlendSpace1D \xB7 blend position","1.0 \xB7 walk"],steps:[M("tree","Connect a tree to the imported clips","Open player.tscn. Add AnimationTree directly under Player. In Inspector set Anim Player to Model/AnimationPlayer using the node picker. Set the tree\u2019s Root Node to ../Model so clip tracks resolve relative to the imported scene. In Tree Root choose New AnimationNodeBlendSpace1D. Select AnimationTree in the scene, then open the blend space in the AnimationTree bottom panel. If the imported player is hidden in the picker, enter ../Model/AnimationPlayer as the Anim Player path from AnimationTree.","AnimationTree points to the AnimationPlayer inside the imported Model and shows a one-dimensional blend graph."),M("points","Place the two animation points","In the BlendSpace1D editor use the add-point tool or right-click the graph, choose Add Animation \u2192 idle at 0, and add walk at 1. Select each point to check its position, or enable snapping while placing. Set the blend graph\u2019s minimum to 0 and maximum to 1. Turn on Active for AnimationTree. Move its blend-position control between the two endpoints to preview both clips, then set it to 0 and save.","At 0 the scout plays idle. At 1 it plays walk. Both points are connected to named clips."),M("drive","Drive the blend from movement","Copy stages/animated_player.gd from the extracted reference into your stages folder. Keep stages/motion.gd on disk; the new script extends it. In player.tscn, select Player, use Detach Script above the Scene tree, then drag animated_player.gd from FileSystem onto Player. Save and run Arena. Press a movement key and release it several times.","The idle motion repeats while standing, the walk repeats while moving, and the transition follows key presses without an animation restart every physics tick.")],question:"Why does animated_player.gd call super(delta) before it chooses a blend position?",options:["To calculate the current movement using the parent script first.","To load a new GLB every frame.","To restart both clips."],answer:0,feedback:"super(delta) runs motion.gd\u2019s physics function. The animation decision then reads this tick\u2019s horizontal velocity.",troubleshooting:[U("The animation plays once and stops.","Confirm animated_player.gd is attached to Player and the imported clips are named idle and walk exactly. Its _ready function sets both clips to loop."),U("Godot cannot find blend_position.","Use a BlendSpace1D as the AnimationTree root itself. A nested blend node would have a different parameter path."),U("Both points show the same pose.","Inspect each point\u2019s selected clip. Verify the tree targets Model/AnimationPlayer and that Active is enabled.")],walkthrough:[$('extends "res://stages/motion.gd"',"Reuse all movement behavior and its stored values. Only the added animation behavior needs new code."),$("$Model/AnimationPlayer","The dollar sign looks up a node relative to the node running the script. The slash descends into its child."),$("super(delta)","Call the parent script\u2019s implementation of this function and pass it the same elapsed time."),$("1.0 if moving else 0.0","This expression returns one of two numbers. A moving player gets the walk endpoint; a stationary player gets idle. Comparing horizontal speed to 0.01 ignores tiny residual movement.")],files:["stages/animated_player.gd"]}]},{title:"The Battle Logic",description:"Wire detection, pursuit, hit points, and projectiles into a complete arena battle.",lessons:[{id:"hitboxes",title:"Design hitboxes and hurtboxes",minutes:18,concept:"An Area3D detects overlaps. A hitbox describes where an attack can reach; a hurtbox describes where a character can receive damage. Collision layers label targets, and masks tell a detector which layers to look for. A physics body can stand on the floor while a separate Area3D listens for attacks.",analogy:"Imagine organizing a rig with named selection sets. A volume belongs to one set, while a tool selects only the sets it cares about. Godot uses numbered checkboxes for those sets.",diagram:["Enemy / Contact \xB7 watches 2","Player / Hurtbox \xB7 on 2","Projectile watches 3 \u2192 Enemy / Hurtbox"],steps:[M("layers","Name the collision layers","Open Project \u2192 Project Settings \u2192 General \u2192 Layer Names \u2192 3D Physics. Name layer 1 World, layer 2 Player hurtbox, and layer 3 Enemy hurtbox. In player.tscn, select Player and clear all Collision \u2192 Layer boxes. Leave only checkbox 1 in Mask. Floor stays on layer 1, so the player still stands on it.","The layer picker shows readable names for 1, 2, and 3. Player masks World."),M("player-hurtbox","Add the player hurtbox","Add an Area3D named Hurtbox under Player. Set Collision \u2192 Layer to only 2, clear every Mask box, switch Monitoring off, and leave Monitorable on. Add CollisionShape3D beneath Hurtbox with a CapsuleShape3D of radius 0.38 and height 1.3 at Position Y 0.65. Save player.tscn. Monitoring lets an area scan; Monitorable lets another detector find it.","The physical capsule and the hurtbox capsule line up. Only the hurtbox belongs to Player hurtbox."),M("enemy-shell","Build a visible enemy","Make another CharacterBody3D scene, name it Enemy and save scenes/enemy.tscn. Set its Layer to none and Mask to 1. Give it a CollisionShape3D capsule of radius 0.48, height 1.4, at Y 0.7. Add a Node3D named Model, with a MeshInstance3D under it. Assign a SphereMesh of radius 0.55 and height 0.78; put the mesh at Y 0.82. In the mesh resource assign a StandardMaterial3D and set its Albedo color to coral so you can spot it.","Enemy has a body capsule and a visible model. Model is a direct child of Enemy, ready for its pursuit script."),M("enemy-areas","Give the enemy separate attack and target volumes","Under Enemy add Contact (Area3D). Clear its Layer, set Mask to only checkbox 2, and leave Monitoring on. Add a CollisionShape3D under Contact with a SphereShape3D radius 0.85 at Y 0.68. Add another Area3D under Enemy called Hurtbox, on layer 3 with no Mask, Monitoring off and Monitorable on. Give it a capsule matching the enemy body. Save. In arena.tscn drag enemy.tscn onto Arena and place it at (0, 0.1, -3). Run with Debug \u2192 Visible Collision Shapes enabled, then turn the debug overlay off.","The two characters are on opposite sides of the arena. The enemy\u2019s wider contact sphere surrounds its narrow hurtbox.")],question:"A projectile should detect only the enemy hurtbox on layer 3. Which Mask checkbox should it enable?",options:["2 \xB7 Player hurtbox","3 \xB7 Enemy hurtbox","1 \xB7 World"],answer:1,feedback:"Enable checkbox 3. In the saved scene file checkbox 3 is stored as the bit value 4. In the Inspector you select the numbered checkbox.",troubleshooting:[U("Contact appears to overlap but nothing detects Player.","Verify Player/Hurtbox is Monitorable and on layer 2. Enemy/Contact needs Monitoring enabled, a nonempty sphere, and mask checkbox 2."),U("The two characters push each other around.","Keep the CharacterBody3D roots off all layers and their masks on World. Attack overlap should be detected by the child areas.")],walkthrough:[$("collision_layer = 2","Godot stores each selected layer as a bit. Checkbox 1 is value 1, checkbox 2 is value 2, and checkbox 3 is value 4."),$("collision_mask = 0","An empty mask scans no layers. The hurtbox can still be found by a monitoring Area3D whose mask includes its layer.")],files:[]},{id:"health-and-pursuit",title:"Give the enemy a target",minutes:18,concept:"Subtracting two positions gives an offset pointing from one to the other. Normalize the horizontal offset to get a direction of length one, then multiply by the enemy\u2019s speed. When it reaches striking distance the enemy stops, locks its aim and starts its swing. Only the contact pose checks the weapon against the player. Health signals let the HUD refresh only when a value changes.",analogy:"A tracking constraint points a rig control toward a target. This script recalculates a similar direction every physics tick, then also moves the enemy along it. Think of the hit check as one marked impact keyframe on an action strip.",diagram:["Enemy \u2192 direction to Player","Blade at contact \u2192 take_damage(1)","health_changed \u2192 HUD"],steps:[M("health","Add health to the player","Copy stages/health_player.gd into your stages folder. Open player.tscn, detach animated_player.gd from Player and drag health_player.gd onto it. Keep the earlier stage scripts on disk. Health_player extends the animated player and adds the health_changed signal and take_damage function. Leave Health at 3 and save.","Player exposes Health and Speed. The movement and animation code remain available through inheritance."),M("pursuit","Attach the pursuing enemy",["Create a scripts folder. Copy scripts/enemy.gd and scripts/arena.gd from the reference into it.","Open your enemy.tscn. Under Enemy create a Node3D named BladePivot. Under BladePivot add a Node3D named Swing.","Under Swing add a MeshInstance3D named Blade. On Blade choose Mesh \u2192 New BoxMesh, expand it and set Size to (0.095, 0.13, 1.2). Set the Blade node\u2019s Position to (0, 0.85, -0.95).","Click the eye beside BladePivot in Scene to hide it until the first swing. Then drag enemy.gd onto the Enemy root. Save.","In Arena confirm Player and Enemy are siblings with exactly these names. The path ../Player means go up from Enemy to Arena, then down to Player."],"The Scene tree shows Enemy \u2192 BladePivot \u2192 Swing \u2192 Blade. Enemy has Speed 1.35 and Health 3. Its script finds BladePivot and Model beneath itself and Player beside it."),M("hud","Build the health and result display","In arena.tscn add a CanvasLayer child named HUD, then add two Label children named Status and Result. Leave Status near the top-left; set its Text to SCOUT for editing. Select Result, choose the Center anchor preset in the 2D layout toolbar, set horizontal and vertical text alignment to Center, and hide it with the eye in Scene. Attach scripts/arena.gd to Arena, save and run the project.","The HUD shows SCOUT 3 / 3 and SENTINEL 3 / 3. The enemy starts moving toward the player."),M("contact","Dodge a swing and restart after defeat","Watch the enemy track you. When it plants its feet, step sideways before the strike. On the next swing stand still in front of its weapon and watch the HP display. At zero, look for DEFEAT. Press R once. This reloads the main scene, which reconstructs both characters with their saved starting values.","A miss leaves HP unchanged. Each connecting strike removes one point. Restart restores both characters to 3 HP.")],question:"Player has 1 HP and take_damage(2) runs. What does maxi(0, health - amount) store?",options:["-1","1","0"],answer:2,feedback:"1 \u2212 2 is \u22121. maxi picks the greater of 0 and \u22121, so the HUD displays zero and the defeat condition can trigger.",troubleshooting:[U("Enemy moves, but health never drops.","Stand in front of the blade through the contact pose. Check BladePivot and its children against the reference enemy scene. For a custom rig, inspect its contact fraction and the direction of the weapon bone."),U("The debugger says Node not found for Status or Result.","Open arena.tscn and compare the tree: Arena \u2192 HUD \u2192 Status and Arena \u2192 HUD \u2192 Result. Node names are case-sensitive."),U("The enemy cannot find Player when I press F6.","enemy.tscn needs Player as a sibling in Arena. Run the main scene with F5.")],walkthrough:[$("player.global_position - global_position","Destination minus origin gives the displacement from the enemy to the player in world space."),$("offset.normalized()","After removing height, divide by vector length. Speed stays constant while the enemy follows the scout."),$("attack_contact_fraction * attack_duration","Multiply the contact position on the clip by its duration in seconds. At that moment, check once whether the weapon reaches the player."),$("health = maxi(0, health - amount)","The parameter amount belongs to this call. health belongs to this character and persists between calls. maxi clamps the lower bound to zero."),$("health_changed.emit(health)","Send the new value to connected listeners. Arena connects both characters to its HUD update in _ready; return exits early if the round has already finished.")],files:["stages/health_player.gd","scripts/enemy.gd","scripts/arena.gd"]},{id:"projectiles-and-restart",title:"Fire a pulse and finish the round",minutes:20,concept:"A saved scene is a blueprint. instantiate() creates one live copy and add_child() places that copy in the running tree. Each projectile remembers its own direction and lifetime. The first hurtbox contact spawns an impact, deals damage once, and schedules the projectile for removal.",analogy:"Imagine placing several linked copies of a muzzle-flash collection. Their geometry can be shared, but each copy starts at its own position and time. A projectile scene gives every shot the same structure and independent motion.",diagram:["Space \u2192 spawn Projectile","Enemy hurtbox \u2192 impact + 1 damage","0 HP \u2192 result \u2192 R to restart"],steps:[M("impact","Assemble a short-lived impact effect","Copy scripts/impact.gd from the reference to scripts. Create a new MeshInstance3D root named Impact. Assign a TorusMesh, inner radius 0.17 and outer radius 0.23. Add a StandardMaterial3D with an amber Albedo and enable Emission with an amber color. Attach impact.gd and save scenes/impact.tscn. Its tween expands the ring for 0.12 seconds, shrinks it for 0.12 seconds, then removes it.","The impact scene has its ring mesh and script. Its saved path exactly matches the preload in projectile.gd."),M("shot","Build a moving projectile scene","Copy scripts/projectile.gd. Create an Area3D root named Projectile, Layer none, Mask only checkbox 3 and Monitoring on. Add a CollisionShape3D with SphereShape3D radius 0.18, plus a MeshInstance3D with SphereMesh radius 0.16 and height 0.32. Use a bright cyan material. With Projectile selected, go to the Node dock \u2192 Groups and add it to projectiles. Attach projectile.gd and save scenes/projectile.tscn. The group lets Arena remove active shots when a round ends.","Projectile is a visible sphere with a slightly larger detector. The script can find the already-saved impact scene."),M("fire","Spawn shots from Player","Copy stages/roll_player.gd and scripts/player.gd from the reference. Open player.tscn, detach health_player.gd, and drag player.gd onto Player. Keep all four scripts in stages. For the Shift shortcut in a manually built project, open Project Settings \u2192 Input Map, add an action named roll and bind Shift. Save. Run the game; tap D and release, then tap Space. The pulse travels right even while you stand still. Its parent is Arena so it keeps its own path after leaving the player.","One tap sends a pulse along the last movement direction. While stamina covers the cost, holding Space releases another shot after each 0.25-second cooldown. Shots that miss disappear after 1.8 seconds."),M("win-lose","Verify both endings in a fresh round","Start the game from its initial positions with F5. Keep the default forward heading and hold Space toward the enemy. Count three landed hits and watch the impact rings. On VICTORY press R and stand still until DEFEAT. Press R again and check movement, firing, health, and the hidden result label. Compare with the complete reference archive to inspect its decorated arena and finished HUD.","Three successful shots defeat the sentinel. Both victory and defeat restart into a fresh, playable round with 3 HP on each side.")],question:"Why set spent to true immediately on the first hit before calling queue_free()?",options:["Deletion happens at the end of the frame, so another overlap must be ignored.","It makes every future projectile unusable.","It resets the cooldown on Player."],answer:0,feedback:"Each shot owns its own spent flag. Further overlap callbacks on that same shot exit before applying a second hit.",troubleshooting:[U("A red preload error appears when attaching a script.","Create dependencies in order: save scenes/impact.tscn, then scenes/projectile.tscn, then attach scripts/player.gd. Check paths and lower-case filenames."),U("Shots appear but pass through the enemy.","Confirm Projectile masks checkbox 3 and Enemy/Hurtbox is monitorable on layer 3. Both nodes need assigned collision shapes."),U("Restart leaves an old shot on screen.","Add the projectile root to the group named projectiles. Save projectile.tscn, run Arena as the main scene, and verify that R is bound to restart.")],walkthrough:[$('const SHOT := preload("res://scenes/projectile.tscn")',"A constant keeps the same reference throughout the script. preload prepares the scene resource so each trigger can make a new instance."),$("var shot := SHOT.instantiate()","This local variable points to one newly created projectile. get_parent().add_child(shot) places it beside Player under Arena."),$("global_position += direction * speed * delta","Here the script changes position directly, so units per second must be multiplied by seconds. This differs from assigning CharacterBody3D.velocity."),$("if spent: return","A guard exits an overlap callback that has already been handled. queue_free requests deletion at the end of the frame."),$("get_tree().reload_current_scene()","When a finished round receives restart, Godot replaces the running arena with a fresh instance from disk. Saved starting HP, transforms, and visibility return.")],files:["stages/roll_player.gd","scripts/player.gd","scripts/projectile.gd","scripts/impact.gd","scenes/projectile.tscn","scenes/impact.tscn"]}]},so,Sn,Tt,xt];var Pe=(e,t)=>Y(e,t,"./assets/reactions-guide/");function ro(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">BLENDER \u2192 RELAY ARENA</span><h1>React to a hit. Fall at zero HP.</h1><p>Give the scout and sentinel their own flinch and fall. Their health determines which action plays.</p></header>
 <nav class="guide-tabs"><a href="./assets/character-guide/Beacon-Pilot.blend" download>Player .blend</a><a href="./assets/reactions-guide/Sentinel.blend" download>Enemy .blend</a><a href="./assets/character-guide/hero.glb" download>Player GLB</a><a href="./assets/reactions-guide/enemy.glb" download>Enemy GLB</a><a href="#/lesson/projectiles-and-restart">Open arena \u2192</a><a href="#/enemy-attack">Time an enemy weapon strike \u2192</a></nav>
 ${B(1,"Key a short flinch on each rig",`<p>Open either Blender example. Select the armature and switch a Dope Sheet editor to <b>Action Editor</b>. For your own rig, preserve your existing actions, create a new action named <code>hit</code>, and enable Fake User (shield) or keep it in an NLA strip.</p><p>In Pose Mode at frame 1, key the ready pose. At frame 3, pull the chest back and raise the forearms, then key the changed bones. At frame 9, restore and key the ready pose. Scrub from 1 to 9: the body should recoil and recover while the feet stay near their starting points. At 24 fps this example lasts (9 \u2212 1) / 24 = 0.333 seconds.</p>
 ${Pe("blender-hit","Blender \xB7 Beacon Pilot at the strongest recoil, frame 3 of the hit action.")}
 <p>Repeat on the enemy\u2019s armature. Its action can use a different silhouette and duration; the arena reads the clip length for each actor.</p>`)}
 ${B(2,"Key a fall with a held final pose",`<p>Create another action named <code>death</code>. Start upright at frame 1. Rotate and lower the body bone as the knees give way, then pose the arms and torso against the floor. In the example the body lands on frame 17. Copy those final pose keys to frame 41 so the body rests on the ground for the last second.</p>
 ${Pe("blender-death","Blender \xB7 the sentinel stays prone at frame 41. Its final keys preserve the landed pose.")}
 <p>Preview from the side. If the body passes through the ground, lift the body bone until the mesh meets the floor. Keep this motion in the rig: the game owns the actor\u2019s world position. Playback will sample the final key and hold it until restart.</p>`)}
 ${B(3,"Export one GLB per actor",`<p>Select just the player armature and its meshes in Object Mode. Choose <b>File \u2192 Export \u2192 glTF 2.0</b>, select <b>glTF Binary (.glb)</b> and <b>Selected Objects</b>. Enable Animation, choose <b>Actions</b>, and in Blender 4.2 enable <b>Set all glTF Animation starting at 0</b>. Export <code>hero.glb</code>. Repeat for the enemy rig as <code>foe.glb</code>.</p>
 ${Pe("blender-export","Blender glTF export \xB7 the player has attack, death, hit, idle and walk actions.")}
 <p>The example enemy has idle, walk, attack, hit and death. Keep actions attached to their own rig. If a clip is missing, check its keyframes and retained action in Blender, then export the mesh and armature together again.</p>`)}
 ${B(4,"Test both actors in the browser",`<p>Open Relay Arena. In <b>Use my Blender character</b>, choose your player GLB or click <b>Try the example character</b>. In <b>Use a Blender enemy</b>, choose the enemy GLB or click <b>Try the example enemy</b>. Match each actor\u2019s <b>Hit clip</b> and <b>Death clip</b> to its own actions. The selectors also accept differently named clips.</p>
 <p>Expand <b>Practice hit &amp; fall</b>. Click <b>Hit enemy</b> once: watch 3 \u2192 2 HP, recoil and recovery. Hit twice more: 1 \u2192 0 triggers the fall and holds the body down. Click <b>Reset practice</b> and repeat with <b>Hit player</b>. Each button removes exactly 1 HP so you can see both outcomes.</p>
 ${Pe("browser-practice","Browser practice \xB7 each actor has its own HP. Reset restores both for the next test.")}
 <p>Then choose <b>Start battle</b>. Stand still to let the sentinel land a weapon strike, or fire at it with Space. Your tuned attack power applies in the fight. A 3-damage shot against 3 HP goes straight to the fall. After victory or defeat, press R to start again.</p><a class="primary" href="#/lesson/projectiles-and-restart">Try both reactions \u2192</a>`)}
 ${B(5,"Install and inspect the reactions in Godot",`<p>After selecting both models, choose <b>Download tuned Godot kit</b>. Extract the <code>battle_lab</code> folder beside <code>project.godot</code>. Open <code>battle_lab/scenes/arena.tscn</code> in Godot 4.4.1 and press <b>F6</b>. For an older customized project, open the new kit alongside it and compare the player and enemy scenes before merging your changes.</p>
 ${Pe("godot-setup","Godot \xB7 double-click foe.glb in the FileSystem dock. Advanced Import Settings lists death, hit, idle and walk under AnimationPlayer.")}
 <p>In <code>player.tscn</code> and <code>enemy.tscn</code>, look for the <b>Reactions</b> child beneath the actor root. Its script listens to the parent\u2019s <code>health_changed</code> signal and finds the AnimationPlayer beneath <code>Model</code>. The kit maps the selected clips to <code>hit</code> and <code>death</code>. Each actor keeps its own controller, collision shape and hurtbox.</p>
 <details class="trouble"><summary>Connecting this to my own health code</summary><p>Use a CharacterBody3D actor with a numeric health property, a Model child and a health_changed signal that emits the new HP. Subtract damage once, clamp HP to zero, then emit the updated value. The supplied Reactions node compares it with previous HP. In your own hierarchy, adapt the actor/model paths and the arena\u2019s finished flag. If your attack has a wind-up, cancel its pending shot when entering a reaction; see cancel_attack() in the kit\u2019s timed attack controller.</p><a download href="./assets/reactions-guide/reactions.gd">Download the reaction script</a></details>`)}
 ${B(6,"Check recovery, defeat and restart",`<p><b>Surviving a hit:</b> when health drops but remains above zero, the reaction script briefly takes control from locomotion and samples the hit clip once. At the end it restores movement. A hit during attack preparation cancels the pending projectile.</p>
 ${Pe("godot-hit","Godot playtest \xB7 a surviving actor recoils while the health display shows reduced HP.")}
 <p><b>Falling at zero:</b> lethal damage selects death immediately. Combat stops, but the Reactions child keeps advancing its own physics clock until the final key. The body stays in the scene at that pose. R reloads a fresh round with both actors upright and at 3 HP.</p>
 ${Pe("godot-death","Godot playtest \xB7 the defeated actor remains down after its HP reaches zero.")}
 <p><b>Body pops upright?</b> Check the last Blender keys, the selected death clip, and whether another controller restarts idle after death. <b>Only a simple tilt?</b> Check the clip dropdown for each actor and re-export the kit: a model without a mapped clip uses the built-in recoil or fall. <b>Wrong actor reacts?</b> Check which actor owns the struck hurtbox and which actor emitted its health change.</p>`)}
 </div>`}var tt=(e,t)=>Y(e,t,"./assets/attack-guide/");function io(){return`<div class="page guide-page"><header class="page-title"><span class="kicker">BLENDER \u2192 RELAY ARENA</span><h1>Fire on the attack pose</h1><p>One press of Space starts the wind-up. The pulse leaves when the arm reaches the firing pose. After recovery, the character returns to idle or walk.</p></header>
  <nav class="guide-tabs"><a download href="./assets/character-guide/Beacon-Pilot.blend">Blender example</a><a download href="./assets/character-guide/hero.glb">Animated player GLB</a><a href="#/lesson/projectiles-and-restart">Play the arena \u2192</a><a href="#/reactions">Add hit and death actions \u2192</a></nav>
  ${B(1,"Give the rig an attack action",`<p>Open the example or your own rigged character in Blender. If you need to connect the rig for the first time, start with the <a href="#/character">character replacement guide</a>. Select the armature and open <b>Dope Sheet \u2192 Action Editor</b>. Keep the existing idle and walk actions. Create a separate action named <code>attack</code> on the same armature and preserve it with Fake User (shield) or an NLA strip.</p>
  <p>Set the frame rate under <b>Output Properties \u2192 Format \u2192 Frame Rate</b>. Beacon Pilot uses 24 fps. In Pose Mode, place the arm at each pose and insert rotation keys for the affected bones. Key the starting and ending neutral poses as well. Scrub through the action to check that the shot has a clear moment of extension.</p>
  <div class="attack-poses"><span><b>1</b> Ready</span><span><b>5</b> Raise</span><span><b>9</b> Release</span><span><b>12</b> Recoil</span><span><b>17</b> Recover</span><span><b>25</b> Neutral</span></div>
  ${tt("blender-attack","Blender Action Editor \xB7 frame 9 holds the extended-arm pose. RELEASE marks the intended shot.")}
  <p>To mark your release frame, hover over the timeline, press M, then rename the marker RELEASE in the Marker menu. The marker helps you read the frame in Blender. In step 3 you enter the corresponding time for the game.</p>`)}
  ${B(2,"Export all three actions from the same starting time",`<p>In Object Mode select the armature and its skinned meshes. Choose <b>File \u2192 Export \u2192 glTF 2.0</b>. Use <b>glTF Binary (.glb)</b>, enable <b>Selected Objects</b> and <b>Animation</b>, and choose <b>Actions</b> as the animation mode. In Blender 4.2, open <b>Animation \u2192 Rest &amp; Ranges</b> and enable <b>Set all glTF Animation starting at 0</b>. Export the GLB.</p>
  ${tt("blender-export","Blender glTF export \xB7 Actions mode and a zero start time for each exported clip.")}
  <p><b>Calculate your release time:</b> subtract the first frame of the exported action from its release frame, then divide by the frame rate. For Beacon Pilot, <code>(9 \u2212 1) / 24 = 0.333 s</code>. The full clip lasts <code>(25 \u2212 1) / 24 = 1.000 s</code>. If the animation plays too early or late, check the exported start and fps before changing the poses.</p>`)}
  ${B(3,"Choose the firing pose in the arena",`<p>In <a href="#/lesson/projectiles-and-restart">Relay Arena</a>, expand <b>Use my Blender character</b>. Choose your GLB or <b>Try the example character</b>. Match the idle and walk clips, then select the one-shot in <b>Attack clip</b>. Different action names work: the kit labels the three selected clips idle, walk and attack.</p>
  <p>Drag <b>Release time (seconds)</b> to your calculated time. <b>Show release pose</b> displays that exact instant on the model thumbnail. For the example, look for the extended arm at 0.333 s. Scrub a little earlier and later to compare the wind-up with recoil.</p>
  ${tt("browser-release","Browser arena \xB7 the attack clip, release time and character thumbnail show the selected firing pose.")}
  <p>Click <b>Start battle</b> and tap Space once. Watch for one pulse during the extension and an idle pose after recovery. Hold D and tap Space: movement continues, the attack plays once, and walking resumes while D is held. Holding Space starts the next attack after recovery. A two-clip character can use <b>None \xB7 instant shot</b>.</p><a class="primary" href="#/lesson/projectiles-and-restart">Test the release timing \u2192</a>`)}
  ${B(4,"Bring the same attack into Godot",`<p>Click <b>Download tuned Godot kit</b>. Its GLB, player scene and firing script contain your chosen attack and timing. For a fresh install, put the extracted <code>battle_lab</code> folder beside <code>project.godot</code>. In Godot, open <code>res://battle_lab/scenes/arena.tscn</code> and press <b>F6</b>. The <a href="#/own-project">project setup guide</a> shows where to put the folder.</p>
  <p>To inspect or retime it, open <code>battle_lab/scenes/player.tscn</code>, select the Player root, and find <b>Attack Release Seconds</b> in the Inspector. The field measures time from the start of the attack. Save the player scene and run the arena again.</p>
  ${tt("godot-inspector","Godot 4.4.1 \xB7 the Player root exposes Attack Release Seconds in the Inspector.")}
  <details class="trouble"><summary>Already customized an older kit?</summary><p>Open the new kit separately and compare <code>assets/hero.glb</code>, <code>scripts/player.gd</code> and <code>scenes/player.tscn</code> with your copies. Import the three-clip GLB. In an existing project using the course hierarchy, put the new controller on Player, keep <code>Model/Hero/AnimationPlayer</code> and <code>AnimationTree</code>, then enter your release time in the Inspector. If you keep personal changes in player.gd, merge its attack timing and projectile-spawn logic into your existing controller. The linked script expects the kit\u2019s paths and <code>battle_lab_fire</code> action.</p><a download href="./assets/attack-guide/attack_player.gd">Download the Godot attack controller</a></details>`)}
  ${B(5,"Check the shot and the return to movement",`<p>The walking blend tree owns the skeleton during normal movement. On Space, the controller gives the skeleton to AnimationPlayer for one non-looping <code>attack</code>. Each physics tick advances the pose and the same elapsed-time counter. When the counter first reaches <code>attack_release_seconds</code>, the controller spawns one projectile. A flag remembers that it fired. At the end of the clip the blend tree resumes and reads the player's current velocity.</p>
  ${tt("godot-release","Running Godot arena \xB7 the release pose and the projectile at the start of its flight.")}
  <p><b>Only an instant shot?</b> Check the selected attack clip and re-export the kit with it selected. <b>Two pulses from one tap?</b> Keep a single projectile spawn at the release check; remove any old immediate-fire call or duplicate animation event in your own controller. <b>Stuck in attack?</b> Confirm the clip plays once and the controller reactivates AnimationTree at the end. Test once standing still and once while moving.</p>`)}
  </div>`}var He=(e,t)=>te("./assets/setup/"+e+".webp",t),ve=(e,t,n)=>`<section class="guide-step"><div class="guide-index">${e}</div><div><h2>${t}</h2>${n}</div></section>`,At=e=>`<pre tabindex="0"><code>${b(e)}</code></pre>`,Rn='<a class="lib-link" href="#/setup">First time using Godot? Open the illustrated setup guide \u2192</a>';function lo(e){let t=`<header class="page-title"><span class="kicker">GODOT 4.4.1 STANDARD</span><h1>${e?"Use your own project":"Your first Godot setup"}</h1><p>${e?"Bring the settings you tested in the browser into your own Godot game.":"Install the editor, create an empty 3D project, and run your first scene."}</p></header>
 <nav class="guide-tabs"><a ${e?"":'aria-current="page"'} href="#/setup">Start from zero</a><a ${e?'aria-current="page"':""} href="#/own-project">Use my existing project</a><a href="#/character">Use my Blender character</a></nav>`,n='<details class="trouble"><summary>Use English in the editor and file dialogs</summary><div class="practice-help"><p>In Godot open Editor \u2192 Editor Settings and search for \u201Clanguage\u201D. Set Interface \u2192 Editor \u2192 Editor Language to English and restart the editor if prompted.</p><p>The Open and Cancel buttons in your computer\u2019s file dialog follow the application or system language. On a Mac, open System Settings \u2192 General \u2192 Language &amp; Region \u2192 Applications, add your browser or Codex, select English and reopen the app. On Windows 11, open Settings \u2192 Time &amp; language \u2192 Language &amp; region, select English under Windows display language, then sign out and back in. This changes the display language throughout Windows.</p></div></details>',o=[ve(1,"Open Godot for the first time",`<p>Choose <b>Godot 4.4.1 Standard</b> for your operating system. This edition includes GDScript. The supplied scout model opens directly in Godot.</p><a class="secondary" href="https://godotengine.org/download/archive/4.4.1-stable/" target="_blank" rel="noopener">Get Godot 4.4.1</a><ul><li><b>Windows:</b> Choose the Windows build for your processor (usually x86_64). Extract the ZIP, open its folder and run the Godot application.</li><li><b>macOS:</b> Extract the download, move Godot.app into Applications and open it.</li><li><b>Linux:</b> Extract the Linux build for your processor. In file properties, allow the binary to execute, then launch it.</li></ul><p><b>Checkpoint:</b> the Project Manager opens. If offered example projects, continue to the local project list.</p>${He("project-manager","Project Manager \xB7 Create starts a new project. Import opens an existing project.godot.")}`),ve(2,"Create a project folder",`<p>Click <b>Create</b>. Enter <b>Battle Lab Work</b> as the project name and choose an empty folder you can find again. Select <b>Compatibility</b> under Renderer, keep the option to open the editor enabled, and confirm.</p>${He("create-project","Create Project \xB7 choose the project folder and the Compatibility renderer.")}<p><b>Checkpoint:</b> the new folder contains <code>project.godot</code>. Inside the editor, <code>res://</code> means the folder containing this file.</p>`),ve(3,"Save a 3D scene",`<p>In the Scene dock, click <b>3D Scene</b>. Select the new Node3D, press F2, and name it <b>Arena</b>. Right-click <code>res://</code> in FileSystem, choose Create New \u2192 Folder and name it <b>scenes</b>. Use <b>Scene \u2192 Save Scene As</b> to save <code>res://scenes/arena.tscn</code>.</p>${He("editor","3D editor \xB7 Scene holds the node tree, FileSystem holds files, and Inspector shows the selection.")}<p>Press <b>F6</b> to run this scene. A blank game window is expected until you add a mesh and camera. <b>F8</b> stops it. On keyboards with media keys, use Fn with the function key or the run controls at the top right.</p>`),ve(4,"Run a visible game",'<p>Download the <a download href="./downloads/battle-lab.zip">reference game ZIP</a> and extract it into a separate folder. In Project Manager click <b>Import</b>, choose the extracted <code>project.godot</code>, and open the project. Wait for asset import, then press <b>F5</b>. Click the game, move with WASD and fire with Space.</p><figure class="guide-photo"><img src="./assets/art/gameplay.png" alt="Relay Arena running with the player, sentinel and both health values"><figcaption>Expected result \xB7 both characters start with 3 HP.</figcaption></figure><p>Return to Battle Lab Work to build the scene yourself, or install the playable kit directly into it.</p><a class="primary" href="#/lesson/editor-tour">Begin the first lesson \u2192</a> <a class="lib-link" href="#/own-project">Add the playable kit \u2192</a>')].join(""),a=[ve(1,"Download your tuned kit",'<p>Open Relay Arena. Under <b>Tune this round</b>, edit both function bodies and choose <b>Apply &amp; fight again</b>. Once the fight feels right, click <b>Download tuned Godot kit</b>. The ZIP includes both evaluated values in <code>battle_lab/tuning.gd</code> and a complete playable 3D scene.</p><a class="primary" href="#/lesson/projectiles-and-restart">Tune and download my kit \u2192</a> <a class="lib-link" download href="./downloads/arena-kit.zip">Use defaults (4 m/s, 1 damage)</a>'),ve(2,"Put the kit in your existing project",`<p>Open your Godot 4 project. In FileSystem, right-click <code>res://</code> and use the option to reveal it in your file manager. Extract the downloaded ZIP. Copy the inner <code>battle_lab</code> folder directly beside your project's <code>project.godot</code>.</p>${At(`MyGame/
  project.godot
  battle_lab/
    tuning.gd
    scenes/arena.tscn
    scripts/
    stages/
    assets/scout.glb`)}<p>Return to Godot and wait for import. Keep the name <code>battle_lab</code> because the scenes use that path. For later tuning updates, copy only <code>tuning.gd</code> to preserve your scene edits. To bring in a new character as well, follow the <a href="#/character">character replacement guide</a>.</p>`),ve(3,"Run the kit inside your project",`<p>Double-click <code>res://battle_lab/scenes/arena.tscn</code>. Press <b>F6</b> to run this scene directly. Click the game window, move with WASD and hold Space. Press R after victory or defeat. F5 runs your project's selected main scene.</p>${He("project-kit","The imported kit \xB7 open battle_lab/scenes/arena.tscn from FileSystem.")}<p><b>Check your tuning:</b> at 2 damage, the sentinel drops from 3 HP to 1, then to 0. If a resource is missing, check for an extra folder level above battle_lab.</p>${He("tuning","The kit settings file \xB7 this example uses 4 m/s and 1 damage per hit.")}`),ve(4,"Connect your own player and weapon",`<p>If your project already has a player and a weapon, read the settings in their existing scripts. Add this declaration below the <code>extends</code> line in each script:</p>${At('const BattleTuning = preload("res://battle_lab/tuning.gd")')}<p><b>Player:</b> In your CharacterBody3D movement function, multiply the existing horizontal direction by the tuned speed. Preserve gravity and your existing call to <code>move_and_slide()</code>. With the course controller\u2019s direction variable, use:</p>${At(`velocity.x = direction.x * BattleTuning.MOVE_SPEED
velocity.z = direction.z * BattleTuning.MOVE_SPEED`)}<p><b>Weapon:</b> In your projectile hit callback, pass the tuned amount to the enemy\u2019s damage method. The course enemy owns its hurtbox, so the call is:</p>${At("area.get_parent().take_damage(BattleTuning.ATTACK_POWER)")}<p>Use your own direction variable, target node and method names if they differ. Your enemy's damage method should subtract the supplied amount from its health. Test with 3 HP and compare the remaining health after one hit.</p><a class="lib-link" href="#/lesson/health-and-pursuit">Build a damage method \u2192</a>`),ve(5,"Check the controls",`<p>The kit registers its own prefixed input actions when its arena loads. For a controller you write yourself, open <b>Project \u2192 Project Settings \u2192 Input Map</b>. Add move_left, move_right, move_forward and move_back, then use + on each row to assign A, D, W and S. Add fire with Space. If your player already has actions, use its existing names in your script.</p>${He("input-map","Reference project Input Map \xB7 WASD, Space and R bindings for the manually built controller.")}`)].join("");return`<div class="page guide-page">${t}${n}${e?a:o}</div>`}var Yo={"health-and-pursuit":["Trace a damage call","Deal one point at a time. Watch the stored value and the signal sent to the HUD.",'<div class="keypad"><button data-hit>take_damage(1)</button><button data-reset>Reset health</button></div>'],"functions-and-signals":["Follow the event","Call shoot() to trace the connection between the sender and listener.",'<button class="secondary" data-fire>Call shoot()</button>'],variables:["Inspector override","Change Speed and watch what the script reads.",'<label>Speed <input type="range" min="0" max="10" step=".5" value="4"></label>'],"conditions-and-loops":["Trace the loop","Advance one iteration and inspect the branch Godot takes.",'<button class="secondary" data-tick>Next iteration</button>'],"wasd-movement":["Trace movement","Toggle direction keys. Opposing keys cancel and diagonals stay within the speed limit.",'<div class="keypad">'+["W","A","S","D"].map(e=>'<button aria-pressed="false" data-key="'+e+'">'+e+"</button>").join("")+"</div>"],"nodes-and-collisions":["Inspect the floor","Select a node to see the job it performs.",'<div class="keypad">'+["Floor","MeshInstance3D","CollisionShape3D"].map((e,t)=>'<button aria-pressed="'+(t===0)+'" data-node="'+t+'">'+e+"</button>").join("")+"</div>"]};function co(e){let t=Yo[e];return t?'<div class="sim" data-sim="'+e+'"><div class="panel-label">'+I("terminal",14)+" INTERACTIVE TRACE</div><h3>"+t[0]+"</h3><p>"+t[1]+"</p>"+t[2]+'<output aria-live="polite"></output></div>':""}function Pt(e,t){if(!e)return;let n=e.querySelector("output");if(e.dataset.sim==="health-and-pursuit"){let o=Number(e.dataset.hp??3),a=t?.hasAttribute("data-hit")?Math.max(0,o-1):3;e.dataset.hp=a,n.textContent=t?.hasAttribute("data-hit")?o===0?"health = 0 \u2192 return (already defeated)":"health = maxi(0, "+o+" \u2212 1) \u2192 "+a+`
health_changed.emit(`+a+")":"health = 3"}if(e.dataset.sim==="functions-and-signals"&&(n.textContent=t?.hasAttribute("data-fire")?`shoot() \u2192 fired.emit(1) \u2192 _on_fired(1)
Output: Shots fired: 1`:"Ready \xB7 fired is connected to _on_fired"),e.dataset.sim==="variables"&&(n.textContent="speed = "+Number(e.querySelector("input").value).toFixed(1)),e.dataset.sim==="conditions-and-loops"){let o=Number(e.dataset.iter??-1);t?.hasAttribute("data-tick")&&(o=(o+1)%3),e.dataset.iter=o;let a=[0,2,1][o];n.textContent=o<0?"health_values = [0, 2, 1]":"Iteration "+(o+1)+"   hp = "+a+`
`+(a>0?"Active target: ":"Disabled target: ")+a}if(e.dataset.sim==="wasd-movement"){t?.dataset.key&&t.setAttribute("aria-pressed",t.getAttribute("aria-pressed")!=="true");let o=[...e.querySelectorAll("[aria-pressed=true]")].map(c=>c.dataset.key),a=+o.includes("D")-o.includes("A"),s=+o.includes("S")-o.includes("W"),i=Math.hypot(a,s)||1;n.textContent="velocity = Vector3("+(4*a/i).toFixed(2)+", 0, "+(4*s/i).toFixed(2)+`)
Horizontal speed: `+(a||s?"4.0":"0.0")+" m/s"}if(e.dataset.sim==="nodes-and-collisions"){t?.dataset.node!==void 0&&e.querySelectorAll("[data-node]").forEach(a=>a.setAttribute("aria-pressed",a===t));let o=e.querySelector("[aria-pressed=true]").dataset.node;n.textContent=["StaticBody3D \xB7 stationary body at Y = \u22120.25 m","BoxMesh \xB7 draws the 18 \xD7 0.5 \xD7 14 m platform","BoxShape3D \xB7 supplies the physical surface at Y = 0 m"][o]}}var nt={"practice/properties.gd":`extends Node

@export var speed: float = 4.0

func _ready() -> void:
	print("Scout speed: ", speed)
`,"practice/guard.gd":`extends VBoxContainer

@export_range(0.05, 0.5, 0.01) var guard_window := 0.18
const IMPACT := 1.0
var elapsed := 0.0
var pressed_at := -1.0
var running := false

func _input(event: InputEvent) -> void:
	if event is InputEventKey and event.pressed and not event.echo:
		if event.physical_keycode == KEY_R:
			elapsed = 0.0
			pressed_at = -1.0
			running = true
			$Meter.value = 0
			$Cue.text = "Wind-up"
		elif event.physical_keycode == KEY_G and running and pressed_at < 0:
			pressed_at = elapsed
			$Cue.text = "Guard raised"

func _physics_process(delta: float) -> void:
	if not running:
		return
	elapsed = minf(elapsed + delta, IMPACT)
	$Meter.value = elapsed / IMPACT
	if elapsed >= IMPACT:
		running = false
		if pressed_at < 0:
			$Cue.text = "Hit \u2022 no guard"
		elif IMPACT - pressed_at <= guard_window:
			$Cue.text = "Perfect guard \u2022 damage blocked"
		else:
			$Cue.text = "Hit \u2022 guard expired"
`,"practice/guard.tscn":`[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://practice/guard.gd" id="Guard"]

[node name="GuardPractice" type="VBoxContainer"]
offset_left = 32.0
offset_top = 32.0
offset_right = 470.0
script = ExtResource("Guard")

[node name="Help" type="Label" parent="."]
text = "R starts a strike. Tap G once just before the bar fills."

[node name="Meter" type="ProgressBar" parent="."]
max_value = 1.0
step = 0.001
show_percentage = false

[node name="Cue" type="Label" parent="."]
text = "Press R when ready."
`,"practice/signals.gd":`extends Node

signal fired(amount: int)

func _ready() -> void:
	fired.connect(_on_fired)
	shoot()

func shoot() -> void:
	fired.emit(1)

func _on_fired(amount: int) -> void:
	print("Shots fired: ", amount)
`,"practice/targets.gd":`extends Node

var health_values: Array[int] = [0, 2, 1]

func _ready() -> void:
	for hp in health_values:
		if hp > 0:
			print("Active target: ", hp)
		else:
			print("Disabled target: ", hp)
`,"scenes/match_flow.tscn":`[gd_scene load_steps=3 format=3]

[ext_resource type="Script" path="res://scripts/match_flow.gd" id="Flow"]

[sub_resource type="StyleBoxFlat" id="Card"]
bg_color = Color(0.055, 0.093, 0.14, 0.97)
content_margin_left = 28.0
content_margin_right = 28.0
content_margin_top = 24.0
content_margin_bottom = 24.0
corner_radius_top_left = 12
corner_radius_top_right = 12
corner_radius_bottom_left = 12
corner_radius_bottom_right = 12

[node name="MatchFlow" type="Node"]
script = ExtResource("Flow")

[node name="Overlay" type="CanvasLayer" parent="."]
layer = 5

[node name="Score" type="Label" parent="Overlay"]
offset_left = 18.0
offset_top = 12.0
theme_override_styles/normal = SubResource("Card")

[node name="Center" type="CenterContainer" parent="Overlay"]
anchor_right = 1.0
anchor_bottom = 1.0

[node name="Card" type="PanelContainer" parent="Overlay/Center"]
custom_minimum_size = Vector2(410, 0)
theme_override_styles/panel = SubResource("Card")

[node name="Column" type="VBoxContainer" parent="Overlay/Center/Card"]
theme_override_constants/separation = 10

[node name="Title" type="Label" parent="Overlay/Center/Card/Column"]
theme_override_font_sizes/font_size = 30
theme_override_colors/font_color = Color(0.61, 1, 0.88, 1)
text = "Local match room"

[node name="Detail" type="Label" parent="Overlay/Center/Card/Column"]
text = "Two players \xB7 first to two round wins"

[node name="Progress" type="ProgressBar" parent="Overlay/Center/Card/Column"]
visible = false

[node name="First" type="Button" parent="Overlay/Center/Card/Column"]
text = "Request ready check"
custom_minimum_size = Vector2(0, 42)

[node name="Second" type="Button" parent="Overlay/Center/Card/Column"]
visible = false
custom_minimum_size = Vector2(0, 42)

[node name="Back" type="Button" parent="Overlay/Center/Card/Column"]
text = "Back to lobby"
custom_minimum_size = Vector2(0, 38)
`,"scripts/match_flow.gd":`extends Node

enum Phase { ROOM, READY, LOADING, LOADED, COUNTDOWN, LIVE, ROUND_RESULT, MATCH_RESULT, LOAD_ERROR }

@export_file("*.tscn") var arena_path := "res://scenes/duel.tscn"
@export_range(2, 60) var ready_seconds := 15
@export_range(1, 10) var countdown_seconds := 3
@export_range(1, 5) var wins_needed := 2
@onready var panel := $Overlay/Center
@onready var title: Label = $Overlay/Center/Card/Column/Title
@onready var detail: Label = $Overlay/Center/Card/Column/Detail
@onready var bar: ProgressBar = $Overlay/Center/Card/Column/Progress
@onready var first: Button = $Overlay/Center/Card/Column/First
@onready var second: Button = $Overlay/Center/Card/Column/Second
@onready var back: Button = $Overlay/Center/Card/Column/Back
@onready var score: Label = $Overlay/Score
var phase := Phase.ROOM
var accepted := [false, false]
var wins := [0, 0]
var history: Array[String] = []
var seconds_left := 0.0
var arena_scene: PackedScene
var duel

func _ready() -> void:
	first.pressed.connect(_first_pressed)
	second.pressed.connect(func(): _accept(1))
	back.pressed.connect(_back_pressed)
	_room()

func _card(heading: String, body: String, action: String, exit_text: String = "") -> void:
	panel.show()
	title.text = heading
	detail.text = body
	first.text = action
	first.visible = action != ""
	first.disabled = false
	second.hide()
	second.disabled = false
	back.text = exit_text
	back.visible = exit_text != ""
	bar.hide()
	if first.visible:
		first.grab_focus()

func _room(note: String = "") -> void:
	phase = Phase.ROOM
	if is_instance_valid(duel):
		remove_child(duel)
		duel.queue_free()
	duel = null
	arena_scene = null
	wins.assign([0, 0])
	history.clear()
	score.hide()
	_card("Local match room", note + "Two players \xB7 first to %d round wins" % wins_needed, "Request ready check", "Back to lobby")

func _ready_check() -> void:
	phase = Phase.READY
	accepted.assign([false, false])
	seconds_left = ready_seconds
	_card("Accept the match", "", "P1 \xB7 Accept", "Decline")
	second.text = "P2 \xB7 Accept"
	second.show()
	_ready_status()

func _ready_status() -> void:
	detail.text = "%d / 2 accepted   \xB7   %d s left" % [accepted.count(true), ceili(seconds_left)]

func _accept(slot: int) -> void:
	if phase != Phase.READY or accepted[slot]:
		return
	accepted[slot] = true
	if slot == 0:
		first.disabled = true
		second.grab_focus()
	else:
		second.disabled = true
		first.grab_focus()
	_ready_status()
	if accepted.all(func(value): return value):
		_begin_load()

func _begin_load() -> void:
	phase = Phase.LOADING
	_card("Loading arena", "Reading the duel scene and its resources\u2026", "")
	bar.value = 0
	bar.show()
	var error := ResourceLoader.load_threaded_request(arena_path, "PackedScene")
	if error != OK:
		_load_error()

func _poll_load() -> void:
	var progress := []
	var status := ResourceLoader.load_threaded_get_status(arena_path, progress)
	match status:
		ResourceLoader.THREAD_LOAD_IN_PROGRESS:
			if not progress.is_empty():
				bar.value = progress[0] * 100
		ResourceLoader.THREAD_LOAD_LOADED:
			arena_scene = ResourceLoader.load_threaded_get(arena_path) as PackedScene
			if arena_scene == null:
				_load_error()
				return
			phase = Phase.LOADED
			_card("Arena loaded", "P1: WASD + Space   /   P2: arrows + Enter\\nOne pad controls P2. Use left stick + X.", "Enter arena", "Return to room")
			bar.value = 100
			bar.show()
		_:
			_load_error()

func _load_error() -> void:
	phase = Phase.LOAD_ERROR
	_card("Arena unavailable", "Could not load " + arena_path, "Retry load", "Return to room")

func _start_round() -> void:
	if not is_instance_valid(duel):
		duel = arena_scene.instantiate()
		if not duel.has_method("start_round"):
			duel.free()
			duel = null
			_load_error()
			return
		add_child(duel)
	duel.start_round("local")
	duel.get_node("HUD").hide()
	duel.set_physics_process(false)
	phase = Phase.COUNTDOWN
	seconds_left = countdown_seconds
	_card("Round %d" % (history.size() + 1), "Starts in %d" % countdown_seconds, "")
	score.show()
	_update_score()

func _update_score() -> void:
	score.text = "Round %d     P1  %d HP     P2  %d HP     |     Rounds  %d \u2013 %d" % [history.size()+1, duel.hp[0], duel.hp[1], wins[0], wins[1]]

func _finish_round() -> void:
	if phase != Phase.LIVE or duel.result == "":
		return
	duel.set_physics_process(false)
	if duel.hp[0] != duel.hp[1]:
		var winner := 0 if duel.hp[0] > duel.hp[1] else 1
		wins[winner] += 1
	history.append("R%d   %s   (%d : %d HP)" % [history.size()+1, duel.result, duel.hp[0], duel.hp[1]])
	score.hide()
	var summary := "Round wins   %d \u2013 %d\\n%s" % [wins[0], wins[1], "\\n".join(history.slice(-5))]
	if wins.max() >= wins_needed:
		phase = Phase.MATCH_RESULT
		_card("Match winner \xB7 P%d" % (1 if wins[0] > wins[1] else 2), summary, "Play again", "Leave to lobby")
	else:
		phase = Phase.ROUND_RESULT
		_card("Round %d \xB7 %s" % [history.size(),duel.result], summary, "Next round", "Leave to lobby")

func _first_pressed() -> void:
	match phase:
		Phase.ROOM: _ready_check()
		Phase.READY: _accept(0)
		Phase.LOAD_ERROR: _begin_load()
		Phase.LOADED, Phase.ROUND_RESULT: _start_round()
		Phase.MATCH_RESULT:
			_room()
			_ready_check()

func _back_pressed() -> void:
	match phase:
		Phase.READY: _room("Ready check declined.\\n")
		Phase.LOAD_ERROR, Phase.LOADED: _room()
		Phase.ROOM, Phase.ROUND_RESULT, Phase.MATCH_RESULT:
			get_tree().change_scene_to_file("res://scenes/lobby.tscn")

func _process(delta: float) -> void:
	match phase:
		Phase.READY:
			seconds_left = maxf(0, seconds_left - delta)
			_ready_status()
			if seconds_left == 0:
				_room("Ready check expired.\\n")
		Phase.LOADING: _poll_load()
		Phase.COUNTDOWN:
			seconds_left = maxf(0, seconds_left - delta)
			detail.text = "Starts in %d" % ceili(seconds_left)
			if seconds_left == 0:
				panel.hide()
				phase = Phase.LIVE
				duel.set_physics_process(true)
		Phase.LIVE:
			_update_score()
			_finish_round()
`,"stages/motion.gd":`extends CharacterBody3D

@export var speed: float = 4.0
var facing := Vector3.FORWARD
var gravity: float = ProjectSettings.get_setting("physics/3d/default_gravity")

func _physics_process(delta: float) -> void:
	var axes := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	var direction := Vector3(axes.x, 0, axes.y)
	velocity.x = direction.x * speed
	velocity.z = direction.z * speed
	if direction.length_squared() > 0.0:
		facing = direction.normalized()
		$Model.rotation.y = atan2(-facing.x, -facing.z)
	_move_on_floor(delta)

func _move_on_floor(delta: float) -> void:
	if not is_on_floor():
		velocity.y -= gravity * delta
	move_and_slide()
	global_position.x = clampf(global_position.x, -8.3, 8.3)
	global_position.z = clampf(global_position.z, -6.3, 6.3)
`,"scenes/gamepad_check.tscn":`[gd_scene load_steps=2 format=3]

[ext_resource type="Script" path="res://scripts/gamepad_check.gd" id="Check"]

[node name="GamepadCheck" type="VBoxContainer"]
anchor_right = 1.0
anchor_bottom = 1.0
offset_left = 28
offset_top = 28
offset_right = -28
theme_override_constants/separation = 16
script = ExtResource("Check")

[node name="Title" type="Label" parent="."]
text = "Gamepad input check"
theme_override_font_sizes/font_size = 32

[node name="Instructions" type="Label" parent="."]
text = "Move the left stick. Hold X, B or Y and watch the readout. Press F8 to stop."
autowrap_mode = 3

[node name="Status" type="Label" parent="."]
autowrap_mode = 3
`,"scripts/gamepad_check.gd":`extends Control

func _process(_delta: float) -> void:
	var devices := Input.get_connected_joypads()
	if devices.is_empty():
		$Status.text = "No gamepad detected. Connect USB or pair in Bluetooth settings.\\nLeave this scene running and press a button on the controller."
		return
	var rows := PackedStringArray()
	for device in devices:
		var axes := Vector2(Input.get_joy_axis(device, JOY_AXIS_LEFT_X), Input.get_joy_axis(device, JOY_AXIS_LEFT_Y))
		var pressed := PackedStringArray()
		for index in 4:
			if Input.is_joy_button_pressed(device, index):
				pressed.append(["A", "B", "X", "Y"][index])
		rows.append("%s  \xB7  Device %d\\nLeft stick   X %.2f   Y %.2f\\nFace buttons   %s" % [Input.get_joy_name(device), device, axes.x, axes.y, " / ".join(pressed) if not pressed.is_empty() else "released"])
	$Status.text = "\\n\\n".join(rows)
`,"scripts/gamepad.gd":`extends RefCounted

const DEADZONE := 0.2

static func device_for_slot(devices: Array, slot: int, shared_keyboard: bool) -> int:
	if shared_keyboard and devices.size() == 1:
		return devices[0] if slot == 1 else -1
	return devices[slot] if slot < devices.size() else -1

static func stick(device: int) -> Vector2:
	if device < 0:
		return Vector2.ZERO
	var axes := Vector2(Input.get_joy_axis(device, JOY_AXIS_LEFT_X), Input.get_joy_axis(device, JOY_AXIS_LEFT_Y))
	var strength := axes.length()
	if strength <= DEADZONE:
		return Vector2.ZERO
	return axes.normalized() * minf(1.0, (strength - DEADZONE) / (1.0 - DEADZONE))
`,"stages/animated_player.gd":`extends "res://stages/motion.gd"

func _ready() -> void:
	var clips: AnimationPlayer = $Model/AnimationPlayer
	for clip in ["idle", "walk"]:
		clips.get_animation(clip).loop_mode = Animation.LOOP_LINEAR
	$AnimationTree.active = true

func _physics_process(delta: float) -> void:
	super(delta)
	var moving := Vector2(velocity.x, velocity.z).length() > 0.01
	$AnimationTree.set("parameters/blend_position", 1.0 if moving else 0.0)
`,"stages/health_player.gd":`extends "res://stages/animated_player.gd"

signal health_changed(value: int)
@export var health: int = 3

func take_damage(amount: int) -> void:
	if health <= 0:
		return
	health = maxi(0, health - amount)
	health_changed.emit(health)
`,"scripts/enemy.gd":`extends CharacterBody3D

signal health_changed(value: int)
@export var speed: float = 1.35
@export var health: int = 3
@export_range(0, 1, 0.01) var attack_contact_fraction: float = 0.5
const WEAPON_TIP := Vector3(0, 0.99, 0)
const ATTACK_RANGE := 1.6
const HURT_RADIUS := 0.37
const BLADE_RADIUS := 0.12

@onready var player: CharacterBody3D = $"../Player"
var clips: AnimationPlayer
@onready var blade: Node3D = $BladePivot
var weapon_skeleton: Skeleton3D
var weapon_bone := -1
var weapon_tip_bone := -1
var start_range := ATTACK_RANGE
var attacking := false
var attack_elapsed := 0.0
var attack_duration := 1.0
var contact_checked := false
var gravity: float = ProjectSettings.get_setting("physics/3d/default_gravity")

func _ready() -> void:
	for animator: AnimationPlayer in $Model.find_children("*", "AnimationPlayer", true, false):
		clips = animator
		break
	if clips and clips.has_animation("attack"):
		var action := clips.get_animation("attack")
		action.loop_mode = Animation.LOOP_NONE
		attack_duration = maxf(action.length, 0.001)
		clips.callback_mode_process = AnimationMixer.ANIMATION_CALLBACK_MODE_PROCESS_MANUAL
		for skeleton: Skeleton3D in $Model.find_children("*", "Skeleton3D", true, false):
			var index := skeleton.find_bone("Weapon.R")
			if index >= 0:
				weapon_bone = index
				weapon_skeleton = skeleton
				weapon_tip_bone = skeleton.find_bone("WeaponTip")
				break

	if weapon_bone >= 0:
		clips.play("attack")
		clips.seek(attack_duration * attack_contact_fraction, true)
		var segment := _weapon_segment()
		var hilt: Vector3 = $Model.to_local(segment[0])
		var tip: Vector3 = $Model.to_local(segment[1])
		start_range = clampf(maxf(-hilt.z, -tip.z) + 0.25, 0.4, ATTACK_RANGE)
		clips.stop()

func _physics_process(delta: float) -> void:
	var offset := player.global_position - global_position
	offset.y = 0
	var direction := offset.normalized()
	if not attacking:
		if direction.length_squared() > 0:
			$Model.rotation.y = atan2(-direction.x, -direction.z)
		if offset.length() <= start_range:
			attacking = true
			attack_elapsed = 0
			contact_checked = false
			blade.rotation.y = $Model.rotation.y
			blade.visible = weapon_bone < 0
			if clips and clips.has_animation("attack"):
				clips.play("attack")
				clips.seek(0.0, true)
	velocity.x = 0.0 if attacking else direction.x * speed
	velocity.z = 0.0 if attacking else direction.z * speed
	if not is_on_floor():
		velocity.y -= gravity * delta
	move_and_slide()
	if attacking:
		_advance_attack(delta)

func _advance_attack(delta: float) -> void:
	attack_elapsed = minf(attack_elapsed + delta, attack_duration)
	var contact_time := attack_contact_fraction * attack_duration
	if not contact_checked and attack_elapsed + 0.000001 >= contact_time:
		contact_checked = true
		_sample_attack(contact_time)
		if _weapon_reaches_player():
			player.take_damage(1)
		if get_parent().get("finished") == true:
			return
	_sample_attack(attack_elapsed)
	if attack_elapsed >= attack_duration - 0.000001:
		cancel_attack()

func _sample_attack(time: float) -> void:
	if clips and clips.has_animation("attack"):
		clips.seek(time, true)
	var fraction := time / attack_duration
	var angle := 0.0
	if fraction < attack_contact_fraction:
		angle = lerpf(-1.2, 0, smoothstep(0, attack_contact_fraction, fraction))
	elif fraction > attack_contact_fraction:
		angle = lerpf(0, 0.9, smoothstep(attack_contact_fraction, 1, fraction))
	blade.get_node("Swing").rotation.y = angle

func _weapon_segment() -> PackedVector3Array:
	if weapon_bone < 0:
		return PackedVector3Array([blade.to_global(Vector3(0, 0.85, -0.35)), blade.to_global(Vector3(0, 0.85, -1.55))])
	var weapon := weapon_skeleton.global_transform * weapon_skeleton.get_bone_global_pose(weapon_bone)
	var tip := weapon * WEAPON_TIP
	if weapon_tip_bone >= 0:
		tip = weapon_skeleton.to_global(weapon_skeleton.get_bone_global_pose(weapon_tip_bone).origin)
	return PackedVector3Array([weapon.origin, tip])

func _weapon_reaches_player() -> bool:
	var segment := _weapon_segment()
	var hilt := segment[0]
	var tip := segment[1]
	var target := Vector2(player.global_position.x, player.global_position.z)
	var nearest := Geometry2D.get_closest_point_to_segment(target, Vector2(hilt.x, hilt.z), Vector2(tip.x, tip.z))
	return target.distance_to(nearest) <= HURT_RADIUS + BLADE_RADIUS

func cancel_attack() -> void:
	attacking = false
	blade.hide()
	if clips and clips.current_animation == &"attack":
		clips.stop()

func take_damage(amount: int) -> void:
	if amount <= 0 or health <= 0 or get_parent().get("finished") == true:
		return
	cancel_attack()
	health = maxi(0, health - amount)
	health_changed.emit(health)
`,"scripts/arena.gd":`extends Node3D

@onready var player = $Player
@onready var enemy = $Enemy
@onready var status: Label = $HUD/Status
@onready var stamina_panel := get_node_or_null("HUD/Stamina")
var stamina_needed := 0.0
var denied_action := ""
var finished := false

func _ready() -> void:
	if has_node("HUD/Lobby"):
		$HUD/Lobby.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/lobby.tscn"))
		var config := ConfigFile.new()
		if config.load("user://battle_lab_settings.cfg") == OK and config.get_value("display", "large_hud", false):
			status.add_theme_font_size_override("font_size", 26)
			if stamina_panel:
				stamina_panel.get_node("Caption").add_theme_font_size_override("font_size", 20)
	if stamina_panel:
		stamina_panel.visible = player.has_signal("stamina_changed")
		if stamina_panel.visible:
			player.stamina_changed.connect(_update_stamina)
			player.stamina_spent.connect(func(): denied_action = "")
			player.roll_denied.connect(func(): _show_stamina_denial("Roll", player.roll_stamina_cost))
			player.attack_denied.connect(func(): _show_stamina_denial("Attack", player.attack_stamina_cost))
			_update_stamina(player.stamina)
	player.health_changed.connect(_on_health_changed)
	enemy.health_changed.connect(_on_health_changed)
	_on_health_changed(0)

func _show_stamina_denial(action: String, cost: float) -> void:
	denied_action = action
	stamina_needed = cost
	_update_stamina(player.stamina)

func _update_stamina(value: float) -> void:
	var caption: Label = stamina_panel.get_node("Caption")
	var bar: ProgressBar = stamina_panel.get_node("Bar")
	bar.value = value
	if value + 0.000001 >= stamina_needed:
		denied_action = ""
	caption.text = "STAMINA   %d / 100" % floori(value + 0.000001)
	if not denied_action.is_empty():
		caption.text += "   \xB7   %s: Need %s" % [denied_action, String.num(stamina_needed, 2)]

func _on_health_changed(_value: int) -> void:
	if finished:
		return
	status.text = "SCOUT   %d / 3     \u2022     SENTINEL   %d / 3" % [player.health, enemy.health]
	if player.health == 0 or enemy.health == 0:
		finished = true
		var result := "VICTORY" if enemy.health == 0 else "DEFEAT"
		$HUD/Result.text = result + "\\nRestart: R or pad Y"
		$HUD/Result.show()
		player.set_physics_process(false)
		enemy.set_physics_process(false)
		for shot in get_tree().get_nodes_in_group("projectiles"):
			shot.queue_free()

func _unhandled_input(event: InputEvent) -> void:
	if finished and event.is_action_pressed("restart"):
		get_tree().reload_current_scene()
`,"stages/roll_player.gd":`extends "res://stages/health_player.gd"

signal stamina_changed(value: float)
signal stamina_spent
signal roll_denied
signal attack_denied
@export_range(0, 100, 0.01) var roll_stamina_cost: float = 40.0:
	set(value): roll_stamina_cost = clampf(value, 0, 100)
@export_range(0, 100, 0.01) var attack_stamina_cost: float = 15.0:
	set(value): attack_stamina_cost = clampf(value, 0, 100)
@export_range(0, 100, 0.01) var stamina_regen_per_second: float = 20.0:
	set(value): stamina_regen_per_second = clampf(value, 0, 100)
const MAX_STAMINA := 100.0
var stamina := MAX_STAMINA
var stamina_wait := 0.0

@export_range(0, 1, 0.001) var roll_safe_start: float = 4.0 / 18.0
@export_range(0, 1, 0.001) var roll_safe_end: float = 12.0 / 18.0
const ROLL_DISTANCE := 2.4
const ROLL_CLIP := &'roll'
var rolling := false
var rolled_this_tick := false
var roll_elapsed := 0.0
var roll_duration := 0.75
var roll_direction := Vector3.FORWARD
var roll_clips: AnimationPlayer
var authored_roll := false
var model_origin: Vector3
var model_pitch: float

func _ready() -> void:
	super()
	# Hit reactions pause movement. Recovery keeps its own physics clock.
	get_tree().physics_frame.connect(_recover_stamina)
	roll_clips = $AnimationTree.get_node($AnimationTree.anim_player)
	authored_roll = roll_clips.has_animation(ROLL_CLIP)
	if authored_roll:
		var clip := roll_clips.get_animation(ROLL_CLIP)
		clip.loop_mode = Animation.LOOP_NONE
		roll_duration = maxf(clip.length, 0.001)
		roll_clips.callback_mode_process = AnimationMixer.ANIMATION_CALLBACK_MODE_PROCESS_MANUAL

func _physics_process(delta: float) -> void:
	var wants_roll: bool = not rolling and Input.is_action_just_pressed("roll") and get("attacking") != true
	if wants_roll:
		if _spend_stamina(roll_stamina_cost):
			_start_roll()
		else:
			roll_denied.emit()
	rolled_this_tick = rolling or wants_roll
	if not rolling:
		super(delta)
		return
	var next := minf(roll_elapsed + delta, roll_duration)
	var step_distance := ROLL_DISTANCE * (next - roll_elapsed) / roll_duration
	velocity.x = roll_direction.x * step_distance / delta
	velocity.z = roll_direction.z * step_distance / delta
	_move_on_floor(delta)
	roll_elapsed = next
	if authored_roll:
		roll_clips.seek(roll_elapsed, true)
	else:
		var pitch := -TAU * roll_elapsed / roll_duration
		$Model.rotation.x = model_pitch + pitch
		var pivot := Vector3.UP * 0.65
		$Model.position = model_origin + Basis(Vector3.UP, $Model.rotation.y) * (pivot - pivot.rotated(Vector3.RIGHT, pitch))
	if roll_elapsed >= roll_duration - 0.000001:
		_finish_roll()

func _spend_stamina(cost: float) -> bool:
	if stamina + 0.000001 < cost:
		return false
	stamina = maxf(0.0, stamina - cost)
	stamina_spent.emit()
	stamina_changed.emit(stamina)
	return true

func pay_for_attack() -> bool:
	if _spend_stamina(attack_stamina_cost):
		return true
	attack_denied.emit()
	return false

func _recover_stamina() -> void:
	if not is_inside_tree() or get_tree().paused or rolling or get("attacking") == true or health <= 0 or get_parent().get("finished") == true:
		return
	var delta := get_physics_process_delta_time()
	var waiting := minf(stamina_wait, delta)
	stamina_wait -= waiting
	var recovered := minf(MAX_STAMINA, stamina + (delta - waiting) * stamina_regen_per_second)
	if recovered != stamina:
		stamina = recovered
		stamina_changed.emit(stamina)

func _start_roll() -> void:
	var axes := Input.get_vector("move_left", "move_right", "move_forward", "move_back")
	if axes.length_squared() > 0:
		facing = Vector3(axes.x, 0, axes.y).normalized()
	roll_direction = facing
	$Model.rotation.y = atan2(-facing.x, -facing.z)
	model_origin = $Model.position
	model_pitch = $Model.rotation.x
	roll_elapsed = 0
	rolling = true
	$AnimationTree.active = false
	if authored_roll:
		roll_clips.play(ROLL_CLIP)
		roll_clips.seek(0, true)

func _finish_roll() -> void:
	rolling = false
	stamina_wait = 1.0
	if authored_roll:
		roll_clips.stop()
	$Model.position = model_origin
	$Model.rotation.x = model_pitch
	$AnimationTree.active = true

func is_roll_protected() -> bool:
	var fraction := roll_elapsed / roll_duration
	return rolling and fraction + 0.0000001 >= roll_safe_start and fraction + 0.0000001 < roll_safe_end

func take_damage(amount: int) -> void:
	if amount <= 0 or health <= 0 or get_parent().get("finished") == true or is_roll_protected():
		return
	if rolling:
		_finish_roll()
	super(amount)
`,"scripts/player.gd":`extends "res://stages/roll_player.gd"

const SHOT := preload("res://scenes/projectile.tscn")
var fire_delay := 0.0

func _physics_process(delta: float) -> void:
	super(delta)
	if rolled_this_tick:
		return
	fire_delay = maxf(0.0, fire_delay - delta)
	if Input.is_action_pressed("fire") and fire_delay <= 0.0 and pay_for_attack():
		var shot := SHOT.instantiate()
		get_parent().add_child(shot)
		shot.global_position = global_position + Vector3.UP * 0.65 + facing * 0.55
		shot.direction = facing
		fire_delay = 0.25
		stamina_wait = 1.0
`,"scripts/projectile.gd":`extends Area3D

const IMPACT := preload("res://scenes/impact.tscn")
@export var speed: float = 11.0
var direction := Vector3.FORWARD
var life := 1.8
var spent := false

func _ready() -> void:
	area_entered.connect(_on_area_entered)

func _physics_process(delta: float) -> void:
	global_position += direction * speed * delta
	life -= delta
	if life <= 0.0:
		queue_free()

func _on_area_entered(area: Area3D) -> void:
	if spent:
		return
	spent = true
	var burst := IMPACT.instantiate()
	get_parent().add_child(burst)
	burst.global_position = global_position
	area.get_parent().take_damage(1)
	queue_free()
`,"scripts/impact.gd":`extends MeshInstance3D

func _ready() -> void:
	var tween := create_tween()
	tween.tween_property(self, "scale", Vector3.ONE * 2.5, 0.12)
	tween.tween_property(self, "scale", Vector3.ONE * 0.01, 0.12)
	tween.tween_callback(queue_free)
`,"scenes/projectile.tscn":`[gd_scene load_steps=5 format=3]

[ext_resource type="Script" path="res://scripts/projectile.gd" id="1"]

[sub_resource type="StandardMaterial3D" id="Light"]
albedo_color = Color(0.22, 1, 0.92, 1)
emission_enabled = true
emission = Color(0.18, 0.95, 0.95, 1)

[sub_resource type="SphereMesh" id="Pulse"]
material = SubResource("Light")
radius = 0.16
height = 0.32

[sub_resource type="SphereShape3D" id="Shape"]
radius = 0.18

[node name="Projectile" type="Area3D" groups=["projectiles"]]
collision_layer = 0
collision_mask = 4
script = ExtResource("1")

[node name="MeshInstance3D" type="MeshInstance3D" parent="."]
mesh = SubResource("Pulse")

[node name="CollisionShape3D" type="CollisionShape3D" parent="."]
shape = SubResource("Shape")
`,"scenes/impact.tscn":`[gd_scene load_steps=4 format=3]

[ext_resource type="Script" path="res://scripts/impact.gd" id="1"]

[sub_resource type="StandardMaterial3D" id="Light"]
albedo_color = Color(1, 0.66, 0.24, 1)
emission_enabled = true
emission = Color(1, 0.36, 0.09, 1)

[sub_resource type="TorusMesh" id="Ring"]
material = SubResource("Light")
inner_radius = 0.17
outer_radius = 0.23
rings = 16
ring_segments = 6

[node name="Impact" type="MeshInstance3D"]
mesh = SubResource("Ring")
script = ExtResource("1")
`,"scenes/lobby.tscn":`[gd_scene load_steps=3 format=3]

[ext_resource type="Script" path="res://scripts/lobby.gd" id="1"]
[ext_resource type="PackedScene" path="res://scenes/menu_art.tscn" id="Art"]

[node name="Lobby" type="Control"]
anchor_right = 1.0
anchor_bottom = 1.0
script = ExtResource("1")

[node name="MenuArt" parent="." instance=ExtResource("Art")]

[node name="Center" type="CenterContainer" parent="."]
anchor_right = 1.0
anchor_bottom = 1.0

[node name="VBox" type="VBoxContainer" parent="Center"]
custom_minimum_size = Vector2(350, 0)
theme_override_constants/separation = 12

[node name="Tag" type="Label" parent="Center/VBox"]
text = "BATTLE LAB   /   PILOT LOBBY"
theme_override_colors/font_color = Color(0.5, 0.91, 0.83, 1)

[node name="Title" type="Label" parent="Center/VBox"]
text = "Relay Arena"
theme_override_font_sizes/font_size = 48

[node name="Intro" type="Label" parent="Center/VBox"]
text = "Train first or enter a live round."


[node name="Start" type="Button" parent="Center/VBox"]
text = "Start battle"
custom_minimum_size = Vector2(0, 46)

[node name="Tutorial" type="Button" parent="Center/VBox"]
text = "Tutorial"
custom_minimum_size = Vector2(0, 46)

[node name="Settings" type="Button" parent="Center/VBox"]
text = "Settings"
custom_minimum_size = Vector2(0, 46)

[node name="Duels" type="Button" parent="Center/VBox"]
text = "Duel modes"
custom_minimum_size = Vector2(0, 46)

[node name="MatchFlow" type="Button" parent="Center/VBox"]
text = "Local match series"
custom_minimum_size = Vector2(0, 46)
`,"scripts/lobby.gd":`extends Control

@onready var start: Button = $Center/VBox/Start

func _ready() -> void:
	start.pressed.connect(_start_battle)
	$Center/VBox/Tutorial.pressed.connect(_show_tutorial)
	$Center/VBox/Settings.pressed.connect(_show_settings)
	if has_node("Center/VBox/Duels"):
		$Center/VBox/Duels.pressed.connect(_show_duels)
	if has_node("Center/VBox/MatchFlow"):
		$Center/VBox/MatchFlow.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/match_flow.tscn"))
	start.grab_focus()

func _start_battle() -> void:
	get_tree().change_scene_to_file("res://scenes/arena.tscn")

func _show_tutorial() -> void:
	get_tree().change_scene_to_file("res://scenes/tutorial.tscn")

func _show_settings() -> void:
	get_tree().change_scene_to_file("res://scenes/settings.tscn")

func _show_duels() -> void:
	get_tree().change_scene_to_file("res://scenes/duel.tscn")
`,"scenes/menu_art.tscn":`[gd_scene load_steps=3 format=3]

[ext_resource type="Texture2D" path="res://assets/menu-backdrop.webp" id="1"]

[sub_resource type="Gradient" id="SparkFade"]
offsets = PackedFloat32Array(0, 0.2, 0.7, 1)
colors = PackedColorArray(0.6, 1, 0.93, 0, 0.6, 1, 0.93, 0.85, 0.72, 0.68, 1, 0.7, 0.72, 0.68, 1, 0)

[node name="MenuArt" type="Control"]
anchor_right = 1.0
anchor_bottom = 1.0
mouse_filter = 2
clip_contents = true

[node name="Picture" type="TextureRect" parent="."]
anchor_right = 1.0
anchor_bottom = 1.0
mouse_filter = 2
self_modulate = Color(0.55, 0.55, 0.67, 1)
texture = ExtResource("1")
expand_mode = 1
stretch_mode = 6

[node name="SparksAnchor" type="Control" parent="."]
anchor_left = 0.84
anchor_top = 0.24
anchor_right = 0.84
anchor_bottom = 0.24
mouse_filter = 2

[node name="Sparks" type="CPUParticles2D" parent="SparksAnchor"]
amount = 24
lifetime = 3.0
preprocess = 3.0
emission_shape = 3
emission_rect_extents = Vector2(50, 14)
direction = Vector2(-0.5, -1)
spread = 34.0
gravity = Vector2(0, 0)
initial_velocity_min = 14.0
initial_velocity_max = 28.0
scale_amount_min = 1.4
scale_amount_max = 3.0
color_ramp = SubResource("SparkFade")
`,"scenes/tutorial.tscn":`[gd_scene load_steps=12 format=3]

[ext_resource type="Script" path="res://scripts/tutorial.gd" id="1"]
[ext_resource type="PackedScene" path="res://scenes/player.tscn" id="2"]
[ext_resource type="PackedScene" path="res://scenes/set.tscn" id="4"]
[ext_resource type="PackedScene" path="res://scenes/menu_art.tscn" id="Art"]

[sub_resource type="StandardMaterial3D" id="Slate"]
albedo_color = Color(0.17, 0.18, 0.25, 1)
roughness = 0.91

[sub_resource type="BoxMesh" id="Tile"]
material = SubResource("Slate")
size = Vector3(18, 0.5, 14)

[sub_resource type="BoxShape3D" id="TileShape"]
size = Vector3(18, 0.5, 14)

[sub_resource type="Environment" id="Env"]
background_mode = 1
background_color = Color(0.035, 0.042, 0.075, 1)
ambient_light_source = 2
ambient_light_color = Color(0.62, 0.68, 0.90, 1)
ambient_light_energy = 0.65

[sub_resource type="StyleBoxFlat" id="Plate"]
content_margin_left = 16.0
content_margin_top = 10.0
content_margin_right = 16.0
content_margin_bottom = 10.0
bg_color = Color(0.045, 0.055, 0.092, 0.5)
corner_radius_top_left = 8
corner_radius_top_right = 8
corner_radius_bottom_left = 8
corner_radius_bottom_right = 8

[sub_resource type="StyleBoxFlat" id="StaminaTrack"]
bg_color = Color(0.16, 0.19, 0.27, 1)
corner_radius_top_left = 3
corner_radius_top_right = 3
corner_radius_bottom_left = 3
corner_radius_bottom_right = 3

[sub_resource type="StyleBoxFlat" id="StaminaFill"]
bg_color = Color(0.33, 0.90, 0.73, 1)
corner_radius_top_left = 3
corner_radius_top_right = 3
corner_radius_bottom_left = 3
corner_radius_bottom_right = 3

[node name="Training" type="Node3D"]
script = ExtResource("1")

[node name="Floor" type="StaticBody3D" parent="."]
position = Vector3(0, -0.25, 0)

[node name="MeshInstance3D" type="MeshInstance3D" parent="Floor"]
mesh = SubResource("Tile")

[node name="CollisionShape3D" type="CollisionShape3D" parent="Floor"]
shape = SubResource("TileShape")

[node name="Set" parent="." instance=ExtResource("4")]

[node name="WorldEnvironment" type="WorldEnvironment" parent="."]
environment = SubResource("Env")

[node name="Light" type="DirectionalLight3D" parent="."]
rotation_degrees = Vector3(-60, -30, 0)
light_color = Color(0.89, 0.91, 1, 1)
light_energy = 1.15
shadow_enabled = true

[node name="Camera3D" type="Camera3D" parent="."]
position = Vector3(0, 16, 9)
rotation_degrees = Vector3(-60.64, 0, 0)
projection = 1
size = 14.0
current = true

[node name="Player" parent="." instance=ExtResource("2")]
position = Vector3(0, 0.1, 3)

[node name="HUD" type="CanvasLayer" parent="."]

[node name="PromptArt" parent="HUD" instance=ExtResource("Art")]
anchor_right = 0.0
anchor_bottom = 0.0
offset_left = 18.0
offset_top = 18.0
offset_right = 382.0
offset_bottom = 100.0

[node name="Prompt" type="Label" parent="HUD"]
offset_left = 18
offset_top = 18
theme_override_styles/normal = SubResource("Plate")
theme_override_font_sizes/font_size = 21

[node name="Actions" type="HBoxContainer" parent="HUD"]
anchor_top = 1
anchor_bottom = 1
offset_top = -58
offset_bottom = -12
offset_left = 18
theme_override_constants/separation = 10

[node name="Back" type="Button" parent="HUD/Actions"]
text = "Back to lobby"

[node name="Start" type="Button" parent="HUD/Actions"]
text = "Start battle"
disabled = true
`,"scripts/tutorial.gd":`extends Node3D

const HINTS := ["Move with WASD or the left stick.", "Fire with Space or pad X.", "Roll with Shift or pad B.", "Training complete. Enter the arena when ready."]
var step := 0
@onready var player = $Player
@onready var previous_position: Vector3 = player.position
var walked := 0.0

func _ready() -> void:
	$HUD/Actions/Start.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/arena.tscn"))
	$HUD/Actions/Back.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/lobby.tscn"))
	child_entered_tree.connect(_on_child_entered)
	_show_step()

func _on_child_entered(child: Node) -> void:
	if step == 1 and child.is_in_group("projectiles"):
		_advance()

func _physics_process(_delta: float) -> void:
	match step:
		0:
			var travel := Vector2(player.position.x - previous_position.x, player.position.z - previous_position.z)
			previous_position = player.position
			if not player.rolled_this_tick:
				walked += travel.length()
			if walked > 0.25:
				_advance()
		2:
			if player.rolling:
				_advance()

func _advance() -> void:
	step += 1
	_show_step()

func _show_step() -> void:
	$HUD/Prompt.text = "TRAINING   %d / 3\\n%s" % [mini(step + 1, 3), HINTS[step]]
	$HUD/Actions/Start.disabled = step < 3
`,"scenes/settings.tscn":`[gd_scene load_steps=3 format=3]

[ext_resource type="Script" path="res://scripts/settings.gd" id="1"]
[ext_resource type="PackedScene" path="res://scenes/menu_art.tscn" id="Art"]

[node name="Settings" type="Control"]
anchor_right = 1.0
anchor_bottom = 1.0
script = ExtResource("1")

[node name="MenuArt" parent="." instance=ExtResource("Art")]

[node name="Center" type="CenterContainer" parent="."]
anchor_right = 1.0
anchor_bottom = 1.0

[node name="VBox" type="VBoxContainer" parent="Center"]
custom_minimum_size = Vector2(350, 0)
theme_override_constants/separation = 12

[node name="Tag" type="Label" parent="Center/VBox"]
text = "RELAY ARENA   /   SETTINGS"
theme_override_colors/font_color = Color(0.5, 0.91, 0.83, 1)

[node name="Title" type="Label" parent="Center/VBox"]
text = "HUD settings"
theme_override_font_sizes/font_size = 40

[node name="LargeHUD" type="CheckButton" parent="Center/VBox"]
text = "Large HUD text"
custom_minimum_size = Vector2(0, 46)

[node name="Preview" type="Label" parent="Center/VBox"]
text = "SCOUT   3 / 3     \u2022     SENTINEL   3 / 3"


[node name="Notice" type="Label" parent="Center/VBox"]
text = "Changes save on this device."


[node name="Back" type="Button" parent="Center/VBox"]
text = "Back to lobby"
custom_minimum_size = Vector2(0, 46)
`,"scripts/settings.gd":`extends Control

const SAVE_PATH := "user://battle_lab_settings.cfg"
var config := ConfigFile.new()
@onready var toggle: CheckButton = $Center/VBox/LargeHUD

func _ready() -> void:
	config.load(SAVE_PATH)
	toggle.button_pressed = config.get_value("display", "large_hud", false)
	_update_preview(toggle.button_pressed)
	toggle.toggled.connect(_save_size)
	$Center/VBox/Back.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/lobby.tscn"))
	toggle.grab_focus()

func _save_size(enabled: bool) -> void:
	config.set_value("display", "large_hud", enabled)
	var error := config.save(SAVE_PATH)
	_update_preview(enabled)
	$Center/VBox/Notice.text = "Saved on this device." if error == OK else "Could not save settings to disk."

func _update_preview(enabled: bool) -> void:
	$Center/VBox/Preview.add_theme_font_size_override("font_size", 26 if enabled else 16)
`,"scenes/duel.tscn":`[gd_scene load_steps=16 format=3]

[ext_resource type="Script" path="res://scripts/hit_rumble.gd" id="Rumble"]
[ext_resource type="PackedScene" path="res://scenes/duel_hit.tscn" id="HitFX"]
[ext_resource type="Script" path="res://scripts/duel.gd" id="Duel"]
[ext_resource type="Script" path="res://scripts/network_series.gd" id="Series"]
[ext_resource type="Script" path="res://scripts/duel_network.gd" id="Network"]
[ext_resource type="PackedScene" path="res://scenes/set.tscn" id="Set"]
[ext_resource type="PackedScene" path="res://assets/scout.glb" id="Scout"]

[sub_resource type="StandardMaterial3D" id="Cyan"]
albedo_color = Color(0.20, 0.95, 0.91, 1)
emission_enabled = true
emission = Color(0.20, 0.95, 0.91, 1)
emission_energy_multiplier = 1.15

[sub_resource type="TorusMesh" id="CyanRing"]
material = SubResource("Cyan")
inner_radius = 0.45
outer_radius = 0.55

[sub_resource type="StandardMaterial3D" id="Amber"]
albedo_color = Color(1.00, 0.41, 0.11, 1)
emission_enabled = true
emission = Color(1.00, 0.41, 0.11, 1)
emission_energy_multiplier = 1.15

[sub_resource type="TorusMesh" id="AmberRing"]
material = SubResource("Amber")
inner_radius = 0.45
outer_radius = 0.55

[sub_resource type="StandardMaterial3D" id="Slate"]
albedo_color = Color(0.17, 0.18, 0.25, 1)

[sub_resource type="BoxMesh" id="FloorBox"]
material = SubResource("Slate")
size = Vector3(18, 0.5, 14)

[sub_resource type="Environment" id="Env"]
background_mode = 1
background_color = Color(0.035, 0.042, 0.075, 1)
ambient_light_source = 2
ambient_light_color = Color(0.62, 0.68, 0.90, 1)
ambient_light_energy = 0.65

[sub_resource type="StyleBoxFlat" id="Plate"]
content_margin_left = 18.0
content_margin_top = 12.0
content_margin_right = 18.0
content_margin_bottom = 12.0
bg_color = Color(0.048, 0.068, 0.11, 0.97)
corner_radius_top_left = 10
corner_radius_top_right = 10
corner_radius_bottom_left = 10
corner_radius_bottom_right = 10

[node name="Duel" type="Node3D"]
script = ExtResource("Duel")

[node name="HitRumble" type="Node" parent="."]
script = ExtResource("Rumble")
strength = 0.55
duration = 0.18

[node name="Floor" type="MeshInstance3D" parent="."]
position = Vector3(0, -0.25, 0)
mesh = SubResource("FloorBox")

[node name="Set" parent="." instance=ExtResource("Set")]

[node name="Environment" type="WorldEnvironment" parent="."]
environment = SubResource("Env")

[node name="Light" type="DirectionalLight3D" parent="."]
rotation_degrees = Vector3(-60, -30, 0)
light_energy = 1.3
shadow_enabled = true

[node name="Camera" type="Camera3D" parent="."]
position = Vector3(0, 16, 9)
rotation_degrees = Vector3(-60.64, 0, 0)
projection = 1
size = 14.0
current = true

[node name="Pilot1" type="Node3D" parent="."]
position = Vector3(-4, 0.05, 0)

[node name="HitFX" parent="Pilot1" instance=ExtResource("HitFX")]

[node name="Model" parent="Pilot1" instance=ExtResource("Scout")]

[node name="Ring" type="MeshInstance3D" parent="Pilot1"]
scale = Vector3(1.4, 0.28, 1.4)
mesh = SubResource("CyanRing")

[node name="Label" type="Label3D" parent="Pilot1"]
position = Vector3(0, 2.15, 0)
billboard = 1
font_size = 56
outline_size = 18
modulate = Color(0.6,1,0.98,1)
text = "P1"

[node name="Pilot2" type="Node3D" parent="."]
position = Vector3(4, 0.05, 0)

[node name="HitFX" parent="Pilot2" instance=ExtResource("HitFX")]

[node name="Model" parent="Pilot2" instance=ExtResource("Scout")]

[node name="Ring" type="MeshInstance3D" parent="Pilot2"]
scale = Vector3(1.4, 0.28, 1.4)
mesh = SubResource("AmberRing")

[node name="Label" type="Label3D" parent="Pilot2"]
position = Vector3(0, 2.15, 0)
billboard = 1
font_size = 56
outline_size = 18
modulate = Color(1,0.76,0.47,1)
text = "P2"

[node name="Pulses" type="Node3D" parent="."]

[node name="Network" type="Node" parent="."]
script = ExtResource("Network")

[node name="Series" type="Node" parent="Network"]
script = ExtResource("Series")

[node name="HUD" type="CanvasLayer" parent="."]

[node name="Modes" type="PanelContainer" parent="HUD"]
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -216
offset_right = 216
offset_top = -141
offset_bottom = 141
theme_override_styles/panel = SubResource("Plate")

[node name="Options" type="VBoxContainer" parent="HUD/Modes"]
theme_override_constants/separation = 9

[node name="Title" type="Label" parent="HUD/Modes/Options"]
theme_override_font_sizes/font_size = 29
theme_override_colors/font_color = Color(0.60, 0.98, 0.90, 1)
text = "Choose your opponent"

[node name="Caption" type="Label" parent="HUD/Modes/Options"]
text = "Three hits win the round."

[node name="Bot" type="Button" parent="HUD/Modes/Options"]
text = "Practice against a bot"
custom_minimum_size = Vector2(0, 38)

[node name="Local" type="Button" parent="HUD/Modes/Options"]
text = "Local PvP \u2022 Two on one keyboard"
custom_minimum_size = Vector2(0, 38)

[node name="Network" type="Button" parent="HUD/Modes/Options"]
text = "Network PvP \u2022 Host or join"
custom_minimum_size = Vector2(0, 38)

[node name="Lobby" type="Button" parent="HUD/Modes/Options"]
text = "Back to lobby"
custom_minimum_size = Vector2(0, 38)

[node name="Net" type="PanelContainer" parent="HUD"]
anchor_left = 0.5
anchor_top = 0.5
anchor_right = 0.5
anchor_bottom = 0.5
offset_left = -216
offset_right = 216
offset_top = -174
offset_bottom = 174
theme_override_styles/panel = SubResource("Plate")
visible = false

[node name="Options" type="VBoxContainer" parent="HUD/Net"]
theme_override_constants/separation = 9

[node name="Title" type="Label" parent="HUD/Net/Options"]
theme_override_font_sizes/font_size = 29
theme_override_colors/font_color = Color(0.60, 0.98, 0.90, 1)
text = "Network PvP"

[node name="Caption" type="Label" parent="HUD/Net/Options"]
text = "Host starts a match. Guest enters the host address."

[node name="Host" type="Button" parent="HUD/Net/Options"]
text = "Host a match"
custom_minimum_size = Vector2(0, 38)

[node name="Address" type="LineEdit" parent="HUD/Net/Options"]
text = "127.0.0.1"

[node name="Join" type="Button" parent="HUD/Net/Options"]
text = "Join host"
custom_minimum_size = Vector2(0, 38)

[node name="Status" type="Label" parent="HUD/Net/Options"]
text = "Enter the host IP (LAN, shared VPN or public IPv4)."
autowrap_mode = 2
custom_minimum_size = Vector2(340, 48)

[node name="Back" type="Button" parent="HUD/Net/Options"]
text = "Back to modes"
custom_minimum_size = Vector2(0, 38)

[node name="Match" type="Control" parent="HUD"]
anchor_right = 1.0
anchor_bottom = 1.0
mouse_filter = 2
visible = false

[node name="Title" type="Label" parent="HUD/Match"]
offset_left = 16
offset_top = 14
theme_override_styles/normal = SubResource("Plate")
theme_override_font_sizes/font_size = 21
text = "Local PvP"

[node name="Score" type="Label" parent="HUD/Match"]
offset_left = 16
offset_top = 70
theme_override_styles/normal = SubResource("Plate")
text = "P1    3 / 3       \u2022       P2    3 / 3"

[node name="Modes" type="Button" parent="HUD/Match"]
anchor_left = 1
anchor_right = 1
offset_left = -145
offset_right = -16
offset_top = 14
offset_bottom = 52
text = "Leave round"

[node name="Help" type="Label" parent="HUD/Match"]
anchor_top = 1
anchor_bottom = 1
offset_left = 16
offset_top = -61
theme_override_styles/normal = SubResource("Plate")
text = "WASD + Space    /    Arrows + Enter"

[node name="Result" type="Label" parent="HUD/Match"]
anchor_left = 0.5
anchor_right = 0.5
anchor_top = 0.42
anchor_bottom = 0.42
offset_left = -250
offset_right = 250
horizontal_alignment = 1
theme_override_constants/outline_size = 10
theme_override_font_sizes/font_size = 36

[node name="Rematch" type="Button" parent="HUD/Match"]
anchor_left = 0.5
anchor_right = 0.5
anchor_top = 0.53
anchor_bottom = 0.53
offset_left = -90
offset_right = 90
offset_bottom = 45
text = "Rematch"


[node name="Series" type="CenterContainer" parent="HUD"]
visible = false
anchor_right = 1.0
anchor_bottom = 1.0

[node name="Card" type="PanelContainer" parent="HUD/Series"]
custom_minimum_size = Vector2(400, 0)
theme_override_styles/panel = SubResource("Plate")

[node name="Column" type="VBoxContainer" parent="HUD/Series/Card"]
theme_override_constants/separation = 10

[node name="Role" type="Label" parent="HUD/Series/Card/Column"]

[node name="Title" type="Label" parent="HUD/Series/Card/Column"]
theme_override_font_sizes/font_size = 28
theme_override_colors/font_color = Color(0.60, 0.98, 0.90, 1)

[node name="Detail" type="Label" parent="HUD/Series/Card/Column"]

[node name="Progress" type="ProgressBar" parent="HUD/Series/Card/Column"]

[node name="Confirm" type="Button" parent="HUD/Series/Card/Column"]
custom_minimum_size = Vector2(0, 42)

[node name="Leave" type="Button" parent="HUD/Series/Card/Column"]
text = "Leave room"
`,"scripts/duel.gd":`extends Node3D

@export_range(1.0, 7.0, 0.25) var bot_range := 4.0
@export_range(0.08, 0.5, 0.01) var hit_cue_seconds := 0.22
const Pad = preload("res://scripts/gamepad.gd")
const SPEED := 4.0
const PULSE_SPEED := 11.0
const SHOT_DELAY := 0.45
const SPAWNS := [Vector2(-4, 0), Vector2(4, 0)]
var displayed_hp: Array[int] = [3, 3]
var hit_tweens: Array[Tween] = [null, null]
var resting_scales: Array[Vector3] = []
var mode := ""
var positions: Array[Vector2] = [SPAWNS[0], SPAWNS[1]]
var facing: Array[Vector2] = [Vector2.RIGHT, Vector2.LEFT]
var hp: Array[int] = [3, 3]
var cooldown: Array[float] = [0.0, 0.0]
var moving: Array[bool] = [false, false]
var shots: Array[Dictionary] = []
var result := ""
var snapshot_clock := 0.0

@onready var pilots := [$Pilot1, $Pilot2]
@onready var network = $Network
@onready var net_menu = $HUD/Net/Options
@onready var match_hud = $HUD/Match

func _enter_tree() -> void:
	var bindings := {
		"duel_p1_left": KEY_A, "duel_p1_right": KEY_D, "duel_p1_up": KEY_W,
		"duel_p1_down": KEY_S, "duel_p1_shoot": KEY_SPACE,
		"duel_p2_left": KEY_LEFT, "duel_p2_right": KEY_RIGHT, "duel_p2_up": KEY_UP,
		"duel_p2_down": KEY_DOWN, "duel_p2_shoot": KEY_ENTER
	}
	for action in bindings:
		if not InputMap.has_action(action):
			InputMap.add_action(action)
			var key := InputEventKey.new()
			key.physical_keycode = bindings[action]
			InputMap.action_add_event(action, key)

func _ready() -> void:
	for pilot in pilots:
		resting_scales.append(pilot.get_node("Ring").scale)
	# Give the guest its own armor color without changing the shared imported mesh.
	for part: MeshInstance3D in $Pilot2/Model.find_children("*", "MeshInstance3D", true, false):
		for surface in part.mesh.get_surface_count():
			var material := part.mesh.surface_get_material(surface) as StandardMaterial3D
			if material and material.resource_name.begins_with("Glacier"):
				var armor := material.duplicate() as StandardMaterial3D
				armor.albedo_color = Color("#ff9954")
				part.set_surface_override_material(surface, armor)
	$HUD/Modes/Options/Bot.pressed.connect(func(): start_round("bot"))
	$HUD/Modes/Options/Local.pressed.connect(func(): start_round("local"))
	$HUD/Modes/Options/Network.pressed.connect(_show_network)
	$HUD/Modes/Options/Lobby.pressed.connect(func(): get_tree().change_scene_to_file("res://scenes/lobby.tscn"))
	net_menu.get_node("Host").pressed.connect(_host_game)
	net_menu.get_node("Join").pressed.connect(_join_game)
	net_menu.get_node("Back").pressed.connect(show_modes)
	match_hud.get_node("Modes").pressed.connect(show_modes)
	match_hud.get_node("Rematch").pressed.connect(func(): start_round(mode))
	network.match_started.connect($Network/Series.connected)
	network.status_changed.connect(func(message: String): net_menu.get_node("Status").text = message)
	network.match_ended.connect(_network_ended)
	network.snapshot_received.connect(apply_snapshot)
	network.hit_received.connect(_play_hit)
	show_modes()

func show_modes() -> void:
	mode = ""
	$Network/Series.clear_room()
	network.leave_game()
	$HUD/Match.hide()
	$HUD/Net.hide()
	$HUD/Modes.show()
	$HUD/Modes/Options/Bot.grab_focus()
	_reset_arena()
	_draw_round()
func _show_network() -> void:
	$HUD/Modes.hide()
	$HUD/Net.show()
	net_menu.get_node("Host").disabled = false
	net_menu.get_node("Join").disabled = false
	net_menu.get_node("Address").editable = true
	net_menu.get_node("Status").text = "Enter the host IP (LAN, shared VPN or public IPv4)."
	net_menu.get_node("Host").grab_focus()

func _host_game() -> void:
	var error: Error = network.host_game()
	if error == OK:
		net_menu.get_node("Host").disabled = true
		net_menu.get_node("Join").disabled = true
		net_menu.get_node("Address").editable = false
	else:
		net_menu.get_node("Status").text = "Could not host: %s. Check whether UDP 7000 is already in use." % error_string(error)

func _join_game() -> void:
	var error: Error = network.join_game(net_menu.get_node("Address").text.strip_edges())
	if error == OK:
		net_menu.get_node("Host").disabled = true
		net_menu.get_node("Join").disabled = true
		net_menu.get_node("Address").editable = false

func _network_ended(message: String) -> void:
	show_modes()
	_show_network()
	net_menu.get_node("Status").text = message

func _reset_arena() -> void:
	positions.assign(SPAWNS)
	facing.assign([Vector2.RIGHT, Vector2.LEFT])
	hp.assign([3, 3])
	displayed_hp.assign(hp)
	for slot in 2:
		pilots[slot].get_node("HitFX").clear_hit()
		if hit_tweens[slot]:
			hit_tweens[slot].kill()
		pilots[slot].get_node("Ring").scale = resting_scales[slot]
	cooldown.assign([0.0, 0.0])
	moving.assign([false, false])
	shots.clear()
	result = ""
	snapshot_clock = 0.0

func start_round(kind: String) -> void:
	mode = kind
	_reset_arena()
	$HUD/Modes.hide()
	$HUD/Net.hide()
	match_hud.show()
	var names := {"bot": "Bot practice", "local": "Local PvP", "host": "Network PvP \u2022 Host (P1)", "client": "Network PvP \u2022 Guest (P2)"}
	match_hud.get_node("Title").text = names[kind]
	match_hud.get_node("Help").text = "P1 WASD + Space   /   P2 arrows + Enter   /   Pad: stick + X" if kind == "local" else "Move: WASD or left stick   \u2022   Fire: Space or X"
	_draw_round()

func read_move(slot: int) -> Vector2:
	var prefix := "duel_p1_" if slot == 0 else "duel_p2_"
	return Input.get_vector(prefix + "left", prefix + "right", prefix + "up", prefix + "down")

func read_fire(slot: int) -> bool:
	var prefix := "duel_p1_" if slot == 0 else "duel_p2_"
	return Input.is_action_pressed(prefix + "shoot")

func _physics_process(delta: float) -> void:
	if mode == "" or (network.active_peer and $Network/Series.phase != "live"):
		return
	var direction := pilot_move(0)
	var firing := pilot_fire(0)
	if mode == "client":
		network.send_input(direction, firing)
		return
	var opponent_move := Vector2.ZERO
	var opponent_fire := false
	match mode:
		"bot":
			var offset := positions[0] - positions[1]
			var in_range := offset.length() <= bot_range
			if not offset.is_zero_approx():
				facing[1] = offset.normalized()
			opponent_move = Vector2.ZERO if in_range else facing[1]
			opponent_fire = in_range
		"local":
			opponent_move = pilot_move(1)
			opponent_fire = pilot_fire(1)
		"host":
			opponent_move = network.remote_direction
			opponent_fire = network.remote_fire
	tick_pair(direction, firing, opponent_move, opponent_fire, delta)
	_draw_round()
	if mode == "host":
		snapshot_clock += delta
		if snapshot_clock >= 0.05:
			snapshot_clock = 0.0
			network.broadcast_state(snapshot())

func tick_pair(p1: Vector2, fire1: bool, p2: Vector2, fire2: bool, delta: float) -> void:
	if result != "":
		return
	_move_pilot(0, p1, delta)
	_move_pilot(1, p2, delta)
	_try_shot(0, fire1)
	_try_shot(1, fire2)
	for i in range(shots.size() - 1, -1, -1):
		var shot := shots[i]
		var owner_slot: int = shot.owner
		var target := 1 - owner_slot
		var previous: Vector2 = shot.point
		shot.point = previous + shot.dir * PULSE_SPEED * delta
		shot.life -= delta
		var nearest := Geometry2D.get_closest_point_to_segment(positions[target], previous, shot.point)
		if nearest.distance_to(positions[target]) <= 0.55:
			_confirm_hit(target)
			shots.remove_at(i)
		elif shot.life <= 0.0 or absf(shot.point.x) > 9.0 or absf(shot.point.y) > 7.0:
			shots.remove_at(i)
	if hp[0] == 0 or hp[1] == 0:
		result = "Draw" if hp[0] == hp[1] else ("P1 wins" if hp[1] == 0 else "P2 wins")
		shots.clear()
		moving.assign([false, false])

func _move_pilot(slot: int, direction: Vector2, delta: float) -> void:
	moving[slot] = not direction.is_zero_approx()
	if moving[slot]:
		facing[slot] = direction.normalized()
		var next := positions[slot] + direction.limit_length(1.0) * SPEED * delta
		positions[slot] = next.clamp(Vector2(-8, -6), Vector2(8, 6))
	cooldown[slot] = maxf(0.0, cooldown[slot] - delta)

func _try_shot(slot: int, firing: bool) -> void:
	if firing and cooldown[slot] <= 0.0:
		# Start inside the shooter's hit radius so a close opponent is still reachable.
		shots.append({"point": positions[slot] + facing[slot] * 0.35, "dir": facing[slot], "owner": slot, "life": 1.8})
		cooldown[slot] = SHOT_DELAY

func snapshot() -> Dictionary:
	return {"positions": positions.duplicate(), "facing": facing.duplicate(), "hp": hp.duplicate(),
		"moving": moving.duplicate(), "shots": shots.duplicate(true), "result": result}

func apply_snapshot(state: Dictionary) -> void:
	if mode != "client":
		return
	positions.assign(state.positions)
	facing.assign(state.facing)
	hp.assign(state.hp)
	moving.assign(state.moving)
	shots.assign(state.shots)
	result = state.result
	_draw_round()

func _draw_round() -> void:
	for slot in 2:
		var p: Node3D = pilots[slot]
		var ring: MeshInstance3D = p.get_node("Ring")
		if hp[slot] < displayed_hp[slot]:
			if hit_tweens[slot]:
				hit_tweens[slot].kill()
			ring.scale = resting_scales[slot] * 1.5
			hit_tweens[slot] = create_tween()
			hit_tweens[slot].tween_property(ring, "scale", resting_scales[slot], hit_cue_seconds)
		displayed_hp[slot] = hp[slot]
		p.position = Vector3(positions[slot].x, 0.05, positions[slot].y)
		p.rotation.y = atan2(-facing[slot].x, -facing[slot].y)
		var anim: AnimationPlayer = p.get_node("Model/AnimationPlayer")
		var clip := &"walk" if moving[slot] else &"idle"
		if anim.current_animation != clip:
			anim.play(clip)
	while $Pulses.get_child_count() < shots.size():
		var pulse := MeshInstance3D.new()
		var sphere := SphereMesh.new()
		sphere.radius = 0.17
		sphere.height = 0.34
		pulse.mesh = sphere
		$Pulses.add_child(pulse)
	for i in $Pulses.get_child_count():
		var pulse: MeshInstance3D = $Pulses.get_child(i)
		pulse.visible = i < shots.size()
		if pulse.visible:
			var point: Vector2 = shots[i].point
			pulse.position = Vector3(point.x, 0.75, point.y)
			pulse.material_override = pilots[shots[i].owner].get_node("Ring").mesh.material
	match_hud.get_node("Score").text = "P1    %s / 3       \u2022       P2    %s / 3" % [hp[0], hp[1]]
	match_hud.get_node("Result").text = result
	match_hud.get_node("Rematch").visible = result != "" and mode in ["bot", "local"]

func pad_device(slot: int) -> int:
	return Pad.device_for_slot(Input.get_connected_joypads(), slot, mode == "local")

func pilot_move(slot: int) -> Vector2:
	return (read_move(slot) + Pad.stick(pad_device(slot))).limit_length(1.0)

func pilot_fire(slot: int) -> bool:
	var device := pad_device(slot)
	return read_fire(slot) or (device >= 0 and Input.is_joy_button_pressed(device, JOY_BUTTON_X))

func _confirm_hit(target: int) -> void:
	if hp[target] <= 0:
		return
	hp[target] -= 1
	_play_hit(target)
	if mode == "host":
		network.broadcast_hit(target)

func _play_hit(target: int) -> void:
	pilots[target].get_node("HitFX").play_hit()
	$HitRumble.play_hit(target, mode)
`,"scripts/duel_network.gd":`extends Node

signal hit_received(target: int)
signal match_started(is_host: bool)
signal match_ended(message: String)
signal status_changed(message: String)
signal snapshot_received(state: Dictionary)

const PORT := 7000
const HOST_ID := 1
const JOIN_TIMEOUT_MS := 8000
const INPUT_TIMEOUT_MS := 500

var remote_direction := Vector2.ZERO
var remote_fire := false
var guest_id := 0
var active_peer: ENetMultiplayerPeer
var hosting := false
var connecting := false
var join_started_ms := 0
var last_input_ms := 0

func _ready() -> void:
	# Keep this practice match separate from any networking in the host project.
	var duel_api := MultiplayerAPI.create_default_interface()
	get_tree().set_multiplayer(duel_api, get_path())
	multiplayer.peer_connected.connect(_peer_connected)
	multiplayer.peer_disconnected.connect(_peer_disconnected)
	multiplayer.connected_to_server.connect(_connected_to_host)
	multiplayer.connection_failed.connect(_connection_failed)
	multiplayer.server_disconnected.connect(_server_disconnected)

func host_game() -> Error:
	leave_game()
	var peer := ENetMultiplayerPeer.new()
	var error := peer.create_server(PORT, 1)
	if error != OK:
		status_changed.emit("Could not host on UDP %d. Close any other host on this computer and try again." % PORT)
		return error
	active_peer = peer
	hosting = true
	multiplayer.multiplayer_peer = peer
	status_changed.emit("Hosting on UDP %d. Waiting for one guest." % PORT)
	return OK

func join_game(address: String) -> Error:
	var host_address := address.strip_edges()
	if not host_address.is_valid_ip_address():
		status_changed.emit("Enter a numeric host IP without a port or URL.")
		return ERR_INVALID_PARAMETER
	leave_game()
	var peer := ENetMultiplayerPeer.new()
	var error := peer.create_client(host_address, PORT)
	if error != OK:
		status_changed.emit("Could not open the connection. Check the host address.")
		return error
	active_peer = peer
	connecting = true
	join_started_ms = Time.get_ticks_msec()
	multiplayer.multiplayer_peer = peer
	status_changed.emit("Connecting to %s on UDP %d\u2026" % [host_address, PORT])
	return OK

func _peer_connected(id: int) -> void:
	if hosting and guest_id == 0:
		guest_id = id
		match_started.emit(true)

func _connected_to_host() -> void:
	if not connecting:
		return
	connecting = false
	match_started.emit(false)

func _peer_disconnected(id: int) -> void:
	if hosting and id == guest_id:
		_end_session.call_deferred(active_peer, "Guest left. Host again to play another match.")

func _connection_failed() -> void:
	_end_session.call_deferred(active_peer, "Join failed. Check host IP, VPN or UDP 7000 forwarding.")

func _server_disconnected() -> void:
	_end_session.call_deferred(active_peer, "Host left. Return to the match menu and join a new host.")

func _process(_delta: float) -> void:
	if connecting and Time.get_ticks_msec() - join_started_ms > JOIN_TIMEOUT_MS:
		_end_session(active_peer, "No host answered. Check host IP, VPN or UDP 7000 forwarding.")
	if hosting and Time.get_ticks_msec() - last_input_ms > INPUT_TIMEOUT_MS:
		remote_direction = Vector2.ZERO
		remote_fire = false

func send_input(direction: Vector2, fire: bool) -> void:
	if active_peer and not hosting and not connecting and active_peer.get_connection_status() == MultiplayerPeer.CONNECTION_CONNECTED:
		_receive_input.rpc_id(HOST_ID, direction, fire, $Series.epoch)

@rpc("any_peer", "call_remote", "unreliable_ordered", 1)
func _receive_input(direction: Vector2, fire: bool, epoch: int) -> void:
	if not hosting or multiplayer.get_remote_sender_id() != guest_id:
		return
	if not direction.is_finite() or not $Series.is_live(epoch):
		return
	remote_direction = direction.limit_length(1.0)
	remote_fire = fire
	last_input_ms = Time.get_ticks_msec()

func broadcast_state(state: Dictionary) -> void:
	if hosting and guest_id != 0 and active_peer.get_peer(guest_id) != null:
		_receive_state.rpc_id(guest_id, state, $Series.epoch)

@rpc("authority", "call_remote", "unreliable_ordered", 2)
func _receive_state(state: Dictionary, epoch: int) -> void:
	if active_peer and not hosting and multiplayer.get_remote_sender_id() == HOST_ID and $Series.is_live(epoch):
		snapshot_received.emit(state)

func _end_session(peer: ENetMultiplayerPeer, reason: String) -> void:
	if peer == null or peer != active_peer:
		return
	leave_game()
	match_ended.emit(reason)

func leave_game() -> void:
	hosting = false
	connecting = false
	guest_id = 0
	remote_direction = Vector2.ZERO
	remote_fire = false
	if active_peer:
		active_peer.close()
		multiplayer.multiplayer_peer = OfflineMultiplayerPeer.new()
		active_peer = null

func _exit_tree() -> void:
	leave_game()
	get_tree().set_multiplayer(null, get_path())

func broadcast_hit(target: int) -> void:
	if hosting and guest_id != 0 and active_peer.get_peer(guest_id) != null:
		_receive_hit.rpc_id(guest_id, target, $Series.epoch)

@rpc("authority", "call_remote", "reliable")
func _receive_hit(target: int, epoch: int) -> void:
	if active_peer and not hosting and multiplayer.get_remote_sender_id() == HOST_ID and $Series.is_live(epoch):
		if target in [0, 1]:
			hit_received.emit(target)
`,"scripts/network_series.gd":`extends Node

@export_range(1, 5) var wins_needed := 2
@export_file("*.tscn") var arena_path := "res://scenes/network_arena.tscn"
@onready var net = get_parent()
@onready var duel = net.get_parent()
@onready var panel: Control = duel.get_node("HUD/Series")
@onready var ui := panel.get_node("Card/Column")
@onready var confirm: Button = ui.get_node("Confirm")
var phase := ""
var epoch := 0
var votes := [false, false]
var wins := [0, 0]
var round_number := 1
var outcome := ""
var seconds := 0
var deadline := 0
var loading := false
var stage: Node3D
var final_state := {}

func _ready() -> void:
	confirm.pressed.connect(_confirm)
	ui.get_node("Leave").pressed.connect(duel.show_modes)

func clear_room() -> void:
	phase = ""
	epoch = 0
	loading = false
	_drop_stage()
	panel.hide()

func _drop_stage() -> void:
	if is_instance_valid(stage):
		stage.get_parent().remove_child(stage)
		stage.queue_free()
	stage = null
	duel.get_node("Set").show()

func connected(is_host: bool) -> void:
	duel.get_node("HUD/Net").hide()
	ui.get_node("Role").text = "Network PvP \xB7 Host (P1)" if is_host else "Network PvP \xB7 Guest (P2)"
	if is_host:
		_new_match()

func _new_match() -> void:
	wins.assign([0, 0])
	round_number = 1
	outcome = ""
	final_state.clear()
	_transition("ready")

func is_live(packet_epoch: int) -> bool:
	return phase == "live" and packet_epoch == epoch

func _transition(next: String) -> void:
	epoch += 1
	phase = next
	votes.assign([false, false])
	seconds = 3 if phase == "countdown" else 15
	deadline = Time.get_ticks_msec() + seconds * 1000
	net.remote_direction = Vector2.ZERO
	net.remote_fire = false
	_enter_phase()
	_publish()

func _publish() -> void:
	_render()
	if net.hosting and net.guest_id:
		_sync.rpc_id(net.guest_id, epoch, phase, votes, wins, round_number, outcome, seconds, final_state)

@rpc("authority", "call_remote", "reliable")
func _sync(version: int, next: String, acknowledgements: Array, score: Array, number: int, result: String, clock: int, snapshot: Dictionary) -> void:
	if not net.active_peer or net.hosting or multiplayer.get_remote_sender_id() != 1 or version < epoch:
		return
	var changed := version != epoch
	epoch = version
	phase = next
	votes.assign(acknowledgements)
	wins.assign(score)
	round_number = number
	outcome = result
	seconds = clock
	final_state = snapshot
	if changed:
		_enter_phase()
	_render()

func _enter_phase() -> void:
	loading = false
	match phase:
		"ready", "retry":
			_drop_stage()
			duel.mode = ""
		"loading":
			_drop_stage()
			loading = true
			ui.get_node("Progress").value = 0
			if ResourceLoader.load_threaded_request(arena_path, "PackedScene") != OK:
				_load_failed.call_deferred(epoch)
		"countdown":
			duel.start_round("host" if net.hosting else "client")
		"round", "result":
			if not net.hosting:
				duel.apply_snapshot(final_state)
	duel.get_node("HUD/Match").visible = phase == "live"
	panel.visible = phase != "live"

func _process(_delta: float) -> void:
	if loading:
		_poll_load()
	if not net.hosting:
		return
	if phase in ["ready", "countdown"]:
		var remaining := maxi(0, ceili((deadline - Time.get_ticks_msec()) / 1000.0))
		if remaining != seconds:
			seconds = remaining
			if seconds > 0:
				_publish()
			elif phase == "countdown":
				_transition("live")
			else:
				outcome = "Ready check expired"
				_transition("retry")
	elif phase == "live" and duel.result != "":
		outcome = duel.result
		final_state = duel.snapshot()
		if duel.hp[0] != duel.hp[1]:
			var winner := 0 if duel.hp[0] > duel.hp[1] else 1
			wins[winner] += 1
		_transition("result" if wins.max() >= wins_needed else "round")

func _poll_load() -> void:
	var progress := []
	var status := ResourceLoader.load_threaded_get_status(arena_path, progress)
	if not progress.is_empty():
		ui.get_node("Progress").value = progress[0] * 100
	if status == ResourceLoader.THREAD_LOAD_IN_PROGRESS:
		return
	loading = false
	if status == ResourceLoader.THREAD_LOAD_LOADED:
		var packed := ResourceLoader.load_threaded_get(arena_path) as PackedScene
		if packed:
			var instance := packed.instantiate()
			if instance is Node3D:
				stage = instance
				duel.add_child(stage)
				duel.get_node("Set").hide()
				ui.get_node("Progress").value = 100
				_render()
				return
			instance.free()
	_load_failed(epoch)

func _load_failed(version: int) -> void:
	if phase != "loading" or version != epoch:
		return
	loading = false
	if net.hosting:
		outcome = "Host could not load the arena"
		_transition("retry")
	else:
		_guest_failed.rpc_id(1, epoch)

@rpc("any_peer", "call_remote", "reliable")
func _guest_failed(version: int) -> void:
	if net.hosting and multiplayer.get_remote_sender_id() == net.guest_id and phase == "loading" and epoch == version:
		outcome = "Guest could not load the arena"
		_transition("retry")

func _confirm() -> void:
	if confirm.disabled:
		return
	if net.hosting:
		_vote(0, epoch)
	else:
		confirm.disabled = true
		_guest_vote.rpc_id(1, epoch)

@rpc("any_peer", "call_remote", "reliable")
func _guest_vote(version: int) -> void:
	if net.hosting and multiplayer.get_remote_sender_id() == net.guest_id:
		_vote(1, version)

func _vote(slot: int, version: int) -> void:
	if epoch != version or votes[slot] or phase not in ["ready", "loading", "round", "result", "retry"]:
		return
	votes[slot] = true
	if not votes[0] or not votes[1]:
		_publish()
		return
	match phase:
		"ready": _transition("loading")
		"loading": _transition("countdown")
		"round":
			round_number += 1
			_transition("countdown")
		"result", "retry": _new_match()

func _render() -> void:
	if phase == "live":
		duel.match_hud.get_node("Help").text = "Round %d   \xB7   Wins %d \u2013 %d   \xB7   WASD + Space or left stick + X" % [round_number, wins[0], wins[1]]
		return
	var action := ""
	var heading := ""
	var detail := ""
	match phase:
		"ready":
			heading = "Ready check"
			action = "Ready"
			detail = "Both players must accept \xB7 %d s left" % seconds
		"loading":
			heading = "Loading arena"
			action = "Enter arena"
			detail = "When your arena has loaded, confirm entry."
		"countdown":
			heading = "Round %d" % round_number
			detail = "Starts in %d" % seconds
		"round", "result":
			heading = "Round %d \xB7 %s" % [round_number, outcome]
			if phase == "result":
				var winner := 1 if wins[0] > wins[1] else 2
				heading = "Match winner \xB7 P%d" % winner
			detail = "Round wins   P1 %d \u2013 %d P2\\nLast round \xB7 %s" % [wins[0], wins[1], outcome]
			action = "Rematch" if phase == "result" else "Next round"
		"retry":
			heading = outcome
			action = "Try again"
	if action != "":
		detail += "\\nP1  %s     P2  %s" % ["\u2713" if votes[0] else "\u2026", "\u2713" if votes[1] else "\u2026"]
	ui.get_node("Title").text = heading
	ui.get_node("Detail").text = detail
	ui.get_node("Progress").visible = phase == "loading"
	confirm.visible = action != ""
	confirm.text = action
	confirm.disabled = votes[0 if net.hosting else 1] or (phase == "loading" and not is_instance_valid(stage))
`,"scenes/network_arena.tscn":`[gd_scene load_steps=4 format=3]

[ext_resource type="PackedScene" path="res://scenes/set.tscn" id="Set"]

[sub_resource type="StandardMaterial3D" id="Paint"]
albedo_color = Color(0.46, 0.7, 0.74, 1)

[sub_resource type="BoxMesh" id="Stripe"]
material = SubResource("Paint")
size = Vector3(0.06, 0.04, 12)

[node name="NetworkArena" instance=ExtResource("Set")]

[node name="CenterLine" type="MeshInstance3D" parent="."]
position = Vector3(0, 0.04, 0)
mesh = SubResource("Stripe")
`,"scenes/hit_feedback.tscn":`[gd_scene load_steps=5 format=3]

[ext_resource type="Script" path="res://scripts/hit_feedback.gd" id="Logic"]

[sub_resource type="Animation" id="Hit"]
resource_name = "hit_flash"
length = 0.24
step = 0.04
tracks/0/type = "value"
tracks/0/path = NodePath("Target:scale")
tracks/0/keys = {"times": PackedFloat32Array(0, 0.08, 0.24), "transitions": PackedFloat32Array(1, 1, 1), "update": 0, "values": [Vector2(1, 1), Vector2(1.25, 1.25), Vector2(1, 1)]}
tracks/1/type = "value"
tracks/1/path = NodePath("Target:modulate")
tracks/1/keys = {"times": PackedFloat32Array(0, 0.08, 0.24), "transitions": PackedFloat32Array(1, 1, 1), "update": 0, "values": [Color(0.34, 0.71, 0.76, 1), Color(1, 0.96, 0.78, 1), Color(0.34, 0.71, 0.76, 1)]}

[sub_resource type="Animation" id="Reset"]
resource_name = "RESET"
length = 0.0
tracks/0/type = "value"
tracks/0/path = NodePath("Target:scale")
tracks/0/keys = {"times": PackedFloat32Array(0), "transitions": PackedFloat32Array(1), "update": 0, "values": [Vector2(1, 1)]}
tracks/1/type = "value"
tracks/1/path = NodePath("Target:modulate")
tracks/1/keys = {"times": PackedFloat32Array(0), "transitions": PackedFloat32Array(1), "update": 0, "values": [Color(0.34, 0.71, 0.76, 1)]}

[sub_resource type="AnimationLibrary" id="Clips"]
_data = {&"RESET": SubResource("Reset"), &"hit_flash": SubResource("Hit")}

[node name="HitFeedback" type="Node2D"]
script = ExtResource("Logic")

[node name="Floor" type="Polygon2D" parent="."]
color = Color(0.055, 0.094, 0.137, 1)
polygon = PackedVector2Array(0, 0, 1000, 0, 1000, 680, 0, 680)

[node name="Sight" type="Line2D" parent="."]
position = Vector2(500, 310)
points = PackedVector2Array(-96, -37, -96, -53, -78, -53)
width = 2.0
default_color = Color(0.42, 0.58, 0.65, 1)

[node name="SightRight" type="Line2D" parent="."]
position = Vector2(500, 310)
points = PackedVector2Array(96, 37, 96, 53, 78, 53)
width = 2.0
default_color = Color(0.42, 0.58, 0.65, 1)

[node name="Target" type="Polygon2D" parent="."]
position = Vector2(500, 310)
modulate = Color(0.34, 0.71, 0.76, 1)
polygon = PackedVector2Array(0, -52, 46, -26, 46, 25, 0, 53, -46, 25, -46, -26)

[node name="Inset" type="Polygon2D" parent="Target"]
color = Color(0.22, 0.34, 0.39, 1)
polygon = PackedVector2Array(0, -36, 31, -18, 31, 17, 0, 36, -31, 17, -31, -18)

[node name="Core" type="Polygon2D" parent="Target"]
color = Color(1, 1, 1, 1)
polygon = PackedVector2Array(0, -18, 16, -9, 16, 9, 0, 18, -16, 9, -16, -9)

[node name="Burst" type="CPUParticles2D" parent="."]
position = Vector2(500, 310)
emitting = false
amount = 12
lifetime = 0.35
one_shot = true
explosiveness = 1.0
spread = 180.0
gravity = Vector2(0, 0)
initial_velocity_min = 420.0
initial_velocity_max = 510.0
scale_amount_min = 4.0
scale_amount_max = 7.0
color = Color(1.0, 0.73, 0.32, 1)

[node name="AnimationPlayer" type="AnimationPlayer" parent="."]
libraries = {&"": SubResource("Clips")}

[node name="HUD" type="CanvasLayer" parent="."]

[node name="Title" type="Label" parent="HUD"]
offset_left = 38.0
offset_top = 28.0
theme_override_font_sizes/font_size = 30
text = "Hit feedback"

[node name="Help" type="Label" parent="HUD"]
offset_left = 40.0
offset_top = 72.0
text = "Click the target to land a shot. Click empty space to miss."

[node name="Hit" type="Button" parent="HUD"]
offset_left = 421.0
offset_top = 482.0
offset_right = 579.0
offset_bottom = 526.0
text = "Trigger hit"

[node name="Status" type="Label" parent="HUD"]
offset_left = 270.0
offset_top = 443.0
offset_right = 730.0
offset_bottom = 473.0
text = "Awaiting shot"
horizontal_alignment = 1
`,"scripts/hit_feedback.gd":`extends Node2D

signal hit

@onready var target: Polygon2D = $Target
@onready var burst: CPUParticles2D = $Burst
@onready var animation: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
	hit.connect(_play_hit)
	$HUD/Hit.pressed.connect(func(): _resolve_shot(target.global_position))

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_resolve_shot(get_global_mouse_position())

func _resolve_shot(point: Vector2) -> void:
	if Geometry2D.is_point_in_polygon(to_local(point) - target.position, target.polygon):
		$HUD/Status.text = "Hit confirmed"
		hit.emit()
	else:
		$HUD/Status.text = "Miss"

func _play_hit() -> void:
	burst.restart()
	burst.emitting = true
	animation.stop()
	animation.play(&"hit_flash")
`,"scenes/duel_hit.tscn":`[gd_scene load_steps=8 format=3]

[ext_resource type="Script" path="res://scripts/duel_hit.gd" id="Hit"]

[sub_resource type="StandardMaterial3D" id="Gold"]
shading_mode = 0
albedo_color = Color(1, 0.78, 0.29, 1)

[sub_resource type="BoxMesh" id="Spark"]
material = SubResource("Gold")
size = Vector3(0.12, 0.23, 0.12)

[sub_resource type="TorusMesh" id="Halo"]
material = SubResource("Gold")
inner_radius = 0.71
outer_radius = 0.81
rings = 32
ring_segments = 8

[sub_resource type="Animation" id="Pulse"]
resource_name = "hit_flash"
length = 0.24
step = 0.04
tracks/0/type = "value"
tracks/0/path = NodePath("Flash:scale")
tracks/0/keys = {"times": PackedFloat32Array(0, 0.08, 0.24), "transitions": PackedFloat32Array(1, 1, 1), "update": 0, "values": [Vector3(1, 1, 1), Vector3(1.25, 1.25, 1.25), Vector3(1, 1, 1)]}
tracks/1/type = "value"
tracks/1/path = NodePath("Flash:visible")
tracks/1/keys = {"times": PackedFloat32Array(0, 0.24), "transitions": PackedFloat32Array(1, 1), "update": 1, "values": [true, false]}

[sub_resource type="Animation" id="Rest"]
resource_name = "RESET"
length = 0.0
tracks/0/type = "value"
tracks/0/path = NodePath("Flash:scale")
tracks/0/keys = {"times": PackedFloat32Array(0), "transitions": PackedFloat32Array(1), "update": 0, "values": [Vector3(1, 1, 1)]}
tracks/1/type = "value"
tracks/1/path = NodePath("Flash:visible")
tracks/1/keys = {"times": PackedFloat32Array(0), "transitions": PackedFloat32Array(1), "update": 1, "values": [false]}

[sub_resource type="AnimationLibrary" id="Clips"]
_data = {&"RESET": SubResource("Rest"), &"hit_flash": SubResource("Pulse")}

[node name="HitFX" type="Node3D"]
script = ExtResource("Hit")

[node name="Burst" type="CPUParticles3D" parent="."]
position = Vector3(0, 0.95, 0)
cast_shadow = 0
emitting = false
amount = 12
lifetime = 0.35
one_shot = true
explosiveness = 1.0
use_fixed_seed = true
seed = 7301
fixed_fps = 60
mesh = SubResource("Spark")
direction = Vector3(0, 1, 0)
spread = 135.0
gravity = Vector3(0, -4, 0)
initial_velocity_min = 5.5
initial_velocity_max = 7.5
particle_flag_align_y = true

[node name="Flash" type="MeshInstance3D" parent="."]
position = Vector3(0, 0.88, 0)
cast_shadow = 0
visible = false
mesh = SubResource("Halo")

[node name="AnimationPlayer" type="AnimationPlayer" parent="."]
speed_scale = 1.0
libraries = {&"": SubResource("Clips")}
`,"scripts/duel_hit.gd":`extends Node3D

func play_hit() -> void:
	$Burst.show()
	$Burst.restart(true)
	$AnimationPlayer.stop()
	$AnimationPlayer.play(&"hit_flash")
	$AnimationPlayer.advance(0.0)

func clear_hit() -> void:
	$Burst.emitting = false
	$Burst.hide()
	$AnimationPlayer.stop()
	$Flash.hide()
	$Flash.scale = Vector3.ONE
`,"scripts/hit_rumble.gd":`extends Node

const Pad = preload("res://scripts/gamepad.gd")

@export_range(0.0, 1.0, 0.05) var strength := 0.55
@export_range(0.05, 1.0, 0.01, "suffix:s") var duration := 0.18

func play_hit(target: int, mode: String) -> void:
	var device := device_for_hit(target, mode, Input.get_connected_joypads())
	if device >= 0 and strength > 0.0:
		Input.start_joy_vibration(device, strength, strength, duration)

func device_for_hit(target: int, mode: String, devices: Array) -> int:
	if mode == "local":
		return Pad.device_for_slot(devices, target, true)
	var own_slot := 1 if mode == "client" else 0
	if mode in ["host", "client", "bot"] and target == own_slot:
		return Pad.device_for_slot(devices, 0, false)
	return -1
`};var po='<a class="lib-link" href="#/lesson/gamepad-setup">Connect and test a gamepad \u2192</a>',V=ce.flatMap(e=>e.lessons),Fn=!0,E=Gt();try{E=qe(localStorage.getItem(We),V),localStorage.setItem(We,JSON.stringify(E))}catch{Fn=!1}var K=document.querySelector("#app"),Ie=document.querySelector("#photo-viewer"),ot=document.querySelector("#preview"),De=new Set,uo=new Map,oe=!1,In="",mo=e=>e.lessons.filter(t=>E.completed.includes(t.id)).length,Dn=()=>Math.round(100*E.completed.length/V.length),Mn=e=>ce.findIndex(t=>t.lessons.includes(e)),xe=e=>"#/lesson/"+e.id,Xo=["box","code","bolt","target","game","layers","target","bolt"],Jo=["Find your way from the Blender viewport to your first Godot scene.","Write GDScript for a ready room, loading screen, and match results.","Bring your character to life with movement and animation.","Connect damage, enemies, and projectiles into a playable arena.",...ce.slice(4).map(e=>e.description)],st=!1,de=_a(V,()=>E,(e,t)=>{JSON.stringify(e)===JSON.stringify(E)&&!t||(E=e,fo(),we())});function fo(){try{localStorage.setItem(We,JSON.stringify(E))}catch{Fn=!1}}function Ne(){let e=Ee().lesson;e&&(E.last=e.id),fo(),de.changed()}function Ee(){location.hash==="#/gamepad"&&history.replaceState(null,"","#/lesson/gamepad-setup");let[,e,t]=location.hash.split("/"),n=e==="lesson"&&V.find(o=>o.id===t);return{section:n?"lesson":["devices","pair","resources","complete","setup","own-project","character","attack","reactions","enemy-attack","roll","stamina","shared-budget"].includes(e)?e:"dashboard",lesson:n}}var $n=(e,t)=>`<div class="track" role="progressbar" aria-label="${b(t)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${e}"><i style="width:${e}%"></i></div>`,Bn=e=>"mod-"+e;function Zo(e){return`<aside id="sidebar" class="sidebar ${oe?"visible":""}" aria-label="Course navigation"><header class="brand"><img src="./assets/mark.svg" alt="" width="39" height="39"><a href="#/" aria-label="Battle Lab dashboard"><strong>Battle Lab</strong><small>GODOT LEARNING STUDIO</small></a><button class="drawer-close icon-btn" data-action="menu" aria-label="Close navigation">${I("close")}</button></header>
  <div class="sidebar-scroll"><div class="side-label">WORKSPACE</div><nav class="main-nav"><a href="#/" class="${e.section==="dashboard"?"selected":""}">${I("grid")} Dashboard</a><a href="#/setup" class="${["setup","own-project","character","attack","reactions","enemy-attack","roll","stamina","shared-budget"].includes(e.section)?"selected":""}">${I("book")} Setup guide</a><a href="#/resources" class="${e.section==="resources"?"selected":""}">${I("folder")} Resource library</a><a href="#/devices" class="${["devices","pair"].includes(e.section)?"selected":""}">${I("layers")} Sync progress</a></nav>
  <div class="side-label second">CURRICULUM</div><nav class="chapter-nav">${ce.map((t,n)=>`<div><button class="chapter-switch ${Bn(n)}" data-module="${n}" aria-expanded="${De.has(n)}"><span class="chap-glyph">${I(Xo[n],16)}</span><span class="chap-name"><small>MODULE ${fe(n+1)} \xB7 ${mo(t)}/${t.lessons.length}</small><b>${b(t.title)}</b></span>${I(De.has(n)?"down":"right",13)}</button>${De.has(n)?`<div class="side-lessons">${t.lessons.map(o=>`<a class="${e.lesson===o?"current":""}" href="${xe(o)}">${E.completed.includes(o.id)?I("check",13):"<i></i>"}${b(o.title)}</a>`).join("")}</div>`:""}</div>`).join("")}</nav></div>
  <footer class="side-foot"><div class="flex items-center justify-between"><b>${I("target",15)} Your progress</b><strong>${Dn()}%</strong></div>${$n(Dn(),"Course completion")}<small>${E.completed.length} of ${V.length} lessons complete</small></footer></aside>`}function Qo(e){let t=e.lesson?ce[Mn(e.lesson)].title:{dashboard:"Dashboard",devices:"Sync progress",pair:"Resume on this device",resources:"Resource library",complete:"Course complete",setup:"First setup","own-project":"Use my project",character:"My Blender character",attack:"Attack animation",reactions:"Hit and death","enemy-attack":"Enemy weapon timing",roll:"Dodge roll",stamina:"Roll stamina","shared-budget":"Shared stamina"}[e.section];return`<header class="topbar"><button class="menu icon-btn" data-action="menu" aria-label="Open navigation" aria-expanded="${oe}">${I("menu")}</button><div class="crumb">${I("layers",16)} <a href="#/">Workspace</a> ${I("right",12)} <span>${b(t)}</span></div><span class="engine"><i></i> Godot 4.4.1</span></header>`}function es(){let e=V.find(t=>t.id===E.last)||V[0];return`<div class="page"><header class="page-title"><h1>Learning dashboard</h1><p>Your workshop for turning 3D art into a playable game.</p><a class="lib-link" href="#/devices">Continue on another device \u2192</a></header>
  <section class="hero"><img class="hero-img" src="./assets/art/arena.webp" alt="Isometric sci-fi arena with a cyan pilot facing a coral enemy"><div class="hero-shade"></div><div class="hero-copy"><span class="kicker hero-label">${I("game",15)} PROJECT-BASED COURSE</span><h2>Build your first<br><em>3D battle game.</em></h2><p>From Blender artist to game developer.<br>Learn Godot and GDScript, one scene at a time.</p><div class="hero-meta"><span>${I("layers",15)} ${ce.length} modules</span><span>${I("book",15)} ${V.length} lessons</span></div><a class="primary" href="${xe(e)}">${E.last?"Resume Learning":"Start Learning"} ${I("arrow",17)}</a></div><button class="preview-button" data-action="preview" aria-label="Preview playable arena">${I("expand",15)}</button></section>
  <section class="curriculum"><div class="section-heading"><div><span class="kicker">LEARNING PATH</span><h2>Course curriculum</h2></div><span class="module-total">${I("layers",15)} ${ce.length} modules</span></div><div class="card-grid">${ce.map((t,n)=>`<a class="course-card ${Bn(n)}" href="${xe(t.lessons.find(o=>!E.completed.includes(o.id))||t.lessons[0])}"><div class="card-art"><img src="${n===6?"./assets/duel-guide/setup-menu.webp":n===5?"./assets/menu-guide/art-lobby.webp":n===4?"./assets/enemy-attack-guide/godot-encounter.webp":"./assets/art/chapter-"+(n+1)+".webp"}" alt=""><span class="card-number">${fe(n+1)}</span></div><div class="card-body"><span class="kicker">MODULE ${fe(n+1)}</span><h3>${b(t.title)}</h3><p>${Jo[n]}</p><div class="card-meta"><span>${I("book",14)} ${t.lessons.length} lessons</span><span class="card-arrow">${I("arrow",15)}</span></div>${$n(Math.round(mo(t)*100/t.lessons.length),t.title+" completion")}</div></a>`).join("")}</div></section>
  <a class="resource-banner" href="#/resources"><span class="resource-icon">${I("folder",23)}</span><span><b>Resource library</b><small>Project files, practice assets, and the coding glossary</small></span>${I("arrow")}</a></div>`}function ts(e){return`<details class="file" data-source="${b(e)}"><summary>${I("file",16)} <code>${b(e)}</code></summary><div class="file-toolbar"><span>res://${b(e)}</span><button data-copy="${b(e)}">${I("copy",14)} Copy</button></div><pre><code>${b(nt[e])}</code></pre></details>`}function ns(e,t){let[n,o]=Za(e,t),a="./assets/"+n+".webp";return te(a,o,!0)}function as(e){let{file:t,lines:n}=Ja[e];return`<section class="lesson-reading"><h3>${t.endsWith(".tscn")||t.endsWith(".import")?"Read the saved settings":"Read the code line by line"}</h3><p class="reading-file"><code>${b(t)}</code></p><p class="word-help">Select an underlined word to see its meaning and a usage example.</p><dl>${n.map(({code:a,meaning:s})=>`<div><dt><code>${Te(a,!t.endsWith(".gd"))}</code></dt><dd>${b(s)}</dd></div>`).join("")}</dl></section>`}function os(e){let t=Mn(e),n=V.indexOf(e),o=ce[t],a=E.responses[e.id]||{},s=E.active[e.id]||e.steps[0].id,i=s==="quiz",c=e.steps.find(g=>g.id===s)||e.steps[0],l=E.completed.includes(e.id),h=e.id.startsWith("effects-")||["duel-hit-effects","duel-hit-rumble"].includes(e.id),u=e.id==="projectiles-and-restart"||e.guide&&e.guide!=="own-project",d=e.duelMode?xa(e.duelMode):t===5?Wa():u?Ha():e.guide==="own-project"?'<a class="lib-link" href="#/lesson/projectiles-and-restart">Open the arena and download your tuned kit \u2192</a>':Da(e.id),f=[...e.steps,{id:"quiz",title:"Knowledge check"}].map((g,x)=>{let y=g.id==="quiz"?a.quiz===e.answer:a[g.id];return`<button class="step-tab ${s===g.id?"active":""}" data-step="${b(g.id)}" aria-label="Step ${x+1}: ${b(g.title)}" aria-pressed="${s===g.id}"><span>${y?I("check",15):x+1}</span> ${b(g.title)}</button>`}).join(""),S=i?`<h3>${b(e.question)}</h3><div class="choices">${e.options.map((g,x)=>`<button data-answer="${x}" class="choice ${a.quiz===x?x===e.answer?"correct":"incorrect":""}" aria-pressed="${a.quiz===x}"><b>${String.fromCharCode(65+x)}</b>${b(g)}</button>`).join("")}</div>${Number.isInteger(a.quiz)?`<p class="feedback" role="status">${a.quiz===e.answer?"Correct. "+b(e.feedback):"Try again. Revisit the diagram or code trace, then choose another answer."}</p>`:""}`:`<h3>${b(c.title)}</h3>${c.directions?`<ol class="editor-directions">${c.directions.map(g=>`<li>${b(g)}</li>`).join("")}</ol>`:`<p class="preserve">${b(c.body)}</p>`}${e.id==="duel-setup"||e.id==="duel-network"&&c.id==="host"||e.id==="duel-internet"&&c.id==="prepare"?c.id==="install"?'<a class="lib-link" href="./downloads/arena-kit.zip" download>Download the installable project kit \u2193</a>':'<a class="lib-link" href="./downloads/battle-lab.zip" download>Download the reference project \u2193</a>':""}${ns(e.id,c)}<div class="expected"><b>${I("target",16)} What you should see</b><p>${b(c.expected)}</p></div><button class="primary verify" data-action="verify">${I(a[s]?"check":"right",15)} ${a[s]?"Verified \xB7 continue":"I verified this step"}</button>`;return`<div class="page lesson-page ${Bn(t)}"><header class="page-title"><span class="kicker">MODULE ${fe(t+1)} / LESSON ${fe(o.lessons.indexOf(e)+1)}</span><h1>${b(e.title)}</h1><p class="meta-line">${I("clock",15)} ${Number(e.minutes)} min <span>\xB7</span> ${b(o.title)}</p><button class="jump-lab" data-action="jump">Jump to hands-on lab \u2193</button> ${e.id==="shared-stamina"?'<button class="jump-lab" data-action="jump-attack-cost">Edit attack cost code \u2193</button>':e.id==="roll-stamina"?'<button class="jump-lab" data-action="jump-stamina">Edit stamina code \u2193</button>':""}</header><div class="lesson-grid"><details class="panel lesson-concept" ${uo.get(e.id)??window.matchMedia("(max-width:800px)").matches?"open":""}><summary>${I("book",18)} <span>What &amp; why</span> ${I("down",16)}</summary><p class="preserve">${b(e.concept)}</p><div class="analogy"><b>${I("box",16)} In Blender terms</b><p>${b(e.analogy)}</p></div>${e.guide?`<a class="lib-link" href="#/${e.guide}">Open the illustrated walkthrough \u2192</a>`:""}<h3>Visual map</h3><div class="diagram">${e.diagram.map((g,x)=>`<div><span>${fe(x+1)}</span><code>${b(g)}</code></div>`).join("")}</div>
  ${e.walkthrough?.length?`<h3>Read the code</h3><div class="trace">${e.walkthrough.map(g=>`<div><code>${Te(g.line)}</code><p>${b(g.explanation)}</p></div>`).join("")}</div>`:""}
  ${e.files.length?`<h3>Source files</h3>${e.files.map(ts).join("")}`:""}${e.references?.length?`<h3>Further reading</h3>${e.references.map(g=>`<a class="lib-link" href="${b(g.url)}" target="_blank" rel="noopener">${b(g.label)} \u2197</a>`).join(" ")}`:""}<h3>Troubleshooting</h3>${e.troubleshooting.map(g=>`<details class="trouble"><summary>${b(g.symptom)}</summary><p>${b(g.fix)}</p></details>`).join("")}</details>
  <section class="panel lab" tabindex="-1"><div class="panel-label">${I("terminal")} HANDS-ON LAB</div><h2>Try it yourself</h2>${h||e.id==="gamepad-setup"?'<a class="lib-link" href="./downloads/battle-lab.zip" download>Download the Godot reference project \u2193</a>':""}${e.duelMode||e.id.startsWith("pvp-")||["editor-tour","wasd-movement","projectiles-and-restart","duel-hit-rumble"].includes(e.id)?po:""}${e.id.startsWith("pvp-")?'<a class="lib-link" href="./downloads/battle-lab.zip" download>Download the playable Godot project \u2193</a><a class="lib-link" href="#/lesson/duel-network">Play this match on two computers \u2192</a>'+Un():""}${["duel-network","duel-internet","effects-hit"].includes(e.id)?'<a class="lib-link" href="#/lesson/duel-hit-effects">Add a shared 3D hit effect to this duel \u2192</a>':""}${["duel-hit-effects","gamepad-setup"].includes(e.id)?'<a class="lib-link" href="#/lesson/duel-hit-rumble">Add impact vibration for the hit player \u2192</a>':""}${ia(e.id)}${t===5?'<button class="jump-lab" data-action="jump-style">Customize this screen \u2193</button> ':""}${d&&e.guide!=="own-project"?`<button class="jump-lab" data-action="jump-practice">${e.duelMode==="network"?"Trace one network input":e.duelMode?"Try the duel controls":t===5?"Jump to game menu":u?"Jump to playable arena":"Jump to code editor"} \u2193</button>`:""}${e.id==="editor-tour"?Rn:["asset-import","animation-blend","projectiles-and-restart"].includes(e.id)?An:""}<div class="step-list" aria-label="Exercise steps">${f}</div><div class="exercise"><div class="kicker">${i?"KNOWLEDGE CHECK":"STEP "+fe(e.steps.indexOf(c)+1)+" / "+fe(e.steps.length)}</div>${S}</div>${i?"":as(e.id)}${la(e.id)}${d}${h?Nn(e.id):""}${co(e.id)}<a class="lib-link" href="#/resources">${I("folder",16)} Open resource library ${I("right",14)}</a></section></div></div>
  <div class="lesson-footer"><a class="secondary" href="${n?xe(V[n-1]):"#/"}">${I("back",14)} Previous</a><span>Lesson ${n+1} of ${V.length}</span><button class="primary" data-action="finish" ${pt(e,a)?"":"disabled"}>${l?"Continue":n===V.length-1?"Complete lesson":"Mark complete & continue"} ${I("arrow",15)}</button></div>`}function ss(){return`<div class="page resource-page"><header class="page-title"><span class="kicker">WORKSPACE</span><h1>Resource library</h1><p>Everything you need to build and inspect the arena.</p>${Rn} ${An} ${po}</header><div class="downloads">${[["battle-lab.zip","Reference game","Unzip, then open project.godot in Godot 4.4.1. Press F6 on a practice scene or F5 for the full arena.","game"],["scout.glb","Animated scout","Drag this glTF binary into the FileSystem panel. It includes materials and the idle and walk clips.","box"]].map(([e,t,n,o])=>`<article class="panel"><span class="resource-icon">${I(o,25)}</span><h2>${t}</h2><p>${n}</p><a class="secondary" href="./downloads/${e}" download>${I("download",16)} Download ${e.endsWith("zip")?"project":"asset"}</a></article>`).join("")}</div>${da()}<div class="section-heading"><h2>Coding glossary</h2></div><div class="glossary">${Vn.map(([e,t])=>`<details class="trouble"><summary>${b(e)}</summary><p>${b(t)}</p></details>`).join("")}</div></div>`}function rs(){let e=E.completed.length===V.length,t=V.find(n=>!E.completed.includes(n.id))||V[0];return`<div class="page"><section class="panel finish"><span class="resource-icon">${I("flag",28)}</span><div class="kicker">COURSE PROGRESS</div><h1>${e?"Arena complete!":"Your learning progress"}</h1><p>${E.completed.length} of ${V.length} lessons complete. ${e?"Run your arena, defeat the enemy, and restart for another round.":"Continue with your next unfinished lesson."}</p>${$n(Dn(),"Overall progress")}<a class="primary" href="${e?"#/resources":xe(t)}">${e?"Open project files":"Continue learning"} ${I("arrow",15)}</a><a class="lib-link" href="#/">Back to dashboard</a></section></div>`}var ze="",En="",Re=!1;function is(e){let t=V.find(a=>a.id===E.last),n=t?.steps.find(a=>a.id===E.active[t.id]),o=t?t.title+" \xB7 "+(n?.title||(E.active[t.id]==="quiz"?"Knowledge check":t.steps[0].title)):"No lesson started in this browser.";return`<div class="page"><header class="page-title"><h1>${e?"Resume on this device":"Sync your progress"}</h1><p>Carry your last exercise step, completed lessons, quiz answers and saved practice code between devices.</p></header><section class="panel sync-panel"><h2>Your place in the course</h2><p>${b(o)}</p><p>${E.completed.length} of ${V.length} lessons complete</p><p role="status" data-sync-status>${b(En||de.status)}</p>
    ${e?`<button class="primary" data-action="pair" ${Re?"disabled":""}>${Re?"Connecting\u2026":E.last&&!de.paired?"Merge this browser\u2019s progress and open":"Open my progress"}</button>`:`<button class="primary" data-action="sync-link" ${Re?"disabled":""}>${Re?"Connecting\u2026":de.paired?"Show my personal link":"Create my personal link"}</button>`}
    <p>Anyone with your personal link can view and update this progress. Keep it for your own devices.</p>
    ${ze&&!e?`<div class="sync-transfer"><div data-qr></div><div><h3>Continue on your phone</h3><p>Scan the QR code with your phone camera, or copy the link to yourself. Keep the same link for your next session.</p><label for="personal-link">Your personal link</label><input id="personal-link" readonly value="${b(ze)}"><button class="secondary" data-action="copy-link">Copy link</button> <a class="primary" href="${b(ze)}">Continue on the public site \u2192</a></div></div>`:""}
    </section>${!e&&location.origin!==mt?`<section class="panel sync-panel"><h2>Bring progress from the original site</h2><p>On the computer and browser where you studied, open the original site. Create your personal link there first, then open it on this device.</p><a class="secondary" href="${mt}/#/devices">Open original progress \u2192</a></section>`:""}</div>`}async function On(e){if(!Re){Re=!0,En="",we();try{let t=e?location.hash.split("/")[2]:void 0;if(e&&!t)throw Error("This link is incomplete.");ze=await de.connect(t),e&&Ee().section==="pair"&&(history.replaceState(null,"",location.pathname+location.search+(E.last?"#/lesson/"+E.last:"#/")),st=!0)}catch(t){En=t instanceof TypeError?"Could not connect. Check your connection and retry.":t.message}finally{Re=!1,we(),st=!1}}}var ho;function we(){ho?.();let e=Ee(),t=e.lesson?.id||e.section;t!==In&&(e.lesson&&(De.add(Mn(e.lesson)),st||(E.last=e.lesson.id,Ne())),oe=!1,window.scrollTo(0,0));let n=t!==In;if(In=t,document.title=(e.lesson?.title||{dashboard:"Dashboard",devices:"Sync progress",pair:"Resume on this device",resources:"Resource library",complete:"Course progress",setup:"First setup","own-project":"Use my project",character:"My Blender character",attack:"Attack animation",reactions:"Hit and death","enemy-attack":"Enemy weapon timing",roll:"Dodge roll",stamina:"Roll stamina","shared-budget":"Shared stamina"}[e.section])+" \xB7 Battle Lab",K.innerHTML=Zo(e)+`<button class="scrim ${oe?"visible":""}" aria-label="Close menu" data-action="menu"></button><main id="content" tabindex="-1">${Qo(e)}${Fn?"":'<p class="storage-warning">Progress is available for this session only. Browser storage is unavailable.</p>'}${e.lesson?os(e.lesson):["devices","pair"].includes(e.section)?is(e.section==="pair"):e.section==="shared-budget"?eo():e.section==="stamina"?to():e.section==="roll"?no():e.section==="enemy-attack"?ao():e.section==="reactions"?ro():e.section==="attack"?io():e.section==="character"?Qa():["setup","own-project"].includes(e.section)?lo(e.section==="own-project"):e.section==="resources"?ss():e.section==="complete"?rs():es()}</main>`,document.querySelector("base"))for(let c of document.querySelectorAll('a[href^="#"]'))c.href=location.pathname+location.search+c.getAttribute("href");let o=K.querySelector("[data-word-results]");o&&jt(o,"");for(let c of K.querySelectorAll("details[data-source]"))c.addEventListener("toggle",()=>{if(!c.open||c.dataset.annotated)return;let l=c.dataset.source;c.querySelector("pre code").innerHTML=Te(nt[l],!l.endsWith(".gd")),c.dataset.annotated="1"});let a=K.querySelector("[data-qr]");a&&import("../vendor/qrcode.mjs").then(({default:c})=>{let l=c(0,"M");l.addData(ze),l.make(),a.innerHTML=l.createSvgTag({scalable:!0,alt:"Scan your personal progress link"})});let s=V.find(c=>c.guide===e.section);if(s){let c=K.querySelector(".guide-tabs");c&&c.insertAdjacentHTML("afterbegin",`<a class="secondary" href="${xe(s)}">Open tracked lesson \u2192</a>`)}let i=K.querySelector(".lesson-concept");i&&i.addEventListener("toggle",()=>uo.set(e.lesson.id,i.open)),Ea(K),zn(K,e.lesson,nt),ho=Ta(K)||qa(K)||Na(K),e.lesson?.id==="shared-stamina"&&(K.querySelector('[data-explain="attack-cost"]').open=!0),e.lesson?.guide==="roll"&&(K.querySelector(".roll-panel").open=!0),aa(K,Wn),Pt(K.querySelector("[data-sim]")),n&&e.section!=="dashboard"&&document.querySelector("#content").focus({preventScroll:!0})}function Ct(e){document.querySelector("#notice").textContent=e}function at(e){we(),document.querySelector(e)?.focus({preventScroll:!0})}K.addEventListener("click",async e=>{let t=e.target.closest("button,a");if(!t)return;let{lesson:n}=Ee();if(t.hasAttribute("data-enlarge")){let a=t.closest("figure").querySelector("img"),s=Ie.querySelector("img");s.onload=()=>s.style.setProperty("--photo-ratio",s.naturalWidth/s.naturalHeight),s.src=a.currentSrc||a.src,s.alt=a.alt,Ie.showModal();return}if(t.dataset.word){ha(t.dataset.word);return}if(t.dataset.action==="pair"||t.dataset.action==="sync-link"){await On(t.dataset.action==="pair");return}if(t.dataset.action==="copy-link"){try{await navigator.clipboard.writeText(ze),t.textContent="Copied"}catch{document.querySelector("#personal-link").select()}return}if(t.closest("[data-sim]")){Pt(t.closest("[data-sim]"),t);return}if(t.dataset.module!==void 0){let a=Number(t.dataset.module);De.has(a)?De.delete(a):De.add(a),at('[data-module="'+a+'"]');return}if(t.dataset.action==="menu"){oe=!oe,we(),document.querySelector(oe?".drawer-close":".menu").focus();return}if(t.tagName==="A"&&oe&&(oe=!1,t.hash===location.hash&&we()),t.dataset.action==="jump-attack-cost"){K.querySelector('[data-tune="attack-cost"]')?.focus();return}if(t.dataset.action==="jump-stamina"){K.querySelector('[data-tune="roll-cost"]')?.focus();return}if(t.dataset.action==="jump-style"){let a=K.querySelector(".menu-style-guide");a.open=!0,a.querySelector("summary").focus(),a.scrollIntoView({block:"start"});return}if(t.dataset.action==="jump-practice"){let a=K.querySelector(".lab .code-lab");a.tabIndex=-1,a.focus({preventScroll:!0}),a.scrollIntoView({block:"start"});return}if(t.dataset.action==="jump"){let a=K.querySelector(".lab");a.focus({preventScroll:!0}),a.scrollIntoView({block:"start"});return}if(t.dataset.action==="preview"){ot.innerHTML=`<button class="icon-btn" aria-label="Close preview" autofocus>${I("close")}</button><img src="./assets/art/gameplay.png" alt="Godot game screen showing the scout, sentinel, arena floor, and health display"><div><h2>The playable arena</h2><p>Captured in Godot 4.4.1. Move with WASD, fire with Space, roll with Shift, and press R after a round to restart.</p></div>`,ot.showModal();return}if(t.dataset.copy){try{await navigator.clipboard.writeText(nt[t.dataset.copy]),t.textContent="Copied",Ct("Copied "+t.dataset.copy)}catch{let a=t.closest(".file").querySelector("pre"),s=document.createRange();s.selectNodeContents(a),getSelection().removeAllRanges(),getSelection().addRange(s),Ct("Code selected. Use your keyboard copy shortcut.")}return}if(!n)return;let o=E.responses[n.id]||={};if(t.dataset.step&&(E.active[n.id]=t.dataset.step,Ne(),at('[data-step="'+t.dataset.step+'"]')),t.dataset.action==="verify"){let a=n.steps.findIndex(s=>s.id===(E.active[n.id]||n.steps[0].id));o[n.steps[a].id]=!0,E.active[n.id]=n.steps[a+1]?.id||"quiz",Ne(),at('[data-step="'+E.active[n.id]+'"]'),K.querySelector(".step-list").scrollIntoView({block:"start"}),Ct("Step verified")}if(t.dataset.answer!==void 0){if(E.completed.includes(n.id)&&Number(t.dataset.answer)!==n.answer){Ct("You already completed this knowledge check.");return}o.quiz=Number(t.dataset.answer),Ne(),at('[data-answer="'+o.quiz+'"]')}if(t.dataset.action==="finish"&&pt(n,o)){E.completed.includes(n.id)||E.completed.push(n.id),Ne();let a=V[V.indexOf(n)+1];location.hash=E.completed.length===V.length?"#/complete":xe(a||V.find(s=>!E.completed.includes(s.id)))}});K.addEventListener("input",e=>{e.target.id==="find-word"?jt(K.querySelector("[data-word-results]"),e.target.value):Pt(e.target.closest("[data-sim]"))});Ie.addEventListener("click",e=>{(e.target===Ie||e.target.closest("button"))&&Ie.close()});window.addEventListener("hashchange",()=>{Ie.open&&Ie.close()});ot.addEventListener("click",e=>{(e.target===ot||e.target.closest("button"))&&ot.close()});document.addEventListener("keydown",e=>{if(oe&&(e.key==="Escape"&&(oe=!1,at(".menu")),e.key==="Tab")){let t=[...document.querySelectorAll("#sidebar a,#sidebar button")].filter(n=>n.offsetWidth);e.shiftKey&&document.activeElement===t[0]&&(e.preventDefault(),t.at(-1).focus()),!e.shiftKey&&document.activeElement===t.at(-1)&&(e.preventDefault(),t[0].focus())}});document.querySelector(".skip").addEventListener("click",e=>{e.preventDefault(),document.querySelector("#content").focus()});window.addEventListener("hashchange",()=>{we(),Ee().section==="pair"&&(de.paired||!E.last)&&On(!0)});window.addEventListener("storage",e=>{e.key===We&&(E=qe(e.newValue,V),we())});var Ce=Ee();st=de.paired;we();st=!1;if(Ce.section==="pair")(de.paired||!E.last)&&On(!0);else if(de.paired){let e=E.last;de.refresh().then(t=>{Ee().lesson!==Ce.lesson||!Ce.lesson||(t&&Ce.lesson.id===e&&E.last!==e?location.replace(location.pathname+location.search+xe(V.find(n=>n.id===E.last)||Ce.lesson)):Ce.lesson.id!==e&&(E.last=Ce.lesson.id,Ne()))})}
