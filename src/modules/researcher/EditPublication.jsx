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
  const [laboratories, setLaboratories] = useState([]);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    type: 'scholarship',
    laboratoryId: '' 
  });

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [pubData, allLabs] = await Promise.all([
        apiFetch(`/publications/${id}`),
        apiFetch('/laboratories')
      ]);

      const user = JSON.parse(localStorage.getItem('user') || '{}');
      let profile;
      try { profile = await apiFetch(`/users/${user.id}`); } catch (e) { profile = {}; }
      
      const myLabs = allLabs.filter(lab => 
        (lab.researcher?.id === profile.researcher?.id) || 
        (lab.institution?.id === profile.researcher?.affiliation?.id)
      );
      setLaboratories(myLabs.length > 0 ? myLabs : allLabs); 

      setFormData({
        title: pubData.title || '',
        description: pubData.description || '',
        type: pubData.type || 'scholarship',
        laboratoryId: pubData.laboratory?.id || '',
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
      const payload = {
        ...formData,
        laboratoryId: formData.laboratoryId ? parseInt(formData.laboratoryId) : null
      };

      await apiFetch(`/publications/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
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
              <div className="form-group">
                <label htmlFor="laboratoryId">Sede / Laboratorio</label>
                <select id="laboratoryId" name="laboratoryId" value={formData.laboratoryId} onChange={handleChange}>
                  <option value="">No especificar sede</option>
                  {laboratories.map((lab) => (
                    <option key={lab.id} value={lab.id}>
                      {lab.name}
                    </option>
                  ))}
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