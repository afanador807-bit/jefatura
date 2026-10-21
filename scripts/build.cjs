const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const files={DOCENTES:'docentes',ASIGNATURAS:'asignaturas162',PLAN145:'plan145',MALLA162:'malla162'};
const data=Object.entries(files).map(([variable,file])=>{
 const value=JSON.parse(read('data/'+file+'.json'));
 return 'const '+variable+'='+JSON.stringify(value).replace(/</g,'\\u003c')+';';
}).join('\n');
const app=read('src/app.js').replace('/*STAFFING*/',()=>read('src/staffing.js'));
const script=data+'\n'+app;
new vm.Script(script,{filename:'tablero-compilado.js'});
const html=read('src/template.html')
 .replace('/*STYLES*/',()=>read('src/styles.css'))
 .replace('/*DATA*/',()=>data)
 .replace('/*APP*/',()=>app);
for(const placeholder of ['/*DATA*/','/*APP*/','/*STYLES*/','/*STAFFING*/'])if(html.includes(placeholder))throw Error('Marcador sin resolver: '+placeholder);
for(const name of ['index.html','Tablero_docente.html'])fs.writeFileSync(path.join(root,name),html);
console.log('HTML portable compilado. Sin dependencias externas ni solicitudes de red para abrir el archivo.');
