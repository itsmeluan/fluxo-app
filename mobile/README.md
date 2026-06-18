# FLUXO — mobile (protótipo)

App Expo + React Native + TypeScript. Hoje só implementa o fluxo do motor de captura
(golden source, seção 3.13) — não é o app completo.

## Setup

```
npm install
npx expo install --fix   # alinha as libs nativas com o SDK do Expo instalado
cp .env.example .env     # preencher EXPO_PUBLIC_API_URL com o IP do backend na sua rede
npx expo start
```

Abra no Expo Go (Android/iOS) escaneando o QR code, ou num simulador (`npx expo start --ios`
/ `--android`).

**Importante sobre `EXPO_PUBLIC_API_URL`:** se for testar no celular físico com Expo Go,
`localhost` não aponta para o seu computador — use o IP da sua máquina na rede local
(ex.: `http://192.168.1.10:3000`), com o backend rodando e acessível nessa rede.

## Telas

| Tela | Estado |
|---|---|
| `OnboardingScreen` | Stub — só um botão "Continuar", sem conteúdo real ainda |
| `DashboardScreen` | Stub — só um botão para abrir a tela de Captura |
| `CaptureScreen` | **Implementada de verdade** — câmera/galeria → chama o backend → mostra rascunho editável → confirmação explícita (sem persistir ainda, ver nota abaixo) |

## Sobre a "confirmação" na tela de Captura

O botão "Confirmar lançamento" hoje só mostra um alerta com o JSON final — porque o
backend ainda não tem `POST /entries`. O que importa neste protótipo é provar que o
**princípio de confiança** da seção 3.13 do golden source está implementado na UI: a
imagem nunca se transforma em lançamento sem o usuário ver e poder editar cada campo
primeiro.

## Assets faltando

`app.json` referencia `./assets/icon.png`, que não existe neste protótipo (não é
necessário para rodar via Expo Go — só importa para builds nativos assinados). Adicione
um ícone antes de gerar builds de loja.
