import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

for (const path of ["legado/index.html", "fitaroni/index.html"]) {
  test(`${path} carrega o disclaimer jurídico compartilhado`, async () => {
    const source = await readFile(path, "utf8");
    assert.match(source, /domo-legal\.js/);
  });
}

test("todas as demos públicas entram no portfólio", async () => {
  const html = await readFile("index.html", "utf8");
  const portfolio = html.slice(html.indexOf('id="trabalhos"'), html.indexOf('id="entregas"'));
  for (const href of [
    "demos/jair-neto/",
    "demos/ferrini/",
    "demos/sheila-de-jesus/",
    "demos/criativo-design/",
    "fitaroni/",
    "legado/",
  ]) assert.ok(portfolio.includes(href), `${href} precisa estar no portfólio`);
});
