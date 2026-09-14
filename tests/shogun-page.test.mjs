import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const pageUrl = new URL('shogun/index.html', root);
const cssUrl = new URL('shogun/styles.css', root);
const jsUrl = new URL('shogun/app.js', root);
const sitemapUrl = new URL('sitemap.xml', root);

test('publica a superfície Shogun como página estática isolada', () => {
  assert.equal(existsSync(pageUrl), true, 'shogun/index.html precisa existir');
  assert.equal(existsSync(cssUrl), true, 'shogun/styles.css precisa existir');
  assert.equal(existsSync(jsUrl), true, 'shogun/app.js precisa existir');
});

test('explica que Shogun é gratuito e BunnyFy/hospedagem são opcionais', async () => {
  const html = await readFile(pageUrl, 'utf8');
  assert.match(html, /gratuito/i);
  assert.match(html, /BunnyFy/i);
  assert.match(html, /opcional/i);
  assert.match(html, /24\/7/);
});

test('liga para o repositório público e usa assets reais do Shogun', async () => {
  const html = await readFile(pageUrl, 'utf8');
  assert.match(html, /https:\/\/github\.com\/dgreych\/shogun/);
  assert.match(html, /raw\.githubusercontent\.com\/dgreych\/shogun\/main\/assets\/brand\/shogun-banner\.png/);
  assert.match(html, /docs\/instalacao\/img\/painel\.png/);
  assert.match(html, /docs\/instalacao\/img\/feed\.png/);
});

test('oferece tutoriais separados para Termux, Linux e Windows', async () => {
  const html = await readFile(pageUrl, 'utf8');
  const js = await readFile(jsUrl, 'utf8');
  for (const platform of ['termux', 'linux', 'windows']) {
    assert.match(html, new RegExp(`data-platform=["']${platform}["']`));
  }
  assert.match(html, /scripts\/install-termux\.sh/);
  assert.match(html, /scripts\/install-linux\.sh/);
  assert.match(html, /scripts\\install-windows\.ps1|scripts\/install-windows\.ps1/);
  assert.match(js, /navigator\.clipboard|writeText/);
});

test('mantém CTAs de BunnyFy e hospedagem com mensagens diferentes no WhatsApp Domo', async () => {
  const html = await readFile(pageUrl, 'utf8');
  const js = await readFile(jsUrl, 'utf8');
  assert.match(html, /5522999686677/);
  assert.match(html, /data-whatsapp-context=["']bunnyfy["']/);
  assert.match(html, /data-whatsapp-context=["']hosting["']/);
  assert.match(js, /BunnyFy/);
  assert.match(js, /24\/7/);
});

test('inclui acessibilidade, motion-safe e indexação', async () => {
  const html = await readFile(pageUrl, 'utf8');
  const css = await readFile(cssUrl, 'utf8');
  const sitemap = await readFile(sitemapUrl, 'utf8');
  assert.match(html, /role=["']tablist["']/);
  assert.match(html, /aria-live=["']polite["']/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /focus-visible/);
  assert.match(sitemap, /https:\/\/dgreych\.github\.io\/DOMO-BJI\/shogun\//);
});
