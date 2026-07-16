import { NavLink, Outlet } from 'react-router-dom';
import { IconeCarteira, IconePessoas, IconeTotais, IconeTransacoes } from './icons';

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
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <div className="sidebar__logo">
            <IconeCarteira />
          </div>
          <div>
            <div className="sidebar__title">Controle de Gastos</div>
            <div className="sidebar__subtitle">Residencial</div>
          </div>
        </div>

        <nav className="sidebar__nav">
          <div className="sidebar__section-label">Menu</div>
          {navItems.map(({ to, rotulo, Icone }) => (
            <NavLink key={to} to={to} className="sidebar__link">
              <Icone />
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
