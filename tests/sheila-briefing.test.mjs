import test from "node:test";
import assert from "node:assert/strict";

import {
  SHEILA_WHATSAPP,
  buildSheilaMessage,
  buildSheilaWhatsappUrl,
} from "../demos/sheila-de-jesus/assets/briefing.mjs";

test("roteia atendimento com técnica, referência e período", () => {
  const message = buildSheilaMessage({
    route: "atendimento",
    technique: "Fibra de vidro",
    reference: "Sim",
    period: "Tarde",
  });

  assert.equal(
    message,
    [
      "Olá, Sheila! Vi a proposta de experiência para organizar o contato e quero falar sobre atendimento.",
      "",
      "Técnica de interesse: Fibra de vidro",
      "Tenho uma referência para mostrar: Sim",
      "Período que prefiro: Tarde",
      "",
      "Podemos conversar sobre possibilidades de horário?",
    ].join("\n"),
  );
});

test("roteia formação sem inventar turma, preço ou certificação", () => {
  const message = buildSheilaMessage({
    route: "formacao",
    interest: "Alongamento",
    level: "Começando agora",
  });

  assert.equal(
    message,
    [
      "Olá, Sheila! Vi a proposta de experiência para organizar o contato e quero saber mais sobre formação.",
      "",
      "Interesse principal: Alongamento",
      "Meu momento atual: Começando agora",
      "",
      "Podemos conversar sobre as possibilidades de formação?",
    ].join("\n"),
  );
  assert.doesNotMatch(message, /turma aberta|certificado|preço|vaga garantida/i);
});

test("gera URLs distintas no WhatsApp oficial", () => {
  assert.equal(SHEILA_WHATSAPP, "5522997553489");

  const atendimento = buildSheilaWhatsappUrl({
    route: "atendimento",
    technique: "Gel na tips",
    reference: "Não",
    period: "Manhã",
  });
  const formacao = buildSheilaWhatsappUrl({
    route: "formacao",
    interest: "Manicure e pedicure",
    level: "Já atuo",
  });

  assert.match(atendimento, /^https:\/\/wa\.me\/5522997553489\?text=/);
  assert.match(formacao, /^https:\/\/wa\.me\/5522997553489\?text=/);
  assert.notEqual(atendimento, formacao);
  assert.match(decodeURIComponent(atendimento), /quero falar sobre atendimento/);
  assert.match(decodeURIComponent(formacao), /quero saber mais sobre formação/);
});

test("rejeita qualquer uma das duas jornadas incompleta", () => {
  assert.throws(
    () => buildSheilaMessage({ route: "atendimento", technique: "Fibra de vidro" }),
    /referência e período/i,
  );
  assert.throws(
    () => buildSheilaMessage({ route: "formacao", interest: "Alongamento" }),
    /interesse e nível/i,
  );
  assert.throws(() => buildSheilaMessage({ route: "outro" }), /jornada/i);
});
