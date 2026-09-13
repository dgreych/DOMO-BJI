import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const demoAppPaths = [
  "demos/jair-neto/assets/app.js",
  "demos/ferrini/assets/app.js",
  "demos/sheila-de-jesus/assets/app.js",
  "demos/criativo-design/assets/app.js",
];

for (const path of demoAppPaths) {
  test(`${path} carrega o aviso jurídico compartilhado`, async () => {
    const source = await readFile(path, "utf8");
    assert.match(source, /\/DOMO-BJI\/assets\/domo-legal\.js/);
  });
}

test("aviso compartilhado identifica a demo, oferece opt-out e aponta para o jurídico", async () => {
  const source = await readFile("assets/domo-legal.js", "utf8");
  assert.match(source, /Demonstração conceitual não oficial criada pela Domo/i);
  assert.match(source, /retirar esta demo do ar/i);
  assert.match(source, /não receber novas mensagens da Domo/i);
  assert.match(source, /\/DOMO-BJI\/juridico\//);
});

test("página jurídica identifica a Domo e explica prospecção e LGPD", async () => {
  const html = await readFile("juridico/index.html", "utf8");
  assert.match(html, /61\.036\.407\/0001-63/);
  assert.match(html, /prospecção comercial/i);
  assert.match(html, /legítimo interesse/i);
  assert.match(html, /dados pessoais sensíveis/i);
  assert.match(html, /lista de supressão/i);
  assert.match(html, /retirada da demonstração/i);
});

test("homepage mantém demos no portfólio e oferece acesso ao jurídico", async () => {
  const html = await readFile("index.html", "utf8");
  assert.match(html, /demos\/jair-neto\//);
  assert.match(html, /demos\/ferrini\//);
  assert.match(html, /demos\/sheila-de-jesus\//);
  assert.match(html, /DEMO CONCEITUAL/i);
  assert.match(html, /juridico\//);
});
