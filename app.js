import { actionsData } from './actions-data.js';

// ==========================================================================
// CONFIGURAÇÕES E ESTADO DA APLICAÇÃO
// ==========================================================================

const state = {
  actions: [...actionsData],
  filteredActions: [...actionsData],
  filters: {
    search: '',
    up: 'all',
    topic: 'all',
    responsavel: 'all',
    status: 'all'
  },
  sortBy: 'num-asc'
};

const SPREADSHEET_URL = 'https://docs.google.com/spreadsheets/d/1IdSw_CzHY4zim6YWt2dqZwuqH_LO0-of/gviz/tq?tqx=out:json&tq&gid=960532358';

async function fetchActionsFromGoogleSheets() {
  try {
    const response = await fetch(SPREADSHEET_URL);
    const text = await response.text();
    
    // Extrai a resposta JSON que vem empacotada no callback google.visualization.Query.setResponse(...)
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("Formato de retorno do Google Sheets inválido.");
    }
    
    const jsonStr = text.substring(startIdx, endIdx + 1);
    const data = JSON.parse(jsonStr);
    
    const rows = data.table.rows;
    if (!rows) return null;
    
    return rows.map(row => {
      const cells = row.c;
      const getVal = (idx) => (cells && cells[idx] && cells[idx].v !== null && cells[idx].v !== undefined) ? cells[idx].v : '';
      
      return {
        pasta: String(getVal(0)),
        obsPlanilha: String(getVal(1)),
        linhaAcao: String(getVal(2)),
        unidade: String(getVal(3)),
        trecho: String(getVal(4)),
        n: parseInt(getVal(5)) || 0,
        acao: String(getVal(6)),
        finalidade: String(getVal(7)),
        responsavel: String(getVal(8)),
        parceiros: String(getVal(9)),
        prazo: String(getVal(10)),
        duracao: String(getVal(11)),
        indicadores: String(getVal(12)),
        resultados2025: String(getVal(13)),
        status: String(getVal(14)),
        comprovação: String(getVal(15)),
        observacoes: String(getVal(16))
      };
    }).filter(action => action.n > 0); // Remove linhas de cabeçalho ou inválidas
  } catch (error) {
    console.error("Erro ao carregar do Google Sheets. Usando dados locais como backup.", error);
    return null;
  }
}

// Mapeamento simplificado de status para classificação nos KPIs
const getStatusCategory = (statusText) => {
  const norm = statusText.toLowerCase();
  if (norm.includes('superada') || norm.includes('concluído')) {
    return 'superada';
  } else if (norm.includes('em execução') || norm.includes('andamento')) {
    return 'execucao';
  } else {
    return 'previsto'; // Previsto, Mudança de estratégia - previsto, sob análise, etc.
  }
};

// Organizações/Secretarias normalizadas para busca e filtragem granular
const ORGANIZACOES_NORMALIZADAS = [
  { key: 'IAN', label: 'IAN (Meio Ambiente)', match: ['ian', 'instituto ambiental'] },
  { key: 'SEPLAN', label: 'SEPLAN (Planejamento)', match: ['seplan', 'planejamento'] },
  { key: 'SETUR', label: 'SETUR (Turismo)', match: ['setur', 'turismo'] },
  { key: 'SEAP', label: 'SEAP (Pesca/Agricultura)', match: ['seap', 'agricultura e pesca', 'pesca'] },
  { key: 'SED', label: 'SED (Educação)', match: ['sed', 'educação'] },
  { key: 'SEIDES', label: 'SEIDES (Social)', match: ['seides', 'inclusão e desenv social', 'inclusão social'] },
  { key: 'SEINFRA', label: 'SEINFRA (Infraestrutura)', match: ['seinfra', 'infraestrutura'] },
  { key: 'SESEG', label: 'SESEG (Segurança)', match: ['seseg', 'segurança'] },
  { key: 'SASAN', label: 'SASAN (Saneamento)', match: ['sasan', 'saneamento básico'] },
  { key: 'SPCA', label: 'SPCA (Bem-Estar Animal)', match: ['spca', 'cuidado animal', 'bem-estar animal'] },
  { key: 'PGM', label: 'PGM (Procuradoria)', match: ['pgm', 'procuradoria'] },
  { key: 'Gabinete do Prefeito', label: 'Gabinete do Prefeito', match: ['gabinete do prefeito', 'prefeito'] },
  { key: 'Fundação Cultural', label: 'Fundação Cultural', match: ['fundação cultural', 'cultura'] },
  { key: 'Fundação de Esportes', label: 'Fundação de Esportes', match: ['fundação de esportes', 'esportes'] },
  { key: 'CG/Navega', label: 'CG/Navega (Comitê Orla)', match: ['cg/navega', 'comitê gestor'] },
  { key: 'Resolvido', label: 'Resolvido', match: ['resolvido'] },
  { key: 'Outros', label: 'Outras Entidades', match: ['outros'] }
];

// Helper para descobrir quais organizações estão associadas a uma ação (lendo da coluna Pastas Relacionadas / Pasta)
const getActionOrgs = (action) => {
  const normPasta = action.pasta.toLowerCase();
  const orgs = [];
  ORGANIZACOES_NORMALIZADAS.forEach(org => {
    const isMatch = org.match.some(m => normPasta.includes(m));
    if (isMatch) {
      orgs.push(org.key);
    }
  });
  if (orgs.length === 0) {
    orgs.push('Outros');
  }
  return orgs;
};

// ==========================================================================
// REFERÊNCIAS DO DOM
// ==========================================================================

const DOM = {
  searchInput: document.getElementById('search-input'),
  filterUpOptions: document.getElementById('filter-up-options'),
  filterTopicOptions: document.getElementById('filter-topic-options'),
  filterResponsavelOptions: document.getElementById('filter-responsavel-options'),
  filterStatusOptions: document.getElementById('filter-status-options'),
  
  // Dashboard KPIs
  kpiTotalVal: document.getElementById('kpi-total-val'),
  kpiConcluidoVal: document.getElementById('kpi-concluido-val'),
  kpiExecucaoVal: document.getElementById('kpi-execucao-val'),
  kpiPrevistoVal: document.getElementById('kpi-previsto-val'),
  
  kpiConcluidoBar: document.getElementById('kpi-concluido-bar'),
  kpiExecucaoBar: document.getElementById('kpi-execucao-bar'),
  kpiPrevistoBar: document.getElementById('kpi-previsto-bar'),
  
  kpiConcluidoDesc: document.getElementById('kpi-concluido-desc'),
  kpiExecucaoDesc: document.getElementById('kpi-execucao-desc'),
  kpiPrevistoDesc: document.getElementById('kpi-previsto-desc'),
  
  // Tabela e Controles
  explorerTitleCount: document.getElementById('explorer-title-count'),
  sortSelect: document.getElementById('sort-select'),
  actionsTableBody: document.getElementById('actions-table-body'),
  emptyState: document.getElementById('empty-state'),
  
  // Slide-Over
  detailOverlay: document.getElementById('detail-overlay'),
  detailPanel: document.getElementById('detail-panel'),
  detailCloseBtn: document.getElementById('detail-close-btn'),
  detailContent: document.getElementById('detail-content'),
  detailId: document.getElementById('detail-id'),
  detailUp: document.getElementById('detail-up'),
  detailStatus: document.getElementById('detail-status'),

  // Filtros Mobile
  mobileFilterFab: document.getElementById('mobile-filter-fab'),
  mobileMenuHamburger: document.getElementById('mobile-menu-hamburger'),
  sidebarCloseBtn: document.getElementById('sidebar-close-btn'),
  sidebar: document.getElementById('app-sidebar'),
  sidebarOverlay: document.getElementById('sidebar-overlay')
};

// ==========================================================================
// GERADOR DE OPÇÕES DINÂMICAS DE FILTRO
// ==========================================================================

const initDynamicFilters = () => {
  // 1. Extrair valores únicos
  const topics = new Set();
  const responsaveisAtivos = new Set();
  const statuses = new Set();

  state.actions.forEach(action => {
    if (action.linhaAcao) topics.add(action.linhaAcao.trim());
    
    // Classificar responsáveis de forma separada/granular
    const orgs = getActionOrgs(action);
    orgs.forEach(o => responsaveisAtivos.add(o));
    
    // Classificar status para agrupar opções no filtro de forma limpa
    const cat = getStatusCategory(action.status);
    statuses.add(cat);
  });

  // 2. Renderizar Linhas de Ação
  Array.from(topics).sort().forEach(topic => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = 'topic';
    btn.dataset.value = topic;
    btn.innerHTML = `
      <span>${topic}</span>
      <span class="filter-count" id="count-topic-${topic.replace(/\s+/g, '-')}">0</span>
    `;
    DOM.filterTopicOptions.appendChild(btn);
  });

  // 3. Renderizar Responsáveis (Normalizados e Individuais)
  ORGANIZACOES_NORMALIZADAS.forEach(org => {
    if (responsaveisAtivos.has(org.key)) {
      const btn = document.createElement('button');
      btn.className = 'filter-btn';
      btn.dataset.filter = 'responsavel';
      btn.dataset.value = org.key;
      btn.innerHTML = `
        <span>${org.label}</span>
        <span class="filter-count" id="count-resp-${org.key.replace(/[^a-zA-Z0-9]/g, '-')}">0</span>
      `;
      DOM.filterResponsavelOptions.appendChild(btn);
    }
  });

  // 4. Renderizar Status
  Array.from(statuses).forEach(statusCat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.dataset.filter = 'status';
    btn.dataset.value = statusCat;
    
    let label = 'Prevista / Planejada';
    if (statusCat === 'superada') label = 'Concluída / Superada';
    if (statusCat === 'execucao') label = 'Em Execução';
    
    btn.innerHTML = `
      <span>${label}</span>
      <span class="filter-count" id="count-status-${statusCat}">0</span>
    `;
    DOM.filterStatusOptions.appendChild(btn);
  });
};

// ==========================================================================
// CÁLCULO E RENDERIZAÇÃO DOS CONTADORES E KPIS
// ==========================================================================

const updateCountsAndKPIs = () => {
  const total = state.actions.length;
  const filtered = state.filteredActions;
  const filteredCount = filtered.length;

  // Atualizar contadores gerais dos botões "Todos"
  document.getElementById('count-up-all').textContent = state.actions.filter(a => state.filters.topic === 'all' || a.linhaAcao === state.filters.topic).length; // simplificado
  
  // Atualizar contadores de UPs
  document.getElementById('count-up-up1').textContent = state.actions.filter(a => a.unidade === 'UP1').length;
  document.getElementById('count-up-up2').textContent = state.actions.filter(a => a.unidade === 'UP2').length;
  document.getElementById('count-up-up3').textContent = state.actions.filter(a => a.unidade === 'UP3').length;

  // Atualizar contadores de Linhas de Ação dinamicamente
  document.querySelectorAll('[data-filter="topic"]').forEach(btn => {
    const val = btn.dataset.value;
    if (val === 'all') {
      btn.querySelector('.filter-count').textContent = total;
    } else {
      btn.querySelector('.filter-count').textContent = state.actions.filter(a => a.linhaAcao === val).length;
    }
  });

  // Atualizar contadores de Responsáveis dinamicamente (granular/múltiplo)
  document.querySelectorAll('[data-filter="responsavel"]').forEach(btn => {
    const val = btn.dataset.value;
    if (val === 'all') {
      btn.querySelector('.filter-count').textContent = total;
    } else {
      btn.querySelector('.filter-count').textContent = state.actions.filter(a => getActionOrgs(a).includes(val)).length;
    }
  });

  // Atualizar contadores de Status dinamicamente
  document.querySelectorAll('[data-filter="status"]').forEach(btn => {
    const val = btn.dataset.value;
    if (val === 'all') {
      btn.querySelector('.filter-count').textContent = total;
    } else {
      btn.querySelector('.filter-count').textContent = state.actions.filter(a => getStatusCategory(a.status) === val).length;
    }
  });

  // Calcular estatísticas dos KPIs baseados nas ações ativas nos filtros
  let superadas = 0;
  let execucao = 0;
  let previstas = 0;

  filtered.forEach(action => {
    const cat = getStatusCategory(action.status);
    if (cat === 'superada') superadas++;
    else if (cat === 'execucao') execucao++;
    else previstas++;
  });

  // Atualizar valores do Dashboard com animação de número se possível
  DOM.kpiTotalVal.textContent = filteredCount;
  DOM.kpiConcluidoVal.textContent = superadas;
  DOM.kpiExecucaoVal.textContent = execucao;
  DOM.kpiPrevistoVal.textContent = previstas;

  // Calcular porcentagens
  const pctSuperadas = filteredCount > 0 ? Math.round((superadas / filteredCount) * 100) : 0;
  const pctExecucao = filteredCount > 0 ? Math.round((execucao / filteredCount) * 100) : 0;
  const pctPrevistas = filteredCount > 0 ? Math.round((previstas / filteredCount) * 100) : 0;

  // Atualizar barras de progresso
  DOM.kpiConcluidoBar.style.width = `${pctSuperadas}%`;
  DOM.kpiExecucaoBar.style.width = `${pctExecucao}%`;
  DOM.kpiPrevistoBar.style.width = `${pctPrevistas}%`;

  // Atualizar descrições textuais das barras
  DOM.kpiConcluidoDesc.textContent = `${pctSuperadas}% do painel concluído`;
  DOM.kpiExecucaoDesc.textContent = `${pctExecucao}% em andamento`;
  DOM.kpiPrevistoDesc.textContent = `${pctPrevistas}% planejadas para execução`;
};

// ==========================================================================
// FILTRAGEM E ORDENAÇÃO DOS DADOS
// ==========================================================================

const filterAndSortData = () => {
  const { filters, sortBy } = state;

  // 1. Filtragem
  state.filteredActions = state.actions.filter(action => {
    // Filtro de Busca Global
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const matchSearch = 
        action.acao.toLowerCase().includes(q) ||
        action.responsavel.toLowerCase().includes(q) ||
        (action.finalidade && action.finalidade.toLowerCase().includes(q)) ||
        (action.observacoes && action.observacoes.toLowerCase().includes(q)) ||
        (action.indicadores && action.indicadores.toLowerCase().includes(q)) ||
        (action.comprovação && action.comprovação.toLowerCase().includes(q));
      
      if (!matchSearch) return false;
    }

    // Filtro de UP
    if (filters.up !== 'all' && action.unidade !== filters.up) {
      return false;
    }

    // Filtro de Linha de Ação (Topic)
    if (filters.topic !== 'all' && action.linhaAcao !== filters.topic) {
      return false;
    }

    // Filtro de Responsável (Verifica se a organização está inclusa na ação)
    if (filters.responsavel !== 'all' && !getActionOrgs(action).includes(filters.responsavel)) {
      return false;
    }

    // Filtro de Status
    if (filters.status !== 'all' && getStatusCategory(action.status) !== filters.status) {
      return false;
    }

    return true;
  });

  // 2. Ordenação
  state.filteredActions.sort((a, b) => {
    if (sortBy === 'num-asc') {
      return a.n - b.n;
    } else if (sortBy === 'num-desc') {
      return b.n - a.n;
    } else if (sortBy === 'linha-asc') {
      return a.linhaAcao.localeCompare(b.linhaAcao);
    } else if (sortBy === 'status-asc') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // 3. Atualizar UI
  renderTable();
  updateCountsAndKPIs();
};

// ==========================================================================
// RENDERIZAÇÃO DA TABELA DE AÇÕES
// ==========================================================================

const renderTable = () => {
  const list = state.filteredActions;
  DOM.actionsTableBody.innerHTML = '';

  if (list.length === 0) {
    DOM.emptyState.style.display = 'flex';
    document.getElementById('actions-table').style.display = 'none';
    DOM.explorerTitleCount.textContent = 'Nenhuma ação costeira mapeada';
    return;
  }

  DOM.emptyState.style.display = 'none';
  document.getElementById('actions-table').style.display = 'table';
  DOM.explorerTitleCount.textContent = `${list.length} Ações Mapeadas`;

  list.forEach(action => {
    const tr = document.createElement('tr');
    tr.dataset.id = action.n;
    
    // Obter categoria de status para estilo de badge
    const statusCat = getStatusCategory(action.status);
    
    // Simplificar exibição do status longo na tabela
    let shortStatus = action.status;
    if (shortStatus.length > 25) {
      shortStatus = shortStatus.substring(0, 22) + '...';
    }

    // Estilo específico para badges de UP
    const upClass = action.unidade.toLowerCase();

    const upDescriptions = {
      'UP1': 'UP1 (Fluvial - Gravatá foz): Área ao longo do Rio Gravatá até a foz.',
      'UP2': 'UP2 (Marítima - Gravatá/Pontal): Orla marítima arenosa (Gravatá, Centro, Pontal).',
      'UP3': 'UP3 (Fluvial - Centro/Porto): Área fluvial do Rio Itajaí-Açu, porto e centro histórico.'
    };
    const upTooltip = upDescriptions[action.unidade] || 'Unidade de Planejamento da Orla.';

    const statusDescriptions = {
      'superada': 'Concluído/Superado: Esta diretriz ou ação foi totalmente concluída de forma satisfatória.',
      'execucao': 'Em Execução: Ação em fase ativa de implementação pelo órgão responsável.',
      'previsto': 'Previsto/Planejado: Ação do plano de orla planejada para execução, aguardando início.'
    };
    const statusTooltip = statusDescriptions[statusCat] || `Status: ${action.status}`;

    tr.innerHTML = `
      <td class="col-num">#${action.n}</td>
      <td data-label="Categoria" style="font-weight: 600; color: var(--text-secondary); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.02em;">${action.linhaAcao}</td>
      <td class="col-action">${action.acao}</td>
      <td data-label="Responsável" class="col-responsavel" style="font-size: 0.8rem; line-height: 1.3;">${action.pasta}</td>
      <td data-label="UP"><span class="badge-up ${upClass} glossary-term" tabindex="0" data-tooltip="${upTooltip}">${action.unidade}</span></td>
      <td data-label="Status"><span class="badge-status ${statusCat} glossary-term" tabindex="0" data-tooltip="${statusTooltip}">${shortStatus}</span></td>
    `;

    tr.addEventListener('click', () => openSlideOver(action));
    DOM.actionsTableBody.appendChild(tr);
  });
};

// ==========================================================================
// CONTROLE DO SLIDE-OVER (GAVETA DE DETALHES)
// ==========================================================================

const openSlideOver = (action) => {
  const statusCat = getStatusCategory(action.status);
  
  DOM.detailId.textContent = `AÇÃO Nº ${action.n}`;
  
  const upDescriptions = {
    'UP1': 'UP1 (Fluvial - Gravatá foz): Área ao longo do Rio Gravatá até a foz.',
    'UP2': 'UP2 (Marítima - Gravatá/Pontal): Orla marítima arenosa (Gravatá, Centro, Pontal).',
    'UP3': 'UP3 (Fluvial - Centro/Porto): Área fluvial do Rio Itajaí-Açu, porto e centro histórico.'
  };
  const upTooltip = upDescriptions[action.unidade] || 'Unidade de Planejamento da Orla.';
  DOM.detailUp.textContent = action.unidade;
  DOM.detailUp.className = `badge-up ${action.unidade.toLowerCase()} glossary-term`;
  DOM.detailUp.setAttribute('data-tooltip', upTooltip);
  DOM.detailUp.setAttribute('tabindex', '0');
  
  const statusDescriptions = {
    'superada': 'Concluído/Superado: Esta diretriz ou ação foi totalmente concluída de forma satisfatória.',
    'execucao': 'Em Execução: Ação em fase ativa de implementação pelo órgão responsável.',
    'previsto': 'Previsto/Planejado: Ação do plano de orla planejada para execução, aguardando início.'
  };
  const statusTooltip = statusDescriptions[statusCat] || `Status: ${action.status}`;
  DOM.detailStatus.textContent = action.status;
  DOM.detailStatus.className = `badge-status ${statusCat} glossary-term`;
  DOM.detailStatus.setAttribute('data-tooltip', statusTooltip);
  DOM.detailStatus.setAttribute('tabindex', '0');

  // Criar HTML estruturado para o conteúdo rico
  DOM.detailContent.innerHTML = `
    <!-- Ação Principal -->
    <div class="detail-section">
      <span class="detail-label">Ação / Diretriz Mapeada</span>
      <h3 class="detail-value action-highlight" id="slideover-action-title">${action.acao}</h3>
    </div>

    <!-- Finalidade -->
    <div class="detail-section">
      <span class="detail-label">Finalidade Principal</span>
      <div class="detail-value" style="font-weight: 500;">${action.finalidade || 'Não especificada.'}</div>
    </div>

    <!-- Responsáveis e Atores -->
    <div class="detail-grid-half">
      <div class="detail-card-light">
        <span class="detail-label">Órgão Responsável</span>
        <div class="detail-value" style="display: flex; gap: 0.35rem; flex-wrap: wrap; margin-top: 0.25rem; margin-bottom: 0.35rem;">
          ${getActionOrgs(action).map(org => {
            const orgData = ORGANIZACOES_NORMALIZADAS.find(o => o.key === org) || { label: org };
            return `<span class="badge-up glossary-term" tabindex="0" data-tooltip="${orgData.label}" style="background-color: var(--accent-costal-light); color: var(--accent-costal); font-size: 0.7rem; font-weight: 700; padding: 0.15rem 0.4rem; border-radius: 4px; cursor: help;">${org}</span>`;
          }).join('')}
        </div>
        <div class="detail-value" style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.3;">
          <strong>Original:</strong> ${action.pasta}
        </div>
      </div>
      <div class="detail-card-light">
        <span class="detail-label">Executores / Parceiros (Planilha)</span>
        <div class="detail-value" style="font-size: 0.85rem; line-height: 1.45; font-weight: 500;">
          <strong>Executor:</strong> ${action.responsavel || '-'}<br>
          <strong>Parceiros:</strong> ${action.parceiros || 'Nenhum'}
        </div>
      </div>
    </div>

    <!-- Prazos e Trecho -->
    <div class="detail-grid-half">
      <div class="detail-section">
        <span class="detail-label">Prazo de Execução</span>
        <div class="detail-value" style="text-transform: capitalize;">${action.prazo || '-'}</div>
      </div>
      <div class="detail-section">
        <span class="detail-label">Duração & Regularidade</span>
        <div class="detail-value" style="text-transform: capitalize;">${action.duracao || '-'}</div>
      </div>
    </div>

    <!-- Trecho Específico -->
    <div class="detail-section">
      <span class="detail-label">Trecho Geográfico da Orla</span>
      <div class="detail-value">${action.trecho || 'Todo o município'}</div>
    </div>

    <!-- Indicador de Sucesso -->
    <div class="detail-section">
      <span class="detail-label">Indicador de Monitoramento</span>
      <div class="detail-card-light" style="border-left: 3px solid var(--accent-eco); background-color: var(--accent-eco-light);">
        <div class="detail-value" style="font-weight: 500; font-size: 0.85rem; line-height: 1.5;">${action.indicadores || 'Nenhum cadastrado.'}</div>
      </div>
    </div>

    <!-- Indicador 2025 -->
    <div class="detail-section">
      <span class="detail-label">Progresso Atual / Indicadores 2025</span>
      <div class="detail-value" style="font-weight: 600; color: var(--text-primary);">${action.resultados2025 || 'Não avaliado.'}</div>
    </div>

    <!-- Comprovante Anexo -->
    <div class="detail-grid-half">
      <div class="detail-section">
        <span class="detail-label">Evidência / Comprovação</span>
        <div class="detail-value" style="font-weight: 700; color: var(--accent-costal);">${action.comprovação || '-'}</div>
      </div>
    </div>

    <!-- Observações Municipais -->
    ${action.observacoes ? `
      <div class="detail-section">
        <span class="detail-label">Observações Municipais</span>
        <div class="detail-value" style="font-style: italic; background-color: var(--accent-sun-light); padding: 1rem; border-radius: 8px; border-left: 3px solid var(--accent-sun); font-size: 0.85rem;">
          "${action.observacoes}"
        </div>
      </div>
    ` : ''}
  `;

  // Abrir Gaveta
  DOM.detailOverlay.classList.add('active');
  DOM.detailPanel.classList.add('active');
  
  DOM.detailPanel.setAttribute('aria-hidden', 'false');
  DOM.detailOverlay.setAttribute('aria-hidden', 'false');
};

const closeSlideOver = () => {
  DOM.detailOverlay.classList.remove('active');
  DOM.detailPanel.classList.remove('active');
  
  DOM.detailPanel.setAttribute('aria-hidden', 'true');
  DOM.detailOverlay.setAttribute('aria-hidden', 'true');
};

// ==========================================================================
// VINCULAÇÃO DOS EVENTOS (EVENT LISTENERS)
// ==========================================================================

const bindEvents = () => {
  // Busca Global
  DOM.searchInput.addEventListener('input', (e) => {
    state.filters.search = e.target.value;
    filterAndSortData();
  });

  // Filtros de Botão Lateral
  const setupFilterClick = (container, filterName) => {
    container.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      // Resetar botões ativos no container
      container.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      
      // Ativar botão clicado
      btn.classList.add('active');

      // Atualizar filtro no estado e aplicar
      state.filters[filterName] = btn.dataset.value;
      filterAndSortData();
    });
  };

  setupFilterClick(DOM.filterUpOptions, 'up');
  setupFilterClick(DOM.filterTopicOptions, 'topic');
  setupFilterClick(DOM.filterResponsavelOptions, 'responsavel');
  setupFilterClick(DOM.filterStatusOptions, 'status');

  // Ordenação
  DOM.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    filterAndSortData();
  });

  // Fechar Slide-Over
  DOM.detailCloseBtn.addEventListener('click', closeSlideOver);
  DOM.detailOverlay.addEventListener('click', closeSlideOver);
  
  // Tecla Esc para fechar Slide-Over
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSlideOver();
  });

  // Abrir / Fechar filtros no Mobile
  const openMobileSidebar = () => {
    if (DOM.sidebar) DOM.sidebar.classList.add('active');
    if (DOM.sidebarOverlay) {
      DOM.sidebarOverlay.classList.add('active');
      DOM.sidebarOverlay.setAttribute('aria-hidden', 'false');
    }
  };

  const closeMobileSidebar = () => {
    if (DOM.sidebar) DOM.sidebar.classList.remove('active');
    if (DOM.sidebarOverlay) {
      DOM.sidebarOverlay.classList.remove('active');
      DOM.sidebarOverlay.setAttribute('aria-hidden', 'true');
    }
  };

  if (DOM.mobileFilterFab) {
    DOM.mobileFilterFab.addEventListener('click', openMobileSidebar);
  }

  if (DOM.mobileMenuHamburger) {
    DOM.mobileMenuHamburger.addEventListener('click', openMobileSidebar);
  }

  if (DOM.sidebarCloseBtn) {
    DOM.sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (DOM.sidebarOverlay) {
    DOM.sidebarOverlay.addEventListener('click', closeMobileSidebar);
  }
};

// ==========================================================================
// GLOSSÁRIO E TOOLTIPS INTELIGENTES (IMPECCABLE CLARIFY)
// ==========================================================================

const initTooltipSystem = () => {
  const tooltip = document.getElementById('global-tooltip');
  if (!tooltip) return;

  const showTooltip = (clientX, clientY, text) => {
    tooltip.textContent = text;
    tooltip.classList.add('visible');
    positionTooltip(clientX, clientY);
  };

  const hideTooltip = () => {
    tooltip.classList.remove('visible');
  };

  const positionTooltip = (clientX, clientY) => {
    const tooltipWidth = tooltip.offsetWidth || 280;
    const tooltipHeight = tooltip.offsetHeight || 60;
    const gap = 12;

    let x = clientX - tooltipWidth / 2;
    let y = clientY - tooltipHeight - gap;

    // Prevenir transbordamento nas laterais
    if (x < gap) x = gap;
    if (x + tooltipWidth > window.innerWidth - gap) {
      x = window.innerWidth - tooltipWidth - gap;
    }

    // Prevenir transbordamento no topo (mostrar abaixo do cursor)
    if (y < gap) {
      y = clientY + gap + 15;
    }

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  };

  // Eventos de Mouse
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      showTooltip(e.clientX, e.clientY, target.getAttribute('data-tooltip'));
    }
  });

  document.addEventListener('mousemove', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target && tooltip.classList.contains('visible')) {
      positionTooltip(e.clientX, e.clientY);
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      hideTooltip();
    }
  });

  // Acessibilidade (Foco via Teclado)
  document.addEventListener('focusin', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      const rect = target.getBoundingClientRect();
      const clientX = rect.left + rect.width / 2;
      const clientY = rect.top;
      showTooltip(clientX, clientY, target.getAttribute('data-tooltip'));
    }
  });

  document.addEventListener('focusout', (e) => {
    const target = e.target.closest('[data-tooltip]');
    if (target) {
      hideTooltip();
    }
  });
};

// ==========================================================================
// INICIALIZAÇÃO DO APLICATIVO
// ==========================================================================

const init = async () => {
  // Inicializar o sistema de tooltips
  initTooltipSystem();

  // Estado visual de carregamento nos dados
  DOM.explorerTitleCount.textContent = 'Buscando dados em tempo real do Google Sheets...';
  
  const sheetData = await fetchActionsFromGoogleSheets();
  if (sheetData && sheetData.length > 0) {
    state.actions = sheetData;
    console.log(`Carregado com sucesso: ${sheetData.length} ações lidas da planilha em tempo real!`);
  } else {
    console.log("Falha ao ler dados remotos. Usando backup local.");
    // Mantém o actionsData do import local como backup silencioso
  }
  
  state.filteredActions = [...state.actions];
  
  // Limpa containers dinâmicos antes de renderizar (evita duplicação)
  DOM.filterTopicOptions.innerHTML = `
    <button class="filter-btn active" data-filter="topic" data-value="all">
      <span>Todas as Categorias</span>
      <span class="filter-count" id="count-topic-all">0</span>
    </button>
  `;
  DOM.filterResponsavelOptions.innerHTML = `
    <button class="filter-btn active" data-filter="responsavel" data-value="all">
      <span>Todos os Órgãos</span>
      <span class="filter-count" id="count-resp-all">0</span>
    </button>
  `;
  DOM.filterStatusOptions.innerHTML = `
    <button class="filter-btn active" data-filter="status" data-value="all">
      <span>Todos os Status</span>
      <span class="filter-count" id="count-status-all">0</span>
    </button>
  `;

  initDynamicFilters();

  // No mobile, colapsa os filtros mais longos por padrão para evitar scroll excessivo
  if (window.innerWidth < 992) {
    const topicDetails = document.getElementById('group-topic');
    const respDetails = document.getElementById('group-responsavel');
    const statusDetails = document.getElementById('group-status');
    if (topicDetails) topicDetails.removeAttribute('open');
    if (respDetails) respDetails.removeAttribute('open');
    if (statusDetails) statusDetails.removeAttribute('open');
  }

  bindEvents();
  filterAndSortData();
};

document.addEventListener('DOMContentLoaded', init);
// Garantir execução caso o DOM já esteja carregado
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
}
