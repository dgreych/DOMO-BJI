import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

test('orienta a configuração mínima da instância sem solicitar chaves de provedores', () => {
  const html = readFileSync(new URL('../shogun/index.html', import.meta.url), 'utf8');
  assert.match(html, /nome do bot, número do dono, número do bot e chave BunnyFy opcional/);
  assert.match(html, /dependências são instaladas/);
  assert.match(html, /Git, Node\.js e FFmpeg/);
  assert.match(html, /QR ou código de conexão/);
  assert.doesNotMatch(html, /NVIDIA_API_KEY|OPENAI_API_KEY|npm run setup/);
});
