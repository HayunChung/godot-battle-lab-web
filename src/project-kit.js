import {installEnemy} from './reaction-kit.js';
import {kitCharacter} from './character-file.js';
export async function downloadKit(speed,damage,model,enemy,roll,stamina){
  if(!Number.isFinite(speed)||!Number.isSafeInteger(damage)||damage<0)throw Error('Invalid tuning');
  const [{zipSync,unzipSync,strToU8,strFromU8},response]=await Promise.all([import('../vendor/fflate.js'),fetch('./downloads/arena-kit.zip')]);
  if(!response.ok)throw Error('Download unavailable');
  const files=unzipSync(new Uint8Array(await response.arrayBuffer()));
  files['battle_lab/tuning.gd']=strToU8('extends RefCounted\n\nconst MOVE_SPEED: float = '+speed+'\nconst ATTACK_POWER: int = '+damage+'\n');
  if(roll){
    const {start,end}=roll;
    if(!Number.isFinite(start)||!Number.isFinite(end)||start<0||end>1||end<start)throw Error('Invalid roll window');
    const path='battle_lab/scenes/player.tscn',assignment='script = ExtResource("1")';
    files[path]=strToU8(strFromU8(files[path]).replace(assignment,assignment+'\nroll_safe_start = '+start+'\nroll_safe_end = '+end));
  }
  if(stamina){
    const {cost,regen,attackCost=15}=stamina;
    if(![cost,regen,attackCost].every(value=>Number.isFinite(value)&&value>=0&&value<=100))throw Error('Invalid stamina tuning');
    const path='battle_lab/scenes/player.tscn',assignment='script = ExtResource("1")';
    files[path]=strToU8(strFromU8(files[path]).replace(assignment,assignment+'\nroll_stamina_cost = '+cost+'\nstamina_regen_per_second = '+regen+'\nattack_stamina_cost = '+attackCost));
  }
  if(model){
    const base='battle_lab/',path=base+'scenes/player.tscn',script=base+'stages/animated_player.gd';
    files[base+'assets/hero.glb']=kitCharacter(model);
    const angle=model.turn*Math.PI/180, [x,y,z]=model.offset;
    const translation=[Math.cos(angle)*x+Math.sin(angle)*z,y,-Math.sin(angle)*x+Math.cos(angle)*z];
    const hero='[node name="Model" type="Node3D" parent="."]\n\n[node name="Hero" parent="Model" instance=ExtResource("2")]\nposition = Vector3('+translation.join(', ')+')\nrotation = Vector3(0, '+angle+', 0)\nscale = Vector3('+[model.scale,model.scale,model.scale].join(', ')+')';
    files[path]=strToU8(strFromU8(files[path]).replace('assets/scout.glb','assets/hero.glb').replace('[node name="Model" parent="." instance=ExtResource("2")]',hero).replace('NodePath("../Model")','NodePath("../Model/Hero")').replace('../Model/AnimationPlayer','../Model/Hero/AnimationPlayer'));
    if(model.attack>=0){
      const response=await fetch('./assets/attack-guide/attack_player.gd');
      if(!response.ok)throw Error('Attack controller is unavailable.');
      files[base+'scripts/player.gd']=strToU8(await response.text());
      const assignment='script = ExtResource("1")';
      files[path]=strToU8(strFromU8(files[path]).replace(assignment,assignment+'\nattack_release_seconds = '+model.release));
    }
    files[script]=strToU8(strFromU8(files[script]).replace('$Model/AnimationPlayer','$Model/Hero/AnimationPlayer'));
  }
  if(enemy)installEnemy(files,enemy,kitCharacter(enemy));
  const url=URL.createObjectURL(new Blob([zipSync(files)],{type:'application/zip'}));
  const a=document.createElement('a');a.href=url;a.download='battle-lab-tuned.zip';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
