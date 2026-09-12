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
    "equipe",
    "triagem",
  ]) {
    assert.match(html, new RegExp(`<section[^>]+id="${id}"`));
  }

  assert.match(html, /<form[^>]+id="triage-form"/);
  assert.match(html, /<textarea[^>]+maxlength="280"/);
  assert.match(html, /aria-live="polite"/);
});
