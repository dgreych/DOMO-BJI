const LEGAL_PAGE = "/DOMO-BJI/juridico/";

if (!document.querySelector('link[data-domo-legal]')) {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = "/DOMO-BJI/assets/domo-legal.css";
  stylesheet.dataset.domoLegal = "true";
  document.head.append(stylesheet);
}

if (!document.querySelector(".domo-legal-banner")) {
  const banner = document.createElement("aside");
  banner.className = "domo-legal-banner";
  banner.setAttribute("aria-label", "Aviso sobre esta demonstração");
  banner.innerHTML = `
    <div class="domo-legal-banner__inner">
      <strong>DEMO NÃO OFICIAL</strong>
      <span>Demonstração conceitual não oficial criada pela Domo. Não representa contratação, parceria ou aprovação do negócio citado. Se você representa este negócio e quiser retirar esta demo do ar ou não receber novas mensagens da Domo, basta nos avisar.</span>
      <a href="${LEGAL_PAGE}">Jurídico, privacidade e LGPD ↗</a>
    </div>`;

  const skipLink = document.querySelector(".skip-link, .skip");
  if (skipLink) skipLink.insertAdjacentElement("afterend", banner);
  else document.body.prepend(banner);
}
