import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './admin.scss';

export default function ResearchersManager() {
  const [researchers, setResearchers] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // --- Estados para Filtros ---
  const [searchTerm, setSearchTerm] = useState('');
  const [institutionFilter, setInstitutionFilter] = useState('');
  const [disciplineFilter, setDisciplineFilter] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastNameP: '',
    lastNameM: '',
    affiliation: null,
  });
  const [createData, setCreateData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastNameP: '',
    lastNameM: '',
    affiliationId: '',
  });
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [createDisciplines, setCreateDisciplines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [researchersData, institutionsData, disciplinesData] = await Promise.all([
        apiFetch('/researchers'),
        apiFetch('/institutions'),
        apiFetch('/disciplines'),
      ]);
      setResearchers(researchersData || []);
      setInstitutions(institutionsData || []);
      setDisciplines(disciplinesData || []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (researcher) => {
    setEditingId(researcher.id);
    setFormData({
      firstName: researcher.firstName || '',
      lastNameP: researcher.lastNameP || '',
      lastNameM: researcher.lastNameM || '',
      affiliation: researcher.affiliation?.id || null,
    });
    setSelectedDisciplines(researcher.disciplines?.map((d) => d.id) || []);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ firstName: '', lastNameP: '', lastNameM: '', affiliation: null });
    setSelectedDisciplines([]);
  };

  const handleCreateStart = () => {
    setIsCreating(true);
    setEditingId(null);
    setCreateData({
      email: '',
      password: '',
      firstName: '',
      lastNameP: '',
      lastNameM: '',
      affiliationId: '',
    });
    setCreateDisciplines([]);
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
    setCreateData({
      email: '',
      password: '',
      firstName: '',
      lastNameP: '',
      lastNameM: '',
      affiliationId: '',
    });
    setCreateDisciplines([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAffiliationChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      affiliation: e.target.value ? +e.target.value : null,
    }));
  };

  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setCreateData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleDiscipline = (disciplineId) => {
    setSelectedDisciplines((prev) =>
      prev.includes(disciplineId)
        ? prev.filter((id) => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const toggleCreateDiscipline = (disciplineId) => {
    setCreateDisciplines((prev) =>
      prev.includes(disciplineId)
        ? prev.filter((id) => id !== disciplineId)
        : [...prev, disciplineId]
    );
  };

  const handleCreateSave = async () => {
    try {
      if (!createData.email || !createData.password || !createData.firstName || !createData.lastNameP) {
        setError('Completa email, contraseña, nombre y apellido paterno para crear el investigador');
        return;
      }

      const created = await apiFetch('/researchers', {
        method: 'POST',
        body: JSON.stringify({
          email: createData.email,
          password: createData.password,
          firstName: createData.firstName,
          lastNameP: createData.lastNameP,
          lastNameM: createData.lastNameM || undefined,
          affiliationId: createData.affiliationId ? +createData.affiliationId : undefined,
        }),
      });

      const newResearcherId = created?.researcher?.id;
      if (newResearcherId && createDisciplines.length > 0) {
        for (const disciplineId of createDisciplines) {
          await apiFetch(`/researchers/${newResearcherId}/disciplines/${disciplineId}`, {
            method: 'POST',
          });
        }
      }

      await fetchData();
      handleCreateCancel();
      setError('');
    } catch (err) {
      setError(err.message || 'Error al crear investigador');
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const currentResearcher = researchers.find((r) => r.id === editingId);
      const currentDisciplines = currentResearcher?.disciplines?.map((d) => d.id) || [];

      for (const disciplineId of selectedDisciplines) {
        if (!currentDisciplines.includes(disciplineId)) {
          await apiFetch(`/researchers/${editingId}/disciplines/${disciplineId}`, { method: 'POST' });
        }
      }

      for (const disciplineId of currentDisciplines) {
        if (!selectedDisciplines.includes(disciplineId)) {
          await apiFetch(`/researchers/${editingId}/disciplines/${disciplineId}`, { method: 'DELETE' });
        }
      }

      if (formData.affiliation !== currentResearcher.affiliation?.id) {
        const userData = {
          firstName: formData.firstName,
          lastNameP: formData.lastNameP,
          lastNameM: formData.lastNameM,
        };

        if (formData.affiliation) {
          userData.affiliation = { id: formData.affiliation };
        }

        await apiFetch(`/researchers/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(userData),
        });
      }

      await fetchData();
      handleCancel();
    } catch (err) {
      setError(err.message || 'Error al guardar cambios');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este investigador?')) return;
    try {
      await apiFetch(`/researchers/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
      console.error(err);
    }
  };

  // --- Lógica de Filtrado en Tiempo Real ---
  const filteredResearchers = researchers.filter((res) => {
    const fullName = `${res.firstName || ''} ${res.lastNameP || ''} ${res.lastNameM || ''}`.toLowerCase();
    const email = (res.user?.email || '').toLowerCase();
    
    // Filtro por nombre o correo
    const matchesSearch = fullName.includes(searchTerm.toLowerCase()) || email.includes(searchTerm.toLowerCase());
    
    // Filtro por institución
    const matchesInst = institutionFilter === '' || (res.affiliation && res.affiliation.id.toString() === institutionFilter);
    
    // Filtro por disciplina
    const matchesDisc = disciplineFilter === '' || (res.disciplines && res.disciplines.some(d => d.id.toString() === disciplineFilter));
    
    return matchesSearch && matchesInst && matchesDisc;
  });

  if (loading) return <div className="admin-loading">Cargando investigadores...</div>;

  return (
    <div className="admin-manager">
      {error && <div className="admin-error">{error}</div>}

      {/* --- BARRA DE FILTROS --- */}
      <div className="admin-filters-bar">
        <input 
          type="text" 
          placeholder="Buscar por nombre o correo..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-filter-input"
        />
        
        <select 
          value={institutionFilter} 
          onChange={(e) => setInstitutionFilter(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">Todas las instituciones</option>
          {institutions.map(inst => (
            <option key={inst.id} value={inst.id}>
              {inst.acronym || inst.name}
            </option>
          ))}
        </select>

        <select 
          value={disciplineFilter} 
          onChange={(e) => setDisciplineFilter(e.target.value)}
          className="admin-filter-select"
        >
          <option value="">Todas las disciplinas</option>
          {disciplines.map(disc => (
            <option key={disc.id} value={disc.id}>
              {disc.name}
            </option>
          ))}
        </select>
      </div>

      {!isCreating && editingId === null && (
        <div className="admin-create-section">
          <button className="admin-btn-create" onClick={handleCreateStart}>
            + Crear Investigador
          </button>
        </div>
      )}

      {isCreating && (
        <div className="admin-form-container">
          <h3>Nuevo Investigador</h3>

          <div className="admin-form-row">
            <input
              type="email"
              name="email"
              placeholder="Correo"
              value={createData.email}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={createData.password}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
          </div>

          <div className="admin-form-row">
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              value={createData.firstName}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
            <input
              type="text"
              name="lastNameP"
              placeholder="Apellido paterno"
              value={createData.lastNameP}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
            <input
              type="text"
              name="lastNameM"
              placeholder="Apellido materno"
              value={createData.lastNameM}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Institución (opcional)</label>
            <select
              name="affiliationId"
              value={createData.affiliationId}
              onChange={handleCreateInputChange}
              className="admin-input"
            >
              <option value="">Ninguna</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>

          <div className="admin-form-group">
            <label>Disciplinas (opcional)</label>
            <div className="admin-disciplines-select">
              {disciplines.map((disc) => (
                <label key={disc.id} className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={createDisciplines.includes(disc.id)}
                    onChange={() => toggleCreateDiscipline(disc.id)}
                  />
                  {disc.name}
                </label>
              ))}
            </div>
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn-save" onClick={handleCreateSave}>
              Crear
            </button>
            <button className="admin-btn-cancel" onClick={handleCreateCancel}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo (Usuario)</th>
              <th>Institución</th>
              <th>Disciplinas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredResearchers.length === 0 ? (
              <tr><td colSpan="5" className="admin-empty-text">No se encontraron investigadores.</td></tr>
            ) : (
              filteredResearchers.map((researcher) => (
                <tr key={researcher.id}>
                  <td>
                    {editingId === researcher.id ? (
                      <div className="admin-form-row">
                        <input
                          type="text"
                          name="firstName"
                          placeholder="Nombre"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          className="admin-input"
                        />
                        <input
                          type="text"
                          name="lastNameP"
                          placeholder="Apellido P."
                          value={formData.lastNameP}
                          onChange={handleInputChange}
                          className="admin-input"
                        />
                        <input
                          type="text"
                          name="lastNameM"
                          placeholder="Apellido M."
                          value={formData.lastNameM}
                          onChange={handleInputChange}
                          className="admin-input"
                        />
                      </div>
                    ) : (
                      `${researcher.firstName || ''} ${researcher.lastNameP || ''} ${researcher.lastNameM || ''}`
                    )}
                  </td>
                  <td>{researcher.user?.email || 'Sin cuenta'}</td>
                  <td>
                    {editingId === researcher.id ? (
                      <select
                        value={formData.affiliation || ''}
                        onChange={handleAffiliationChange}
                        className="admin-input"
                      >
                        <option value="">Ninguna</option>
                        {institutions.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      researcher.affiliation?.name || <span className="admin-empty-text">Sin institución</span>
                    )}
                  </td>
                  <td>
                    {editingId === researcher.id ? (
                      <div className="admin-disciplines-select">
                        {disciplines.map((disc) => (
                          <label key={disc.id} className="admin-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedDisciplines.includes(disc.id)}
                              onChange={() => toggleDiscipline(disc.id)}
                            />
                            {disc.name}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="admin-disciplines-view">
                        {researcher.disciplines && researcher.disciplines.length > 0 ? (
                          researcher.disciplines.map((d) => (
                            <span key={d.id} className="admin-discipline-badge">
                              {d.name}
                            </span>
                          ))
                        ) : (
                          <span className="admin-empty-text">Sin disciplinas</span>
                        )}
                      </div>
                    )}
                  </td>
                  <td>
                    {editingId === researcher.id ? (
                      <div className="admin-actions">
                        <button className="admin-btn-save" onClick={handleSave}>
                          Guardar
                        </button>
                        <button className="admin-btn-cancel" onClick={handleCancel}>
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <div className="admin-actions">
                        <button
                          className="admin-btn-edit"
                          onClick={() => handleEdit(researcher)}
                        >
                          Editar
                        </button>
                        <button
                          className="admin-btn-delete"
                          onClick={() => handleDelete(researcher.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}