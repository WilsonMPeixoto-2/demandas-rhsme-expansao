import { useState } from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_DEMAND_FILTERS, type DemandFilters } from '../filters/filterTypes';
import { createDemandFixture, createHistoryFixture } from '../test/expandedFixtures';
import { AtencaoImediata } from './AtencaoImediata';
import { FilterPanel } from './FilterPanel';
import { Header } from './Header';
import { VisaoGeral } from './VisaoGeral';

const demanda = createDemandFixture({
  id: 1,
  numero: 'SME-001',
  tipo: 'Processo',
  assunto: 'Assunto de teste',
  responsavel: 'Pessoa',
  limite1: '',
  limite2: '',
  status: 'Aguardando Andamento',
  setor: 'CTRH',
  classificacao: 'Outros',
});

const historico = createHistoryFixture({
  id: 1,
  demandaId: 1,
  data_hora: '13/07/2026 10:00:00',
  status_novo: 'Aguardando Andamento',
  setor: 'CTRH',
  comentario: 'Registro inicial',
  tipoEvento: 'criacao',
});

function todayString() {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
}

describe('ações interativas da interface', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('aciona corretamente os botões e indicadores do cabeçalho', async () => {
    const onLogout = vi.fn();
    const onOpenNovo = vi.fn();
    const onExportExcel = vi.fn();
    const onOpenMinhasDemandas = vi.fn();
    const onToggleFiltroStatus = vi.fn();
    const onToggleQuickFilter = vi.fn();

    render(
      <Header
        userEmail="admin@rioeduca.net"
        demandas={[demanda]}
        onLogout={onLogout}
        onOpenNovo={onOpenNovo}
        onExportExcel={onExportExcel}
        onOpenMinhasDemandas={onOpenMinhasDemandas}
        personalWorkspaceActive={false}
        filtrosAtivos={{
          status: 'acompanhamento',
          quickFilters: { assinatura: false, hoje: false, vencido: false },
        }}
        onToggleFiltroStatus={onToggleFiltroStatus}
        onToggleQuickFilter={onToggleQuickFilter}
        canEdit
        connectionStatus="online"
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /^sair$/i }));
    await user.click(screen.getByRole('button', { name: /exportar excel/i }));
    await user.click(screen.getByRole('button', { name: /nova demanda/i }));
    await user.click(screen.getByRole('button', { name: /em acompanhamento/i }));
    await user.click(screen.getByRole('button', { name: /para assinatura/i }));
    await user.click(screen.getByRole('button', { name: /minhas demandas.*acompanhe sua carteira/i }));

    expect(onLogout).toHaveBeenCalledOnce();
    expect(onExportExcel).toHaveBeenCalledOnce();
    expect(onOpenNovo).toHaveBeenCalledOnce();
    expect(onToggleFiltroStatus).toHaveBeenCalledWith('acompanhamento');
    expect(onToggleQuickFilter).toHaveBeenCalledWith('assinatura');
    expect(onOpenMinhasDemandas).toHaveBeenCalledOnce();
  });

  it('comunica visualmente quando a carteira pessoal está ativa', () => {
    render(
      <Header
        userEmail="admin@rioeduca.net"
        demandas={[demanda]}
        onLogout={vi.fn()}
        onOpenNovo={vi.fn()}
        onExportExcel={vi.fn()}
        onOpenMinhasDemandas={vi.fn()}
        personalWorkspaceActive
        filtrosAtivos={{
          status: 'acompanhamento',
          quickFilters: { assinatura: false, hoje: false, vencido: false },
        }}
        onToggleFiltroStatus={vi.fn()}
        onToggleQuickFilter={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /minhas demandas.*acompanhe sua carteira/i }))
      .toHaveAttribute('aria-pressed', 'true');
  });

  it('expande filtros avançados e limpa todos os filtros ativos', async () => {
    function FilterHarness() {
      const [filtros, setFiltros] = useState<DemandFilters>({
        ...DEFAULT_DEMAND_FILTERS,
        query: 'processo',
        type: 'Processo',
        classification: 'Outros',
        status: 'todos',
        sector: 'CTRH',
      });
      const [quickFilters, setQuickFilters] = useState({
        assinatura: true,
        hoje: false,
        vencido: false,
      });

      return (
        <FilterPanel
          filtros={filtros}
          setFiltros={setFiltros}
          quickFilters={quickFilters}
          setQuickFilters={setQuickFilters}
          setoresDisponiveis={['CTRH']}
          totalExibidos={1}
          totalGeral={1}
        />
      );
    }

    render(<FilterHarness />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /mais filtros/i }));
    expect(screen.getByRole('button', { name: /menos filtros/i })).toHaveAttribute('aria-expanded', 'true');

    await user.click(screen.getByRole('button', { name: /limpar filtros/i }));
    expect(screen.getByLabelText(/busca por texto/i)).toHaveValue('');
    expect(screen.getByLabelText(/^status$/i)).toHaveValue('acompanhamento');
    expect(screen.getByRole('button', { name: /para assinatura/i })).not.toHaveClass('active');
  });

  it('abre uma demanda pela faixa de atenção imediata', async () => {
    const onOpen = vi.fn();
    render(
      <AtencaoImediata
        demandas={[{ ...demanda, limite2: todayString(), limite2Situacao: 'definido' }]}
        historico={[]}
        onOpenEditar={onOpen}
      />,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: /^abrir$/i }));
    expect(onOpen).toHaveBeenCalledWith(expect.objectContaining({ id: demanda.id }));
  });

  it('abre o processo a partir das últimas movimentações da visão geral', async () => {
    const onOpen = vi.fn();
    render(
      <VisaoGeral
        demandas={[demanda]}
        historico={[historico]}
        onOpenEditar={onOpen}
        onFilterStatus={vi.fn()}
        renderAtencaoImediata={() => null}
      />,
    );

    await userEvent.setup().click(screen.getByRole('button', { name: /ver processo/i }));
    expect(onOpen).toHaveBeenCalledWith(demanda);
  });
});
