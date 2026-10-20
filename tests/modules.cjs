const fs=require('node:fs'),vm=require('node:vm');
module.exports=function load(){const defs=new Map(),cache=new Map();
 function req(id){if(cache.has(id))return cache.get(id);let entry=defs.get(id);if(!entry){const file=fs.existsSync(`updated-modules/${id}.js`)?`updated-modules/${id}.js`:`original-modules/${id}.js`;vm.runInNewContext(fs.readFileSync(file,'utf8'),{__d:(factory,id,deps)=>defs.set(id,{factory,deps})});entry=defs.get(id);}const m={exports:{}};cache.set(id,m.exports);entry.factory({},req,req,req,m,m.exports,entry.deps);return m.exports;}return req;};
