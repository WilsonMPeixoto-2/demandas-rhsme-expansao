import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createMinimalDemandFixture } from '../test/expandedFixtures';
import { VisaoGeral } from './VisaoGeral';

const demandas = [
  createMinimalDemandFixture({ id: 1201, numero: 'SME-2026-01201',
    status: 'Tramitado', proximaAcao: '', proximaAcaoEm: '', linkOrigem: '' }),
  createMinimalDemandFixture({ id: 1202, numero: 'SME-2026-01202',
    status: 'Aguardando Andamento', proximaAcao: 'Solicitar resposta à unidade',
    proximaAcaoEm: '15/11/2026', linkOrigem: 'https://processo.rio/' }),
];

describe('Radar visual e navegação gerencial', () => {
  afterEach(cleanup);

  it('oferece navegação por status no gráfico', async () => {
    const onFilterStatus = vi.fn();
    render(<VisaoGeral demandas={demandas} historico={[]} onOpenEditar={vi.fn()}
      onFilterStatus={onFilterStatus} renderAtencaoImediata={() => null} />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Ver 1 demanda com status Tramitado' }));
    expect(onFilterStatus).toHaveBeenCalledWith('Tramitado');
  });

  it('apresenta cobertura real, sem inferir atraso do legado', () => {
    render(<VisaoGeral demandas={demandas} historico={[]} onOpenEditar={vi.fn()}
      onFilterStatus={vi.fn()} renderAtencaoImediata={() => null} />);
    expect(screen.getByRole('progressbar', { name: 'Próxima providência programada' }))
      .toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByRole('progressbar', { name: 'Vínculo com o processo oficial' }))
      .toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText(/Ausências legadas não são tratadas como atraso/)).toBeVisible();
  });
});
