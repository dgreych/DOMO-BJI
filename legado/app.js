const WA_NUMBER = '5522998432748';

const adultModalities = [
  ['Jiu-Jitsu', 'Adulto'],
  ['Jiu-Jitsu No-Gi', 'Adulto'],
  ['Judô', 'Adulto'],
  ['Krav Magá', 'Defesa pessoal'],
  ['Funcional 50+', 'Condicionamento'],
  ['Ainda não sei', 'Quero ajuda para escolher']
];
const kidsModalities = [
  ['Jiu-Jitsu Kids', 'Criança ou adolescente'],
  ['Judô Kids', 'Criança ou adolescente'],
  ['Ainda não sei', 'Quero ajuda para escolher']
];
const adultGoals = ['Defesa pessoal','Condicionamento físico','Conhecer uma arte marcial','Voltar a treinar','Disciplina','Outro objetivo'];
const kidsGoals = ['Disciplina e confiança','Gastar energia','Defesa pessoal','Socialização','Conhecer a modalidade','Outro objetivo'];
const periods = ['Manhã','Tarde','Noite','Quero combinar pelo WhatsApp'];

const state = { step: 1, profile: '', age: '', modality: '', goal: '', period: '', name: '', phone: '' };

const stage = document.getElementById('stage');
const progress = document.getElementById('progress');
const stepChip = document.getElementById('stepChip');
const flowTitle = document.getElementById('flowTitle');
const leadPreview = document.getElementById('leadPreview');
const teamPreview = document.getElementById('teamPreview');

function esc(value) {
  return String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);
}

function clearNavActive() {
  document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
}

function setView(name) {
  document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === `view-${name}`));
  clearNavActive();
  document.querySelector(`.nav-tab[data-go="${name}"]`)?.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

const locationSection = document.getElementById('como-chegar');
const quickStrip = document.querySelector('.quick-strip');
if (locationSection && quickStrip) {
  quickStrip.insertAdjacentElement('afterend', locationSection);
  locationSection.style.paddingTop = '28px';
}

const tabbar = document.querySelector('.tabbar');
let locationTab = null;
if (tabbar && locationSection) {
  locationTab = document.createElement('button');
  locationTab.className = 'nav-tab';
  locationTab.type = 'button';
  locationTab.textContent = 'COMO CHEGAR';
  locationTab.setAttribute('aria-label', 'Ver localização da Legado');
  tabbar.appendChild(locationTab);
  locationTab.addEventListener('click', () => {
    document.querySelectorAll('.view').forEach(view => view.classList.toggle('active', view.id === 'view-inicio'));
    clearNavActive();
    locationTab.classList.add('active');
    requestAnimationFrame(() => locationSection.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  });
}

document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => setView(button.dataset.go)));

function begin(profile, modality = '') {
  state.profile = profile;
  state.modality = modality;
  state.goal = '';
  state.period = '';
  state.step = 2;
  setView('inicio');
  render();
  requestAnimationFrame(() => document.getElementById('fluxo').scrollIntoView({ behavior: 'smooth', block: 'start' }));
}

document.querySelectorAll('[data-start]').forEach(button => button.addEventListener('click', () => begin(button.dataset.start)));
document.querySelectorAll('[data-pick]').forEach(button => button.addEventListener('click', () => {
  const [profile, modality] = button.dataset.pick.split('|');
  begin(profile, modality);
}));

function currentSelection() {
  return ({1: state.profile, 2: state.modality, 3: state.goal, 4: state.period})[state.step] || '';
}

function choice(value, label, caption = '') {
  return `<button class="option ${currentSelection() === value ? 'active' : ''}" type="button" data-value="${esc(value)}"><strong>${esc(label)}</strong>${caption ? `<span>${esc(caption)}</span>` : ''}</button>`;
}

function bindChoice(field) {
  document.querySelectorAll('#stage [data-value]').forEach(button => button.addEventListener('click', () => {
    state[field] = button.dataset.value;
    if (field === 'profile') { state.modality = ''; state.goal = ''; }
    render();
  }));
}

function renderProgress() {
  progress.innerHTML = Array.from({ length: 5 }, (_, index) => `<i class="${index < state.step ? 'on' : ''}"></i>`).join('');
  stepChip.textContent = `${String(Math.min(state.step, 5)).padStart(2, '0')} / 05`;
}

function renderStage() {
  if (state.step === 1) {
    flowTitle.textContent = 'COMECE POR AQUI';
    stage.innerHTML = `<div class="question"><h3>QUEM VAI TREINAR?</h3><p>Escolha a jornada certa.</p><div class="options">${choice('adult','Para mim / adulto','Modalidades adultas')}${choice('kids','Para meu filho(a)','Criança ou adolescente')}</div><div class="actions"><span></span><button class="next" id="next" ${state.profile ? '' : 'disabled'}>CONTINUAR</button></div></div>`;
    bindChoice('profile');
    document.getElementById('next').onclick = () => { state.step = 2; render(); };
    return;
  }

  if (state.step === 2) {
    const isKids = state.profile === 'kids';
    const modalities = isKids ? kidsModalities : adultModalities;
    flowTitle.textContent = isKids ? 'KIDS' : 'ADULTO';
    stage.innerHTML = `<div class="question"><h3>QUAL MODALIDADE?</h3><p>${isKids ? 'A idade ajuda a equipe a orientar o primeiro contato.' : 'Escolha a que mais chamou sua atenção.'}</p>${isKids ? `<div class="field"><label>IDADE DO ALUNO</label><input id="age" inputmode="numeric" maxlength="2" placeholder="Ex.: 9" value="${esc(state.age)}"></div>` : ''}<div class="options" style="margin-top:12px">${modalities.map(([name, caption]) => choice(name,name,caption)).join('')}</div><div class="actions"><button class="back" id="back">VOLTAR</button><button class="next" id="next" ${state.modality ? '' : 'disabled'}>CONTINUAR</button></div></div>`;
    bindChoice('modality');
    document.getElementById('back').onclick = () => { state.step = 1; render(); };
    document.getElementById('next').onclick = () => { if (isKids) state.age = document.getElementById('age').value.trim(); state.step = 3; render(); };
    return;
  }

  if (state.step === 3) {
    const goals = state.profile === 'kids' ? kidsGoals : adultGoals;
    flowTitle.textContent = 'OBJETIVO';
    stage.innerHTML = `<div class="question"><h3>O QUE VOCÊ BUSCA?</h3><p>Escolha o objetivo principal.</p><div class="options">${goals.map(goal => choice(goal,goal)).join('')}</div><div class="actions"><button class="back" id="back">VOLTAR</button><button class="next" id="next" ${state.goal ? '' : 'disabled'}>CONTINUAR</button></div></div>`;
    bindChoice('goal');
    document.getElementById('back').onclick = () => { state.step = 2; render(); };
    document.getElementById('next').onclick = () => { state.step = 4; render(); };
    return;
  }

  if (state.step === 4) {
    flowTitle.textContent = 'PERÍODO';
    stage.innerHTML = `<div class="question"><h3>QUANDO FICA MELHOR?</h3><p>A equipe confirma o encaixe pelo WhatsApp.</p><div class="options">${periods.map(period => choice(period,period)).join('')}</div><div class="actions"><button class="back" id="back">VOLTAR</button><button class="next" id="next" ${state.period ? '' : 'disabled'}>CONTINUAR</button></div></div>`;
    bindChoice('period');
    document.getElementById('back').onclick = () => { state.step = 3; render(); };
    document.getElementById('next').onclick = () => { state.step = 5; render(); };
    return;
  }

  flowTitle.textContent = 'CONTATO';
  stage.innerHTML = `<div class="question"><h3>FALTA SÓ VOCÊ.</h3><p>Deixe seu contato para continuar com a Legado.</p><div class="form-row"><div class="field"><label>${state.profile === 'kids' ? 'NOME DO RESPONSÁVEL' : 'SEU NOME'}</label><input id="name" autocomplete="name" placeholder="Como podemos te chamar?" value="${esc(state.name)}"></div><div class="field"><label>WHATSAPP</label><input id="phone" inputmode="tel" autocomplete="tel" placeholder="(22) 99999-9999" value="${esc(state.phone)}"></div></div><div class="actions"><button class="back" id="back">VOLTAR</button><button class="next" id="finish">CONTINUAR</button></div></div>`;
  document.getElementById('back').onclick = () => { state.step = 4; render(); };
  document.getElementById('finish').onclick = () => {
    state.name = document.getElementById('name').value.trim();
    state.phone = document.getElementById('phone').value.trim();
    if (!state.name || !state.phone) return alert('Preencha nome e WhatsApp para continuar.');
    renderPreviews();
    setView('equipe');
  };
}

function summaryData() {
  const profile = state.profile === 'kids' ? `Kids${state.age ? ` • ${esc(state.age)} anos` : ''}` : state.profile === 'adult' ? 'Adulto' : '—';
  return { profile, modality: state.modality || '—', goal: state.goal || '—', period: state.period || '—' };
}

function summaryGrid() {
  const data = summaryData();
  return `<div class="preview-grid"><div class="preview-item"><small>PERFIL</small><strong>${data.profile}</strong></div><div class="preview-item"><small>MODALIDADE</small><strong>${esc(data.modality)}</strong></div><div class="preview-item"><small>OBJETIVO</small><strong>${esc(data.goal)}</strong></div><div class="preview-item"><small>PERÍODO</small><strong>${esc(data.period)}</strong></div></div>`;
}

function whatsappLink() {
  const data = summaryData();
  const text = `Olá! Meu nome é ${state.name}. Tenho interesse em uma aula experimental na Legado. Perfil: ${data.profile}. Modalidade: ${state.modality}. Objetivo: ${state.goal}. Melhor período: ${state.period}.`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function renderPreviews() {
  if (!state.profile) {
    const empty = `<div class="preview-grid"><div class="preview-item"><small>PERFIL</small><strong>—</strong></div><div class="preview-item"><small>MODALIDADE</small><strong>—</strong></div><div class="preview-item"><small>OBJETIVO</small><strong>—</strong></div><div class="preview-item"><small>PERÍODO</small><strong>—</strong></div></div>`;
    leadPreview.innerHTML = empty;
    teamPreview.innerHTML = empty;
    return;
  }
  leadPreview.innerHTML = `<div class="preview-name">${esc(state.name || 'SEU INTERESSE')}</div><div class="preview-phone">${esc(state.phone || 'Aula experimental')}</div>${summaryGrid()}${state.name && state.phone ? `<a class="wa-button" href="${whatsappLink()}" target="_blank" rel="noopener">CONTINUAR NO WHATSAPP</a>` : ''}`;
  teamPreview.innerHTML = `<div class="lead-topline"><span>NOVO INTERESSE</span><span class="live-dot">●</span></div><div class="preview-name">${esc(state.name || 'INTERESSADO')}</div><div class="preview-phone">${esc(state.phone || 'Aguardando contato')}</div>${summaryGrid()}${state.name && state.phone ? `<a class="wa-button" href="${whatsappLink()}" target="_blank" rel="noopener">ABRIR CONVERSA</a>` : ''}`;
}

function render() { renderProgress(); renderStage(); renderPreviews(); }
render();
