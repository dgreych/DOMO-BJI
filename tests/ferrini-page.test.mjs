import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';

const page = new URL('../demos/ferrini/index.html', import.meta.url);

test('a página Ferrini existe no path autorizado', () => {
  assert.equal(existsSync(page), true);
});

import { readFileSync } from 'node:fs';

test('a página expõe o contrato visual e de conversão da célula F16', () => {
  const html = readFileSync(page, 'utf8');
  assert.match(html, /COMECE PELO SEU TREINO/);
  assert.match(html, /data-primary-cta/);
  assert.match(html, /name="goal"/);
  assert.match(html, /name="experience"/);
  assert.match(html, /name="period"/);
  assert.match(html, /og:image/);
  assert.match(html, /dgreych\.github\.io\/DOMO-BJI\/demos\/ferrini\/og\.png/);
  assert.match(html, /instagram\.com\/ferrinicross/);
});

const styles = new URL('../demos/ferrini/assets/styles.css', import.meta.url);

test('a folha de estilos da Ferrini existe', () => {
  assert.equal(existsSync(styles), true);
});

test('o CSS prevê mobile-first, alvos táteis e reduced motion', () => {
  const css = readFileSync(styles, 'utf8');
  assert.match(css, /min-height:\s*44px/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /@media\s*\(min-width:\s*760px\)/);
  assert.match(css, /@media\s*\(min-width:\s*1100px\)/);
  assert.doesNotMatch(css, /overflow-x:\s*visible/);
});

const app = new URL('../demos/ferrini/assets/app.js', import.meta.url);

test('o controlador de interação da Ferrini existe', () => {
  assert.equal(existsSync(app), true);
});

test('o controlador usa o builder testado e só libera CTA com três escolhas', () => {
  const js = readFileSync(app, 'utf8');
  assert.match(js, /buildFerriniWhatsappUrl/);
  assert.match(js, /form\.addEventListener\(['"]change['"]/);
  assert.match(js, /aria-disabled/);
  assert.match(js, /goal/);
  assert.match(js, /experience/);
  assert.match(js, /period/);
});

const ogPage = new URL('../demos/ferrini/og.html', import.meta.url);

test('existe composição dedicada para gerar o OG da Ferrini', () => {
  assert.equal(existsSync(ogPage), true);
});
