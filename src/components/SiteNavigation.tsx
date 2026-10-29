import { useEffect, useRef, useState } from 'react';
import { BrandLogo } from './BrandLogo';

export type SiteArea = 'visao-geral' | 'demandas' | 'minhas-demandas' | 'admin';

interface SiteNavigationProps {
  activeArea: SiteArea;
  canAccessAdmin: boolean;
  onNavigate: (area: SiteArea) => void;
}

const AREAS: ReadonlyArray<{
  area: SiteArea;
  text: string;
  compact: string;
  description: string;
}> = [
  {
    area: 'visao-geral',
    text: 'Radar de Governança',
    compact: 'Radar',
    description: 'Panorama operacional e análises de gestão',
  },
  {
    area: 'demandas',
    text: 'Todas as demandas',
    compact: 'Demandas',
    description: 'Carteira completa e filtros',
  },
  {
    area: 'minhas-demandas',
    text: 'Minhas demandas',
    compact: 'Minhas',
    description: 'Carteira pessoal de acompanhamento',
  },
  {
    area: 'admin',
    text: 'Administração',
    compact: 'Admin',
    description: 'Acessos e análises administrativas',
  },
];

export function SidebarNavIcon({ area }: { area: SiteArea }) {
  switch (area) {
    case 'visao-geral':
      return (
        <svg
          viewBox="0 0 256 256"
          fill="none"
          className="ct-nav-svg ct-nav-svg--visao-geral"
          aria-hidden="true"
        >
          <path
            className="duotone-layer"
            d="M128,32a96,96,0,1,0,96,96A96,96,0,0,0,128,32Zm17,113-63,29,29-63,63-29Z"
            fill="currentColor"
          />
          <circle
            cx="128"
            cy="128"
            r="96"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="17"
          />
          <polygon
            points="174 82 111 111 82 174 145 145 174 82"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="17"
          />
        </svg>
      );
    case 'demandas':
      return (
        <svg
          viewBox="0 0 256 256"
          fill="none"
          className="ct-nav-svg ct-nav-svg--demandas"
          aria-hidden="true"
        >
          <rect
            className="duotone-layer"
            x="40"
            y="40"
            width="176"
            height="176"
            rx="16"
            fill="currentColor"
          />
          <rect
            x="40"
            y="40"
            width="176"
            height="176"
            rx="16"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="17"
          />
          <line x1="88" y1="96" x2="168" y2="96" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <line x1="88" y1="136" x2="168" y2="136" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <line x1="88" y1="176" x2="132" y2="176" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
        </svg>
      );
    case 'minhas-demandas':
      return (
        <svg
          viewBox="0 0 256 256"
          fill="none"
          className="ct-nav-svg ct-nav-svg--minhas-demandas"
          aria-hidden="true"
        >
          <path
            className="duotone-layer"
            d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Z"
            fill="currentColor"
          />
          <path
            d="M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V88A16,16,0,0,0,216,72Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="17"
          />
          <path d="M104,144h48" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
        </svg>
      );
    case 'admin':
      return (
        <svg
          viewBox="0 0 256 256"
          fill="none"
          className="ct-nav-svg ct-nav-svg--admin"
          aria-hidden="true"
        >
          <circle className="duotone-layer" cx="104" cy="84" r="24" fill="currentColor" />
          <circle className="duotone-layer" cx="168" cy="172" r="24" fill="currentColor" />
          <line x1="128" y1="84" x2="216" y2="84" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <line x1="40" y1="84" x2="80" y2="84" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <circle cx="104" cy="84" r="24" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <line x1="192" y1="172" x2="216" y2="172" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <line x1="40" y1="172" x2="144" y2="172" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
          <circle cx="168" cy="172" r="24" stroke="currentColor" strokeLinecap="round" strokeWidth="17" />
        </svg>
      );
  }
}

export function ArcosDaLapaWatermark() {
  return (
    <div className="ct-sidebar-lapa-watermark" aria-hidden="true">
      <svg viewBox="0 0 260 156" fill="none" preserveAspectRatio="xMidYMax slice">
        <path d="M-6 28L266 62V156H-6V28Z" fill="currentColor" fillOpacity="0.12" />
        <path
          d="M18 90V56C18 42 54 45 54 60V93H18ZM68 95V62C68 48 102 51 102 65V98H68ZM116 99V68C116 55 148 58 148 71V102H116ZM162 103V73C162 61 192 64 192 76V106H162ZM206 107V78C206 67 234 70 234 81V110H206Z"
          fill="#071829"
          fillOpacity="0.58"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path
          d="M18 156V118C18 102 54 105 54 121V156H18ZM68 156V122C68 107 102 110 102 125V156H68ZM116 156V126C116 112 148 115 148 129V156H116ZM162 156V130C162 117 192 120 192 133V156H162ZM206 156V134C206 122 234 125 234 137V156H206Z"
          fill="#071829"
          fillOpacity="0.65"
          stroke="currentColor"
          strokeWidth="1.2"
        />
        <path d="M-6 24L266 58M-6 29L266 63M-6 90L266 113" stroke="currentColor" strokeWidth="1.15" />
      </svg>
    </div>
  );
}

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
      const elements = Array.from(
        sidebarRef.current.querySelectorAll<HTMLButtonElement>('button:not([disabled])')
      );
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
    if (!window.matchMedia) return;
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
      <div className="ct-mobile-bar ct-mobile-menu-bar" role="region" aria-label="Navegação móvel">
        <button
          ref={mobileTrigger}
          type="button"
          className="ct-mobile-trigger ct-mobile-menu-trigger"
          aria-label="Abrir menu principal"
          aria-expanded={mobileOpen}
          aria-controls="ct-sidebar-navigation"
          onClick={openMobileMenu}
        >
          <i className="fa-solid fa-bars" aria-hidden="true" />
          <span>Menu</span>
        </button>

        <div className="ct-mobile-brand">
          <BrandLogo variant="symbol" showEndorsement={false} />
        </div>

        <div className="ct-mobile-current">
          <span className="ct-mobile-current-tag">{current.compact}</span>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="ct-sidebar-backdrop ct-mobile-menu-backdrop"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      <aside
        id="ct-sidebar-navigation"
        ref={sidebarRef}
        className={`ct-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open ct-sidebar--open' : ''}`.trim()}
        aria-label="Navegação principal"
      >
        <div id="ct-sidebar-drawer" style={{ display: 'contents' }}>
          <div className="ct-sidebar-surface">
            <div className="ct-sidebar-header">
              <div className="ct-sidebar-brand">
                <BrandLogo
                  variant={collapsed ? 'symbol' : 'full'}
                  tone="inverse"
                  showEndorsement={!collapsed}
                />
              </div>

              <button
                ref={mobileClose}
                type="button"
                className="ct-sidebar-mobile-close ct-mobile-sidebar-close"
                aria-label="Fechar menu lateral"
                onClick={closeMobileMenu}
              >
                <i className="fa-solid fa-xmark" aria-hidden="true" />
              </button>
            </div>

            <div className="ct-sidebar-brand-rule" aria-hidden="true" />

            <nav className="ct-sidebar-nav" aria-label="Áreas do sistema">
              <div className="ct-sidebar-section-label">
                {collapsed ? 'NAV' : 'ESPAÇO DE TRABALHO'}
              </div>

              {areas.map(({ area, text, compact, description }) => {
                const active = area === activeArea;
                return (
                  <button
                    key={area}
                    type="button"
                    className={`ct-nav-button ${active ? 'is-active is-current active' : ''}`.trim()}
                    aria-current={active ? 'page' : undefined}
                    aria-label={collapsed ? text : undefined}
                    title={description}
                    onClick={() => navigateTo(area)}
                  >
                    <span className="ct-nav-icon" aria-hidden="true">
                      <SidebarNavIcon area={area} />
                    </span>
                    <span className="ct-nav-copy">
                      <span className="ct-nav-text">{text}</span>
                      <span className="ct-nav-description" aria-hidden="true">{description}</span>
                    </span>
                    <span className="ct-nav-compact-text" aria-hidden="true">{compact}</span>
                  </button>
                );
              })}
            </nav>

            <ArcosDaLapaWatermark />

            <div className="ct-sidebar-footer">
              <div className="ct-sidebar-brand-rule" aria-hidden="true" />
              <div className="ct-sidebar-caption">
                <span className="ct-sidebar-caption-icon" aria-hidden="true">
                  <svg viewBox="0 0 256 256" fill="none" className="ct-footer-svg">
                    <polygon points="24 96 232 96 128 32 24 96" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="18" />
                    <line x1="56" y1="96" x2="56" y2="176" stroke="currentColor" strokeLinecap="round" strokeWidth="18" />
                    <line x1="104" y1="96" x2="104" y2="176" stroke="currentColor" strokeLinecap="round" strokeWidth="18" />
                    <line x1="152" y1="96" x2="152" y2="176" stroke="currentColor" strokeLinecap="round" strokeWidth="18" />
                    <line x1="200" y1="96" x2="200" y2="176" stroke="currentColor" strokeLinecap="round" strokeWidth="18" />
                    <line x1="32" y1="176" x2="224" y2="176" stroke="currentColor" strokeLinecap="round" strokeWidth="18" />
                    <line x1="16" y1="208" x2="240" y2="208" stroke="currentColor" strokeLinecap="round" strokeWidth="18" />
                  </svg>
                </span>
                {!collapsed && (
                  <span className="ct-sidebar-caption-text">
                    Prefeitura da Cidade do Rio de Janeiro
                  </span>
                )}
              </div>

              <button
                type="button"
                className="ct-sidebar-toggle"
                aria-label={collapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
                aria-expanded={!collapsed}
                onClick={() => setCollapsed(!collapsed)}
              >
                <i
                  className={`fa-solid ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`}
                  aria-hidden="true"
                />
                {!collapsed && <span>Recolher menu</span>}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
