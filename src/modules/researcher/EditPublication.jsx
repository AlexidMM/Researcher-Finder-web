import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageShell from '../shared/PageShell';
import SectionHeader from '../shared/SectionHeader';
import RoleBreadcrumb from '../shared/RoleBreadcrumb';
import { apiFetch } from '../../utils/api';
import './researcher.scss';

export default function EditPublication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '', type: 'scholarship' });

  useEffect(() => {
    if (!id) return;
    loadPublication();
  }, [id]);

  const loadPublication = async () => {
    try {
      setLoading(true);
      const data = await apiFetch(`/publications/${id}`);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        type: data.type || 'scholarship',
      });
    } catch (err) {
      setError(err.message || 'No se pudo cargar la publicación');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Título y descripción son obligatorios');
      return;
    }

    try {
      setSaving(true);
      await apiFetch(`/publications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ ...formData }),
      });
      navigate('/researcher/publications');
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell
      wide
      breadcrumb={<RoleBreadcrumb current="Editar publicación" />}
    >
      <SectionHeader
        title="Editar Publicación"
        description="Actualiza la información de tu convocatoria."
      />

      {loading ? (
        <div className="researcher-state-box">Cargando publicación...</div>
      ) : (
        <div className="create-form-container">
          <form onSubmit={handleSave} className="publication-form card">
            <div className="form-left">
              <div className="form-group">
                <label htmlFor="title">Título</label>
                <input id="title" name="title" value={formData.title} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="type">Tipo</label>
                <select id="type" name="type" value={formData.type} onChange={handleChange}>
                  <option value="scholarship">Beca de Investigación</option>
                  <option value="internship">Estancia de Prácticas</option>
                  <option value="project">Proyecto de Colaboración</option>
                </select>
              </div>
            </div>

            <div className="form-right">
              <div className="form-group full-width">
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  rows={8}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate('/researcher/publications')}>
                  Cancelar
                </button>
                <button type="submit" className="btn-submit" disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </button>
              </div>

              {error && <div className="alert alert-error">{error}</div>}
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
