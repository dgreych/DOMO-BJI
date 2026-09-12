import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
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

const BRAND_ASSETS = [
  'showcase-v2/assets/brand/domo-logo-horizontal-inverse.svg',
  'showcase-v2/assets/brand/domo-logo-horizontal.svg',
  'showcase-v2/assets/brand/domo-favicon.svg',
  'showcase-v2/assets/brand/domo-social-preview-1200x630.png'
];

test('preserva as árvores públicas protegidas do main sincronizado', () => {
  for (const [path, expected] of Object.entries(PROTECTED)) {
    assert.equal(gitObject(path), expected, `${path} foi alterado`);
  }
});

test('consome materialmente a identidade F05 V2 Mineral Signal', () => {
  for (const path of BRAND_ASSETS) assert.ok(existsSync(path), `asset F05 V2 ausente: ${path}`);

  const tokens = read('showcase-v2/assets/tokens.css');
  for (const [token, color] of [
    ['--brand-ink', '#171412'],
    ['--brand-paper', '#F2EBDD'],
    ['--brand-accent', '#F35B3F'],
    ['--brand-signal', '#D6E85A']
  ]) assert.match(tokens, new RegExp(`${token}:\\s*${color}`, 'i'));
  assert.match(tokens, /Manrope/i);
  assert.match(tokens, /IBM Plex Mono/i);
  assert.ok(existsSync('showcase-v2/assets/mineral-signal.css'));
});

test('HTML aplica logo, favicon, OG V2 e copy operacional da F05', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /domo-logo-horizontal-inverse\.svg/i);
  assert.match(html, /domo-favicon\.svg/i);
  assert.match(html, /domo-social-preview-1200x630\.png/i);
  assert.match(html, /Tecnologia que move o negócio/i);
  assert.match(html, /Menos atrito\. Mais negócio andando\./i);
  assert.match(html, /Manrope/i);
  assert.match(html, /IBM\+Plex\+Mono/i);
  assert.doesNotMatch(html, /domo-social-card\.svg/i);
});

test('homepage raiz está pronta para promoção sem depender de redirect', () => {
  const html = read('index.html');
  assert.match(html, /Tecnologia que move o negócio/i);
  assert.match(html, /showcase-v2\/assets\/tokens\.css/i);
  assert.match(html, /showcase-v2\/assets\/mineral-signal\.css/i);
  assert.match(html, /demos\/jair-neto\//i);
  assert.match(html, /demos\/criativo-design\//i);
  assert.match(html, /demos\/ferrini\//i);
  assert.match(html, /rel="canonical"[^>]+https:\/\/dgreych\.github\.io\/DOMO-BJI\//i);
});

test('CTA e portfólio continuam comercialmente íntegros', () => {
  const html = read('index.html');
  assert.match(html, /demo gratuita/i);
  assert.match(html, /https:\/\/wa\.me\/5522999686677/i);
  for (const proof of ['Jair Neto', 'Criativo Design', 'Ferrini CrossFit', 'Fitaroni', 'Legado']) {
    assert.match(html, new RegExp(proof, 'i'), `prova ausente: ${proof}`);
  }
  assert.match(html, /data-proof-kind="demonstracao"/i);
  assert.match(html, /data-proof-kind="experimento"/i);
  assert.doesNotMatch(html, />\s*CLIENTE\s*</i);
  assert.doesNotMatch(html, />\s*CASE CONTRATADO\s*</i);
});

test('linguagem antiga e conteúdo interno não aparecem na Showcase V2', () => {
  const bundle = [
    read('index.html'),
    read('showcase-v2/index.html'),
    read('showcase-v2/assets/tokens.css'),
    read('showcase-v2/assets/showcase.css'),
    read('showcase-v2/assets/mineral-signal.css')
  ].join('\n');
  assert.doesNotMatch(bundle, /#00B2FF|#1768FF|#07182F|#0B1F3B/i);
  assert.doesNotMatch(bundle, /OSIRIS|PORTFOLIO_FIRST_FREE_DEMO_OFFER/i);
});

test('bundle crítico continua leve para GitHub Pages', () => {
  const critical = [
    'index.html',
    'showcase-v2/assets/tokens.css',
    'showcase-v2/assets/showcase.css',
    'showcase-v2/assets/mineral-signal.css',
    'showcase-v2/assets/showcase.js',
    'showcase-v2/assets/brand/domo-logo-horizontal-inverse.svg'
  ];
  const bytes = critical.reduce((sum, path) => sum + statSync(path).size, 0);
  assert.ok(bytes < 90000, `bundle crítico excedeu 90 KB: ${bytes}`);
});
