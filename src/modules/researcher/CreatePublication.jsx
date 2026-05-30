import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../shared/Navbar';
import { apiFetch } from '../../utils/api';
import './researcher.scss';

export default function CreatePublication() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'scholarship', // Por defecto
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    // Validaciones básicas
    if (!formData.title.trim()) {
      setError('El título es requerido');
      return;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }

    setLoading(true);

    try {
      // Obtenemos el user_id del token almacenado
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        type: formData.type,
        authorId: user.id,
        status: true,
      };

      await apiFetch('/publications', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      setSuccess('¡Publicación creada exitosamente! 🎉');
      
      // Limpiar formulario
      setFormData({
        title: '',
        description: '',
        type: 'scholarship',
      });

      // Redirigir después de 1.2 segundos
      setTimeout(() => navigate('/researcher/dashboard'), 1200);
    } catch (err) {
      setError(err.message || 'Error al crear la publicación');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      <Navbar />
      
      <main className="dashboard-content">
        <header className="welcome-header">
          <h1>Crear Nueva Publicación</h1>
          <p>Comparte tu oportunidad de investigación, estancia o proyecto con estudiantes interesados.</p>
        </header>

        <div className="create-form-container">
          <form onSubmit={handleSubmit} className="publication-form card">
            <div className="form-left">
              <div className="form-group">
                <label htmlFor="title">Título de la Publicación <span className="required">*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Ej: Estancia en Biología Molecular"
                  value={formData.title}
                  onChange={handleChange}
                  maxLength="255"
                  required
                />
                <small className="char-count">{formData.title.length}/255</small>
              </div>

              <div className="form-group">
                <label htmlFor="type">Tipo de Oportunidad <span className="required">*</span></label>
                <select id="type" name="type" value={formData.type} onChange={handleChange} required>
                  <option value="scholarship">Beca de Investigación</option>
                  <option value="internship">Estancia de Prácticas</option>
                  <option value="project">Proyecto de Colaboración</option>
                </select>
              </div>
            </div>

            <div className="form-right">
              <div className="form-group full-width">
                <label htmlFor="description">Descripción Detallada <span className="required">*</span></label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Describe la oportunidad, requisitos, duración, beneficios, etc..."
                  value={formData.description}
                  onChange={handleChange}
                  rows="10"
                  maxLength="5000"
                  required
                />
                <small className="char-count">{formData.description.length}/5000</small>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => navigate('/researcher/dashboard')}>Cancelar</button>
                <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Publicando...' : '+ Publicar Oportunidad'}</button>
              </div>

              {error && <div className="alert alert-error">⚠️ {error}</div>}
              {success && <div className="alert alert-success">✓ {success}</div>}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
