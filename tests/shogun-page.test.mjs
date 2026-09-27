import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import test from 'node:test';

const page = new URL('../shogun/index.html', import.meta.url);
const html = readFileSync(page, 'utf8');
const css = ['styles.css', 'layout.css'].map(name => readFileSync(new URL(name, page), 'utf8')).join('\n');
const script = readFileSync(new URL('app.js', page), 'utf8');

test('publica o Shogun no Pages existente com imagens locais válidas', () => {
  assert.match(html, /rel="canonical" href="https:\/\/dgreych\.github\.io\/DOMO-BJI\/shogun\/"/);
  assert.match(html, /<title>Shogun \| Bot para WhatsApp<\/title>/);
  for (const [, asset] of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g)) {
    const url = new URL(asset, page);
    assert.ok(existsSync(url), `Arquivo ausente: ${asset}`);
    if (asset.endsWith('.jpg')) {
      const bytes = readFileSync(url);
      assert.equal(bytes.readUInt16BE(0), 0xffd8, `JPEG inválido: ${asset}`);
      assert.ok(bytes.length > 10000);
    }
  }
  assert.match(html, /og:image" content="https:\/\/dgreych\.github\.io\/DOMO-BJI\/shogun\/assets\/shogun-cat-hero\.jpg/);
});

test('explica instalação própria gratuita e serviços opcionais sem prometer disponibilidade', () => {
  assert.match(html, /própria instância.*gratuit/i);
  assert.match(html, /SERVIÇOS OPCIONAIS/);
  assert.match(html, /20 chamadas por dia/);
  assert.match(html, /contagem é feita na API/);
  assert.doesNotMatch(html, /24\/7|mudou a cara|tem assunto, tem comando|preto, vermelho, shogun|nazuna|gyomei|alaska|samurai/i);
});

test('oferece guias para as quatro plataformas e início pelo npm start', () => {
  for (const platform of ['windows', 'linux', 'macos', 'termux']) {
    assert.match(html, new RegExp(`data-platform="${platform}"`));
    assert.match(script, new RegExp(`${platform}:`));
  }
  assert.match(html, /git clone https:\/\/github\.com\/dgreych\/shogun\.git\s+cd shogun\s+npm start/);
  assert.doesNotMatch(html, /npm run setup|npm install/);
});

test('permite navegar no celular e respeita acessibilidade e movimento reduzido', () => {
  assert.match(html, /aria-expanded="false" aria-controls="main-nav"/);
  assert.match(html, /id="main-nav" aria-label="Principal"/);
  assert.match(html, /href="#conteudo">Pular para o conteúdo/);
  assert.match(script, /setAttribute\('aria-expanded'/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /focus-visible/);
});

test('direciona os atendimentos ao contato correto e deixa o envio para o visitante', () => {
  const contacts = [...html.matchAll(/https:\/\/wa\.me\/(\d+)(?:\?text=([^"\s]+))?/g)];
  assert.ok(contacts.length >= 3);
  assert.ok(contacts.every(([, number]) => number === '5522997028553'));
  assert.ok(contacts.some(([, , message]) => decodeURIComponent(message ?? '').includes('API BunnyFy')));
  assert.ok(contacts.some(([, , message]) => decodeURIComponent(message ?? '').includes('hospedagem do Shogun')));
  assert.match(script, /encodeURIComponent\(message\)/);
  assert.match(html, /revisar a mensagem no WhatsApp antes de enviar/);
});
