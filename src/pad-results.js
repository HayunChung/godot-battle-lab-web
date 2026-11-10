export const padTests={
  'detect-pads':'Godot detection',
  'host-pad-test':'Host pressed Test',
  'guest-pad-test':'Guest pressed Test'
};

export function expectedPadResult(step,role){
  return step==='detect-pads' || step===role+'-pad-test';
}

export function padResultLabel(step,value){
  if(step==='detect-pads')return value?'Detected':'Not detected';
  return value?'Vibrated':'Stayed quiet';
}

const roles=['host','guest'];
export function padValue(s,entry,role,phase){
  const expected=expectedPadResult(s.id,role);
  // Earlier exports recorded an explicit observation in the generated note prefix.
  if(phase==='failure'||phase==='relapse'){
    for(const value of [true,false])if(entry?.text?.startsWith('My pad: '+padResultLabel(s.id,value)+'.'))return value;
    if(phase==='failure' && s.firstResolved===1)return undefined;
  }
  if(phase==='fixed')return expected;
  return entry?.padResult;
}
export async function recurrenceHistory(s,attempts,history){
  const episodes=[];
  if(!s.firstResolved)return episodes;
  let lastPass=s.firstResolved,openEpisode;
  for(let n=s.firstResolved+1;n<=s.current;n++){
    const data=attempts.get(n)??await history(s.id,n);
    if(n===s.lastResolved || roles.every(r=>data[r]?.result==='resolved')){
      if(openEpisode){
        openEpisode.fixed=n;
        openEpisode=null;
      }
      lastPass=n;
      attempts.set(n,data);
      continue;
    }
    if(openEpisode)continue;
    const different=roles.some(r=>{
      const value=padValue(s,data[r],r,'relapse');
      return data[r]?.result==='different'||(typeof value==='boolean' && value!==expectedPadResult(s.id,r));
    });
    const legacyReport=roles.some(r=>data[r]?.photo||data[r]?.text) &&
      roles.every(r=>typeof padValue(s,data[r],r,'relapse')!=='boolean');
    if(different || legacyReport){
      openEpisode={passed:lastPass,failed:n};
      episodes.push(openEpisode);
      attempts.set(n,data);
    }
  }
  return episodes;
}
