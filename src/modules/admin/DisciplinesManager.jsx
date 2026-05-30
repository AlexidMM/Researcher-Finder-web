import { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './admin.scss';

export default function DisciplinesManager() {
  const [disciplines, setDisciplines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchDisciplines();
  }, []);

  const fetchDisciplines = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/disciplines');
      setDisciplines(data || []);
    } catch (err) {
      setError(err.message || 'Error al cargar disciplinas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (discipline) => {
    setEditingId(discipline.id);
    setFormData({
      name: discipline.name || '',
      description: discipline.description || '',
    });
    setIsCreating(false);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingId(null);
    setFormData({ name: '', description: '' });
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', description: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      if (isCreating) {
        await apiFetch('/disciplines', {
          method: 'POST',
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
          }),
        });
      } else {
        await apiFetch(`/disciplines/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
          }),
        });
      }

      await fetchDisciplines();
      handleCancel();
    } catch (err) {
      setError(err.message || 'Error al guardar cambios');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta disciplina?')) return;
    try {
      await apiFetch(`/disciplines/${id}`, { method: 'DELETE' });
      await fetchDisciplines();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
      console.error(err);
    }
  };

  if (loading) return <div className="admin-loading">Cargando disciplinas...</div>;

  return (
    <div className="admin-manager">
      {error && <div className="admin-error">{error}</div>}

      {!isCreating && !editingId && (
        <div className="admin-create-section">
          <button className="admin-btn-create" onClick={handleCreate}>
            + Crear Nueva Disciplina
          </button>
        </div>
      )}

      {(isCreating || editingId) && (
        <div className="admin-form-container">
          <h3>{isCreating ? 'Nueva Disciplina' : 'Editar Disciplina'}</h3>
          <div className="admin-form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              placeholder="Nombre de la disciplina"
              value={formData.name}
              onChange={handleInputChange}
              className="admin-input"
            />
          </div>
          <div className="admin-form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              placeholder="Descripción de la disciplina"
              value={formData.description}
              onChange={handleInputChange}
              className="admin-input admin-textarea"
            />
          </div>
          <div className="admin-form-actions">
            <button className="admin-btn-save" onClick={handleSave}>
              Guardar
            </button>
            <button className="admin-btn-cancel" onClick={handleCancel}>
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
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {disciplines.map((discipline) => (
              <tr key={discipline.id}>
                <td>{discipline.name}</td>
                <td>{discipline.description || '-'}</td>
                <td>
                  <div className="admin-actions">
                    <button
                      className="admin-btn-edit"
                      onClick={() => handleEdit(discipline)}
                    >
                      Editar
                    </button>
                    <button
                      className="admin-btn-delete"
                      onClick={() => handleDelete(discipline.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {disciplines.length === 0 && (
        <div className="admin-empty-state">
          <p>No hay disciplinas registradas.</p>
        </div>
      )}
    </div>
  );
}
