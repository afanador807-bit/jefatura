function staffingBackup(){
 const list=JSON.parse(localStorage.getItem('fisio-before-staffing-v1')||'[]'),id='reparto-'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
 list.push({id,session:currentSession,savedAt:new Date().toISOString(),snapshot:JSON.stringify(stableState())});
 localStorage.setItem('fisio-before-staffing-v1',JSON.stringify(list));return id;
}
function staffIndex(name){const i=DOCENTES.findIndex(d=>normalizeSearch(d.docente)===normalizeSearch(name));if(i<0)throw Error('No se encontró a '+name);return i;}
function practicalTeachers(practice){return [...new Set(state.assignments.filter(a=>courseSlots.some(s=>s.codigo===a.space&&s.tipo==='Práctica'&&courseKey(s)===practice)).map(a=>a.teacher))];}
function occupiedPractices(i){if(viewCache)return [...viewCache.practices[i]];return [...new Set(state.assignments.filter(a=>a.teacher===i).map(a=>courseSlots.find(s=>s.codigo===a.space)).filter(s=>s?.tipo==='Práctica').map(courseKey))];}
function assignedDirect(i){return load(i).direct;}
function freeDirect(i){const j=jornada(i),limit=DOCENTES[i].dedicacion.toLowerCase().includes('medio')?12:DOCENTES[i].dedicacion.toLowerCase().includes('completo')?20:j/(1+state.factor);return Math.max(0,Math.min(limit-assignedDirect(i),(j-load(i).total)/(1+state.factor)));}
function requiredClinicalArea(s){
 const manual=state.assignments.filter(a=>a.space===s.codigo&&a.generatedBy!=='equidad-v1'),areas=[...new Set(manual.flatMap(a=>clinicianAreas(a.teacher)))];
 if(areas.length===1)return areas[0];
 if(s.parent==='P5N')return 'Neurológica';if(s.parent==='P5O')return 'Osteomuscular';if(s.parent==='P5C')return 'Cardiopulmonar';
 if(['T10','T14','T19','T18','T23','T27','P4','P6'].includes(s.parent))return CLINICAL_AREAS[(s.group-1)%3];
 return null;
}
function teachingAffinity(i,s){
 const d=DOCENTES[i],historical=d.historico_asignaturas_ponderado,axes=d.historico_ejes_ponderado;let points=0;
 for(const [hint,weight] of s.claves_historicas||[])for(const [name,count] of Object.entries(historical))if(normalizeSearch(name).includes(normalizeSearch(hint)))points+=count*weight;
 if(s.eje==='Clínica'&&clinicianAreas(i).length)points+=4;
 if(s.eje==='Comunidad y trabajo'&&Object.keys(axes).some(x=>normalizeSearch(x).includes('comunidad')))points+=8;
 if(s.eje==='Actividad física y deporte'&&Object.keys(axes).some(x=>normalizeSearch(x).includes('actividad fisica')))points+=8;
 // Formación específica documentada en el contexto de trabajo.
 if(s.parent==='P2'&&/ledezma|restrepo puentes|ceron/.test(normalizeSearch(d.docente)))points+=12;
 const clinical=requiredClinicalArea(s);if(clinical&&clinicianAreas(i).includes(clinical))points+=10;
 return points;
}
function eligibleTeacher(i,s){
 if(s.parent==='T04'&&DOCENTES[i].vinculacion!=='Planta')return false;
 const clinical=requiredClinicalArea(s);if(clinical&&!clinicianAreas(i).includes(clinical))return false;
 if(s.tipo==='Práctica'&&!clinical&&teachingAffinity(i,s)<=0)return false;
 return true;
}
function autoAdd(i,s,h,kind='equidad-v1'){
 if(h<=1e-8)return;let old=state.assignments.find(a=>a.teacher===i&&a.space===s&&a.generatedBy===kind);
 if(old)old.h=n(old.h+h);else state.assignments.push({teacher:i,space:s,h:n(h),generatedBy:kind});
}
function addFixedRole(space,teacher,h){state.assignments=state.assignments.filter(a=>a.space!==space);state.assignments.push({teacher,space,h,generatedBy:'reglas-v1',fixedByUser:true});state.demands[space]=h;}
function distributePending(){
 const todo=courseSlots.slice().sort((a,b)=>{const count=s=>DOCENTES.filter((d,i)=>eligibleTeacher(i,s)).length;return (a.tipo==='Práctica'?0:1)-(b.tipo==='Práctica'?0:1)||count(a)-count(b)||b.demand-a.demand||a.codigo.localeCompare(b.codigo)});
 for(const s of todo){let remaining=n(Math.max(0,demand(s)-covered(s.codigo))),iterations=0;
  while(remaining>.001&&iterations++<160){
   let candidates=DOCENTES.map((d,i)=>i).filter(i=>eligibleTeacher(i,s)&&freeDirect(i)>.009);
   if(!candidates.length)break;
   const samePractice=candidates.filter(i=>s.tipo!=='Práctica'||!occupiedPractices(i).length||occupiedPractices(i).includes(courseKey(s)));
   if(samePractice.length)candidates=samePractice;
   let choice=null;
   for(const i of candidates){const room=freeDirect(i),h=n(Math.min(remaining,s.tipo==='Práctica'?6.5:remaining,room)),ratio=(load(i).total+h*(1+state.factor))/jornada(i),existing=state.assignments.some(a=>a.teacher===i&&a.space===s.codigo),affinity=teachingAffinity(i,s);
    if(h<.01)continue;
    const score=ratio-.008*Math.min(affinity,30)-(existing?.06:0)+(s.tipo==='Práctica'&&occupiedPractices(i).some(p=>p!==courseKey(s))?.12:0);
    if(!choice||score<choice.score-1e-10||Math.abs(score-choice.score)<1e-10&&i<choice.i)choice={i,h,score};
   }
   if(!choice)break;autoAdd(choice.i,s.codigo,choice.h);remaining=n(Math.max(0,demand(s)-covered(s.codigo)));
  }
 }
}
function resolvePendingByTransfers(){
 // Libera capacidad de un especialista trasladando únicamente trabajo automático.
 for(let pass=0;pass<12;pass++){let progress=false;
  for(const target of courseSlots){let remaining=n(demand(target)-covered(target.codigo));if(remaining<=.009)continue;
   for(let i=0;i<DOCENTES.length&&remaining>.009;i++){if(!eligibleTeacher(i,target))continue;
    let movable=state.assignments.filter(a=>a.teacher===i&&a.generatedBy==='equidad-v1'&&!a.coordinatorSeed&&a.space!==target.codigo).slice();
    for(const entry of movable){const source=SPACE_INDEX.get(entry.space);if(!source)continue;
     const alternatives=DOCENTES.map((d,j)=>j).filter(j=>j!==i&&eligibleTeacher(j,source)&&freeDirect(j)>.009).sort((a,b)=>load(a).total/jornada(a)-load(b).total/jornada(b));
     for(const j of alternatives){const amount=n(Math.min(remaining,entry.h,freeDirect(j)));if(amount<.01)continue;entry.h=n(entry.h-amount);autoAdd(j,entry.space,amount);autoAdd(i,target.codigo,amount);remaining=n(remaining-amount);progress=true;if(entry.h<.01||remaining<.01)break;}
     if(remaining<.01)break;
    }
   }
  }
  state.assignments=state.assignments.filter(a=>a.h>.009);if(!progress)break;
 }
}
function staffingMetrics(){
 const pending=courseSlots.reduce((z,s)=>z+Math.max(0,demand(s)-covered(s.codigo)),0),over=DOCENTES.map((d,i)=>({teacher:d.docente,h:n(Math.max(0,load(i).total-jornada(i)))})).filter(x=>x.h>.01),multi=DOCENTES.map((d,i)=>({teacher:d.docente,practices:occupiedPractices(i)})).filter(x=>x.practices.length>1);
 const overDirect=DOCENTES.map((d,i)=>({teacher:d.docente,h:n(assignedDirect(i)),limit:d.dedicacion.toLowerCase().includes('medio')?12:d.dedicacion.toLowerCase().includes('completo')?20:jornada(i)/(1+state.factor)})).filter(x=>x.h>x.limit+.01);
 return {pending:n(pending),over,overDirect,multiPractice:multi,teaching:n(courseSlots.reduce((z,s)=>z+Math.min(demand(s),covered(s.codigo)),0)),meeting:n(covered('ADM-REU')),generatedAt:new Date().toISOString(),method:'Afinidad histórica, áreas clínicas y ocupación proporcional de jornada; sin mover asignaciones manuales. TC hasta 20 h directas y MT hasta 12 h, además del límite de jornada.'};
}
function applyStaffing(force=false){
 if(memoryBlocked||!force&&state.staffingRevision===1)return false;
 const backup=staffingBackup();
 const roleNames=['Restrepo Puentes Cristina Eugenia','Afanador Restrepo Diego Fernando','Tovar Ruiz Luz Angela'];
 const [cristina,diego,luz]=roleNames.map(staffIndex);
 const explicit=['ADM-J','ADM-C','ADM-PG','ADM-REU','ADM-PC',...PRACTICES.map(p=>'ADM-PC-'+p.id)];
 state.assignments=state.assignments.filter(a=>a.generatedBy!=='equidad-v1'&&!explicit.includes(a.space)).map(a=>({...a,protectedByUser:true}));
 state.staffingBackupId=backup;state.demands=state.demands||{};state.demands['ADM-PC']=0;
 addFixedRole('ADM-PG',cristina,8);addFixedRole('ADM-C',diego,20);addFixedRole('ADM-J',luz,20);
 state.demands['ADM-REU']=DOCENTES.length*2;
 for(let i=0;i<DOCENTES.length;i++)state.assignments.push({teacher:i,space:'ADM-REU',h:2,generatedBy:'reglas-v1',fixedByUser:true});
 const coordinators=new Set([cristina,diego,luz]);
 for(const practice of PRACTICES){const slots=courseSlots.filter(s=>s.tipo==='Práctica'&&courseKey(s)===practice.id),staff=practicalTeachers(practice.id);let pool=staff.length?staff:DOCENTES.map((d,i)=>i).filter(i=>slots.some(s=>eligibleTeacher(i,s)));
  const fresh=pool.filter(i=>!coordinators.has(i));if(fresh.length)pool=fresh;
  pool.sort((a,b)=>{const score=i=>load(i).total/jornada(i)-Math.min(30,Math.max(...slots.map(s=>teachingAffinity(i,s))))*.01+(load(i).total+2>jornada(i)?5:0);return score(a)-score(b)||a-b});
  if(!pool.length)continue;const teacher=pool[0];coordinators.add(teacher);addFixedRole('ADM-PC-'+practice.id,teacher,2);
  if(!staff.includes(teacher)){const slot=slots.find(s=>eligibleTeacher(teacher,s)&&demand(s)-covered(s.codigo)>.009),seed=slot?Math.min(.5,demand(slot)-covered(slot.codigo),freeDirect(teacher)):0;if(slot&&seed>.009){autoAdd(teacher,slot.codigo,seed);state.assignments.find(a=>a.teacher===teacher&&a.space===slot.codigo&&a.generatedBy==='equidad-v1').coordinatorSeed=true;}}
 }
 distributePending();resolvePendingByTransfers();ensureCourseAreas();state.staffingRevision=1;state.staffingReport=staffingMetrics();return true;
}
async function rerunStaffing(){if(writing)return toast('Espera a que termine el guardado.');applyStaffing(true);render();await sync();showAnalysis();}
async function undoStaffing(){
 const records=JSON.parse(localStorage.getItem('fisio-before-staffing-v1')||'[]'),entry=records.find(x=>x.id===state.staffingBackupId);if(!entry)return toast('No hay una copia previa de este reparto.');
 state=validate(JSON.parse(entry.snapshot));state.staffingRevision=1;state.staffingReport={undone:true};render();await sync();toast('Se recuperó el escenario anterior al reparto.');
}
function staffingSummary(){
 const m=staffingMetrics();
 return '<h3>Carga semanal por profesor</h3><p>'+fmt(m.pending)+' h docentes pendientes. '+m.over.length+' profesores por encima de jornada. '+m.overDirect.length+' superan el tope de docencia directa. '+m.multiPractice.length+' profesores participan en más de una práctica. Se respetan las asignaciones manuales, incluso si necesitan revisión.</p><p>'+esc(m.method)+'</p><table><thead><tr><th>Profesor</th><th>Directa</th><th>Preparación</th><th>Administración y reunión</th><th>Total / jornada</th><th>Ocupación</th></tr></thead><tbody>'+DOCENTES.map((d,i)=>{const l=load(i),j=jornada(i);return '<tr><td>'+esc(d.docente)+'</td><td>'+fmt(l.direct)+'</td><td>'+fmt(l.prep)+'</td><td>'+fmt(l.adm)+'</td><td>'+fmt(l.total)+' / '+j+'</td><td>'+fmt(l.total/j*100)+' %'+(l.total>j+.01?' ⚠':'')+'</td></tr>'}).join('')+'</tbody></table>';
}
