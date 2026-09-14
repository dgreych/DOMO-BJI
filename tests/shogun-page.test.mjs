import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const pageUrl = new URL('shogun/index.html', root);
const cssUrl = new URL('shogun/styles.css', root);
const mobileCssUrl = new URL('shogun/mobile.css', root);
const themeUrl = new URL('shogun/theme-shogun.css', root);
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

test('mantém tutorial legível em telas estreitas sem cortar comandos', async () => {
  assert.equal(existsSync(mobileCssUrl), true, 'shogun/mobile.css precisa existir');
  const mobileCss = (await readFile(mobileCssUrl, 'utf8')).replace(/\s+/g, ' ');
  const js = await readFile(jsUrl, 'utf8');
  assert.match(js, /mobile\.css/);
  assert.match(mobileCss, /\.platform-panel\s*\{[^}]*min-width:\s*0/i);
  assert.match(mobileCss, /\.step\s*>\s*div\s*\{[^}]*min-width:\s*0/i);
  assert.match(mobileCss, /\.code-box\s*\{[^}]*max-width:\s*100%/i);
  assert.match(mobileCss, /\.code-box\s+pre\s*\{[^}]*overflow-x:\s*auto/i);
  assert.match(mobileCss, /@media\s*\(max-width:\s*460px\)[\s\S]*?\.platform-panel\s*\{[^}]*padding:/i);
});

test('onboarding ensina o que é um bot antes de pedir instalação', async () => {
  const html = await readFile(pageUrl, 'utf8');
  assert.match(html, /O que é um bot de WhatsApp\?/i);
  assert.match(html, /programa que fica conectado ao WhatsApp/i);
  assert.match(html, /Quero instalar o SHOGUN/i);
  assert.doesNotMatch(html, /Colocar meu Shogun no ar/i);
  assert.match(html, /1[\s\S]{0,160}Baixar/i);
  assert.match(html, /2[\s\S]{0,160}Instalar/i);
  assert.match(html, /3[\s\S]{0,160}Iniciar/i);
  assert.match(html, /4[\s\S]{0,160}Conectar/i);
  assert.match(html, /Nunca usei terminal/i);
  assert.match(html, /Você não precisa entender os comandos/i);
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

test('usa a paleta oficial preta, vermelha e amarela do Shogun sem vinho ou roxo', async () => {
  const html = await readFile(pageUrl, 'utf8');
  assert.equal(existsSync(themeUrl), true, 'theme-shogun.css precisa existir');
  assert.match(html, /theme-shogun\.css/);

  const theme = (await readFile(themeUrl, 'utf8')).toLowerCase();
  assert.match(theme, /--shogun-red:\s*#ff2b2b/);
  assert.match(theme, /--shogun-yellow:\s*#ffd400/);
  assert.match(theme, /--shogun-black:\s*#050505/);

  for (const forbidden of ['#471616', '#5c1418', '#541115', '#7040c8', '#8a50d8', '#7d4bc1']) {
    assert.equal(theme.includes(forbidden), false, `tema não pode usar ${forbidden}`);
  }
});