const WA_NUMBER = '5522998217560';

const waMessages = {
  general: 'Olá! Vim pelo site da Beleza Leal e gostaria de conversar com a equipe.',
  weight: 'Olá! Vim pelo site da Beleza Leal. Tenho interesse em emagrecimento com acompanhamento e gostaria de entender qual caminho faz sentido para mim.',
  self: 'Olá! Vim pelo site da Beleza Leal. Já estou usando Mounjaro por conta própria e quero entender como posso ter acompanhamento para seguir com mais segurança.',
  method: 'Olá! Vim pelo site da Beleza Leal e gostaria de conhecer melhor o Método BL e como funciona o acompanhamento.',
  body: 'Olá! Vim pelo site da Beleza Leal e gostaria de conversar sobre cuidados corporais durante a minha jornada.',
  products: 'Olá! Vim pelo site da Beleza Leal e gostaria de conhecer melhor a linha de produtos BL.'
};

const pathData = {
  weight: {
    kicker: 'EMAGRECIMENTO COM ACOMPANHAMENTO',
    title: 'Um plano que olha para você inteira.',
    body: 'Rotina, alimentação, comportamento, composição corporal e acompanhamento próximo. Quando existe indicação médica, o tratamento entra como parte de uma estratégia maior, nunca como a estratégia inteira.',
    points: ['estratégia individual', 'acompanhamento próximo', 'hábitos e rotina', 'evolução acompanhada'],
    wa: 'weight'
  },
  self: {
    kicker: 'JÁ COMEÇOU POR CONTA PRÓPRIA?',
    title: 'O próximo passo não precisa ser continuar no escuro.',
    body: 'Se você já usa Mounjaro sem acompanhamento, a conversa começa pelo que já está acontecendo. Sem bronca. A equipe pode ajudar a organizar o cuidado e orientar a busca por avaliação adequada. Ajuste de dose, indicação ou interrupção devem ser tratados com profissional habilitado.',
    points: ['sem julgamento', 'mais contexto', 'atenção a sinais de alerta', 'orientação responsável'],
    wa: 'self'
  },
  method: {
    kicker: 'MÉTODO BL',
    title: 'Mais que emagrecer. Aprender a manter.',
    body: 'O Método BL reúne estratégia personalizada, educação para hábitos, acompanhamento contínuo e suporte ao longo da jornada. O objetivo é construir um caminho que não dependa apenas de motivação ou de uma única ferramenta.',
    points: ['plano personalizado', 'acompanhamento contínuo', 'educação de hábitos', 'linha BL como apoio'],
    wa: 'method'
  },
  body: {
    kicker: 'CUIDADOS CORPORAIS',
    title: 'O corpo muda durante a jornada. O cuidado pode acompanhar.',
    body: 'Flacidez, gordura localizada e outros incômodos podem aparecer ou ganhar importância em fases diferentes. A proposta é entender o que realmente faz sentido para o seu momento antes de escolher qualquer tratamento.',
    points: ['flacidez', 'gordura localizada', 'pós-cirúrgico', 'avaliação individual'],
    wa: 'body'
  }
};

const waUrl = message => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
const openWhatsApp = (kind = 'general') => window.open(waUrl(waMessages[kind] || waMessages.general), '_blank', 'noopener');

document.querySelectorAll('[data-wa]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    openWhatsApp(link.dataset.wa || 'general');
  });
});

const pathPanel = document.getElementById('pathPanel');
const panelKicker = document.getElementById('panelKicker');
const panelTitle = document.getElementById('panelTitle');
const panelBody = document.getElementById('panelBody');
const panelPoints = document.getElementById('panelPoints');
const panelCta = document.getElementById('panelCta');

function setPath(key, animate = true) {
  const data = pathData[key];
  if (!data) return;
  document.querySelectorAll('.path-card').forEach(card => card.classList.toggle('active', card.dataset.path === key));
  const apply = () => {
    panelKicker.textContent = data.kicker;
    panelTitle.textContent = data.title;
    panelBody.textContent = data.body;
    panelPoints.innerHTML = data.points.map(point => `<span>${point}</span>`).join('');
    panelCta.dataset.wa = data.wa;
  };
  if (animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    pathPanel.animate([
      { opacity: 1, transform: 'translateY(0)' },
      { opacity: .45, transform: 'translateY(6px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 330, easing: 'cubic-bezier(.2,.7,.2,1)' });
  }
  apply();
}

document.querySelectorAll('.path-card').forEach(card => {
  card.addEventListener('click', () => setPath(card.dataset.path));
  card.addEventListener('pointermove', event => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    card.style.setProperty('--my', `${event.clientY - rect.top}px`);
  });
});
setPath('weight', false);

const form = document.getElementById('contactForm');
const leadName = document.getElementById('leadName');
const leadInterest = document.getElementById('leadInterest');
const leadNote = document.getElementById('leadNote');

function chooseInterest(value) {
  if ([...leadInterest.options].some(option => option.value === value)) leadInterest.value = value;
  document.getElementById('contato').scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => leadName.focus({ preventScroll: true }), 520);
}

document.querySelectorAll('[data-interest]').forEach(button => button.addEventListener('click', () => chooseInterest(button.dataset.interest)));

form.addEventListener('submit', event => {
  event.preventDefault();
  const name = leadName.value.trim();
  const interest = leadInterest.value;
  const note = leadNote.value.trim();
  if (!name) return leadName.focus();
  let text = `Olá! Meu nome é ${name}. Vim pelo site da Beleza Leal e tenho interesse em: ${interest}.`;
  if (note) text += `\n\nQueria acrescentar: ${note}`;
  text += '\n\nGostaria de entender como funciona e qual seria o melhor próximo passo.';
  window.open(waUrl(text), '_blank', 'noopener');
});

const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
  menuBtn.querySelectorAll('span').forEach(span => span.style.transform = '');
}
menuBtn.addEventListener('click', () => {
  if (mobileMenu.classList.contains('open')) return closeMenu();
  mobileMenu.classList.add('open');
  mobileMenu.setAttribute('aria-hidden', 'false');
  menuBtn.setAttribute('aria-expanded', 'true');
  document.body.classList.add('menu-open');
  const bars = menuBtn.querySelectorAll('span');
  bars[0].style.transform = 'translateY(3.5px) rotate(45deg)';
  bars[1].style.transform = 'translateY(-3.5px) rotate(-45deg)';
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

const topbar = document.getElementById('topbar');
const scrollProgress = document.getElementById('scrollProgress');
function onScroll() {
  topbar.classList.toggle('scrolled', window.scrollY > 40);
  const max = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = `${(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0) * 100}%`;
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
reveals.forEach(element => revealObserver.observe(element));

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

if (!reducedMotion && canHover) {
  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const rect = button.getBoundingClientRect();
      const x = (event.clientX - rect.left - rect.width / 2) * .11;
      const y = (event.clientY - rect.top - rect.height / 2) * .11;
      button.style.transform = `translate(${x}px,${y}px)`;
    });
    button.addEventListener('pointerleave', () => button.style.transform = '');
  });

  const heroVisual = document.getElementById('heroVisual');
  const heroPhoto = heroVisual?.querySelector('.hero-photo');
  heroVisual?.addEventListener('pointermove', event => {
    const rect = heroVisual.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    heroPhoto.style.transform = `rotateY(${x * 4}deg) rotateX(${y * -4}deg)`;
  });
  heroVisual?.addEventListener('pointerleave', () => { heroPhoto.style.transform = ''; });
}

function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || reducedMotion) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let width = 0, height = 0, dpr = 1, raf = 0;
  const pointer = { x: .72, y: .34 };
  const particles = Array.from({ length: 28 }, (_, i) => ({
    x: ((i * 37) % 101) / 101,
    y: ((i * 61) % 97) / 97,
    r: 1 + (i % 4) * .55,
    s: .00009 + (i % 5) * .000025,
    p: i * .7
  }));
  function resize() {
    const rect = hero.getBoundingClientRect();
    width = Math.max(1, rect.width); height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  hero.addEventListener('pointermove', event => {
    const rect = hero.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
  }, { passive: true });
  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const gx = width * pointer.x, gy = height * pointer.y;
    const glow = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.min(width, height) * .48);
    glow.addColorStop(0, 'rgba(189,139,60,.055)'); glow.addColorStop(1, 'rgba(189,139,60,0)');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    particles.forEach((particle, index) => {
      const wobble = Math.sin(time * particle.s + particle.p);
      const x = width * (particle.x + wobble * .012);
      const y = height * (particle.y + Math.cos(time * particle.s * .8 + particle.p) * .014);
      ctx.beginPath(); ctx.arc(x, y, particle.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(185,133,50,${.08 + (index % 4) * .025})`; ctx.fill();
    });
    [.31, .39].forEach((radius, index) => {
      ctx.beginPath(); ctx.arc(width * .78, height * .44, Math.min(width, height) * radius, 0, Math.PI * 2);
      ctx.strokeStyle = index ? 'rgba(185,133,50,.045)' : 'rgba(185,133,50,.08)'; ctx.lineWidth = 1; ctx.stroke();
    });
    raf = requestAnimationFrame(draw);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });
  raf = requestAnimationFrame(draw);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf); else raf = requestAnimationFrame(draw);
  });
}
initHeroCanvas();

document.getElementById('year').textContent = new Date().getFullYear();
