const PHONE = '5522999380312';

function clean(value) {
  return value.trim().replace(/\s+/g, ' ');
}

export function buildFerriniWhatsappUrl({ goal, experience, period } = {}) {
  if (![goal, experience, period].every((value) => typeof value === 'string' && value.trim())) {
    throw new TypeError('Informe objetivo, experiência e período.');
  }

  const message = [
    'Olá, equipe Ferrini! Quero conversar sobre treino.',
    `Objetivo: ${clean(goal)}`,
    `Experiência: ${clean(experience)}`,
    `Melhor período: ${clean(period)}`,
    'Podem me orientar sobre as opções?',
  ].join('\n');

  const url = new URL(`https://wa.me/${PHONE}`);
  url.searchParams.set('text', message);
  return url;
}
