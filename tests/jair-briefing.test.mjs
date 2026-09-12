import assert from "node:assert/strict";
import test from "node:test";

import {
  buildJairBriefing,
  buildJairWhatsappUrl,
} from "../demos/jair-neto/assets/briefing.mjs";

test("gera um briefing literal e utilizável para o orçamento", () => {
  const briefing = buildJairBriefing({
    style: "Fineline",
    placement: "Antebraço",
    size: "8 cm",
    idea: "  ramo delicado   com iniciais  ",
  });

  assert.equal(
    briefing,
    "Olá, Jair! Vi sua proposta de briefing e gostaria de solicitar um orçamento.\n\n" +
      "Estilo: Fineline\n" +
      "Local do corpo: Antebraço\n" +
      "Dimensão aproximada: 8 cm\n" +
      "Ideia: ramo delicado com iniciais\n\n" +
      "Posso enviar uma referência por aqui?",
  );
});

test("gera o link do WhatsApp oficial com o briefing codificado", () => {
  const url = buildJairWhatsappUrl({
    style: "Botânico",
    placement: "Costela",
    size: "12 cm",
    idea: "folhas em traço fino",
  });

  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5522998594066");
  assert.equal(
    url.searchParams.get("text"),
    "Olá, Jair! Vi sua proposta de briefing e gostaria de solicitar um orçamento.\n\n" +
      "Estilo: Botânico\n" +
      "Local do corpo: Costela\n" +
      "Dimensão aproximada: 12 cm\n" +
      "Ideia: folhas em traço fino\n\n" +
      "Posso enviar uma referência por aqui?",
  );
});

test("não aceita briefing sem os quatro dados essenciais", () => {
  assert.throws(
    () =>
      buildJairBriefing({
        style: "Fineline",
        placement: "",
        size: "8 cm",
        idea: "ramo",
      }),
    /Preencha estilo, local, dimensão e ideia/,
  );
});
