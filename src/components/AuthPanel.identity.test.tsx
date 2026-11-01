import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthPanel } from './AuthPanel';

describe('AuthPanel — identidade única do produto', () => {
  it('preserva Fluxo CTRH e a assinatura institucional da arte homologada, sem duplicação', () => {
    render(
      <AuthPanel
        mode="supabase"
        loading={false}
        onSignIn={vi.fn()}
        onRequestAccess={vi.fn()}
        onRequestPasswordReset={vi.fn()}
      />,
    );

    expect(screen.getAllByText('Fluxo CTRH').length).toBeGreaterThan(0);
    expect(screen.queryByText('Fluxo RH')).not.toBeInTheDocument();
    expect(screen.queryByText('Central de Demandas')).not.toBeInTheDocument();

    const endorsements = screen.getAllByRole('img', {
      name: /prefeitura do rio de janeiro.*educação/i,
    });
    expect(endorsements).toHaveLength(1);
    expect(endorsements[0]).toHaveAttribute('src', '/design/login-canonico-painel-esquerdo.png');
  });
});
