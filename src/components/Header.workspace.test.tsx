import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

it('mostra atalhos gerenciais somente no Radar e conserva ações globais', () => {
  render(<Header activeArea="admin" userEmail="teste@rioeduca.net" demandas={[]}
    onLogout={vi.fn()} onOpenNovo={vi.fn()} onExportExcel={vi.fn()}
    onOpenMinhasDemandas={vi.fn()} personalWorkspaceActive={false}
    filtrosAtivos={{ status: 'todos', quickFilters: { assinatura: false, hoje: false, vencido: false } }}
    onToggleFiltroStatus={vi.fn()} onToggleQuickFilter={vi.fn()} connectionStatus="online" />);
  expect(screen.getByRole('heading', { name: 'Gestão de acessos' })).toBeVisible();
  expect(screen.queryByRole('button', { name: /em acompanhamento/i })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /exportar excel/i })).toBeVisible();
  expect(screen.getByRole('button', { name: /nova demanda/i })).toBeVisible();
});
