import { buildSheilaWhatsappUrl } from "./briefing.mjs";

const form = document.querySelector("#journey-form");
const routeInput = document.querySelector("#route");
const routeButtons = [...document.querySelectorAll("[data-route]")];
const attendanceFields = document.querySelector("#attendance-fields");
const trainingFields = document.querySelector("#training-fields");
const emptyState = document.querySelector("#empty-state");
const title = document.querySelector("#journey-title");
const intro = document.querySelector("#journey-intro");
const preview = document.querySelector("#contact-preview");
const cta = document.querySelector("#primary-cta");
const feedback = document.querySelector("#feedback");

const field = (name) => form.elements.namedItem(name)?.value ?? "";

function inputForCurrentRoute() {
  if (routeInput.value === "atendimento") {
    return {
      route: "atendimento",
      technique: field("technique"),
      reference: field("reference"),
      period: field("period"),
    };
  }
  if (routeInput.value === "formacao") {
    return {
      route: "formacao",
      interest: field("interest"),
      level: field("level"),
    };
  }
  return { route: "" };
}

function disableCta(message) {
  cta.href = "#escolha";
  cta.classList.add("is-disabled");
  cta.setAttribute("aria-disabled", "true");
  feedback.textContent = message;
}

function update() {
  const route = routeInput.value;
  if (!route) {
    preview.textContent = "Sua escolha aparecerá aqui.";
    disableCta("Escolha um caminho para começar.");
    return;
  }

  const input = inputForCurrentRoute();
  preview.textContent = route === "atendimento"
    ? `${input.technique || "Técnica"} · ${input.reference ? `referência: ${input.reference.toLowerCase()}` : "referência"} · ${input.period || "período"}`
    : `${input.interest || "Interesse"} · ${input.level || "momento atual"}`;

  try {
    cta.href = buildSheilaWhatsappUrl(input);
    cta.classList.remove("is-disabled");
    cta.removeAttribute("aria-disabled");
    feedback.textContent = "Seu roteiro está pronto para abrir no WhatsApp.";
  } catch {
    disableCta(route === "atendimento" ? "Complete técnica, referência e período." : "Complete interesse e momento atual.");
  }
}

function chooseRoute(route) {
  routeInput.value = route;
  routeButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.route === route)));
  attendanceFields.hidden = route !== "atendimento";
  trainingFields.hidden = route !== "formacao";
  emptyState.hidden = true;

  if (route === "atendimento") {
    title.textContent = "Vamos falar das suas unhas.";
    intro.textContent = "Técnica, referência e período preferido deixam o primeiro contato mais claro.";
  } else {
    title.textContent = "Vamos falar do que você quer aprender.";
    intro.textContent = "Interesse e momento atual ajudam Sheila a entender por onde a conversa pode começar.";
  }
  update();
  document.querySelector("#jornada").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

routeButtons.forEach((button) => button.addEventListener("click", () => chooseRoute(button.dataset.route)));
form.addEventListener("input", update);
cta.addEventListener("click", (event) => {
  if (cta.getAttribute("aria-disabled") === "true") event.preventDefault();
});

update();
