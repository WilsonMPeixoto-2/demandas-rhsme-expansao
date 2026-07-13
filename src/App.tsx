import React, { useState, useEffect } from 'react';
import { Demanda, type PerfilUsuario } from './types';
import { resolveAppConfig } from './config/appConfig';
import { useAppSession } from './hooks/useAppSession';
import { useDemandasData } from './hooks/useDemandasData';
import { createAppServices, type AppServices } from './services/createAppServices';
import { Header } from './components/Header';
import { FilterPanel } from './components/FilterPanel';
import { DemandasTable } from './components/DemandasTable';
import { ModalNovo } from './components/ModalNovo';
import { ModalEditar } from './components/ModalEditar';
import { ModalStatus } from './components/ModalStatus';
import { ModalHistorico } from './components/ModalHistorico';
import { AtencaoImediata } from './components/AtencaoImediata';
import { VisaoGeral } from './components/VisaoGeral';
import { AdminPanel } from './components/AdminPanel';

interface AppProps {
  services?: AppServices;
}

export const App: React.FC<AppProps> = ({ services }) => {
  const [appServices] = useState(() => services ?? createAppServices(resolveAppConfig(import.meta.env)));
  const session = useAppSession(appServices.auth);
  const data = useDemandasData(appServices.demandas, session.user, appServices.mode === 'supabase');
  const userEmail = session.user?.email ?? '';
  const [perfis, setPerfis] = useState<PerfilUsuario[]>([]);
  const canAccessAdmin = appServices.mode === 'local'
    || (session.user?.perfil.nivel === 'administrador' && session.user.perfil.status === 'ativo');
  const canEdit = appServices.mode === 'local'
    || (session.user?.perfil.status === 'ativo' && ['administrador', 'editor'].includes(session.user.perfil.nivel));

  // --- Estados do formulário de autenticação ---
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginSenha, setLoginSenha] = useState<string>('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [cadEmail, setCadEmail] = useState<string>('');
  const [cadSenha, setCadSenha] = useState<string>('');
  const [showCadastroPassword, setShowCadastroPassword] = useState(false);
  const [loginTab, setLoginTab] = useState<'login' | 'cadastro'>('login');
  
  // Mensagens de erro e validações
  const [erroEmail, setErroEmail] = useState<boolean>(false);
  const [senhaValida, setSenhaValida] = useState({
    minimo: false,
    maiuscula: false,
    minuscula: false,
    numero: false
  });

  // --- Estados do Aplicativo ---
  const demandas = data.demandas;
  const historico = data.historico;
  const [setoresDisponiveis, setSetoresDisponiveis] = useState<string[]>([]);
  
  // --- Estados de Filtro ---
  const [filtros, setFiltros] = useState({
    busca: '',
    tipo: 'Todos',
    classificacao: 'Todas',
    status: 'Somente ativos (padrão)', // Padrão solicitado no DOCX
    setor: 'Todos'
  });

  const [quickFilters, setQuickFilters] = useState({
    assinatura: false,
    hoje: false,
    vencido: false
  });

  // --- Estados de Roteamento SPA ---
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'demandas' | 'admin'>('visao-geral');
  const [drawerAberto, setDrawerAberto] = useState<boolean>(false);

  // --- Estados dos Modais ---
  const [modalNovoAberto, setModalNovoAberto] = useState<boolean>(false);
  const [demandaSelecionada, setDemandaSelecionada] = useState<Demanda | null>(null);
  const [modalEditarAberto, setModalEditarAberto] = useState<boolean>(false);
  const [modalStatusAberto, setModalStatusAberto] = useState<boolean>(false);
  const [modalHistoricoAberto, setModalHistoricoAberto] = useState<boolean>(false);

  useEffect(() => {
    if (appServices.mode !== 'supabase' || !canAccessAdmin) {
      setPerfis([]);
      return;
    }
    let active = true;
    void appServices.profiles.list()
      .then((items) => { if (active) setPerfis(items); })
      .catch((reason: unknown) => {
        if (active) alert(reason instanceof Error ? reason.message : 'Não foi possível carregar os perfis.');
      });
    return () => { active = false; };
  }, [appServices, canAccessAdmin]);

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
        alert("Ação Bloqueada: O sistema não pode ficar sem nenhum administrador ativo.");
        return;
      }
    }

    try {
      await appServices.profiles.updateAccess(id, patch);
      setPerfis(await appServices.profiles.list());
    } catch (reason) {
      alert(reason instanceof Error ? reason.message : 'Não foi possível atualizar o perfil.');
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

  // --- Validação da Senha Forte e E-mail Corporativo ---
  useEffect(() => {
    if (cadEmail && !cadEmail.toLowerCase().endsWith('@rioeduca.net')) {
      setErroEmail(true);
    } else {
      setErroEmail(false);
    }

    setSenhaValida({
      minimo: cadSenha.length >= 8,
      maiuscula: /[A-Z]/.test(cadSenha),
      minuscula: /[a-z]/.test(cadSenha),
      numero: /[0-9]/.test(cadSenha)
    });
  }, [cadEmail, cadSenha]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await session.signIn(loginEmail, loginSenha);
    } catch (reason) {
      alert(reason instanceof Error ? reason.message : 'Não foi possível entrar.');
    }
  };

  const handleCadastroSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isSenhaForte = senhaValida.minimo && senhaValida.maiuscula && senhaValida.minuscula && senhaValida.numero;
    const isEmailValido = cadEmail.toLowerCase().endsWith('@rioeduca.net');

    if (isEmailValido && isSenhaForte) {
      try {
        await session.requestAccess(cadEmail, cadSenha);
        alert(appServices.mode === 'local'
          ? "Solicitação de acesso simulada com sucesso! Você já pode entrar com sua conta no formulário de login."
          : 'Solicitação enviada. Aguarde a aprovação de um administrador antes de entrar.');
        setLoginTab('login');
        setLoginEmail(cadEmail);
        setCadEmail('');
        setCadSenha('');
      } catch (reason) {
        alert(reason instanceof Error ? reason.message : 'Não foi possível solicitar acesso.');
      }
    } else {
      alert("Por favor, atenda a todos os requisitos de segurança antes de prosseguir.");
    }
  };

  const handleLogout = async () => {
    await session.signOut();
    setLoginEmail('');
    setLoginSenha('');
    setCadEmail('');
    setCadSenha('');
    setShowLoginPassword(false);
    setShowCadastroPassword(false);
    setLoginTab('login');
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
    } catch (reason) {
      alert(reason instanceof Error ? reason.message : 'Não foi possível criar a demanda.');
    }
  };

  // Editar dados da demanda
  const handleSalvarEdicaoDemanda = async (demandaId: number, camposAlterados: Partial<Demanda>) => {
    try {
      await data.update(demandaId, camposAlterados);
      return true;
    } catch (reason) {
      alert(reason instanceof Error ? reason.message : 'Não foi possível editar a demanda.');
      return false;
    }
  };

  // Atualizar Status e Comentário (gera histórico)
  const handleAtualizarStatus = async (demandaId: number, novoStatus: Demanda['status'], comentario: string) => {
    try {
      await data.updateStatus(demandaId, novoStatus, comentario);
      return true;
    } catch (reason) {
      alert(reason instanceof Error ? reason.message : 'Não foi possível atualizar o status.');
      return false;
    }
  };

  // Excluir demanda
  const handleExcluirDemanda = async (demandaId: number) => {
    try {
      await data.delete(demandaId);
    } catch (reason) {
      alert(reason instanceof Error ? reason.message : 'Não foi possível excluir a demanda.');
    }
  };

  // --- Utilitários de Filtros ---
  const getTodayString = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const isBeforeToday = (dateStr: string) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') return false;
    const [day, month, year] = dateStr.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    const today = new Date();
    const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    return dateObj < todayObj;
  };

  // Calcula rótulos semânticos de prazo final
  const getPrazoFinalSemantics = (dateStr: string | undefined) => {
    if (!dateStr || dateStr === 'dd/mm/aaaa') {
      return { data: '—', label: null, classe: '' };
    }

    try {
      const [day, month, year] = dateStr.split('/').map(Number);
      const dateObj = new Date(year, month - 1, day);
      
      const meses = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
      const dataFormatada = `${String(day).padStart(2, '0')} ${meses[month - 1]} ${year}`;

      const today = new Date();
      const todayObj = new Date(today.getFullYear(), today.getMonth(), today.getDate());

      const diffTime = dateObj.getTime() - todayObj.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        const absDays = Math.abs(diffDays);
        return {
          data: dataFormatada,
          label: `${absDays} ${absDays === 1 ? 'dia' : 'dias'} em atraso`,
          classe: 'status-atrasado'
        };
      } else if (diffDays === 0) {
        return {
          data: dataFormatada,
          label: 'vence hoje',
          classe: 'status-hoje'
        };
      } else {
        return {
          data: dataFormatada,
          label: `em ${diffDays} ${diffDays === 1 ? 'dia' : 'dias'}`,
          classe: 'status-no-prazo'
        };
      }
    } catch {
      return { data: dateStr, label: null, classe: '' };
    }
  };

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

  // Exportar demandas filtradas como CSV (Protegido contra CSV Injection)
  const handleExportCSV = () => {
    if (demandasFiltradas.length === 0) {
      alert("Nenhum registro disponível para exportação na filtragem atual.");
      return;
    }

    const sanitizeCSVCell = (val: any): string => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      str = str.replace(/"/g, '""');
      if (str.startsWith('=') || str.startsWith('+') || str.startsWith('-') || str.startsWith('@')) {
        str = `'${str}`;
      }
      return `"${str}"`;
    };

    const headers = ['ID', 'Número', 'Tipo', 'Assunto', 'Responsável', 'Limite 1', 'Limite 2', 'Status', 'Setor', 'Classificação'];
    
    const rows = demandasFiltradas.map(d => [
      sanitizeCSVCell(d.id),
      sanitizeCSVCell(d.numero),
      sanitizeCSVCell(d.tipo),
      sanitizeCSVCell(d.assunto),
      sanitizeCSVCell(d.responsavel),
      sanitizeCSVCell(d.limite1),
      sanitizeCSVCell(d.limite2),
      sanitizeCSVCell(d.status),
      sanitizeCSVCell(d.setor),
      sanitizeCSVCell(d.classificacao)
    ]);

    const csvRows = [
      'sep=;',
      headers.join(';'),
      ...rows.map(e => e.join(';'))
    ];

    const csvContent = "\uFEFF" + csvRows.join('\r\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `demandas_sme_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Renderização condicional: Tela de Login ou Área de Dashboard
  if (!userEmail) {
    return (
      <div className="login-split-container">
        {/* Lado Esquerdo: Painel Azul/Slate Corporativo */}
        <div className="login-sidebar">
          <div className="login-sidebar-content">
            <span className="sidebar-badge">CTRH • SME</span>
            <h2>Central de Demandas</h2>
            <p className="sidebar-description">
              Organização, acompanhamento e rastreabilidade das demandas de Recursos Humanos.
            </p>
            
            <div className="sidebar-features">
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div className="feature-text">
                  <strong>Prazos</strong>
                  <span>Alertas visuais e semânticos sobre datas limites e providências em atraso.</span>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <i className="fa-solid fa-user-check"></i>
                </div>
                <div className="feature-text">
                  <strong>Responsáveis</strong>
                  <span>Atribuição clara de tarefas com suporte a avatares e vinculação por setores.</span>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon-wrapper">
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </div>
                <div className="feature-text">
                  <strong>Histórico</strong>
                  <span>Rastreabilidade completa de logs e comentários de status por processo.</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Padrão geométrico decorativo em segundo plano */}
          <div className="sidebar-pattern"></div>
        </div>

        {/* Lado Direito: Card de Autenticação */}
        <div className="login-form-area">
          <div className="login-card-editorial">
            {/* Cabeçalho de Login Móvel (Aparece apenas em Mobile) */}
            <div className="login-mobile-brand">
              <h2>Central de Demandas</h2>
              <p>CTRH — Secretaria Municipal de Educação</p>
            </div>

            <div className="login-card-header">
              <h3>Painel de Acesso</h3>
              <p>Identifique-se com a sua credencial @rioeduca.net</p>
            </div>

            <div className="login-tabs">
              <button 
                type="button" 
                className={`login-tab-btn ${loginTab === 'login' ? 'active' : ''}`}
                onClick={() => setLoginTab('login')}
              >
                Entrar
              </button>
              <button 
                type="button" 
                className={`login-tab-btn ${loginTab === 'cadastro' ? 'active' : ''}`}
                onClick={() => setLoginTab('cadastro')}
              >
                Primeiro Acesso
              </button>
            </div>

            {loginTab === 'login' ? (
              /* Formulário de Login */
              <form onSubmit={handleLoginSubmit}>
                <div className="login-form-group">
                  <label htmlFor="login-email">E-mail Corporativo</label>
                  <div className="input-icon-group">
                    <i className="fa-solid fa-envelope"></i>
                    <input 
                      type="email" 
                      id="login-email"
                      className="form-control" 
                      placeholder="usuario@rioeduca.net"
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      required 
                    />
                  </div>
                </div>
                <div className="login-form-group" style={{ marginBottom: '25px' }}>
                  <label htmlFor="login-senha">Senha</label>
                  <div className="input-icon-group has-visibility-toggle">
                    <i className="fa-solid fa-lock"></i>
                    <input 
                      type={showLoginPassword ? 'text' : 'password'}
                      id="login-senha"
                      className="form-control" 
                      placeholder="••••••••"
                      value={loginSenha}
                      onChange={e => setLoginSenha(e.target.value)}
                      required 
                    />
                    <button
                      type="button"
                      className="password-visibility-toggle"
                      aria-label={showLoginPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      aria-pressed={showLoginPassword}
                      onClick={() => setShowLoginPassword((visible) => !visible)}
                    >
                      <i className={`fa-solid ${showLoginPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px', fontWeight: '600' }}
                  disabled={session.loading}
                >
                  Acessar Sistema
                </button>
              </form>
            ) : (
              /* Formulário de Primeiro Acesso (Solicitação) */
              <form onSubmit={handleCadastroSubmit}>
                <div className="login-form-group">
                  <label htmlFor="cadastro-email">Seu E-mail Corporativo</label>
                  <div className="input-icon-group">
                    <i className="fa-solid fa-envelope"></i>
                    <input 
                      type="email" 
                      id="cadastro-email"
                      className="form-control" 
                      placeholder="nome@rioeduca.net"
                      value={cadEmail}
                      onChange={e => setCadEmail(e.target.value)}
                      required 
                    />
                  </div>
                  {erroEmail && (
                    <div className="text-danger">Apenas e-mails do domínio @rioeduca.net são aceitos.</div>
                  )}
                </div>
                
                <div className="login-form-group" style={{ marginBottom: '20px' }}>
                  <label htmlFor="cadastro-senha">Criar Nova Senha</label>
                  <div className="input-icon-group has-visibility-toggle">
                    <i className="fa-solid fa-lock"></i>
                    <input 
                      type={showCadastroPassword ? 'text' : 'password'}
                      id="cadastro-senha"
                      className="form-control" 
                      placeholder="••••••••"
                      value={cadSenha}
                      onChange={e => setCadSenha(e.target.value)}
                      required 
                    />
                    <button
                      type="button"
                      className="password-visibility-toggle"
                      aria-label={showCadastroPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      aria-pressed={showCadastroPassword}
                      onClick={() => setShowCadastroPassword((visible) => !visible)}
                    >
                      <i className={`fa-solid ${showCadastroPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                    </button>
                  </div>
                  
                  {/* Visualização de critérios de Senha Forte */}
                  <div className="password-requirements">
                    <div className={`req-item ${senhaValida.minimo ? 'valid' : ''}`}>
                      <i className={senhaValida.minimo ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                      <span>Mínimo de 8 caracteres</span>
                    </div>
                    <div className={`req-item ${senhaValida.maiuscula ? 'valid' : ''}`}>
                      <i className={senhaValida.maiuscula ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                      <span>Pelo menos uma letra maiúscula</span>
                    </div>
                    <div className={`req-item ${senhaValida.minuscula ? 'valid' : ''}`}>
                      <i className={senhaValida.minuscula ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                      <span>Pelo menos uma letra minúscula</span>
                    </div>
                    <div className={`req-item ${senhaValida.numero ? 'valid' : ''}`}>
                      <i className={senhaValida.numero ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'}></i>
                      <span>Pelo menos um número</span>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '12px', fontWeight: '600' }}
                  disabled={session.loading || !(cadEmail.toLowerCase().endsWith('@rioeduca.net') && senhaValida.minimo && senhaValida.maiuscula && senhaValida.minuscula && senhaValida.numero)}
                >
                  Solicitar Aprovação
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Cabeçalho com cards de estatísticas */}
      <Header 
        userEmail={userEmail} 
        demandas={demandas} 
        onLogout={handleLogout} 
        onOpenNovo={() => setModalNovoAberto(true)}
        onExportCSV={handleExportCSV}
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
          onClick={() => setActiveTab('visao-geral')}
          title="Ver o resumo e indicadores do CTRH"
        >
          <i className="fa-solid fa-chart-pie"></i>
          <span>Visão geral</span>
        </button>
        
        <button 
          type="button" 
          className={`nav-tab-link ${activeTab === 'demandas' ? 'active' : ''}`}
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
            onClick={() => setActiveTab('admin')}
            title="Ver e gerenciar configurações e perfis de servidores"
          >
            <i className="fa-solid fa-sliders"></i>
            <span>Administração</span>
          </button>
        )}
      </nav>

      {/* Conteúdo Dinâmico Baseado na Aba Ativa */}
      {activeTab === 'visao-geral' && (
        <VisaoGeral 
          demandas={demandas}
          historico={historico}
          onOpenEditar={(d) => {
            setDemandaSelecionada(d);
            setDrawerAberto(true);
          }}
          renderAtencaoImediata={() => (
            <AtencaoImediata 
              demandas={demandas}
              historico={historico}
              onOpenEditar={(d) => {
                setDemandaSelecionada(d);
                setDrawerAberto(true);
              }}
            />
          )}
        />
      )}

      {activeTab === 'demandas' && (
        <div style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
          {/* Faixa de Atenção Imediata (Opcional, também visível na mesa de trabalho) */}
          <AtencaoImediata 
            demandas={demandas}
            historico={historico}
            onOpenEditar={(d) => {
              setDemandaSelecionada(d);
              setDrawerAberto(true);
            }}
          />

          {/* Banner de Erro caso exista */}
          {data.error && (
            <div className="alert-error-banner" style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fee2e2',
              borderLeft: '4px solid #ef4444',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '20px',
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
          )}

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

          {/* Tabela de Demandas ou Estado de Carregamento */}
          {data.loading ? (
            <div className="loading-state-wrapper" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              backgroundColor: '#ffffff',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-sm)',
              gap: '12px',
              color: 'var(--text-muted)'
            }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'var(--accent-color)' }}></i>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>Carregando dados da Central...</span>
            </div>
          ) : (
            <DemandasTable 
              demandas={demandasFiltradas}
              canEdit={canEdit}
              onOpenEditar={(d) => {
                setDemandaSelecionada(d);
                setDrawerAberto(true); // Clicar em Abrir/Número agora abre o Drawer lateral!
              }}
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
          )}
        </div>
      )}

      {activeTab === 'admin' && canAccessAdmin && (
        appServices.mode === 'supabase'
          ? <AdminPanel perfis={perfis} onUpdatePerfil={handleUpdatePerfil} />
          : <AdminPanel />
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
      {drawerAberto && demandaSelecionada && (() => {
        const prazoSemantics = getPrazoFinalSemantics(demandaSelecionada.limite2);
        // Filtrar histórico dessa demanda
        const histFiltrado = historico.filter(h => h.demandaId === demandaSelecionada.id);
        
        return (
          <div className="drawer-overlay" onClick={() => { setDrawerAberto(false); setDemandaSelecionada(null); }}>
            <div className="drawer-content" onClick={e => e.stopPropagation()}>
              <div className="drawer-header">
                <h2>Processo nº {demandaSelecionada.numero}</h2>
                <button 
                  type="button"
                  className="btn-drawer-close" 
                  onClick={() => { setDrawerAberto(false); setDemandaSelecionada(null); }}
                  title="Fechar painel de detalhes"
                  aria-label="Fechar painel de detalhes"
                >
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              
              <div className="drawer-body">
                {/* Seção 1: Identificação */}
                <div className="drawer-section">
                  <h3>Identificação</h3>
                  <div className="drawer-meta-grid">
                    <div className="drawer-meta-item full-width">
                      <label>Assunto</label>
                      <span className="value" style={{ fontWeight: 600, fontSize: '0.938rem' }}>{demandaSelecionada.assunto}</span>
                    </div>
                    <div className="drawer-meta-item">
                      <label>Tipo</label>
                      <span className="value">{demandaSelecionada.tipo}</span>
                    </div>
                    <div className="drawer-meta-item">
                      <label>Classificação</label>
                      <span className="value">{demandaSelecionada.classificacao || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Seção 2: Responsabilidade */}
                <div className="drawer-section">
                  <h3>Responsabilidade</h3>
                  <div className="drawer-meta-grid">
                    <div className="drawer-meta-item">
                      <label>Responsável Atual</label>
                      <span className="value" style={{ fontWeight: 600 }}>{demandaSelecionada.responsavel || 'Não atribuído'}</span>
                    </div>
                    <div className="drawer-meta-item">
                      <label>Setor Vinculado</label>
                      <span className="value">{demandaSelecionada.setor || '—'}</span>
                    </div>
                  </div>
                </div>

                {/* Seção 3: Prazos */}
                <div className="drawer-section">
                  <h3>Prazos</h3>
                  <div className="drawer-meta-grid">
                    <div className="drawer-meta-item">
                      <label>Prazo de Análise (Interno)</label>
                      <span className="value">{demandaSelecionada.limite1 || '—'}</span>
                    </div>
                    <div className="drawer-meta-item">
                      <label>Prazo Final</label>
                      <div className="prazo-final-container" style={{ alignItems: 'flex-start' }}>
                        <span className="value" style={{ fontWeight: 600 }}>{prazoSemantics.data}</span>
                        {prazoSemantics.label && demandaSelecionada.status !== 'Encerrado' && (
                          <span className={`prazo-status-label ${prazoSemantics.classe}`} style={{ marginTop: '4px', display: 'inline-block' }}>
                            {prazoSemantics.label}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Seção 4: Situação */}
                <div className="drawer-section">
                  <h3>Situação Atual</h3>
                  <div className="drawer-meta-grid">
                    <div className="drawer-meta-item">
                      <label>Status</label>
                      <span 
                        className={`badge ${demandaSelecionada.status === 'Para Assinatura' ? 'assinatura' : demandaSelecionada.status === 'Encerrado' ? 'encerrado' : 'aguardando'}`} 
                        style={{ marginTop: '4px', fontSize: '0.725rem', padding: '4px 10px', display: 'inline-block', width: 'fit-content' }}
                      >
                        {demandaSelecionada.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Seção 5: Histórico de Movimentações */}
                <div className="drawer-section" style={{ borderBottom: 'none' }}>
                  <h3>Histórico de Comentários</h3>
                  {histFiltrado.length > 0 ? (
                    <div className="timeline-container" style={{ paddingLeft: '20px', marginLeft: '0px' }}>
                      {histFiltrado.map((h, idx) => {
                        let statusBadgeClass = 'badge aguardando';
                        if (h.status_novo === 'Para Assinatura') statusBadgeClass = 'badge assinatura';
                        else if (h.status_novo === 'Encerrado') statusBadgeClass = 'badge encerrado';
                        else if (h.status_novo === 'Tramitado') statusBadgeClass = 'badge tramitado';
                        else if (h.status_novo === 'Ajustar') statusBadgeClass = 'badge ajustar';
                        else if (h.status_novo === 'Sobrestado') statusBadgeClass = 'badge sobrestado';

                        return (
                          <div key={h.id} className={`timeline-item ${idx === 0 ? 'latest' : ''}`} style={{ marginBottom: '16px' }}>
                            <div className="timeline-circle"></div>
                            <div className="timeline-content" style={{ padding: '10px 14px' }}>
                              <div className="timeline-header" style={{ marginBottom: '4px' }}>
                                <span className="timeline-meta" style={{ fontSize: '0.7rem' }}>{h.data_hora}</span>
                                <span className={statusBadgeClass} style={{ fontSize: '0.6rem', padding: '1px 6px' }}>{h.status_novo}</span>
                              </div>
                              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)' }}>{h.setor || 'CTRH'}</div>
                              <div className="timeline-comment" style={{ fontSize: '0.75rem', marginTop: '4px' }}>{h.comentario}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.813rem', color: 'var(--text-muted)' }}>Nenhum log registrado.</span>
                  )}
                </div>
              </div>
              
              <div className="drawer-footer">
                {canEdit && (
                  <button 
                    type="button" 
                    className="btn btn-secondary-outline"
                    onClick={() => setModalStatusAberto(true)}
                    title="Alterar status do processo"
                  >
                    <i className="fa-solid fa-rotate-left"></i> Status
                  </button>
                )}
                {canEdit && (
                  <button 
                    type="button" 
                    className="btn btn-secondary-outline"
                    onClick={() => setModalEditarAberto(true)}
                    title="Editar informações do processo"
                  >
                    <i className="fa-solid fa-pen-to-square"></i> Editar
                  </button>
                )}
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    setDrawerAberto(false);
                    setDemandaSelecionada(null);
                  }}
                  title="Concluir leitura dos detalhes"
                >
                  <i className="fa-solid fa-check"></i> Fechar
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
