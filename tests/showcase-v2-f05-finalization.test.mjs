import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const read = (path) => readFileSync(path, 'utf8');
const gitObject = (path) => execFileSync('git', ['rev-parse', `HEAD:${path}`], { encoding: 'utf8' }).trim();

const PROTECTED = Object.freeze({
  legado: '9aaf24b766f0f82a49b797a8a3e9d54e74fd6f4c',
  fitaroni: '086f620e882c539104e358107f0b7414166a3530',
  demos: '9b66b8376dc879962d74a5ebfca1df582fcbb199'
});

test('preserva as árvores públicas protegidas durante a finalização', () => {
  for (const [path, expected] of Object.entries(PROTECTED)) {
    assert.equal(gitObject(path), expected, `${path} foi alterado`);
  }
});

test('consome materialmente a identidade F05 V2 Mineral Signal', () => {
  for (const path of [
    'showcase-v2/assets/brand/domo-logo-horizontal-inverse.svg',
    'showcase-v2/assets/brand/domo-logo-horizontal.svg',
    'showcase-v2/assets/brand/domo-favicon.svg',
    'showcase-v2/assets/brand/domo-social-preview-1200x630.png'
  ]) assert.ok(existsSync(path), `asset F05 V2 ausente: ${path}`);

  const tokens = read('showcase-v2/assets/tokens.css');
  for (const [token, color] of [
    ['--brand-ink', '#171412'],
    ['--brand-paper', '#F2EBDD'],
    ['--brand-accent', '#F35B3F'],
    ['--brand-signal', '#D6E85A']
  ]) assert.match(tokens, new RegExp(`${token}:\\s*${color}`, 'i'));
  assert.match(tokens, /Manrope/i);
  assert.match(tokens, /IBM Plex Mono/i);
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

test('CTA e portfolio continuam comercialmente íntegros', () => {
  const html = read('showcase-v2/index.html');
  assert.match(html, /demo gratuita/i);
  assert.match(html, /https:\/\/wa\.me\/5522999686677/i);
  assert.match(html, /data-proof-kind="demonstracao"/i);
  assert.match(html, /data-proof-kind="experimento"/i);
  assert.doesNotMatch(html, />\s*CLIENTE\s*</i);
  assert.doesNotMatch(html, />\s*CASE CONTRATADO\s*</i);
});

test('linguagem dominante antiga não volta na camada V2', () => {
  const bundle = [
    read('showcase-v2/assets/tokens.css'),
    read('showcase-v2/assets/showcase.css'),
    read('showcase-v2/index.html')
  ].join('\n');
  assert.doesNotMatch(bundle, /#00B2FF|#1768FF|#07182F|#0B1F3B/i);
});
