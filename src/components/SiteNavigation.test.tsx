import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SiteNavigation } from './SiteNavigation';

describe('Navegação institucional do CTRH', () => {
  it('mantém a marca original e chama as rotas da aplicação', async () => {
    const onNavigate = vi.fn();
    render(<SiteNavigation activeArea="visao-geral" canAccessAdmin onNavigate={onNavigate} />);
    expect(screen.getByText('Fluxo CTRH')).toBeInTheDocument();
    const desktop = screen.getAllByRole('navigation', { name: 'Áreas do sistema', hidden: true })[0];
    const radar = desktop.querySelector('[aria-current="page"]');
    expect(radar).toHaveTextContent('Radar de Governança');
    await userEvent.setup().click(screen.getAllByRole('button', { name: /todas as demandas/i, hidden: true })[0]);
    expect(onNavigate).toHaveBeenCalledWith('demandas');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Recolher menu lateral' }));
    expect(screen.getByRole('button', { name: 'Expandir menu lateral' })).toBeInTheDocument();
  });

  it('não disponibiliza Administração para perfil sem acesso', () => {
    render(<SiteNavigation activeArea="minhas-demandas" canAccessAdmin={false} onNavigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: /^administração$/i, hidden: true })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^minhas demandas$/i, hidden: true }).length).toBeGreaterThan(0);
  });
});
