import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../shared/Navbar';
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
    setFormData(prev => ({ ...prev, [name]: value }));
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
      navigate('/researcher/dashboard');
    } catch (err) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Editar Publicación</h1>
          <p>Actualiza la información de tu publicación.</p>
        </header>

        {loading ? (
          <div className="placeholder-card"> Cargando...</div>
        ) : (
          <div className="create-form-container">
            <form onSubmit={handleSave} className="publication-form card">
              <div className="form-left">
                <div className="form-group">
                  <label>Título</label>
                  <input name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Tipo</label>
                  <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="scholarship">Beca de Investigación</option>
                    <option value="internship">Estancia de Prácticas</option>
                    <option value="project">Proyecto de Colaboración</option>
                  </select>
                </div>
              </div>

              <div className="form-right">
                <div className="form-group full-width">
                  <label>Descripción</label>
                  <textarea name="description" rows={8} value={formData.description} onChange={handleChange} />
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-cancel" onClick={() => navigate('/researcher/dashboard')}>Cancelar</button>
                  <button type="submit" className="btn-submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</button>
                </div>

                {error && <div className="alert alert-error"> {error}</div>}
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
