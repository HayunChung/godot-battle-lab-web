export async function screenshotForUpload(file){
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>20*1024*1024)throw Error('Choose a PNG, JPEG or WebP screenshot up to 20 MB.');
  const image=new Image();
  const url=URL.createObjectURL(file);
  try{
    image.src=url;
    await image.decode().catch(()=>{throw Error('This screenshot could not be opened. Choose another image.');});
    const canvas=document.createElement('canvas');
    const scale=Math.min(1,2560/Math.max(image.naturalWidth,image.naturalHeight));
    canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
    const ctx=canvas.getContext('2d');
    ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.drawImage(image,0,0,canvas.width,canvas.height);
    for(const quality of [0.9,0.74,0.55]){
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
      if(blob?.size && blob.size<=2*1024*1024)return blob;
    }
    throw Error('Crop the screenshot to the Godot window and try again.');
  }finally{URL.revokeObjectURL(url);}
}
