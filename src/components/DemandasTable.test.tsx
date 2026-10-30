import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createDemandFixture } from '../test/expandedFixtures';
import { DemandasTable } from './DemandasTable';

const demanda = createDemandFixture({
  id: 1, numero: 'SME-001', tipo: 'Processo', assunto: 'Assunto', responsavel: 'Pessoa',
  limite1: '', limite2: '', status: 'Aguardando Andamento', setor: 'CTRH', classificacao: 'Outros',
});

describe('DemandasTable', () => {
  afterEach(cleanup);

  it('nomeia e informa o estado do menu de ações', () => {
    render(<DemandasTable
      demandas={[demanda]}
      onOpenEditar={vi.fn()}
      onOpenProgress={vi.fn()}
      onOpenStatus={vi.fn()}
      onOpenHistorico={vi.fn()}
      onExcluir={vi.fn()}
    />);
    const menuButton = screen.getByRole('button', { name: /mais ações da demanda sme-001/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-label');
  });

  it('mantém o rótulo das ações coerente com o comportamento da tabela', async () => {
    const onOpenDetalhes = vi.fn();
    const user = userEvent.setup();
    render(<DemandasTable
      demandas={[demanda]}
      onOpenEditar={onOpenDetalhes}
      onOpenProgress={vi.fn()}
      onOpenStatus={vi.fn()}
      onOpenHistorico={vi.fn()}
      onExcluir={vi.fn()}
      canEdit
      canDelete
    />);

    await user.click(screen.getByRole('button', { name: /^abrir$/i }));
    expect(onOpenDetalhes).toHaveBeenCalledWith(demanda);

    await user.click(screen.getByRole('button', { name: /mais ações da demanda sme-001/i }));
    expect(await screen.findByRole('menuitem', { name: /alterar status/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /histórico/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /excluir/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /^editar$/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^editar$/i })).not.toBeInTheDocument();
  });

  it('exibe e executa os atalhos operacionais sem abrir o menu de contexto', async () => {
    const onOpenProgress = vi.fn();
    const onOpenStatus = vi.fn();
    const onOpenHistorico = vi.fn();
    const user = userEvent.setup();
    render(<DemandasTable
      demandas={[demanda]}
      onOpenEditar={vi.fn()}
      onOpenProgress={onOpenProgress}
      onOpenStatus={onOpenStatus}
      onOpenHistorico={onOpenHistorico}
      onExcluir={vi.fn()}
      canEdit
      canDelete
    />);
    await user.click(screen.getByRole('button', { name: /registrar andamento da demanda sme-001/i }));
    await user.click(screen.getByRole('button', { name: /alterar status da demanda sme-001/i }));
    await user.click(screen.getByRole('button', { name: /histórico da demanda sme-001/i }));
    expect(onOpenProgress).toHaveBeenCalledWith(demanda);
    expect(onOpenStatus).toHaveBeenCalledWith(demanda);
    expect(onOpenHistorico).toHaveBeenCalledWith(demanda);
  });

  it('não oferece exclusão quando o perfil não possui permissão administrativa', async () => {
    render(<DemandasTable
      demandas={[demanda]}
      onOpenEditar={vi.fn()}
      onOpenProgress={vi.fn()}
      onOpenStatus={vi.fn()}
      onOpenHistorico={vi.fn()}
      onExcluir={vi.fn()}
      canEdit
      canDelete={false}
    />);

    await userEvent.setup().click(screen.getByRole('button', { name: /mais ações da demanda sme-001/i }));
    expect(screen.getByRole('menuitem', { name: /alterar status/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /histórico/i })).toBeInTheDocument();
    expect(screen.queryByRole('menuitem', { name: /excluir/i })).not.toBeInTheDocument();
  });
});
