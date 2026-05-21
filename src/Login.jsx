import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí después conectarás tu API, por ahora solo redirige al dashboard
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-placeholder">Institución / Logo</div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>email</label>
            <input type="email" placeholder="correo@institucion.edu.mx" required />
          </div>
          <div className="input-group">
            <label>password</label>
            <input type="password" placeholder="••••••••" required />
          </div>
          <button type="submit" className="enter-btn">Enter</button>
        </form>
      </div>
    </div>
  );
}

export default Login;