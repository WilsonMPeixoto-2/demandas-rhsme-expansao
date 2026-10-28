import { useEffect, useRef, useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileTrigger = useRef<HTMLButtonElement>(null);
  const mobileClose = useRef<HTMLButtonElement>(null);
  const sidebarRef = useRef<HTMLElement>(null);
  const areas = AREAS.filter(({ area }) => area !== 'admin' || canAccessAdmin);
  const current = areas.find(({ area }) => area === activeArea) ?? areas[0];

  useEffect(() => {
    if (!mobileOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    mobileClose.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileOpen(false);
        mobileTrigger.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !sidebarRef.current) return;
      const elements = Array.from(sidebarRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])'));
      if (elements.length === 0) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia('(min-width: 941px)');
    const onDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileOpen(false);
    };
    media.addEventListener('change', onDesktop);
    return () => media.removeEventListener('change', onDesktop);
  }, []);

  const openMobileMenu = () => {
    setCollapsed(false);
    setMobileOpen(true);
  };

  const closeMobileMenu = () => {
    setMobileOpen(false);
    mobileTrigger.current?.focus();
  };

  const navigateTo = (area: SiteArea) => {
    setMobileOpen(false);
    onNavigate(area);
  };

  return (
    <>
      <div className="ct-mobile-menu-bar">
        <button ref={mobileTrigger} type="button" className="ct-mobile-menu-trigger"
          aria-label="Abrir menu principal" aria-expanded={mobileOpen} aria-controls="ct-sidebar-navigation"
          onClick={openMobileMenu}>
          <i className="fa-solid fa-bars" aria-hidden="true" />
          <span>Menu</span>
        </button>
        <span className="ct-mobile-menu-context">
          <BrandLogo variant="symbol" />
          <strong>{current.compact}</strong>
        </span>
      </div>

      {mobileOpen && (
        <button type="button" className="ct-mobile-menu-backdrop"
          aria-label="Fechar menu principal" onClick={closeMobileMenu} />
      )}

      <aside id="ct-sidebar-navigation" ref={sidebarRef}
        className={`ct-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'ct-sidebar--open' : ''}`}
        aria-label="Navegação institucional">
        <div className="ct-sidebar-surface">
          <div className="ct-sidebar-brand">
            <BrandLogo variant={collapsed ? 'symbol' : 'compact'} tone="inverse" />
            <button type="button" ref={mobileClose} className="ct-mobile-sidebar-close"
              aria-label="Fechar menu lateral" onClick={closeMobileMenu}>
              <i className="fa-solid fa-xmark" aria-hidden="true" />
            </button>
            <span className="ct-sidebar-brand-rule" aria-hidden="true" />
          </div>
          <div className="ct-sidebar-section-label">{collapsed ? '•••' : 'ESPAÇO DE TRABALHO'}</div>
          <nav className={`ct-sidebar-nav ct-sidebar-nav--${areas.length}`} aria-label="Áreas do sistema">
            {areas.map(({ area, text, icon, description }) => (
              <button key={area} type="button"
                className={`ct-nav-button ${activeArea === area ? 'is-current active' : ''}`}
                aria-current={activeArea === area ? 'page' : undefined}
                aria-label={collapsed ? text : undefined}
                title={description}
                onClick={() => navigateTo(area)}>
                <span className="ct-nav-icon" aria-hidden="true"><i className={`fa-solid ${icon}`} /></span>
                <span className="ct-nav-button-content"><strong>{text}</strong>
                  <small aria-hidden="true">{description}</small></span>
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
    </>
  );
}
