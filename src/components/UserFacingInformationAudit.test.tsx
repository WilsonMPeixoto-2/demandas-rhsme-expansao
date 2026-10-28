import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDemandFixture, createHistoryFixture } from '../test/expandedFixtures';
import { DemandDetailDrawer } from './DemandDetailDrawer';
import { ModalEditar } from './ModalEditar';
import { VisaoGeral } from './VisaoGeral';
import { ResponsibleDistribution } from './ResponsibleDistribution';

const legacyDemand = createDemandFixture({
  id: 42,
  numero: 'SME-PRO-2026/00042',
  tipo: 'Processo',
  assunto: 'Assunto original',
  responsavel: 'Responsável anterior',
  responsavelId: null,
  limite1: '',
  limite1Situacao: 'nao_informado',
  limite2: '',
  limite2Situacao: 'nao_informado',
  status: 'Aguardando Andamento',
  setor: 'E/CTRH',
  classificacao: 'Outros',
  proximaAcao: 'Conferir documentação',
  proximaAcaoEm: '20/08/2099',
  origem: 'legado',
});

describe('informações apresentadas ao usuário', () => {
  afterEach(cleanup);

  it('não expõe identificadores nem regras de transição no modal de edição', () => {
    render(
      <ModalEditar
        demanda={legacyDemand}
        responsaveis={[]}
        onClose={vi.fn()}
        onSalvar={vi.fn()}
      />,
    );

    expect(screen.queryByDisplayValue(/ID:\s*42/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/registro legado/i)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(/responsável legado/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/motivo da alteração/i)).not.toBeInTheDocument();
  });

  it('exibe um campo de motivo completo somente quando a alteração exige justificativa', () => {
    render(
      <ModalEditar
        demanda={legacyDemand}
        responsaveis={[]}
        onClose={vi.fn()}
        onSalvar={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Assunto'), { target: { value: 'Assunto alterado' } });

    const reason = screen.getByLabelText('Motivo da alteração *');
    expect(reason).toBeVisible();
    expect(reason).toHaveClass('edit-justification-textarea');
    expect(screen.getByText('O motivo será registrado no histórico da demanda.')).toBeVisible();
  });

  it('não exige motivo na primeira inclusão de um prazo antes ausente', () => {
    render(
      <ModalEditar
        demanda={legacyDemand}
        responsaveis={[]}
        onClose={vi.fn()}
        onSalvar={vi.fn()}
      />,
    );

    fireEvent.click(screen.getAllByLabelText('Data definida')[0]);
    fireEvent.change(screen.getByLabelText('Data de prazo interno'), { target: { value: '20/08/2099' } });

    expect(screen.queryByLabelText(/motivo da alteração/i)).not.toBeInTheDocument();
  });

  it('oculta UUID e nomes técnicos de campos no histórico detalhado', () => {
    const history = createHistoryFixture({
      id: 500,
      demandaId: legacyDemand.id,
      data_hora: '23/07/2026, 22:13:03',
      status_novo: legacyDemand.status,
      setor: 'E/CTRH',
      comentario: 'Responsável vinculado a perfil oficial na migração R3.',
      tipoEvento: 'reatribuicao',
      alteracoes: [
        {
          field: 'responsavel_id',
          before: null,
          after: '84d7711e-4d9f-4994-a52a-b5238ac92ae0',
        },
        {
          field: 'responsavel',
          before: 'Responsável anterior',
          after: 'THIAGO KUBRUSLY DE FREITAS',
        },
        {
          field: 'limite1_situacao',
          before: 'nao_informado',
          after: 'definido',
        },
      ],
    });

    render(
      <DemandDetailDrawer
        demanda={legacyDemand}
        historico={[history]}
        open
        canEdit
        onClose={vi.fn()}
        onEdit={vi.fn()}
        onProgress={vi.fn()}
        onStatus={vi.fn()}
      />,
    );

    expect(screen.queryByText(/84d7711e/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/responsavel id/i)).not.toBeInTheDocument();
    expect(screen.getByText('Responsável')).toBeInTheDocument();
    expect(screen.getByText('Situação do prazo interno')).toBeInTheDocument();
    expect(screen.getByText('Data definida')).toBeInTheDocument();
  });

  it('usa linguagem neutra para cadastros de responsável ainda não associados', () => {
    render(<ResponsibleDistribution demandas={[legacyDemand]} />);

    expect(screen.getByText('Responsável não vinculado')).toBeVisible();
    expect(screen.queryByText(/vínculo legado/i)).not.toBeInTheDocument();
  });

  it('não usa o identificador numérico como substituto do processo no histórico do Radar', () => {
    const unmatchedHistory = createHistoryFixture({
      id: 700,
      demandaId: 999,
      data_hora: '30/07/2026, 10:00:00',
      status_novo: 'Aguardando Andamento',
      setor: 'E/CTRH',
      comentario: 'Documento encaminhado para conferência.',
      tipoEvento: 'andamento',
    });

    render(
      <VisaoGeral
        demandas={[]}
        historico={[unmatchedHistory]}
        onOpenEditar={vi.fn()}
        onFilterStatus={vi.fn()}
        renderAtencaoImediata={() => null}
      />,
    );

    fireEvent.click(screen.getByText('Consultar histórico').closest('summary')!);
    expect(screen.getByText('Processo não localizado')).toBeVisible();
    expect(screen.queryByText(/Processo #999/i)).not.toBeInTheDocument();
  });
});
