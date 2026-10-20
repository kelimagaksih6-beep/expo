function installTargets(model) {
 const factor=2.20462262185;
 model.validateTargets=function(item){
  if(item.targets===undefined)return;
  if(!Array.isArray(item.targets)||item.targets.length!==item.sets)throw new Error('Число целей должно совпадать с числом подходов.');
  for(const t of item.targets){
   if(!t||typeof t!=='object'||Object.keys(t).some(k=>!['weight','weightKg','reps'].includes(k))||typeof t.weight!=='string'||t.weight.length>64||(t.weight!==''&&model.parseNumber(t.weight)===null)||!Number.isSafeInteger(t.reps)||t.reps<1||t.reps>100000||(t.weightKg!==undefined&&(!Number.isFinite(t.weightKg)||t.weightKg<0)))throw new Error('Проверь вес и повторения в целях подходов.');
  }
 };
 model.convertTargetItems=function(items,from,to){return items.map(item=>{
  if(!item.targets)return item;
  return {...item,targets:item.targets.map(t=>{
   if(t.weight==='')return {...t};
   const kg=t.weightKg??model.parseNumber(t.weight)/(from==='lb'?factor:1);
   return {...t,weightKg:kg,weight:String(Math.round(kg*(to==='lb'?factor:1)*100)/100)};
  })};
 });};
 const start=model.startWorkout;
 model.startWorkout=function(program,unit){
  const w=start(program,unit);const day=program.days?.find(d=>d.id===program.nextDayId)??program.days?.[0];
  const items=day?.exercises??program.exercises;
  w.exercises=w.exercises.map((exercise,i)=>{
   const plan=items[i];model.validateTargets(plan);
   if(!plan.targets)return exercise;
   return {...exercise,sets:exercise.sets.map((set,j)=>({...set,weight:plan.targets[j].weight,reps:String(plan.targets[j].reps),targetWeight:plan.targets[j].weight,targetReps:plan.targets[j].reps}))};
  });return w;
 };
 const change=model.changeUnit;
 model.changeUnit=function(data,unit){
  const result=change(data,unit);if(data.profile.unit===unit||!result.program)return result;
  const p=result.program;const days=p.days?.map(d=>({...d,exercises:model.convertTargetItems(d.exercises,data.profile.unit,unit)}));
  return {...result,program:{...p,...(days?{days}:{}),exercises:days?.[0].exercises??model.convertTargetItems(p.exercises,data.profile.unit,unit)}};
 };
}
