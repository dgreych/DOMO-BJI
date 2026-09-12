import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../beleza-leal/', import.meta.url);

async function text(name) {
  return readFile(new URL(name, root), 'utf8');
}

test('homepage materializa a arquitetura A03 sem claims bloqueados', async () => {
  const html = await text('index.html');
  assert.match(html, /Emagrecimento e acompanhamento/i);
  assert.match(html, /Cuidado corporal/i);
  assert.match(html, /Pele e estética facial/i);
  assert.match(html, /tirzepatida/i);
  assert.doesNotMatch(html, /resultado garantido|menos \d+\s*kg|sem efeitos colaterais|lipedema|endometriose/i);
});

test('contato confirmado usa WhatsApp e Instagram oficiais', async () => {
  const html = await text('index.html');
  const js = await text('app.js');
  assert.match(html, /emagrecimento_belezaleal/);
  assert.match(js, /5522998217560/);
});

test('triagem evita coleta clínica e prepara mensagem editável', async () => {
  const html = await text('index.html');
  const js = await text('app.js');
  assert.match(html, /Evite incluir informações médicas sensíveis/i);
  assert.doesNotMatch(html, /IMC|dose|diagnóstico|receita|exames/i);
  assert.match(js, /wa\.me/);
  assert.match(js, /encodeURIComponent/);
});

test('motion respeita prefers-reduced-motion', async () => {
  const css = await text('styles.css');
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});

test('SEO e OG existem com asset local', async () => {
  const html = await text('index.html');
  await text('og.svg');
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /name="description"/);
});
