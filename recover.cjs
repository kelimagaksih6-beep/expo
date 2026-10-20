const fs=require('node:fs');const path=require('node:path');const vm=require('node:vm');
const dir='dist/_expo/static/js/web';const file=fs.readdirSync(dir).find(n=>n.endsWith('.js'));const bundle=fs.readFileSync(path.join(dir,file),'utf8');
fs.mkdirSync('original-modules',{recursive:true});
const defs=new Map();
for(const segment of bundle.split('\n__d(').slice(1)){
 const match=segment.match(/\},(\d+),(\[[^\n]*?\])\);/); if(!match)continue;
 const code='__d('+segment.slice(0,match.index+match[0].length);
 vm.runInNewContext(code,{__d:(factory,id,deps)=>defs.set(id,{factory,deps})});
 fs.writeFileSync(`original-modules/${match[1]}.js`,code+'\n');
}
function requireModule(id){const d=defs.get(id);if(d.value)return d.value;const module={exports:{}};d.value=module.exports;d.factory({},requireModule,requireModule,requireModule,module,module.exports,d.deps);return module.exports;}
if(!fs.existsSync('src/exercises.json'))fs.writeFileSync('src/exercises.json',JSON.stringify(requireModule(2698).exercises,null,2)+'\n');
fs.writeFileSync('original-bundle.js',bundle);fs.writeFileSync('original-bundle-name.txt',file);
console.log('Recovered modules:',defs.size);
