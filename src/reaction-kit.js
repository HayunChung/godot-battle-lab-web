// Operate on the same UTF-8 archive entries in the static build and browser export.
const encoder=new TextEncoder(),decoder=new TextDecoder();
const scenePath=actor=>'battle_lab/scenes/'+actor+'.tscn';
function rewrite(files,path,edit){files[path]=encoder.encode(edit(decoder.decode(files[path])));}

export function installReactions(files,driverBytes){
  files['battle_lab/scripts/reactions.gd']=driverBytes;
  for(const actor of ['player','enemy']){
    rewrite(files,scenePath(actor),scene=>scene
      .replace(/load_steps=(\d+)/,(_,n)=>'load_steps='+(Number(n)+1))
      .replace('\n[ext_resource','\n[ext_resource type="Script" path="res://battle_lab/scripts/reactions.gd" id="Reactions"]\n\n[ext_resource')
      +'\n[node name="Reactions" type="Node" parent="."]\nscript = ExtResource("Reactions")\n');
  }
  for(const path of ['battle_lab/stages/health_player.gd','battle_lab/scripts/enemy.gd']){
    rewrite(files,path,script=>script.replace('if health <= 0:', 'if amount <= 0 or health <= 0 or get_parent().get("finished") == true:'));
  }
}

export function installEnemy(files,model,glbBytes){
  files['battle_lab/assets/foe.glb']=glbBytes;
  rewrite(files,scenePath('enemy'),scene=>{
    const angle=model.turn*Math.PI/180,[x,y,z]=model.offset,s=model.scale;
    const modelNode='[node name="Model" type="Node3D" parent="."]';
    const foe=modelNode+'\n\n[node name="Foe" parent="Model" instance=ExtResource("Foe")]\nposition = Vector3('+[Math.cos(angle)*x+Math.sin(angle)*z,y,-Math.sin(angle)*x+Math.cos(angle)*z].join(', ')+')\nrotation = Vector3(0, '+angle+', 0)\nscale = Vector3('+[s,s,s].join(', ')+')';
    // Remove only the sentinel's visual children; keep its contact volumes and controller.
    return scene.split(/(?=^\[)/m).filter(block=>!/^\[node [^\n]*parent="Model"/.test(block)).join('')
      .replace(modelNode,foe)
      .replace('script = ExtResource("1")', 'script = ExtResource("1")\nattack_contact_fraction = '+(Number.isFinite(model.contact) ? Math.max(0,Math.min(1,model.contact)) : 0.5))
      .replace(/load_steps=(\d+)/,(_,n)=>'load_steps='+(Number(n)+1))
      .replace('\n[ext_resource','\n[ext_resource type="PackedScene" path="res://battle_lab/assets/foe.glb" id="Foe"]\n\n[ext_resource');
  });
}
