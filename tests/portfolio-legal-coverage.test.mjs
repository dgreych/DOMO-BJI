import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const legalScript = 'import "/DOMO-BJI/assets/domo-legal.js";';

for (const path of ["legado/assets/app.js", "fitaroni/assets/app.js"]) {
  test(`${path} carrega o disclaimer jurídico compartilhado`, async () => {
    const source = await readFile(path, "utf8");
    assert.match(source, /domo-legal\.js/);
  });
}

test("Beleza Leal é o primeiro item do portfólio e não é marcada como demo", async () => {
  const html = await readFile("index.html", "utf8");
  const portfolioStart = html.indexOf('id="trabalhos"');
  const firstProject = html.indexOf('class="project', portfolioStart);
  const beleza = html.indexOf('beleza-leal/', portfolioStart);
  assert.ok(beleza > -1, "Beleza Leal precisa estar no portfólio");
  assert.ok(beleza >= firstProject && beleza < html.indexOf('</article>', firstProject), "Beleza Leal precisa ser o primeiro card");
});

test("todas as demos públicas entram no portfólio", async () => {
  const html = await readFile("index.html", "utf8");
  for (const href of [
    "demos/jair-neto/",
    "demos/ferrini/",
    "demos/sheila-de-jesus/",
    "demos/criativo-design/",
    "fitaroni/",
    "legado/",
  ]) assert.match(html, new RegExp(href.replaceAll("/", "\\/")));
});

test("site Beleza Leal não carrega disclaimer de demo", async () => {
  const html = await readFile("beleza-leal/index.html", "utf8");
  assert.doesNotMatch(html, /domo-legal\.js|DEMO NÃO OFICIAL|Demonstração conceitual não oficial/i);
});
