import { useEffect, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  IconeCarteira,
  IconeFechar,
  IconeMenu,
  IconePessoas,
  IconeTotais,
  IconeTransacoes,
} from './icons';

/** Itens de navegação da barra lateral. */
const navItems = [
  { to: '/pessoas', rotulo: 'Pessoas', Icone: IconePessoas },
  { to: '/transacoes', rotulo: 'Transações', Icone: IconeTransacoes },
  { to: '/totais', rotulo: 'Totais', Icone: IconeTotais },
];

/**
 * Estrutura visual comum a todas as telas: barra lateral de navegação + área
 * de conteúdo. O <Outlet /> renderiza a página da rota ativa.
 */
export function Layout() {
  const [menuAberto, setMenuAberto] = useState(false);

  useEffect(() => {
    if (!menuAberto) return;

    function aoPressionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') setMenuAberto(false);
    }

    function aoRedimensionar() {
      if (window.innerWidth > 860) setMenuAberto(false);
    }

    document.body.classList.add('menu-mobile-aberto');
    window.addEventListener('keydown', aoPressionarTecla);
    window.addEventListener('resize', aoRedimensionar);

    return () => {
      document.body.classList.remove('menu-mobile-aberto');
      window.removeEventListener('keydown', aoPressionarTecla);
      window.removeEventListener('resize', aoRedimensionar);
    };
  }, [menuAberto]);

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <div className="app-shell">
      <header className="mobile-header">
        <div className="mobile-header__brand">
          <div className="mobile-header__logo">
            <IconeCarteira aria-hidden="true" />
          </div>
          <span>Controle de Gastos</span>
        </div>
        <button
          type="button"
          className="mobile-header__menu"
          aria-label="Abrir menu"
          aria-controls="menu-principal"
          aria-expanded={menuAberto}
          onClick={() => setMenuAberto(true)}
        >
          <IconeMenu aria-hidden="true" />
        </button>
      </header>

      {menuAberto && (
        <div className="sidebar-overlay" aria-hidden="true" onClick={fecharMenu} />
      )}

      <aside
        id="menu-principal"
        className={`sidebar${menuAberto ? ' sidebar--aberta' : ''}`}
        aria-label="Menu principal"
      >
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <IconeCarteira aria-hidden="true" />
          </div>
          <div>
            <div className="sidebar__title">Controle de Gastos</div>
            <div className="sidebar__subtitle">Residencial</div>
          </div>
          <button
            type="button"
            className="sidebar__fechar"
            aria-label="Fechar menu"
            onClick={fecharMenu}
          >
            <IconeFechar aria-hidden="true" />
          </button>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-label">Menu</div>
          {navItems.map(({ to, rotulo, Icone }) => (
            <NavLink key={to} to={to} className="sidebar__link" onClick={fecharMenu}>
              <Icone aria-hidden="true" />
              {rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__footer">
          Sistema de controle de gastos residenciais.
        </div>
      </aside>

      <div className="main">
        <Outlet />
      </div>
    </div>
  );
}
