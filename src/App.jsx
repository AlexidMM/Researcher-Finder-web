import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/auth/Login';
import Register from './modules/auth/Register';
import StudentDashboard from './modules/student/StudentDashboard';
import Explore from './modules/student/Explore';
import Blog from './modules/shared/Blog';
import Profile from './modules/shared/Profile';
import About from './modules/shared/About';
import Testimonials from './modules/shared/Testimonials';
import CookiesNotice from './modules/shared/CookiesNotice';
import AdminDashboard from './modules/admin/AdminDashboard';
import ResearcherDashboard from './modules/researcher/ResearcherDashboard';
import CreatePublication from './modules/researcher/CreatePublication';
import EditPublication from './modules/researcher/EditPublication';
import './styles.scss'; // Tus estilos globales

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas Públicas (Autenticación) */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas Privadas de Estudiantes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/explore" element={<Explore />} />

          {/* Nueva ruta para el Blog */}
        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/cookies" element={<CookiesNotice />} />

        {/* Rutas Privadas de Investigadores */}
        <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
        <Route path="/researcher/create-publication" element={<CreatePublication />} />
        <Route path="/researcher/edit-publication/:id" element={<EditPublication />} />

        {/* Rutas Privadas de Administradores */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Ruta comodín: Si alguien escribe una ruta que no existe, mándalo al Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;