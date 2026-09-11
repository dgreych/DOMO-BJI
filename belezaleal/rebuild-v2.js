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
