const WHATSAPP_NUMBER = '5522998217560';

const form = document.querySelector('#triage-form');
const steps = [...document.querySelectorAll('.form-step')];
const choiceButtons = [...document.querySelectorAll('[data-choice]')];
const stepOneNext = document.querySelector('#step1-next');
const contextField = document.querySelector('#contexto');
const charCount = document.querySelector('#char-count');
const messageReview = document.querySelector('#message-review');
const whatsappCta = document.querySelector('#whatsapp-cta');
const progressCurrent = document.querySelector('#progress-current');
const progressBar = document.querySelector('#progress-bar');

let selectedIntent = '';
let currentStep = 1;

const medicationIntent = 'Já uso tirzepatida e quero conversar sobre acompanhamento';

function buildMessage(intent, context = '') {
  const trimmedContext = context.trim();

  if (intent === medicationIntent) {
    const base = 'Olá! Vim pelo site da Beleza Leal. Já utilizo tirzepatida e gostaria de conversar com a equipe sobre acompanhamento e próximos passos. Não estou buscando orientação de dose ou compra pelo site.';
    return trimmedContext ? `${base} Contexto adicional: ${trimmedContext}` : base;
  }

  const base = `Olá! Vim pelo site da Beleza Leal e gostaria de conversar sobre ${intent.toLowerCase()}. Quero entender qual pode ser o próximo passo para mim.`;
  return trimmedContext ? `${base} Contexto adicional: ${trimmedContext}` : base;
}

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function updateReview() {
  const message = buildMessage(selectedIntent, contextField.value);
  messageReview.value = message;
  whatsappCta.href = whatsappUrl(message);
}

function showStep(stepNumber) {
  currentStep = stepNumber;
  steps.forEach((step) => {
    const active = Number(step.dataset.step) === stepNumber;
    step.hidden = !active;
    step.classList.toggle('is-active', active);
  });
  progressCurrent.textContent = String(stepNumber);
  progressBar.style.width = `${(stepNumber / 3) * 100}%`;

  const activeStep = steps.find((step) => Number(step.dataset.step) === stepNumber);
  activeStep?.querySelector('h3')?.focus?.({ preventScroll: true });
}

function chooseIntent(value, { jump = false } = {}) {
  selectedIntent = value;
  choiceButtons.forEach((button) => {
    const active = button.dataset.choice === value;
    button.classList.toggle('is-selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  stepOneNext.disabled = false;

  if (jump) {
    document.querySelector('#triagem')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
    showStep(2);
  }
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

choiceButtons.forEach((button) => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => chooseIntent(button.dataset.choice));
});

stepOneNext.addEventListener('click', () => {
  if (!selectedIntent) return;
  showStep(2);
});

form.addEventListener('click', (event) => {
  const back = event.target.closest('[data-back]');
  const next = event.target.closest('[data-next]');

  if (back) showStep(Number(back.dataset.back));
  if (next) {
    updateReview();
    showStep(Number(next.dataset.next));
  }
});

contextField.addEventListener('input', () => {
  charCount.textContent = `${contextField.value.length} / 280`;
});

messageReview.addEventListener('input', () => {
  whatsappCta.href = whatsappUrl(messageReview.value.trim());
});

document.querySelectorAll('[data-intent]').forEach((button) => {
  button.addEventListener('click', () => chooseIntent(button.dataset.intent, { jump: true }));
});

const revealNodes = [...document.querySelectorAll('.reveal')];
if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
  revealNodes.forEach((node) => node.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  revealNodes.forEach((node) => observer.observe(node));
}

progressBar.style.width = '33.333%';
