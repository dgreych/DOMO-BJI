import assert from "node:assert/strict";
import test from "node:test";

import {
  buildCriativoBriefing,
  buildCriativoWhatsappUrl,
} from "../demos/criativo-design/assets/briefing.mjs";

test("organiza o pedido técnico sem prometer preço ou prazo", () => {
  const briefing = buildCriativoBriefing({
    category: "Letreiro / fachada",
    material: "ACM",
    measure: "2,00 m × 0,80 m",
    quantity: "1",
    location: "  fachada   da loja ",
    objective: "comunicar a nova identidade",
    reference: "Sim",
  });

  assert.equal(
    briefing,
    "Olá, Jeferson! Vi a proposta de briefing da Criativo Design e gostaria de solicitar um orçamento.\n\n" +
      "Categoria: Letreiro / fachada\n" +
      "Material de interesse: ACM\n" +
      "Medidas aproximadas: 2,00 m × 0,80 m\n" +
      "Quantidade: 1\n" +
      "Local de instalação ou aplicação: fachada da loja\n" +
      "Objetivo: comunicar a nova identidade\n" +
      "Tenho um arquivo ou referência para enviar: Sim\n\n" +
      "Podemos avaliar o projeto?",
  );
});

test("usa o WhatsApp público atribuído à Criativo Design", () => {
  const url = buildCriativoWhatsappUrl({
    category: "Adesivo / banner",
    material: "Lona",
    measure: "90 cm × 120 cm",
    quantity: "2",
    location: "área interna",
    objective: "divulgação de evento",
    reference: "Não",
  });

  assert.equal(url.origin, "https://wa.me");
  assert.equal(url.pathname, "/5522997085286");
  assert.match(url.searchParams.get("text"), /Categoria: Adesivo \/ banner/);
  assert.match(url.searchParams.get("text"), /Material de interesse: Lona/);
});

test("rejeita briefing técnico incompleto", () => {
  assert.throws(
    () => buildCriativoBriefing({ category: "Impressos", material: "Papel", measure: "", quantity: "100", location: "balcão", objective: "cardápio", reference: "Sim" }),
    /Preencha categoria, material, medidas, quantidade, local, objetivo e referência/,
  );
});
