import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ role, setRole }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDisciplinesOpen, setIsDisciplinesOpen] = useState(false);
  const navigate = useNavigate();

  // Lista de ejemplo para tus disciplinas
  const disciplinesList = [
    'Ciencias Exactas',
    'Ingeniería y Tecnología',
    'Ciencias Médicas',
    'Humanidades y Ciencias de la Conducta'
  ];

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo-box">RF Logo</div>
        <button className="nav-tab">Blog</button>
        
        {/* Si es usuario general, muestra el botón con menú desplegable */}
        {role === 'general' ? (
          <div className="dropdown-container">
            <button 
              className={`nav-tab dropdown-toggle ${isDisciplinesOpen ? 'active' : ''}`}
              onClick={() => setIsDisciplinesOpen(!isDisciplinesOpen)}
            >
              Disciplines ▾
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
        ) : (
          /* Si es investigador, solo muestra su pestaña fija de Profile */
          <button className="nav-tab active">Profile</button>
        )}
      </div>

      <div className="nav-right">
        {/* BOTÓN DE DESARROLLO: Para cambiar de pantalla fácilmente en tu entrega */}
        <button 
          className="dev-toggle-btn"
          onClick={() => {
            setRole(role === 'general' ? 'researcher' : 'general');
            setIsDisciplinesOpen(false); // Cierra el menú al cambiar de rol
          }}
        >
          Vista: {role === 'general' ? 'Usuario' : 'Investigador'}
        </button>

        <div className="profile-container">
          <button 
            className="profile-icon" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            👤
          </button>
          
          {isProfileOpen && (
            <div className="profile-dropdown">
              <button className="dropdown-item">Profile</button>
              <button className="dropdown-item logout" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;