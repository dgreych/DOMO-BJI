const WA_NUMBER = '5522998217560';

const messages = {
  general: 'Olá! Vim pelo site da Beleza Leal e gostaria de conversar com a equipe.',
  weight: 'Olá! Vim pelo site da Beleza Leal. Tenho interesse em emagrecimento com acompanhamento e gostaria de entender como funciona.',
  self: 'Olá! Vim pelo site da Beleza Leal. Já uso Mounjaro por conta própria e gostaria de entender como posso ter acompanhamento e orientação para seguir com mais segurança.',
  method: 'Olá! Vim pelo site da Beleza Leal e gostaria de conhecer melhor o Método BL.',
  body: 'Olá! Vim pelo site da Beleza Leal e gostaria de conversar sobre cuidados corporais durante a minha jornada.'
};

const intentData = {
  weight: {
    kicker: 'EMAGRECIMENTO COM ACOMPANHAMENTO',
    title: 'Um plano que acompanha a pessoa, não só a balança.',
    text: 'A jornada pode reunir avaliação, estratégia alimentar, acompanhamento médico quando indicado, leitura de evolução e ajustes ao longo do processo.',
    points: ['plano individual', 'acompanhamento próximo', 'hábitos e rotina', 'evolução acompanhada'],
    wa: 'weight'
  },
  self: {
    kicker: 'JÁ USA MOUNJARO POR CONTA PRÓPRIA?',
    title: 'Você não precisa continuar conduzindo tudo no escuro.',
    text: 'A conversa pode começar exatamente da realidade que já existe hoje. Sem julgamento, com atenção à rotina, evolução, sintomas e à necessidade de avaliação profissional adequada.',
    points: ['sem julgamento', 'organização do cuidado', 'atenção a sinais', 'limites profissionais claros'],
    wa: 'self'
  },
  method: {
    kicker: 'MÉTODO BL',
    title: 'Uma jornada construída para não depender de tentativa solta.',
    text: 'O Método BL reúne estratégia personalizada, educação de hábitos, acompanhamento contínuo e suporte ao longo do processo de emagrecimento.',
    points: ['estratégia personalizada', 'educação de hábitos', 'acompanhamento contínuo', 'linha BL como apoio'],
    wa: 'method'
  },
  body: {
    kicker: 'CUIDADOS CORPORAIS',
    title: 'O corpo muda durante a jornada. O cuidado pode acompanhar.',
    text: 'Flacidez, gordura localizada, pós-cirúrgico e outros incômodos precisam ser avaliados dentro do momento de cada pessoa antes da escolha de qualquer protocolo.',
    points: ['flacidez', 'gordura localizada', 'pós-cirúrgico', 'avaliação individual'],
    wa: 'body'
  }
};

function waUrl(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

function openWhatsApp(kind = 'general') {
  window.open(waUrl(messages[kind] || messages.general), '_blank', 'noopener');
}

document.querySelectorAll('[data-wa]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    openWhatsApp(link.dataset.wa || 'general');
  });
});

const panel = document.getElementById('intentPanel');
const panelKicker = document.getElementById('panelKicker');
const panelTitle = document.getElementById('panelTitle');
const panelText = document.getElementById('panelText');
const panelPoints = document.getElementById('panelPoints');
const panelCta = document.getElementById('panelCta');

function setIntent(key, animate = true) {
  const data = intentData[key];
  if (!data) return;

  document.querySelectorAll('.intent').forEach(button => {
    const active = button.dataset.intent === key;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });

  const apply = () => {
    panelKicker.textContent = data.kicker;
    panelTitle.textContent = data.title;
    panelText.textContent = data.text;
    panelPoints.innerHTML = data.points.map(point => `<span>${point}</span>`).join('');
    panelCta.dataset.waKind = data.wa;
  };

  if (!animate || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    apply();
    return;
  }

  panel.animate([
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: .45, transform: 'translateY(7px)' },
    { opacity: 1, transform: 'translateY(0)' }
  ], { duration: 320, easing: 'cubic-bezier(.2,.7,.2,1)' });
  apply();
}

document.querySelectorAll('.intent').forEach(button => {
  button.addEventListener('click', () => setIntent(button.dataset.intent));
});

panelCta.addEventListener('click', event => {
  event.preventDefault();
  openWhatsApp(panelCta.dataset.waKind || 'general');
});

setIntent('weight', false);

document.querySelectorAll('[data-jump-intent]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.jumpIntent;
    setIntent(key, false);
    document.getElementById('emagrecimento').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const form = document.getElementById('contactForm');
const nameInput = document.getElementById('leadName');
const interestInput = document.getElementById('leadInterest');
const noteInput = document.getElementById('leadNote');

function chooseInterest(label) {
  const option = [...interestInput.options].find(item => item.value === label || item.textContent === label);
  if (option) interestInput.value = option.value;
  document.getElementById('contato').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => nameInput.focus({ preventScroll: true }), 450);
}

document.querySelectorAll('[data-interest]').forEach(button => {
  button.addEventListener('click', () => chooseInterest(button.dataset.interest));
});

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = nameInput.value.trim();
  if (!name) {
    nameInput.focus();
    return;
  }
  const interest = interestInput.value;
  const note = noteInput.value.trim();
  let text = `Olá! Meu nome é ${name}. Vim pelo site da Beleza Leal e tenho interesse em ${interest}.`;
  if (note) text += `\n\nQueria acrescentar: ${note}`;
  text += '\n\nGostaria de entender como funciona e qual seria o melhor próximo passo.';
  window.open(waUrl(text), '_blank', 'noopener');
});

const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');

function closeMenu() {
  mobileNav.classList.remove('open');
  mobileNav.setAttribute('aria-hidden', 'true');
  menuToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  const bars = menuToggle.querySelectorAll('span');
  bars[0].style.transform = '';
  bars[1].style.transform = '';
}

menuToggle.addEventListener('click', () => {
  const opening = !mobileNav.classList.contains('open');
  if (!opening) return closeMenu();
  mobileNav.classList.add('open');
  mobileNav.setAttribute('aria-hidden', 'false');
  menuToggle.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  const bars = menuToggle.querySelectorAll('span');
  bars[0].style.transform = 'translateY(4px) rotate(45deg)';
  bars[1].style.transform = 'translateY(-4px) rotate(-45deg)';
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const progress = document.getElementById('scrollProgress');
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? Math.min(100, Math.max(0, window.scrollY / max * 100)) : 0}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -5% 0px' });
reveals.forEach(element => observer.observe(element));

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && window.matchMedia('(hover:hover) and (pointer:fine)').matches) {
  const hero = document.querySelector('.hero');
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 100;
    const y = (event.clientY - rect.top) / rect.height * 100;
    hero.style.setProperty('--mx', `${x}%`);
    hero.style.setProperty('--my', `${y}%`);
  });
}

const methodSection = document.querySelector('.method-section');
if (methodSection) {
  const proof = document.createElement('section');
  proof.className = 'bl-proof reveal';
  proof.innerHTML = `
    <div class="bl-proof-copy">
      <p class="kicker">MATERIAL REAL DA CLÍNICA</p>
      <h2>O Método BL já existe fora da tela.</h2>
      <p>Estratégia de emagrecimento, acompanhamento próximo e uma linha própria de produtos aparecem no material que a Beleza Leal já utiliza hoje. Aqui o site organiza isso sem transformar tudo em catálogo.</p>
      <div class="bl-proof-points"><span>Estratégia personalizada</span><span>Educação de hábitos</span><span>Acompanhamento contínuo</span><span>Linha BL</span></div>
      <a class="btn btn-outline" href="#contato" id="proofCta">Quero saber como funciona <svg><use href="#i-arrow"/></svg></a>
    </div>
    <figure class="bl-proof-media">
      <img src="assets/bl-exclusivo.webp" alt="Material original do Tratamento BL Exclusivo da Beleza Leal" loading="lazy" decoding="async">
      <figcaption>Material original da Beleza Leal, exibido inteiro e sem recorte destrutivo.</figcaption>
    </figure>`;
  methodSection.insertAdjacentElement('afterend', proof);

  const style = document.createElement('style');
  style.textContent = `
    .bl-proof{max-width:1240px;margin:0 auto;padding:20px var(--pad) 120px;display:grid;grid-template-columns:minmax(0,1fr) minmax(320px,460px);gap:clamp(38px,7vw,90px);align-items:center}.bl-proof-copy h2{margin:0;font:500 clamp(48px,5vw,76px)/.94 "Cormorant Garamond",serif;letter-spacing:-.05em}.bl-proof-copy>p:not(.kicker){margin:22px 0 0;max-width:620px;font-size:13px;line-height:1.75;color:var(--muted)}.bl-proof-points{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0}.bl-proof-points span{padding:9px 11px;border:1px solid var(--line);border-radius:999px;font-size:9px;font-weight:700;color:var(--muted)}.bl-proof-media{margin:0;padding:12px;border-radius:24px;background:#fff;border:1px solid rgba(63,40,32,.12);box-shadow:0 24px 60px rgba(71,45,31,.1)}.bl-proof-media img{display:block;width:100%;height:auto;border-radius:14px}.bl-proof-media figcaption{padding:10px 4px 1px;font-size:8px;line-height:1.45;color:var(--muted);text-align:center}@media(max-width:820px){.bl-proof{grid-template-columns:1fr;padding:10px 18px 78px}.bl-proof-media{max-width:520px;margin:auto}.bl-proof-copy h2{font-size:clamp(44px,12vw,58px)}}`;
  document.head.appendChild(style);

  proof.querySelector('#proofCta').addEventListener('click', event => {
    event.preventDefault();
    openWhatsApp('method');
  });

  requestAnimationFrame(() => observer.observe(proof));
}
