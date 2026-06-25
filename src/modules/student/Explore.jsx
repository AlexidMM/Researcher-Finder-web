import { useState, useEffect } from 'react';
import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import InfoPanel from '../shared/InfoPanel';
import ModalHeader from '../shared/ModalHeader';
import { apiFetch } from '../../utils/api';
import './explore.scss';

export default function Explore() {
  const [activeTab, setActiveTab] = useState('researchers'); // 'researchers' o 'institutions'
  const [researchers, setResearchers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('all');

  // Modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemType, setItemType] = useState(null); // Para saber si abrimos investigador o institución

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const [resData, instData, discData, pubData] = await Promise.all([
          apiFetch('/researchers'),
          apiFetch('/institutions'),
          apiFetch('/disciplines'),
          apiFetch('/publications')
        ]);
        setResearchers(resData || []);
        setInstitutions(instData || []);
        setDisciplines(discData || []);
        setPublications(pubData.filter(p => p.status === true) || []); // Solo activas
      } catch (err) {
        console.error('Error cargando datos de exploración:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Lógica de Filtrado
  const filteredResearchers = researchers.filter((res) => {
    const fullName = `${res.firstName || ''} ${res.lastNameP || ''} ${res.lastNameM || ''}`.toLowerCase();
    const matchesSearch = fullName.includes(searchTerm.toLowerCase());
    const matchesDisc = disciplineFilter === 'all' || (res.disciplines && res.disciplines.some(d => d.id.toString() === disciplineFilter));
    return matchesSearch && matchesDisc;
  });

  const filteredInstitutions = institutions.filter((inst) => {
    const matchesSearch = (inst.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (inst.acronym || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDisc = disciplineFilter === 'all' || (inst.disciplines && inst.disciplines.some(d => d.id.toString() === disciplineFilter));
    return matchesSearch && matchesDisc;
  });

  // Filtrar publicaciones para el modal
  const getRelatedPublications = () => {
    if (!selectedItem) return [];
    if (itemType === 'researcher') {
      return publications.filter(pub => pub.author?.researcher?.id === selectedItem.id);
    } else {
      return publications.filter(pub => pub.author?.researcher?.affiliation?.id === selectedItem.id);
    }
  };

  const openModal = (item, type) => {
    setSelectedItem(item);
    setItemType(type);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setItemType(null);
  };

  return (
    <>
    <PageShell
      wide
      breadcrumb={<RoleBreadcrumb current="Explorar" />}
    >
      <SectionHeader
        className="explore-header"
        title="Directorio de Exploración"
        description="Encuentra a tu próximo mentor o descubre las instituciones con oportunidades activas."
      />

        <section className="explore-controls">
          <div className="explore-tabs">
            <button className={`tab-btn ${activeTab === 'researchers' ? 'active' : ''}`} onClick={() => setActiveTab('researchers')}>
              Investigadores
            </button>
            <button className={`tab-btn ${activeTab === 'institutions' ? 'active' : ''}`} onClick={() => setActiveTab('institutions')}>
              Instituciones
            </button>
          </div>

          <div className="explore-filters">
            <input 
              type="text" 
              placeholder={`Buscar ${activeTab === 'researchers' ? 'investigador...' : 'institución...'}`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="explore-search-input"
            />
            <select 
              value={disciplineFilter} 
              onChange={(e) => setDisciplineFilter(e.target.value)}
              className="explore-select-input"
            >
              <option value="all">Todas las disciplinas</option>
              {disciplines.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </section>

        {loading ? (
          <div className="explore-loading">Cargando directorio...</div>
        ) : (
          <section className="explore-grid">
            {activeTab === 'researchers' && filteredResearchers.map(res => (
              <div key={res.id} className="explore-card" onClick={() => openModal(res, 'researcher')}>
                <div className="card-icon"></div>
                <h3>{res.firstName} {res.lastNameP}</h3>
                <p className="card-subtitle">{res.affiliation?.acronym || 'Investigador Independiente'}</p>
                <div className="card-tags">
                  {res.disciplines?.slice(0, 2).map(d => <span key={d.id}>{d.name}</span>)}
                  {res.disciplines?.length > 2 && <span>+{res.disciplines.length - 2}</span>}
                </div>
                <button className="view-more-btn">Ver oportunidades</button>
              </div>
            ))}

            {activeTab === 'institutions' && filteredInstitutions.map(inst => (
              <div key={inst.id} className="explore-card institution" onClick={() => openModal(inst, 'institution')}>
                <div className="card-icon"></div>
                <h3>{inst.acronym || inst.name}</h3>
                <p className="card-subtitle">{inst.type || 'Institución'}</p>
                <div className="card-tags">
                  {inst.disciplines?.slice(0, 2).map(d => <span key={d.id}>{d.name}</span>)}
                  {inst.disciplines?.length > 2 && <span>+{inst.disciplines.length - 2}</span>}
                </div>
                <button className="view-more-btn">Ver oportunidades</button>
              </div>
            ))}
          </section>
        )}
    </PageShell>

      {selectedItem && (
        <div className="explore-modal-overlay" onClick={closeModal}>
          <div className="explore-modal-card" onClick={e => e.stopPropagation()}>
            <ModalHeader
              title={itemType === 'researcher' ? `${selectedItem.firstName} ${selectedItem.lastNameP}` : selectedItem.name}
              onClose={closeModal}
            />

            <div className="explore-modal-body">
              <InfoPanel title="Información General">
                {itemType === 'researcher' ? (
                  <>
                    <p><strong>Afiliación:</strong> {selectedItem.affiliation?.name || 'Ninguna'}</p>
                    <p><strong>Contacto:</strong> {selectedItem.user?.email}</p>
                  </>
                ) : (
                  <>
                    <p><strong>Acrónimo:</strong> {selectedItem.acronym}</p>
                    <p><strong>Tipo:</strong> {selectedItem.type}</p>
                    <p><strong>Contacto:</strong> {selectedItem.contactInfo}</p>
                  </>
                )}
                
                <div className="modal-disciplines">
                  <strong>Áreas de enfoque:</strong>
                  <div className="tags-container">
                    {selectedItem.disciplines?.length > 0 ? (
                      selectedItem.disciplines.map(d => <span key={d.id} className="tag">{d.name}</span>)
                    ) : <span>No especificadas</span>}
                  </div>
                </div>
              </InfoPanel>

              <InfoPanel title={`Oportunidades Activas (${getRelatedPublications().length})`}>
                <div className="publications-list">
                  {getRelatedPublications().length > 0 ? (
                    getRelatedPublications().map(pub => (
                      <div key={pub.id} className="mini-pub-card">
                        <h4>{pub.title}</h4>
                        <span className="pub-type">{pub.type}</span>
                        <p>{pub.description.substring(0, 100)}...</p>
                      </div>
                    ))
                  ) : (
                    <p className="empty-pubs">No hay publicaciones activas en este momento.</p>
                  )}
                </div>
              </InfoPanel>
            </div>
          </div>
        </div>
      )}
    </>
  );
}