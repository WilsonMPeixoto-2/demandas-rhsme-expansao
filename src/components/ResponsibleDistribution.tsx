import type { Demanda, DemandStatus } from '../types';
import { GOVERNANCE_STATUS_ORDER, getResponsibleDistribution, type ResponsibleDistributionItem } from '../domain/governanceAnalytics';

const STATUS_CLASS: Record<DemandStatus, string> = {
  'Aguardando Andamento': 'aguardando',
  Tramitado: 'tramitado',
  'Para Assinatura': 'assinatura',
  Ajustar: 'ajustar',
  Sobrestado: 'sobrestado',
  Encerrado: 'encerrado',
};

const percentage = (count: number, total: number) => total > 0 ? Math.round((count / total) * 100) : 0;

function ResponsibleRow({ item }: { item: ResponsibleDistributionItem }) {
  return (
    <div className="responsible-row">
      <div className="responsible-identity">
        <div className={`responsible-avatar ${item.vinculo !== 'oficial' ? 'pending' : ''}`} aria-hidden="true">
          {item.nome === 'Sem responsável'
            ? <i className="fa-solid fa-user-slash" />
            : item.nome.split(/\s+/).slice(0, 2).map((part) => part[0]).join('').toUpperCase()}
        </div>
        <div className="responsible-copy">
          <strong>{item.nome}</strong>
          {item.vinculo === 'legado_pendente' && <span className="legacy-link-badge">Responsável não vinculado</span>}
          {item.vinculo === 'nao_atribuido' && <span className="unassigned-badge">Não atribuído</span>}
        </div>
      </div>

      <div className="responsible-volume">
        <strong>{item.total}</strong>
        <span>{item.total === 1 ? 'demanda' : 'demandas'}</span>
      </div>

      <div
        className="responsible-status-bar"
        role="img"
        aria-label={`${item.nome}: ${item.total} demandas distribuídas por status`}
      >
        {GOVERNANCE_STATUS_ORDER.map((status) => {
          const count = item.status[status];
          if (count === 0) return null;
          return (
            <span
              key={status}
              className={`responsible-status-segment ${STATUS_CLASS[status]}`}
              style={{ width: `${percentage(count, item.total)}%` }}
              title={`${status}: ${count}`}
            />
          );
        })}
      </div>
    </div>
  );
}


export function ResponsibleDistribution({ demandas }: { demandas: Demanda[] }) {
  const responsaveis = getResponsibleDistribution(demandas);
  return (
    <section className="governance-section" aria-labelledby="responsible-title">
        <div className="governance-section-heading">
          <div>
            <span className="governance-kicker">Distribuição da carteira</span>
            <h2 id="responsible-title">Distribuição por responsável</h2>
          </div>
        </div>

        <article className="governance-card responsible-distribution-card">
          <div className="responsible-legend" aria-label="Legenda dos status">
            {GOVERNANCE_STATUS_ORDER.map((status) => (
              <span key={status}><i className={`legend-dot status-${STATUS_CLASS[status]}`} />{status}</span>
            ))}
          </div>
          <div className="responsible-list">
            {responsaveis.length > 0
              ? responsaveis.map((item) => <ResponsibleRow key={item.key} item={item} />)
              : <div className="governance-empty">Nenhum responsável disponível.</div>}
          </div>
        </article>
      </section>
  );
}
