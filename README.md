# FLUXO

> "Seu salário, mesmo sem patrão." — golden source completo em `FLUXO-product-doc.md`.

Este repositório contém o protótipo inicial do FLUXO, focado em validar primeiro a peça de **maior risco técnico do produto**: o motor de captura (câmera/imagem → lançamento estruturado), conforme a seção 3.13 do golden source.

## Estrutura

```
FLUXO-product-doc.md              golden source — toda a documentação de produto
FLUXO-formulario-e-divulgacao.md  conteúdo da pesquisa de validação online
FLUXO-validation-survey-config.json  config da pesquisa (csv_url) p/ monitoramento automático
FLUXO-validation-tracking.md      log vivo das respostas da pesquisa

backend/    API (Fastify + TypeScript) — hoje só o essencial p/ testar o motor de captura
mobile/     App (Expo + React Native + TypeScript) — Android + iOS a partir do mesmo código
```

## O que já existe (Sprint 1 — protótipo)

- **Backend:** endpoint `POST /capture/extract` que recebe uma imagem (recibo, comprovante de PIX, anotação manuscrita) e usa a API de visão da Anthropic para devolver um rascunho estruturado de lançamento (valor, data, tipo, categoria, balde sugerido) — ver seção 3.13 do golden source para o raciocínio completo.
- **Mobile:** tela de Captura (câmera ou galeria) que envia a imagem pro backend e mostra o rascunho **editável** antes de salvar — o princípio de confiança da seção 3.13 (nunca lançar sem revisão do usuário) já está implementado na UI, não só documentado.
- Schema de dados inicial (Prisma) com as entidades base: usuário, lançamento, configuração de baldes.
- Telas de Dashboard e Onboarding como stubs (estrutura de navegação pronta, conteúdo a construir na próxima fatia).

## O que falta (próximas fatias, não bloqueia o teste do motor de captura)

- Persistência real (rodar `prisma migrate` contra um Postgres — hoje o schema existe mas não há banco conectado).
- Autenticação.
- Cálculo real de salário do mês / runway / imposto (hoje os baldes existem como modelo de dados, não como lógica).
- Build nativo assinado para lojas (isso é só protótipo local via Expo Go/dev build).

## Como rodar localmente

Pré-requisitos: Node.js 20+, uma conta Anthropic com chave de API (para o motor de captura), e (mais adiante) um Postgres para persistência real.

### Backend
```
cd backend
npm install
cp .env.example .env   # preencher ANTHROPIC_API_KEY
npm run dev
```

### Mobile
```
cd mobile
npm install
npx expo install --fix   # alinha versões das libs nativas com o SDK do Expo instalado
cp .env.example .env     # preencher EXPO_PUBLIC_API_URL com o endereço do backend (ex: http://localhost:3000)
npx expo start
```
Abra no Expo Go (Android/iOS) ou num simulador.

> Os `npm install` não foram executados neste ambiente porque o protótipo foi montado num sandbox Linux e o app roda no seu Mac — instalar aqui geraria binários nativos incompatíveis. Os `package.json` já estão prontos; só falta instalar na sua máquina.
