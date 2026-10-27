import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SiteNavigation } from './SiteNavigation';

describe('Navegação institucional do CTRH', () => {
  afterEach(cleanup);
  it('mantém a marca original e chama as rotas da aplicação', async () => {
    const onNavigate = vi.fn();
    render(<SiteNavigation activeArea="visao-geral" canAccessAdmin onNavigate={onNavigate} />);
    expect(screen.getByText('Fluxo CTRH')).toBeInTheDocument();
    const menu = screen.getByRole('navigation', { name: 'Áreas do sistema' });
    const radar = menu.querySelector('[aria-current="page"]');
    expect(radar).toHaveTextContent('Radar de Governança');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Todas as demandas' }));
    expect(onNavigate).toHaveBeenCalledWith('demandas');
    await userEvent.setup().click(screen.getByRole('button', { name: 'Recolher menu lateral' }));
    expect(screen.getByRole('button', { name: 'Expandir menu lateral' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todas as demandas' })).toBeInTheDocument();
  });

  it('não disponibiliza Administração para perfil sem acesso', () => {
    render(<SiteNavigation activeArea="minhas-demandas" canAccessAdmin={false} onNavigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Administração' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minhas demandas' })).toHaveAttribute('aria-current', 'page');
  });
});
