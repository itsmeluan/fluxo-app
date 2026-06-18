# FLUXO — Formulário de Validação + Copy de Divulgação
**Arquivo operacional complementar ao golden source (FLUXO-product-doc.md, Parte 6).**
Conteúdo pronto para copiar e colar. Não precisa reescrever nada — só montar no Google Forms e postar.

---

## 1. Como montar no Google Forms (passo a passo, ~10 min)

1. Acesse forms.google.com → Formulário em branco.
2. Cole o título e a descrição da seção 2 abaixo.
3. Crie cada pergunta da seção 3, na ordem, com o tipo indicado.
4. Em **Respostas** (aba do topo), clique no ícone do Google Sheets para criar a planilha vinculada — é nela que as respostas vão se acumular.
5. **Passo que só você deve fazer (não delego isso):** na planilha criada, vá em **Arquivo → Compartilhar → Publicar na web**, escolha a aba de respostas, formato **CSV**, e publique. Copie o link gerado.
6. Cole esse link no arquivo `FLUXO-validation-survey-config.json` (já criado na pasta do projeto) no campo `csv_url`. A partir do próximo ciclo da tarefa agendada, o monitoramento liga automaticamente — não precisa me avisar.

---

## 2. Título e descrição do formulário

**Título:**
```
Renda irregular: como você lida com isso? (2 min)
```

**Descrição (texto de abertura):**
```
Sou freelancer/autônomo também e estou construindo o FLUXO — um app que calcula
quanto você pode se pagar de salário todo mês, mesmo com renda irregular,
já separando imposto e reserva.

Antes de construir mais, quero entender de verdade como isso funciona pra você.
São 2 minutos, totalmente anônimo, e no final você pode deixar contato se quiser
acesso antecipado.

Obrigado por ajudar 🙏
```

---

## 3. Perguntas (na ordem — copiar tipo e opções exatamente)

**P1. Qual sua área de atuação principal?**
*Múltipla escolha (uma resposta)*
- Design
- Desenvolvimento / Tecnologia
- Marketing / Conteúdo
- Consultoria
- Saúde / Bem-estar (nutrição, psicologia, educação física…)
- Educação (professor particular, cursos…)
- Vendas / Comércio
- Outro: ___

**P2. Qual seu regime hoje?**
*Múltipla escolha (uma resposta)*
- MEI
- Simples Nacional
- Autônomo sem CNPJ (carnê-leão)
- Não sei / não me organizei formalmente ainda
- Outro: ___

**P3. Sua renda mensal varia bastante de um mês para o outro?**
*Múltipla escolha (uma resposta)*
- Sim, varia muito
- Varia um pouco
- Não, é bem estável

**P4. Qual sua renda mensal média (aproximada)?**
*Múltipla escolha (uma resposta)*
- Até R$2.000
- R$2.001 a R$5.000
- R$5.001 a R$10.000
- R$10.001 a R$15.000
- Mais de R$15.000
- Prefiro não dizer

**P5. De 0 a 10, o quanto a imprevisibilidade da sua renda te causa estresse hoje?**
*Escala linear, 0 a 10*

**P6. Qual desses momentos é o MAIS difícil pra você?**
*Múltipla escolha (uma resposta)*
- Quando o dinheiro entra — não sei quanto é "realmente meu"
- Fim do mês — não sei se estou bem ou só parece
- Mês seco — sem projeto novo e sem reserva estruturada
- Hora do imposto — o valor sempre me surpreende
- Decisão grande (comprar algo, contratar, investir) — não tenho base pra decidir

**P7. Você separa dinheiro para imposto todo mês, antes de gastar o resto?**
*Múltipla escolha (uma resposta)*
- Sim, sempre
- Às vezes
- Nunca

**P8. Se você não tivesse nenhum projeto novo a partir de hoje, por quantos meses seu dinheiro guardado cobriria suas contas?**
*Múltipla escolha (uma resposta)*
- 0 (nada guardado)
- Menos de 1 mês
- 1 a 3 meses
- 3 a 6 meses
- Mais de 6 meses

**P9. O que você usa hoje para se organizar financeiramente?**
*Caixas de seleção (múltiplas respostas)*
- Planilha (Excel/Google Sheets)
- App de finanças
- Caderno / anotações manuscritas
- Não uso nada, faço de cabeça
- Outro: ___

**P10. Você já usou e abandonou algum app de finanças? Qual e por quê?**
*Resposta curta (opcional)*

**P11. Imagine um app que pega sua renda irregular e te diz, todo mês, quanto você pode se pagar de salário — já separando imposto e reserva automaticamente. Isso soa:**
*Múltipla escolha (uma resposta)*
- Muito útil
- Útil
- Indiferente
- Estranho / não faz sentido pra mim

**P12. Quanto você pagaria por mês por algo que resolvesse isso de verdade?**
*Múltipla escolha (uma resposta)*
- Não pagaria
- Até R$15/mês
- R$15 a R$30/mês
- R$30 a R$50/mês
- Mais de R$50/mês

**P13. Quer deixar contato para uma conversa rápida (15 min) ou acesso antecipado ao FLUXO?**
*Resposta curta (opcional — e-mail ou WhatsApp)*

---

## 4. Copy de divulgação para grupos de Facebook

**Antes de postar:** confira as regras fixadas do grupo. A maioria dos grupos de freelancer/MEI no Brasil exige autorização do admin para divulgar links — peça antes, ou use o tópico semanal de divulgação quando o grupo tiver um.

### Variação 1 — Pergunta de engajamento (gancho direto)
```
Pergunta pra quem é freelancer/autônomo aqui: se você não fechasse nenhum projeto
novo a partir de hoje, por quantos meses você aguentaria com o que já tem guardado?

Tô fazendo uma pesquisa rápida (2 min, anônima) sobre como a gente lida com renda
irregular pra construir um app sobre isso. Quem quiser responder e comparar a
resposta: [LINK]
```

### Variação 2 — Identificação/storytelling
```
Sou freelancer também e cansei de fazer aquela calculadora mental toda vez que
cai um pagamento: "quanto disso é meu, quanto é imposto, quanto eu deveria guardar?"

Comecei a construir um app pra resolver isso (FLUXO) e antes de ir longe demais
quero ouvir gente de verdade. 2 minutos, anônimo: [LINK]
```

### Variação 3 — Pedido direto de apoio (bom em grupos que valorizam apoiar quem está construindo)
```
Pessoal, estou validando uma ideia de produto para freelancers/autônomos
(gestão de renda irregular) e cada resposta ajuda muito a decidir o que construir
de verdade. 2 minutos, anônimo, sem pegadinha: [LINK]

Se puder compartilhar com outro freela que vive na mesma vibe da renda
inconstante, ajuda ainda mais 🙏
```

**Rotação sugerida:** revezar as 3 variações entre os 8–12 grupos mapeados (ver seção 6.3 do golden source) para não parecer post replicado, e repostar periodicamente — o alcance orgânico em grupos de Facebook cai rápido com o tempo.

**Categorias de grupo para buscar e entrar (não são nomes específicos — buscar e avaliar no Facebook):**
- Freelancers Brasil / Freelancers [sua cidade]
- MEI — Microempreendedor Individual
- Autônomos e Prestadores de Serviço
- Designers Freelancers / Devs Freelancers / Marketing Freelancer
- Nutricionistas, Psicólogos, Personal Trainers autônomos
- Professores particulares / Educadores autônomos
- Consultores independentes
