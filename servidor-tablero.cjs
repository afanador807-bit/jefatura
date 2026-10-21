const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname,store=path.join(root,'memoria-tablero');fs.mkdirSync(store,{recursive:true});
function send(res,code,data){res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(data));}
function valid(v){return v&&v.version===1&&Array.isArray(v.assignments)&&Number.isFinite(v.factor)&&v.assignments.every(a=>Number.isInteger(a.teacher)&&typeof a.space==='string'&&Number.isFinite(a.h)&&a.h>0)}
http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://127.0.0.1:8766');
 if(req.headers.origin&&req.headers.origin!=='http://127.0.0.1:8766'&&req.headers.origin!=='http://localhost:8766')return send(res,403,{error:'Origen no permitido'});
 if(url.pathname==='/api/sessions'&&req.method==='GET'){let sessions=fs.readdirSync(store).filter(x=>x.endsWith('.json')).map(x=>{let v=JSON.parse(fs.readFileSync(path.join(store,x),'utf8'));return {id:v.id,name:v.name,updatedAt:v.updatedAt,revision:v.revision}});return send(res,200,sessions.sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)))}
 const match=url.pathname.match(/^\/api\/sessions\/([a-zA-Z0-9_-]{1,80})$/);
 if(match){let id=match[1],file=path.join(store,id+'.json');if(req.method==='GET')return fs.existsSync(file)?send(res,200,JSON.parse(fs.readFileSync(file,'utf8'))):send(res,404,{error:'Sesión no encontrada'});
 if(req.method==='PUT'){let parts=[],size=0;for await(let chunk of req){size+=chunk.length;if(size>2000000)return send(res,413,{error:'Archivo demasiado grande'});parts.push(chunk)}let body=JSON.parse(Buffer.concat(parts).toString());if(!valid(body.state)||typeof body.name!=='string')return send(res,400,{error:'Escenario inválido'});let previous=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;if(previous&&body.revision!==previous.revision)return send(res,409,{error:'Otra pestaña guardó una versión más reciente. Abre la sesión de nuevo o guarda una copia con Nuevo.'});
 if(previous){let backup=path.join(store,'historial',id);fs.mkdirSync(backup,{recursive:true});fs.copyFileSync(file,path.join(backup,previous.revision+'.json'));}
 let current={id,name:body.name.slice(0,160),revision:(previous?.revision||0)+1,updatedAt:new Date().toISOString(),state:body.state};let temp=file+'.tmp';fs.writeFileSync(temp,JSON.stringify(current,null,2));fs.renameSync(temp,file);return send(res,200,current)}
 }
 if(url.pathname==='/'||url.pathname==='/Tablero_docente.html'){res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});return res.end(fs.readFileSync(path.join(root,'Tablero_docente.html')))}
 if(url.pathname==='/health')return send(res,200,{ok:true});send(res,404,{error:'No encontrado'});
 }catch(e){send(res,500,{error:e.message})}
}).listen(8766,'127.0.0.1',()=>console.log('Tablero disponible en http://127.0.0.1:8766/'));
