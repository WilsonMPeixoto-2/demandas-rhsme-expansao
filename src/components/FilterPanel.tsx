import React from 'react';
import { classificacaoValues } from '../constants/demandaOptions';

interface FiltrosState {
  busca: string;
  tipo: string;
  classificacao: string;
  status: string;
  setor: string;
}

interface QuickFiltersState {
  assinatura: boolean;
  hoje: boolean;
  vencido: boolean;
}

interface FilterPanelProps {
  filtros: FiltrosState;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosState>>;
  quickFilters: QuickFiltersState;
  setQuickFilters: React.Dispatch<React.SetStateAction<QuickFiltersState>>;
  setoresDisponiveis: string[];
  totalExibidos: number;
  totalGeral: number;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filtros,
  setFiltros,
  quickFilters,
  setQuickFilters,
  setoresDisponiveis,
  totalExibidos,
  totalGeral
}) => {
  const [maisFiltrosAberto, setMaisFiltrosAberto] = React.useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFiltros(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleQuickFilter = (key: keyof QuickFiltersState) => {
    setQuickFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLimparFiltros = () => {
    // Resetar filtros textuais/selects e redefinir status para o padrão "Somente ativos"
    setFiltros({
      busca: '',
      tipo: 'Todos',
      classificacao: 'Todas',
      status: 'Somente ativos (padrão)',
      setor: 'Todos'
    });
    // Resetar botões rápidos cumulativos
    setQuickFilters({
      assinatura: false,
      hoje: false,
      vencido: false
    });
  };

  const statusList = [
    'Aguardando Andamento', 'Tramitado', 'Para Assinatura', 
    'Encerrado', 'Sobrestado', 'Ajustar'
  ];

  // Cálculo da contagem de filtros ativos
  let filtrosAtivosCount = 0;
  if (filtros.busca.trim()) filtrosAtivosCount++;
  if (filtros.tipo !== 'Todos') filtrosAtivosCount++;
  if (filtros.classificacao !== 'Todas') filtrosAtivosCount++;
  if (filtros.status !== 'Somente ativos (padrão)') filtrosAtivosCount++;
  if (filtros.setor !== 'Todos') filtrosAtivosCount++;
  if (quickFilters.assinatura) filtrosAtivosCount++;
  if (quickFilters.hoje) filtrosAtivosCount++;
  if (quickFilters.vencido) filtrosAtivosCount++;

  return (
    <div className="filters-panel">
      {/* Linha superior: Ações e Botões de Atalhos rápidos */}
      <div className="filters-header" style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
        <div className="filters-quick-buttons">
          {/* Botões rápidos cumulativos */}
          <button 
            type="button" 
            className={`btn-toggle ${quickFilters.assinatura ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('assinatura')}
          >
            Para assinatura
          </button>
          <button 
            type="button" 
            className={`btn-toggle ${quickFilters.hoje ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('hoje')}
          >
            Hoje
          </button>
          <button 
            type="button" 
            className={`btn-toggle ${quickFilters.vencido ? 'active' : ''}`}
            onClick={() => toggleQuickFilter('vencido')}
          >
            Vencido
          </button>
        </div>
      </div>

      {/* Grid principal de filtros permanentes */}
      <div className="filters-grid" style={{ marginTop: '20px' }}>
        {/* Campo de Busca Livre (Ocupa a maior largura) */}
        <div className="filter-group search-input-wrapper" style={{ gridColumn: 'span 2' }}>
          <label htmlFor="busca">Busca por texto</label>
          <div className="input-icon-group">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
              type="text" 
              id="busca" 
              name="busca" 
              className="form-control" 
              placeholder="Buscar por número, assunto ou responsável..." 
              value={filtros.busca}
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* Campo Status (Sempre visível) */}
        <div className="filter-group">
          <label htmlFor="status">Status</label>
          <select 
            id="status" 
            name="status" 
            className="form-select" 
            value={filtros.status}
            onChange={handleInputChange}
          >
            <option value="Somente ativos (padrão)">Somente ativos (padrão)</option>
            <option value="Todos (exibir tudo)">Todos (exibir tudo)</option>
            {statusList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Seção retrátil de filtros avançados */}
      <div className="more-filters-container">
        <button 
          type="button" 
          className={`btn-more-filters ${maisFiltrosAberto ? 'open' : ''}`}
          onClick={() => setMaisFiltrosAberto(!maisFiltrosAberto)}
          aria-expanded={maisFiltrosAberto}
        >
          <i className="fa-solid fa-chevron-down"></i>
          <span>{maisFiltrosAberto ? 'Menos filtros' : 'Mais filtros'}</span>
        </button>

        <div className={`more-filters-panel ${maisFiltrosAberto ? 'open' : ''}`}>
          <div className="more-filters-grid">
            {/* Campo Tipo */}
            <div className="filter-group">
              <label htmlFor="tipo">Tipo</label>
              <select 
                id="tipo" 
                name="tipo" 
                className="form-select" 
                value={filtros.tipo}
                onChange={handleInputChange}
              >
                <option value="Todos">Todos</option>
                <option value="Expediente">Expediente</option>
                <option value="Processo">Processo</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {/* Campo Classificação */}
            <div className="filter-group">
              <label htmlFor="classificacao">Classificação</label>
              <select 
                id="classificacao" 
                name="classificacao" 
                className="form-select" 
                value={filtros.classificacao}
                onChange={handleInputChange}
              >
                <option value="Todas">Todas</option>
                {classificacaoValues.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Campo Setor */}
            <div className="filter-group">
              <label htmlFor="setor">Setor</label>
              <select 
                id="setor" 
                name="setor" 
                className="form-select" 
                value={filtros.setor}
                onChange={handleInputChange}
              >
                <option value="Todos">Todos</option>
                {setoresDisponiveis.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo ativo e botão de limpeza */}
      <div className="filters-summary-row">
        <div className="filters-active-summary">
          {filtrosAtivosCount > 0 && (
            <>
              <span className="badge-count">{filtrosAtivosCount}</span>
              <span>{filtrosAtivosCount === 1 ? 'filtro ativo' : 'filtros ativos'}</span>
              <span style={{ color: '#cbd5e1', margin: '0 4px' }}>•</span>
            </>
          )}
          <span>
            {totalExibidos === totalGeral 
              ? `${totalGeral} demandas` 
              : `${totalExibidos} de ${totalGeral} demandas`
            }
          </span>
        </div>

        {(filtrosAtivosCount > 0) && (
          <button 
            type="button" 
            className="btn-clear-filters"
            onClick={handleLimparFiltros}
            title="Limpar todos os filtros de busca"
          >
            <i className="fa-solid fa-trash-can"></i>
            <span>Limpar filtros</span>
          </button>
        )}
      </div>
    </div>
  );
};
