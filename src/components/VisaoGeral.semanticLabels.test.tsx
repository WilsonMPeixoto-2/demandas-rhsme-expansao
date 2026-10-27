import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMinimalDemandFixture } from '../test/expandedFixtures';
import { VisaoGeral } from './VisaoGeral';

const demandas = [
  createMinimalDemandFixture({
    id: 901,
    numero: 'SME-PRO-2026/00901',
    assunto: 'Demanda de teste semântico',
    responsavel: 'Usuário Oficial',
    responsavelId: 'uuid-oficial',
    setor: 'E/CTRH',
    status: 'Aguardando Andamento',
    limite1: '',
    limite1Situacao: 'nao_informado',
    limite2: '25/07/2026',
    limite2Situacao: 'definido',
  }),
  createMinimalDemandFixture({
    id: 902,
    numero: 'SME-PRO-2026/00902',
    assunto: 'Demanda importada de teste',
    responsavel: 'Vanessa Migrado',
    responsavelId: null,
    setor: 'E/CTRH',
    status: 'Sobrestado',
  }),
];

describe('semânticas do Radar de Governança', () => {
  afterEach(cleanup);

  it('mantém as leituras analíticas sem duplicar identidade nem avisos internos', () => {
    render(
      <VisaoGeral
        demandas={demandas}
        historico={[]}
        onOpenEditar={vi.fn()}
        onFilterStatus={vi.fn()}
        renderAtencaoImediata={() => null}
      />,
    );

    expect(screen.queryByRole('heading', { name: 'Radar de Governança' })).not.toBeInTheDocument();
    expect(screen.queryByText('Composição atual')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Leitura da carteira' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Composição da carteira' })).toBeVisible();
    expect(screen.queryByText('Visão estratégica do fluxo de trabalho, com análise de dados e monitoramento da carteira de demandas.')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Cobertura dos prazos' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Distribuição por responsável' })).toBeVisible();
    expect(screen.getByRole('heading', { name: 'Demandas por setor informado' })).toBeVisible();
    expect(screen.getByText('Vanessa Migrado')).toBeVisible();
    expect(screen.getByText('Responsável não vinculado')).toBeVisible();
    expect(screen.queryByText(/vínculo legado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/setores mais ativos/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/ranking/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Distribuições calculadas sobre as demandas atualmente registradas, sem inferência de produtividade ou desempenho.')).not.toBeInTheDocument();
    expect(screen.queryByText('A ausência de prazo é apresentada como ausência de informação e não como situação regular.')).not.toBeInTheDocument();
    expect(screen.queryByText('Volume e composição por status. A leitura não representa produtividade, desempenho ou carga equivalente de trabalho.')).not.toBeInTheDocument();
  });
});
