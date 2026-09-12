const WHATSAPP_NUMBER = "5522997085286";

function clean(value) {
  return String(value ?? "").trim().replace(/\s+/g, " ");
}

export function buildCriativoBriefing(input) {
  const category = clean(input.category);
  const material = clean(input.material);
  const measure = clean(input.measure);
  const quantity = clean(input.quantity);
  const location = clean(input.location);
  const objective = clean(input.objective);
  const reference = clean(input.reference);

  if (!category || !material || !measure || !quantity || !location || !objective || !reference) {
    throw new Error("Preencha categoria, material, medidas, quantidade, local, objetivo e referência.");
  }

  return [
    "Olá, Jeferson! Vi a proposta de briefing da Criativo Design e gostaria de solicitar um orçamento.",
    "",
    `Categoria: ${category}`,
    `Material de interesse: ${material}`,
    `Medidas aproximadas: ${measure}`,
    `Quantidade: ${quantity}`,
    `Local de instalação ou aplicação: ${location}`,
    `Objetivo: ${objective}`,
    `Tenho um arquivo ou referência para enviar: ${reference}`,
    "",
    "Podemos avaliar o projeto?",
  ].join("\n");
}

export function buildCriativoWhatsappUrl(input) {
  const url = new URL(`https://wa.me/${WHATSAPP_NUMBER}`);
  url.searchParams.set("text", buildCriativoBriefing(input));
  return url;
}
