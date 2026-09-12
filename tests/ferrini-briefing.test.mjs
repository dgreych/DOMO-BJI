import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const modulePath = new URL('../demos/ferrini/assets/briefing.mjs', import.meta.url);

test('o módulo de briefing da Ferrini existe', () => {
  assert.equal(existsSync(modulePath), true);
});

test('expõe o construtor de URL do WhatsApp', async () => {
  const mod = await import(modulePath);
  assert.equal(typeof mod.buildFerriniWhatsappUrl, 'function');
});

test('recusa briefing incompleto antes de montar o WhatsApp', async () => {
  const { buildFerriniWhatsappUrl } = await import(modulePath);
  assert.throws(
    () => buildFerriniWhatsappUrl({ goal: 'Condicionamento', experience: '', period: 'Noite' }),
    /objetivo, experiência e período/i,
  );
});

test('monta URL oficial da Ferrini com contexto revisável', async () => {
  const { buildFerriniWhatsappUrl } = await import(modulePath);
  const url = buildFerriniWhatsappUrl({
    goal: 'Condicionamento',
    experience: 'Estou começando',
    period: 'Noite',
  });
  assert.equal(url.origin, 'https://wa.me');
  assert.equal(url.pathname, '/5522999380312');
  assert.match(url.searchParams.get('text'), /Objetivo: Condicionamento/);
  assert.match(url.searchParams.get('text'), /Experiência: Estou começando/);
  assert.match(url.searchParams.get('text'), /Melhor período: Noite/);
  assert.doesNotMatch(url.searchParams.get('text'), /grátis|preço|mensalidade|resultado garantido/i);
});
