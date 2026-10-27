import { useState } from 'react';
import { BrandLogo } from './BrandLogo';

export type SiteArea = 'visao-geral' | 'demandas' | 'minhas-demandas' | 'admin';

interface SiteNavigationProps {
  activeArea: SiteArea;
  canAccessAdmin: boolean;
  onNavigate: (area: SiteArea) => void;
}

const AREAS: ReadonlyArray<{ area: SiteArea; text: string; compact: string; icon: string; description: string }> = [
  { area: 'visao-geral', text: 'Radar de Governança', compact: 'Radar', icon: 'fa-chart-pie',
    description: 'Panorama operacional e análises de gestão' },
  { area: 'demandas', text: 'Todas as demandas', compact: 'Demandas', icon: 'fa-list-check',
    description: 'Carteira completa e filtros' },
  { area: 'minhas-demandas', text: 'Minhas demandas', compact: 'Minhas', icon: 'fa-folder-open',
    description: 'Carteira pessoal de acompanhamento' },
  { area: 'admin', text: 'Administração', compact: 'Admin', icon: 'fa-sliders',
    description: 'Acessos e análises administrativas' },
];

export function SiteNavigation({ activeArea, canAccessAdmin, onNavigate }: SiteNavigationProps) {
  const [collapsed, setCollapsed] = useState(false);
  const areas = AREAS.filter(({ area }) => area !== 'admin' || canAccessAdmin);

  return (
    <aside className={`ct-sidebar ${collapsed ? 'is-collapsed' : ''}`} aria-label="Navegação institucional">
      <div className="ct-sidebar-surface">
        <div className="ct-sidebar-brand">
          <BrandLogo variant={collapsed ? 'symbol' : 'compact'} tone="inverse" />
          <span className="ct-sidebar-brand-rule" aria-hidden="true" />
        </div>
        <div className="ct-sidebar-section-label">{collapsed ? '•••' : 'ESPAÇO DE TRABALHO'}</div>
        <nav className={`ct-sidebar-nav ct-sidebar-nav--${areas.length}`} aria-label="Áreas do sistema">
          {areas.map(({ area, text, compact, icon, description }) => (
            <button
              key={area}
              type="button"
              className={`ct-nav-button ${activeArea === area ? 'is-current active' : ''}`}
              aria-current={activeArea === area ? 'page' : undefined}
              aria-label={collapsed ? text : undefined}
              title={description}
              onClick={() => onNavigate(area)}
            >
              <span className="ct-nav-icon" aria-hidden="true"><i className={`fa-solid ${icon}`} /></span>
              <span className="ct-nav-button-content"><strong>{text}</strong><small aria-hidden="true">{description}</small></span>
              <span className="ct-nav-mobile-label" aria-hidden="true">{compact}</span>
              <i className="fa-solid fa-chevron-right ct-nav-chevron" aria-hidden="true" />
            </button>
          ))}
        </nav>
        <div className="ct-sidebar-bottom">
          {!collapsed && <div className="ct-sidebar-caption">
            <span className="ct-sidebar-caption-icon" aria-hidden="true"><i className="fa-solid fa-building-columns" /></span>
            <span>Gestão institucional de processos e pessoas</span>
          </div>}
          <button type="button" className="ct-sidebar-toggle"
            aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed((value) => !value)}>
            <i className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`} aria-hidden="true" />
            {!collapsed && <span>Recolher menu</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
