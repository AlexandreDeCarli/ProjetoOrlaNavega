# Sistema de Monitoramento do PGI Orla — Navegantes (SC)

Este projeto consiste em uma plataforma web interativa, premium e responsiva desenvolvida para o **monitoramento em tempo real** das ações e diretrizes do **Plano de Gestão Integrada (PGI)** da Orla de Navegantes - SC. 

A plataforma consome dados em tempo real de uma planilha de controle no Google Sheets e fornece aos gestores públicos, membros do Comitê Gestor Municipal e cidadãos uma visão clara, transparente e dinâmica do progresso de cada ação socioambiental planejada para as praias e rios do município.

---

## 🌊 O que é o Projeto Orla?

O **Projeto Orla** (Projeto de Gestão Integrada da Orla Marítima) é uma iniciativa do Governo Federal conduzida pela Secretaria do Patrimônio da União (SPU) e pelo Ministério do Meio Ambiente (MMA). A sua principal característica é a **descentralização da gestão costeira**, promovendo a inserção ativa da sociedade civil organizada e dos usuários da orla na construção das propostas e na tomada de decisões sobre o futuro do território praiano.

Em Navegantes, essa gestão compartilhada ganhou força com o **Termo de Adesão à Gestão de Praias (TAGP)**, pactuado em 2018. O TAGP transferiu a responsabilidade direta da gestão das praias marítimas da União para o Município, condicionando essa transferência à implementação contínua do **PGI (Plano de Gestão Integrada)** e criando a figura do **GMUP (Gestor Municipal de Utilização de Praias)** para monitorar essas condicionantes federais.

---

## 🎯 Objetivo do Painel de Monitoramento

O PGI de Navegantes é composto por **87 ações estratégicas** distribuídas entre as três **Unidades de Planejamento (UP1, UP2 e UP3)**, dividindo responsabilidades entre diversas pastas do governo municipal (como IAN, SEPLAN, SETUR, SEINFRA, Fundação Cultural, PGM, etc.) em parceria com entidades civis e órgãos estaduais (como CBM e Polícia Militar Ambiental).

O objetivo deste site é **acabar com a opacidade de planilhas complexas de monitoramento** e:
1.  **Garantir a Transparência:** Permitir que qualquer cidadão acompanhe o que foi planejado, o que está em andamento (como as obras do molhe do Gravatá ou engordamento da faixa de areia) e o que já foi superado.
2.  **Facilitar a Gestão Intersetorial:** Permitir que secretarias filtrem instantaneamente suas atribuições e acompanhem os prazos, indicadores de monitoramento e resultados de 2025.
3.  **Habilitar Decisões Baseadas em Dados:** Fornecer aos gestores KPIs automáticos calculados em tempo real de acordo com as metas concluídas ou planejadas.

---

## 💎 Recursos de Destaque da Plataforma

*   **Sincronização em Tempo Real com o Google Sheets:** O site consome os dados da planilha oficial de monitoramento de forma assíncrona. Qualquer edição ou alteração de status feita na planilha pelo comitê gestor é refletida no site no próximo segundo após a atualização da página.
*   **Filtros Granulares de Responsáveis:** Diferente de planilhas onde ações compartilhadas ficam misturadas, o sistema separa inteligentemente órgãos associados (ex: se uma ação é compartilhada por IAN e SEPLAN, ela aparecerá nos filtros individuais de ambos).
*   **Painel lateral Slide-Over de Alta Fidelidade:** Clique em qualquer ação na tabela para abrir uma gaveta lateral rica com transições nobres, detalhando finalidades, parceiros envolvidos, comprovações e observações do PGI.
*   **Dashboard Estatístico (KPIs):** Quatro cartões de controle exibem o total, ações concluídas, em execução e planejadas, atualizando porcentagens e barras de progresso dinamicamente com base nos filtros ativos.
*   **Design Costeiro Premium:** Paleta de cores moderna calculada no espaço de cores **OKLCH** (inspirado nos azuis-profundos e verdes-marinhos da orla), tipografia geométrica premium (`Outfit` e `Plus Jakarta Sans`) e zero clichês amadores de IA.
*   **Resiliência Técnica:** Se o serviço de nuvem do Google Sheets estiver inacessível ou o usuário estiver offline, a aplicação utiliza silenciosamente um banco de dados local em JavaScript como backup para nunca falhar.

---

## 🛠️ Stack Tecnológica

O sistema foi construído como uma **Single Page Application (SPA)** focando em altíssima performance, tempo de carregamento instantâneo e zero dependência de compiladores complexos:
- **HTML5:** Semântico e estruturado sob normas de acessibilidade (suporte a leitores de tela e navegação completa por teclado).
- **Vanilla CSS3 (Design System Costeiro):** Flexbox e Grid nobres, uso de OKLCH e propriedades dinâmicas de desfoque (`backdrop-filter`) para glassmorphism suave.
- **JavaScript ES6 Modular:** Gerenciamento reativo do estado de filtros, busca global e manipulação do DOM.

---

## 🚀 Como Executar e Hospedar o Projeto

### Rodar Localmente
Como a aplicação é estática e modular, basta abrir o arquivo `index.html` em qualquer navegador ou rodar um servidor estático simples a partir da raiz do repositório:

```bash
# Usando o Node.js (Recomendado)
npx http-server -p 8080

# Ou usando Python (se disponível)
python -m http-server 8080
```
Acesse `http://localhost:8080` no navegador.

### Hospedagem no GitHub Pages (Grátis e Instantâneo)
Este projeto está pronto para ser publicado em ambiente público de produção:
1. Acesse as configurações (**Settings**) do seu repositório no GitHub.
2. Clique na seção **Pages** na barra lateral.
3. Sob a opção **Build and deployment**, selecione o branch **`main`** como fonte e clique em **Save**.
4. O link público será gerado em instantes (ex: `https://AlexandreDeCarli.github.io/ProjetoOrlaNavega/`).

---

*“A orla é de todos, a gestão é de cada um de nós.”*
**Comitê Gestor Municipal do Projeto Orla de Navegantes — SC**
