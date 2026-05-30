import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { apiFetch } from '../../utils/api';
import './researcher-dashboard.scss';

export default function ResearcherDashboard() {
  const navigate = useNavigate();
  const [myPublications, setMyPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Obtener datos del usuario actual
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchMyPublications();
  }, []);

  const fetchMyPublications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/publications');
      
      // Filtrar solo mis publicaciones
      const myPubs = Array.isArray(data)
        ? data.filter(pub => pub.author?.id === user.id)
        : [];
      
      setMyPublications(myPubs);
    } catch (err) {
      setError(err.message || 'Error al cargar tus publicaciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (publicationId) => {
    const confirmed = window.confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      await apiFetch(`/publications/${publicationId}`, { method: 'DELETE' });
      // Refrescar lista
      fetchMyPublications();
    } catch (err) {
      alert(err.message || 'No se pudo eliminar la publicación');
    }
  };

  const typeLabels = {
    scholarship: 'Beca',
    internship: 'Estancia',
    project: 'Proyecto',
  };

  const getTypeClass = (type) => `type-${type || 'default'}`;

  const formatPublicationDate = (publication) => {
    const raw = publication.createdAt || publication.created_at;
    const parsedDate = raw ? new Date(raw) : null;

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
      return 'Fecha no disponible';
    }

    return parsedDate.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header researcher-header">
          <h1>Panel de Investigador</h1>
          <p>Administra tus publicaciones, vacantes de estancias o proyectos de investigación. Colabora con estudiantes interesados en tu investigación.</p>
        </header>

        <section className="actions-section">
          <button 
            className="btn-create-post"
            onClick={() => navigate('/researcher/create-publication')}
          >
            + Crear Nueva Publicación
          </button>
        </section>

        {error && <div className="researcher-error-box">{error}</div>}

        <section className="my-posts-section">
          {loading ? (
            <div className="researcher-state-box">Cargando tus publicaciones...</div>
          ) : myPublications.length > 0 ? (
            <div className="researcher-posts-wrap">
              <h2 className="researcher-posts-title">
                Tus Publicaciones ({myPublications.length})
              </h2>
              {myPublications.map((publication) => (
                <div
                  key={publication.id}
                  className={`researcher-post-card ${getTypeClass(publication.type)}`}
                >
                  <div className="researcher-post-head">
                    <div className="researcher-post-main">
                      <h3>{publication.title}</h3>
                      <span className={`researcher-type-badge ${getTypeClass(publication.type)}`}>
                        {typeLabels[publication.type] || publication.type}
                      </span>
                      <span className="researcher-post-date">
                        {formatPublicationDate(publication)}
                      </span>
                    </div>
                    <div className="researcher-post-actions">
                      <button
                        className="btn-post-edit"
                        onClick={() => navigate(`/researcher/edit-publication/${publication.id}`)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-post-delete"
                        onClick={() => handleDelete(publication.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <p className="researcher-post-description">
                    {publication.description.length > 220
                      ? `${publication.description.substring(0, 220)}...`
                      : publication.description}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="placeholder-card researcher-empty-card">
              <h3>Aún no tienes publicaciones</h3>
              <p>Crea tu primera publicación para empezar a colaborar con estudiantes interesados en tu investigación.</p>
              <button
                className="btn-create-first"
                onClick={() => navigate('/researcher/create-publication')}
              >
                + Crear Primera Publicación
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}