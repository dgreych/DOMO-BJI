const WHATSAPP_NUMBER = "5522998594066";

function clean(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function buildJairBriefing(input) {
  const style = clean(input.style);
  const placement = clean(input.placement);
  const size = clean(input.size);
  const idea = clean(input.idea);

  if (!style || !placement || !size || !idea) {
    throw new Error("Preencha estilo, local, dimensão e ideia.");
  }

  return [
    "Olá, Jair! Vi sua proposta de briefing e gostaria de solicitar um orçamento.",
    "",
    `Estilo: ${style}`,
    `Local do corpo: ${placement}`,
    `Dimensão aproximada: ${size}`,
    `Ideia: ${idea}`,
    "",
    "Posso enviar uma referência por aqui?",
  ].join("\n");
}

export function buildJairWhatsappUrl(input) {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", buildJairBriefing(input));
  return url;
}
