# FLUXO — Documento de Planejamento de Produto
**"Seu salário, mesmo sem patrão."**

---

## Metadados

| Campo | Valor |
|---|---|
| Versão | 0.2 — Decisões fundacionais tomadas + validação online em andamento |
| Data | Junho 2026 (última atualização: 17/06/2026) |
| Status | Decisões D1–D5 fechadas. Validação real rodando online em paralelo ao desenvolvimento. |
| Autor | Brainstorm com Claude (Anthropic) |
| Próxima revisão | Em marcos de amostra da pesquisa online (50 / 150 / 385 respostas) — ver Parte 6 |

---

## Índice

1. [Contexto e motivação](#1-contexto-e-motivação)
2. [PARTE 1 — Ideação completa](#parte-1--ideação-completa)
   - 1.1 Decomposição dos momentos de dor
   - 1.2 Jobs to Be Done (JTBD)
   - 1.3 Personas
   - 1.4 Mapeamento de workarounds
   - 1.5 Análise competitiva
   - 1.6 Ângulos de solução
3. [PARTE 2 — Triagem e pesquisa](#parte-2--triagem-e-pesquisa)
   - 2.1 Critérios de triagem
   - 2.2 Avaliação de cada ângulo
   - 2.3 Ângulo selecionado e justificativa
   - 2.4 Validação de mercado
   - 2.5 Hipóteses críticas
   - 2.6 Análise de risco
4. [PARTE 3 — Planejamento e especificação](#parte-3--planejamento-e-especificação)
   - 3.1 Visão do produto
   - 3.2 Posicionamento
   - 3.3 Persona principal
   - 3.4 Proposta de valor
   - 3.5 Mapa de funcionalidades
   - 3.6 User stories do MVP
   - 3.7 Fluxos principais
   - 3.8 Modelo de receita
   - 3.9 Métricas de sucesso
   - 3.10 Go-to-market inicial
   - 3.11 Próximos passos (decisões D1–D5 + trilhas paralelas)
   - 3.12 Arquitetura e stack técnica
   - 3.13 Motor de captura — especificação
5. PARTE 4 — Pesquisa com usuários (simulada + plano real)
6. PARTE 5 — Plano de MVP revisado (pós-pesquisa)
7. PARTE 6 — Plano de validação real (online, contínuo, em paralelo ao desenvolvimento)
   - 6.1 A matemática dos 95%
   - 6.2 Survey online contínuo
   - 6.3 Distribuição em grupos de Facebook
   - 6.4 Monitoramento automático das respostas
   - 6.5 Cronograma — marcos de amostra
   - 6.6 Sinais de confirmação/morte por hipótese
   - 6.7 Critério de refinamento
8. [Referências](#referências)

---

# 1. Contexto e Motivação

## Por que este problema

O mercado de trabalho independente é um dos maiores movimentos estruturais da economia atual. Segundo o relatório State of Independence 2025 da MBO Partners, **72,9 milhões de americanos** trabalham de forma independente — e o Brasil tem mais de **25 milhões de MEIs e autônomos** registrados, número que cresce consistentemente.

O paradoxo: essas pessoas constroem carreira e ganham bem, mas vivem com uma ansiedade financeira crônica que trabalhadores com carteira assinada não têm. Não é falta de renda — é falta de previsibilidade. E nenhuma ferramenta foi construída especificamente para esse problema.

## O insight central

> *"O dinheiro é real. O timing é que está quebrado."*

Assinar um contrato de R$10.000 na segunda-feira não significa ter R$10.000 disponíveis. O cliente pode pagar em 30, 45 ou 90 dias. O aluguel vence no dia 1. O imposto do trimestre acumula silenciosamente. Esse descompasso — não a falta de renda — é a fonte da ansiedade.

---

# PARTE 1 — Ideação Completa

## 1.1 Decomposição dos Momentos de Dor

O problema "renda irregular" não é monolítico. Ele se manifesta em **5 momentos distintos**, cada um com uma dor específica e uma pergunta central sem resposta:

---

### Momento 1: Quando o dinheiro entra
**Situação:** Um pagamento chega na conta.
**Dor:** O freelancer não sabe quanto desse dinheiro é "realmente dele". Parte é imposto. Parte deveria ir para reserva. O que sobra para gastar?
**Pergunta sem resposta:** *"Quanto desse dinheiro eu posso usar?"*
**Comportamento atual:** Transferem tudo para conta pessoal e torcem para sobrar no final do mês.
**Consequência:** Gastam demais nos meses bons e ficam apertados nos meses ruins.

---

### Momento 2: No fim do mês, hora de pagar as contas
**Situação:** Contas fixas vencem. O freelancer olha o saldo e não sabe se está bem ou mal.
**Dor:** Sem referência de "salário", não existe parâmetro para avaliar se o mês foi bom. R$5.000 no saldo parece ótimo até lembrar que o INSS, o aluguel e as ferramentas somam R$4.200.
**Pergunta sem resposta:** *"Estou bem financeiramente ou estou me enganando?"*
**Comportamento atual:** Planilha manual, ou simplesmente não calculam — vivem no susto.

---

### Momento 3: Quando chega o mês seco
**Situação:** Nenhum projeto novo. Um cliente atrasou. O mês vai fechar no vermelho.
**Dor:** Não existe reserva estruturada. Os meses gordos foram gastos inteiros. Agora a única saída é crédito caro (cartão, cheque especial) ou pedir dinheiro emprestado.
**Pergunta sem resposta:** *"Por quanto tempo consigo sobreviver com o que tenho guardado?"*
**Comportamento atual:** 80% não conseguem cobrir uma emergência de R$5.000 sem recorrer a crédito. [Bankrate/Upwork, 2025]
**Consequência:** Dívidas com juros altos que corroem os ganhos dos próximos meses bons.

---

### Momento 4: Na declaração de imposto (ou no carnê-leão mensal)
**Situação:** É hora de pagar o imposto. O valor é uma surpresa.
**Dor:** Ninguém reservou dinheiro mês a mês. A DAS do MEI, o carnê-leão, o IR sobre rendimentos — chegam todos de uma vez e o dinheiro que "sobrou" ao longo do ano já foi gasto.
**Pergunta sem resposta:** *"Quanto eu devia ter guardado de imposto mês a mês?"*
**Comportamento atual:** Calculam (ou tentam calcular) uma vez por ano, às pressas, com ajuda do contador.
**Consequência:** Parcelamentos, multas, ou empréstimos para pagar imposto — que é o pior uso possível de crédito.

---

### Momento 5: Ao tomar uma decisão grande
**Situação:** Oportunidade de comprar um equipamento, tirar uma viagem, contratar um funcionário, ou fazer um curso caro.
**Dor:** O freelancer não tem base para decidir se pode ou não. Sem projeção de fluxo futuro, qualquer decisão é um chute.
**Pergunta sem resposta:** *"Com base no que está entrando agora e no que espero nos próximos meses, posso tomar essa decisão?"*
**Comportamento atual:** Decidem pelo feeling, ou adiam indefinidamente por insegurança.
**Consequência:** Oportunidades perdidas por excesso de cautela, ou decisões ruins por falta de informação.

---

## 1.2 Jobs to Be Done (JTBD)

O framework JTBD ajuda a entender o que o usuário está realmente tentando fazer — além da funcionalidade superficial.

### Job Principal (Funcional)
> *"Quando recebo pagamentos irregulares, quero saber exatamente quanto posso me pagar, quanto guardar de imposto e quanto tenho de reserva — sem precisar montar uma planilha toda vez."*

### Jobs Secundários

| Job | Momento | Resultado esperado |
|---|---|---|
| Separar imposto automaticamente | Quando dinheiro entra | Nunca ser surpreendido na declaração |
| Simular quanto durariam minhas reservas | Quando o mês está seco | Saber quantos meses consigo sem novo projeto |
| Entender se meu negócio está crescendo | Fim de trimestre | Decisão de escalar ou pivotar |
| Ter base para uma decisão de gasto grande | Antes de uma compra/investimento | Segurança para dizer sim ou não |

### Job Emocional (mais importante que os funcionais)
> *"Quero parar de ter aquela calculadora de fundo na cabeça. Quero saber, de forma simples e clara, se estou bem."*

Este é o job que nenhum concorrente endereça diretamente. Todas as ferramentas existentes são contabilidade. O que o freelancer quer é **paz de espírito** — e isso é diferente de planilha.

### Job Social
> *"Quero poder falar com confiança sobre minha situação financeira, sem fingir que tudo está ótimo ou sentir vergonha de não saber meus próprios números."*

---

## 1.3 Personas

### Persona A: "Laís, a Designer Freelancer"

| Campo | Descrição |
|---|---|
| Nome fictício | Laís |
| Idade | 29 anos |
| Localização | São Paulo, SP |
| Situação profissional | Designer UX/UI freelancer há 3 anos. Saiu de emprego CLT por opção. |
| Renda mensal | Média de R$7.000–R$12.000, mas oscila muito. Meses ruins: R$2.500. |
| Clientes | 3–5 clientes ativos por vez. Mix de projetos pontuais e um retainer mensal de R$3.000. |
| Ferramentas atuais | Planilha no Google Sheets (usa há 2 anos, mas desistiu de atualizar), conta PJ no Nubank, nota fiscal manual. |
| Dor principal | "Nos meses que entram R$10k, eu gasto tranquila. Depois vem um mês que não entra nada e eu entro em pânico. Não consigo criar um ritmo." |
| Comportamento financeiro | Não reserva imposto mensalmente. Paga o MEI em atraso às vezes. Não tem reserva de emergência estruturada. |
| Relação com apps | Tentou YNAB (abandonou por ser complexo demais). Usa o app do Nubank para ver saldo. |
| O que ela quer | Uma forma de "pagar salário pra ela mesma" — previsível — mesmo com entrada imprevisível. |
| Disposição de pagar | "Pagaria até R$40/mês se realmente funcionasse." |

---

### Persona B: "Rafael, o Dev Autônomo"

| Campo | Descrição |
|---|---|
| Nome fictício | Rafael |
| Idade | 34 anos |
| Localização | Belo Horizonte, MG / trabalha remoto para clientes EUA |
| Situação profissional | Desenvolvedor backend freelancer. Trabalha com dólares, recebe via Wise. |
| Renda mensal | USD $5.000–$9.000 dependendo do projeto. Câmbio adiciona variação extra. |
| Clientes | 1–2 clientes grandes por vez. Contratos de 3–6 meses. |
| Dor principal | "Quando o contrato termina, entro em modo de desespero. Não sei quanto tempo tenho de runway antes de precisar fechar outro contrato." |
| Comportamento financeiro | Tem dois clientes com pagamento net-45. Já ficou sem saldo pessoal com R$80k prometido para receber. |
| Relação com apps | Usa planilha complexa com fórmulas de runway. Recalcula toda semana. Consome muito tempo. |
| O que ele quer | Saber automaticamente "com meu saldo atual e o que está para entrar, tenho X meses de runway". |
| Disposição de pagar | "Pagaria USD $20/mês facilmente. O que perco em horas de planilha vale muito mais." |

---

### Persona C: "Cláudia, a Nutricionista MEI"

| Campo | Descrição |
|---|---|
| Nome fictício | Cláudia |
| Idade | 41 anos |
| Localização | Porto Alegre, RS |
| Situação profissional | Nutricionista clínica. Atende por consulta (R$200–R$350 cada). MEI. |
| Renda mensal | R$4.000–R$8.000 dependendo de cancelamentos, férias, sazonalidade. |
| Clientes | 40–60 pacientes/mês, mas com cancelamentos frequentes. |
| Dor principal | "Mês de janeiro é morte. Julho também. Não consigo poupar nos meses bons porque não sei exatamente quanto preciso guardar." |
| Comportamento financeiro | Paga DAS do MEI todo mês. Mas não sabe quanto de imposto de renda vai pagar no ajuste anual. Já levou susto duas vezes. |
| Relação com apps | Não usa nenhum app financeiro. Conta no banco normal. Tudo na cabeça. |
| O que ela quer | Algo que não precise aprender. "Me diz o que fazer e eu faço." |
| Disposição de pagar | "Se fosse simples e me poupasse a dor de cabeça, pagaria R$20-R$30/mês." |

---

## 1.4 Mapeamento de Workarounds Atuais

Os workarounds são o sinal mais honesto de que um problema é real. O que freelancers fazem hoje:

| Workaround | Como funciona na prática | Por que é insuficiente |
|---|---|---|
| **Planilha manual** | Coluna de entradas, coluna de saídas, fórmula de saldo. Atualizada quando lembram. | Desatualiza rápido. Não prevê. Não alerta. Requer disciplina constante. |
| **"Duas contas bancárias"** | Uma conta PJ para receber clientes, uma pessoal para gastar. Transfere manualmente quando quer "pagar o salário". | Sem critério de quando e quanto transferir. Continua sendo manual e sem regra. |
| **Regra mental dos 30%** | "Guardo 30% de tudo que entra pra imposto." | Impreciso. Não considera tipo de renda, deduções, regime tributário. |
| **Guardar tudo e ver no fim do mês** | Não gastam nada "não essencial" até ver como ficou o mês. | Ansiedade máxima. Qualidade de vida zero. |
| **Contador uma vez por ano** | Jogam tudo no contador na época da declaração. | Reativo. Não ajuda nas decisões do dia a dia. Caro para quem fatura pouco. |
| **WhatsApp com si mesmo** | Mandam mensagem para si mesmos anotando entrada: "Entrada: R$2.500 projeto X". | Não agrega, não analisa, não avisa. |

**O que o workaround revela:** a pessoa já entende que precisa separar dinheiro em categorias (imposto, reserva, pessoal) e que precisa de uma visão de fluxo. O que falta é automação, inteligência e clareza do sinal.

---

## 1.5 Análise Competitiva

### Panorama do mercado

O mercado de finanças pessoais/empresariais para freelancers pode ser dividido em três categorias:

**Categoria 1: Ferramentas de orçamento genéricas**
Construídas para assalariados com renda previsível.

**Categoria 2: Banking fintech para autônomos**
Bancos digitais com features de gestão, mas que requerem troca de banco — alta fricção.

**Categoria 3: Contabilidade/faturamento**
Focadas em nota fiscal, imposto e contabilidade formal. Não resolvem o planejamento pessoal.

---

### Players principais

#### YNAB (You Need A Budget)
- **Preço:** USD $14,99/mês ou $109/ano
- **Proposta:** Orçamento base zero — "dê uma missão para cada dólar"
- **Força:** Metodologia sólida. Comunidade forte. Muda comportamento de longo prazo.
- **Fraqueza crítica para freelancers:** Assume que você sabe quanto vai receber no mês. A metodologia quebra com renda irregular. Curva de aprendizado muito alta — muitos freelancers abandonam.
- **Gap:** Não tem conceito de "income floor", não prevê com base em pipeline, não aloca imposto automaticamente.

#### Lili Bank
- **Preço:** Grátis (Lili Core) a $55/mês (Lili Premium)
- **Proposta:** Conta bancária + ferramentas de imposto + faturamento para autônomos
- **Força:** Aloca % automático para imposto quando dinheiro entra. Fatura ilimitado. Boa para quem não tem banco PJ ainda.
- **Fraqueza crítica:** É um banco — requer trocar de banco (fricção enorme). Não disponível no Brasil. Não tem planejamento de fluxo de caixa futuro. Não diz "quanto você pode se pagar".
- **Gap:** Resolve a alocação de imposto, mas não o planejamento pessoal nem a ansiedade de "estou bem?".

#### Found
- **Preço:** Grátis a $80/mês (Found Pro)
- **Proposta:** Banking + contabilidade + imposto + faturamento para autônomos
- **Força:** Mais robusto que Lili em bookkeeping. Relatório P&L automático.
- **Fraqueza crítica:** Mesmo problema do Lili — é banco, não disponível fora dos EUA, não resolve o planejamento.

#### Wave
- **Preço:** Gratuito
- **Proposta:** Contabilidade e faturamento gratuito
- **Força:** Gratuito. Relatórios básicos. Popular entre MEIs e pequenos negócios.
- **Fraqueza crítica:** Focado em contabilidade retroativa. Não tem planejamento de fluxo. Não há feature de "quanto posso me pagar".

#### QuickBooks / Conta Azul
- **Preço:** R$89–R$399/mês (Conta Azul); USD $35–$235/mês (QuickBooks)
- **Proposta:** Gestão contábil completa para empresas
- **Força:** Robusto. Integração com contadores.
- **Fraqueza crítica:** Overkill total para freelancer individual. Caro. Curva de aprendizado de meses. Focado em empresa, não em pessoa.

#### Planilhas (Google Sheets / Excel)
- **Preço:** Gratuito
- **Proposta:** Personalização total
- **Força:** O freelancer configura exatamente o que precisa.
- **Fraqueza crítica:** Requer manutenção constante. Não integra com banco. Não alerta. Não projeta automaticamente. Abandonada por 70%+ dos usuários em menos de 3 meses.

---

### Mapa de posicionamento

```
                ALTA COMPLEXIDADE
                        |
    QuickBooks ●        |        ● Conta Azul
    Found ●             |
    Lili ●              |
                        |
FOCO EM EMPRESA --------+-------- FOCO EM PESSOA
                        |
    Wave ●              |        ● YNAB
                        |
    Planilhas ●         |        ← GAP: ferramenta simples,
                        |           focada em PESSOA,
                BAIXA COMPLEXIDADE   que entende RENDA IRREGULAR
```

**O gap identificado:** Não existe nenhuma ferramenta simples, focada no freelancer como pessoa (não empresa), que entenda renda irregular como dado de entrada — e que responda a pergunta central: *"Quanto posso me pagar este mês com segurança?"*

---

## 1.6 Ângulos de Solução

Com base no mapeamento de dor, JTBD e análise competitiva, foram gerados 5 ângulos de solução. Cada um é uma framing diferente do mesmo problema — e levaria a produtos muito distintos.

---

### Ângulo A: "Baldes Automáticos" (Smart Buckets)

**Conceito:** Toda vez que dinheiro entra na conta, o app divide automaticamente em baldes: Imposto, Salário Pessoal, Reserva Operacional, Crescimento. O freelancer configura os percentuais uma única vez. O app faz o resto.

**Tela principal:** Quatro baldes com medidores. Verde = balde cheio. Amarelo = atenção. Vermelho = vazio.

**Pergunta central que responde:** *"Quanto tenho disponível em cada balde agora?"*

**Diferencial:** Automação no ponto de entrada do dinheiro. Sem disciplina diária.

**Modelo de negócio implícito:** App de planejamento. Assinatura.

**Riscos:** Precisa integração com banco para detectar entrada automática. Usuário precisa configurar percentuais corretamente (o que muitos não sabem fazer).

---

### Ângulo B: "Salário Inteligente" (Smart Paycheck)

**Conceito:** O app simula um RH pessoal. Todo mês, ele calcula quanto o freelancer pode "se pagar" com base nos contratos ativos, pagamentos recebidos e reserva acumulada — e emite um "contracheque" mensal: *"Seu salário de agosto: R$4.200. Isso é 87% do seu salário-alvo."*

**Tela principal:** Um número grande e claro. Verde/amarelo/vermelho. E o histórico dos últimos 12 meses.

**Pergunta central que responde:** *"Quanto posso me pagar este mês?"*

**Diferencial:** Conceito de "salário-alvo" — o freelancer define quanto quer ganhar e o app mede se está atingindo.

**Modelo de negócio implícito:** Assinatura mensal.

**Riscos:** O cálculo do "quanto posso me pagar" é complexo. Depende de informação sobre o que está para entrar, não só o que entrou.

---

### Ângulo C: "Runway Financeiro" (How Long Can I Last?)

**Conceito:** O app responde uma única pergunta: *"Com o que tenho hoje e o que espero receber, por quanto tempo consigo viver sem novo projeto?"* Mostra um número de meses/semanas e o que aconteceria em cada cenário (otimista, realista, conservador).

**Tela principal:** Uma linha do tempo. "Você tem 2,3 meses de runway. No cenário conservador, 1,1 mês."

**Pergunta central que responde:** *"Por quanto tempo consigo sobreviver?"*

**Diferencial:** Único foco em runway — a métrica que mais importa para freelancers entre contratos.

**Modelo de negócio implícito:** Freemium (runway básico grátis, cenários e alertas no pago).

**Riscos:** Produto muito estreito. Pode não ter uso frequente o suficiente para justificar assinatura. Melhor como feature do que como produto standalone.

---

### Ângulo D: "CFO na Palma da Mão" (AI Financial Advisor)

**Conceito:** Um assistente de IA conversacional que age como CFO pessoal. O freelancer conta sobre seus projetos, pagamentos esperados, despesas planejadas — e o assistente diz o que fazer: *"Com base no que você me contou, pague-se R$3.500 este mês, não compre aquele equipamento agora, e reserve R$1.200 para o imposto de setembro."*

**Interface:** Chat. Inputs via texto ou voz.

**Pergunta central que responde:** *"O que devo fazer com meu dinheiro agora?"*

**Diferencial:** Resposta personalizada e contextual. Não é dashboard — é conselho.

**Modelo de negócio implícito:** Assinatura com tiers de uso.

**Riscos:** Requer confiança alta do usuário. Regulação de aconselhamento financeiro pode ser um obstáculo. Dependência de qualidade do LLM. Difícil de testar sem dados reais do usuário.

---

### Ângulo E: "Pipeline + Fluxo" (Forward-Looking Cash Flow)

**Conceito:** O freelancer registra seus projetos em andamento, propostas enviadas e contratos assinados — com valores e datas esperadas de pagamento. O app constrói um fluxo de caixa dos próximos 3 meses com probabilidade por cenário, e cruza com as despesas fixas para mostrar quanto sobra.

**Tela principal:** Gráfico de barras dos próximos 12 semanas. Verde = provável. Amarelo = incerto. Vermelho = buraco de caixa previsto.

**Pergunta central que responde:** *"O que vai acontecer com meu dinheiro nos próximos 3 meses?"*

**Diferencial:** Forward-looking. Antecipa problemas antes que aconteçam.

**Modelo de negócio implícito:** Assinatura. B2B potencial para agências pequenas.

**Riscos:** Requer que o usuário alimente o pipeline ativamente. Carga de dados alta. Risco de abandono por fricção.

---

# PARTE 2 — Triagem e Pesquisa

## 2.1 Critérios de Triagem

Cada ângulo foi avaliado em 6 dimensões, com notas de 1 a 5:

| Critério | Descrição | Peso |
|---|---|---|
| **Profundidade da dor** | O quanto resolve a dor central (ansiedade de "estou bem?") | 30% |
| **Simplicidade** | Quão fácil de entender e usar sem onboarding longo | 20% |
| **Buildabilidade** | Viabilidade de MVP em poucas semanas, 100% software | 20% |
| **Diferenciação** | Distância real dos concorrentes existentes | 15% |
| **Monetização** | Clareza e força do modelo de receita | 15% |

---

## 2.2 Avaliação dos Ângulos

| Ângulo | Profundidade da dor (30%) | Simplicidade (20%) | Buildabilidade (20%) | Diferenciação (15%) | Monetização (15%) | **Score ponderado** |
|---|---|---|---|---|---|---|
| A — Baldes Automáticos | 4 | 5 | 3 | 4 | 4 | **4.0** |
| B — Salário Inteligente | 5 | 4 | 4 | 5 | 5 | **4.6** |
| C — Runway Financeiro | 3 | 5 | 5 | 3 | 2 | **3.5** |
| D — CFO com IA | 5 | 3 | 3 | 5 | 4 | **4.1** |
| E — Pipeline + Fluxo | 4 | 2 | 3 | 4 | 4 | **3.4** |

---

### Análise individual

**Ângulo A (Baldes):** Forte em simplicidade e diferenciação, mas a automação de detecção de entrada de dinheiro exige integração bancária — alta fricção técnica e regulatória, especialmente no Brasil. É a feature certa, mas o produto sozinho resolve só metade da dor.

**Ângulo B (Salário Inteligente):** Resolve o job emocional mais importante — "estou bem?" — com um número simples. O conceito de "salário-alvo" cria uma âncora psicológica poderosa. Alta diferenciação: ninguém posiciona o produto dessa forma. Monetização clara porque o valor é imediato e pessoal.

**Ângulo C (Runway):** A pergunta "quanto tempo tenho?" é legítima, mas é uma feature, não um produto. Uso episódico (só quando está preocupado) não sustenta assinatura.

**Ângulo D (CFO com IA):** Máxima profundidade de dor — mas alta complexidade de construção e regulação. Risco de ser percebido como "mais um chatbot". Pode ser a versão futura do produto, não o MVP.

**Ângulo E (Pipeline):** Muito poderoso para devs e designers que têm pipeline previsível, mas requer carga de dados intensa. Mais adequado para agências do que freelancers individuais.

---

## 2.3 Ângulo Selecionado e Justificativa

### Selecionado: **Ângulo B — "Salário Inteligente"**, com elementos do Ângulo A

**Conceito híbrido:** Um app que transforma renda irregular em um salário mensal previsível para o freelancer. Quando dinheiro entra (registrado manualmente ou detectado via Open Finance), o app aloca automaticamente em três baldes: Imposto, Reserva e Salário Disponível. No final de cada mês, o app emite um "contracheque" com o valor seguro para o freelancer se pagar.

### Por que este ângulo:

**1. Resolve o job emocional, não só o funcional.**
A pergunta "quanto posso me pagar?" é simples, mas carrega todo o peso emocional do problema. Uma resposta clara a essa pergunta — semana após semana — é o que transforma ansiedade em controle. Nenhum concorrente posiciona seu produto assim.

**2. O conceito de "salário" é universalmente compreensível.**
Não é "fluxo de caixa", não é "envelope budgeting", não é "zero-based budgeting". É: *você tem um salário. O app calcula qual é.* Esse framing reduz a curva de aprendizado para zero.

**3. É diferente de tudo que existe.**
Lili e Found alocam imposto — mas são bancos, não disponíveis no Brasil, e não respondem "quanto posso me pagar". YNAB usa envelopes — mas assume renda regular e é complexo. Planilhas — manuais, abandonadas. **O posicionamento de "salário para freelancer" é um espaço vazio no mercado.**

**4. MVP é 100% software, construível em dias.**
Não precisa de integração bancária no MVP. O usuário registra entradas manualmente (ou importa extrato). O app faz os cálculos. A integração bancária via Open Finance é V2.

**5. Monetização imediata e clara.**
Quem vê o valor paga. Não é um "nice to have". É o produto que salva o freelancer de uma espiral de dívida toda vez que usa.

---

## 2.4 Validação de Mercado

### Tamanho de Mercado

#### Brasil (mercado primário)
- MEIs ativos: ~15 milhões (Sebrae, 2025)
- Autônomos sem CNPJ com renda relevante: estimados ~10 milhões adicionais
- Freelancers digitais (design, dev, marketing, consultoria): ~3–5 milhões
- **TAM Brasil:** ~25 milhões de potenciais usuários
- **SAM (freelancers digitais com smartphone e disposição de pagar):** ~3 milhões
- **SOM (ano 1, com marketing focado):** 30.000–100.000 usuários pagantes

#### Global (mercado secundário — V2)
- Força de trabalho independente EUA: 72,9 milhões (MBO Partners, 2025)
- Europa: ~30 milhões de trabalhadores autônomos estimados
- **TAM global:** ~150 milhões de freelancers

### Willingness to Pay

Dados coletados de pesquisas de mercado e benchmarks:

- **YNAB cobra USD $14,99/mês** e tem uma base fiel de usuários que consideram o preço justificado
- **Lili Pro custa USD $15/mês**, com recursos similares mas como banco
- **Personas entrevistadas (fictícias, baseadas em padrões de pesquisa):**
  - Laís (Designer): "Pagaria até R$40/mês"
  - Rafael (Dev): "Pagaria USD $20/mês"
  - Cláudia (Nutricionista): "Pagaria R$20–R$30/mês se fosse simples"

**Benchmark de pricing:** R$19,90–R$39,90/mês para o mercado brasileiro parece o sweet spot. Equivalente a ~USD $4–8/mês — abaixo dos concorrentes americanos e acessível para o público-alvo.

### Sinais de Demanda Confirmados

- 44% dos freelancers reportam fluxo de caixa irregular como problema central (Upwork Freelance Forward Report, 2025)
- 45% tiveram declínio de saúde mental em 2024, com insegurança financeira como principal causa
- 80% não conseguiriam cobrir emergência de USD $1.000 sem crédito
- "Ferramentas não conseguem resolver renda irregular" — citado diretamente em pesquisa acadêmica de 2025 (ResearchGate)
- Nenhum app específico para freelancers domina as buscas no Brasil — campo aberto

---

## 2.5 Hipóteses Críticas

Estas são as suposições que, se falsas, matariam o produto. Cada uma precisa ser validada antes de escalar.

| # | Hipótese | Como validar | Prazo |
|---|---|---|---|
| H1 | Freelancers brasileiros pagariam R$19,90–R$39,90/mês por essa solução | Landing page com botão "entrar na lista" + pré-venda de 50 usuários | Semanas 1–4 |
| H2 | O registro manual de entradas (sem integração bancária) não é fricção suficiente para abandonar o produto | Protótipo funcional + 10 usuários testando por 2 semanas | Semanas 3–6 |
| H3 | O conceito de "salário mensal" ressoa com o usuário como framing central (vs. "orçamento" ou "controle financeiro") | 5 entrevistas qualitativas com personas + teste A/B de landing page | Semanas 1–3 |
| H4 | A alocação de imposto automática é percebida como um dos benefícios mais valiosos | Entrevistas + análise de quais features geram mais engajamento no MVP | Semanas 4–8 |
| H5 | Usuários continuam usando após o primeiro mês (retenção mês 1 > 60%) | Acompanhamento de coorte pós-lançamento | Mês 2–3 |

---

## 2.6 Análise de Risco

### Riscos do produto

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Usuário não registra entradas consistentemente (abandono por fricção) | Alta | Alto | Onboarding guiado; lembretes inteligentes; importação de extrato CSV |
| Usuário não confia no cálculo do "salário" sem entender a lógica | Média | Alto | Total transparência: mostrar como o número foi calculado |
| Concorrente grande (Nubank, Conta Azul) lança feature similar | Média | Alto | Mover rápido; comunidade forte; nicho muito específico |
| Complexidade tributária brasileira (MEI, carnê-leão, Simples) torna cálculo impreciso | Alta | Médio | Começar com MEI (mais simples); avisar que é estimativa, não consultoria |

### Riscos de mercado

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| Público-alvo não percebe o problema como "solucionável com software" | Média | Alto | Conteúdo educativo forte; comunidades de freelancers como canal |
| Mercado demasiado fragmentado para atingir escala | Baixa | Médio | Focar em vertical específica (designers, devs) no início |
| Regulação de Open Finance atrasar integração bancária | Baixa | Baixo | MVP não depende de Open Finance |

---

# PARTE 3 — Planejamento e Especificação

## 3.1 Visão do Produto

> **FLUXO é o app que transforma renda irregular em um salário previsível — para que freelancers e autônomos saibam, a qualquer momento, exatamente quanto podem se pagar com segurança.**

A visão em 5 anos: FLUXO é a ferramenta financeira padrão do trabalhador independente brasileiro — assim como a CTPS foi o documento padrão do CLT. Todo freelancer que recebe seu primeiro pagamento por projeto abre o FLUXO para saber o que fazer com ele.

---

## 3.2 Posicionamento

**Posicionamento formal (para uso interno e pitch):**

> *"Para freelancers e autônomos que sofrem com a ansiedade da renda irregular, o FLUXO é o app de gestão financeira que calcula automaticamente quanto você pode se pagar todo mês — ao contrário de apps genéricos como YNAB e planilhas, que assumem que você tem salário fixo e exigem trabalho manual constante."*

**Tagline:** "Seu salário, mesmo sem patrão."

**Anti-posicionamento (o que FLUXO NÃO é):**
- Não é um banco (sem conta, sem cartão)
- Não é contabilidade (não substitui contador)
- Não é app de nota fiscal (não emite NF)
- Não é para empresas (é para a pessoa física do freelancer)

---

## 3.3 Persona Principal (MVP) **[ATUALIZADO 17/06 — decisão D2]**

> Decisão anterior (v0.1) restringia o MVP a um perfil único (digital, design/dev/marketing). **Essa restrição foi revertida.** O MVP agora é deliberadamente amplo: **qualquer freelancer ou autônomo (MEI ou Simples/carnê-leão) com renda irregular**, independente de área.

**Por que abrir o segmento em vez de escolher um beachhead a priori:**
- O founder quer descobrir, com dados reais de uso, quais segmentos e quais features mais "pegam" — em vez de apostar isso na mesa de planejamento.
- As personas A (Designer), B (Dev) e C (Nutricionista MEI) da seção 1.3 continuam válidas como arquétipos de referência para design e copy, mas nenhuma delas exclui as outras no onboarding ou no produto.
- Implicação direta: o app precisa instrumentar telemetria de segmento desde o dia 1 (área de atuação, regime tributário, ferramentas usadas) para que essa aposta seja avaliável em poucos meses — sem isso, "deixar a segmentação emergir" vira só uma forma de não decidir.

**O que não muda:** a dor central (momentos 1–5 da seção 1.1) é tratada como universal entre freelancers, e é isso que justifica testar amplo primeiro.

---

## 3.4 Proposta de Valor

### Para o usuário:

**Primário:** Saber, no dia 1 de cada mês, exatamente quanto pode transferir para sua conta pessoal — sem surpresas de imposto, sem ficar no negativo em meses ruins, sem gastar demais nos meses bons.

**Secundário:** Parar de fazer cálculo mental constante. Parar de sentir que está sempre "no limite". Ter um histórico financeiro confiável.

### Declaração de valor (para usar em marketing):

> *"Você ganha bem. Você só não sabe exatamente o quanto. O FLUXO sabe."*

---

## 3.5 Mapa de Funcionalidades

### MVP (Versão 0.1 — Validação)

O objetivo do MVP é validar as hipóteses H1, H2 e H3 com o menor investimento possível. Deve ter uma funcionalidade central que entregue o valor imediatamente.

| Feature | Descrição | Prioridade |
|---|---|---|
| **Motor de Captura (câmera + import de imagem)** **[NOVO 17/06]** | Usuário fotografa ou importa imagem de recibo, comprovante de PIX ou anotação manuscrita; o app extrai e sugere o lançamento (valor, data, tipo, balde). Ver especificação completa na seção 3.13. | Must Have |
| **Registro de entrada (manual)** | Usuário registra manualmente um pagamento recebido (valor + data + fonte) — caminho de fallback sempre disponível quando não há recibo/foto | Must Have |
| **Configuração de baldes** | Define % para Imposto, Reserva e Salário. Padrões inteligentes por regime (MEI ou Simples/carnê-leão — D5). | Must Have |
| **Cálculo automático do salário do mês** | Com base no que entrou, quanto pode ser transferido para conta pessoal este mês | Must Have |
| **Dashboard de baldes** | Visualização clara dos três baldes com nível atual | Must Have |
| **Histórico de meses anteriores** | Gráfico simples de "salário recebido" por mês nos últimos 12 meses | Must Have |
| **Alerta de imposto** | Aviso quando o balde de imposto está alto o suficiente para cobrir a DAS/carnê-leão | Should Have |
| **Despesas fixas mensais** | Registro das contas fixas para calcular quanto do salário vai comprometido | Should Have |

### V1 (Versão de lançamento público — 3 meses após MVP)

| Feature | Descrição | Prioridade |
|---|---|---|
| **Importação de extrato CSV** | Detecta entradas automaticamente via extrato bancário CSV | Must Have |
| **Projeção de próximo mês** | Com base em projetos futuros registrados, estima salário do próximo mês | Must Have |
| **Relatório mensal por email** | "Seu resumo financeiro de agosto" com salário, imposto reservado e variação vs. mês anterior | Must Have |
| **Metas de reserva** | Define meta de reserva de emergência (ex: 3 meses de salário-alvo) e acompanha progresso | Should Have |
| **Categorização de despesas** | Classifica gastos em categorias para análise de onde vai o dinheiro | Should Have |
| **Widget de home screen** | Mostra saldo do balde "Salário" direto na tela inicial do celular | Nice to Have |

### V2 (6–12 meses — Crescimento)

| Feature | Descrição |
|---|---|
| **Open Finance / integração bancária** | Sincronização automática com contas PJ/PF via Open Finance (BR) ou Plaid (EUA) — **sem parceria bancária ativa por ora (D4); revisitar só se fricção de captura/CSV se mostrar bloqueador real** |
| **Cálculo de imposto avançado** | Refinamento das tabelas progressivas de MEI/Simples/carnê-leão já suportadas de forma básica no MVP (D5) — faixas, deduções e estimativa mais precisa |
| **Pipeline de projetos** | Registra propostas/contratos com probabilidade de fechamento para projeção de fluxo |
| **Compartilhamento com contador** | Exportação de relatórios no formato que contadores precisam |
| **Versão para agências** | Multi-usuário, múltiplas "fontes de renda" por membro do time |
| **Assistente IA (CFO)** | Responde perguntas em linguagem natural sobre a situação financeira |

---

## 3.6 User Stories do MVP

### Épico 1: Onboarding

**US-001:** Como freelancer que acabou de baixar o FLUXO, quero configurar meu perfil em menos de 3 minutos para que o app entenda minha situação sem precisar de tutorial longo.

*Critérios de aceitação:*
- Onboarding em no máximo 5 telas
- Pergunta obrigatória: tipo de trabalho (Design / Dev / Marketing / Outro) e regime tributário (MEI / Autônomo / Simples)
- Sugere automaticamente a alocação de % com base no perfil
- Usuário pode alterar os % sugeridos antes de confirmar

---

**US-002:** Como freelancer configurando o FLUXO, quero que o app sugira automaticamente qual % separar para imposto com base no meu tipo de trabalho, para que eu não precise pesquisar essa informação.

*Critérios de aceitação:*
- MEI: sugere 5–7% (DAS + reserva para ajuste anual)
- Autônomo PF (carnê-leão): sugere 15–27% dependendo da faixa de renda esperada
- Exibe aviso: "Esta é uma estimativa. Confirme com seu contador para sua situação específica."

---

### Épico 2: Registro de Entrada

**US-003:** Como freelancer que acabou de receber um pagamento, quero registrar a entrada em menos de 30 segundos para que o app saiba que recebi e atualize meus baldes.

*Critérios de aceitação:*
- Tela de "Nova Entrada" acessível com 1 tap da home
- Campos: Valor, Data (default: hoje), Origem (dropdown: nome de cliente ou campo livre)
- Após confirmar, mostrar imediatamente a distribuição nos três baldes
- Animação visual de "dinheiro caindo nos baldes" para reforçar o comportamento

---

**US-004:** Como freelancer, quero ver claramente como minha entrada foi dividida (imposto, reserva, salário) imediatamente após o registro, para sentir que tomei a decisão certa.

*Critérios de aceitação:*
- Tela de confirmação mostra: "De R$5.000 recebidos: R$1.250 → Imposto | R$750 → Reserva | R$3.000 → Seu salário"
- Opção de "editar divisão" se usuário quiser ajustar naquela entrada específica

---

### Épico 3: Dashboard e Salário do Mês

**US-005:** Como freelancer, quero ver ao abrir o app quanto está disponível no meu balde de "Salário" para que eu saiba quanto posso transferir para minha conta pessoal este mês.

*Critérios de aceitação:*
- Número do "Salário disponível" é o elemento principal da home, maior que tudo
- Indicador verde/amarelo/vermelho baseado na comparação com o salário-alvo configurado
- Verde: ≥ 90% do salário-alvo | Amarelo: 50–89% | Vermelho: < 50%
- Subtexto contextual: "Você atingiu 87% do seu salário-alvo este mês."

---

**US-006:** Como freelancer, quero ver um resumo dos meus 12 últimos meses para entender se minha renda está crescendo, estável ou caindo.

*Critérios de aceitação:*
- Gráfico de barras: um bar por mês, altura = salário daquele mês
- Linha tracejada: salário-alvo
- Toque em qualquer bar mostra detalhes daquele mês
- Indicador de tendência: "↑ Crescendo 12% vs. trimestre anterior"

---

### Épico 4: Alertas e Notificações

**US-007:** Como freelancer, quero receber uma notificação no dia 1 de cada mês com o "contracheque" do mês anterior, para ter o ritual de saber exatamente quanto ganhei.

*Critérios de aceitação:*
- Notificação push às 9h do dia 1: "Seu salário de agosto foi R$4.200 ✓"
- Toca na notificação → abre tela de resumo do mês
- Resumo inclui: salário recebido, imposto reservado, variação vs. mês anterior, maior cliente do mês

---

**US-008:** Como freelancer, quero ser alertado quando meu balde de imposto está alto o suficiente para pagar a DAS do próximo mês, para que eu nunca pague MEI em atraso.

*Critérios de aceitação:*
- Notificação 5 dias antes do vencimento da DAS: "Seu balde de imposto tem R$850. A DAS de setembro é R$76,90. Você está coberto! ✓"
- Se balde insuficiente: "Atenção: sua DAS de setembro é R$76,90 e seu balde de imposto tem apenas R$30. Registre suas entradas de agosto para atualizar."

---

## 3.7 Fluxos Principais

### Fluxo 1: First Run Experience (FRE)

```
Abertura do app
     ↓
"Qual é seu tipo de trabalho?"
(Design / Dev / Marketing / Saúde / Outro)
     ↓
"Como você é registrado?"
(MEI / Autônomo / Simples Nacional / Não sei)
     ↓
"Quanto você quer ganhar por mês?"
(Salário-alvo: R$_____)
     ↓
"Separamos esses % para você. Pode ajustar:"
[Imposto: 7%] [Reserva: 15%] [Salário: 78%]
     ↓
"Registre sua última entrada para começar"
(ou "Começar sem dados")
     ↓
HOME — Dashboard com baldes (começam vazios se sem dados)
     ↓
Tooltip: "Quando dinheiro entrar, toque em + para registrar"
```

---

### Fluxo 2: Registro de Entrada

```
Home Screen
     ↓
Toque no botão "+ Entrada"
     ↓
Tela simples:
[R$ ________] ← Teclado numérico abre automaticamente
[Data: Hoje ▾] ← Dropdown de data
[De: ________] ← Campo texto ou dropdown de clientes recentes
     ↓
Toque "Registrar"
     ↓
Animação: dinheiro se divide nos baldes
     ↓
Tela de confirmação:
"R$5.000 divididos:
✓ R$350 → Imposto
✓ R$750 → Reserva
✓ R$3.900 → Seu Salário"
     ↓
[Fechar] [Ver meus baldes]
```

---

### Fluxo 3: "Quanto posso me pagar?" (check de decisão)

```
Usuário abre app com intenção de transferir dinheiro
     ↓
Home mostra: "Salário disponível: R$3.900" (verde)
     ↓
Usuário toca no número
     ↓
Tela de detalhe:
"Seu salário este mês
R$3.900 (97% do seu alvo de R$4.000)
[████████████░░] ← barra de progresso

Já foram 4 entradas neste mês.
Seu balde de imposto tem R$350 guardados.
Sua reserva tem R$1.200 (mês 2 de 3 no seu objetivo)."
     ↓
Botão: "Quero me pagar agora"
     ↓
"Você pode transferir até R$3.900 para sua conta pessoal.
Lembre-se: isso descontará do seu balde de Salário."
[Confirmar registro] [Cancelar]
```

---

## 3.8 Modelo de Receita

### Estratégia: Freemium com conversão pelo valor gerado

O freemium para finanças pessoais funciona melhor quando o tier gratuito cria o hábito e o tier pago entrega o resultado completo.

### Tier Gratuito — "FLUXO Básico"
- Registro manual de até 3 entradas por mês
- Histórico dos últimos 3 meses
- 1 balde (apenas Salário — sem separação de Imposto e Reserva)
- Sem alertas ou notificações

*Objetivo: criar o hábito de registrar e ver o "salário"*

### Tier Pago — "FLUXO Pro" — R$19,90/mês ou R$179/ano

- Entradas ilimitadas
- 3 baldes (Imposto + Reserva + Salário)
- Histórico completo
- Contracheque mensal por notificação/email
- Alertas de DAS/imposto
- Importação de extrato CSV
- Projeção básica do próximo mês
- Despesas fixas e cálculo de "quanto sobra"

### Tier Premium — "FLUXO CFO" — R$39,90/mês (lançar em V2)

- Tudo do Pro
- Integração Open Finance (automação total)
- Pipeline de projetos e fluxo projetado
- Relatório exportável para contador
- Assistente IA para perguntas sobre situação financeira
- Multi-banco e multi-conta

### Projeção financeira (conservadora, ano 1)

| Mês | Usuários cadastrados | Conversão para Pago | MRR |
|---|---|---|---|
| 3 | 500 | 10% (50 pagantes) | R$995 |
| 6 | 2.000 | 15% (300 pagantes) | R$5.970 |
| 9 | 5.000 | 18% (900 pagantes) | R$17.910 |
| 12 | 10.000 | 20% (2.000 pagantes) | R$39.800 |

*ARR ao final do ano 1 (conservador): ~R$480.000*
*ARR ao final do ano 1 (realista): ~R$800.000–R$1.2M com crescimento acelerado*

---

## 3.9 Métricas de Sucesso

### North Star Metric

> **"Número de freelancers que receberam seu contracheque mensal pelo FLUXO nos últimos 30 dias"**

Esta métrica captura: (1) usuários ativos, (2) que chegaram ao fim do ciclo mensal, (3) gerando o valor central do produto. É o indicador mais claro de que o produto está resolvendo o problema.

---

### Métricas por fase

#### Fase de validação (meses 1–2)
| Métrica | Meta |
|---|---|
| Usuários na lista de espera | 500 |
| Taxa de abertura do email de lançamento | >40% |
| Taxa de cadastro no app | >25% dos convidados |
| Usuários que registraram ao menos 1 entrada | >50% dos cadastrados |

#### Fase de MVP (meses 3–5)
| Métrica | Meta |
|---|---|
| Retenção dia 7 | >40% |
| Retenção mês 1 | >30% |
| % que recebeu "contracheque" no mês 1 | >20% dos cadastrados |
| NPS | >50 |
| Taxa de conversão Grátis → Pago | >10% |

#### Fase de crescimento (meses 6–12)
| Métrica | Meta |
|---|---|
| MRR | R$40.000+ |
| Churn mensal | <5% |
| CAC (Custo de Aquisição por Cliente pago) | <R$30 |
| LTV (12 meses) | >R$200 |
| LTV/CAC | >6x |

---

### Métricas de produto (saúde)

| Métrica | Frequência de acompanhamento |
|---|---|
| DAU/MAU (ratio de engajamento) | Semanal |
| Tempo médio na sessão | Semanal |
| Features mais usadas | Semanal |
| Entradas registradas por usuário/mês | Mensal |
| Motivos de cancelamento (churn survey) | Sempre que churn ocorre |

---

## 3.10 Go-to-Market Inicial

### Filosofia
Crescimento orgânico primeiro. Frequentadores de comunidades de freelancers têm alta confiança em recomendações de pares e baixíssima confiança em anúncios. O canal de aquisição mais poderoso é: *freelancer bem-sucedido conta para outro freelancer que resolveu o problema de dinheiro*.

### Fase 0 — Pré-lançamento (semanas 1–4)
**Objetivo:** 500 pessoas na lista de espera antes de existir qualquer produto

- Landing page simples: uma frase, uma imagem do "contracheque", email de cadastro
- Publicação do founder em comunidades de freelancers: "Estou resolvendo um problema que todo freela tem. Me conta como você lida com a renda irregular?" — conversa antes de produto
- Comunidades alvo: grupos do Facebook (Freelancers Brasil, Design Freelancer), Reddit (r/freela), Discord de devs, grupos de nutricionistas/psicólogos MEI no WhatsApp
- Meta: 500 emails na lista

### Fase 1 — Beta fechado (semanas 4–8)
**Objetivo:** 50 beta testers usando ativamente, NPS > 50

- Convidar os primeiros 50 da lista com perfil mais aderente (designers e devs)
- Check-in semanal com cada usuário (call de 15 min)
- Iterar produto semanalmente com base no feedback
- Não pensar em monetização ainda — entender o valor

### Fase 2 — Lançamento público (mês 3)
**Objetivo:** 2.000 cadastros, 200 pagantes no primeiro mês

- Ativação da lista de espera completa
- Conteúdo de lançamento: "Como calculo meu salário como freela" (artigo + carrossel)
- Programa de referência simples: "indique um freela, ganhe 1 mês grátis"
- Presença em podcasts de freelancing e empreendedorismo (custo zero, alto impacto)
- PR: pitch para Exame, InfoMoney, Pequenas Empresas Grandes Negócios

### Fase 3 — Crescimento (meses 4–12)
- SEO em palavras-chave com alta intenção: "como controlar renda irregular", "imposto MEI", "orçamento freelancer"
- Parcerias com ferramentas complementares (Bonsai, Toggl, Notion) — integração ou co-marketing
- Afiliados: creators de conteúdo sobre carreira freelancer
- Primeiros anúncios pagos só após LTV/CAC confirmado > 3x

---

## 3.11 Próximos Passos

### Decisões fundacionais — TOMADAS em 17/06/2026

| # | Decisão | Resolução | Implicações |
|---|---|---|---|
| D1 | Nome do produto | **FLUXO** (fechado) | Usado em todo o doc; landing page e assets podem seguir |
| D2 | Segmento inicial | **Amplo — todos os freelancers/autônomos**, não um beachhead estreito. O MVP é deliberadamente genérico; segmento(s) de maior encaixe serão descobertos por telemetria de uso real (quem ativa, quem retém, quais features usa) | Supera a hipótese de beachhead da Parte 5 (ver nota lá). Onboarding e copy não podem assumir nicho (ex: não falar só de "projetos de design") |
| D3 | Tech stack | **Nativo mobile-first**: app para **Android e iOS**, com **versão web posterior** que consome a mesma API/backend (companion, não app paralelo). Founder não tem preferência de stack — recomendação técnica na seção 3.12 | Arquitetura precisa nascer com API separada do client desde o dia 1, mesmo lançando só mobile primeiro |
| D4 | Parceria bancária / Open Finance | **Não agora.** Sem integração de Open Finance e sem parceria com Pluggy/Belvo/BCB no horizonte atual. Fica em V2+ sem prazo — só revisitar se a demanda por importação automática de extrato se mostrar um bloqueador real de retenção | Reforça a importância do motor de captura (3.13) como a via principal de entrada de dados no MVP |
| D5 | Regimes tributários suportados | **MEI e Simples Nacional/Autônomo (carnê-leão)** no MVP — não só MEI | Cálculo do balde de imposto precisa de duas lógicas de estimativa (tabela MEI fixa vs. progressiva do carnê-leão), selecionadas no onboarding |

> Isso substitui as decisões pendentes da v0.1 deste documento. Seções 3.3, 5.1, 5.2 e 5.5 foram atualizadas para refletir D2, D4 e D5 — procure pelas marcas **[ATUALIZADO 17/06]**.

---

### Sequência de execução recomendada (revisada — duas trilhas em paralelo)

A trilha de produto **não espera** a trilha de validação. Elas correm simultaneamente e se cruzam em marcos de amostra (ver Parte 6).

```
TRILHA A — PRODUTO                          TRILHA B — VALIDAÇÃO (Parte 6)
─────────────────────                       ──────────────────────────────
SEMANA 1–2:                                  SEMANA 1 em diante (contínuo):
  Definir arquitetura (3.12)                   Survey online ao vivo,
  Protótipo do motor de captura                divulgado em grupos de Facebook
  (3.13) — maior risco técnico                 e comunidades de freelancers/MEI
  do produto, validar primeiro                 Monitoramento automático das
                                                respostas (diário)
SEMANA 3–6:
  MVP nativo: registro manual +              MARCO 1 (~50 respostas):
  motor de captura + 3 baldes +                primeiro check de direção
  cálculo de salário/runway                    (dor #1, framing, segmento)
  Onboarding genérico (D2)
                                              MARCO 2 (~150 respostas):
SEMANA 6–10:                                   sinal de disposição a pagar
  Beta fechado (30–50 testers)                  começa a ficar confiável
  recrutados a partir da própria
  lista de espera do survey                  MARCO 3 (~385 respostas):
                                                95% de confiança estatística
MÊS 3:                                         → consolidar achados no golden
  Lançamento público Freemium                  source e ajustar roadmap
  Meta: 2.000 cadastros, 200 pagantes

MÊS 4–6: iteração por dados de uso real (qual segmento/feature emerge)
MÊS 6–9: V1 — projeção de próximo mês, categorização, export p/ contador
MÊS 9–12: reavaliar Open Finance (D4) com dados reais de fricção
```

---

## 3.12 Arquitetura e Stack Técnica (decisão D3) **[NOVO 17/06]**

O founder definiu o requisito (Android + iOS nativos agora, web companion depois, sem preferência de stack) e delegou a escolha técnica. Recomendação:

**Princípio de arquitetura:** cliente e backend separados desde o dia 1 — mesmo lançando só mobile, a API já nasce pronta para ser consumida por um segundo cliente (web) sem retrabalho.

| Camada | Recomendação | Por quê |
|---|---|---|
| **Apps mobile (Android + iOS)** | React Native + Expo | Um único codebase para as duas plataformas; ecossistema maduro de câmera (`expo-camera`), galeria e upload de imagem — essencial para o motor de captura (3.13); ciclo de desenvolvimento rápido, importante para iterar com dados de uso reais |
| **Backend / API** | Node.js + TypeScript (NestJS ou Fastify) | Mesma linguagem do client (TS ponta a ponta), contratação/manutenção mais fácil para um time pequeno |
| **Banco de dados** | PostgreSQL (via Supabase ou gerenciado) | Modelo relacional encaixa bem com baldes/lançamentos/regimes tributários; Supabase acelera auth + storage de imagens sem montar infra do zero |
| **Storage de imagens** | Supabase Storage ou S3 | Armazenar as fotos de recibos/anotações capturadas pelo motor de captura |
| **Web companion (fase posterior)** | Next.js consumindo a mesma API | Não é um segundo produto — é outro client da mesma API; dashboard e histórico primeiro, paridade de registro depois |

**Por que não Flutter:** também resolveria Android+iOS+Web, mas o ecossistema de extração de documento/imagem e a integração futura com SDKs de IA (necessários para 3.13) são mais maduros hoje em JS/TS do que em Dart. Reavaliar só se a equipe técnica que entrar tiver forte preferência por Flutter.

> Esta é uma recomendação de ponto de partida, não uma decisão irreversível — mas evita o founder ficar bloqueado em "não sei escolher". Validar com o primeiro dev/CTO que entrar no projeto.

---

## 3.13 Motor de Captura — Especificação **[NOVO 17/06]**

### Por que isso existe
Sem Open Finance (D4) e com público que opera por anotações manuscritas, dinheiro em espécie e PIX pessoa-a-pessoa não estruturado, o **maior risco de adoção não é o cálculo — é o atrito de registrar a entrada**. H7 (seção 2.5 / 5.2) já apontava fricção de registro como risco crítico. O motor de captura é a resposta direta a isso e passa a ser, junto com o registro manual, a porta de entrada principal de dados no MVP.

### O que o usuário faz
1. Tira uma foto (câmera) ou importa uma imagem existente (galeria) — de um recibo, comprovante de PIX, nota fiscal, ou até uma anotação manuscrita numa caderneta/post-it.
2. O app processa a imagem e devolve, em segundos, um **rascunho de lançamento já preenchido**: valor, data, tipo (entrada/despesa), fonte/categoria provável, e balde sugerido (Salário / Imposto / Reserva, ou despesa fixa).
3. Usuário **confirma ou corrige** o rascunho antes de salvar — nunca um lançamento é criado automaticamente sem essa confirmação (ver "Princípio de confiança" abaixo).
4. Suporte a captura em lote (múltiplas fotos de uma vez, ex: pilha de recibos do mês).

### Como funciona (visão técnica)
- **Extração:** usar um modelo multimodal (visão) capaz de ler tanto texto impresso quanto manuscrito em uma única chamada — mais robusto do que um pipeline clássico de OCR + classificador separado, e essencial para lidar com anotações manuscritas informais. A API de visão da Claude (Anthropic) é a candidata natural, dado que o app já é construído nesse ecossistema; Google Cloud Vision/AWS Textract são alternativas caso se precise rodar volume muito alto a custo menor.
- **Classificação:** o mesmo passo de extração já devolve a estrutura sugerida (valor, data, tipo, categoria, balde) via prompt estruturado — não precisa de um segundo modelo.
- **Confirmação:** tela de revisão simples, com os campos extraídos editáveis e em destaque o que o modelo teve baixa confiança (ex: data borrada, valor ambíguo entre R$10 e R$70).

### Princípio de confiança (não negociável)
Extração de imagem erra — principalmente em manuscrito e papel amassado/borrado. **Nunca lançar automaticamente sem revisão do usuário.** O ganho de velocidade vem de não digitar do zero, não de remover o humano do loop. Isso também constrói confiança no produto desde o primeiro uso (ligado ao H9 — confiança no app financeiro).

### Casos de borda a tratar
- Foto ilegível ou sem informação suficiente → app pede novo ângulo/foto em vez de adivinhar.
- Múltiplos valores na mesma imagem (ex: nota com vários itens) → perguntar qual é o lançamento relevante, ou permitir split.
- Pagamento em espécie sem nenhum comprovante físico → fallback para registro manual rápido (não depende só de imagem).
- PIX pessoa-a-pessoa (print de tela do app do banco) → tratado como uma imagem como qualquer outra; o motor lê valor/data do print.

### Onde isso entra no roadmap
MVP (Must Have, seção 3.5) — é a aposta de produto mais arriscada tecnicamente, por isso entra como primeira coisa a prototipar (ver sequência de execução, 3.11, Trilha A).

---

# PARTE 4 — Pesquisa com Usuários (Simulada + Plano Real)

> ## ⚠️ AVISO METODOLÓGICO — LEIA ANTES DE USAR ESTES DADOS
>
> **O que esta Parte 4 É:** uma *pesquisa simulada* (synthetic research). As 1.000 "entrevistas" foram geradas por um modelo de linguagem personificando personas, com respostas calibradas a partir de **dados secundários reais** (IBGE, FGV/IBRE, Payoneer, Rock Content, Upwork, e pesquisas de mercado brasileiras citadas nas Referências).
>
> **O que esta Parte 4 NÃO É:** dados primários. Nenhuma pessoa real foi entrevistada. Os números **não têm** confiança estatística de 95% — confiança estatística é propriedade de amostra de população real, não de simulação.
>
> **Por que ainda assim tem valor:** este é um exercício estruturado de *geração e priorização de hipóteses*. Ele serve para (a) afinar o roteiro de entrevista real, (b) antecipar padrões prováveis, (c) priorizar o que validar primeiro. É a preparação da pesquisa real — não a substituição dela.
>
> **Como ler os níveis de confiança:** cada achado abaixo tem um selo:
> - 🟢 **Alta** — corroborado por múltiplas fontes secundárias reais. Provável que se confirme na pesquisa real.
> - 🟡 **Média** — consistente com padrões conhecidos, mas não medido diretamente. Validar.
> - 🔴 **Baixa** — inferência plausível da simulação, sem suporte direto em dado real. **Tratar como suposição até validar.**
>
> **A Parte 6 traz o plano para converter esta simulação em certeza real** (quantas entrevistas, com quem, qual sinal confirma/mata cada hipótese, e quantos respondentes são necessários para os 95% de verdade).

---

## 4.1 Composição da Amostra (1.000 pessoas)

### Filtro aplicado
A amostra **não** representa todos os 25M de autônomos brasileiros. Ela representa o **público-alvo definido na Parte 3**: freelancer de conhecimento/digital, cuja atividade autônoma é a **renda principal** (não complementar), 25–45 anos, com smartphone e familiaridade com apps. Esse filtro é deliberado — quem tem renda complementar sente menos a dor (a volatilidade é amortecida pelo salário CLT).

### Ancoragem em dados reais
A distribuição foi calibrada por: áreas de atuação freelancer no Brasil (vendas 30%, aulas 13%, design 13%, consultoria 11%, pesquisa 10%, redação/conteúdo 9% — Onlinecurriculo 2024), concentração etária de freelancers digitais em 25–35 anos (Instavagas/IBGE), predominância de homens (66% dos autônomos — FGV/IBRE) mas com equilíbrio maior nas áreas criativas, e dominância do MEI entre os formalizados. **Vendas e entregadores/motoristas foram excluídos** por não serem público-alvo (perfil de dor e disposição a pagar diferentes).

### Distribuição das 1.000 entrevistas por persona

| # | Persona | N | % | Faixa etária dominante | Renda mensal média | Volatilidade | Regime tributário predominante |
|---|---|---|---|---|---|---|---|
| P1 | Designer / Criativo (gráfico, UX/UI, motion, ilustração) | 230 | 23% | 25–38 | R$3.500–9.000 | Alta (projeto) | MEI (60%) |
| P2 | Dev / Tech (dev, dados, QA, infra) | 180 | 18% | 27–42 | R$6.000–18.000 | Média (contratos longos) | MEI/ME (70%) |
| P3 | Marketing / Conteúdo (social, redação, tráfego, SEO) | 210 | 21% | 24–38 | R$2.500–8.000 | Alta (mix projeto+recorrência) | MEI (55%) |
| P4 | Consultor / Serviços profissionais (consultoria, tradução, coach) | 120 | 12% | 30–48 | R$4.000–15.000 | Média-alta | MEI/autônomo (50/40) |
| P5 | Saúde / Bem-estar autônomo (nutri, psi, personal, fono, terapeuta) | 140 | 14% | 28–45 | R$3.000–10.000 | Média (consulta, sazonal) | MEI (75%) |
| P6 | Educação / Aulas particulares (professor, tutor, mentor) | 120 | 12% | 25–50 | R$2.000–6.000 | Alta (sazonal, evasão) | Autônomo informal (60%) |
| | **TOTAL** | **1.000** | **100%** | | | | |

### Overlays demográficos aplicados (calibragem fina)
- **Gênero:** P1 e P3 ~equilibrado (50/50); P2 majoritariamente masculino (~75/25); P5 majoritariamente feminino (~70/30); P4 e P6 equilibrado.
- **Localização:** ~55% Sudeste, 18% Sul, 15% Nordeste, 12% restante (reflete concentração de freelancers digitais).
- **Regime tributário geral da amostra:** MEI 58% · Autônomo informal (sem CNPJ) 28% · ME/Simples 10% · não sabe/outro 4%.
- **Renda como principal fonte:** 100% (filtro aplicado). Nota: na população geral, só 31% têm o freela como renda principal — por isso a amostra é um recorte premium do mercado.

---

## 4.2 Roteiro da Entrevista (ARTEFATO REAL E REUTILIZÁVEL)

> Esta seção é **100% real e profissional**. É o roteiro que você usará nas entrevistas de verdade (Parte 6). Foi construído seguindo os princípios de *The Mom Test* (Rob Fitzpatrick): perguntar sobre comportamento passado concreto, nunca sobre intenção hipotética; nunca vender a ideia durante a descoberta; deixar a reação ao conceito para o final, para não enviesar.

### Estrutura: entrevista de descoberta (45–60 min)

**Bloco 0 — Aquecimento (5 min)**
1. Me conta rapidinho: o que você faz e há quanto tempo trabalha por conta própria?
2. Como é a sua semana típica de trabalho?
3. Hoje, sua renda vem 100% do trabalho autônomo ou você tem outras fontes?

**Bloco 1 — Comportamento financeiro atual (comportamento PASSADO, concreto) (12 min)**
4. Me leva pela última vez que você recebeu um pagamento de cliente. O que você fez com aquele dinheiro, passo a passo?
5. Como você decide, num mês, quanto pode gastar com você mesmo?
6. Você separa o dinheiro de alguma forma quando ele entra? Me mostra como (se topar compartilhar a tela/planilha).
7. Quando foi a última vez que você ficou apertado esperando um pagamento que demorou? O que aconteceu?
8. Como você lida com o imposto hoje? Me conta o que você fez no último ajuste/DAS.

**Bloco 2 — Os momentos de dor (15 min)**
9. Qual foi o último mês "ruim" que você teve? O que você sentiu, e o que você fez?
10. Você consegue dizer, agora, por quantos meses conseguiria se manter se não entrasse nenhum projeto novo? (Observar: hesitação, chute, ou número confiante.)
11. Qual a última vez que você adiou ou desistiu de uma compra/decisão por não ter certeza se podia? Me conta.
12. Em qual desses momentos você sente mais aperto: quando o dinheiro entra, no fim do mês, num mês seco, na hora do imposto, ou numa decisão grande? Por quê?

**Bloco 3 — Workarounds e tentativas anteriores (8 min)**
13. Que ferramenta ou método você usa hoje para se organizar? (planilha, app, caderno, nada?)
14. Você já tentou usar algum app de finanças? Qual? Por que parou (se parou)?
15. O que faltou nas ferramentas que você já testou?

**Bloco 4 — Disposição a pagar (indireta) (5 min)**
16. Você paga por alguma ferramenta hoje pro seu trabalho? Quais e quanto?
17. Se existisse algo que resolvesse [a dor específica que ELE citou como pior], quanto isso valeria pra você por mês?

**Bloco 5 — Reação ao conceito (só agora, no final) (8 min)**
18. Vou te descrever uma ideia e quero sua reação honesta, inclusive negativa. *[Descrever FLUXO: "um app que pega sua renda irregular e te diz, todo mês, quanto você pode se pagar de salário, já separando imposto e reserva automaticamente."]*
19. O que te soa útil nisso? O que te soa inútil ou estranho?
20. O conceito de "te pagar um salário" faz sentido pra você ou soa errado? Por quê?
21. Se isso existisse hoje, o que precisaria ser verdade pra você usar de verdade?

**Encerramento**
22. Tem mais alguém que você acha que sofre com isso e que eu deveria conversar?

### Versão quantitativa (survey) — para o caminho de 200–385 respostas reais
Perguntas-chave para o Google Forms (escala + múltipla escolha), derivadas do roteiro:
- Área de atuação / regime / faixa de renda / % da renda que vem do freela (segmentação)
- "Numa escala de 0–10, quanto a imprevisibilidade da sua renda te causa estresse?" (medir intensidade da dor)
- "Qual destes momentos é o mais difícil pra você?" (os 5 momentos — escolha única)
- "Você separa dinheiro para imposto todo mês?" (sim sempre / às vezes / nunca)
- "Você tem reserva que cobre quantos meses?" (0 / <1 / 1–3 / 3–6 / 6+)
- "O que você usa hoje pra se organizar?" (múltipla)
- "Você já abandonou algum app de finanças? Qual e por quê?" (aberta curta)
- "Quanto pagaria/mês por uma ferramenta que resolvesse isso?" (faixas)
- "O conceito de 'app que te paga um salário' soa: muito útil / útil / indiferente / estranho"

---

## 4.3 Resultados Simulados (Quantitativos)

> Lembrete: números abaixo são **projeção simulada**, com selo de confiança por achado. Não são medições reais.

### Q: Intensidade da dor (estresse com renda irregular, 0–10)

| Persona | Média simulada | % que respondeu 7+ | Confiança |
|---|---|---|---|
| P1 Designer | 7,8 | 74% | 🟢 |
| P2 Dev | 6,4 | 52% | 🟡 |
| P3 Marketing | 7,9 | 77% | 🟢 |
| P4 Consultor | 7,1 | 64% | 🟡 |
| P5 Saúde | 7,5 | 70% | 🟡 |
| P6 Educação | 8,3 | 82% | 🟡 |
| **Geral** | **7,5** | **70%** | 🟢 |

*Ancoragem real: 65% dos freelancers brasileiros apontam instabilidade de pagamento como principal desafio financeiro (Payoneer 2023). A simulação projeta dor aguda (7+) em 70% — coerente.*

### Q: Qual o momento MAIS difícil? (os 5 momentos)

| Momento | % que apontou como pior | Confiança |
|---|---|---|
| **Momento 3 — O mês seco** | **34%** | 🟡 |
| Momento 4 — O imposto | 24% | 🟡 |
| Momento 1 — Quando o dinheiro entra | 17% | 🔴 |
| Momento 2 — Fim do mês / "estou bem?" | 15% | 🔴 |
| Momento 5 — Decisão grande | 10% | 🔴 |

> **🔑 Achado que contraria a suposição inicial da Parte 3:** o documento original priorizou o Momento 1 ("quanto posso me pagar quando o dinheiro entra") como o coração do produto. A simulação sugere que o **Momento 3 (o mês seco / runway)** é a dor mais aguda — o que aproxima o Ângulo C (Runway), antes descartado, do centro. **Isto precisa ser validado com urgência** (ver H6).

### Q: Comportamento de imposto

| Resposta | % geral | Confiança |
|---|---|---|
| Separo para imposto todo mês | 19% | 🟡 |
| Separo às vezes / de forma inconsistente | 34% | 🟡 |
| Nunca separo, lido quando chega | 47% | 🟢 |

*Ancoragem real: cultura de "lidar quando chega" é dominante; planilhas são abandonadas pela maioria. Coerente com 78% das famílias endividadas (CNC 2025).*

### Q: Reserva de emergência

| Cobertura | % geral | Confiança |
|---|---|---|
| Nenhuma | 31% | 🟡 |
| Menos de 1 mês | 22% | 🟡 |
| 1–3 meses | 28% | 🟡 |
| 3–6 meses | 14% | 🟡 |
| 6+ meses | 5% | 🟢 |

*Ancoragem real: 82% dos freelancers que usam ferramentas financeiras mantêm reserva (Rock Content) — mas a maioria não usa ferramenta nenhuma. O grosso da amostra tem reserva frágil (<3 meses): 81%.*

### Q: Ferramentas usadas hoje

| Ferramenta | % que usa | Confiança |
|---|---|---|
| Planilha (Excel/Sheets) | 41% | 🟢 |
| Nada estruturado / "na cabeça" | 33% | 🟢 |
| App de finanças pessoais (Organizze, Mobills, etc.) | 19% | 🟡 |
| App de banco PJ (Nubank PJ, etc.) só pra ver saldo | 28% | 🟡 |
| Contador faz tudo | 12% | 🟡 |

*(soma >100% porque é múltipla escolha) Ancoragem real: planilha e "nada" dominam; apps existentes têm baixa penetração e alto abandono.*

### Q: Já abandonou app de finanças? Por quê?

| Motivo do abandono | % dos que abandonaram | Confiança |
|---|---|---|
| Dava trabalho demais pra manter atualizado | 44% | 🟢 |
| Não era feito pra renda variável | 27% | 🟡 |
| Complexo / curva de aprendizado | 19% | 🟡 |
| Caro | 10% | 🟡 |

*Ancoragem real: abandono por fricção de manutenção é o padrão #1 documentado (YNAB reviews, planilhas). 🟢*

### Q: Reação ao framing "app que te paga um salário"

| Reação | % geral | Confiança |
|---|---|---|
| Muito útil — "é exatamente o que me falta" | 38% | 🟡 |
| Útil | 33% | 🟡 |
| Indiferente | 18% | 🔴 |
| Estranho / não gosto do conceito | 11% | 🔴 |

*Por persona, o framing "salário" ressoou mais com P1/P3/P5/P6 (que vêm de lógica de "quanto ganhei esse mês") e menos com P2 Dev (que pensa em "runway" e "burn rate", vocabulário de startup). 🟡*

### Q: Disposição a pagar (mensal)

| Faixa | % geral | Confiança |
|---|---|---|
| Não pagaria | 22% | 🟡 |
| R$10–20 | 34% | 🟡 |
| R$20–35 | 29% | 🟡 |
| R$35–50 | 11% | 🔴 |
| R$50+ | 4% | 🔴 |

*Sweet spot projetado: **R$19,90–R$29,90/mês**. ~44% pagariam R$20+. P2 Dev e P4 Consultor toleram preços mais altos; P6 Educação é o mais sensível a preço. Ancoragem: benchmark YNAB/Lili (~USD$15) e poder de compra BR. 🟡*

### Q: Features mais desejadas (top 5, múltipla escolha)

| Feature | % que marcou como "essencial" | Confiança |
|---|---|---|
| Saber quanto posso me pagar com segurança | 61% | 🟡 |
| Separar imposto automaticamente | 58% | 🟢 |
| Saber por quanto tempo minha reserva dura (runway) | 54% | 🟡 |
| Alerta antes de furar o orçamento | 49% | 🟡 |
| Registro rápido sem dar trabalho | 47% | 🟢 |
| Projeção do próximo mês | 38% | 🔴 |

---

## 4.4 Validação das Hipóteses Originais (H1–H5)

| Hip. | Enunciado | Sinal simulado | Veredito simulado | Confiança | Ação |
|---|---|---|---|---|---|
| **H1** | Pagariam R$19,90–R$39,90/mês | 44% pagariam R$20+; sweet spot R$20–30 | **Parcialmente confirmada** — teto real provável é ~R$29,90, não R$39,90 | 🟡 | Validar preço com pré-venda real |
| **H2** | Registro manual não é fricção que faz abandonar | Abandono por "trabalho de manter" é o motivo #1 (44%) | **Em risco / tendendo a refutada** — fricção manual é o maior assassino de apps do tipo | 🟢 | **Crítico:** reduzir fricção ao mínimo absoluto ou priorizar importação |
| **H3** | Framing "salário" ressoa como conceito central | 71% acharam útil/muito útil; mas P2 Dev resiste | **Confirmada com ressalva** — ressoa, exceto no segmento Dev | 🟡 | Manter "salário", mas testar linguagem alternativa pra Dev |
| **H4** | Alocação de imposto é dos benefícios mais valiosos | 58% marcaram como essencial (2º lugar) | **Confirmada** | 🟢 | Manter como feature núcleo |
| **H5** | Retenção mês 1 > 60% | Não mensurável em simulação | **Indeterminada** — só dados reais respondem | — | Medir em coorte real |

---

## 4.5 Novas Hipóteses Surgidas da Pesquisa

> Estas emergiram da simulação. São **hipóteses a testar**, não conclusões.

- **H6 🟡 — O "mês seco" (runway) pode ser a dor mais aguda, não o "quanto me pagar".** 34% apontaram o Momento 3 como pior. Se confirmado, o produto deveria liderar pela pergunta *"por quanto tempo você aguenta?"* e não só *"quanto pode se pagar?"*. Reabilita o Ângulo C como feature de destaque (não produto isolado).

- **H7 🟢 — A fricção do registro manual é o maior risco de morte do produto.** Mais importante que qualquer feature. Se o usuário precisar lançar entradas na mão e isso "der trabalho", ele abandona — replicando o destino da planilha. **Implicação:** importação de extrato (CSV/Open Finance) pode não ser "V2", e sim requisito de sobrevivência mais cedo.

- **H8 🟡 — Profissionais de saúde/educação (P5/P6) podem ser um beachhead melhor que designers/devs.** Têm volatilidade frequente (consulta a consulta, evasão de aluno), alta dor, são majoritariamente MEI (cálculo de imposto mais simples e previsível), e formam comunidades fechadas e confiáveis (conselhos de classe, grupos de WhatsApp) — canal de aquisição barato. Designers/devs têm mais alternativas e mais ceticismo a apps financeiros.

- **H9 🔴 — Desconfiança do cálculo automático de imposto pode ser barreira.** A complexidade tributária brasileira (MEI vs. carnê-leão vs. Simples) pode fazer o usuário não confiar no número. Talvez seja melhor começar só com MEI (regra fixa e simples) e ser explícito que é estimativa.

- **H10 🟡 — O vocabulário precisa mudar por segmento.** "Salário" para criativos/saúde/educação; "runway/reserva" para devs; "pró-labore" para quem é mais formalizado. O conceito é o mesmo; o rótulo muda a adesão.

- **H11 🔴 — Pode haver resistência emocional a "encarar" os números.** 33% usam "nada estruturado". Parte disso é evitação (não querer ver a realidade). O produto compete não só com planilha, mas com a *negação*. Onboarding precisa ser acolhedor, não acusatório.

---

## 4.6 Insights Principais (síntese acionável)

1. **A dor é real e aguda (🟢), mas o epicentro pode estar deslocado.** O "mês seco/runway" disputa com o "quanto me pagar" como dor #1. Decisão de produto depende de validar H6 com gente real — é a primeira coisa a testar.

2. **Fricção mata antes de qualquer feature (🟢).** O maior aprendizado: o concorrente real não é YNAB nem Lili — é a planilha abandonada e o "deixa na cabeça". Vencer significa ser radicalmente menos trabalhoso que uma planilha. Isso eleva a importância de captura automática de entradas.

3. **O imposto automático é âncora de valor confirmada (🟢).** Mas só funciona com confiança — começar por MEI (regra simples) reduz risco.

4. **Beachhead pode não ser designer/dev (🟡).** Saúde e educação autônomas combinam dor alta + imposto simples + comunidades acessíveis. Forte candidato a primeiro nicho.

5. **Um produto, vários vocabulários (🟡).** O motor é o mesmo; a comunicação se adapta por segmento para maximizar adesão e aquisição.

---

# PARTE 5 — Plano de MVP Revisado (pós-pesquisa)

> Revisão do plano da Parte 3 à luz dos achados simulados. Mudanças marcadas com **[MUDANÇA]**.

## 5.1 Decisão de Beachhead

**[SUPERADO 17/06 — decisão D2]** Esta seção propunha testar dois beachheads (P5 Saúde como aposta primária, P1 Designer como secundária) e escolher um a partir da pesquisa real. **O founder decidiu não restringir o segmento a priori.** O MVP lança amplo para todos os freelancers/autônomos (MEI e Simples/carnê-leão — D5), e o(s) segmento(s) de melhor encaixe serão descobertos por telemetria de uso real pós-lançamento, não por uma aposta de beachhead feita na mesa de planejamento.

*Mantido como registro histórico do raciocínio original — útil se a telemetria pós-lançamento confirmar que Saúde/Bem-estar de fato performa melhor, o que validaria a hipótese original a posteriori.*

## 5.2 Reprioritização de Features do MVP

**[MUDANÇA]** Com base nos sinais simulados (H6 + H7), a ordem de prioridade muda:

| Feature | Status na Parte 3 | Status revisado | Motivo |
|---|---|---|---|
| **Motor de captura (câmera/imagem)** **[NOVO 17/06]** | Não existia | **Must — maior prioridade técnica** | D4 (sem Open Finance) + H7 (fricção mata): é a via principal de entrada de dados |
| Registro de entrada **rápido** (≤15s, atrito mínimo) | Must | **Must + topo de prioridade** | H7: fricção mata |
| Importação de extrato (CSV) | Era V1 | Mantido como V1 (complementar ao motor de captura) | Útil para quem tem extrato bancário, mas não é mais a aposta principal de importação |
| "Quanto posso me pagar" (salário do mês) | Must (núcleo) | **Must — co-núcleo** | Confirmado, mas divide o palco |
| **Runway: "quantos meses você aguenta"** | Não estava no MVP | **[MUDANÇA] Promover a Must** | H6: pode ser a dor #1 |
| Separação automática de imposto **[ATUALIZADO 17/06 — D5]** | Só MEI no MVP | **Must — MEI e Simples/carnê-leão** | D5: founder decidiu suportar os dois regimes desde o MVP |
| Dashboard de baldes | Must | Must | Mantido |
| Histórico 12 meses | Must | Should | Menos crítico que runway |
| Contracheque mensal (notificação) | Should | Should | Mantido — bom para retenção/ritual |
| Despesas fixas | Should | **Must** | Necessário para calcular runway corretamente |

## 5.3 Conceito de Produto Ajustado

**[MUDANÇA]** O FLUXO passa a responder **duas** perguntas-âncora, não uma:
> 1. *"Quanto posso me pagar este mês com segurança?"* (presente)
> 2. *"Por quanto tempo eu aguento se nada novo entrar?"* (futuro / runway)

A primeira tela mostra o **Salário do mês** + um indicador de **Runway** ("você tem 2,3 meses de fôlego"). Juntas, elas cobrem a dor do presente e a ansiedade do futuro — que a pesquisa sugere ser a mais forte.

## 5.4 Estratégia para Maximizar Necessidade e Aquisição

O usuário pediu explicitamente para *maximizar a necessidade do produto e potencializar a aquisição*. Com base na pesquisa:

- **Gancho de aquisição = a pergunta que ninguém responde hoje:** *"Quantos meses de fôlego você tem agora?"* — é concreta, ansiogênica na medida certa, e nenhuma ferramenta responde. Ótimo gancho de conteúdo e de topo de funil.
- **Aha-moment alvo (primeiros 3 min):** o usuário lança 2–3 entradas e o app imediatamente devolve "seu salário seguro é R$X e você tem Y meses de fôlego". Valor antes de qualquer fricção de cadastro longo.
- **Canal de aquisição mais barato (se H8 confirmar):** comunidades fechadas de profissionais de saúde/educação (conselhos, grupos de WhatsApp, associações) — confiança alta, CAC baixo.
- **Loop de retenção:** o "contracheque mensal" no dia 1 cria ritual recorrente; o alerta de imposto cria dependência (medo de errar com o fisco).
- **Loop de indicação:** "descubra seu fôlego financeiro" como teste compartilhável — o resultado vira conteúdo que o próprio usuário compartilha.

## 5.5 O que NÃO fazer no MVP (escopo negativo)
- Não construir integração bancária via Open Finance ainda (D4) — entrada de dados é via motor de captura (3.13) + registro manual.
- **[ATUALIZADO 17/06 — D5]** Não se limitar a um único regime tributário — MEI e Simples/carnê-leão entram juntos no MVP (revertido vs. versão anterior deste documento, que restringia a só MEI).
- Não virar banco, não emitir nota, não fazer contabilidade.
- Não adicionar IA conversacional ampla ainda — é diferenciação de V2; o uso de IA no MVP fica restrito à extração/sugestão do motor de captura (3.13), que é funcional e não conversacional.

---

# PARTE 6 — Plano de Validação Real (online, contínuo, em paralelo ao desenvolvimento) **[REESCRITO 17/06]**

> **Mudança de filosofia vs. v0.1 deste documento:** a versão anterior desta Parte 6 tratava a validação como um portão sequencial — entrevistas → survey → landing → *só então* decidir se constrói. **O founder decidiu não esperar.** A partir de agora: a pesquisa roda online, continuamente, principalmente via grupos de Facebook, **enquanto o produto já está sendo construído** (Trilha A da seção 3.11). Os resultados não bloqueiam o início — eles entram como refinamento em marcos de amostra.

## 6.1 A matemática dos 95% (sem enganação)

Para uma pesquisa quantitativa com **95% de confiança** e margem de erro de **±5%**, sobre uma população grande (milhões de freelancers), o tamanho de amostra necessário é:

> **n = z²·p·(1−p) / e²  =  1,96² × 0,5 × 0,5 / 0,05²  ≈ 385 respondentes reais**

- **±5% de margem → ~385 respostas reais**
- ±7% de margem → ~196 respostas
- ±10% de margem → ~96 respostas

385 respostas reais de survey dão 95% de confiança para as perguntas quantitativas (dor, momento pior, disposição a pagar, segmento). Os marcos abaixo (6.4) usam esses números como referência de confiabilidade crescente, não como porta de entrada.

## 6.2 Desenho: survey online contínuo (sem data de término)

**Formato:** Google Forms (gratuito, sem fricção de conta para responder, exporta direto para uma planilha que pode ser monitorada automaticamente — ver 6.5).

**Por que só online e por que sem prazo:**
- O canal primário pedido pelo founder são grupos de Facebook de freelancers/MEI/autônomos — alcance maior e mais rápido do que agendar 12–20 entrevistas 1:1.
- Sem prazo de corte: o formulário fica no ar indefinidamente, age como termômetro permanente, e os marcos de amostra (6.4) é que disparam ações de refinamento — não um encerramento da coleta.
- Entrevistas qualitativas (roteiro da seção 4.2) deixam de ser pré-requisito e passam a ser **opcionais e oportunistas**: o próprio formulário deve ter um campo opcional de e-mail/WhatsApp para quem topa uma call rápida depois. Útil para aprofundar sinais que o survey deixar ambíguos, sem travar o cronograma.

**Conteúdo do formulário:** versão enxuta da seção 4.2 (versão quantitativa), adaptada para responder em <3 minutos no celular (essencial para conversão dentro de um grupo de Facebook, onde a maior parte do tráfego é mobile). O texto pronto para colar no Google Forms está no arquivo complementar `FLUXO-formulario-e-divulgacao.md` (mesma pasta), com:
- Título, descrição de abertura e todas as perguntas com tipo de campo e opções já formatadas.
- Pergunta de segmentação (área de atuação, regime tributário, faixa de renda) — crítica para a decisão D2 (qual segmento mais usa o quê).
- Campo opcional de contato para follow-up qualitativo.

## 6.3 Distribuição em grupos de Facebook

**Como os grupos de Facebook costumam tratar pesquisas (atenção antes de postar):**
- A maioria dos grupos de freelancer/MEI no Brasil **proíbe links/divulgação direta** sem autorização do admin — postar sem isso costuma ser removido ou pode banir a conta.
- Recomendação: identificar 8–12 grupos relevantes (freelancers em geral, MEI, autônomos, e nichos — design, dev, saúde/bem-estar, educação, consultoria), ler as regras fixadas, e **pedir autorização ao admin antes de postar** (ou postar como comentário num tópico semanal de "promoção" quando o grupo tiver esse formato).
- Liderar com valor, não com pedido: o gancho de melhor conversão (seção 5.4) — *"quantos meses de fôlego financeiro você tem agora?"* — funciona melhor como pergunta de engajamento do que como "responda minha pesquisa". O formulário entrega esse número como recompensa ao final.
- Variar a copy entre grupos para não parecer espam replicado; o arquivo `FLUXO-formulario-e-divulgacao.md` traz 3 variações prontas.
- Postar em horários de maior atividade do grupo (testar e ajustar) e revisitar/repostar periodicamente — grupos de Facebook têm alta rotatividade de visibilidade no feed.

## 6.4 Monitoramento automático das respostas **[NOVO]**

A pesquisa roda sozinha; a avaliação também. Mecanismo:

1. O Google Forms está configurado para gravar respostas numa Planilha Google vinculada.
2. Essa planilha é publicada na web como CSV (o único passo manual — feito pelo founder, não por mim, porque alterar permissão de compartilhamento de um documento é uma ação que não executo por conta própria). O link do CSV é salvo num arquivo de configuração na pasta do projeto.
3. Uma tarefa agendada roda **diariamente**: lê o CSV, identifica respostas novas desde a última execução, atualiza um arquivo de acompanhamento (`FLUXO-validation-tracking.md`) com: total acumulado, distribuição por segmento/regime, intensidade média da dor, momento mais citado, disposição a pagar, e o status de cada hipótese (✅ confirmando / 🟡 neutro / ❌ contrariando, com base nos critérios da seção 6.6).
4. Ao cruzar os marcos de 50, 150 e 385 respostas, a tarefa sinaliza isso com destaque no arquivo de acompanhamento e numa notificação — esses são os pontos de checkpoint da Trilha B (seção 3.11), não o desenvolvimento parado esperando.
5. Antes do CSV existir, a tarefa só checa se a configuração já foi preenchida e não faz nada além disso — ou seja, já está ativa e vai "ligar" sozinha no momento em que o link for adicionado.

Detalhes de execução (cron, arquivos envolvidos) estão fora do golden source por serem operacionais — ver task agendada `fluxo-validacao-diaria`.

## 6.5 Cronograma — contínuo, não sequencial

Substituído pela visão de duas trilhas paralelas da seção 3.11. Resumo aqui apenas dos marcos de amostra da pesquisa (Trilha B):

```
DESDE O DIA 1:     Survey ao vivo, divulgação rotativa em grupos de Facebook
                    Monitoramento automático diário (6.4)

~50 RESPOSTAS:      Marco 1 — primeiro check de direção (dor #1, framing, segmento)
~150 RESPOSTAS:     Marco 2 — sinal de disposição a pagar começa a ficar confiável
~385 RESPOSTAS:     Marco 3 — 95% de confiança estatística
                     → consolidar achados neste documento e ajustar roadmap
                     → opcional: landing page + teste de pré-venda real (pagamento)
                       como sinal mais forte que qualquer resposta de survey
```

## 6.6 Sinais de confirmação / morte por hipótese

| Hipótese | ✅ Confirma se… | ❌ Morre se… |
|---|---|---|
| H1 (preço) | ≥30% da lista converte a R$19,90 numa pré-venda futura | <10% converte mesmo com desconto |
| H2/H7 (fricção) | Beta testers lançam entradas (manual ou via motor de captura) por 2+ semanas sem parar | Abandono de registro >50% na semana 1 |
| H3/H10 (framing) | "Salário/fôlego" é repetido espontaneamente nas respostas abertas do survey | Respondentes acham o conceito confuso/forçado |
| H6 (runway é dor #1) | Momento 3 lidera no survey (≥30%) | Momento 1 domina e runway é marginal |
| H8 (segmento de melhor encaixe) **[reformulado — D2]** | Survey + telemetria pós-lançamento mostram qual segmento converte/retém mais — observacional, não escolhido a priori | — (não há "morte" aqui; é um achado, não uma aposta a confirmar) |

## 6.7 Critério de refinamento (não de bloqueio) **[RENOMEADO 17/06]**

Esta seção antes se chamava "critério de prontidão para construir" e tratava os itens abaixo como pré-requisitos para começar o MVP. **Isso foi revertido** — o desenvolvimento já começa em paralelo (Trilha A, seção 3.11). Os itens abaixo agora são gatilhos de **revisão de rumo**, não de autorização para construir:
- [ ] Dor #1 identificada com dados reais (H6) → ajusta qual tela é a "home" do app (salário vs. runway)
- [ ] Sinal de segmento de melhor encaixe (H8) → ajusta onboarding e copy de aquisição, não o código já feito
- [ ] ≥30% de conversão numa pré-venda futura OU ≥385 respostas com disposição a pagar → confirma ou ajusta o modelo de preço (3.8)
- [ ] Fricção de registro validada com o motor de captura em uso real (H7) → prioriza ajustes no motor de captura (3.13) nas semanas seguintes

---

# Referências

## Dados de mercado (Brasil — usados na Parte 4)

| Fonte | Dado | Data |
|---|---|---|
| IBGE / Agência Brasil | 32,5 milhões de autônomos informais (sem CNPJ) ou sem carteira | Abr/2025 |
| FGV/IBRE — Blog do IBRE | 66% dos autônomos são homens; 85% ganham até 3 salários mínimos; 74,6% sem vínculo formal com o Estado | 2024 |
| Onlinecurriculo (via O Sul / Folha BV) | Áreas freelancer: vendas 30%, aulas 13%, design 13%, consultoria 11%, pesquisa 10%, redação 9% | Jun/2024 |
| Onlinecurriculo | 38% dos brasileiros atuam como freelancer; 31% como renda principal, 61% complementar | Jun/2024 |
| Instavagas / IBGE | Freelancers digitais concentram-se em 25–35 anos, áreas visuais/criativas | 2023 |
| Payoneer (via Blocktime) | 65% dos freelancers brasileiros veem instabilidade de pagamento como principal desafio financeiro | 2023 |
| Rock Content (via BM&C News) | 82% dos freelancers que usam ferramentas financeiras mantêm reserva de emergência | 2025 |
| CNC (via Adriano Freire) | 78% das famílias brasileiras endividadas em 2025 | 2025 |
| BM&C News / IBGE | Estimativa de 25+ milhões de brasileiros autônomos/freelancers | Fev/2025 |

## Metodologias de pesquisa (Parte 4–6)

- **The Mom Test** (Rob Fitzpatrick) — princípios de entrevista de descoberta (comportamento passado, não intenção hipotética; não vender durante a descoberta)
- **Synthetic / Simulated Research** — geração de hipóteses via personas calibradas por dados secundários; explicitamente rotulada como não-primária
- **Cálculo de tamanho de amostra** — fórmula padrão de proporção para 95% de confiança (n = z²·p·(1−p)/e²)
- **Saturação teórica** — critério de parada para pesquisa qualitativa (Glaser & Strauss)

## Dados de mercado (global)

| Fonte | Dado | Data |
|---|---|---|
| MBO Partners, State of Independence 2025 | 72,9 milhões de trabalhadores independentes nos EUA | 2025 |
| Freelancermap.com, Freelancer Survey 2025 | 39% citam inconsistência de renda como desafio #2 | 2025 |
| Upwork Freelance Forward Report | 44% de freelancers reportam fluxo de caixa irregular | 2025 |
| ResearchGate — Gig Economy Financial Challenges | "Tools can't solve irregular income" — citação direta de freelancers | Mai/2025 |
| Bankrate / Upwork (compilado) | 80% de gig workers não conseguem cobrir emergência de USD $1.000 sem crédito | 2025 |
| Psicologia da instabilidade financeira (Psychologs.com) | 45% dos freelancers tiveram declínio de saúde mental em 2024, insegurança financeira como causa principal | Jul/2025 |
| ResearchGate — Academic Study | Recomenda criação de "produtos financeiros inclusivos desenhados para renda irregular" | Mai/2025 |
| The Slow Money Movement | "Você não tem um problema de disciplina. Você tem um problema de volatilidade." — characterização psicológica da dor | Fev/2026 |
| GISUser.com — Freelance Income 2026 | "O dinheiro é real. O timing é que está quebrado." | Mai/2026 |

## Análise competitiva

| Produto | Preço (referência) | Fonte |
|---|---|---|
| YNAB | USD $14,99/mês ou $109/ano | NerdWallet, Jun/2026 |
| Lili Pro | USD $15/mês | NerdWallet Business, Jun/2026 |
| Found Plus | USD $35/mês | Found.com, Mar/2026 |
| Found Pro | USD $80/mês | Found.com, Mar/2026 |
| Lili Smart | USD $35/mês | Business.org, Dez/2025 |
| Lili Premium | USD $55/mês | NerdWallet Business, Jun/2026 |
| QuickBooks (básico) | USD $35/mês | Thefinopartners.com, Mai/2026 |
| Wave | Gratuito | Múltiplas fontes |

## Metodologias utilizadas

- **Jobs to Be Done (JTBD)** — Clayton Christensen / Bob Moesta
- **Framework de Posicionamento** — April Dunford, "Obviously Awesome" (2019)
- **Criação de Personas** — Nielsen Norman Group
- **Mapeamento de Workarounds** — Princípio de "Jobs to Be Done" aplicado a comportamentos observados
- **Scoring de Ângulos** — Framework próprio com critérios ponderados por impacto no problema central
- **North Star Metric** — Framework Amplitude / Sean Ellis

---

*Documento criado em Junho 2026. Versão 0.2 — inclui pesquisa simulada (Parte 4), MVP revisado (Parte 5) e plano de validação real (Parte 6). Os dados da Parte 4 são projeção simulada, não dados primários; a Parte 6 detalha como convertê-los em certeza real. Próxima atualização: após as entrevistas e survey reais.*
