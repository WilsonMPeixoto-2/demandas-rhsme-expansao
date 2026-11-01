import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthPanel } from './AuthPanel';

function setup(overrides = {}) {
  const props = {
    mode: 'supabase' as const,
    loading: false,
    onSignIn: vi.fn().mockResolvedValue(undefined),
    onRequestAccess: vi.fn().mockResolvedValue(undefined),
    onRequestPasswordReset: vi.fn().mockResolvedValue(undefined),
    ...overrides,
  };
  render(<AuthPanel {...props} />);
  return { user: userEvent.setup(), ...props };
}

afterEach(cleanup);

describe('login monumental — composição aprovada e contratos preservados', () => {
  it('expõe o título editorial e a arte canônica, com orientação de ajuda real', async () => {
    const { user } = setup();
    expect(screen.getByRole('heading', { level: 1, name: 'Bem-vindo ao Fluxo CTRH' })).toBeVisible();
    expect(screen.getByRole('img', { name: /arcos da lapa/i })).toHaveAttribute(
      'src', '/design/login-canonico-painel-esquerdo.png',
    );
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
    await user.click(screen.getByText('Precisa de ajuda?'));
    expect(screen.getByText(/aguarde a aprovação de um administrador/i)).toBeVisible();
  });

  it('mantém o domínio institucional, as credenciais e o bloqueio durante o envio', async () => {
    let finish!: () => void;
    const onSignIn = vi.fn(() => new Promise<void>((resolve) => { finish = resolve; }));
    const { user } = setup({ onSignIn });
    await user.type(screen.getByLabelText('E-mail corporativo'), 'pessoa@edu.rio.rj.gov.br');
    await user.type(screen.getByLabelText('Senha'), 'SenhaTeste9');
    await user.click(screen.getByRole('button', { name: /acessar sistema/i }));
    expect(await screen.findByText('Use um e-mail @rioeduca.net.')).toBeVisible();
    expect(onSignIn).not.toHaveBeenCalled();
    await user.clear(screen.getByLabelText('E-mail corporativo'));
    await user.type(screen.getByLabelText('E-mail corporativo'), 'pessoa@rioeduca.net');
    await user.click(screen.getByRole('button', { name: /acessar sistema/i }));
    expect(screen.getByRole('button', { name: 'Acessando…' })).toBeDisabled();
    expect(onSignIn).toHaveBeenCalledExactlyOnceWith('pessoa@rioeduca.net', 'SenhaTeste9');
    await act(async () => finish());
    await waitFor(() => expect(screen.getByRole('button', { name: /acessar sistema/i })).toBeEnabled());
  });

  it('mantém solicitação de acesso, política de senha e retorno ao login', async () => {
    const { user, onRequestAccess } = setup();
    await user.click(screen.getByRole('button', { name: 'Primeiro acesso' }));
    await user.type(screen.getByLabelText('Seu e-mail corporativo'), 'pessoa@rioeduca.net');
    await user.type(screen.getByLabelText('Criar nova senha'), 'SenhaTeste9');
    await user.click(screen.getByRole('button', { name: 'Mostrar senha' }));
    expect(screen.getByLabelText('Criar nova senha')).toHaveAttribute('type', 'text');
    await user.click(screen.getByRole('button', { name: 'Solicitar acesso' }));
    expect(onRequestAccess).toHaveBeenCalledExactlyOnceWith('pessoa@rioeduca.net', 'SenhaTeste9');
    expect(await screen.findByLabelText('E-mail corporativo')).toHaveValue('pessoa@rioeduca.net');
    expect(screen.getByLabelText('Senha')).toHaveValue('');
  });

  it('preserva o e-mail na recuperação, a confirmação neutra e o foco ao voltar', async () => {
    const { user, onRequestPasswordReset } = setup();
    await user.type(screen.getByLabelText('E-mail corporativo'), 'pessoa@rioeduca.net');
    await user.click(screen.getByRole('button', { name: 'Esqueci minha senha' }));
    const email = screen.getByLabelText('E-mail corporativo para recuperação');
    expect(email).toHaveValue('pessoa@rioeduca.net');
    expect(email).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Enviar link de recuperação' }));
    expect(onRequestPasswordReset).toHaveBeenCalledExactlyOnceWith('pessoa@rioeduca.net');
    expect(await screen.findByRole('heading', { name: 'Confira seu e-mail' })).toBeVisible();
    expect(screen.getByText(/se houver uma conta vinculada/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Voltar para entrar' }));
    expect(screen.getByLabelText('E-mail corporativo')).toHaveFocus();
  });
});
