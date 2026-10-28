import { toast } from 'sonner';
import React, { useCallback, useEffect, useState } from 'react';
import type { ComentarioHistorico, Demanda, PerfilUsuario } from '../types';
import { getUserFacingError } from '../domain/userFacingErrors';
import { AdminProfileDialog } from './AdminProfileDialog';
import { AdminTrashPanel } from './AdminTrashPanel';
import { ResponsibleDistribution } from './ResponsibleDistribution';

export interface ServidorPerfil {
  id: string;
  nome: string;
  email: string;
  nivel: string;
  setor: string;
  status: string;
  nivelReal?: PerfilUsuario['nivel'];
  statusReal?: PerfilUsuario['status'];
}

interface AdminPanelProps {
  perfis?: PerfilUsuario[];
  demandas?: Demanda[];
  onUpdatePerfil?: (
    id: string,
    patch: Partial<Pick<PerfilUsuario, 'nivel' | 'status' | 'setor'>>,
  ) => Promise<boolean> | boolean;
}

export interface AccessIntegrityReport {
  ok: boolean;
  issues: string[];
  totalProfiles: number;
  activeProfiles: number;
  activeAdministrators: number;
}

const nivelLabel: Record<PerfilUsuario['nivel'], string> = {
  administrador: 'Administrador', editor: 'Editor', leitor: 'Leitor',
};

const statusLabel: Record<PerfilUsuario['status'], string> = {
  ativo: 'Ativo', pendente: 'Pendente', inativo: 'Inativo',
};

export function buildAccessBackup(servidores: ServidorPerfil[]) {
  return {
    sistema: 'Central de Demandas CTRH SME',
    escopo: 'perfis_e_niveis_de_acesso',
    backup_timestamp: new Date().toISOString(),
    usuarios_count: servidores.length,
    perfis: servidores.map(({ id, nome, email, nivel, setor, status }) => ({
      id, nome, email, nivel, setor, status,
    })),
  };
}

export function analyzeAccessIntegrity(servidores: ServidorPerfil[]): AccessIntegrityReport {
  const issues: string[] = [];
  const emailCounts = new Map<string, number>();
  const idCounts = new Map<string, number>();

  servidores.forEach((servidor) => {
    const email = servidor.email.trim().toLowerCase();
    emailCounts.set(email, (emailCounts.get(email) ?? 0) + 1);
    idCounts.set(servidor.id, (idCounts.get(servidor.id) ?? 0) + 1);

    if (!servidor.nome.trim()) {
      issues.push(`Perfil sem nome informado: ${servidor.email || 'e-mail não informado'}.`);
    }
    if (!email.endsWith('@rioeduca.net')) {
      issues.push(`E-mail fora do domínio institucional: ${servidor.email || '(vazio)'}.`);
    }
  });

  const duplicateEmails = Array.from(emailCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([email]) => email);
  const duplicateIds = Array.from(idCounts.values()).some((count) => count > 1);

  if (duplicateEmails.length > 0) {
    issues.push(`E-mails duplicados: ${duplicateEmails.join(', ')}.`);
  }
  if (duplicateIds) {
    issues.push('Foram encontrados perfis com identificadores duplicados.');
  }

  const activeProfiles = servidores.filter((servidor) => servidor.status === 'Ativo').length;
  const activeAdministrators = servidores.filter(
    (servidor) => servidor.status === 'Ativo' && servidor.nivel === 'Administrador',
  ).length;

  if (activeAdministrators === 0) {
    issues.push('Nenhum administrador ativo foi encontrado.');
  }

  return {
    ok: issues.length === 0,
    issues,
    totalProfiles: servidores.length,
    activeProfiles,
    activeAdministrators,
  };
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ perfis, demandas = [], onUpdatePerfil }) => {
  const isSupabase = perfis !== undefined;
  const [perfilEmEdicao, setPerfilEmEdicao] = useState<PerfilUsuario | null>(null);
  const [trashDemandas, setTrashDemandas] = useState<Demanda[]>([]);
  const [trashHistorico, setTrashHistorico] = useState<ComentarioHistorico[]>([]);
  const [trashLoading, setTrashLoading] = useState(false);
  const [trashError, setTrashError] = useState<string | null>(null);
  const servidores: ServidorPerfil[] = perfis?.map((perfil) => ({
    id: perfil.id,
    nome: perfil.nome || perfil.email,
    email: perfil.email,
    nivel: nivelLabel[perfil.nivel],
    setor: perfil.setor,
    status: statusLabel[perfil.status],
    nivelReal: perfil.nivel,
    statusReal: perfil.status,
  })) ?? [
    { id: '1', nome: 'Wilson Peixoto', email: 'wilson.peixoto@rioeduca.net', nivel: 'Administrador', setor: 'CTRH', status: 'Ativo' },
    { id: '2', nome: 'Erica Ramos', email: 'erica.ramos@rioeduca.net', nivel: 'Avançado', setor: 'E/CTRH', status: 'Ativo' },
    { id: '3', nome: 'Ricardo Silva', email: 'ricardo.silva@rioeduca.net', nivel: 'Básico', setor: 'CARH', status: 'Ativo' },
    { id: '4', nome: 'Servidor SME Teste', email: 'teste@rioeduca.net', nivel: 'Básico', setor: 'SME', status: 'Ativo' },
    { id: '5', nome: 'Mariana Costa', email: 'mariana.costa@rioeduca.net', nivel: 'Avançado', setor: 'E/CTRH', status: 'Pendente' },
  ];

  const loadTrash = useCallback(async () => {
    if (!isSupabase) return;
    setTrashLoading(true);
    setTrashError(null);
    try {
      const [{ createAppServices }, { resolveAppConfig }] = await Promise.all([
        import('../services/createAppServices'),
        import('../config/appConfig'),
      ]);
      const services = createAppServices(resolveAppConfig(import.meta.env));
      const [trash, current] = await Promise.all([
        services.demandas.loadTrash(),
        services.demandas.load(),
      ]);
      setTrashDemandas(trash);
      setTrashHistorico(current.historico);
    } catch (reason) {
      setTrashError(getUserFacingError(reason, 'Não foi possível carregar as demandas excluídas.'));
    } finally {
      setTrashLoading(false);
    }
  }, [isSupabase]);

  useEffect(() => {
    void loadTrash();
  }, [loadTrash]);

  const handleExportJSONBackup = () => {
    const backupData = buildAccessBackup(servidores);
    const dataStr = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `perfis_acesso_ctrh_sme_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleIntegrityCheck = () => {
    const report = analyzeAccessIntegrity(servidores);
    if (report.ok) {
      toast.success(
        `Verificação concluída: ${report.totalProfiles} perfis analisados, `
        + `${report.activeProfiles} ativos e ${report.activeAdministrators} administradores ativos.`,
      );
      return;
    }

    toast.error(
      `Verificação concluída com ${report.issues.length} inconsistência(s).`,
      { description: report.issues.join(' • '), duration: 7000 },
    );
  };

  return (
    <div className="admin-panel-container" style={{ animation: 'fadeIn 0.4s ease-out forwards' }}>
      <div className="dashboard-row" style={{ marginBottom: '25px' }}>
        <div className="dashboard-col-card">
          <h2>
            <i className="fa-solid fa-shield-halved" style={{ color: 'var(--accent-color)' }}></i>
            Segurança e integridade
          </h2>
          <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
            Cópia dos perfis cadastrados e verificação de consistência dos acessos ao sistema.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary-outline"
              onClick={handleExportJSONBackup}
              title="Exportar uma cópia dos perfis e níveis de acesso"
            >
              <i className="fa-solid fa-file-export"></i> Exportar cópia de segurança
            </button>
            <button
              type="button"
              className="btn btn-secondary-outline"
              onClick={handleIntegrityCheck}
              title="Verificar duplicidades, domínio institucional e administradores ativos"
            >
              <i className="fa-solid fa-stethoscope"></i> Verificar acessos
            </button>
          </div>
        </div>

        <div className="dashboard-col-card">
          <h2>
            <i className="fa-solid fa-gears" style={{ color: 'var(--accent-color)' }}></i>
            Parâmetros do sistema
          </h2>
          <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginBottom: '15px' }}>
            Regras de sessão, prazo de alerta e domínio institucional autorizado.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', background: 'var(--border-light)', padding: '6px 12px', borderRadius: '4px' }}>
              Domínio autorizado: <strong>@rioeduca.net</strong>
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-main)', background: 'var(--border-light)', padding: '6px 12px', borderRadius: '4px' }}>
              Alerta de prazo: <strong>7 dias</strong>
            </div>
          </div>
        </div>
      </div>

      <ResponsibleDistribution demandas={demandas} />

      {isSupabase && (
        <AdminTrashPanel
          demandas={trashDemandas}
          historico={trashHistorico}
          perfis={perfis}
          loading={trashLoading}
          error={trashError}
          onRetry={() => { void loadTrash(); }}
        />
      )}

      <div className="dashboard-col-card">
        <h2>
          <i className="fa-solid fa-user-gear" style={{ color: 'var(--accent-color)' }}></i>
          Perfis e níveis de acesso
        </h2>
        <p style={{ fontSize: '0.813rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          E-mails corporativos autorizados e respectivos níveis de acesso.
          {!isSupabase && <span className="demo-label">Demonstração</span>}
        </p>

        <div className="table-responsive" role="region" aria-label="Tabela de perfis e acessos" tabIndex={0}>
          <table className="demandas-table">
            <thead>
              <tr>
                <th style={{ width: '25%', textAlign: 'left' }}>Servidor</th>
                <th style={{ width: '30%', textAlign: 'left' }}>E-mail corporativo</th>
                <th style={{ width: '20%', textAlign: 'left' }}>Nível de acesso</th>
                <th style={{ width: '15%', textAlign: 'left' }}>Setor</th>
                <th style={{ width: '10%' }}>Status</th>
                {isSupabase && <th>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {servidores.map(serv => (
                <tr key={serv.id}>
                  <td style={{ textAlign: 'left', fontWeight: 600 }}>{serv.nome}</td>
                  <td style={{ textAlign: 'left' }}>{serv.email}</td>
                  <td style={{ textAlign: 'left' }}>
                    <span
                      className={`badge ${serv.nivel === 'Administrador' ? 'encerrado' : serv.nivel === 'Editor' || serv.nivel === 'Avançado' ? 'assinatura' : 'aguardando'}`}
                      style={{ fontSize: '0.7rem', fontWeight: 600, textTransform: 'none' }}
                    >
                      {serv.nivel}
                    </span>
                  </td>
                  <td style={{ textAlign: 'left', fontWeight: 500 }}>{serv.setor}</td>
                  <td>
                    <span
                      className={`badge ${serv.status === 'Ativo' ? 'tramitado' : 'ajustar'}`}
                      style={{ fontSize: '0.65rem', fontWeight: 700 }}
                    >
                      {serv.status}
                    </span>
                  </td>
                  {isSupabase && (
                    <td>
                      <button
                        type="button"
                        className={serv.statusReal === 'pendente' ? 'btn btn-primary' : 'btn btn-secondary-outline'}
                        onClick={() => {
                          const perfil = perfis?.find((item) => item.id === serv.id) ?? null;
                          setPerfilEmEdicao(perfil);
                        }}
                      >
                        Gerenciar acesso
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminProfileDialog
        perfil={perfilEmEdicao}
        onClose={() => setPerfilEmEdicao(null)}
        onSave={async (id, values) => (await onUpdatePerfil?.(id, values)) ?? false}
      />
    </div>
  );
};
