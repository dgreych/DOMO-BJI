import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const demoPaths = [
  "demos/jair-neto/index.html",
  "demos/ferrini/index.html",
  "demos/sheila-de-jesus/index.html",
  "demos/criativo-design/index.html",
];

for (const path of demoPaths) {
  test(`${path} identifica a demo, oferece opt-out e aponta para o jurídico`, async () => {
    const html = await readFile(path, "utf8");
    assert.match(html, /Demonstração conceitual não oficial criada pela Domo/i);
    assert.match(html, /retirar esta demo do ar/i);
    assert.match(html, /não receber novas mensagens da Domo/i);
    assert.match(html, /\/DOMO-BJI\/juridico\//);
  });
}

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
