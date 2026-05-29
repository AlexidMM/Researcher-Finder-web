import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDisciplinesOpen, setIsDisciplinesOpen] = useState(false);
  const navigate = useNavigate();

  // Leer sesión real
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role; // 'student' o 'researcher'

  const disciplinesList = ['STEM', 'Biología', 'Ciencias de la Salud', 'Humanidades'];

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Saber a dónde mandar al usuario al dar clic en el Logo/Nombre
  const handleLogoClick = () => {
    if (role === 'student') navigate('/student/dashboard');
    else if (role === 'researcher') navigate('/researcher/dashboard');
    else navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        {/* Nombre de la Empresa / Botón principal */}
        <button className="logo-btn" onClick={handleLogoClick}>
          Researcher Finder
        </button>
        
        <button className="nav-tab" onClick={() => navigate('/blog')}>Blog</button>
        {/* Pestaña de Disciplinas exclusiva para Estudiantes */}
        {role === 'student' && (
          <div className="dropdown-container">
            <button 
              className={`nav-tab dropdown-toggle ${isDisciplinesOpen ? 'active' : ''}`}
              onClick={() => setIsDisciplinesOpen(!isDisciplinesOpen)}
            >
              Disciplinas ▾
            </button>
            
            {isDisciplinesOpen && (
              <div className="custom-dropdown">
                {disciplinesList.map((discipline, index) => (
                  <button key={index} className="dropdown-item-menu">
                    {discipline}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="nav-right">
        <div className="profile-container">
          <button 
            className="profile-icon-btn" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            👤
          </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item" onClick={() => navigate('/profile')}>
                Perfil
              </button>
              
              {/* Opción exclusiva para Investigadores */}
              {role === 'researcher' && (
                <button className="dropdown-item" onClick={() => navigate('/researcher/posts')}>
                  Posts
                </button>
              )}
              
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