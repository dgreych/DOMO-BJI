import { buildTriageMessage, buildWhatsappUrl } from "./triage.mjs";

const root = document.documentElement;
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const form = document.querySelector("#triage-form");
const contextField = document.querySelector("#triage-context");
const preview = document.querySelector("[data-message-preview]");
const counter = document.querySelector("[data-character-count]");
const error = document.querySelector("[data-form-error]");
const triage = document.querySelector("#triagem");
const choices = [...document.querySelectorAll("[data-triage-choice]")];

let selectedIntention =
  choices.find((choice) => choice.getAttribute("aria-pressed") === "true")
    ?.dataset.intention ?? "emagrecimento";

function closeMenu() {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

function setIntention(intention) {
  selectedIntention = intention;
  choices.forEach((choice) => {
    choice.setAttribute(
      "aria-pressed",
      String(choice.dataset.intention === intention),
    );
  });
  updatePreview();
}

function updatePreview() {
  try {
    preview.textContent = buildTriageMessage({
      intention: selectedIntention,
      context: contextField?.value ?? "",
    });
    error.textContent = "";
  } catch (exception) {
    preview.textContent = "Escolha uma opção para preparar sua mensagem.";
    error.textContent = exception.message;
  }
}

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  navigation?.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

choices.forEach((choice) => {
  choice.addEventListener("click", () => setIntention(choice.dataset.intention));
});

document.querySelectorAll("[data-scroll-to-triage]").forEach((button) => {
  button.addEventListener("click", () => {
    setIntention(button.dataset.intention);
    triage?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

contextField?.addEventListener("input", () => {
  counter.textContent = `${contextField.value.length} / 280`;
  updatePreview();
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    const url = buildWhatsappUrl({
      intention: selectedIntention,
      context: contextField?.value ?? "",
    });
    error.textContent = "";
    window.open(url.toString(), "_blank", "noopener,noreferrer");
  } catch (exception) {
    error.textContent = exception.message;
  }
});

window.addEventListener(
  "scroll",
  () => header?.classList.toggle("is-scrolled", window.scrollY > 10),
  { passive: true },
);

document.querySelector("[data-year]").textContent = new Date().getFullYear();
updatePreview();

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (!reducedMotion.matches && "IntersectionObserver" in window) {
  root.classList.add("reveal-ready");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll("[data-reveal]").forEach((element) => {
    observer.observe(element);
  });
}
