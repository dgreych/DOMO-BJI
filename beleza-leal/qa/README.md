# F17 — Beleza Leal Prototype — QA

Data: 2026-09-12

## Viewports renderizados

- 360 × 800
- 390 × 844
- 430 × 932
- 1440 × 1000

Todos os quatro viewports apresentaram `scrollWidth === clientWidth`, sem overflow horizontal.

## Fluxo funcional exercitado

1. seleção de intenção;
2. avanço para contexto opcional;
3. preenchimento de contexto;
4. geração da mensagem editável;
5. validação do link final `https://wa.me/5522998217560?text=...`.

Resultado: fluxo funcional nos quatro viewports, sem erro de console ou de página no render de QA.

## Testes de contrato

Executado com:

```bash
node --test tests/beleza-leal.test.mjs
```

Resultado: 5/5 testes passando.

Cobertura do contrato:

- arquitetura editorial baseada no A03;
- ausência de claims bloqueados no HTML;
- WhatsApp e Instagram oficiais confirmados pelo operador;
- triagem sem coleta clínica;
- `prefers-reduced-motion`;
- SEO/OG e asset social local.

## Screenshots

Capturas full-page produzidas durante o QA:

- `beleza-leal-360-full.webp`
- `beleza-leal-390-full.webp`
- `beleza-leal-430-full.webp`
- `beleza-leal-1440-full.webp`

As capturas são artefatos de QA da execução F17. O código não depende delas.
