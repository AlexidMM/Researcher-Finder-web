import Navbar from '../shared/Navbar';
import './researcher.scss';

export default function ResearcherDashboard() {
  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Panel de Investigador</h1>
          <p>Administra tus publicaciones, vacantes de estancias o proyectos de investigación.</p>
        </header>

        <section className="actions-section">
          <button className="btn-create-post">
            + Crear Nueva Publicación
          </button>
        </section>

        <section className="my-posts-section">
          <div className="placeholder-card">
            <h3>Tus Publicaciones</h3>
            <p>Aún no tienes publicaciones activas visibles para los alumnos.</p>
          </div>
        </section>
      </main>
    </div>
  );
}