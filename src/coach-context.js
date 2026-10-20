function coachContext(data,catalog){
 const byId=new Map(catalog.map(e=>[e.id,e]));const short=(s,n=100)=>String(s||'').slice(0,n);
 const number=s=>{const n=Number(String(s).replace(',','.'));return Number.isFinite(n)&&n>=0?n:null;};
 const profile=data.profile;const days=data.program?(data.program.days??[{name:'День 1',exercises:data.program.exercises}]):[];
 const context={unit:profile.unit,goal:short(profile.goal,80),experience:short(profile.experience,80),frequency:profile.frequency,program:data.program?{name:short(data.program.name),version:data.program.version,days:days.slice(0,7).map(d=>({name:short(d.name),exercises:d.exercises.slice(0,12).map(e=>({name:short(byId.get(e.exerciseId)?.name||e.exerciseId),equipment:short(byId.get(e.exerciseId)?.equipment),sets:e.sets,reps:e.reps,repsMax:e.repsMax??e.reps,rest:e.rest??Math.min(profile.rest,3600)}))}))}:null,recent:[...data.history].filter(w=>w.finishedAt).sort((a,b)=>Date.parse(b.finishedAt)-Date.parse(a.finishedAt)).slice(0,3).map(w=>({date:w.finishedAt,name:short(w.dayName||w.name),unit:w.unit,exercises:w.exercises.filter(e=>e.sets.some(s=>s.completed&&s.kind==='work')).slice(0,8).map(e=>({name:short(byId.get(e.exerciseId)?.name||e.exerciseId),equipment:short(byId.get(e.exerciseId)?.equipment),load:byId.get(e.exerciseId)?.load||'external',sets:e.sets.filter(s=>s.completed&&s.kind==='work'&&number(s.weight)!==null&&Number.isInteger(number(s.reps))&&number(s.reps)>0).slice(0,4).map(s=>({weight:number(s.weight),reps:number(s.reps)}))}))}))};
 // Trim the historical subset before the programme to stay within the server budget.
 while(new TextEncoder().encode(JSON.stringify(context)).length>17500&&context.recent.length)context.recent.pop();
 while(new TextEncoder().encode(JSON.stringify(context)).length>17500&&context.program?.days.length)context.program.days.pop();
 return context;
}
