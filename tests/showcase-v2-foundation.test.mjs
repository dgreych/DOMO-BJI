import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = (path) => readFileSync(path, 'utf8');
const gitObject = (path) => execFileSync('git', ['rev-parse', `HEAD:${path}`], { encoding: 'utf8' }).trim();

const BASELINE = Object.freeze({
  'index.html': '1d339b3dde52bc9fd721f0c7e43b9066193a679a',
  legado: '9aaf24b766f0f82a49b797a8a3e9d54e74fd6f4c',
  fitaroni: '086f620e882c539104e358107f0b7414166a3530',
  demos: '9b66b8376dc879962d74a5ebfca1df582fcbb199'
});

const FOUNDATION = [
  'showcase-v2/index.html',
  'showcase-v2/assets/tokens.css',
  'showcase-v2/assets/showcase.css',
  'showcase-v2/assets/showcase.js',
  'showcase-v2/README.md'
];

test('preserva homepage V1 e árvores públicas existentes byte a byte', () => {
  for (const [path, expected] of Object.entries(BASELINE)) {
    assert.equal(gitObject(path), expected, `${path} foi alterado`);
  }
});

test('a fundação V2 existe isolada em /showcase-v2/', () => {
  for (const path of FOUNDATION) assert.ok(existsSync(path), `faltando ${path}`);
});

test('SEO e OG têm arquitetura completa e URL canônica própria', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /<html[^>]+lang="pt-BR"/i);
  assert.match(html, /<meta[^>]+name="viewport"/i);
  assert.match(html, /<meta[^>]+name="description"/i);
  assert.match(html, /rel="canonical"[^>]+\/showcase-v2\//i);
  for (const property of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
    assert.match(html, new RegExp(`property="${property}"`, 'i'), `faltando ${property}`);
  }
  assert.match(html, /twitter:card/i);
  assert.match(html, /application\/ld\+json/i);
});

test('portfólio diferencia prova, demonstração, conceito e experimento sem fingir cliente', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /data-proof-kind="demonstracao"/i);
  assert.match(html, /data-proof-kind="experimento"/i);
  assert.match(html, /Jair Neto/i);
  assert.match(html, /Fitaroni/i);
  assert.match(html, /Legado/i);
  assert.doesNotMatch(html, />\s*CLIENTE\s*</i);
  assert.doesNotMatch(html, />\s*CASE CONTRATADO\s*</i);
});

test('capacidade é organizada por resultado e cobre a oferta pedida', () => {
  const html = read('showcase-v2/index.html').toLowerCase();
  for (const outcome of ['agenda', 'orçamento', 'briefing', 'portfólio', 'campanha', 'aula experimental', 'fluxos sob medida']) {
    assert.ok(html.includes(outcome), `resultado ausente: ${outcome}`);
  }
  assert.ok(!/fábrica de frontend/i.test(html), 'posicionamento proibido encontrado');
});

test('CTA sustenta PORTFOLIO_FIRST_FREE_DEMO_OFFER e possui trilha de contexto', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /demo gratuita/i);
  assert.match(html, /data-cta="primary"/i);
  assert.match(html, /https:\/\/wa\.me\/5522999686677/i);
  assert.match(html, /data-wa-context=/i);
});

test('tokens, browser frames, slides, motion e mobile são componentes verificáveis', () => {
  const tokens = read('showcase-v2/assets/tokens.css');
  const css = read('showcase-v2/assets/showcase.css');
  const js = read('showcase-v2/assets/showcase.js');
  const html = read('showcase-v2/index.html');

  for (const token of ['--brand-ink', '--brand-paper', '--brand-accent', '--space-1', '--radius-card', '--motion-fast']) {
    assert.ok(tokens.includes(token), `token ausente: ${token}`);
  }
  assert.match(html, /class="[^"]*browser-frame/i);
  assert.match(html, /data-slide/i);
  assert.match(css, /@media\s*\([^)]*max-width/i);
  assert.match(css, /prefers-reduced-motion/i);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /data-slide/);
});

test('não referencia assets F05 V2 enquanto o handoff ainda não existir', () => {
  const bundle = FOUNDATION.filter((path) => path.endsWith('.html') || path.endsWith('.css') || path.endsWith('.js'))
    .map(read)
    .join('\n');
  assert.doesNotMatch(bundle, /assets\/brand\/v4\/domo/i);
});
