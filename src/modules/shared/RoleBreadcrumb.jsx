import { Link } from 'react-router-dom';

function getRoleHome() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (user.role === 'student') {
    return { label: 'Estudiante', to: '/student/dashboard' };
  }
  if (user.role === 'researcher') {
    return { label: 'Investigador', to: '/researcher/dashboard' };
  }
  if (user.role === 'admin') {
    return { label: 'Admin', to: '/admin/dashboard' };
  }

  return { label: 'Inicio', to: '/' };
}

export default function RoleBreadcrumb({ current }) {
  const home = getRoleHome();

  return (
    <>
      <Link to={home.to}>{home.label}</Link> / {current}
    </>
  );
}
