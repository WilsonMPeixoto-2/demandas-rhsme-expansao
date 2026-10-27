import type { CSSProperties } from 'react';
import type { Demanda } from '../types';
import type { DemandFilters } from '../filters/filterTypes';
import { getWorkBucket } from '../domain/workSemantics';

interface GovernanceOverviewProps {
  demandas: Demanda[];
  onFilterStatus: (status: DemandFilters['status']) => void;
}

const OPERATIONAL_GROUPS = [
  {
    bucket: 'providencia_ctrh',
    filter: 'providencia_ctrh',
    label: 'Providência do CTRH',
    shortLabel: 'Providência interna',
    description: 'Demandas que exigem atuação da equipe.',
    icon: 'fa-list-check',
    className: 'action',
    color: '#67B4EC',
  },
  {
    bucket: 'aguardando_retorno',
    filter: 'Tramitado',
    label: 'Aguardando retorno',
    shortLabel: 'Retorno externo',
    description: 'Demandas tramitadas em espera de resposta.',
    icon: 'fa-paper-plane',
    className: 'waiting',
    color: '#AF9CF5',
  },
  {
    bucket: 'monitoramento',
    filter: 'Sobrestado',
    label: 'Em monitoramento',
    shortLabel: 'Monitoramento',
    description: 'Demandas sobrestadas em acompanhamento.',
    icon: 'fa-eye',
    className: 'monitoring',
    color: '#F2C37A',
  },
  {
    bucket: 'encerrada',
    filter: 'Encerrado',
    label: 'Encerradas',
    shortLabel: 'Encerradas',
    description: 'Registros concluídos que permanecem no acervo.',
    icon: 'fa-circle-check',
    className: 'closed',
    color: '#95A9BD',
  },
] as const;

export function GovernanceOverview({ demandas, onFilterStatus }: GovernanceOverviewProps) {
  const total = demandas.length;
  const groups = OPERATIONAL_GROUPS.map((group) => ({
    ...group,
    count: demandas.filter((demanda) => getWorkBucket(demanda.status) === group.bucket).length,
  }));

  let cumulative = 0;
  const slices = groups.map((group) => {
    const start = cumulative;
    cumulative += total > 0 ? (group.count / total) * 100 : 0;
    return `${group.color} ${start.toFixed(3)}% ${cumulative.toFixed(3)}%`;
  });
  const donutStyle: CSSProperties = total > 0
    ? { backgroundImage: `conic-gradient(${slices.join(', ')})` }
    : { backgroundColor: '#7990A8' };

  return (
    <section className="governance-overview" aria-labelledby="governance-overview-title">
      <div className="governance-overview-heading">
        <div className="governance-overview-copy">
          <span className="governance-overview-eyebrow">
            <i className="fa-solid fa-chart-pie" aria-hidden="true" /> Panorama operacional
          </span>
          <h2 id="governance-overview-title">O trabalho da equipe, em uma visão.</h2>
          <p>Da providência interna ao encerramento: explore cada grupo para consultar seus processos.</p>
        </div>
        <button type="button" className="governance-overview-all"
          onClick={() => onFilterStatus('todos')}>
          Ver carteira completa <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
        </button>
      </div>

      <div className="governance-overview-body">
        <div className="governance-donut-area">
          <div
            className="governance-donut"
            role="img"
            style={donutStyle}
            aria-label={`Distribuição de ${total} demandas: ${groups.map((group) => `${group.label}, ${group.count}`).join('; ')}`}
          >
            <div className="governance-donut-center" aria-hidden="true">
              <span className="governance-donut-number">{total.toLocaleString('pt-BR')}</span>
              <span className="governance-donut-caption">demandas no acervo</span>
            </div>
          </div>
          <p className="governance-donut-footnote">Composição do estoque, não medida de produtividade.</p>
        </div>

        <div className="governance-work-grid">
          {groups.map((group) => (
            <button key={group.bucket} type="button"
              className={`governance-work-card governance-work-card--${group.className}`}
              onClick={() => onFilterStatus(group.filter)}>
              <span className="governance-work-card-top">
                <span className="governance-work-icon" aria-hidden="true">
                  <i className={`fa-solid ${group.icon}`} />
                </span>
                <i className="fa-solid fa-arrow-up-right-from-square governance-work-arrow" aria-hidden="true" />
              </span>
              <span className="governance-work-number">{group.count.toLocaleString('pt-BR')}</span>
              <strong>{group.label}</strong>
              <span className="governance-work-caption">{group.description}</span>
              <span className="governance-work-stroke" aria-hidden="true" />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
