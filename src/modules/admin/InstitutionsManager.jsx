import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './admin.scss';

export default function InstitutionsManager() {
  const [institutions, setInstitutions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    contactInfo: '',
  });
  const [createData, setCreateData] = useState({
    name: '',
    acronym: '',
    contactInfo: '',
    type: '',
  });
  const [selectedDisciplines, setSelectedDisciplines] = useState([]);
  const [createDisciplines, setCreateDisciplines] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [institutionsData, disciplinesData] = await Promise.all([
        apiFetch('/institutions'),
        apiFetch('/disciplines'),
      ]);
      setInstitutions(institutionsData || []);
      setDisciplines(disciplinesData || []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (institution) => {
    setEditingId(institution.id);
    setFormData({
      name: institution.name || '',
      acronym: institution.acronym || '',
      contactInfo: institution.contactInfo || '',
    });
    setSelectedDisciplines(institution.disciplines?.map((d) => d.id) || []);
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData({ name: '', acronym: '', contactInfo: '' });
    setSelectedDisciplines([]);
  };

  const handleCreateStart = () => {
    setIsCreating(true);
    setEditingId(null);
    setCreateData({ name: '', acronym: '', contactInfo: '', type: '' });
    setCreateDisciplines([]);
  };

  const handleCreateCancel = () => {
    setIsCreating(false);
    setCreateData({ name: '', acronym: '', contactInfo: '', type: '' });
    setCreateDisciplines([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      if (!createData.name) {
        setError('El nombre de la institución es obligatorio');
        return;
      }

      const created = await apiFetch('/institutions', {
        method: 'POST',
        body: JSON.stringify({
          name: createData.name,
          acronym: createData.acronym || undefined,
          contactInfo: createData.contactInfo || undefined,
          type: createData.type || undefined,
        }),
      });

      const newInstitutionId = created?.id;
      if (newInstitutionId && createDisciplines.length > 0) {
        for (const disciplineId of createDisciplines) {
          await apiFetch(`/institutions/${newInstitutionId}/disciplines/${disciplineId}`, {
            method: 'POST',
          });
        }
      }

      await fetchData();
      handleCreateCancel();
      setError('');
    } catch (err) {
      setError(err.message || 'Error al crear institución');
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const currentInstitution = institutions.find((i) => i.id === editingId);
      const currentDisciplines = currentInstitution?.disciplines?.map((d) => d.id) || [];

      // Agregar nuevas disciplinas
      for (const disciplineId of selectedDisciplines) {
        if (!currentDisciplines.includes(disciplineId)) {
          await apiFetch(`/institutions/${editingId}/disciplines/${disciplineId}`, { method: 'POST' });
        }
      }

      // Remover disciplinas eliminadas
      for (const disciplineId of currentDisciplines) {
        if (!selectedDisciplines.includes(disciplineId)) {
          await apiFetch(`/institutions/${editingId}/disciplines/${disciplineId}`, { method: 'DELETE' });
        }
      }

      // Actualizar datos de la institución
      await apiFetch(`/institutions/${editingId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: formData.name,
          acronym: formData.acronym,
          contactInfo: formData.contactInfo,
        }),
      });

      await fetchData();
      handleCancel();
    } catch (err) {
      setError(err.message || 'Error al guardar cambios');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta institución?')) return;
    try {
      await apiFetch(`/institutions/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
      console.error(err);
    }
  };

  if (loading) return <div className="admin-loading">Cargando instituciones...</div>;

  return (
    <div className="admin-manager">
      {error && <div className="admin-error">{error}</div>}

      {!isCreating && editingId === null && (
        <div className="admin-create-section">
          <button className="admin-btn-create" onClick={handleCreateStart}>
            + Crear Institución
          </button>
        </div>
      )}

      {isCreating && (
        <div className="admin-form-container">
          <h3>Nueva Institución</h3>

          <div className="admin-form-row">
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              value={createData.name}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
            <input
              type="text"
              name="acronym"
              placeholder="Acrónimo"
              value={createData.acronym}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
            <input
              type="text"
              name="type"
              placeholder="Tipo"
              value={createData.type}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
          </div>

          <div className="admin-form-group">
            <label>Contacto</label>
            <input
              type="text"
              name="contactInfo"
              placeholder="Correo/teléfono/contacto"
              value={createData.contactInfo}
              onChange={handleCreateInputChange}
              className="admin-input"
            />
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
              <th>Acrónimo</th>
              <th>Contacto</th>
              <th>Disciplinas</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {institutions.map((institution) => (
              <tr key={institution.id}>
                <td>
                  {editingId === institution.id ? (
                    <input
                      type="text"
                      name="name"
                      placeholder="Nombre"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="admin-input"
                    />
                  ) : (
                    institution.name
                  )}
                </td>
                <td>
                  {editingId === institution.id ? (
                    <input
                      type="text"
                      name="acronym"
                      placeholder="Acrónimo"
                      value={formData.acronym}
                      onChange={handleInputChange}
                      className="admin-input"
                    />
                  ) : (
                    institution.acronym || '-'
                  )}
                </td>
                <td>
                  {editingId === institution.id ? (
                    <input
                      type="text"
                      name="contactInfo"
                      placeholder="Contacto"
                      value={formData.contactInfo}
                      onChange={handleInputChange}
                      className="admin-input"
                    />
                  ) : (
                    institution.contactInfo || '-'
                  )}
                </td>
                <td>
                  {editingId === institution.id ? (
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
                      {institution.disciplines && institution.disciplines.length > 0 ? (
                        institution.disciplines.map((d) => (
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
                  {editingId === institution.id ? (
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
                        onClick={() => handleEdit(institution)}
                      >
                        Editar
                      </button>
                      <button
                        className="admin-btn-delete"
                        onClick={() => handleDelete(institution.id)}
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {institutions.length === 0 && (
        <div className="admin-empty-state">
          <p>No hay instituciones registradas.</p>
        </div>
      )}
    </div>
  );
}
