import React, { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { BrowserRouter, useInRouterContext, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Toaster, toast } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import type {
  CreateDemandaInput,
  DeleteDemandaInput,
  Demanda,
  EditDemandaInput,
  PerfilMinimo,
  PerfilUsuario,
  ProgressInput,
  StatusTransitionInput,
} from './types';
import type { DemandaFormValues, EditarDemandaValues } from './validation/demandaSchemas';
import { resolveAppConfig } from './config/appConfig';
import { useAppSession } from './hooks/useAppSession';
import { useDemandasData } from './hooks/useDemandasData';
import { createAppServices, type AppServices } from './services/createAppServices';
import { Header } from './components/Header';
import { CarteiraContextHeader } from './components/CarteiraContextHeader';
import { FilterPanel } from './components/FilterPanel';
import { AtencaoImediata } from './components/AtencaoImediata';
import { VisaoGeral } from './components/VisaoGeral';
import { AdminSkeleton, AuthSkeleton, DashboardSkeleton, TableSkeleton } from './components/LoadingSkeletons';
import { ErrorBoundary } from './components/ErrorBoundary';
import { matchDemandSearch } from './search/demandSearch';
import { rankApproximateDemandSearch } from './search/approximateSearch';
import { getPeriodValidationError } from './search/periodFilter';
import { clearRecentSearches, loadRecentSearches, saveRecentSearch } from './search/recentSearches';
import type { DemandSearchMatch } from './search/searchTypes';
import { applyDemandBaseFilters } from './filters/applyDemandFilters';
import {
  DEFAULT_DEMAND_FILTERS,
  DEFAULT_QUICK_FILTERS,
  type DemandFilters,
  type QuickFilters,
} from './filters/filterTypes';
import { parseDemandFilters, serializeDemandFilters } from './filters/filterUrl';

const DemandasTable = lazy(() => import('./components/DemandasTable').then((module) => ({ default: module.DemandasTable })));
const ModalNovo = lazy(() => import('./components/ModalNovo').then((module) => ({ default: module.ModalNovo })));
const ModalEditar = lazy(() => import('./components/ModalEditar').then((module) => ({ default: module.ModalEditar })));
const ModalAndamento = lazy(() => import('./components/ModalAndamento').then((module) => ({ default: module.ModalAndamento })));
const ModalStatus = lazy(() => import('./components/ModalStatus').then((module) => ({ default: module.ModalStatus })));
const ModalHistorico = lazy(() => import('./components/ModalHistorico').then((module) => ({ default: module.ModalHistorico })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then((module) => ({ default: module.AdminPanel })));
const DemandDetailDrawer = lazy(() => import('./components/DemandDetailDrawer').then((module) => ({ default: module.DemandDetailDrawer })));
const AuthPanel = lazy(() => import('./components/AuthPanel').then((module) => ({ default: module.AuthPanel })));
const PasswordResetPanel = lazy(() => import('./components/PasswordResetPanel').then((module) => ({ default: module.PasswordResetPanel })));

type ActiveTab = 'visao-geral' | 'demandas' | 'minhas-demandas' | 'admin';

interface AppProps {
  services?: AppServices;
}

const QUICK_FILTER_QUERY_KEYS: Record<keyof QuickFilters, string> = {
  assinatura: 'assinatura',
  hoje: 'prazoFinalHoje',
  vencido: 'prazoFinalVencido',
  internoHoje: 'prazoInternoHoje',
  internoVencido: 'prazoInternoVencido',
  providenciaHoje: 'providenciaHoje',
  providenciaVencida: 'providenciaVencida',
};

interface PasswordRecoveryNavigation {
  hasCallback: boolean;
  hasError: boolean;
}

function readPasswordRecoveryNavigation(pathname: string): PasswordRecoveryNavigation {
  if (pathname !== '/redefinir-senha') return { hasCallback: false, hasError: false };
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  return {
    hasCallback: query.has('code')
      || query.has('token_hash')
      || hash.get('type') === 'recovery'
      || hash.has('access_token'),
    hasError: query.has('error')
      || query.has('error_code')
      || hash.has('error')
      || hash.has('error_code'),
  };
}

function parseQuickFilters(params: URLSearchParams): QuickFilters {
  return Object.fromEntries(
    Object.entries(QUICK_FILTER_QUERY_KEYS).map(([key, queryKey]) => [key, params.get(queryKey) === '1']),
  ) as unknown as QuickFilters;
}

function appendQuickFilters(params: URLSearchParams, filters: QuickFilters): URLSearchParams {
  for (const [key, queryKey] of Object.entries(QUICK_FILTER_QUERY_KEYS) as Array<[keyof QuickFilters, string]>) {
    if (filters[key]) params.set(queryKey, '1');
  }
  return params;
}

const AppContent: React.FC<AppProps> = ({ services }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const isPasswordRecoveryRoute = location.pathname === '/redefinir-senha';
  const [passwordRecoveryNavigation] = useState(
    () => readPasswordRecoveryNavigation(location.pathname),
  );
  const [appServices] = useState(() => services ?? createAppServices(resolveAppConfig(import.meta.env)));
  const session = useAppSession(appServices.auth);
  const data = useDemandasData(
    appServices.demandas,
    isPasswordRecoveryRoute ? null : session.user,
    appServices.mode === 'supabase',
  );
  const [passwordRecoveryTimedOut, setPasswordRecoveryTimedOut] = useState(false);
  const userEmail = session.user?.email ?? '';
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const [responsaveisDisponiveis, setResponsaveisDisponiveis] = useState<PerfilMinimo[]>([]);
  const canAccessAdmin = appServices.mode === 'local'
    || (session.user?.perfil.nivel === 'administrador' && session.user.perfil.status === 'ativo');
  const canEdit = appServices.mode === 'local'
    || (session.user?.perfil.status === 'ativo' && ['administrador', 'editor'].includes(session.user.perfil.nivel));
  const canDelete = appServices.mode === 'local'
    || (session.user?.perfil.status === 'ativo' && session.user.perfil.nivel === 'administrador');

  const demandas = data.demandas;
  const historico = data.historico;
  const setoresDisponiveis = useMemo(() => Array.from(
    new Set(
      demandas
        .map((demanda) => demanda.setor?.trim())
        .filter((setor): setor is string => Boolean(setor)),
    ),
  ).sort(), [demandas]);

  const [filtros, setFiltros] = useState<DemandFilters>(() => {
    const parsed = parseDemandFilters(searchParams);
    if (location.pathname.startsWith('/minhas-demandas')) return { ...parsed, scope: 'meu' };
    return parsed;
  });
  const [quickFilters, setQuickFilters] = useState<QuickFilters>(() => parseQuickFilters(searchParams));

  const activeTab: ActiveTab = location.pathname.startsWith('/admin')
    ? 'admin'
    : location.pathname.startsWith('/minhas-demandas')
      ? 'minhas-demandas'
      : location.pathname.startsWith('/demandas')
        ? 'demandas'
        : 'visao-geral';
  const isDemandWorkspace = activeTab === 'demandas' || activeTab === 'minhas-demandas';
  const currentWorkspacePath = activeTab === 'minhas-demandas' ? '/minhas-demandas' : '/demandas';
  const drawerAberto = /^\/(demandas|minhas-demandas)\/\d+$/.test(location.pathname);
  const legacyPersonalUrl = location.pathname === '/demandas' && searchParams.get('escopo') === 'meu';

  const navigateToWorkspace = (
    scope: DemandFilters['scope'],
    filterPatch: Partial<DemandFilters> = {},
    nextQuickFilters: QuickFilters = quickFilters,
  ) => {
    const nextFilters: DemandFilters = {
      ...filtros,
      ...filterPatch,
      scope,
      responsibleId: scope === 'meu'
        ? 'todos'
        : filterPatch.responsibleId ?? filtros.responsibleId,
    };
    const nextParams = appendQuickFilters(serializeDemandFilters(nextFilters), nextQuickFilters);

    setFiltros(nextFilters);
    setQuickFilters(nextQuickFilters);
    void navigate({
      pathname: scope === 'meu' ? '/minhas-demandas' : '/demandas',
      search: nextParams.toString(),
    });
  };

  const setActiveTab = (tab: ActiveTab) => {
    if (tab === 'demandas') {
      navigateToWorkspace('equipe');
      return;
    }
    if (tab === 'minhas-demandas') {
      navigateToWorkspace('meu');
      return;
    }
    void navigate({ pathname: tab === 'admin' ? '/admin' : '/', search: '' });
  };

  const setDrawerAberto = (open: boolean) => {
    if (!open) void navigate({ pathname: currentWorkspacePath, search: searchParams.toString() });
  };

  useEffect(() => {
    if (!legacyPersonalUrl) return;
    const legacyParams = new URLSearchParams(searchParams);
    legacyParams.delete('escopo');
    void navigate({ pathname: '/minhas-demandas', search: legacyParams.toString() }, { replace: true });
  }, [legacyPersonalUrl, navigate, searchParams]);

  useEffect(() => {
    if (!isDemandWorkspace || legacyPersonalUrl) return;
    const nextScope: DemandFilters['scope'] = activeTab === 'minhas-demandas' ? 'meu' : 'equipe';
    setFiltros((current) => {
      const responsibleId = nextScope === 'meu' ? 'todos' : current.responsibleId;
      if (current.scope === nextScope && current.responsibleId === responsibleId) return current;
      return { ...current, scope: nextScope, responsibleId };
    });
  }, [activeTab, isDemandWorkspace, legacyPersonalUrl]);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const [recentSearches, setRecentSearches] = useState(() => loadRecentSearches());
  const [searchFocusRequested, setSearchFocusRequested] = useState(false);

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      if (!(event.ctrlKey || event.metaKey) || event.altKey || event.key.toLowerCase() !== 'k') return;
      event.preventDefault();
      setSearchFocusRequested(true);
      void navigate({
        pathname: activeTab === 'minhas-demandas' ? '/minhas-demandas' : '/demandas',
        search: searchParams.toString(),
      });
    };

    window.addEventListener('keydown', handleSearchShortcut);
    return () => window.removeEventListener('keydown', handleSearchShortcut);
  }, [activeTab, navigate, searchParams]);

  useEffect(() => {
    if (!searchFocusRequested || !isDemandWorkspace || data.loading) return;
    const frame = window.requestAnimationFrame(() => {
      const input = searchInputRef.current;
      if (!input) return;
      input.focus();
      input.select();
      setSearchFocusRequested(false);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [data.loading, isDemandWorkspace, searchFocusRequested]);

  const [modalNovoAberto, setModalNovoAberto] = useState(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState<Demanda | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [modalAndamentoAberto, setModalAndamentoAberto] = useState(false);
  const [modalStatusAberto, setModalStatusAberto] = useState(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const drawerBloqueadoPorModal = modalEditarAberto || modalAndamentoAberto || modalStatusAberto || modalHistoricoAberto;

  useEffect(() => {
    if (
      !isPasswordRecoveryRoute
      || !passwordRecoveryNavigation.hasCallback
      || passwordRecoveryNavigation.hasError
      || session.passwordRecoveryReady
    ) return;
    const timeout = window.setTimeout(() => setPasswordRecoveryTimedOut(true), 8000);
    return () => window.clearTimeout(timeout);
  }, [
    isPasswordRecoveryRoute,
    passwordRecoveryNavigation.hasCallback,
    passwordRecoveryNavigation.hasError,
    session.passwordRecoveryReady,
  ]);

  useEffect(() => {
    if (!isDemandWorkspace || legacyPersonalUrl) return;
    const next = appendQuickFilters(serializeDemandFilters(filtros), quickFilters);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [filtros, isDemandWorkspace, legacyPersonalUrl, quickFilters, searchParams, setSearchParams]);

  useEffect(() => {
    const match = /^\/(demandas|minhas-demandas)\/(\d+)$/.exec(location.pathname);
    if (!match || demandas.length === 0) return;
    const selected = demandas.find((demanda) => demanda.id === Number(match[2]));
    if (selected) setDemandaSelecionada(selected);
    else {
      toast.error('A demanda informada não foi encontrada.');
      void navigate({ pathname: `/${match[1]}`, search: searchParams.toString() }, { replace: true });
    }
  }, [demandas, location.pathname, navigate, searchParams]);

  const openDemand = (demanda: Demanda) => {
    setDemandaSelecionada(demanda);
    void navigate({ pathname: `${currentWorkspacePath}/${demanda.id}`, search: searchParams.toString() });
  };

  useEffect(() => {
    if (!userEmail) {
      setResponsaveisDisponiveis([]);
      return;
    }
    let active = true;
    void appServices.profiles.listMinimal()
      .then((items) => { if (active) setResponsaveisDisponiveis(items); })
      .catch((reason: unknown) => {
        if (active) toast.error(reason instanceof Error
          ? reason.message
          : 'Não foi possível carregar os responsáveis cadastrados.');
      });
    return () => { active = false; };
  }, [appServices, userEmail]);

  useEffect(() => {
    if (appServices.mode !== 'supabase' || !canAccessAdmin || activeTab !== 'admin') return;
    let active = true;
    void appServices.profiles.list()
      .then((items) => { if (active) setPerfis(items); })
      .catch((reason: unknown) => {
        if (active) toast.error(reason instanceof Error ? reason.message : 'Não foi possível carregar os perfis.');
      });
    return () => { active = false; };
  }, [appServices, canAccessAdmin, activeTab]);

  const handleUpdatePerfil = async (
    id: string,
    patch: Partial<Pick<PerfilUsuario, 'nivel' | 'status' | 'setor'>>,
  ) => {
    const perfilAlvo = perfis.find((perfil) => perfil.id === id);
    const eraAdminAtivo = perfilAlvo && perfilAlvo.nivel === 'administrador' && perfilAlvo.status === 'ativo';
    const vaiDeixarDeSer =
      (patch.nivel !== undefined && patch.nivel !== 'administrador')
      || (patch.status !== undefined && patch.status !== 'ativo');

    if (eraAdminAtivo && vaiDeixarDeSer) {
      const outrosAdminsAtivos = perfis.filter(
        (perfil) => perfil.id !== id && perfil.nivel === 'administrador' && perfil.status === 'ativo',
      ).length;
      if (outrosAdminsAtivos === 0) {
        toast.error('Ação bloqueada: o sistema não pode ficar sem nenhum administrador ativo.');
        return false;
      }
    }

    try {
      await appServices.profiles.updateAccess(id, patch);
      setPerfis(await appServices.profiles.list());
      toast.success('Perfil atualizado com sucesso.');
      return true;
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível atualizar o perfil.');
      return false;
    }
  };

  const handleLogout = async () => {
    await session.signOut();
    void navigate({ pathname: '/', search: '' });
    setDemandaSelecionada(null);
    setModalNovoAberto(false);
    setModalEditarAberto(false);
    setModalAndamentoAberto(false);
    setModalStatusAberto(false);
    setModalHistoricoAberto(false);
    setPerfis([]);
    setResponsaveisDisponiveis([]);
    setFiltros({ ...DEFAULT_DEMAND_FILTERS });
    setQuickFilters({ ...DEFAULT_QUICK_FILTERS });
  };

  const handleRequestPasswordReset = async (email: string) => {
    const localDevelopment = ['localhost', '127.0.0.1'].includes(window.location.hostname);
    const recoveryOrigin = localDevelopment
      ? window.location.origin
      : 'https://demandas-rhsme-expansao.vercel.app';
    const redirectTo = new URL('/redefinir-senha', recoveryOrigin).toString();
    await session.requestPasswordReset(email, redirectTo);
  };

  const handleCompletePasswordReset = async (password: string) => {
    await session.completePasswordReset(password);
    toast.success('Senha redefinida com segurança. Entre novamente com a nova senha.');
    void navigate({ pathname: '/', search: '' }, { replace: true });
  };

  const handleLeavePasswordRecovery = async () => {
    await session.signOut();
    void navigate({ pathname: '/', search: '' }, { replace: true });
  };

  const findResponsavel = (responsavelId: string) => responsaveisDisponiveis
    .find((perfil) => perfil.id === responsavelId);

  const handleSalvarNovaDemanda = async (values: DemandaFormValues) => {
    const responsavelSelecionado = findResponsavel(values.responsavelId);
    const input: CreateDemandaInput = {
      numero: values.numero,
      tipo: values.tipo,
      assunto: values.assunto,
      responsavel: responsavelSelecionado?.nome ?? '',
      responsavelId: responsavelSelecionado?.id ?? null,
      limite1: values.limite1,
      limite1Situacao: values.limite1Situacao,
      limite1Justificativa: '',
      limite2: values.limite2,
      limite2Situacao: values.limite2Situacao,
      limite2Justificativa: '',
      proximaAcao: values.status === 'Encerrado' ? '' : values.proximaAcao,
      proximaAcaoEm: values.status === 'Encerrado' ? '' : values.proximaAcaoEm,
      proximaAcaoJustificativa: values.status === 'Encerrado' ? '' : values.proximaAcaoJustificativa,
      linkOrigem: '',
      status: values.status,
      setor: values.setor,
      classificacao: values.classificacao,
    };

    try {
      await data.create(input);
      setModalNovoAberto(false);
      toast.success('Demanda criada com sucesso.');
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível criar a demanda. Os dados preenchidos foram preservados.');
    }
  };

  const handleSalvarEdicaoDemanda = async (demandaId: number, values: EditarDemandaValues) => {
    const current = demandas.find((demanda) => demanda.id === demandaId);
    if (!current) {
      toast.error('A demanda não foi encontrada para edição.');
      return false;
    }

    const responsavelSelecionado = findResponsavel(values.responsavelId);
    const preserveLegacy = !current.responsavelId && !values.responsavelId;
    const input: EditDemandaInput = {
      assunto: values.assunto,
      responsavelId: responsavelSelecionado?.id ?? null,
      responsavel: responsavelSelecionado?.nome ?? (preserveLegacy ? current.responsavel : ''),
      limite1: values.limite1,
      limite1Situacao: values.limite1Situacao,
      limite1Justificativa: current.limite1Justificativa,
      limite2: values.limite2,
      limite2Situacao: values.limite2Situacao,
      limite2Justificativa: current.limite2Justificativa,
      setor: values.setor,
      classificacao: current.classificacao,
      linkOrigem: current.linkOrigem,
      justificativa: values.justificativa,
    };

    try {
      await data.edit(demandaId, input);
      toast.success('Demanda atualizada com sucesso.');
      return true;
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível editar a demanda. Os dados preenchidos foram preservados.');
      return false;
    }
  };

  const handleAtualizarStatus = async (demandaId: number, input: StatusTransitionInput) => {
    try {
      await data.transitionStatus(demandaId, input);
      toast.success('Status atualizado com sucesso.');
      return true;
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível atualizar o status.');
      return false;
    }
  };

  const handleRegistrarAndamento = async (demandaId: number, input: ProgressInput) => {
    try {
      await data.registerProgress(demandaId, input);
      toast.success('Andamento registrado sem alterar o status.');
      return true;
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível registrar o andamento.');
      return false;
    }
  };

  const handleExcluirDemanda = async (demandaId: number, input: DeleteDemandaInput) => {
    try {
      await data.deleteLogically(demandaId, input);
      toast.success('Demanda retirada da carteira e preservada na lixeira.');
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível excluir a demanda.');
      throw reason;
    }
  };

  const handleCommitSearch = (query: string) => setRecentSearches(saveRecentSearch(query));
  const handleClearRecentSearches = () => {
    clearRecentSearches();
    setRecentSearches([]);
  };

  const periodError = getPeriodValidationError({
    field: filtros.periodField,
    start: filtros.periodStart,
    end: filtros.periodEnd,
  });

  const searchState = useMemo(() => {
    const baseCandidates = applyDemandBaseFilters(demandas, filtros, {
      historico,
      quickFilters,
      currentUserId: session.user?.id,
    });

    const exactMatches = new Map<number, DemandSearchMatch>();
    const exactDemandas = baseCandidates.filter((demanda) => {
      const match = matchDemandSearch(demanda, historico, filtros.query);
      if (!match.matches) return false;
      exactMatches.set(demanda.id, { ...match, matchKind: 'exact' });
      return true;
    });

    if (exactDemandas.length > 0 || !filtros.query.trim()) {
      return { demandas: exactDemandas, matches: exactMatches, mode: 'exact' as const };
    }

    const approximateResults = rankApproximateDemandSearch(baseCandidates, historico, filtros.query);
    if (approximateResults.length > 0) {
      return {
        demandas: approximateResults.map((result) => result.demanda),
        matches: new Map(approximateResults.map((result) => [result.demanda.id, result.match])),
        mode: 'approximate' as const,
      };
    }

    return { demandas: [], matches: new Map<number, DemandSearchMatch>(), mode: 'empty' as const };
  }, [demandas, filtros, historico, quickFilters, session.user?.id]);

  const workspaceDemandas = useMemo(
    () => activeTab === 'minhas-demandas'
      ? demandas.filter((demanda) => demanda.responsavelId === session.user?.id)
      : demandas,
    [activeTab, demandas, session.user?.id],
  );
  const demandasFiltradas = searchState.demandas;
  const searchMatches = searchState.matches;
  const searchResultMode = searchState.mode;

  const handleExportExcel = async () => {
    if (searchResultMode === 'approximate') {
      toast.info('Os resultados próximos são sugestões. Ajuste a pesquisa antes de exportar como resultado exato.');
      return;
    }
    if (demandasFiltradas.length === 0) {
      toast.info('Nenhum registro disponível para exportação na filtragem atual.');
      return;
    }
    if (exportandoExcel) return;
    setExportandoExcel(true);

    try {
      const { exportDemandasExcel } = await import('./export/exportDemandasExcel');
      const fileName = await exportDemandasExcel({
        demandas: demandasFiltradas,
        userEmail,
        filters: { ...filtros, quickFilters },
      });
      toast.success(`Arquivo Excel exportado: ${fileName}`);
    } catch (reason) {
      toast.error(reason instanceof Error
        ? reason.message
        : 'Não foi possível gerar o arquivo Excel.');
    } finally {
      setExportandoExcel(false);
    }
  };

  if (isPasswordRecoveryRoute) {
    let recoveryState: 'checking' | 'ready' | 'invalid' = 'checking';
    if (session.passwordRecoveryReady) recoveryState = 'ready';
    else if (
      passwordRecoveryNavigation.hasError
      || (!passwordRecoveryNavigation.hasCallback && !session.loading)
      || passwordRecoveryTimedOut
    ) recoveryState = 'invalid';

    return (
      <Suspense fallback={<AuthSkeleton />}>
        <PasswordResetPanel
          state={recoveryState}
          loading={session.loading}
          onUpdatePassword={handleCompletePasswordReset}
          onBackToLogin={() => { void handleLeavePasswordRecovery(); }}
        />
      </Suspense>
    );
  }

  if (!userEmail) {
    return (
      <Suspense fallback={<AuthSkeleton />}>
        <AuthPanel
          mode={appServices.mode}
          loading={session.loading}
          onSignIn={session.signIn}
          onRequestAccess={session.requestAccess}
          onRequestPasswordReset={handleRequestPasswordReset}
        />
      </Suspense>
    );
  }

  const targetScopeForHeaderFilters: DemandFilters['scope'] = activeTab === 'minhas-demandas' ? 'meu' : 'equipe';
  let connectionStatus: 'online' | 'connecting' | 'offline' | 'local' = 'online';
  if (appServices.mode === 'local') connectionStatus = 'local';
  else if (data.error) connectionStatus = 'offline';
  else if (data.loading) connectionStatus = 'connecting';

  return (
    <Suspense fallback={activeTab === 'admin' ? <AdminSkeleton /> : isDemandWorkspace ? <TableSkeleton /> : null}>
      <div className="app-container">
        <Header
          userEmail={userEmail}
          demandas={workspaceDemandas}
          onLogout={() => { void handleLogout(); }}
          onOpenNovo={() => setModalNovoAberto(true)}
          onExportExcel={() => { void handleExportExcel(); }}
          onOpenMinhasDemandas={() => navigateToWorkspace('meu')}
          personalWorkspaceActive={activeTab === 'minhas-demandas'}
          exportingExcel={exportandoExcel}
          filtrosAtivos={{
            status: filtros.status,
            quickFilters: {
              assinatura: quickFilters.assinatura,
              hoje: quickFilters.hoje,
              vencido: quickFilters.vencido,
            },
          }}
          onToggleFiltroStatus={(novoStatus) => {
            const resetQuickFilters = { ...DEFAULT_QUICK_FILTERS };
            navigateToWorkspace(targetScopeForHeaderFilters, { status: novoStatus }, resetQuickFilters);
          }}
          onToggleQuickFilter={(filtro) => {
            const nextQuickFilters = { ...quickFilters, [filtro]: !quickFilters[filtro] };
            navigateToWorkspace(targetScopeForHeaderFilters, {}, nextQuickFilters);
          }}
          canEdit={canEdit}
          connectionStatus={connectionStatus}
        />

        <nav className="nav-tabs" aria-label="Áreas do sistema">
          <button
            type="button"
            className={`nav-tab-link ${activeTab === 'visao-geral' ? 'active' : ''}`}
            aria-current={activeTab === 'visao-geral' ? 'page' : undefined}
            onClick={() => setActiveTab('visao-geral')}
            title="Abrir o Radar de Governança"
          >
            <i className="fa-solid fa-chart-pie" aria-hidden="true" />
            <span>Radar de Governança</span>
          </button>
          <button
            type="button"
            className={`nav-tab-link ${activeTab === 'demandas' ? 'active' : ''}`}
            aria-current={activeTab === 'demandas' ? 'page' : undefined}
            onClick={() => setActiveTab('demandas')}
            title="Ver a carteira completa da equipe"
          >
            <i className="fa-solid fa-list-check" aria-hidden="true" />
            <span>Todas as demandas</span>
          </button>
          <button
            type="button"
            className={`nav-tab-link ${activeTab === 'minhas-demandas' ? 'active' : ''}`}
            aria-current={activeTab === 'minhas-demandas' ? 'page' : undefined}
            onClick={() => setActiveTab('minhas-demandas')}
            title="Ver somente as demandas atribuídas a você"
          >
            <i className="fa-solid fa-folder-open" aria-hidden="true" />
            <span>Minhas demandas</span>
          </button>
          {canAccessAdmin && (
            <button
              type="button"
              className={`nav-tab-link ${activeTab === 'admin' ? 'active' : ''}`}
              aria-current={activeTab === 'admin' ? 'page' : undefined}
              onClick={() => setActiveTab('admin')}
              title="Ver e gerenciar configurações e perfis de servidores"
            >
              <i className="fa-solid fa-sliders" aria-hidden="true" />
              <span>Administração</span>
            </button>
          )}
        </nav>

        {data.error && (
          <div style={{ padding: '0 24px', marginTop: '20px' }}>
            <div className="alert-error-banner">
              <i className="fa-solid fa-triangle-exclamation" aria-hidden="true" />
              <div><strong>Erro de conectividade:</strong> {data.error}</div>
            </div>
          </div>
        )}

        {data.loading ? (
          activeTab === 'visao-geral'
            ? <DashboardSkeleton />
            : activeTab === 'admin'
              ? <AdminSkeleton />
              : <TableSkeleton />
        ) : (
          <>
            {activeTab === 'visao-geral' && (
              <ErrorBoundary
                title="Não foi possível exibir o Radar de Governança"
                message="As demais áreas continuam disponíveis. Tente carregar o Radar novamente ou abra a carteira de demandas."
                resetKeys={[activeTab, demandas, historico]}
                secondaryAction={{
                  label: 'Abrir todas as demandas',
                  onClick: () => setActiveTab('demandas'),
                }}
              >
                <div key="visao-geral" className="route-transition">
                  <VisaoGeral
                    demandas={demandas}
                    historico={historico}
                    onOpenEditar={openDemand}
                    renderAtencaoImediata={() => (
                      <AtencaoImediata demandas={demandas} historico={historico} onOpenEditar={openDemand} />
                    )}
                  />
                </div>
              </ErrorBoundary>
            )}

            {isDemandWorkspace && (
              <div key={activeTab} className="route-transition">
                <CarteiraContextHeader
                  mode={activeTab === 'minhas-demandas' ? 'pessoal' : 'geral'}
                  onSwitch={() => navigateToWorkspace(activeTab === 'minhas-demandas' ? 'equipe' : 'meu')}
                />
                <AtencaoImediata demandas={workspaceDemandas} historico={historico} onOpenEditar={openDemand} />
                <FilterPanel
                  filtros={filtros}
                  setFiltros={setFiltros}
                  quickFilters={quickFilters}
                  setQuickFilters={setQuickFilters}
                  setoresDisponiveis={setoresDisponiveis}
                  totalExibidos={demandasFiltradas.length}
                  totalGeral={workspaceDemandas.length}
                  searchInputRef={searchInputRef}
                  recentSearches={recentSearches}
                  onCommitSearch={handleCommitSearch}
                  onClearRecentSearches={handleClearRecentSearches}
                  periodError={periodError}
                />
                <ErrorBoundary
                  title="Não foi possível exibir a lista de demandas"
                  message="Os filtros e o restante do sistema foram preservados. Tente carregar a lista novamente ou retorne ao Radar."
                  resetKeys={[activeTab, filtros, quickFilters, demandasFiltradas]}
                  secondaryAction={{
                    label: 'Voltar ao Radar',
                    onClick: () => setActiveTab('visao-geral'),
                  }}
                >
                  <DemandasTable
                    demandas={demandasFiltradas}
                    searchQuery={filtros.query}
                    searchMatches={searchMatches}
                    searchResultMode={searchResultMode}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    onOpenEditar={openDemand}
                    onOpenProgress={(demanda) => {
                      setDemandaSelecionada(demanda);
                      setModalAndamentoAberto(true);
                    }}
                    onOpenStatus={(demanda) => {
                      setDemandaSelecionada(demanda);
                      setModalStatusAberto(true);
                    }}
                    onOpenHistorico={(demanda) => {
                      setDemandaSelecionada(demanda);
                      setModalHistoricoAberto(true);
                    }}
                    onExcluir={handleExcluirDemanda}
                  />
                </ErrorBoundary>
              </div>
            )}

            {activeTab === 'admin' && canAccessAdmin && (
              <ErrorBoundary
                title="Não foi possível exibir a Administração"
                message="Nenhuma configuração foi alterada. Tente carregar a área novamente ou volte ao Radar."
                resetKeys={[activeTab, perfis]}
                secondaryAction={{
                  label: 'Voltar ao Radar',
                  onClick: () => setActiveTab('visao-geral'),
                }}
              >
                {appServices.mode === 'supabase'
                  ? <AdminPanel perfis={perfis} onUpdatePerfil={handleUpdatePerfil} />
                  : <AdminPanel />}
              </ErrorBoundary>
            )}
          </>
        )}

        {modalNovoAberto && (
          <ModalNovo
            responsaveis={responsaveisDisponiveis}
            onClose={() => setModalNovoAberto(false)}
            onSalvar={handleSalvarNovaDemanda}
          />
        )}

        {modalEditarAberto && demandaSelecionada && (
          <ModalEditar
            demanda={demandaSelecionada}
            responsaveis={responsaveisDisponiveis}
            onClose={() => {
              setModalEditarAberto(false);
              if (!drawerAberto) setDemandaSelecionada(null);
            }}
            onSalvar={async (id, values) => {
              const current = demandas.find((demanda) => demanda.id === id);
              if (!current || !await handleSalvarEdicaoDemanda(id, values)) return;
              const selected = findResponsavel(values.responsavelId);
              const preserveLegacy = !current.responsavelId && !values.responsavelId;
              setModalEditarAberto(false);
              if (drawerAberto) {
                setDemandaSelecionada((previous) => previous ? {
                  ...previous,
                  assunto: values.assunto,
                  responsavelId: selected?.id ?? null,
                  responsavel: selected?.nome ?? (preserveLegacy ? current.responsavel : ''),
                  limite1: values.limite1,
                  limite1Situacao: values.limite1Situacao,
                  limite2: values.limite2,
                  limite2Situacao: values.limite2Situacao,
                  setor: values.setor,
                } : null);
              } else setDemandaSelecionada(null);
            }}
          />
        )}

        {modalStatusAberto && demandaSelecionada && (
          <ModalStatus
            demanda={demandaSelecionada}
            onClose={() => {
              setModalStatusAberto(false);
              if (!drawerAberto) setDemandaSelecionada(null);
            }}
            onAtualizar={async (id, input) => {
              if (!await handleAtualizarStatus(id, input)) return;
              setModalStatusAberto(false);
              if (drawerAberto) {
                setDemandaSelecionada((previous) => previous ? {
                  ...previous,
                  status: input.status,
                  proximaAcao: input.status === 'Encerrado' ? '' : input.proximaAcao,
                  proximaAcaoEm: input.status === 'Encerrado' ? '' : input.proximaAcaoEm,
                } : null);
              } else setDemandaSelecionada(null);
            }}
          />
        )}

        {modalAndamentoAberto && demandaSelecionada && (
          <ModalAndamento
            demanda={demandaSelecionada}
            onClose={() => {
              setModalAndamentoAberto(false);
              if (!drawerAberto) setDemandaSelecionada(null);
            }}
            onRegistrar={async (id, input) => {
              if (!await handleRegistrarAndamento(id, input)) return;
              setModalAndamentoAberto(false);
              if (drawerAberto) {
                setDemandaSelecionada((previous) => previous ? {
                  ...previous,
                  proximaAcao: input.proximaAcao,
                  proximaAcaoEm: input.proximaAcaoEm,
                } : null);
              } else setDemandaSelecionada(null);
            }}
          />
        )}

        {modalHistoricoAberto && demandaSelecionada && (
          <ModalHistorico
            demanda={demandaSelecionada}
            historico={historico}
            onClose={() => {
              setModalHistoricoAberto(false);
              if (!drawerAberto) setDemandaSelecionada(null);
            }}
          />
        )}

        <ErrorBoundary
          title="Não foi possível abrir o prontuário"
          message="A carteira continua disponível. Tente novamente ou feche o prontuário para continuar a consulta."
          resetKeys={[demandaSelecionada?.id, drawerAberto]}
          secondaryAction={{
            label: 'Fechar prontuário',
            onClick: () => {
              setDrawerAberto(false);
              setDemandaSelecionada(null);
            },
          }}
        >
          <DemandDetailDrawer
            demanda={demandaSelecionada}
            historico={historico}
            open={drawerAberto}
            nestedDialogOpen={drawerBloqueadoPorModal}
            canEdit={canEdit}
            onClose={() => {
              setDrawerAberto(false);
              setDemandaSelecionada(null);
            }}
            onEdit={() => setModalEditarAberto(true)}
            onProgress={() => setModalAndamentoAberto(true)}
            onStatus={() => setModalStatusAberto(true)}
          />
        </ErrorBoundary>
      </div>
    </Suspense>
  );
};

export const App: React.FC<AppProps> = (props) => {
  const inRouter = useInRouterContext();
  const app = inRouter ? <AppContent {...props} /> : <BrowserRouter><AppContent {...props} /></BrowserRouter>;
  return (
    <>
      <ErrorBoundary
        variant="global"
        title="Não foi possível carregar o sistema"
        message="Tente iniciar a aplicação novamente. Caso a falha continue, recarregue a página para restabelecer a sessão."
        secondaryAction={{
          label: 'Recarregar página',
          onClick: () => window.location.reload(),
        }}
      >
        {app}
      </ErrorBoundary>
      <Toaster richColors position="top-right" closeButton duration={4200} />
      <Analytics />
    </>
  );
};
