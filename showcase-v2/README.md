# Domo Showcase V2

Showcase comercial da **Domo — tecnologia sob medida**, construída sobre a fundação brand-agnostic F13 e finalizada com a identidade F05 V2 `MINERAL_SIGNAL`.

## Posicionamento

A página apresenta capacidade por resultado, não por stack ou quantidade de telas. O objetivo é sustentar uma abordagem comercial baseada em prova: trabalhos navegáveis, problema concreto e CTA direto para uma demo gratuita quando fizer sentido.

## Identidade aplicada

Fonte operacional consumida de `dgreych/osiris@front/f05-identidade`:

- `assets/brand/v4/domo/`;
- direção `MINERAL_SIGNAL`;
- Ink `#171412`;
- Bone `#F2EBDD`;
- Ember `#F35B3F`;
- Citrus `#D6E85A`;
- Manrope + IBM Plex Mono.

A camada `assets/mineral-signal.css` aplica a identidade sobre a arquitetura já existente. A fundação não foi reconstruída.

## Provas exibidas

- Jair Neto — `DEMONSTRAÇÃO`;
- Criativo Design — `DEMONSTRAÇÃO`;
- Ferrini CrossFit — `DEMONSTRAÇÃO`;
- Fitaroni — `EXPERIMENTO`;
- Legado — `EXPERIMENTO`.

Nenhuma demonstração é apresentada como cliente ou case contratado.

## QA

A branch executa contrato estático e browser QA em Chromium, cobrindo 360×800, 390×844, 768×1024, 1366×768 e 1920×1080, além de reduced-motion, console errors, overflow, imagens, CTAs e paths protegidos.

Evidências ficam em `qa/showcase-v2/` após execução do workflow.
