import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = (path) => readFileSync(path, 'utf8');
const gitObject = (path) => execFileSync('git', ['rev-parse', `HEAD:${path}`], { encoding: 'utf8' }).trim();

const PROTECTED = Object.freeze({
  legado: '9aaf24b766f0f82a49b797a8a3e9d54e74fd6f4c',
  fitaroni: '086f620e882c539104e358107f0b7414166a3530',
  demos: '1e85766b490bdeea0f787a1b7b0317d8d61e82a9',
  'demos/jair-neto': '3fb6f7d682ec33b084b94a7d11f0e67100e840c9',
  'demos/criativo-design': 'ee771ce1e6ed8dc76b194d8e6ff02996fdea5f29',
  'demos/ferrini': 'd63258902b00d880f005abc88d74ecada3b51d79'
});

const FOUNDATION = [
  'showcase-v2/index.html',
  'showcase-v2/assets/tokens.css',
  'showcase-v2/assets/showcase.css',
  'showcase-v2/assets/mineral-signal.css',
  'showcase-v2/assets/showcase.js',
  'showcase-v2/README.md'
];

test('preserva integralmente as provas e paths públicos sincronizados', () => {
  for (const [path, expected] of Object.entries(PROTECTED)) {
    assert.equal(gitObject(path), expected, `${path} foi alterado`);
  }
});

test('a fundação V2 continua existente e foi finalizada sem reconstrução estrutural', () => {
  for (const path of FOUNDATION) assert.ok(existsSync(path), `faltando ${path}`);
});

test('SEO e OG apontam para a homepage pública final', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /<html[^>]+lang="pt-BR"/i);
  assert.match(html, /<meta[^>]+name="viewport"/i);
  assert.match(html, /<meta[^>]+name="description"/i);
  assert.match(html, /rel="canonical"[^>]+https:\/\/dgreych\.github\.io\/DOMO-BJI\//i);
  for (const property of ['og:type', 'og:title', 'og:description', 'og:url', 'og:image']) {
    assert.match(html, new RegExp(`property="${property}"`, 'i'), `faltando ${property}`);
  }
  assert.match(html, /domo-social-preview-1200x630\.png/i);
  assert.match(html, /twitter:card/i);
  assert.match(html, /application\/ld\+json/i);
});

test('portfólio usa apenas categorias honestas e prioriza provas live', () => {
  const html = read('showcase-v2/index.html');
  for (const name of ['Jair Neto', 'Criativo Design', 'Ferrini CrossFit', 'Fitaroni', 'Legado']) {
    assert.match(html, new RegExp(name, 'i'), `prova ausente: ${name}`);
  }
  assert.match(html, /data-proof-kind="demonstracao"/i);
  assert.match(html, /data-proof-kind="experimento"/i);
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

test('CTA sustenta demo gratuita com trilha de contexto e WhatsApp oficial', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /demo gratuita/i);
  assert.match(html, /data-cta="primary"/i);
  assert.match(html, /https:\/\/wa\.me\/5522999686677/i);
  assert.match(html, /data-wa-context=/i);
});

test('tokens, browser frames, slides, motion, mobile e reduced motion continuam verificáveis', () => {
  const tokens = read('showcase-v2/assets/tokens.css');
  const css = read('showcase-v2/assets/showcase.css') + read('showcase-v2/assets/mineral-signal.css');
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

test('handoff F05 V2 está aplicado materialmente', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /assets\/brand\/domo-logo-horizontal-inverse\.svg/i);
  assert.match(html, /assets\/mineral-signal\.css/i);
  assert.match(html, /Tecnologia que move o negócio/i);
  assert.match(html, /Menos atrito\. Mais negócio andando\./i);
});
