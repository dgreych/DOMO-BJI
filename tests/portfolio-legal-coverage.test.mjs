import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

for (const path of ["legado/app.js", "fitaroni/app.js"]) {
  test(`${path} carrega o disclaimer jurídico compartilhado`, async () => {
    const source = await readFile(path, "utf8");
    assert.match(source, /domo-legal\.js/);
  });
}

test("Beleza Leal é o primeiro item do portfólio e não é marcada como demo", async () => {
  const html = await readFile("index.html", "utf8");
  const portfolioStart = html.indexOf('id="trabalhos"');
  const firstProject = html.indexOf('class="project', portfolioStart);
  const firstProjectEnd = html.indexOf('</article>', firstProject);
  const beleza = html.indexOf('beleza-leal/', portfolioStart);
  assert.ok(beleza > -1, "Beleza Leal precisa estar no portfólio");
  assert.ok(beleza >= firstProject && beleza < firstProjectEnd, "Beleza Leal precisa ser o primeiro card");
  const firstCard = html.slice(firstProject, firstProjectEnd);
  assert.doesNotMatch(firstCard, /DEMO CONCEITUAL|DEMO NÃO OFICIAL/i);
});

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

test("site Beleza Leal permanece sem disclaimer de demo", async () => {
  const html = await readFile("beleza-leal/index.html", "utf8");
  assert.doesNotMatch(html, /domo-legal\.js|DEMO NÃO OFICIAL|Demonstração conceitual não oficial/i);
});
