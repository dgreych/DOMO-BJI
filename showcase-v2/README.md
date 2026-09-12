# Domo Showcase V2 — Foundation

Status desta pasta: fundação brand-agnostic isolada. Não substituir a homepage pública antes do gate final.

## Objetivo

Sustentar a oferta `PORTFOLIO_FIRST_FREE_DEMO_OFFER` provando capacidade por resultado, não por tecnologia ou quantidade de telas.

A arquitetura inclui:

- sistema de portfólio com taxonomia explícita de prova (`DEMONSTRAÇÃO`, `CONCEITO`, `EXPERIMENTO`);
- browser frames e previews reutilizáveis;
- slides de capacidade orientados a resultado;
- motion progressivo com fallback e `prefers-reduced-motion`;
- CTA primário rastreável por contexto;
- estrutura mobile-first com CTA persistente apenas em telas pequenas;
- hierarquia semântica, canonical, Open Graph, Twitter Card e JSON-LD;
- camada `tokens.css` como única costura de identidade para o handoff F05 V2.

## Costura F05 V2

Quando `assets/brand/v4/domo/` estiver disponível e autoritativo:

1. mapear cores, tipografia, raio e motion para `assets/tokens.css`;
2. substituir wordmark/fallback visual pelos assets oficiais;
3. substituir a imagem OG temporária pelo asset OG V4;
4. executar o contrato e a bateria visual completa;
5. só então avaliar promoção para a homepage.

Nenhum arquivo da fundação referencia antecipadamente um caminho V4 inexistente.

## Gates antes de publicar como homepage

- mobile QA
- desktop QA
- portfolio QA
- CTA QA
- OG QA
- SEO QA
- performance QA
- path preservation QA

O contrato automatizado está em `tests/showcase-v2-foundation.test.mjs` e também protege byte a byte a homepage V1 e as árvores `/legado/`, `/fitaroni/` e `/demos/` contra alterações acidentais nesta rodada.

## Publicação

Enquanto o gate completo não estiver em PASS, esta pasta permanece staging de branch. A homepage V1 em `/` continua sendo a versão pública canônica.
