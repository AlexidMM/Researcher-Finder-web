import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { apiFetch } from '../../utils/api';
import './auth.scss';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user));

      if (response.user.role === 'student') {
        navigate('/student/dashboard');
      } else if (response.user.role === 'researcher') {
        navigate('/researcher/dashboard');
      } else if (response.user.role === 'admin') {
        navigate('/admin/dashboard'); 
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Agregamos el placeholder del logo para que haga juego con el Register */}
        <div className="logo-placeholder">Researcher Finder</div>
        
        <h1>Bienvenido</h1>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          {/* Cambiamos form-group por input-group */}
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input 
              type="email" 
              id="email" 
              placeholder="ejemplo@uteq.edu.mx" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          {/* Cambiamos btn-primary por enter-btn */}
          <button type="submit" className="enter-btn" disabled={isLoading}>
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="auth-footer">
          <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  );
}