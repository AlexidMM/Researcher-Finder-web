import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import SectionHeader from '../shared/SectionHeader';
import './admin.scss';

import { useState } from 'react';
import ResearchersManager from './ResearchersManager';
import InstitutionsManager from './InstitutionsManager';
import DisciplinesManager from './DisciplinesManager';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('researchers');

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <SectionHeader
          title="Panel de Administrador@"
          description="Administra investigadores, instituciones, disciplinas y publicaciones."
        />

        <section className="admin-tabs">
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
      </main>
      <Footer />
    </div>
  );
}