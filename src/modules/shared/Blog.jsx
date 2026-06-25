import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageShell from './PageShell';
import SectionHeader from './SectionHeader';
import DashboardStats from './DashboardStats';
import EmptyState from './EmptyState';
import FilterBar from './FilterBar';
import InfoPanel from './InfoPanel';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
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

  const typeLabels = {
    scholarship: 'Beca de Investigación',
    internship: 'Estancia de Prácticas',
    project: 'Proyecto de Colaboración',
  };

  const [selectedDiscipline, setSelectedDiscipline] = useState('all');
  const [disciplines, setDisciplines] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      const data = await apiFetch('/disciplines');
      setDisciplines(data || []);
    } catch (err) {
      console.error('Error al cargar disciplinas:', err);
    }
  };

  const filteredPublications = publications.filter((pub) => {
    const typeMatch = selectedType === 'all' || pub.type === selectedType;
    let disciplineMatch = true;
    
    if (selectedDiscipline !== 'all') {
      const disciplineIds = pub.author?.researcher?.disciplines?.map((d) => d.id) || [];
      disciplineMatch = disciplineIds.includes(+selectedDiscipline);
    }

    return typeMatch && disciplineMatch;
  });

  const blogStats = [
    { label: 'Publicaciones visibles', value: filteredPublications.length, helpText: 'Oportunidades que coinciden con tus filtros.' },
    { label: 'Disciplinas', value: disciplines.length, helpText: 'Áreas disponibles para filtrar.' },
    { label: 'Tipo activo', value: selectedType === 'all' ? 'Todas' : selectedType, helpText: 'Filtro de oportunidad actual.' },
  ];

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
    <>
    <PageShell
      wide
      breadcrumb={<span>Blog / Oportunidades</span>}
    >
        <SectionHeader
          className="blog-header"
          title="Blog de Oportunidades"
          description="Descubre las publicaciones de investigadores con los que podrías colaborar. Explora estancias, becas y proyectos disponibles."
        />

        <DashboardStats items={blogStats} />

        <FilterBar
          label="Filtrar por tipo"
          value={selectedType}
          onChange={setSelectedType}
          options={[
            { label: 'Todas', value: 'all' },
            { label: 'Becas', value: 'scholarship' },
            { label: 'Estancias', value: 'internship' },
            { label: 'Proyectos', value: 'project' },
          ]}
        />

        <FilterBar
          label="Filtrar por disciplina"
          value={selectedDiscipline}
          onChange={setSelectedDiscipline}
          options={[
            { label: 'Todas', value: 'all' },
            ...disciplines.map((discipline) => ({ label: discipline.name, value: String(discipline.id) })),
          ]}
        />

        {loading && <div className="blog-state-box">Cargando publicaciones...</div>}
        {error && <div className="blog-error-box">{error}</div>}

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

                {/* Apartado de disciplinas separado y limpio */}
                <div className="blog-card-disciplines">
                  {publication.author?.researcher?.disciplines && publication.author.researcher.disciplines.length > 0 ? (
                    <>
                      <span className="meta-label">Disciplinas requeridas:</span>
                      <div className="blog-disciplines-list">
                        {publication.author.researcher.disciplines.map((d) => (
                          <span key={d.id} className="blog-discipline-tag">
                            • {d.name}
                          </span>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>

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
          <EmptyState
            title="No hay publicaciones disponibles"
            description="Vuelve más tarde para ver nuevas oportunidades o ajusta los filtros para explorar resultados distintos."
          />
        ) : null}
    </PageShell>

      {modalOpen && modalData && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <ModalHeader title={modalData.title} onClose={closeModal} />

            <div className="blog-modal-grid">
              <InfoPanel title="Info del post" className="blog-modal-panel">
                <p><strong>Titulo:</strong> {modalData.title}</p>
                <p><strong>Tipo:</strong> {typeLabels[modalData.type] || modalData.type || 'General'}</p>
                <p><strong>Fecha:</strong> {formatPublicationDate(modalData)}</p>
                <p><strong>Descripcion:</strong> {modalData.description}</p>
              </InfoPanel>

              <InfoPanel title="Info del investigador" className="blog-modal-panel">
                <p><strong>Nombre:</strong> {getAuthorName(modalData)}</p>
                <p><strong>Correo:</strong> {modalData.author?.email || 'No disponible'}</p>
                <p><strong>Institucion:</strong> {getInstitutionName(modalData)}</p>
                <p><strong>Acronimo:</strong> {modalData.author?.researcher?.affiliation?.acronym || 'No disponible'}</p>
                <p><strong>Contacto:</strong> {modalData.author?.researcher?.affiliation?.contactInfo || 'No disponible'}</p>
                
                {modalData.author?.researcher?.disciplines && modalData.author.researcher.disciplines.length > 0 && (
                  <div className="blog-modal-disciplines">
                    <p><strong>Áreas de experiencia:</strong></p>
                    <div className="blog-modal-disciplines-list">
                      {modalData.author.researcher.disciplines.map((d) => (
                        <span key={d.id} className="blog-modal-discipline-badge">
                          ✓ {d.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </InfoPanel>
            </div>

            <ModalFooter>
              <button onClick={closeModal} className="blog-modal-btn-close">Cerrar</button>
            </ModalFooter>
          </div>
        </div>
      )}
    </>
  );
}