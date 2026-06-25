import Navbar from './Navbar';
import Footer from './Footer';
import './page-shell.scss';

export default function PageShell({
  children,
  wide = false,
  sidebar = null,
  breadcrumb = null,
}) {
  const mainClass = [
    'page-shell__main',
    wide ? 'page-shell__main--wide' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const bodyClass = [
    'page-shell__body',
    sidebar ? 'page-shell__body--with-sidebar' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="page-shell">
      <Navbar />
      <main className={mainClass}>
        {breadcrumb && (
          <nav className="page-breadcrumb" aria-label="Ruta">
            {breadcrumb}
          </nav>
        )}
        <div className={bodyClass}>
          {sidebar ? (
            <>
              <div className="page-shell__content">{children}</div>
              <aside className="page-shell__sidebar">{sidebar}</aside>
            </>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
