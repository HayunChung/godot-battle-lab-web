// Units here are the units stored in the Inspector. Local and network use the same Duel scene.
export const parameters = {
  camera: ['Camera size','m',10,22,0.1,14,'scenes/arena','Camera3D','size','scenes/arena'],
  guard: ['Guard window','s',0.05,0.5,0.01,0.18,'practice/guard','GuardPractice','guard_window','practice/guard'],
  audio: ['Guard sound','dB',-36,0,1,-6,'practice/guard','GuardSound','volume_db','practice/guard'],
  message: ['Result display time','s',0.2,3,0.05,1.5,'practice/guard','GuardPractice','result_seconds','practice/guard'],
  blend: ['Idle / walk blend rate','/s',1,15,0.1,6,'scenes/player','Player','blend_rate','scenes/arena'],
  impact: ['Impact expansion','s',0.04,0.5,0.01,0.12,'scenes/impact','Impact','expansion_seconds','scenes/arena'],
  attack: ['Shot release','s',0,1,0.01,0.33,'scenes/player','Player','attack_release_seconds','scenes/arena'],
  contact: ['Swing contact fraction','',0,1,0.01,0.5,'scenes/enemy','Enemy','attack_contact_fraction','scenes/arena'],
  reaction: ['Fall playback speed','×',0.25,2,0.05,1,'scenes/enemy','Reactions','fall_speed','scenes/arena'],
  outline: ['Caption outline','px',0,10,1,3,'scenes/arena','Caption','theme_override_constants/outline_size','scenes/arena'],
  sparks: ['Lobby particles','particles',1,64,1,20,'scenes/menu_art','Sparks','amount','scenes/lobby'],
  ring: ['Confirmed hit cue','s',0.08,0.5,0.01,0.22,'scenes/duel','Duel','hit_cue_seconds','scenes/duel']
};

export function normalizeValues(input) {
  return Object.fromEntries(Object.entries(parameters).map(([key,[,,min,max,step,initial]])=>{
    const number=input?.[key];
    const clamped=Number.isFinite(number)?Math.max(min,Math.min(max,number)):initial;
    return [key,Number((min+Math.round((clamped-min)/step)*step).toFixed(3))];
  }));
}

const encoder = new TextEncoder(), decoder = new TextDecoder();
export function setSceneProperty(files,path,node,property,value) {
  const blocks=decoder.decode(files[path]).split(/(?=^\[)/m);
  const index=blocks.findIndex(block=>block.startsWith('[node name="'+node+'" '));
  if(index<0) throw Error('Missing '+path+' / '+node);
  const lines=blocks[index].trimEnd().split('\n');
  const existing=lines.findIndex(line=>line.startsWith(property+' = '));
  const entry=property+' = '+value;
  if(existing<0) lines.push(entry); else lines[existing]=entry;
  blocks[index]=lines.join('\n')+'\n\n';
  files[path]=encoder.encode(blocks.join(''));
}

export function tuneProject(files, values, lesson) {
  const settings=normalizeValues(values);
  for (const [key,[,,,,,,scene,node,property]] of Object.entries(parameters)) {
    const path=scene+'.tscn';
    setSceneProperty(files,path,node,property,settings[key]);
  }
  const start=parameters[lesson==='network'?'ring':lesson][9];
  files['project.godot']=encoder.encode(decoder.decode(files['project.godot']).replace(/^run\/main_scene=.*$/m,'run/main_scene="res://'+start+'.tscn"'));
  return files;
}
