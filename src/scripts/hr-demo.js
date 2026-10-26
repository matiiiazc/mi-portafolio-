const stages = ['Invite candidate to Interview','Candidate review','Tech Interview scheduled','Tech interview failed','Waiting to send coding test','Coding test sent','Coding test approved','Coding test FAIL','On hold','Hired','Rejected','Withdrew'];
const records = {
  contractors:[{name:'Alex Rivera',country:'Argentina',role:'Product design',amount:'$4,200 USD',status:'Active'},{name:'Sam Parker',country:'Canada',role:'Backend engineering',amount:'$5,800 USD',status:'Active'},{name:'Morgan Reed',country:'Chile',role:'Quality assurance',amount:'$3,600 USD',status:'Active'}],
  payments:[{name:'Alex Rivera',detail:'Product design',period:'October 2026',amount:'$4,200',status:'Paid'},{name:'Sam Parker',detail:'Backend engineering',period:'October 2026',amount:'$5,800',status:'Pending'},{name:'Morgan Reed',detail:'Quality assurance',period:'October 2026',amount:'$3,600',status:'Processing'}],
  absences:[{name:'Jamie Quinn',date:'Nov 04–06, 2026',detail:'Personal leave',amount:'3 days',status:'Approved'},{name:'Sam Parker',date:'Nov 12–15, 2026',detail:'Annual leave',amount:'4 days',status:'Pending'}],
  candidates:[{name:'Jordan Miles',country:'Canada',detail:'Referral',stage:'Candidate review',date:'Oct 21, 2026'},{name:'Taylor Chen',country:'United States',detail:'LinkedIn',stage:'Tech Interview scheduled',date:'Oct 20, 2026'},{name:'Riley Brooks',country:'United Kingdom',detail:'Referral',stage:'Coding test sent',date:'Oct 18, 2026'},{name:'Casey Jordan',country:'Chile',detail:'Careers page',stage:'Waiting to send coding test',date:'Oct 16, 2026'}],
  tests:[{name:'Riley Brooks',detail:'Coding test',amount:'86%',status:'Approved',date:'Oct 23, 2026'},{name:'Casey Jordan',detail:'Coding test',amount:'Not submitted',status:'Sent',date:'Oct 16, 2026'}],
  hired:[{name:'Alex Morgan',country:'Canada',role:'Product Designer',date:'Nov 03, 2026',status:'Onboarding'},{name:'Jamie Reed',country:'United States',role:'QA Engineer',date:'Nov 10, 2026',status:'Agreement sent'}],
  offboarded:[{name:'Drew Ellis',country:'United States',role:'UX Researcher',date:'Sep 30, 2026',status:'Completed'}],
};
const config = {
  contractors:{title:'Contractors',description:'Contractor records in a fictional sample workspace.',button:'＋ Add contractor',columns:[['name','Name'],['country','Country'],['role','Project'],['amount','Monthly compensation'],['status','Status']]},
  payments:{title:'Payments',description:'Invoice and payment tracking · sample workspace.',button:'＋ Add payment',columns:[['name','Contractor'],['detail','Service'],['period','Billing period'],['amount','Invoice amount'],['status','Status']]},
  absences:{title:'Absences',description:'Absence and fee tracking · sample workspace.',button:'＋ Add absence',columns:[['name','Contractor'],['date','Dates'],['detail','Reason'],['amount','Duration'],['status','Status']]},
  candidates:{title:'Candidates',description:'Hiring pipeline · sample workspace.',button:'＋ Add candidate',columns:[['name','Name'],['country','Country'],['detail','Source'],['stage','Stage'],['date','Added']]},
  tests:{title:'Tests',description:'Candidate assessments · sample workspace.',button:'＋ Add test',columns:[['name','Candidate'],['detail','Assessment'],['amount','Result'],['status','Recommendation'],['date','Updated']]},
  hired:{title:'Hired',description:'Onboarding records · sample workspace.',button:'＋ Add hire',columns:[['name','Name'],['country','Country'],['role','Project'],['date','Starting date'],['status','Status']]},
  offboarded:{title:'Offboarded',description:'Completed transitions · sample workspace.',button:'＋ Add record',columns:[['name','Name'],['country','Country'],['role','Project'],['date','End date'],['status','Status']]},
};
let current = 'contractors';
let toastTimer;
const one = selector => document.querySelector(selector);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function statusOf(row) { return row.stage || row.status || ''; }
function optionsFor(page) { return page === 'candidates' ? stages : [...new Set(records[page].map(statusOf).filter(Boolean))]; }
function showToast(text) {
  const node = one('#hr-toast'); node.textContent = text; node.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => node.classList.remove('show'), 2200);
}
function drawTable() {
  const page = config[current];
  const query = one('#hr-search').value.trim().toLowerCase();
  const wantedStatus = one('#hr-stage').value;
  const rows = records[current].filter(row => {
    const matchesText = Object.values(row).some(value => String(value).toLowerCase().includes(query));
    const matchesStatus = !wantedStatus || statusOf(row) === wantedStatus;
    return matchesText && matchesStatus;
  });
  one('#hr-head').innerHTML = `<tr>${page.columns.map(([,label]) => `<th>${escapeHTML(label.toUpperCase())}</th>`).join('')}</tr>`;
  one('#hr-body').innerHTML = rows.map(row => `<tr>${page.columns.map(([key]) => {
    const value = escapeHTML(row[key]);
    if (key === 'name') return `<td><span class="hr-person"><i class="hr-person-avatar">${escapeHTML(row.name.split(' ').map(part => part[0]).slice(0,2).join(''))}</i>${value}</span></td>`;
    if (key === 'stage' && current === 'candidates') return `<td><select class="hr-status-select" data-name="${escapeHTML(row.name)}" aria-label="Candidate stage">${stages.map(stage => `<option ${stage === row.stage ? 'selected' : ''}>${escapeHTML(stage)}</option>`).join('')}</select></td>`;
    if (key === 'status') return `<td><span class="hr-state ${/paid|approved|active|completed|onboarding/i.test(row.status) ? 'success' : /pending|processing|sent/i.test(row.status) ? 'pending' : ''}">${value}</span></td>`;
    return `<td>${value}</td>`;
  }).join('')}</tr>`).join('');
  one('#hr-empty').hidden = rows.length > 0;
  one('#hr-count').textContent = `Showing ${rows.length} of ${records[current].length} records`;
  const filter = one('#hr-stage');
  const oldValue = filter.value;
  filter.innerHTML = '<option value="">All statuses</option>' + optionsFor(current).map(status => `<option>${escapeHTML(status)}</option>`).join('');
  if (optionsFor(current).includes(oldValue)) filter.value = oldValue;
}
function showPage(page) {
  current = page;
  one('#hr-data-view').hidden = page === 'problem';
  one('#hr-explainer').hidden = page !== 'problem';
  document.querySelectorAll('[data-hr-view]').forEach(button => button.classList.toggle('active', button.dataset.hrView === page));
  one('#hr-sidebar').classList.remove('open');
  one('#hr-app').classList.remove('nav-open');
  one('#hr-overlay').hidden = true;
  if (page === 'problem') return;
  one('#hr-title').textContent = config[page].title;
  one('#hr-description').textContent = config[page].description;
  one('#hr-add').innerHTML = config[page].button.replace('＋ ', '<span class="plus">＋</span> ');
  one('#hr-search').value = '';
  one('#hr-stage').value = '';
  drawTable();
}
function sampleRecord(page) {
  const name = ['Taylor Morgan','Avery Brooks','Casey Lane','Riley Jordan'][records[page].length % 4];
  if (page === 'contractors') return {name,country:'Argentina',role:'Design',amount:'$3,900 USD',status:'Active'};
  if (page === 'payments') return {name,detail:'Sample service',period:'November 2026',amount:'$3,900',status:'Pending'};
  if (page === 'absences') return {name,date:'Nov 18–19, 2026',detail:'Personal leave',amount:'2 days',status:'Pending'};
  if (page === 'candidates') return {name,country:'United States',detail:'Sample referral',stage:'Candidate review',date:'Today'};
  if (page === 'tests') return {name,detail:'Coding test',amount:'Pending review',status:'Sent',date:'Today'};
  if (page === 'hired') return {name,country:'Canada',role:'Sample role',date:'Dec 01, 2026',status:'Onboarding'};
  return {name,country:'United States',role:'Sample role',date:'Oct 01, 2026',status:'Completed'};
}
document.querySelectorAll('[data-hr-view]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.hrView)));
one('#hr-search').addEventListener('input', drawTable);
one('#hr-stage').addEventListener('change', drawTable);
one('#hr-filter').addEventListener('click', () => { one('#hr-filter-row').hidden = !one('#hr-filter-row').hidden; });
one('#hr-clear-filter').addEventListener('click', () => { one('#hr-stage').value = ''; one('#hr-search').value = ''; drawTable(); });
one('#hr-body').addEventListener('change', event => {
  if (!event.target.matches('.hr-status-select')) return;
  const row = records[current].find(item => item.name === event.target.dataset.name);
  if (row) { row.stage = event.target.value; drawTable(); showToast('Sample candidate stage updated.'); }
});
one('#hr-add').addEventListener('click', () => { records[current].unshift(sampleRecord(current)); drawTable(); showToast('Fictional sample record added.'); });
one('#hr-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('tema', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});
if (localStorage.getItem('tema') === 'dark') document.body.classList.add('dark-mode');
one('#hr-menu').addEventListener('click', () => { one('#hr-app').classList.add('nav-open'); one('#hr-sidebar').classList.add('open'); one('#hr-overlay').hidden = false; });
['#hr-close','#hr-overlay'].forEach(selector => one(selector).addEventListener('click', () => { one('#hr-app').classList.remove('nav-open'); one('#hr-sidebar').classList.remove('open'); one('#hr-overlay').hidden = true; }));
showPage('contractors');
