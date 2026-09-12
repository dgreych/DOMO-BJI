export const SHEILA_WHATSAPP = "5522997553489";

const normalize = (value) => String(value ?? "").trim();

export function buildSheilaMessage(input = {}) {
  const route = normalize(input.route);

  if (route === "atendimento") {
    const technique = normalize(input.technique);
    const reference = normalize(input.reference);
    const period = normalize(input.period);
    if (!technique || !reference || !period) {
      throw new Error("Informe técnica, referência e período para o atendimento.");
    }

    return [
      "Olá, Sheila! Vi a proposta de experiência para organizar o contato e quero falar sobre atendimento.",
      "",
      `Técnica de interesse: ${technique}`,
      `Tenho uma referência para mostrar: ${reference}`,
      `Período que prefiro: ${period}`,
      "",
      "Podemos conversar sobre possibilidades de horário?",
    ].join("\n");
  }

  if (route === "formacao") {
    const interest = normalize(input.interest);
    const level = normalize(input.level);
    if (!interest || !level) {
      throw new Error("Informe interesse e nível para falar sobre formação.");
    }

    return [
      "Olá, Sheila! Vi a proposta de experiência para organizar o contato e quero saber mais sobre formação.",
      "",
      `Interesse principal: ${interest}`,
      `Meu momento atual: ${level}`,
      "",
      "Podemos conversar sobre as possibilidades de formação?",
    ].join("\n");
  }

  throw new Error("Escolha uma jornada: atendimento ou formação.");
}

export function buildSheilaWhatsappUrl(input) {
  const message = buildSheilaMessage(input);
  return `https://wa.me/${SHEILA_WHATSAPP}?text=${encodeURIComponent(message)}`;
}
