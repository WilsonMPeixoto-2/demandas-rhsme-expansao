import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createHistoryFixture, createMinimalDemandFixture } from '../test/expandedFixtures';
import { ModalHistorico } from './ModalHistorico';
import { VisaoGeral } from './VisaoGeral';

const demanda = createMinimalDemandFixture({
  id: 411,
  numero: '000700.002429/2026-91',
  assunto: 'Demanda de teste',
  responsavel: 'Usuário Oficial',
  status: 'Aguardando Andamento',
});

const importacao = createHistoryFixture({
  id: 351,
  demandaId: demanda.id,
  data_hora: '16/07/2026, 21:36:25',
  status_novo: demanda.status,
  setor: 'E/CTRH',
  comentario: 'Demanda importada do lote saneado 2ac7da80b744.',
  tipoEvento: 'criacao',
});

const vinculacao = createHistoryFixture({
  id: 741,
  demandaId: demanda.id,
  data_hora: '23/07/2026, 22:13:03',
  status_novo: demanda.status,
  setor: 'E/CTRH',
  comentario: 'Responsável vinculado a perfil oficial na migração R3.',
  tipoEvento: 'reatribuicao',
});

describe('apresentação do histórico', () => {
  afterEach(cleanup);

  it('mostra linguagem de produto no histórico individual sem expor referências internas', () => {
    render(
      <ModalHistorico
        demanda={demanda}
        historico={[vinculacao, importacao]}
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Histórico da demanda')).toBeVisible();
    expect(screen.getByText('Registro incorporado à base de demandas.')).toBeVisible();
    expect(screen.getByText('Cadastro do responsável atualizado.')).toBeVisible();
    expect(screen.getByText('Cadastro inicial')).toBeVisible();
    expect(screen.getByText('Alteração de responsável')).toBeVisible();
    expect(screen.queryByText(/R3/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/2ac7da80b744/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/lote saneado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/sistema legado/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/perfil oficial/i)).not.toBeInTheDocument();
  });

  it('não apresenta eventos técnicos como movimentações globais de trabalho', () => {
    render(
      <VisaoGeral
        demandas={[demanda]}
        historico={[vinculacao, importacao]}
        onOpenEditar={vi.fn()}
        onFilterStatus={vi.fn()}
        renderAtencaoImediata={() => null}
      />,
    );

    expect(screen.getAllByText('Registros recentes do histórico').length).toBeGreaterThan(0);
    expect(screen.getByText('Nenhuma movimentação operacional registrada.')).toBeInTheDocument();
    expect(screen.queryByText(/R3/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/lote saneado/i)).not.toBeInTheDocument();
  });
});
