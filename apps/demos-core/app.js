// v2
const money = n => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n||0);

const configs = {

 intermedios:{brand:'Intermedios',sub:'Gesti?n comercial',theme:'violet',nav:['Clientes','Pedidos','Presupuestos','Pagos','Gastos','Ganancias','Deuda General','Cosas por hacer'],

  data:{Clientes:[['C-104','Constructora del Sur','Laura M?ndez','11 5555-0134','Activo'],['C-103','Obras Norte','Diego R?os','11 5555-0192','Activo'],['C-102','Estudio Arce','Marta Su?rez','11 5555-0108','Pendiente']],Pedidos:[['P-238','Constructora del Sur','Materiales el?ctricos','12/06/2026','$ 428.500','En curso'],['P-237','Obras Norte','Cables y t?rmicas','10/06/2026','$ 216.000','Entregado'],['P-236','Estudio Arce','Insumos de obra','09/06/2026','$ 89.400','Pendiente']],Presupuestos:[['PR-084','Constructora del Sur','Instalaci?n el?ctrica','$ 780.000','Enviado'],['PR-083','Obras Norte','Materiales de obra','$ 325.500','Aprobado']],Pagos:[['PG-136','Carlos Ben?tez','Horas trabajadas ? 48 h','12/06/2026','$ 192.000','Pendiente'],['PG-135','Ana Torres','Horas trabajadas ? 42 h','11/06/2026','$ 168.000','Pagado']],Gastos:[['G-058','Materiales','Cableado y t?rmicas','11/06/2026','$ 245.000'],['G-057','Log?stica','Traslado de materiales','10/06/2026','$ 48.000']],Ganancias:[['Junio 2026','Ingresos','$ 2.840.000','Gastos','$ 965.000','Neto: $ 1.875.000']], 'Deuda General':[['C-102','Estudio Arce','$ 320.000','Vence 18/06/2026','Vencida'],['C-103','Obras Norte','$ 154.000','Vence 20/06/2026','Al d?a']], 'Cosas por hacer':[['T-024','Confirmar entrega de materiales','Constructora del Sur','Hoy','Pendiente'],['T-023','Enviar presupuesto actualizado','Obras Norte','Ma?ana','En curso']]},

  heads:{Clientes:['ID','Cliente','Contacto','Tel?fono','Estado'],Pedidos:['N.? pedido','Cliente','Detalle','Fecha','Total','Estado'],Presupuestos:['N.?','Cliente','Descripci?n','Total','Estado'],Pagos:['N.?','Empleado','Detalle','Fecha','Monto','Estado'],Gastos:['N.?','Categor?a','Descripci?n','Fecha','Monto'],Ganancias:['Per?odo','Ingresos','','Gastos','',''], 'Deuda General':['Cliente','Raz?n social','Saldo','Vencimiento','Estado'], 'Cosas por hacer':['N.?','Tarea','Cliente','Vencimiento','Estado']},

  kpis:[['Clientes activos','24','+3 este mes'],['Pedidos abiertos','8','3 por entregar'],['A cobrar','$ 474.000','2 cuentas vencidas'],['Ganancia del mes','$ 1.875.000','Junio 2026']], actions:{Clientes:'Nuevo cliente',Pedidos:'Nuevo pedido',Presupuestos:'Crear presupuesto',Pagos:'Registrar pago',Gastos:'Agregar gasto','Cosas por hacer':'Nueva tarea'}},

 meled:{brand:'MELED',sub:'Stock y Ventas ? v2.4',theme:'blue',nav:['Clientes','Proveedores','Productos','Ventas','Faltantes','Resumen por Fechas','Presupuestos','Pedidos','Actualizar Precios'],

  data:{Clientes:[['C-032','Ferreter?a San Juan','Juan P?rez','11 4567-1200','Activo'],['C-031','Casa El?ctrica','Micaela D?az','11 4567-1201','Activo']],Proveedores:[['P-018','Distribuidora Central','Marcos Gil','11 4100-7732','Activo'],['P-017','Electro Mayorista','Luc?a Vera','11 4100-7733','Activo']],Productos:[['SKU-208','Cable unipolar 2.5 mm','Electricidad','125','$ 1.250','$ 1.890'],['SKU-207','T?rmica bipolar 20A','Electricidad','8','$ 8.400','$ 12.900'],['SKU-206','Caja octogonal PVC','Instalaci?n','64','$ 720','$ 1.100'],['SKU-205','Tubo corrugado 3/4','Instalaci?n','5','$ 980','$ 1.550']],Ventas:[['V-512','Ferreter?a San Juan','12/06/2026','6 productos','$ 184.500','Pagada'],['V-511','Casa El?ctrica','12/06/2026','3 productos','$ 92.300','Pagada']],Faltantes:[['SKU-207','T?rmica bipolar 20A','8','Stock m?nimo: 10','Reponer'],['SKU-205','Tubo corrugado 3/4','5','Stock m?nimo: 12','Reponer']], 'Resumen por Fechas':[['Junio 2026','Ventas','$ 4.835.200','Compras','$ 1.965.400','Margen: 59%']],Presupuestos:[['PR-092','Ferreter?a San Juan','6 art?culos','13/06/2026','$ 238.000','Pendiente']],Pedidos:[['PD-074','Electro Mayorista','Cable y protecciones','11/06/2026','En preparaci?n']], 'Actualizar Precios':[['SKU-208','Cable unipolar 2.5 mm','$ 1.250','$ 1.890','+4,2%'],['SKU-207','T?rmica bipolar 20A','$ 8.400','$ 12.900','+3,8%']]},

  heads:{Clientes:['ID','Cliente','Contacto','Tel?fono','Estado'],Proveedores:['ID','Proveedor','Contacto','Tel?fono','Estado'],Productos:['C?digo','Producto','Categor?a','Stock','Costo','Precio'],Ventas:['N.?','Cliente','Fecha','Detalle','Total','Estado'],Faltantes:['C?digo','Producto','Stock actual','Nivel m?nimo','Acci?n'],'Resumen por Fechas':['Per?odo','Tipo','Total','','',''],Presupuestos:['N.?','Cliente','Art?culos','Fecha','Total','Estado'],Pedidos:['N.?','Proveedor','Detalle','Fecha','Estado'],'Actualizar Precios':['C?digo','Producto','Costo','Precio actual','Variaci?n']},

  kpis:[['Ventas de hoy','$ 276.800','9 operaciones'],['Productos activos','418','12 categor?as'],['Stock bajo','7','Revisar faltantes'],['Presupuestos abiertos','5','$ 684.000']], actions:{Clientes:'Nuevo cliente',Proveedores:'Nuevo proveedor',Productos:'Nuevo producto',Ventas:'Nueva venta',Presupuestos:'Nuevo presupuesto',Pedidos:'Nuevo pedido','Actualizar Precios':'Actualizar precios'} }

};

const root=document.querySelector('#app'),kind=document.body.dataset.demo,c=configs[kind];

let page=c.nav[0],query='',store=JSON.parse(localStorage.getItem('portfolio-demo-'+kind)||'{}');

const esc=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));

function rows(name){return store[name]||c.data[name]||[]}

function save(){localStorage.setItem('portfolio-demo-'+kind,JSON.stringify(store))}

function render(){

 const isHome=page==='Resumen'; let data=rows(page), headers=c.heads[page]||[];

 root.innerHTML=`<aside class="sidebar"><div class="brand"><b>${c.brand}</b><small>${c.sub}</small></div><nav>${c.nav.map((n,i)=>`<button class="nav ${page===n?'active':''}" data-page="${esc(n)}"><span>${['?','?','?','?','?','?','?','?','?'][i%9]}</span>${esc(n)}</button>`).join('')}</nav><div class="side-foot"><span class="avatar">MC</span><div><b>Mar?a C.</b><small>Administraci?n</small></div><span class="muted">?</span></div></aside>

 <main class="main"><header class="top"><div><span class="eyebrow">PANEL DE GESTI?N</span><h1>${esc(page)}</h1></div><div class="top-actions"><span class="demo-pill">? Demo ? datos de prueba</span><button class="icon-btn" aria-label="Notificaciones">?</button></div></header>

 ${isHome?`<section class="welcome"><div><span class="eyebrow">JUEVES, 12 DE JUNIO DE 2026</span><h2>Buen d?a, Mar?a <span>?</span></h2><p>${kind==='meled'?'Resumen de la operaci?n de tu negocio.':'Este es el estado actual de la gesti?n de tu empresa.'}</p></div><span class="welcome-mark">${kind==='meled'?'M':'I'}</span></section><section class="kpis">${c.kpis.map((x,i)=>`<article class="kpi"><div>${x[0]}<span class="kpi-icon">${['?','?','?','?'][i]}</span></div><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join('')}</section><section class="panel"><div class="panel-title"><div><h3>Actividad reciente</h3><p>?ltimos movimientos registrados</p></div><button class="text-btn" data-page="${esc(c.nav[1])}">Ver todo ?</button></div>${table(c.nav[1])}</section>`:

 `<section class="toolbar"><label class="search">? <input id="search" placeholder="Buscar en ${esc(page.toLowerCase())}..." value="${esc(query)}"></label><div><button class="outline" id="export">? Exportar</button>${c.actions[page]?` <button class="primary" id="new">? ${esc(c.actions[page])}</button>`:''}</div></section><section class="panel"><div class="panel-title"><div><h3>${esc(page)}</h3><p>${data.length} registros ? informaci?n ficticia para demostraci?n</p></div><span class="table-count">${data.length} registros</span></div>${table(page)}</section>`}

 <footer>DEMO INTERACTIVA <span>Los cambios se guardan solo en este navegador.</span></footer></main>`;

 root.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>{page=b.dataset.page;query='';render()});

 const search=root.querySelector('#search'); if(search)search.oninput=()=>{query=search.value;const old=root.querySelector('.table-wrap');old.outerHTML=table(page)};

 const nw=root.querySelector('#new');if(nw)nw.onclick=()=>modal();const ex=root.querySelector('#export');if(ex)ex.onclick=()=>download(page);root.querySelectorAll('[data-row]').forEach(b=>b.onclick=()=>modal(Number(b.dataset.row)));

}

function table(name){let d=rows(name),h=c.heads[name]||[];const lower=query.toLowerCase();const filtered=d.filter(row=>row.join(' ').toLowerCase().includes(lower));return `<div class="table-wrap"><table><thead><tr>${h.map(x=>`<th>${esc(x)}</th>`).join('')}<th></th></tr></thead><tbody>${filtered.map((r,i)=>`<tr>${r.map((v,j)=>`<td>${j===r.length-1&&/(Activo|Pendiente|En curso|Pagado|Aprobado|Vencida|Al d?a|Pagada|Reponer|En preparaci?n|Enviado)/.test(v)?`<span class="status ${status(v)}">${esc(v)}</span>`:esc(v)}</td>`).join('')}<td><button class="row-menu" data-row="${i}" title="Editar">???</button></td></tr>`).join('')||`<tr><td colspan="${h.length+1}" class="empty">No hay coincidencias.</td></tr>`}</tbody></table></div>`}

function status(s){return /Activo|Pagado|Aprobado|Al d?a|Pagada/.test(s)?'green':/Vencida|Reponer/.test(s)?'red':/curso|Pendiente|Enviado|preparaci?n/.test(s)?'amber':'gray'}

function modal(editIndex){const fields=(c.heads[page]||[]).slice(1).filter(Boolean),editing=Number.isInteger(editIndex),existing=editing?rows(page)[editIndex]:[];root.insertAdjacentHTML('beforeend',`<div class="overlay" id="overlay"><form class="modal"><button type="button" class="close" id="close">?</button><span class="eyebrow">${editing?'EDITAR REGISTRO':'NUEVO REGISTRO'}</span><h2>${editing?'Actualizar':esc(c.actions[page])}</h2><p>Los cambios quedan guardados en este navegador.</p><div class="fields">${fields.map((f,i)=>`<label>${esc(f)}<input name="f${i}" placeholder="${esc(f)}" value="${esc(existing[i+1]||'')}" required></label>`).join('')}</div><div class="modal-actions">${editing?'<button type="button" class="outline" id="delete">Eliminar</button>':''}<button type="button" class="outline" id="cancel">Cancelar</button><button class="primary">Guardar registro</button></div></form></div>`);const close=()=>root.querySelector('#overlay')?.remove();root.querySelectorAll('#close,#cancel').forEach(x=>x.onclick=close);root.querySelector('#overlay').onclick=e=>{if(e.target.id==='overlay')close()};const del=root.querySelector('#delete');if(del)del.onclick=()=>{if(!store[page])store[page]=[...c.data[page]];store[page].splice(editIndex,1);save();close();render()};root.querySelector('form').onsubmit=e=>{e.preventDefault();const values=[editing?existing[0]:`D-${Date.now().toString().slice(-4)}`,...fields.map((_,i)=>e.target.elements[`f${i}`].value),existing.at(-1)||'Pendiente'];if(!store[page])store[page]=[...c.data[page]];if(editing)store[page][editIndex]=values;else store[page].unshift(values);save();close();render()}}

function download(name){const csv=[c.heads[name]||[],...rows(name)].map(r=>r.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`${name.toLowerCase().replaceAll(' ','-')}-demo.csv`;a.click();URL.revokeObjectURL(a.href)}

render();

