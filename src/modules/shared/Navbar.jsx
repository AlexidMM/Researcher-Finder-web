import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  // Leer sesión real
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role; // 'student', 'researcher' o 'admin'

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Saber a dónde mandar al usuario al dar clic en el Logo/Nombre
  const handleLogoClick = () => {
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'researcher') navigate('/researcher/dashboard');
    else if (role === 'admin') navigate('/admin/dashboard');
    else navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Nombre de la Empresa / Botón principal */}
        <button className="logo-btn" onClick={handleLogoClick}>
          Researcher Finder
        </button>
        
        <button className="nav-tab" onClick={() => navigate('/blog')}>
          Blog
        </button>
        
        {/* Pestaña de Explorar exclusiva para Estudiantes */}
        {role === 'student' && (
          <button className="nav-tab" onClick={() => navigate('/explore')}>
            Explorar
          </button>
        )}
      </div>

      <div className="nav-right">
        <div className="profile-container">
          {/* Usamos nav-tab para que sea texto puro y herede el diseño correcto */}
          <button 
            className="nav-tab" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            Perfil ▾
          </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item" onClick={() => navigate('/profile')}>
                Perfil
              </button>
              <button className="dropdown-item logout" onClick={handleLogout}>
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}