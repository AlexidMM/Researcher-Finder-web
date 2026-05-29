import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from '../../utils/api';
import './auth.scss';

export default function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastNameP: '',
    lastNameM: '',
    email: '',
    password: '',
    institutionId: '' // Lo empezamos vacío
  });
  
  const [institutions, setInstitutions] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Cargamos las instituciones al abrir la página
  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const data = await apiFetch('/institutions');
        // Filtramos solo las universidades públicas
        const publicUnis = data.filter(inst => inst.type === 'Universidad Pública');
        setInstitutions(publicUnis);

        // Si hay resultados, seleccionamos la primera por defecto
        if (publicUnis.length > 0) {
          setFormData(prev => ({ ...prev, institutionId: publicUnis[0].id }));
        }
      } catch (err) {
        console.error('Error cargando instituciones:', err);
      }
    };

    loadInstitutions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      // Aseguramos que el ID se mande como número a la API
      const payload = {
        ...formData,
        institutionId: Number(formData.institutionId)
      };

      await apiFetch('/auth/register/student', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      alert('¡Registro exitoso! Ahora inicia sesión.');
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="logo-placeholder">Researcher Finder</div>
        <h1>Crear Cuenta</h1>
        <p className="auth-subtitle">Regístrate como alumno</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="input-group">
              <label>Nombre(s)</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Apellido Paterno</label>
              <input type="text" name="lastNameP" value={formData.lastNameP} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Apellido Materno</label>
              <input type="text" name="lastNameM" value={formData.lastNameM} onChange={handleChange} />
            </div>
          </div>

          {/* --- AQUÍ ESTÁ EL NUEVO SELECT DE INSTITUCIONES --- */}
          <div className="input-group">
            <label>Institución</label>
            <select 
              name="institutionId" 
              value={formData.institutionId} 
              onChange={handleChange} 
              required
            >
              {institutions.length === 0 ? (
                <option value="">Cargando instituciones...</option>
              ) : (
                institutions.map(inst => (
                  <option key={inst.id} value={inst.id}>
                    {inst.name} ({inst.acronym})
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="input-group">
            <label>Correo Electrónico</label>
            <input type="email" name="email" placeholder="ejemplo@uteq.edu.mx" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="input-group">
            <label>Contraseña</label>
            <input type="password" name="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength="6" />
          </div>

          <button type="submit" className="enter-btn" disabled={isLoading}>
            {isLoading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>
        </div>
      </div>
    </div>
  );
}