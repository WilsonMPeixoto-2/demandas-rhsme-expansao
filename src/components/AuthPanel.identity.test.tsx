import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { AuthPanel } from './AuthPanel';

describe('AuthPanel — identidade única do produto', () => {
  it('usa Fluxo CTRH, elimina o nome legado e carrega o ativo institucional publicado', () => {
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
      name: 'Prefeitura do Rio de Janeiro — Educação',
    });
    expect(endorsements).toHaveLength(2);
    expect(endorsements[0]).toHaveAttribute('src', '/prefeitura-rio-educacao-oficial.png');
    expect(endorsements[1]).toHaveAttribute('src', '/prefeitura-rio-educacao-oficial.png');
  });
});
