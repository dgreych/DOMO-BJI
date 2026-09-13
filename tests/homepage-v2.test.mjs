import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const css = await readFile(new URL('assets/site.css', root), 'utf8');
const js = await readFile(new URL('assets/site.js', root), 'utf8');

test('homepage v2 presents the operating-outcome proposition', () => {
  assert.match(html, /Do improviso ao fluxo/);
  assert.match(html, /Escolha o que precisa[\s\S]{0,30}funcionar melhor/);
  assert.match(html, /Exemplo conceitual/);
  assert.doesNotMatch(html, /Pendências[\s\S]{0,80}>08</);
  assert.doesNotMatch(html, /Atendimentos[\s\S]{0,80}>14</);
});

test('six commercial journeys have stable proof anchors', () => {
  for (const id of ['agenda', 'orcamento', 'briefing', 'portfolio', 'triagem', 'automacao']) {
    assert.match(html, new RegExp(`id=["']${id}["']`));
    assert.match(html, new RegExp(`data-flow=["']${id}["']`));
  }
});

test('interactive operating canvas is accessible and progressive', () => {
  assert.match(html, /role="tablist"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /data-canvas-title/);
  assert.match(js, /flowData/);
  assert.match(js, /aria-selected/);
  assert.match(js, /history\.replaceState/);
});

test('commercial calls to action use the verified WhatsApp channel', () => {
  assert.match(html, /https:\/\/wa\.me\/5522999686677/);
  assert.match(js, /5522999686677/);
  assert.match(js, /Quero explicar como funciona hoje/);
});

test('metadata and motion safeguards are present', () => {
  assert.match(html, /domo-social-card-v2\.svg/);
  assert.match(html, /application\/ld\+json/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
});

test('commercial denylist identities never appear on the homepage', () => {
  for (const forbidden of ['vidraçaria lopes', 'oficina do paple', 'vet center']) {
    assert.equal(html.toLowerCase().includes(forbidden), false);
    assert.equal(js.toLowerCase().includes(forbidden), false);
  }
});
