import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { AppServices } from './services/createAppServices';
import { AccessPendingError } from './services/errors';
import type { AppUser, ComentarioHistorico, Demanda, PerfilMinimo } from './types';
import { createMinimalDemandFixture } from './test/expandedFixtures';
import { getTodayString } from './utils/date';
import { App } from './App';

const activeUser: AppUser = {
  id: 'user-1',
  email: 'teste@rioeduca.net',
  perfil: {
    id: 'user-1', nome: 'Teste', email: 'teste@rioeduca.net', setor: 'CTRH',
    nivel: 'editor', status: 'ativo',
  },
};

const officialResponsible: PerfilMinimo = {
  id: '11111111-1111-4111-8111-111111111111',
  nome: 'ERICA VALIM DE ALMEIDA HOLANDA',
  setor: 'E/CTRH',
};

function createServices(
  signIn = vi.fn().mockResolvedValue(activeUser),
  initialData: { demandas: Demanda[]; historico: ComentarioHistorico[] } = { demandas: [], historico: [] },
) {
  const load = vi.fn().mockResolvedValue(initialData);
  const create = vi.fn().mockResolvedValue(undefined);
  const registerProgress = vi.fn().mockResolvedValue(undefined);
  const requestPasswordReset = vi.fn().mockResolvedValue(undefined);
  const completePasswordReset = vi.fn().mockResolvedValue(undefined);
  const listMinimal = vi.fn().mockResolvedValue([officialResponsible]);
  let passwordRecoveryCallback: (() => void) | undefined;
  const authSubscribe = vi.fn((
    _onChange: (user: AppUser | null) => void,
    onPasswordRecovery?: () => void,
  ) => {
    passwordRecoveryCallback = onPasswordRecovery;
    return () => undefined;
  });
  const services: AppServices = {
    mode: 'supabase',
    auth: {
      restore: vi.fn().mockResolvedValue(null),
      signIn,
      requestAccess: vi.fn().mockResolvedValue(undefined),
      requestPasswordReset,
      completePasswordReset,
      signOut: vi.fn().mockResolvedValue(undefined),
      subscribe: authSubscribe,
    },
    demandas: {
      load,
      loadTrash: vi.fn().mockResolvedValue([]),
      create,
      edit: vi.fn().mockResolvedValue(undefined),
      registerProgress,
      transitionStatus: vi.fn().mockResolvedValue(undefined),
      deleteLogically: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(() => () => undefined),
    },
    profiles: {
      list: vi.fn().mockResolvedValue([]),
      listMinimal,
      updateAccess: vi.fn().mockResolvedValue(undefined),
    },
  };
  return {
    services,
    load,
    create,
    registerProgress,
    requestPasswordReset,
    completePasswordReset,
    listMinimal,
    authSubscribe,
    emitPasswordRecovery: () => passwordRecoveryCallback?.(),
  };
}

async function fillLogin(user: ReturnType<typeof userEvent.setup>) {
  await user.type(await screen.findByPlaceholderText('usuario@rioeduca.net'), 'teste@rioeduca.net');
  await user.type(await screen.findByLabelText('Senha', { exact: true }), 'senha-remota-teste');
  await user.click(await screen.findByRole('button', { name: /acessar sistema/i }));
}

function createPortfolioData() {
  const ownDemand = createMinimalDemandFixture({
    id: 1,
    numero: 'SME-OWN-001',
    assunto: 'Demanda do usuário conectado',
    responsavel: 'Teste',
    responsavelId: activeUser.id,
    status: 'Aguardando Andamento',
  });
  const otherDemand = createMinimalDemandFixture({
    id: 2,
    numero: 'SME-OTHER-001',
    assunto: 'Demanda de outro usuário',
    responsavel: 'Outra pessoa',
    responsavelId: 'user-2',
    status: 'Aguardando Andamento',
  });
  const legacyDemand = createMinimalDemandFixture({
    id: 3,
    numero: 'SME-LEGACY-001',
    assunto: 'Demanda sem responsável oficial',
    responsavel: 'Vanessa Migrado',
    responsavelId: null,
    status: 'Aguardando Andamento',
  });
  return [ownDemand, otherDemand, legacyDemand];
}

function formatDate(date: Date) {
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

function createContextualDashboardData() {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayString = formatDate(yesterday);
  const todayString = getTodayString();

  return [
    createMinimalDemandFixture({
      id: 11,
      numero: 'SME-OWN-ACTIVE',
      assunto: 'Ativa pessoal',
      responsavel: 'Teste',
      responsavelId: activeUser.id,
      status: 'Aguardando Andamento',
    }),
    createMinimalDemandFixture({
      id: 12,
      numero: 'SME-OWN-SIGN',
      assunto: 'Assinatura pessoal',
      responsavel: 'Teste',
      responsavelId: activeUser.id,
      status: 'Para Assinatura',
    }),
    createMinimalDemandFixture({
      id: 13,
      numero: 'SME-OWN-TODAY',
      assunto: 'Prazo hoje pessoal',
      responsavel: 'Teste',
      responsavelId: activeUser.id,
      status: 'Aguardando Andamento',
      limite2: todayString,
    }),
    createMinimalDemandFixture({
      id: 14,
      numero: 'SME-OWN-OVERDUE',
      assunto: 'Vencida pessoal',
      responsavel: 'Teste',
      responsavelId: activeUser.id,
      status: 'Aguardando Andamento',
      limite2: yesterdayString,
    }),
    createMinimalDemandFixture({
      id: 21,
      numero: 'SME-TEAM-ACTIVE',
      assunto: 'Ativa da equipe',
      responsavel: 'Outra pessoa',
      responsavelId: 'user-2',
      status: 'Aguardando Andamento',
    }),
    createMinimalDemandFixture({
      id: 22,
      numero: 'SME-TEAM-SIGN',
      assunto: 'Assinatura da equipe',
      responsavel: 'Outra pessoa',
      responsavelId: 'user-2',
      status: 'Para Assinatura',
    }),
    createMinimalDemandFixture({
      id: 23,
      numero: 'SME-TEAM-TODAY',
      assunto: 'Prazo hoje da equipe',
      responsavel: 'Outra pessoa',
      responsavelId: 'user-2',
      status: 'Aguardando Andamento',
      limite2: todayString,
    }),
    createMinimalDemandFixture({
      id: 24,
      numero: 'SME-TEAM-OVERDUE',
      assunto: 'Vencida da equipe',
      responsavel: 'Outra pessoa',
      responsavelId: 'user-2',
      status: 'Aguardando Andamento',
      limite2: yesterdayString,
    }),
  ];
}

function expectHeaderCount(title: string, count: number) {
  expect(within(screen.getByTitle(title)).getByText(String(count))).toBeVisible();
}

describe('App no modo Supabase', () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/');
    vi.unstubAllGlobals();
  });

  it('carrega dados e perfis depois do login e grava o responsável oficial', async () => {
    const user = userEvent.setup();
    const { services, load, create, listMinimal } = createServices();
    render(<App services={services} />);
    await fillLogin(user);
    expect(await screen.findByRole('button', { name: /nova demanda/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /administração/i })).not.toBeInTheDocument();
    await waitFor(() => expect(load).toHaveBeenCalled());
    await waitFor(() => expect(listMinimal).toHaveBeenCalled());

    await user.click(screen.getByRole('button', { name: /nova demanda/i }));
    await user.selectOptions(await screen.findByLabelText('Tipo'), 'Processo');
    await user.type(screen.getByLabelText('Número'), 'SME-TESTE-001');
    await user.type(screen.getByLabelText('Assunto'), 'Demanda de integração');
    await user.selectOptions(screen.getByLabelText('Responsável'), officialResponsible.id);
    await user.type(screen.getByLabelText('Data de prazo interno'), '15082099');
    await user.click(screen.getByRole('radio', { name: 'Não se aplica' }));
    await user.selectOptions(screen.getByLabelText('Status'), 'Aguardando Andamento');
    await user.selectOptions(screen.getByLabelText('Selecione a classificação'), 'Outros');
    await user.type(screen.getByLabelText('Próxima providência'), 'Conferir documentação recebida');
    await user.type(screen.getByLabelText('Data da próxima providência'), '20082099');
    await user.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => expect(create).toHaveBeenCalledWith(expect.objectContaining({
      numero: 'SME-TESTE-001',
      assunto: 'Demanda de integração',
      responsavelId: officialResponsible.id,
      responsavel: officialResponsible.nome,
      limite1: '15/08/2099',
      limite1Situacao: 'definido',
      limite2: '',
      limite2Situacao: 'nao_se_aplica',
      proximaAcao: 'Conferir documentação recebida',
      proximaAcaoEm: '20/08/2099',
    })));
  });

  it('alterna explicitamente entre a carteira pessoal e a carteira geral', async () => {
    const { services } = createServices(undefined, {
      demandas: createPortfolioData(),
      historico: [],
    });
    const user = userEvent.setup();

    render(<App services={services} />);
    await fillLogin(user);
    await user.click(await screen.findByRole('button', {
      name: /minhas demandas.*acompanhe sua carteira de processos/i,
    }));

    await waitFor(() => expect(window.location.pathname).toBe('/minhas-demandas'));
    expect(window.location.search).not.toContain('escopo');
    expect(await screen.findByText('Demanda do usuário conectado')).toBeVisible();
    expect(screen.queryByText('Demanda de outro usuário')).not.toBeInTheDocument();
    expect(screen.queryByText('Demanda sem responsável oficial')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^minhas demandas$/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Demandas Equipe CTRH' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: 'Demandas Equipe CTRH' }));

    await waitFor(() => expect(window.location.pathname).toBe('/demandas'));
    expect(await screen.findByText('Demanda de outro usuário')).toBeVisible();
    expect(screen.getByText('Demanda sem responsável oficial')).toBeVisible();
    expect(screen.getByRole('button', { name: /^todas as demandas$/i })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Ver minhas demandas' })).toBeVisible();
  });

  it('atualiza os indicadores e seus filtros conforme a carteira ativa', async () => {
    const { services } = createServices(undefined, {
      demandas: createContextualDashboardData(),
      historico: [],
    });
    const user = userEvent.setup();

    render(<App services={services} />);
    await fillLogin(user);

    await waitFor(() => {
      expectHeaderCount('Exibir todas as demandas em acompanhamento', 8);
      expectHeaderCount('Filtrar por demandas aguardando assinatura', 2);
      expectHeaderCount('Filtrar por demandas cujo prazo final vence hoje', 2);
      expectHeaderCount('Filtrar por demandas com prazo final vencido', 2);
    });

    await user.click(screen.getByRole('button', { name: /^minhas demandas$/i }));
    await waitFor(() => expect(window.location.pathname).toBe('/minhas-demandas'));

    await waitFor(() => {
      expectHeaderCount('Exibir todas as demandas em acompanhamento', 4);
      expectHeaderCount('Filtrar por demandas aguardando assinatura', 1);
      expectHeaderCount('Filtrar por demandas cujo prazo final vence hoje', 1);
      expectHeaderCount('Filtrar por demandas com prazo final vencido', 1);
    });

    await user.click(screen.getByTitle('Filtrar por demandas aguardando assinatura'));

    expect((await screen.findAllByText('Assinatura pessoal')).length).toBeGreaterThan(0);
    expect(screen.queryAllByText('Assinatura da equipe')).toHaveLength(0);
    expect(window.location.pathname).toBe('/minhas-demandas');

    await user.click(screen.getByRole('button', { name: 'Demandas Equipe CTRH' }));
    await waitFor(() => expect(window.location.pathname).toBe('/demandas'));

    await waitFor(() => {
      expectHeaderCount('Exibir todas as demandas em acompanhamento', 8);
      expectHeaderCount('Filtrar por demandas aguardando assinatura', 2);
      expectHeaderCount('Filtrar por demandas cujo prazo final vence hoje', 2);
      expectHeaderCount('Filtrar por demandas com prazo final vencido', 2);
    });
    expect((await screen.findAllByText('Assinatura da equipe')).length).toBeGreaterThan(0);
  });

  it('limpa filtros dentro da carteira pessoal sem retornar à carteira geral', async () => {
    const { services } = createServices(undefined, {
      demandas: createPortfolioData(),
      historico: [],
    });
    const user = userEvent.setup();

    render(<App services={services} />);
    await fillLogin(user);
    await user.click(await screen.findByRole('button', { name: /^minhas demandas$/i }));
    await waitFor(() => expect(window.location.pathname).toBe('/minhas-demandas'));

    await user.type(screen.getByLabelText(/busca por texto/i), 'usuário');
    await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/minhas-demandas');
      expect(screen.getByRole('heading', { name: 'Minhas demandas' })).toBeVisible();
      expect(screen.getByText('Demanda do usuário conectado')).toBeVisible();
      expect(screen.queryByText('Demanda de outro usuário')).not.toBeInTheDocument();
    });
  });

  it('liga a solicitação neutra ao destino de recuperação da origem atual', async () => {
    const user = userEvent.setup();
    const { services, requestPasswordReset } = createServices();
    render(<App services={services} />);

    await user.click(await screen.findByRole('button', { name: /esqueci minha senha/i }));
    await user.type(screen.getByLabelText(/e-mail corporativo/i), 'pessoa@rioeduca.net');
    await user.click(screen.getByRole('button', { name: /enviar link de recuperação/i }));

    expect(requestPasswordReset).toHaveBeenCalledWith(
      'pessoa@rioeduca.net',
      `${window.location.origin}/redefinir-senha`,
    );
    expect(await screen.findByText(/se houver uma conta vinculada a esse e-mail/i)).toBeVisible();
  });

  it('só libera a rota de nova senha após PASSWORD_RECOVERY e encerra o fluxo', async () => {
    window.history.replaceState({}, '', '/redefinir-senha#type=recovery&access_token=token-sintetico');
    const {
      services,
      completePasswordReset,
      authSubscribe,
      emitPasswordRecovery,
      load,
    } = createServices();
    const user = userEvent.setup();
    render(<App services={services} />);

    expect(await screen.findByRole('heading', { name: /validando link de recuperação/i })).toBeVisible();
    await waitFor(() => expect(authSubscribe).toHaveBeenCalled());
    act(() => emitPasswordRecovery());

    await user.type(await screen.findByLabelText(/^nova senha$/i), 'NovaSenha9');
    await user.type(screen.getByLabelText(/confirmar nova senha/i), 'NovaSenha9');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    await waitFor(() => expect(completePasswordReset).toHaveBeenCalledWith('NovaSenha9'));
    await waitFor(() => expect(window.location.pathname).toBe('/'));
    expect(load).not.toHaveBeenCalled();
  });

  it('bloqueia acesso manual à rota de redefinição sem sessão de recuperação', async () => {
    window.history.replaceState({}, '', '/redefinir-senha');
    const { services, load } = createServices();
    render(<App services={services} />);

    expect(await screen.findByRole('heading', { name: /link inválido ou expirado/i })).toBeVisible();
    expect(screen.queryByLabelText(/^nova senha$/i)).not.toBeInTheDocument();
    expect(load).not.toHaveBeenCalled();
  });

  it('registra andamento sem perder a carteira e a busca atuais', async () => {
    const demanda = createMinimalDemandFixture({
      id: 31,
      numero: 'SME-PROGRESS-031',
      assunto: 'Demanda para andamento',
      responsavel: 'Teste',
      status: 'Aguardando Andamento',
      proximaAcao: 'Aguardar resposta inicial',
      proximaAcaoEm: '20/08/2099',
    });
    const { services, registerProgress } = createServices(undefined, {
      demandas: [demanda],
      historico: [],
    });
    const user = userEvent.setup();

    window.history.replaceState({}, '', '/demandas?busca=SME-PROGRESS-031');
    render(<App services={services} />);
    await fillLogin(user);
    await waitFor(() => expect(window.location.search).toContain('busca=SME-PROGRESS-031'));
    await user.click(await screen.findByRole('button', { name: /mais ações da demanda sme-progress-031/i }));
    await user.click(await screen.findByRole('menuitem', { name: /registrar andamento/i }));
    await user.type(await screen.findByLabelText(/o que foi realizado/i), 'Contato realizado com a unidade.');
    await user.clear(screen.getByLabelText(/^próxima providência$/i));
    await user.type(screen.getByLabelText(/^próxima providência$/i), 'Conferir a resposta recebida');
    await user.clear(screen.getByLabelText(/data da próxima providência/i));
    await user.type(screen.getByLabelText(/data da próxima providência/i), '25082099');
    await user.click(screen.getByRole('button', { name: /^registrar andamento$/i }));

    await waitFor(() => expect(registerProgress).toHaveBeenCalledWith(demanda.id, {
      comentario: 'Contato realizado com a unidade.',
      proximaAcao: 'Conferir a resposta recebida',
      proximaAcaoEm: '25/08/2099',
      proximaAcaoJustificativa: '',
    }));
    expect(window.location.pathname).toBe('/demandas');
    expect(window.location.search).toContain('busca=SME-PROGRESS-031');
  });

  it('aplica o cartão de status sem sair da carteira pessoal nem restaurar estado antigo', async () => {
    const { services } = createServices(undefined, {
      demandas: createPortfolioData(),
      historico: [],
    });
    const user = userEvent.setup();

    render(<App services={services} />);
    await fillLogin(user);
    await user.click(await screen.findByRole('button', { name: /^minhas demandas$/i }));
    await waitFor(() => expect(window.location.pathname).toBe('/minhas-demandas'));

    await user.selectOptions(screen.getByLabelText(/^status$/i), 'todos');
    await waitFor(() => expect(window.location.search).toContain('status=todos'));
    await user.click(screen.getByRole('button', { name: /em acompanhamento/i }));

    await waitFor(() => {
      expect(window.location.pathname).toBe('/minhas-demandas');
      expect(window.location.search).not.toContain('status=');
      expect(screen.getByLabelText(/^status$/i)).toHaveValue('acompanhamento');
    });
  });

  it('mantém perfil pendente na tela de login', async () => {
    const signIn = vi.fn().mockRejectedValue(new AccessPendingError());
    const { services, load } = createServices(signIn);
    render(<App services={services} />);
    await fillLogin(userEvent.setup());

    expect(await screen.findByRole('button', { name: /acessar sistema/i })).toBeInTheDocument();
    expect(await screen.findByText(/aguarda aprovação/i)).toBeVisible();
    expect(load).not.toHaveBeenCalled();
  });
});
