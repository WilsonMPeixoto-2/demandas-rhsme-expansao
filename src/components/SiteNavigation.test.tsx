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

  it('abre e fecha o menu lateral pelo controle do topo', async () => {
    const user = userEvent.setup();
    render(<SiteNavigation activeArea="visao-geral" canAccessAdmin onNavigate={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Abrir menu principal' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Fechar menu lateral' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fechar menu lateral' }));
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('fecha o menu após escolher uma área e preserva a rota', async () => {
    const onNavigate = vi.fn();
    const user = userEvent.setup();
    render(<SiteNavigation activeArea="visao-geral" canAccessAdmin onNavigate={onNavigate} />);
    await user.click(screen.getByRole('button', { name: 'Abrir menu principal' }));
    await user.click(screen.getByRole('navigation', { name: 'Áreas do sistema' })
      .querySelector<HTMLButtonElement>('.ct-nav-button:not(.is-current)')!);
    expect(onNavigate).toHaveBeenCalledWith('demandas');
    expect(screen.getByRole('button', { name: 'Abrir menu principal' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('não disponibiliza Administração para perfil sem acesso', () => {
    render(<SiteNavigation activeArea="minhas-demandas" canAccessAdmin={false} onNavigate={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Administração' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minhas demandas' })).toHaveAttribute('aria-current', 'page');
  });
});
