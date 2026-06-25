import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RoleNav from './RoleNav';

const NAV_BY_ROLE = {
  student: [
    { label: 'Inicio', to: '/student/dashboard', match: 'exact' },
    { label: 'Explorar', to: '/explore' },
    { label: 'Blog', to: '/blog' },
    { label: 'Búsqueda', to: '/student/search' },
  ],
  researcher: [
    { label: 'Inicio', to: '/researcher/dashboard', match: 'exact' },
    { label: 'Publicaciones', to: '/researcher/publications' },
    { label: 'Blog', to: '/blog' },
  ],
  admin: [
    { label: 'Resumen', to: '/admin/dashboard', match: 'exact' },
    { label: 'Investigadores', to: '/admin/researchers' },
    { label: 'Instituciones', to: '/admin/institutions' },
    { label: 'Disciplinas', to: '/admin/disciplines' },
  ],
};

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role;

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleLogoClick = () => {
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'researcher') navigate('/researcher/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  const roleNavItems = NAV_BY_ROLE[role] || [{ label: 'Blog', to: '/blog' }];

  return (
    <nav className="navbar">
      <div className="nav-left">
        <button className="logo-btn" type="button" onClick={handleLogoClick}>
          Researcher Finder
        </button>
        <RoleNav items={roleNavItems} />
      </div>

      <div className="nav-right">
        <div className="profile-container">
          <button
            type="button"
            className="nav-tab"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            Perfil ▾
          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <button type="button" className="dropdown-item" onClick={() => navigate('/profile')}>
                Perfil
              </button>
              <button type="button" className="dropdown-item" onClick={() => navigate('/about')}>
                Acerca de
              </button>
              <button type="button" className="dropdown-item logout" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
