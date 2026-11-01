import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createAppServices } from './services/createAppServices';

function renderLocalApp() {
  return render(<App services={createAppServices({ mode: 'local' })} />);
}

describe('segurança e acessibilidade do login', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    window.history.replaceState({}, '', '/');
    vi.unstubAllGlobals();
  });

  it('permite mostrar e ocultar a senha', async () => {
    renderLocalApp();
    const password = await screen.findByLabelText('Senha', { exact: true });
    expect(password).toHaveAttribute('type', 'password');
    await userEvent.setup().click(screen.getByRole('button', { name: /mostrar senha/i }));
    expect(password).toHaveAttribute('type', 'text');
    expect(screen.getByRole('button', { name: /ocultar senha/i })).toBeInTheDocument();
  });

  it('apresenta validação contextual no login sem recorrer à validação nativa', async () => {
    renderLocalApp();
    await userEvent.setup().click(await screen.findByRole('button', { name: /acessar sistema/i }));

    expect(await screen.findByText(/informe o e-mail corporativo/i)).toBeInTheDocument();
    expect(screen.getByText(/informe a senha/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('usuario@rioeduca.net')).toHaveAttribute('aria-invalid', 'true');
  });

  it('mantém no formulário de primeiro acesso os erros junto aos campos', async () => {
    const user = userEvent.setup();
    renderLocalApp();
    await user.click(screen.getByRole('button', { name: /primeiro acesso/i }));
    await user.type(screen.getByPlaceholderText('nome@rioeduca.net'), 'usuario@exemplo.com');
    await user.type(screen.getByLabelText('Criar nova senha'), 'fraca');
    await user.click(screen.getByRole('button', { name: /solicitar acesso/i }));

    expect(await screen.findByText(/use um e-mail @rioeduca\.net/i)).toBeInTheDocument();
    expect(screen.getByText(/a senha deve ter no mínimo 8 caracteres/i)).toBeInTheDocument();
  });

  it('limpa e-mail e senha dos campos ao sair', async () => {
    const user = userEvent.setup();
    vi.stubGlobal('alert', vi.fn());
    renderLocalApp();
    await user.type(screen.getByPlaceholderText('usuario@rioeduca.net'), 'teste@rioeduca.net');
    await user.type(screen.getByLabelText('Senha', { exact: true }), 'senha-local-teste');
    await user.click(screen.getByRole('button', { name: /acessar sistema/i }));
    await user.click(await screen.findByRole('button', { name: /sair/i }));
    await waitFor(() => expect(screen.getByPlaceholderText('usuario@rioeduca.net')).toHaveValue(''));
    expect(screen.getByLabelText('Senha', { exact: true })).toHaveValue('');
  });

  it('nomeia o controle de fechar o drawer', async () => {
    localStorage.setItem('demandas_user', 'teste@rioeduca.net');
    renderLocalApp();
    const user = userEvent.setup();
    await user.click(await screen.findByRole('button', { name: /^todas as demandas$/i }));
    await user.click((await screen.findAllByRole('button', { name: /^abrir$/i }))[0]);
    expect(await screen.findByRole('button', { name: /fechar painel de detalhes/i })).toHaveAttribute('aria-label');
  });

  it('torna o drawer inerte enquanto um modal está aberto sobre ele', async () => {
    localStorage.setItem('demandas_user', 'teste@rioeduca.net');
    renderLocalApp();
    const user = userEvent.setup();

    await user.click(await screen.findByRole('button', { name: /^todas as demandas$/i }));
    await user.click((await screen.findAllByRole('button', { name: /^abrir$/i }))[0]);
    await user.click(await screen.findByRole('button', { name: /^editar$/i }));

    expect(await screen.findByRole('heading', { name: /editar dados da demanda/i })).toBeVisible();
    await waitFor(() => {
      const drawer = document.querySelector('.drawer-overlay');
      expect(drawer).toHaveAttribute('inert');
      expect(drawer).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

describe('navegação persistente', () => {
  afterEach(() => {
    cleanup();
    localStorage.clear();
    window.history.replaceState({}, '', '/');
  });

  it('restaura a tela de demandas pela URL', async () => {
    localStorage.setItem('demandas_user', 'teste@rioeduca.net');
    window.history.replaceState({}, '', '/demandas?status=Todos%20%28exibir%20tudo%29');
    renderLocalApp();

    expect(await screen.findByRole('button', { name: /^todas as demandas$/i })).toHaveClass('active');
    expect(await screen.findByLabelText(/^status$/i)).toHaveValue('todos');
  });

  it('migra a URL antiga de ativos e descarta parâmetro desconhecido', async () => {
    localStorage.setItem('demandas_user', 'teste@rioeduca.net');
    window.history.replaceState(
      {},
      '',
      '/demandas?status=Somente%20ativos%20%28padr%C3%A3o%29&comando=ignorar',
    );
    renderLocalApp();

    expect(await screen.findByLabelText(/^status$/i)).toHaveValue('acompanhamento');
    await waitFor(() => expect(new URL(window.location.href).searchParams.has('comando')).toBe(false));
  });
});
