import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import SectionHeader from '../shared/SectionHeader';
import './admin.scss';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../utils/api';
import HighlightCard from '../shared/HighlightCard';
import SearchBar from '../shared/SearchBar';
import AdminSidebar from './AdminSidebar';
import ResearchersManager from './ResearchersManager';
import InstitutionsManager from './InstitutionsManager';
import DisciplinesManager from './DisciplinesManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('researchers');
  const [counts, setCounts] = useState({ researchers: 0, institutions: 0, disciplines: 0, publications: 0, pending: 0 });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [res, inst, disc, pubs] = await Promise.all([
          apiFetch('/researchers'),
          apiFetch('/institutions'),
          apiFetch('/disciplines'),
          apiFetch('/publications'),
        ]);
        setCounts({
          researchers: (res || []).length,
          institutions: (inst || []).length,
          disciplines: (disc || []).length,
          publications: (pubs || []).filter(p => p.status === true).length,
          pending: (pubs || []).filter(p => p.status === false).length,
        });
      } catch (err) {
        // no bloquear UI si falla
        console.error('Error cargando conteos admin:', err);
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content admin-dashboard-main">
        <section className="admin-main-content">
        <SectionHeader
          title="Panel de Administrador@"
          description="Administra investigadores, instituciones, disciplinas y publicaciones."
        />

        <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <SearchBar value={searchTerm} onChange={setSearchTerm} placeholder="Buscar registros..." />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            <HighlightCard title="Investigadores" value={counts.researchers} subtitle="Total registrado" />
            <HighlightCard title="Instituciones" value={counts.institutions} subtitle="Total registrado" />
            <HighlightCard title="Disciplinas" value={counts.disciplines} subtitle="Áreas definidas" />
            <HighlightCard title="Publicaciones" value={counts.publications} subtitle="Activas" />
          </div>
        </div>

        <section id="admin-tabs" className="admin-tabs">
          <button
            className={`admin-tab-btn ${activeTab === 'researchers' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('researchers')}
          >
            Investigadores
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'institutions' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('institutions')}
          >
            Instituciones
          </button>
          <button
            className={`admin-tab-btn ${activeTab === 'disciplines' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('disciplines')}
          >
            Disciplinas
          </button>
        </section>

        <section className="admin-content">
          {activeTab === 'researchers' && <ResearchersManager />}
          {activeTab === 'institutions' && <InstitutionsManager />}
          {activeTab === 'disciplines' && <DisciplinesManager />}
        </section>
        </section>

        <AdminSidebar counts={counts} />
      </main>
      <Footer />
    </div>
  );
}