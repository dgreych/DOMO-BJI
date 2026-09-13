import "/DOMO-BJI/assets/domo-legal.js";
import { buildCriativoWhatsappUrl } from "./briefing.mjs";

const form = document.querySelector("#quote-form");
const cta = document.querySelector("#quote-cta");
const feedback = document.querySelector("#quote-feedback");
const categoryButtons = document.querySelectorAll("[data-category]");
const fields = form.elements;

const preview = {
  category: document.querySelector("[data-preview=category]"),
  material: document.querySelector("[data-preview=material]"),
  measure: document.querySelector("[data-preview=measure]"),
  quantity: document.querySelector("[data-preview=quantity]"),
};

function readInput() {
  return {
    category: fields.category.value,
    material: fields.material.value,
    measure: fields.measure.value,
    quantity: fields.quantity.value,
    location: fields.location.value,
    objective: fields.objective.value,
    reference: fields.reference.value,
  };
}

function updatePreview() {
  const input = readInput();
  preview.category.textContent = input.category || "Selecione";
  preview.material.textContent = input.material || "A definir";
  preview.measure.textContent = input.measure || "A definir";
  preview.quantity.textContent = input.quantity || "—";

  try {
    cta.href = buildCriativoWhatsappUrl(input).toString();
    cta.classList.remove("is-disabled");
    cta.removeAttribute("aria-disabled");
    feedback.textContent = "Briefing técnico pronto para abrir no WhatsApp.";
  } catch {
    cta.href = "#orcamento";
    cta.classList.add("is-disabled");
    cta.setAttribute("aria-disabled", "true");
    feedback.textContent = "Complete os campos para preparar a mensagem.";
  }
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    fields.category.value = button.dataset.category;
    categoryButtons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
    updatePreview();
    document.querySelector("#orcamento").scrollIntoView({ behavior: "smooth" });
  });
});

form.addEventListener("input", updatePreview);
cta.addEventListener("click", (event) => {
  if (cta.getAttribute("aria-disabled") === "true") event.preventDefault();
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  updatePreview();
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

updatePreview();
