import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, useInRouterContext, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Demanda, type PerfilUsuario } from './types';
import { resolveAppConfig } from './config/appConfig';
import { useAppSession } from './hooks/useAppSession';
import { useDemandasData } from './hooks/useDemandasData';
import { createAppServices, type AppServices } from './services/createAppServices';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { AtencaoImediata } from './components/AtencaoImediata';
import { VisaoGeral } from './components/VisaoGeral';
import { AdminSkeleton, AuthSkeleton, DashboardSkeleton, TableSkeleton } from './components/LoadingSkeletons';
import { getTodayString, isBeforeToday } from './utils/date';

const DemandasTable = lazy(() => import('./components/DemandasTable').then((module) => ({ default: module.DemandasTable })));
const ModalNovo = lazy(() => import('./components/ModalNovo').then((module) => ({ default: module.ModalNovo })));
const ModalEditar = lazy(() => import('./components/ModalEditar').then((module) => ({ default: module.ModalEditar })));
const ModalStatus = lazy(() => import('./components/ModalStatus').then((module) => ({ default: module.ModalStatus })));
const ModalHistorico = lazy(() => import('./components/ModalHistorico').then((module) => ({ default: module.ModalHistorico })));
const AdminPanel = lazy(() => import('./components/AdminPanel').then((module) => ({ default: module.AdminPanel })));
const DemandDetailDrawer = lazy(() => import('./components/DemandDetailDrawer').then((module) => ({ default: module.DemandDetailDrawer })));
const AuthPanel = lazy(() => import('./components/AuthPanel').then((module) => ({ default: module.AuthPanel })));

interface AppProps {
  services?: AppServices;
}

const AppContent: React.FC<AppProps> = ({ services }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [appServices] = useState(() => services ?? createAppServices(resolveAppConfig(import.meta.env)));
  const session = useAppSession(appServices.auth);
  const data = useDemandasData(appServices.demandas, session.user, appServices.mode === 'supabase');
  const userEmail = session.user?.email ?? '';
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const canAccessAdmin = appServices.mode === 'local'
    || (session.user?.perfil.nivel === 'administrador' && session.user.perfil.status === 'ativo');
  const canEdit = appServices.mode === 'local'
    || (session.user?.perfil.status === 'ativo' && ['administrador', 'editor'].includes(session.user.perfil.nivel));
  const canDelete = appServices.mode === 'local'
    || (session.user?.perfil.status === 'ativo' && session.user.perfil.nivel === 'administrador');

  // --- Estados do Aplicativo ---
  const demandas = data.demandas;
  const historico = data.historico;
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<string[]>([]);
  
  // --- Estado de filtros restaurável pela URL ---
  const [filtros, setFiltros] = useState(() => ({
    busca: searchParams.get('busca') ?? '',
    tipo: searchParams.get('tipo') ?? 'Todos',
    classificacao: searchParams.get('classificacao') ?? 'Todas',
    status: searchParams.get('status') ?? 'Somente ativos (padrão)',
    setor: searchParams.get('setor') ?? 'Todos',
  }));

  const [quickFilters, setQuickFilters] = useState(() => ({
    assinatura: searchParams.get('assinatura') === '1',
    hoje: searchParams.get('hoje') === '1',
    vencido: searchParams.get('vencido') === '1',
  }));

  const activeTab: 'visao-geral' | 'demandas' | 'admin' = location.pathname.startsWith('/admin')
    ? 'admin'
    : location.pathname.startsWith('/demandas')
      ? 'demandas'
      : 'visao-geral';
  const drawerAberto = /^\/demandas\/\d+$/.test(location.pathname);
  const setActiveTab = (tab: 'visao-geral' | 'demandas' | 'admin') => {
    const target = tab === 'visao-geral' ? '/' : tab === 'admin' ? '/admin' : '/demandas';
    navigate({ pathname: target, search: tab === 'demandas' ? searchParams.toString() : '' });
  };
  const setDrawerAberto = (open: boolean) => {
    if (!open) navigate({ pathname: '/demandas', search: searchParams.toString() });
  };

  // --- Estados dos Modais ---
  const [modalNovoAberto, setModalNovoAberto] = useState<boolean>(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState<Demanda | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState<boolean>(false);
  const [modalStatusAberto, setModalStatusAberto] = useState<boolean>(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState<boolean>(false);
  const [exportandoExcel, setExportandoExcel] = useState(false);
  const drawerBloqueadoPorModal = modalEditarAberto || modalStatusAberto || modalHistoricoAberto;

  useEffect(() => {
    if (activeTab !== 'demandas') return;
    const next = new URLSearchParams();
    if (filtros.busca) next.set('busca', filtros.busca);
    if (filtros.tipo !== 'Todos') next.set('tipo', filtros.tipo);
    if (filtros.classificacao !== 'Todas') next.set('classificacao', filtros.classificacao);
    if (filtros.status !== 'Somente ativos (padrão)') next.set('status', filtros.status);
    if (filtros.setor !== 'Todos') next.set('setor', filtros.setor);
    if (quickFilters.assinatura) next.set('assinatura', '1');
    if (quickFilters.hoje) next.set('hoje', '1');
    if (quickFilters.vencido) next.set('vencido', '1');
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [activeTab, filtros, quickFilters, searchParams, setSearchParams]);

  useEffect(() => {
    const match = /^\/demandas\/(\d+)$/.exec(location.pathname);
    if (!match || demandas.length === 0) return;
    const selected = demandas.find((demanda) => demanda.id === Number(match[1]));
    if (selected) setDemandaSelecionada(selected);
    else {
      toast.error('A demanda informada não foi encontrada.');
      navigate({ pathname: '/demandas', search: searchParams.toString() }, { replace: true });
    }
  }, [demandas, location.pathname, navigate, searchParams]);

  const openDemand = (demanda: Demanda) => {
    setDemandaSelecionada(demanda);
    navigate({ pathname: `/demandas/${demanda.id}`, search: searchParams.toString() });
  };

  useEffect(() => {
    if (appServices.mode !== 'supabase' || !canAccessAdmin || activeTab !== 'admin') {
      return;
    }
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
    const perfilAlvo = perfis.find(p => p.id === id);
    const eraAdminAtivo = perfilAlvo && perfilAlvo.nivel === 'administrador' && perfilAlvo.status === 'ativo';
    const vaiDeixarDeSer = 
      (patch.nivel !== undefined && patch.nivel !== 'administrador') || 
      (patch.status !== undefined && patch.status !== 'ativo');

    if (eraAdminAtivo && vaiDeixarDeSer) {
      const outrosAdminsAtivos = perfis.filter(p => p.id !== id && p.nivel === 'administrador' && p.status === 'ativo').length;
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

  // Recalcular lista de setores únicos a partir de todas as demandas cadastradas
  useEffect(() => {
    const setoresUnicos = Array.from(
      new Set(
        demandas
          .map(d => d.setor?.trim())
          .filter((s): s is string => !!s)
      )
    ).sort();
    setSetoresDisponiveis(setoresUnicos);
  }, [demandas]);

  const handleLogout = async () => {
    await session.signOut();
    setActiveTab('visao-geral');
    setDrawerAberto(false);
    setDemandaSelecionada(null);
    setModalNovoAberto(false);
    setModalEditarAberto(false);
    setModalStatusAberto(false);
    setModalHistoricoAberto(false);
    setPerfis([]);
    setFiltros({
      busca: '',
      tipo: 'Todos',
      classificacao: 'Todas',
      status: 'Somente ativos (padrão)',
      setor: 'Todos'
    });
    setQuickFilters({
      assinatura: false,
      hoje: false,
      vencido: false
    });
  };

  // Criar nova demanda
  const handleSalvarNovaDemanda = async (novaDemanda: Omit<Demanda, 'id'>) => {
    try {
      await data.create(novaDemanda);
      setModalNovoAberto(false);
      toast.success('Demanda criada com sucesso.');
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível criar a demanda. Os dados preenchidos foram preservados.');
    }
  };

  // Editar dados da demanda
  const handleSalvarEdicaoDemanda = async (demandaId: number, camposAlterados: Partial<Demanda>) => {
    try {
      await data.update(demandaId, camposAlterados);
      toast.success('Demanda atualizada com sucesso.');
      return true;
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível editar a demanda. Os dados preenchidos foram preservados.');
      return false;
    }
  };

  // Atualizar Status e Comentário (gera histórico)
  const handleAtualizarStatus = async (demandaId: number, novoStatus: Demanda['status'], comentario: string) => {
    try {
      await data.updateStatus(demandaId, novoStatus, comentario);
      toast.success('Status atualizado com sucesso.');
      return true;
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível atualizar o status.');
      return false;
    }
  };

  // Excluir demanda
  const handleExcluirDemanda = async (demandaId: number) => {
    try {
      await data.delete(demandaId);
      toast.success('Demanda excluída com sucesso.');
    } catch (reason) {
      toast.error(reason instanceof Error ? reason.message : 'Não foi possível excluir a demanda.');
    }
  };

  // --- Utilitários de Filtros ---

  // Lógica de filtragem dos dados
  const getDemandasFiltradas = () => {
    const todayStr = getTodayString();

    return demandas.filter(d => {
      // 1. Filtros Rápidos Cumulativos ("Hoje", "Vencido", "Para assinatura")
      const algunQuickAtivo = quickFilters.assinatura || quickFilters.hoje || quickFilters.vencido;
      
      if (algunQuickAtivo) {
        let matchQuick = false;
        
        if (quickFilters.assinatura && d.status === 'Para Assinatura') {
          matchQuick = true;
        }
        if (quickFilters.hoje && d.status !== 'Encerrado' && d.limite2 === todayStr) {
          matchQuick = true;
        }
        if (quickFilters.vencido && d.status !== 'Encerrado' && d.limite2 && isBeforeToday(d.limite2)) {
          matchQuick = true;
        }

        if (!matchQuick) return false;
      }

      // 2. Filtro de Busca por texto (Número, Assunto, Responsável)
      if (filtros.busca.trim()) {
        const buscaLower = filtros.busca.toLowerCase();
        const numMatch = d.numero.toLowerCase().includes(buscaLower);
        const assMatch = d.assunto.toLowerCase().includes(buscaLower);
        const respMatch = d.responsavel?.toLowerCase().includes(buscaLower) || false;
        
        if (!numMatch && !assMatch && !respMatch) {
          return false;
        }
      }

      // 3. Filtro de Tipo
      if (filtros.tipo !== 'Todos' && d.tipo !== filtros.tipo) {
        return false;
      }

      // 4. Filtro de Classificação
      if (filtros.classificacao !== 'Todas' && d.classificacao !== filtros.classificacao) {
        return false;
      }

      // 5. Filtro de Status
      if (filtros.status === 'Somente ativos (padrão)') {
        if (d.status === 'Encerrado') return false;
      } else if (filtros.status !== 'Todos (exibir tudo)') {
        if (d.status !== filtros.status) return false;
      }

      // 6. Filtro de Setor
      if (filtros.setor !== 'Todos' && d.setor !== filtros.setor) {
        return false;
      }

      return true;
    });
  };

  const demandasFiltradas = getDemandasFiltradas();

  // Exportar o recorte filtrado como workbook Excel analítico.
  // O módulo pesado é carregado somente no clique para preservar o bundle inicial.
  const handleExportExcel = async () => {
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

  // Renderização condicional: Tela de Login ou Área de Dashboard
  if (!userEmail) {
    return (
      <Suspense fallback={<AuthSkeleton />}>
        <AuthPanel
          mode={appServices.mode}
          loading={session.loading}
          onSignIn={session.signIn}
          onRequestAccess={session.requestAccess}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={activeTab === 'admin' ? <AdminSkeleton /> : activeTab === 'demandas' ? <TableSkeleton /> : null}>
    <div className="app-container">
      {/* Cabeçalho com cards de estatísticas */}
      <Header 
        userEmail={userEmail} 
        demandas={demandas} 
        onLogout={handleLogout} 
        onOpenNovo={() => setModalNovoAberto(true)}
        onExportExcel={handleExportExcel}
        exportingExcel={exportandoExcel}
        filtrosAtivos={{
          status: filtros.status,
          quickFilters
        }}
        onToggleFiltroStatus={(novoStatus) => {
          setFiltros(prev => ({ ...prev, status: novoStatus }));
          setQuickFilters({ assinatura: false, hoje: false, vencido: false });
          setActiveTab('demandas'); // Direciona para a página de Demandas
        }}
        onToggleQuickFilter={(filtro) => {
          setQuickFilters(prev => {
            const novoVal = !prev[filtro];
            return {
              ...prev,
              [filtro]: novoVal
            };
          });
          setActiveTab('demandas'); // Direciona para a página de Demandas
        }}
        canEdit={canEdit}
        appMode={appServices.mode}
      />

      {/* Navegação por Abas SPA */}
      <nav className="nav-tabs">
        <button 
          type="button" 
          className={`nav-tab-link ${activeTab === 'visao-geral' ? 'active' : ''}`}
          aria-current={activeTab === 'visao-geral' ? 'page' : undefined}
          onClick={() => setActiveTab('visao-geral')}
          title="Ver o resumo e indicadores do CTRH"
        >
          <i className="fa-solid fa-chart-pie"></i>
          <span>Visão geral</span>
        </button>
        
        <button 
          type="button" 
          className={`nav-tab-link ${activeTab === 'demandas' ? 'active' : ''}`}
          aria-current={activeTab === 'demandas' ? 'page' : undefined}
          onClick={() => setActiveTab('demandas')}
          title="Ver a listagem e pesquisar processos operacionais"
        >
          <i className="fa-solid fa-list-check"></i>
          <span>Demandas</span>
        </button>

        {canAccessAdmin && (
          <button
            type="button"
            className={`nav-tab-link ${activeTab === 'admin' ? 'active' : ''}`}
            aria-current={activeTab === 'admin' ? 'page' : undefined}
            onClick={() => setActiveTab('admin')}
            title="Ver e gerenciar configurações e perfis de servidores"
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Administração</span>
          </button>
        )}
      </nav>

      {/* Banner de Erro caso exista (Global) */}
      {data.error && (
        <div style={{ padding: '0 24px', marginTop: '20px' }}>
          <div className="alert-error-banner" style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fee2e2',
            borderLeft: '4px solid #ef4444',
            borderRadius: '8px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: '#991b1b',
            fontSize: '0.875rem',
            fontWeight: 500
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.125rem', color: '#ef4444' }}></i>
            <div>
              <strong>Erro de Conectividade:</strong> {data.error}
            </div>
          </div>
        </div>
      )}

      {/* Tabela de Demandas ou Estado de Carregamento Global */}
      {data.loading ? (
        activeTab === 'visao-geral' ? <DashboardSkeleton /> : activeTab === 'admin' ? <AdminSkeleton /> : <TableSkeleton />
      ) : (
        <>
          {activeTab === 'visao-geral' && (
            <div key="visao-geral" className="route-transition">
            <VisaoGeral 
              demandas={demandas}
              historico={historico}
              onOpenEditar={openDemand}
              renderAtencaoImediata={() => (
                <AtencaoImediata 
                  demandas={demandas}
                  historico={historico}
                  onOpenEditar={openDemand}
                />
              )}
            />
            </div>
          )}

          {activeTab === 'demandas' && (
            <div key="demandas" className="route-transition">
              {/* Faixa de Atenção Imediata */}
              <AtencaoImediata 
                demandas={demandas}
                historico={historico}
                onOpenEditar={openDemand}
              />

              {/* Painel de Filtros e Busca */}
              <FilterPanel 
                filtros={filtros} 
                setFiltros={setFiltros} 
                quickFilters={quickFilters}
                setQuickFilters={setQuickFilters}
                setoresDisponiveis={setoresDisponiveis}
                totalExibidos={demandasFiltradas.length}
                totalGeral={demandas.length}
              />

              <DemandasTable 
                demandas={demandasFiltradas}
                canEdit={canEdit}
                canDelete={canDelete}
                onOpenEditar={openDemand}
                onOpenStatus={(d) => {
                  setDemandaSelecionada(d);
                  setModalStatusAberto(true);
                }}
                onOpenHistorico={(d) => {
                  setDemandaSelecionada(d);
                  setModalHistoricoAberto(true);
                }}
                onExcluir={handleExcluirDemanda}
              />
            </div>
          )}

          {activeTab === 'admin' && canAccessAdmin && (
            appServices.mode === 'supabase'
              ? <AdminPanel perfis={perfis} onUpdatePerfil={handleUpdatePerfil} />
              : <AdminPanel />
          )}
        </>
      )}

      {/* --- Modais Clássicos (Acionados a partir da Tabela ou do Drawer) --- */}
      
      {/* Modal Novo Registro */}
      {modalNovoAberto && (
        <ModalNovo 
          onClose={() => setModalNovoAberto(false)}
          onSalvar={handleSalvarNovaDemanda}
        />
      )}

      {/* Modal Editar Demanda */}
      {modalEditarAberto && demandaSelecionada && (
        <ModalEditar 
          demanda={demandaSelecionada}
          onClose={() => {
            setModalEditarAberto(false);
            // Se o Drawer estava aberto, não zeramos o demandaSelecionada para mantê-lo ativo
            if (!drawerAberto) {
              setDemandaSelecionada(null);
            }
          }}
          onSalvar={async (id, campos) => {
            if (!await handleSalvarEdicaoDemanda(id, campos)) return;
            setModalEditarAberto(false);
            // Atualiza a referência de visualização se o Drawer de detalhe estiver aberto
            if (drawerAberto) {
              setDemandaSelecionada(prev => prev ? { ...prev, ...campos } : null);
            } else {
              setDemandaSelecionada(null);
            }
          }}
        />
      )}

      {/* Modal Atualizar Status */}
      {modalStatusAberto && demandaSelecionada && (
        <ModalStatus 
          demanda={demandaSelecionada}
          onClose={() => {
            setModalStatusAberto(false);
            if (!drawerAberto) {
              setDemandaSelecionada(null);
            }
          }}
          onAtualizar={async (id: number, status: Demanda['status'], coment: string) => {
            if (!await handleAtualizarStatus(id, status, coment)) return;
            setModalStatusAberto(false);
            // Atualiza a referência de visualização se o Drawer de detalhe estiver aberto
            if (drawerAberto) {
              const novaD = demandas.find(d => d.id === id);
              setDemandaSelecionada(prev => prev ? { ...prev, status, setor: novaD?.setor || prev.setor } : null);
            } else {
              setDemandaSelecionada(null);
            }
          }}
        />
      )}

      {/* Modal Histórico Comentários */}
      {modalHistoricoAberto && demandaSelecionada && (
        <ModalHistorico 
          demanda={demandaSelecionada}
          historico={historico}
          onClose={() => {
            setModalHistoricoAberto(false);
            if (!drawerAberto) {
              setDemandaSelecionada(null);
            }
          }}
        />
      )}

      {/* Drawer Lateral de Detalhe da Demanda */}
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
        onStatus={() => setModalStatusAberto(true)}
      />
    </div>
    </Suspense>
  );
};

export const App: React.FC<AppProps> = (props) => {
  const inRouter = useInRouterContext();
  const app = inRouter ? <AppContent {...props} /> : <BrowserRouter><AppContent {...props} /></BrowserRouter>;
  return (
    <>
      {app}
      <Toaster richColors position="top-right" closeButton duration={4200} />
    </>
  );
};
