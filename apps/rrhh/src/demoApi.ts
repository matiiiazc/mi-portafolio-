// Fictitious in-memory records for the portfolio preview. Requests never leave this page.
const samples = {
  contractors: [{ id:'co-1', nombreCompleto:'Jordan Demo', email:'jordan@example.test', currency:'USD', salarioMensualUsd:4200, beneficiaryName:'Jordan Demo', bankName:'Sample Bank', accountNumberIban:'•••• 0042', routingNumber:'000000000', swift:'SAMPLE00', cuil:'', nTelefono:'', domicilioDni:'', domicilioReal:'', bankAddress:'', accountType:'Checking', w8W9Form:'' }, { id:'co-2', nombreCompleto:'Taylor Example', email:'taylor@example.test', currency:'EUR', salarioMensualUsd:3800, beneficiaryName:'Taylor Example', bankName:'Example Credit', accountNumberIban:'•••• 0188', routingNumber:'000000000', swift:'EXAMPL00', cuil:'', nTelefono:'', domicilioDni:'', domicilioReal:'', bankAddress:'', accountType:'Checking', w8W9Form:'' }],
  payments: [{ id:'pay-1', contractorId:'co-1', contractor:{id:'co-1',nombreCompleto:'Jordan Demo'}, contractorNombre:'Jordan Demo', dateOfPayment:'2026-10-10', service:'Product design', billingPeriod:'October 2026', invoiceNumber:'DEMO-101', invoiceDate:'2026-10-01', invoice:'', invoiceAmount:4200, paymentConfirmation:null, status:'Paid', receiptSent:false, sentDate:null }],
  absences: [{ id:'ab-1', contractorId:'co-2', contractor:{id:'co-2',nombreCompleto:'Taylor Example'}, contractorName:'Taylor Example', startDate:'2026-10-14', endDate:'2026-10-15', reason:'Personal leave', daysAbsent:2, monthlySalary:3800, feeAdjustment:0, netPayment:3800, notesComments:'Sample record' }],
  candidates: [{id:'ca-1',name:'Morgan Sample',source:'Portfolio',linkedin:null,profileVerified:null,resume:null,education:'Computer Science',country:'Argentina',continente:'South America',salary:3500,notes:'Fictional portfolio record',stages:'Candidate review',sendTest:null,results:null,clientFeedback:null,hiringManager:'Demo Manager',fechaContratacion:null,mail:'morgan@example.test',emailSent:null}],
  tests: [{id:'te-1',candidateId:'ca-1',candidate:{id:'ca-1',name:'Morgan Sample'},nombre:'Morgan Sample',codingTest:'Frontend exercise',score:'82%',hiringManager:'Demo Manager',interviewIgal:'Completed',igalFeedback:'Sample feedback',recommendation:'Continue'}],
  hired: [{id:'hi-1',name:'Casey Example',country:'Argentina',resume:null,fechaIngreso:'2026-05-01',status:'Active',proyecto:'Demo project',monthlySalary:4000,emailAddress:'casey@example.test',phone:'',mailAz:'',sso:'',prid:'',agreement:null,startingDate:'2026-05-01',computadoras:'',idAddress:'',currentAddress:'',confirmedAddress:'',utilityBill:null,taxResidency:null,documentationFolder:null,beneficiaryName:'Casey Example',bankName:'',bankAddress:'',accountType:'',currency:'USD',accountNumberIban:'',routingNumber:'',swift:'',w8W9Form:''}],
  offboarded: [{id:'off-1',name:'Riley Demo',country:'Spain',resume:null,status:'Contract Ended',monthlySalary:0,emailAddress:'riley@example.test',phone:'',idAddress:'',currentAddress:'',confirmedAddress:'',utilityBill:null,taxResidency:null,documentationFolder:null,beneficiaryName:'',bankName:'',bankAddress:'',accountType:'',currency:'',accountNumberIban:'',routingNumber:'',swift:'',w8W9Form:''}],
}
localStorage.removeItem('nexo_rrhh_usuario')
const json = (data, status=200) => new Response(JSON.stringify(data), {status,headers:{'Content-Type':'application/json'}})
const originalFetch = window.fetch.bind(window)
window.fetch = async (input, init={}) => {
  const url = new URL(typeof input==='string' ? input : input.url, location.href)
  if (!url.hostname.includes('localhost') || url.port !== '3000') return originalFetch(input,init)
  const path=url.pathname.replace(/^\/api\/?/,'/'), method=init.method||'GET'; let body={}; try{body=init.body?JSON.parse(init.body):{}}catch{}
  if(path==='/auth/me') return json({token:'demo-token',user:{id:'demo-admin',nombre:'Alex Demo',rol:'admin',mustChangePassword:false}})
  if(path.startsWith('/auth/')) return json({token:'demo-token',user:{id:'demo-admin',nombre:'Alex Demo',rol:'admin',mustChangePassword:false}})
  if(path==='/uploads'||path==='/archivos') return json({url:'#',filename:'sample-file.pdf',originalName:'sample-file.pdf'})
  if(path.startsWith('/payments/datos-bancarios/')) { const c=samples.contractors.find(x=>x.id===path.split('/').pop()); return json(c||{}) }
  if(path.endsWith('/verify-linkedin')) { const id=path.split('/')[2], c=samples.candidates.find(x=>x.id===id); if(c)c.profileVerified='Verified'; return json(c||{ok:true}) }
  if(path.endsWith('/send-receipt')) { const id=path.split('/')[2], p=samples.payments.find(x=>x.id===id); if(p)p.receiptSent=true; return json(p||{ok:true}) }
  const kind=path.split('/')[1], rows=samples[kind]
  if(!rows) return json([])
  if(method==='GET') return json(rows)
  if(method==='POST') { if(path.split('/').length>3) return json({ok:true}); const row={id:`${kind}-${Date.now()}`,...body}; rows.unshift(row); return json(row) }
  const id=path.split('/')[2], index=rows.findIndex(x=>x.id===id)
  if(method==='PUT'||method==='PATCH') { if(index>=0) rows[index]={...rows[index],...body}; return json(index>=0?rows[index]:body) }
  if(method==='DELETE') { if(index>=0) rows.splice(index,1); return json({ok:true}) }
  return json({ok:true})
}




