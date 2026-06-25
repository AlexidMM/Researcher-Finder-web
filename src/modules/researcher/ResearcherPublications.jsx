import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import EmptyState from '../shared/EmptyState';
import { apiFetch } from '../../utils/api';
import './researcher-dashboard.scss';

export default function ResearcherPublications() {
  const navigate = useNavigate();
  const [myPublications, setMyPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMyPublications();
  }, []);

  const fetchMyPublications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/publications/mine');
      setMyPublications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar tus publicaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (publicationId, currentStatus) => {
    try {
      const updated = await apiFetch(`/publications/${publicationId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: !currentStatus }),
      });

      setMyPublications((prev) =>
        prev.map((publication) =>
          publication.id === publicationId ? { ...publication, status: updated.status } : publication
        )
      );
    } catch (err) {
      alert(err.message || 'No se pudo actualizar el estado');
    }
  };

  const handleDelete = async (publicationId) => {
    const confirmed = window.confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.');
    if (!confirmed) return;

    try {
      await apiFetch(`/publications/${publicationId}`, { method: 'DELETE' });
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
    if (!parsedDate || Number.isNaN(parsedDate.getTime())) return 'Fecha no disponible';
    return parsedDate.toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <PageShell
      wide
      breadcrumb={<RoleBreadcrumb current="Publicaciones" />}
    >
      <SectionHeader
        title="Mis Publicaciones"
        description="Administra el estado de tus convocatorias. Los cambios generan notificaciones en el wearable."
      />

      <section className="actions-section">
        <button type="button" className="btn-create-post" onClick={() => navigate('/researcher/create-publication')}>
          + Nueva publicación
        </button>
      </section>

      {error && <div className="researcher-error-box">{error}</div>}

      <section className="my-posts-section">
        {loading ? (
          <div className="researcher-state-box">Cargando publicaciones...</div>
        ) : myPublications.length > 0 ? (
          <div className="researcher-posts-wrap">
            {myPublications.map((publication) => (
              <div key={publication.id} className={`researcher-post-card ${getTypeClass(publication.type)}`}>
                <div className="researcher-post-head">
                  <div className="researcher-post-main">
                    <h3>{publication.title}</h3>
                    <span className={`researcher-type-badge ${getTypeClass(publication.type)}`}>
                      {typeLabels[publication.type] || publication.type}
                    </span>
                    <span className="researcher-post-date">{formatPublicationDate(publication)}</span>
                    <label className="researcher-status-toggle">
                      <input
                        type="checkbox"
                        checked={Boolean(publication.status)}
                        onChange={() => handleToggleStatus(publication.id, publication.status)}
                      />
                      <span>{publication.status ? 'Activa' : 'Cerrada'}</span>
                    </label>
                  </div>
                  <div className="researcher-post-actions">
                    <button
                      type="button"
                      className="btn-post-edit"
                      onClick={() => navigate(`/researcher/edit-publication/${publication.id}`)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="btn-post-delete"
                      onClick={() => handleDelete(publication.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p className="researcher-post-description">
                  {publication.description.length > 280
                    ? `${publication.description.substring(0, 280)}...`
                    : publication.description}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="Aún no tienes publicaciones"
            description="Crea tu primera convocatoria para que los estudiantes puedan encontrarla."
            actionLabel="+ Crear publicación"
            onAction={() => navigate('/researcher/create-publication')}
          />
        )}
      </section>
    </PageShell>
  );
}
