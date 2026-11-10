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
