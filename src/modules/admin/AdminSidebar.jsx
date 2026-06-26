import { Link } from "react-router-dom";
import TagList from "../shared/TagList";

// Le ponemos counts = {} por defecto
export default function AdminSidebar({ counts = {} }) {
  return (
    <aside
      className="admin-sidebar"
      aria-label="Barra lateral del panel de administración"
    >
      <div className="admin-sidebar-block">
        <h3>Acciones rápidas</h3>
        <div className="admin-sidebar-ctas">
          <Link
            to="/admin/researchers"
            className="admin-sidebar-btn is-primary"
          >
            Investigadores
          </Link>
          <Link to="/admin/institutions" className="admin-sidebar-btn">
            Instituciones
          </Link>
          <Link to="/admin/disciplines" className="admin-sidebar-btn">
            Disciplinas
          </Link>
          <Link to="/blog" className="admin-sidebar-btn">
            Ver blog público
          </Link>
        </div>
      </div>

      <div className="admin-sidebar-block">
        <h3>Estado general</h3>
        <TagList
          items={[
            // Agregamos un || 0 para que ponga un cero si no encuentra el número
            `Investigadores: ${counts.researchers || 0}`,
            `Instituciones: ${counts.institutions || 0}`,
            `Disciplinas: ${counts.disciplines || 0}`,
            `Publicaciones activas: ${counts.publications || 0}`,
            `Pendientes: ${counts.pending || 0}`,
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
