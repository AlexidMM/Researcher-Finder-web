import { Link } from 'react-router-dom';
import TagList from '../shared/TagList';

export default function AdminSidebar({ counts }) {
  return (
    <aside className="admin-sidebar" aria-label="Barra lateral del panel de administración">
      <div className="admin-sidebar-block">
        <h3>Acciones rápidas</h3>
        <div className="admin-sidebar-ctas">
          <a href="#admin-tabs" className="admin-sidebar-btn is-primary">Ir a gestión</a>
          <Link to="/blog" className="admin-sidebar-btn">Ver blog público</Link>
          <Link to="/profile" className="admin-sidebar-btn">Editar mi perfil</Link>
        </div>
      </div>

      <div className="admin-sidebar-block">
        <h3>Estado general</h3>
        <TagList
          items={[
            `Investigadores: ${counts.researchers}`,
            `Instituciones: ${counts.institutions}`,
            `Disciplinas: ${counts.disciplines}`,
            `Publicaciones activas: ${counts.publications}`,
            `Pendientes: ${counts.pending}`,
          ]}
        />
      </div>

      <div className="admin-sidebar-block">
        <h3>Información del sitio</h3>
        <nav className="admin-sidebar-links">
          <Link to="/about">Acerca de</Link>
          <Link to="/testimonials">Testimonios</Link>
          <Link to="/cookies">Aviso de cookies</Link>
        </nav>
      </div>
    </aside>
  );
}
