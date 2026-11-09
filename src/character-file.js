// Change animation labels only in the copy packaged with the Godot kit.
const JSON_CHUNK=0x4e4f534a;
export function readGlb(bytes){
  if(bytes.byteLength<20)throw Error('This file is too short to be a GLB.');
  const view=new DataView(bytes);
  if(view.getUint32(0,true)!==0x46546c67||view.getUint32(4,true)!==2||view.getUint32(8,true)!==bytes.byteLength||view.getUint32(16,true)!==JSON_CHUNK)throw Error('Export a glTF Binary (.glb) version 2 file from Blender.');
  const end=20+view.getUint32(12,true);
  if(end>bytes.byteLength)throw Error('The GLB is incomplete. Export it again.');
  const json=JSON.parse(new TextDecoder().decode(new Uint8Array(bytes,20,end-20)));
  if([...(json.buffers||[]),...(json.images||[])].some(item=>item.uri&&!item.uri.startsWith('data:')))throw Error('Pack the images into a single GLB so the arena can open them locally.');
  if(json.animations?.length<2||!json.animations)throw Error('This GLB needs two animation clips. Export both idle and walk actions, then choose the file again.');
  return {json,end};
}
export function kitCharacter(model){
  const {json,end}=readGlb(model.bytes);
  if(model.idle===model.walk)throw Error('Choose different clips for idle and walk.');
  const source=json.animations;
  json.animations=[{...source[model.idle],name:'idle'},{...source[model.walk],name:'walk'}];
  for(const slot of ['attack','hit','death','roll']){
    const index=model[slot];
    if(Number.isInteger(index)&&index>=0&&index<source.length)json.animations.push({...source[index],name:slot});
  }
  const data=new TextEncoder().encode(JSON.stringify(json)),padded=Math.ceil(data.length/4)*4;
  const result=new Uint8Array(20+padded+model.bytes.byteLength-end);
  result.set(new Uint8Array(model.bytes,0,20));result.fill(32,20,20+padded);result.set(data,20);result.set(new Uint8Array(model.bytes,end),20+padded);
  const view=new DataView(result.buffer);view.setUint32(8,result.length,true);view.setUint32(12,padded,true);
  return result;
}
