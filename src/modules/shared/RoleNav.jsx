import { useLocation, useNavigate } from 'react-router-dom';
import './role-nav.scss';

export default function RoleNav({ items }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="role-nav" aria-label="Navegación principal">
      {items.map((item) => {
        const isActive =
          item.match === 'exact'
            ? location.pathname === item.to
            : location.pathname.startsWith(item.to);

        return (
          <button
            key={item.to}
            type="button"
            className={`role-nav__link ${isActive ? 'is-active' : ''}`}
            onClick={() => navigate(item.to)}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
