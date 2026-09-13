import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  buildTriageMessage,
  buildWhatsappUrl,
} from "../beleza-leal/assets/triage.mjs";

test("monta mensagem comercial sem diagnóstico", () => {
  assert.equal(
    buildTriageMessage({
      intention: "emagrecimento",
      context: "  quero começar   com calma  ",
    }),
    "Olá! Vim pelo site da Beleza Leal e gostaria de conversar sobre emagrecimento. " +
      "Quero entender qual pode ser o próximo passo para mim. " +
      "Contexto: quero começar com calma",
  );
});

test("abre o WhatsApp confirmado com mensagem revisável", () => {
  const url = buildWhatsappUrl({ intention: "estética corporal" });

  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5522998217560");
  assert.equal(
    url.searchParams.get("text"),
    "Olá! Vim pelo site da Beleza Leal e gostaria de conversar sobre estética corporal. " +
      "Quero entender qual pode ser o próximo passo para mim.",
  );
});

test("recusa triagem sem intenção", () => {
  assert.throws(
    () => buildTriageMessage({ intention: "   " }),
    /Escolha o que você busca/,
  );
});

test("entrega uma homepage semântica com a triagem completa", async () => {
  const html = await readFile(
    new URL("../beleza-leal/index.html", import.meta.url),
    "utf8",
  );

  for (const id of [
    "inicio",
    "caminhos",
    "como-funciona",
    "resultados",
    "metodo-bl",
    "acompanhamento-medico",
    "resultados-reais",
    "equipe",
    "triagem",
  ]) {
    assert.match(html, new RegExp(`<section[^>]+id="${id}"`));
  }

  assert.match(html, /<form[^>]+id="triage-form"/);
  assert.match(html, /<textarea[^>]+maxlength="280"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, />Michelle Areas</);
  assert.doesNotMatch(html, /Michelle Áreas/);
});

test("aplica a identidade clara e respeita redução de movimento", async () => {
  const css = await readFile(
    new URL("../beleza-leal/assets/styles.css", import.meta.url),
    "utf8",
  );

  for (const color of ["#faf8f2", "#f2ebdd", "#a8843f", "#292622"]) {
    assert.match(css.toLowerCase(), new RegExp(color));
  }

  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /min-height:\s*44px/);
  assert.match(
    css,
    /img\s*\{[^}]*max-width:\s*100%;[^}]*height:\s*auto;/s,
    "imagens responsivas não podem manter a altura fixa do atributo HTML",
  );
});

test("mantém copy pública fora dos claims bloqueados", async () => {
  const html = await readFile(
    new URL("../beleza-leal/index.html", import.meta.url),
    "utf8",
  );

  for (const blocked of [
    "mounjaro",
    "resultado garantido",
    "sem sofrimento",
    "-15kg",
    "-45kg",
  ]) {
    assert.doesNotMatch(html.toLowerCase(), new RegExp(blocked));
  }

  assert.doesNotMatch(html, /<canvas/i);
  assert.doesNotMatch(html, /WebGL/i);
});

test("apresenta Método BL, pares reais e acompanhamento médico de forma delimitada", async () => {
  const html = await readFile(
    new URL("../beleza-leal/index.html", import.meta.url),
    "utf8",
  );

  for (const asset of [
    "assets/resultado-casal-antes.jpg",
    "assets/resultado-casal-depois.jpg",
    "assets/resultado-solo-antes.jpg",
    "assets/resultado-solo-depois.jpg",
    "assets/method-bl-line.jpg",
  ]) {
    assert.match(html, new RegExp(asset.replaceAll(".", "\\.")));
  }

  assert.match(html, /Método BL/);
  assert.match(html, /acompanhamento nutricional/i);
  assert.match(html, /sessões comportamentais/i);
  assert.match(html, /Linha BL/);
  assert.match(html, />Antes</);
  assert.match(html, />Depois</);
  assert.match(html, /Dr\. Marcos Pitaluga/);
  assert.match(
    html,
    /planos que incluam tirzepatida[\s\S]*consulta médica[\s\S]*orientação[\s\S]*acompanhamento médico[\s\S]*Dr\. Marcos Pitaluga/i,
  );
  assert.doesNotMatch(html, /clandestinamente/i);
  assert.doesNotMatch(html, /sem acompanhamento médico/i);
});

test("mantém a abertura corporal e remove metacomentário do rodapé", async () => {
  const html = await readFile(
    new URL("../beleza-leal/index.html", import.meta.url),
    "utf8",
  );

  assert.match(html, /Um cuidado com corpo, nome e história\./);
  assert.doesNotMatch(html, /Um cuidado com rosto, nome e história\./);
  assert.doesNotMatch(
    html,
    /Uma presença digital construída a partir da identidade real da clínica\./,
  );
});

test("publica a nova rota sem retirar a experiência legada", async () => {
  const sitemap = await readFile(
    new URL("../sitemap.xml", import.meta.url),
    "utf8",
  );

  assert.match(
    sitemap,
    /https:\/\/dgreych\.github\.io\/DOMO-BJI\/beleza-leal\//,
  );
  assert.match(
    sitemap,
    /https:\/\/dgreych\.github\.io\/DOMO-BJI\/belezaleal\//,
  );
});
