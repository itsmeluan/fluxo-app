# FLUXO — Especificação de telas para implementação

Companion do mockup interativo `FLUXO-mockup.html`. Abra os dois lado a lado: o
HTML mostra a navegação clicável, este arquivo descreve o que cada tela precisa
fazer de verdade — estado, validação, chamadas de API, e o que já existe vs. o
que é novo. Escrito para o Claude Code implementar diretamente.

Toda a numeração de seções (3.5, 3.13, US-00x, Fluxo 1/2/3, Part 5.2) referencia
`FLUXO-product-doc.md`, o golden source. Onde este documento e o golden source
divergirem, o golden source vence — mas marquei abaixo os pontos onde tive que
tomar uma decisão de design não totalmente coberta pelo doc (ver "Decisões
abertas").

## 0. Status real da implementação (auditado nesta sessão, não confie no CLAUDE.md para isso)

O `CLAUDE.md` do repo está desatualizado em dois pontos — não copie as
afirmações dele sobre captura/persistência. Estado real, verificado lendo o
código:

| Área | Status real |
|---|---|
| `mobile/src/screens/CaptureScreen.tsx` | **Completo.** Câmera/galeria → `extractCapture()` → rascunho editável → `confirmarLancamento()` chama `createEntry()` de verdade (POST /entries) e mostra `Alert.alert` de sucesso. Não é mais um stub que só exibe JSON. |
| `backend/src/routes/entries.ts` — `POST /entries` | **Existe e funciona.** Valida com zod, mapeia enums minúsculos→Prisma, seta `confirmadoPeloUsuario: true` (único lugar do código que faz isso — principio de confiança 3.13 preservado). |
| `backend/src/routes/capture.ts` — `POST /capture/extract` | **Existe e funciona.** Não escreve no banco (confirmado por leitura — não importa `prisma`). |
| `GET /entries` (listar lançamentos) | **Não existe.** Necessário para Home, Histórico, Contracheque, Detalhe do salário. |
| `BucketConfig` — rotas (`GET`/`PUT`) | **Não existem.** Só o model Prisma existe; nenhuma rota lê/escreve nele ainda. |
| `DespesaFixa` | **Não existe nem como model.** `schema.prisma` não tem essa entidade. Precisa de migration nova. |
| Cálculo de fôlego/runway | **Não existe em nenhuma camada.** |
| `backend/src/services/taxEngine.ts` — `calcularImposto()` | Existe, mas é **órfão** — nenhuma rota chama essa função hoje. Valores explicitamente marcados como não-autoritativos no próprio arquivo. |
| `mobile/src/screens/OnboardingScreen.tsx` | Stub puro — só título + botão "Continuar" → Dashboard. |
| `mobile/src/screens/DashboardScreen.tsx` | Stub puro — só botão para Capture. |
| `mobile/src/navigation/index.tsx` | `RootStackParamList` tem só `Onboarding \| Dashboard \| Capture`, todos `undefined`. |

Tudo na tabela acima que diz "não existe" é trabalho novo descrito nas seções
seguintes — não é regressão nem coisa que eu quebrei.

## 1. Sistema de design (já estabelecido pelo código real — não inventar um novo)

Extraído de `CaptureScreen.tsx`, usado consistentemente no mockup HTML:

- Fundo de tela: `#0F172A` · Cards/inputs: `#1E293B` (campo interno mais escuro `#0F172A`)
- Primária (sucesso/CTA): `#22C55E`, texto sobre ela em `#0F172A` (nunca branco)
- Texto secundário: `#94A3B8` · Texto terciário/placeholder: `#64748B`
- Aviso: `#FBBF24` · Erro/perigo: `#F87171`
- Botão primário: `paddingVertical 14-15`, `borderRadius 12-14`, peso 700
- Cards: `borderRadius 16`, padding 16-20
- Copy em português direto, sem jargão financeiro — ver tom em `FLUXO-product-doc.md` 3.4 (proposta de valor) e nas strings já escritas em `CaptureScreen.tsx`

## 2. Navegação — extensão do `RootStackParamList`

Arquivo: `mobile/src/navigation/index.tsx`. Hoje só tem 3 rotas; adicionar:

```ts
export type RootStackParamList = {
  Onboarding: undefined;
  Dashboard: undefined;
  Capture: undefined;
  NovaEntrada: undefined;
  EntradaConfirmacao: {
    valor: number;
    tipo: "receita" | "despesa";
    splits?: Partial<Record<BaldeSugerido, number>>; // ausente quando tipo === "despesa"
  };
  SalarioDetalhe: undefined;
  PagarConfirmacao: { valorDisponivel: number };
  BaldesConfig: undefined;
  DespesasFixas: undefined;
  Historico: undefined;
  HistoricoMesDetalhe: { mes: string; ano: number; valor: number };
  Contracheque: { mes?: string; ano?: number }; // undefined = último mês fechado; usado por deep link de push
  AlertaImposto: undefined; // usado por deep link de push
};
```

Registrar `Capture`, `EntradaConfirmacao` e `PagarConfirmacao` como
`presentation: "modal"` (mesmo padrão já usado por `Capture`) — são
confirmações de uma ação, não navegação lateral.

**Onboarding continua sendo UMA tela** (`OnboardingScreen.tsx`), não 5 rotas
separadas. Os 5 passos (tipo de trabalho → regime → meta → baldes → primeira
entrada) são estado interno (`useState<number>` para o step atual), igual ao
que o mockup HTML faz com `.screen` + dots. Razão: nenhum desses passos precisa
ser deep-linkável nem voltar via botão físico entre apps; uma tela só com
estado é mais simples de revisar que 5 entradas no stack.

## 3. Telas

Cada seção: arquivo, estado, dados (de onde vêm), ações, e o que é novo vs. existente.

### 3.1 Onboarding (`mobile/src/screens/OnboardingScreen.tsx` — expandir stub existente)

Implementa Fluxo 1 do golden source (3.7) + US-001/US-002.

Estado interno:
```ts
const [step, setStep] = useState(0); // 0..4
const [tipoTrabalho, setTipoTrabalho] = useState<string | null>(null);
const [regime, setRegime] = useState<"mei" | "carne_leao" | "simples" | null>(null);
const [metaSalario, setMetaSalario] = useState("4000");
const [baldes, setBaldes] = useState({ salario: 0.5, imposto: 0.15, reserva: 0.25, reinvestimento: 0.10 });
```

- **Passo 0 — tipo de trabalho:** chips de seleção única (Design, Dev/Tech,
  Marketing/Conteúdo, Saúde/Bem-estar, Consultoria, Educação, Outro).
  "Continuar" desabilitado até selecionar uma.
- **Passo 1 — regime tributário:** chips (MEI, Autônomo/carnê-leão, Simples
  Nacional, Não sei). Implementa decisão D5 (suportar os 3, não só MEI).
- **Passo 2 — meta de salário:** input numérico grande, valor inicial sugerido
  `4000`. Sem mínimo/máximo arbitrário — qualquer número positivo é válido.
- **Passo 3 — baldes sugeridos:** 4 sliders (Salário/Imposto/Reserva/Reinvestimento),
  valor inicial = defaults do `BucketConfig` no Prisma (`0.5/0.15/0.25/0.1`).
  Mostrar soma em tempo real; avisar (não bloquear) se ≠ 100%.
  ⚠️ ver "Decisões abertas #1" — o golden source 3.7 só menciona 3 baldes nesse
  passo; o schema já tem 4. Resolvido aqui incluindo os 4 desde o início.
- **Passo 4 — primeira entrada:** três botões — "📷 Capturar recibo" (→
  `Capture`), "✍️ Registrar manualmente" (→ `NovaEntrada`), link "Começar sem
  dados" (→ `Dashboard`).

**Ao concluir** (em qualquer um dos 3 caminhos do passo 4, ou ao voltar de
`Capture`/`NovaEntrada` com sucesso): persistir `tipoTrabalho`, `regime`,
`metaSalario`, `baldes` — isso requer endpoints novos, ver §4. Até esses
endpoints existirem, pode persistir em `AsyncStorage` localmente como
stand-in (mesmo nível de "dev-only" que `getDevUserId()` já usa no backend).

### 3.2 Dashboard / Home (`mobile/src/screens/DashboardScreen.tsx` — expandir stub existente)

Hub central — todas as outras telas (exceto Onboarding/Capture) são acessadas
a partir daqui. Implementa o conceito das duas perguntas-âncora (Part 5):
"quanto posso me pagar" e "por quanto tempo aguento".

Dados necessários (todos novos — ver §4):
- Saldo disponível do balde `salario` do mês corrente, e % da meta (`GET /entries` agregado, ou um futuro `GET /resumo-mensal`)
- Fôlego em meses (cálculo de runway — despesas fixas ÷ saldo dos baldes reserva+salario)
- Saldo dos baldes imposto/reserva/reinvestimento
- Próxima data de vencimento de imposto + se o balde cobre (ver `taxEngine.ts`)

Componentes/ações:
- Card do salário (toque → `SalarioDetalhe`): número grande formatado em BRL,
  pill de status com 3 limiares de cor — `>=90%` verde, `50-89%` amarelo,
  `<50%` vermelho (mesma lógica de semáforo da seção 3.5/Ângulo A) — barra de
  progresso usando os mesmos limiares.
- Card de fôlego: texto fixo explicando o cálculo (não esconder a lógica —
  US relevante pede transparência).
- 3 gauges de balde (Imposto/Reserva/Reinvestimento) — toque → `BaldesConfig`.
- Banner de alerta de imposto (verde se coberto, vermelho se não) — toque → `AlertaImposto`.
- Ações rápidas: "+ Nova entrada" (→ `NovaEntrada`), "📷 Capturar" (→ `Capture`).
- Links de rodapé: Histórico (→ `Historico`), Despesas fixas (→ `DespesasFixas`), Contracheque do mês passado (→ `Contracheque`, sem params = último mês fechado).

### 3.3 Nova entrada (`mobile/src/screens/NovaEntradaScreen.tsx` — novo arquivo)

Registro manual rápido — meta de ≤15s (Part 5.2, prioridade promovida a topo).

Estado: `valor: string`, `tipo: "receita" | "despesa"` (default `"receita"`),
`data: string` (default hoje), `de: string` (cliente/descrição).

- Input de valor grande, igual ao padrão visual de `CaptureScreen.tsx`.
- Toggle receita/despesa (pills, não dropdown — menos toque).
- Chips de clientes recentes abaixo do campo "De" (autocompletar sem digitar) —
  requer um endpoint de clientes recentes distintos (`GET /entries/clientes-recentes`
  ou derivar client-side de uma lista já carregada); aceitável fazer client-side
  no MVP.
- Botão "Registrar" → valida valor > 0 → chama `createEntry()` (já existe em
  `mobile/src/api/client.ts`, **reaproveitar, não duplicar**) com
  `origem: "manual"`, `balde: "indefinido"` (ou o balde sugerido pelas % de
  `BucketConfig` se você decidir auto-sugerir — golden source não exige isso
  para entrada manual, só para captura) → navega para `EntradaConfirmacao`
  passando `valor`, `tipo`, e os splits calculados a partir de `BucketConfig`
  do usuário (se `tipo === "receita"`).

### 3.4 Confirmação de entrada (`mobile/src/screens/EntradaConfirmacaoScreen.tsx` — novo, modal)

Tela compartilhada entre o fluxo manual (3.3) e o fluxo de captura (3.5) —
**não duplicar essa UI dentro de `CaptureScreen.tsx`**, navegar para esta tela
em ambos os casos depois que `createEntry()` retornar com sucesso.

Recebe via params: `valor`, `tipo`, `splits?`.
- Se `tipo === "despesa"`: "R$X registrados como despesa." sem split.
- Se `tipo === "receita"`: lista cada balde com valor calculado
  (`valor * percentual`), ícone de check, formatado em BRL.
- Botões: "Fechar" (→ `Dashboard`, reset stack), "Ver meus baldes" (→ `BaldesConfig`).

⚠️ Isso implica uma mudança pequena em `CaptureScreen.tsx`: hoje
`confirmarLancamento()` termina com `Alert.alert(...)` + `limparFormulario()`.
Trocar o `Alert.alert` de sucesso por `navigation.navigate("EntradaConfirmacao", {...})`
mantendo o resto da função igual. É a única mudança pedida no arquivo já
existente — não tocar em mais nada dele.

### 3.5 Captura (`mobile/src/screens/CaptureScreen.tsx` — já implementado, ver nota acima)

Sem mudanças estruturais. Único ajuste: a navegação pós-sucesso descrita em
3.4. Toda a lógica de extração, edição de rascunho e persistência já está
correta e não deve ser reescrita.

### 3.6 Detalhe do salário (`mobile/src/screens/SalarioDetalheScreen.tsx` — novo)

Implementa Fluxo 3 (3.7) — "Quanto posso me pagar este mês com segurança?".

- Número grande + % da meta + barra de progresso (mesmos limiares de cor do Dashboard).
- Linhas de contexto: nº de entradas no mês, saldo do balde imposto, saldo do
  balde reserva com progresso textual (ex. "mês 2 de 3 no objetivo" — requer
  que `BucketConfig`/objetivo de reserva tenha uma meta de tempo, que **não
  existe no schema hoje** — ver Decisões abertas #2).
- Botão "Quero me pagar agora" → `PagarConfirmacao` passando o saldo disponível
  do balde salario.

### 3.7 Confirmação de pagamento (`mobile/src/screens/PagarConfirmacaoScreen.tsx` — novo, modal)

- Texto: valor disponível para transferir, aviso de que isso debita do balde Salário.
- "Confirmar registro" / "Cancelar".
- ⚠️ Decisões abertas #3 — ver abaixo: isso precisa de um conceito de
  "retirada" que não existe no modelo `Entry` hoje.

### 3.8 Configuração de baldes (`mobile/src/screens/BaldesConfigScreen.tsx` — novo)

- Chips de regime tributário (mesmas 3 opções do onboarding) — editar aqui deve
  re-disparar o cálculo de imposto futuro, não só trocar um label.
  4 sliders idênticos ao passo 3 do onboarding, carregando valores reais de
  `GET /bucket-config` (novo endpoint, §4) em vez de defaults locais.
- "Salvar alterações" → `PUT /bucket-config` (novo endpoint, §4).

### 3.9 Despesas fixas (`mobile/src/screens/DespesasFixasScreen.tsx` — novo)

Promovida a "Must" no Part 5.2 — é o insumo do cálculo de fôlego.

- Lista de despesas (descrição + valor + remover).
- Form de adicionar (descrição + valor).
- Total mensal somado, com nota explicando que alimenta o cálculo de runway.
- Requer model `DespesaFixa` novo no Prisma + rotas `POST`/`GET`/`DELETE` (§4).

### 3.10 Histórico (`mobile/src/screens/HistoricoScreen.tsx` — novo)

Demovida de "Must" para "Should" no Part 5.2 — não bloquear o MVP por essa tela.

- Gráfico de barras dos últimos 12 meses, linha tracejada na meta de salário.
- Texto de tendência (cresceu/caiu X% vs. trimestre anterior — cálculo simples no client a partir dos 12 valores).
- Toque numa barra → `HistoricoMesDetalhe` com `mes`, `ano`, `valor`.
- Requer `GET /entries` com agregação mensal (§4) — não existe hoje.

### 3.11 Detalhe do mês (`mobile/src/screens/HistoricoMesDetalheScreen.tsx` — novo)

Tela simples, recebe os params já calculados pela tela anterior — sem chamada de API própria.

### 3.12 Contracheque (`mobile/src/screens/ContrachequeScreen.tsx` — novo)

Implementa US-007 — alvo de deep link da notificação push do dia 1 do mês.

- Salário recebido no mês, imposto reservado, variação vs. mês anterior, maior cliente do mês.
- Aceita params opcionais `{ mes?, ano? }` — sem params, busca o último mês fechado.
- "Fechar" → `Dashboard`.

### 3.13 Alerta de imposto (`mobile/src/screens/AlertaImpostoScreen.tsx` — novo)

Implementa US-008 — alvo de deep link da notificação 5 dias antes do vencimento da DAS/guia.

- Dois estados: coberto (verde, "✓ seu balde cobre a guia de R$X") / insuficiente
  (vermelho, com CTA "Registrar entrada" → `NovaEntrada`).
- Usa `calcularImposto()` de `taxEngine.ts` (hoje órfão — esta é a primeira tela
  que de fato o chamaria) comparado ao saldo do balde imposto.
- Lembrar visualmente que os valores são estimativas (o próprio `taxEngine.ts`
  já se descreve assim) — não prometer precisão fiscal na cópia da tela.

## 4. Trabalho de backend necessário (nenhuma rota abaixo existe hoje)

1. **`GET /bucket-config`, `PUT /bucket-config`** — ler/atualizar o `BucketConfig`
   do usuário (`getDevUserId()` já dá o padrão de auth-stub a seguir).
2. **`GET /entries`** com filtros de mês/ano e agregação — alimenta Dashboard,
   Histórico, Contracheque, Detalhe do salário. Considerar parâmetros
   `?mes=&ano=` e um shape de resposta com totais já somados por balde, para
   não obrigar o client a agregar uma lista grande.
3. **Model `DespesaFixa`** novo em `schema.prisma` (`id`, `userId`, `descricao`,
   `valor`, timestamps) + migration + rotas `POST /despesas-fixas`,
   `GET /despesas-fixas`, `DELETE /despesas-fixas/:id`.
4. **Cálculo de fôlego (runway)** — endpoint ou função pura reaproveitável
   (ex. `GET /runway`) = `(saldo balde reserva + saldo balde salario) / soma(despesas fixas)`,
   em meses. Confirmar a fórmula exata com o golden source 3.5/5.2 antes de
   travar — o doc fala do conceito mas a fórmula literal não está 100%
   explícita nesta versão; o que está acima é a leitura mais direta.
5. **Ligar `taxEngine.ts`** a uma rota real (provavelmente dentro do payload de
   `GET /bucket-config` ou um `GET /alerta-imposto` dedicado) — hoje a função
   existe mas nada a chama.

## 5. Decisões abertas (não resolvidas silenciosamente — confirmar antes ou durante a implementação)

1. **4 baldes no onboarding vs. 3 no golden source 3.7.** O texto do fluxo de
   onboarding do golden source descreve ajuste de 3 percentuais (Imposto/
   Reserva/Salário implícito). O `schema.prisma` já tem um 4º campo,
   `percentReinvestimento`, com default `0.1`. Este spec resolve incluindo os
   4 desde o onboarding — mas vale confirmar com o usuário se Reinvestimento
   deveria começar oculto/avançado para não sobrecarregar a primeira tela.
2. **Meta de tempo da reserva** ("mês 2 de 3 no objetivo", citado no Fluxo 3 do
   golden source) não tem campo correspondente no `BucketConfig` atual. Se
   esse texto for mantido na tela de Detalhe do salário, precisa de um campo
   novo (ex. `reservaObjetivoMeses`) — não inventei esse campo no Prisma
   porque é uma decisão de produto, não só técnica.
3. **"Quero me pagar agora" não tem representação no modelo de dados.** Hoje
   `Entry` só modela receitas/despesas que entram nos baldes — não existe o
   conceito de "saída do balde Salário para a conta pessoal do usuário". Antes
   de implementar `PagarConfirmacao` de verdade (e não só como mockup),
   alguém precisa decidir: isso é um novo `TipoLancamento` (ex. `RETIRADA`),
   um novo model, ou só um decremento de saldo sem registro de lançamento?
   Essa decisão afeta diretamente como "saldo disponível" é calculado em todo
   o resto do app — recomendo resolver isso antes da tela 3.6/3.7, não depois.

## 6. Ordem de build sugerida

1. Backend: `GET/PUT /bucket-config`, `GET /entries` agregado, model+rotas de `DespesaFixa`.
2. Mobile: expandir `OnboardingScreen.tsx` (wizard de 5 passos, §3.1).
3. Mobile: expandir `DashboardScreen.tsx` com dados reais (§3.2) — depende do passo 1.
4. Mobile: `NovaEntradaScreen.tsx` + `EntradaConfirmacaoScreen.tsx` (§3.3/3.4) — reaproveitar `createEntry()` existente.
5. Pequeno ajuste em `CaptureScreen.tsx` para navegar para `EntradaConfirmacao` (§3.4).
6. Resolver Decisão aberta #3 (retirada/pagamento) → então `SalarioDetalheScreen.tsx` + `PagarConfirmacaoScreen.tsx`.
7. `BaldesConfigScreen.tsx`, `DespesasFixasScreen.tsx`.
8. Backend: cálculo de runway, ligar `taxEngine.ts` a uma rota.
9. `HistoricoScreen.tsx` + `HistoricoMesDetalheScreen.tsx` + `ContrachequeScreen.tsx`.
10. `AlertaImpostoScreen.tsx` — por último, depende do passo 8 e de infra de push notification (fora do escopo deste spec).
