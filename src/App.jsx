import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './modules/auth/Login';
import Register from './modules/auth/Register';
import StudentDashboard from './modules/student/StudentDashboard';
import StudentSearch from './modules/student/StudentSearch';
import Explore from './modules/student/Explore';
import Blog from './modules/shared/Blog';
import Profile from './modules/shared/Profile';
import About from './modules/shared/About';
import Testimonials from './modules/shared/Testimonials';
import CookiesNotice from './modules/shared/CookiesNotice';
import AdminDashboard from './modules/admin/AdminDashboard';
import AdminResearchersPage from './modules/admin/AdminResearchersPage';
import AdminInstitutionsPage from './modules/admin/AdminInstitutionsPage';
import AdminDisciplinesPage from './modules/admin/AdminDisciplinesPage';
import ResearcherDashboard from './modules/researcher/ResearcherDashboard';
import ResearcherPublications from './modules/researcher/ResearcherPublications';
import CreatePublication from './modules/researcher/CreatePublication';
import EditPublication from './modules/researcher/EditPublication';
import './styles.scss';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/search" element={<StudentSearch />} />
        <Route path="/explore" element={<Explore />} />

        <Route path="/blog" element={<Blog />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/cookies" element={<CookiesNotice />} />

        <Route path="/researcher/dashboard" element={<ResearcherDashboard />} />
        <Route path="/researcher/publications" element={<ResearcherPublications />} />
        <Route path="/researcher/create-publication" element={<CreatePublication />} />
        <Route path="/researcher/edit-publication/:id" element={<EditPublication />} />

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/researchers" element={<AdminResearchersPage />} />
        <Route path="/admin/institutions" element={<AdminInstitutionsPage />} />
        <Route path="/admin/disciplines" element={<AdminDisciplinesPage />} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
