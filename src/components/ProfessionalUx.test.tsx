import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { Demanda } from '../types';
import { ModalNovo } from './ModalNovo';
import { DemandasTable } from './DemandasTable';

const base: Demanda = {
  id: 1,
  numero: 'SME-002',
  tipo: 'Processo',
  assunto: 'Segundo assunto',
  responsavel: 'Zilda',
  limite1: '',
  limite2: '20/07/2026',
  status: 'Tramitado',
  setor: 'CTRH',
  classificacao: 'Outros',
};

describe('experiência profissional de formulários e tabela', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('apresenta validação contextual sem usar alertas nativos', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => undefined);
    render(<ModalNovo onClose={vi.fn()} onSalvar={vi.fn()} />);

    fireEvent.submit(screen.getByRole('button', { name: /^salvar$/i }).closest('form')!);

    expect(await screen.findByText(/informe o tipo da demanda/i)).toBeVisible();
    expect(screen.getByText(/informe o número do processo ou documento/i)).toBeVisible();
    expect(alertSpy).not.toHaveBeenCalled();
  });

  it('oferece as classificações legadas válidas no cadastro', () => {
    render(<ModalNovo onClose={vi.fn()} onSalvar={vi.fn()} />);

    const classificacao = screen.getByLabelText('Selecione a classificação');
    expect(within(classificacao).getByRole('option', { name: 'Permuta' })).toBeInTheDocument();
    expect(within(classificacao).getByRole('option', { name: 'Diversos' })).toBeInTheDocument();
  });

  it('ordena por processo e pagina a lista', async () => {
    const demandas = Array.from({ length: 12 }, (_, index): Demanda => ({
      ...base,
      id: index + 1,
      numero: `SME-${String(12 - index).padStart(3, '0')}`,
      assunto: `Assunto ${index + 1}`,
    }));

    render(
      <DemandasTable
        demandas={demandas}
        onOpenEditar={vi.fn()}
        onOpenStatus={vi.fn()}
        onOpenHistorico={vi.fn()}
        onExcluir={vi.fn()}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /ordenar por processo/i }));
    const firstRow = screen.getAllByRole('row')[1];
    expect(within(firstRow).getByText('SME-001')).toBeVisible();

    expect(screen.getByText(/1–10 de 12 resultados/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /próxima página/i }));
    expect(screen.getByText(/11–12 de 12 resultados/i)).toBeVisible();
  });

  it('usa confirmação institucional antes de excluir', async () => {
    const onExcluir = vi.fn();
    render(
      <DemandasTable
        demandas={[base]}
        onOpenEditar={vi.fn()}
        onOpenStatus={vi.fn()}
        onOpenHistorico={vi.fn()}
        onExcluir={onExcluir}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /mais ações da demanda sme-002/i }));
    await user.click(screen.getByRole('menuitem', { name: /excluir/i }));

    expect(screen.getByRole('alertdialog')).toBeVisible();
    expect(screen.getByText(/essa ação não poderá ser desfeita/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /excluir demanda/i }));
    expect(onExcluir).toHaveBeenCalledWith(base.id);
  });
});
