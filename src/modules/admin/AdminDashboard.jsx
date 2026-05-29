import Navbar from '../shared/Navbar';
import './admin.scss';

export default function AdminDashboard() {
  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Panel de Administrador@</h1>
          <p>Administra los investigadores, los estudiantes y a las publicaciones.</p>
        </header>

        <section className="actions-section">
          <button className="btn-create-post">
            + Crear Nuevo Insvestigador
          </button>
        </section>
      </main>
    </div>
  );
}