import { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { apiFetch } from '../../utils/api';
import '../student/student.scss';
import './blog.scss';

export default function Blog() {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/publications');
      
      // Filtrar solo las publicaciones activas
      const activePublications = Array.isArray(data)
        ? data.filter((pub) => pub.status === true)
        : [];
      
      setPublications(activePublications);
    } catch (err) {
      setError(err.message || 'Error al cargar las publicaciones');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar publicaciones por tipo
  const filteredPublications =
    selectedType === 'all'
      ? publications
      : publications.filter((pub) => pub.type === selectedType);

  const typeLabels = {
    scholarship: 'Beca de Investigación',
    internship: 'Estancia de Prácticas',
    project: 'Proyecto de Colaboración',
  };

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const getTypeClass = (type) => `type-${type || 'default'}`;

  const getAuthorName = (publication) => {
    const researcher = publication.author?.researcher;
    const fullName = [
      researcher?.firstName,
      researcher?.lastNameP,
      researcher?.lastNameM,
    ]
      .filter(Boolean)
      .join(' ');

    return fullName || publication.author?.email || 'Investigador';
  };

  const getInstitutionName = (publication) =>
    publication.author?.researcher?.affiliation?.name || 'Institucion no especificada';

  const formatPublicationDate = (publication) => {
    const raw = publication.createdAt || publication.created_at;
    const parsedDate = raw ? new Date(raw) : null;

    if (!parsedDate || Number.isNaN(parsedDate.getTime())) {
      return 'Fecha no disponible';
    }

    return parsedDate.toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const openModal = (publication) => {
    setModalData(publication);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header blog-header">
          <h1>Blog de Oportunidades</h1>
          <p>Descubre las publicaciones de investigadores con los que podrías colaborar. Explora estancias, becas y proyectos disponibles.</p>
        </header>

        <section className="blog-filters">
          <span className="blog-filters-label">Filtrar por tipo:</span>

          <button
            className={`blog-filter-btn ${selectedType === 'all' ? 'is-active' : ''}`}
            onClick={() => setSelectedType('all')}
          >
            Todas
          </button>

          <button
            className={`blog-filter-btn ${selectedType === 'scholarship' ? 'is-active' : ''}`}
            onClick={() => setSelectedType('scholarship')}
          >
            Becas
          </button>

          <button
            className={`blog-filter-btn ${selectedType === 'internship' ? 'is-active' : ''}`}
            onClick={() => setSelectedType('internship')}
          >
            Estancias
          </button>

          <button
            className={`blog-filter-btn ${selectedType === 'project' ? 'is-active' : ''}`}
            onClick={() => setSelectedType('project')}
          >
            Proyectos
          </button>
        </section>

        {loading && (
          <div className="blog-state-box">Cargando publicaciones...</div>
        )}

        {error && (
          <div className="blog-error-box">{error}</div>
        )}

        {!loading && !error && filteredPublications.length > 0 ? (
          <section className="blog-feed">
            {filteredPublications.map((publication) => (
              <article key={publication.id} className={`blog-card ${getTypeClass(publication.type)}`}>
                <div className="blog-card-head">
                  <h2 className="blog-card-title">{publication.title}</h2>
                  <span className={`blog-card-type ${getTypeClass(publication.type)}`}>
                    {typeLabels[publication.type] || publication.type || 'General'}
                  </span>
                </div>

                <p className="blog-card-meta">
                  <span className="meta-label">Por:</span> {getAuthorName(publication)}
                </p>
                <p className="blog-card-meta">
                  <span className="meta-label">Institucion:</span> {getInstitutionName(publication)}
                </p>

                <p className="blog-card-description">{publication.description}</p>

                <div className="blog-card-footer">
                  <span className="blog-card-date">{formatPublicationDate(publication)}</span>
                  <button className="blog-details-btn" onClick={() => openModal(publication)}>
                    Mas detalles
                  </button>
                </div>
              </article>
            ))}
          </section>
        ) : !loading && !error ? (
          <div className="blog-state-box">
            <p>No hay publicaciones disponibles en este momento.</p>
            <p>Vuelve mas tarde para ver nuevas oportunidades.</p>
          </div>
        ) : null}
      </main>

      {modalOpen && modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <header className="blog-modal-header">
              <h3>{modalData.title}</h3>
              <button className="blog-modal-close" onClick={closeModal} aria-label="Cerrar modal">x</button>
            </header>

            <div className="blog-modal-grid">
              <section className="blog-modal-panel">
                <h4>Info del post</h4>
                <p><strong>Titulo:</strong> {modalData.title}</p>
                <p><strong>Tipo:</strong> {typeLabels[modalData.type] || modalData.type || 'General'}</p>
                <p><strong>Fecha:</strong> {formatPublicationDate(modalData)}</p>
                <p><strong>Descripcion:</strong> {modalData.description}</p>
              </section>

              <section className="blog-modal-panel">
                <h4>Info del investigador</h4>
                <p><strong>Nombre:</strong> {getAuthorName(modalData)}</p>
                <p><strong>Correo:</strong> {modalData.author?.email || 'No disponible'}</p>
                <p><strong>Institucion:</strong> {getInstitutionName(modalData)}</p>
                <p><strong>Acronimo:</strong> {modalData.author?.researcher?.affiliation?.acronym || 'No disponible'}</p>
                <p><strong>Contacto:</strong> {modalData.author?.researcher?.affiliation?.contactInfo || 'No disponible'}</p>
              </section>
            </div>

            <footer className="blog-modal-footer">
              <button onClick={closeModal} className="blog-modal-btn-close">Cerrar</button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}