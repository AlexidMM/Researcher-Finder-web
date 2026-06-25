import { useState } from 'react';
import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import EmptyState from '../shared/EmptyState';
import './student.scss';

export default function StudentSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [webResults, setWebResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleWebSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);

    try {
      const endpoint = `https://es.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=8&srsearch=${encodeURIComponent(searchQuery)}`;
      const response = await fetch(endpoint);
      const data = await response.json();
      setWebResults(data.query?.search || []);
    } catch (error) {
      console.error('Error al buscar en la web:', error);
      setWebResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <PageShell
      wide
      breadcrumb={<RoleBreadcrumb current="Búsqueda web" />}
    >
      <SectionHeader
        title="Búsqueda de Conceptos"
        description="Consulta artículos científicos en Wikipedia sin salir de la plataforma."
      />

      <section className="student-search-panel">
        <form onSubmit={handleWebSearch} className="student-search-form">
          <input
            type="text"
            placeholder="Ej. Inteligencia Artificial, Biología Molecular..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="student-search-input"
          />
          <button type="submit" disabled={isSearching} className="student-search-btn">
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {hasSearched && (
          <div className="student-search-results">
            {webResults.length === 0 && !isSearching ? (
              <EmptyState
                compact
                title="Sin resultados"
                description="Prueba con otro término más específico."
              />
            ) : (
              webResults.map((result) => (
                <article key={result.pageid} className="student-search-card">
                  <h3>{result.title}</h3>
                  <p dangerouslySetInnerHTML={{ __html: `${result.snippet}...` }} />
                  <a
                    href={`https://es.wikipedia.org/?curid=${result.pageid}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Leer artículo completo ↗
                  </a>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </PageShell>
  );
}
