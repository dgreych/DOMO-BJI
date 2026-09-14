const runtimeScript = document.currentScript;
const mobileStylesheet = document.createElement('link');
mobileStylesheet.rel = 'stylesheet';
mobileStylesheet.href = new URL('./mobile.css', runtimeScript?.src || document.baseURI).href;
document.head.append(mobileStylesheet);

const tabs = [...document.querySelectorAll('.platform-tab')];
const panels = [...document.querySelectorAll('.platform-panel')];
const toast = document.querySelector('[data-toast]');

function activatePlatform(platform, { focus = false } = {}) {
  tabs.forEach((tab) => {
    const active = tab.dataset.platform === platform;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });

  panels.forEach((panel) => {
    const active = panel.dataset.platform === platform;
    panel.classList.toggle('is-active', active);
    panel.hidden = !active;
  });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activatePlatform(tab.dataset.platform));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = tabs.length - 1;
    else if (['ArrowRight', 'ArrowDown'].includes(event.key)) nextIndex = (index + 1) % tabs.length;
    else nextIndex = (index - 1 + tabs.length) % tabs.length;
    activatePlatform(tabs[nextIndex].dataset.platform, { focus: true });
  });
});

let toastTimer;
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1800);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const area = document.createElement('textarea');
  area.value = text;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.append(area);
  area.select();
  document.execCommand('copy');
  area.remove();
}

document.querySelectorAll('[data-copy-target]').forEach((button) => {
  button.addEventListener('click', async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;
    try {
      await copyText(target.textContent.trim());
      const original = button.textContent;
      button.textContent = 'Copiado ✓';
      showToast('Comando copiado. Agora cole no terminal.');
      setTimeout(() => { button.textContent = original; }, 1600);
    } catch {
      showToast('Não consegui copiar automaticamente. Selecione o comando manualmente.');
    }
  });
});

const whatsappMessages = {
  bunnyfy: 'Olá! Vi a BunnyFy na página do SHOGUN e quero conhecer os planos de assinatura para os serviços opcionais da API.',
  hosting: 'Olá! Quero deixar meu SHOGUN online 24/7 sem precisar manter computador, celular ou terminal ligado. Quero saber sobre a hospedagem gerenciada.'
};

document.querySelectorAll('[data-whatsapp-context]').forEach((link) => {
  const context = link.dataset.whatsappContext;
  const message = whatsappMessages[context];
  if (!message) return;
  link.href = `https://wa.me/5522999686677?text=${encodeURIComponent(message)}`;
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

const header = document.querySelector('[data-header]');
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (header) header.style.borderColor = current > 24 ? 'rgba(255,255,255,.13)' : 'rgba(255,255,255,.08)';
  lastScroll = current;
}, { passive: true });

activatePlatform('termux');