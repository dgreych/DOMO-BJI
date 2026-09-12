import { buildJairWhatsappUrl } from "./briefing.mjs";

const form = document.querySelector("#briefing-form");
const cta = document.querySelector("#briefing-cta");
const feedback = document.querySelector("#briefing-feedback");
const styleInput = form.elements.style;
const styleButtons = document.querySelectorAll("[data-style]");

function selectStyle(value) {
  styleInput.value = value;
  styleButtons.forEach((button) => {
    const active = button.dataset.style === value;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function readBriefing() {
  return {
    style: styleInput.value,
    placement: form.elements.placement.value,
    size: form.elements.size.value,
    idea: form.elements.idea.value,
  };
}

function updateCta() {
  try {
    cta.href = buildJairWhatsappUrl(readBriefing()).toString();
    cta.removeAttribute("aria-disabled");
    cta.classList.remove("is-disabled");
    feedback.textContent = "Briefing pronto para abrir no WhatsApp.";
  } catch {
    cta.removeAttribute("href");
    cta.setAttribute("aria-disabled", "true");
    cta.classList.add("is-disabled");
    feedback.textContent = "Complete os quatro campos para preparar a mensagem.";
  }
}

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectStyle(button.dataset.style);
    updateCta();
    document.querySelector("#briefing").scrollIntoView({ behavior: "smooth" });
  });
});

form.addEventListener("input", updateCta);
form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateCta();
  if (cta.href) window.open(cta.href, "_blank", "noopener,noreferrer");
});

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = document.querySelector(link.getAttribute("href"));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

selectStyle("Fineline");
updateCta();
