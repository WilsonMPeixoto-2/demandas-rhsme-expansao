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
}> = [
  {
    area: 'visao-geral',
    text: 'Radar de Governança',
    compact: 'Radar',
  },
  {
    area: 'demandas',
    text: 'Todas as demandas',
    compact: 'Demandas',
  },
  {
    area: 'minhas-demandas',
    text: 'Minhas demandas',
    compact: 'Minhas',
  },
  {
    area: 'admin',
    text: 'Administração',
    compact: 'Admin',
  },
];

/** Reuses the approved geometry; only the sidebar color treatment changes. */
function BicolorFluxoSymbol() {
  return <BrandLogo variant="symbol" tone="bicolor" className="ct-bicolor-f-symbol" />;
}

/**
 * Família Iconográfica Linear Minimalista (Traço 1.75px em Branco com ponto de acento em Bronze no Radar).
 */
export function SidebarNavIcon({ area }: { area: SiteArea }) {
  switch (area) {
    case 'visao-geral':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="ct-nav-svg" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M12 3V4.8M12 19.2V21M3 12H4.8M19.2 12H21"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.65"
          />
          <polygon
            points="16.24 7.76 13.8 13.8 7.76 16.24 10.2 10.2 16.24 7.76"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polygon points="16.24 7.76 13.8 13.8 10.2 10.2 16.24 7.76" fill="#C69C6D" />
        </svg>
      );
    case 'demandas':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="ct-nav-svg" aria-hidden="true">
          <path
            d="M14 3.5H7C5.9 3.5 5 4.4 5 5.5V18.5C5 19.6 5.9 20.5 7 20.5H17C18.1 20.5 19 19.6 19 18.5V8.5L14 3.5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 3.5V8.5H19"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="8.5" y1="10.5" x2="11.5" y2="10.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="8.5" y1="13.8" x2="15.5" y2="13.8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <line x1="8.5" y1="17" x2="15.5" y2="17" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      );
    case 'minhas-demandas':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="ct-nav-svg" aria-hidden="true">
          <circle cx="12" cy="8" r="3.6" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M5.5 19.5C5.5 16.1 8.4 13.8 12 13.8C15.6 13.8 18.5 16.1 18.5 19.5H5.5Z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinejoin="round"
          />
        </svg>
      );
    case 'admin':
      return (
        <svg viewBox="0 0 24 24" fill="none" className="ct-nav-svg" aria-hidden="true">
          <circle cx="12" cy="12" r="2.8" stroke="currentColor" strokeWidth="1.75" />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
  }
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
    const focusFrame = requestAnimationFrame(() => mobileClose.current?.focus({ preventScroll: true }));

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
      ).filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden');
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
      cancelAnimationFrame(focusFrame);
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
        <button
          type="button"
          className="ct-mobile-menu-backdrop"
          aria-label="Fechar menu principal"
          tabIndex={-1}
          onClick={closeMobileMenu}
        />
      )}

      <aside
        id="ct-sidebar-navigation"
        ref={sidebarRef}
        className={`ct-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open ct-sidebar--open' : ''}`.trim()}
        aria-label="Navegação principal"
      >
        <div className="ct-sidebar-surface">
          <div className="ct-sidebar-header">
            <div className="ct-sidebar-brand">
              <div className="ct-brand-bicolor-lockup">
                <BicolorFluxoSymbol />
                {!collapsed && (
                  <div className="ct-brand-bicolor-copy">
                    <div className="ct-brand-serif-title">Fluxo CTRH</div>
                  </div>
                )}
              </div>
              {!collapsed && (
                <img
                  src="/design/prefeitura-rio-educacao-oficial.png"
                  alt="Prefeitura da Cidade do Rio de Janeiro — Educação"
                  className="ct-prefeitura-signature"
                  width={1490}
                  height={310}
                  decoding="async"
                />
              )}
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

          <nav className="ct-sidebar-nav" aria-label="Áreas do sistema">
            {areas.map(({ area, text, compact }) => {
              const active = area === activeArea;
              return (
                <button
                  key={area}
                  type="button"
                  className={`ct-nav-button ${active ? 'is-active is-current active' : ''}`.trim()}
                  aria-label={collapsed ? text : undefined}
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? text : undefined}
                  onClick={() => navigateTo(area)}
                >
                  <span className="ct-nav-icon" aria-hidden="true">
                    <SidebarNavIcon area={area} />
                  </span>
                  <span className="ct-nav-copy">
                    <span className="ct-nav-text">{text}</span>
                  </span>
                  <span className="ct-nav-compact-text" aria-hidden="true">{compact}</span>
                </button>
              );
            })}
          </nav>

          <div className="ct-sidebar-lapa-tonal" aria-hidden="true">
            <img src="/design/sidebar-arcos-lapa.webp" alt="" />
          </div>

          <div className="ct-sidebar-footer">
            {!collapsed && (
              <div className="ct-sector-footer-signature">
                <span className="ct-sector-bronze-bar" aria-hidden="true" />
                <span className="ct-sector-name">
                  CTRH • Coordenadoria Técnica de Recursos Humanos
                </span>
              </div>
            )}
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
      </aside>
    </>
  );
}
