import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { App } from './App';
import { createAppServices } from './services/createAppServices';

function renderLocalApp() {
  return render(<App services={createAppServices({ mode: 'local' })} />);
}

describe('App no modo local', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('alert', vi.fn());
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('não importa o acervo real no grafo do cliente', async () => {
    const source = await readFile(resolve(process.cwd(), 'src/services/createAppServices.ts'), 'utf8');

    expect(source).not.toContain('initialDemandas');
  });

  it('mantém login e dashboard local do perfil de teste', async () => {
    const user = userEvent.setup();
    renderLocalApp();
    await user.type(await screen.findByPlaceholderText('usuario@rioeduca.net'), 'teste@rioeduca.net');
    await user.type(await screen.findByLabelText('Senha', { exact: true }), 'senha-local-teste');
    await user.click(await screen.findByRole('button', { name: /acessar sistema/i }));

    expect(await screen.findByRole('button', { name: /sair/i })).toBeInTheDocument();
    expect(localStorage.getItem('demandas_user')).toBe('teste@rioeduca.net');
    expect(JSON.parse(localStorage.getItem('demandas_data') ?? '[]')).toHaveLength(8);
  });

  it('encerra a sessão local sem remover as demandas', async () => {
    const user = userEvent.setup();
    localStorage.setItem('demandas_user', 'teste@rioeduca.net');
    renderLocalApp();
    await user.click(await screen.findByRole('button', { name: /sair/i }, { timeout: 3000 }));

    await waitFor(() => expect(localStorage.getItem('demandas_user')).toBeNull());
    expect(await screen.findByRole('button', { name: /acessar sistema/i })).toBeInTheDocument();
    expect(localStorage.getItem('demandas_data')).not.toBeNull();
  });
});
