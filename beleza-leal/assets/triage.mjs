const WHATSAPP_NUMBER = "5522998217560";

export function normalizeContext(value = "") {
  return value.trim().replace(/\s+/g, " ").slice(0, 280);
}

export function buildTriageMessage({ intention, context = "" }) {
  const cleanIntention = normalizeContext(intention);

  if (!cleanIntention) {
    throw new Error("Escolha o que você busca.");
  }

  const cleanContext = normalizeContext(context);
  const base =
    `Olá! Vim pelo site da Beleza Leal e gostaria de conversar sobre ${cleanIntention}. ` +
    "Quero entender qual pode ser o próximo passo para mim.";

  return cleanContext ? `${base} Contexto: ${cleanContext}` : base;
}

export function buildWhatsappUrl(input) {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", buildTriageMessage(input));
  return url;
}
