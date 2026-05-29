import { useState } from 'react';
import Navbar from '../shared/Navbar';
import './student.scss';

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [webResults, setWebResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // --- FUNCIÓN PARA BUSCAR EN LA WEB (INTERNET) ---
  const handleWebSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    
    try {
      // Consumiendo la API pública de Wikipedia para buscar artículos web
      const endpoint = `https://es.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=5&srsearch=${encodeURIComponent(searchQuery)}`;
      
      const response = await fetch(endpoint);
      const data = await response.json();
      
      setWebResults(data.query.search);
    } catch (error) {
      console.error("Error al buscar en la web:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Panel de Estudiante</h1>
          <p>Investiga temas en la web y encuentra proyectos para tu estancia.</p>
        </header>

        {/* --- BUSCADOR WEB IN-APP --- */}
        <section className="web-search-section" style={{ marginBottom: '3rem' }}>
          <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
            <h2 style={{ color: '#0A2540', marginBottom: '1rem', fontSize: '1.5rem' }}>Buscador Web de Conceptos</h2>
            <p style={{ color: '#666', marginBottom: '1.5rem' }}>Busca información científica en internet sin salir de la plataforma.</p>
            
            <form onSubmit={handleWebSearch} style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="text" 
                placeholder="Ej. Inteligencia Artificial, Biología Molecular..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '12px 20px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
              <button 
                type="submit"
                disabled={isSearching}
                style={{
                  padding: '0 25px',
                  backgroundColor: '#F6C844', // Accent gold
                  color: '#0A2540', // Primary blue
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isSearching ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s'
                }}
              >
                {isSearching ? 'Buscando...' : '🌐 Buscar en la Web'}
              </button>
            </form>

            {/* RESULTADOS DE LA WEB */}
            {hasSearched && (
              <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {webResults.length === 0 && !isSearching ? (
                  <p style={{ color: '#D32F2F' }}>No se encontraron artículos web para tu búsqueda.</p>
                ) : (
                  webResults.map((result) => (
                    <div key={result.pageid} style={{ padding: '1.5rem', border: '1px solid #eee', borderRadius: '8px', borderLeft: '4px solid #173A5E' }}>
                      <h3 style={{ color: '#173A5E', marginBottom: '8px' }}>{result.title}</h3>
                      {/* Wikipedia devuelve HTML seguro en el 'snippet' (para las negritas) */}
                      <p 
                        style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.5', marginBottom: '10px' }}
                        dangerouslySetInnerHTML={{ __html: result.snippet + '...' }} 
                      />
                      <a 
                        href={`https://es.wikipedia.org/?curid=${result.pageid}`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#0A2540', fontWeight: 'bold', textDecoration: 'none', fontSize: '0.9rem' }}
                      >
                        Leer artículo completo en nueva pestaña ↗
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}