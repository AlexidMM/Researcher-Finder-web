import { useState } from 'react';
import Navbar from './Navbar';

function Dashboard() {
  // Usamos un estado para que puedas alternar dinámicamente entre 'general' y 'researcher'
  const [userRole, setUserRole] = useState('general'); 

  return (
    <div className="dashboard-container">
      {/* Le pasamos el rol y la función para cambiarlo al Navbar */}
      <Navbar role={userRole} setRole={setUserRole} />
      
      <main className="dashboard-main">
        {userRole === 'general' ? (
          /* PANTALLA DE USUARIO GENERAL */
          <>
            <h1 className="title">Researcher Finder</h1>
            
            <div className="search-wrapper">
              <input 
                type="text" 
                className="search-bar" 
                placeholder="Search by name, area, or ID..." 
              />
              <button className="search-btn">🔍</button>
            </div>

            <p className="subtitle">
              Find the best researcher in the world to help you in your investigation or contact them to have an internship.
            </p>
          </>
        ) : (
          /* PANTALLA DE INVESTIGADOR (DASHBOARD) */
          <>
            <h1 className="title">Researcher Dashboard</h1>
            <div className="researcher-card">
              <h2>Panel de Control Académico</h2>
              <p>Gestiona tus publicaciones científicas y consulta el estado de sincronización de tu dispositivo inteligente.</p>
              <div className="action-buttons" style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <button className="btn-primary">Nueva Publicación</button>
                <button className="btn-secondary">Ver Mis Artículos</button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default Dashboard;