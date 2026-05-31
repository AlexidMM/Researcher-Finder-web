import { Link } from 'react-router-dom';
import './footer.scss';

export default function Footer() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const role = user?.role;

  const links = role === 'student'
    ? [
        { label: 'Dashboard', to: '/student/dashboard' },
        { label: 'Explorar', to: '/explore' },
        { label: 'Blog', to: '/blog' },
        { label: 'Perfil', to: '/profile' },
      ]
    : role === 'researcher'
      ? [
          { label: 'Dashboard', to: '/researcher/dashboard' },
          { label: 'Blog', to: '/blog' },
          { label: 'Perfil', to: '/profile' },
        ]
      : role === 'admin'
        ? [
            { label: 'Dashboard', to: '/admin/dashboard' },
            { label: 'Blog', to: '/blog' },
            { label: 'Perfil', to: '/profile' },
          ]
        : [
            { label: 'Iniciar sesión', to: '/' },
            { label: 'Registrarse', to: '/register' },
            { label: 'Blog', to: '/blog' },
          ];

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <span className="footer-brand-name">Researcher Finder</span>
          <p>Conectando estudiantes, investigadores e instituciones con oportunidades reales.</p>
        </div>

        <div className="footer-links-group">
          <h4>Navegación</h4>
          <nav className="footer-links" aria-label="Enlaces de pie de página">
            {links.map((link) => (
              <Link key={link.to} to={link.to} className="footer-link">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="footer-meta">
          <h4>Contacto</h4>
          <p>Proyecto académico UTEQ</p>
          <p>Disponible para navegación interna y gestión de oportunidades</p>
          <nav className="footer-links" aria-label="Información del sitio">
            <Link to="/about" className="footer-link">Acerca de</Link>
            <Link to="/testimonials" className="footer-link">Testimonios</Link>
            <Link to="/cookies" className="footer-link">Aviso de cookies</Link>
          </nav>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© {new Date().getFullYear()} Researcher Finder</span>
        <span>Hecho para explorar, colaborar y publicar.</span>
      </div>
    </footer>
  );
}