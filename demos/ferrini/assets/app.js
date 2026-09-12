import { buildFerriniWhatsappUrl } from './briefing.mjs';

const form = document.querySelector('#journey-form');
const cta = document.querySelector('#primary-cta');
const summary = document.querySelector('#summary-text');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function readJourney() {
  const data = new FormData(form);
  return {
    goal: data.get('goal')?.toString() ?? '',
    experience: data.get('experience')?.toString() ?? '',
    period: data.get('period')?.toString() ?? '',
  };
}

function updateJourney() {
  const journey = readJourney();
  const selected = [journey.goal, journey.experience, journey.period].filter(Boolean).length;

  form.querySelectorAll('[data-step]').forEach((step) => {
    const name = step.dataset.step;
    step.classList.toggle('is-complete', Boolean(journey[name]));
  });

  if (selected < 3) {
    cta.removeAttribute('href');
    cta.setAttribute('aria-disabled', 'true');
    cta.classList.add('is-disabled');
    summary.textContent = `${selected}/3 escolhas feitas. Complete objetivo, experiência e período.`;
    return;
  }

  const url = buildFerriniWhatsappUrl(journey);
  cta.href = url.toString();
  cta.removeAttribute('aria-disabled');
  cta.classList.remove('is-disabled');
  summary.textContent = `${journey.goal} · ${journey.experience} · preferência: ${journey.period}.`;
}

form.addEventListener('change', updateJourney);

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const selector = link.getAttribute('href');
    if (!selector || selector === '#') return;
    const target = document.querySelector(selector);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });
});

updateJourney();
