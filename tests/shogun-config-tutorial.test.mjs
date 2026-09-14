import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const pageUrl = new URL('../shogun/index.html', import.meta.url);

test('explica configuração do dono e identidade do bot para iniciantes', async () => {
  const html = await readFile(pageUrl, 'utf8');
  assert.match(html, /Como o SHOGUN deve chamar você\?/i);
  assert.match(html, /país e DDD/i);
  assert.match(html, /somente dígitos/i);
  assert.match(html, /Nome do bot/i);
  assert.match(html, /Prefixo de comando/i);
  assert.match(html, /pressione Enter para manter/i);
  assert.match(html, /npm run setup/i);
  assert.match(html, /dados\/src\/config\.json/i);
});