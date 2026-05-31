import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { apiFetch } from '../../utils/api';
import './profile.scss';

export default function Profile() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    studentId: '',
    researcherId: '',
    firstName: '',
    lastNameP: '',
    lastNameM: '',
    institutionId: '',
    institutionName: '',
    affiliationId: '',
    affiliationName: '',
  });
  const [institutions, setInstitutions] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastNameP: '',
    lastNameM: '',
    institutionId: '',
    affiliationId: '',
    disciplines: [],
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);

      if (user.role === 'researcher') {
        const [instData, discData, researchersData] = await Promise.all([
          apiFetch('/institutions'),
          apiFetch('/disciplines'),
          apiFetch('/researchers'),
        ]);

        const institutionList = instData || [];
        const currentResearcher = (researchersData || []).find(
          (researcher) => String(researcher.userId || researcher.user?.id) === String(user.id),
        );
        const currentAffiliationId = currentResearcher?.affiliation?.id || currentResearcher?.affiliationId || '';

        setInstitutions(institutionList);
        setDisciplines(discData || []);
        setProfileData({
          studentId: '',
          researcherId: currentResearcher?.id || '',
          firstName: currentResearcher?.firstName || '',
          lastNameP: currentResearcher?.lastNameP || '',
          lastNameM: currentResearcher?.lastNameM || '',
          institutionId: '',
          institutionName: '',
          affiliationId: String(currentAffiliationId),
          affiliationName: currentResearcher?.affiliation?.name || institutionList.find((inst) => String(inst.id) === String(currentAffiliationId))?.name || '',
        });
        setFormData({
          firstName: '',
          lastNameP: '',
          lastNameM: '',
          institutionId: '',
          affiliationId: '',
          disciplines: currentResearcher?.disciplines?.map((discipline) => discipline.id) || [],
        });
      } else if (user.role === 'student') {
        const [instData, studentsData] = await Promise.all([
          apiFetch('/institutions'),
          apiFetch('/students'),
        ]);

        const institutionList = (instData || []).filter((inst) => inst.type === 'Universidad Pública');
        const currentStudent = (studentsData || []).find(
          (student) => String(student.userId || student.user?.id) === String(user.id),
        );
        const currentInstitutionId = currentStudent?.institution?.id || currentStudent?.institutionId || '';

        setInstitutions(institutionList);
        setProfileData({
          studentId: currentStudent?.id || '',
          researcherId: '',
          firstName: currentStudent?.firstName || '',
          lastNameP: currentStudent?.lastNameP || '',
          lastNameM: currentStudent?.lastNameM || '',
          institutionId: String(currentInstitutionId),
          institutionName: currentStudent?.institution?.name || institutionList.find((inst) => String(inst.id) === String(currentInstitutionId))?.name || '',
          affiliationId: '',
          affiliationName: '',
        });
        setFormData({
          firstName: '',
          lastNameP: '',
          lastNameM: '',
          institutionId: '',
          affiliationId: '',
          disciplines: [],
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al cargar los datos del perfil.' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleDiscipline = (disciplineId) => {
    setFormData((prev) => ({
      ...prev,
      disciplines: prev.disciplines.includes(disciplineId)
        ? prev.disciplines.filter((id) => id !== disciplineId)
        : [...prev.disciplines, disciplineId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (user.role === 'student') {
        const studentId = profileData.studentId || user.student?.id;
        await apiFetch(`/students/${studentId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            firstName: formData.firstName || profileData.firstName,
            lastNameP: formData.lastNameP || profileData.lastNameP,
            lastNameM: formData.lastNameM || profileData.lastNameM,
            institutionId: (formData.institutionId || profileData.institutionId) ? +(formData.institutionId || profileData.institutionId) : undefined,
          }),
        });
      } else if (user.role === 'researcher') {
        const researcherId = profileData.researcherId || user.researcher?.id;
        await apiFetch(`/researchers/${researcherId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            firstName: formData.firstName || profileData.firstName,
            lastNameP: formData.lastNameP || profileData.lastNameP,
            lastNameM: formData.lastNameM || profileData.lastNameM,
            affiliationId: (formData.affiliationId || profileData.affiliationId) ? +(formData.affiliationId || profileData.affiliationId) : undefined,
          }),
        });

        const currentData = await apiFetch(`/researchers/${researcherId}`);
        const currentDisciplines = currentData.disciplines?.map((discipline) => discipline.id) || [];

        for (const disciplineId of formData.disciplines) {
          if (!currentDisciplines.includes(disciplineId)) {
            await apiFetch(`/researchers/${researcherId}/disciplines/${disciplineId}`, { method: 'POST' });
          }
        }

        for (const disciplineId of currentDisciplines) {
          if (!formData.disciplines.includes(disciplineId)) {
            await apiFetch(`/researchers/${researcherId}/disciplines/${disciplineId}`, { method: 'DELETE' });
          }
        }
      }

      const updatedUser = { ...user };
      if (user.role === 'student') {
        updatedUser.student = {
          ...updatedUser.student,
          firstName: formData.firstName || profileData.firstName,
          lastNameP: formData.lastNameP || profileData.lastNameP,
          lastNameM: formData.lastNameM || profileData.lastNameM,
        };
      }
      if (user.role === 'researcher') {
        updatedUser.researcher = {
          ...updatedUser.researcher,
          firstName: formData.firstName || profileData.firstName,
          lastNameP: formData.lastNameP || profileData.lastNameP,
          lastNameM: formData.lastNameM || profileData.lastNameM,
        };
      }

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage({ type: 'success', text: '¡Perfil actualizado con éxito!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Error al guardar los cambios.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard-layout">
        <Navbar />
        <div className="profile-loading">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      <Navbar />

      <main className="dashboard-content">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              {(profileData.firstName || formData.firstName).charAt(0)}{(profileData.lastNameP || formData.lastNameP).charAt(0)}
            </div>
            <div>
              <h1>Mi Perfil</h1>
              <p className="profile-email">{user.email}</p>
              <span className="profile-role-badge">
                {user.role === 'student' ? 'Estudiante' : user.role === 'researcher' ? 'Investigador' : 'Administrador'}
              </span>
            </div>
          </div>

          {message.text && (
            <div className={`profile-alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-grid">
              <div className="input-group">
                <label>Nombre(s)</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  placeholder={profileData.firstName || 'Nombre(s)'}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Apellido Paterno</label>
                <input
                  type="text"
                  name="lastNameP"
                  value={formData.lastNameP}
                  placeholder={profileData.lastNameP || 'Apellido Paterno'}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label>Apellido Materno</label>
                <input
                  type="text"
                  name="lastNameM"
                  value={formData.lastNameM}
                  placeholder={profileData.lastNameM || 'Apellido Materno'}
                  onChange={handleChange}
                />
              </div>

              {user.role === 'student' && (
                <div className="input-group full-width">
                  <label>Institución Educativa</label>
                  <select
                    name="institutionId"
                    value={formData.institutionId || profileData.institutionId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona tu universidad...</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={String(inst.id)}>
                        {inst.name} ({inst.acronym})
                      </option>
                    ))}
                  </select>
                  {profileData.institutionName && !formData.institutionId && (
                    <small className="profile-field-hint">Actual: {profileData.institutionName}</small>
                  )}
                </div>
              )}

              {user.role === 'researcher' && (
                <div className="input-group full-width">
                  <label>Afiliación (Institución)</label>
                  <select
                    name="affiliationId"
                    value={formData.affiliationId || profileData.affiliationId}
                    onChange={handleChange}
                  >
                    <option value="">Investigador Independiente (Ninguna)</option>
                    {institutions.map((inst) => (
                      <option key={inst.id} value={String(inst.id)}>
                        {inst.name} ({inst.acronym})
                      </option>
                    ))}
                  </select>
                  {profileData.affiliationName && !formData.affiliationId && (
                    <small className="profile-field-hint">Actual: {profileData.affiliationName}</small>
                  )}
                </div>
              )}
            </div>

            {user.role === 'researcher' && (
              <div className="disciplines-section">
                <label className="section-label">Mis Disciplinas de Especialidad</label>
                <div className="disciplines-grid">
                  {disciplines.map((discipline) => (
                    <label key={discipline.id} className="discipline-checkbox">
                      <input
                        type="checkbox"
                        checked={formData.disciplines.includes(discipline.id)}
                        onChange={() => toggleDiscipline(discipline.id)}
                      />
                      {discipline.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="btn-save" disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}