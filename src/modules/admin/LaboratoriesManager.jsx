import { useState, useEffect, useRef, useMemo } from 'react';
import { apiFetch } from '../../utils/api';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './admin.scss';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}

function LocationMarker({ position, setPosition, setAddress }) {
  const markerRef = useRef(null);

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error al obtener la dirección:", error);
    }
  };

  const updatePosition = (lat, lng) => {
    setPosition(lat, lng);
    fetchAddress(lat, lng);
  };

  useMapEvents({
    click(e) {
      updatePosition(e.latlng.lat, e.latlng.lng);
    },
  });

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const { lat, lng } = marker.getLatLng();
          updatePosition(lat, lng);
        }
      },
    }),
    []
  );

  return position.lat && position.lng ? (
    <Marker
      draggable={true}
      eventHandlers={eventHandlers}
      position={[position.lat, position.lng]}
      ref={markerRef}
    />
  ) : null;
}

export default function LaboratoriesManager() {
  const [laboratories, setLaboratories] = useState([]);
  const [institutions, setInstitutions] = useState([]);
  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    ownerType: 'institution',
    ownerId: ''
  });

  const defaultCenter = [20.5881, -100.3899];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Usamos llamadas independientes para evitar que un fallo en una tire todo el módulo
      const labsData = await apiFetch('/laboratories').catch(() => []);
      const instData = await apiFetch('/institutions').catch(() => []);
      const resData = await apiFetch('/researchers').catch(() => []);

      setLaboratories(labsData || []);
      setInstitutions(instData || []);
      setResearchers(resData || []);
    } catch (err) {
      setError(err.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (lab) => {
    setEditingId(lab.id);
    const isInst = !!lab.institution;
    setFormData({
      name: lab.name || '',
      address: lab.address || '',
      latitude: lab.latitude || '',
      longitude: lab.longitude || '',
      ownerType: isInst ? 'institution' : 'researcher',
      ownerId: isInst ? lab.institution?.id : lab.researcher?.id
    });
  };

  const resetForm = () => {
    setFormData({ name: '', address: '', latitude: '', longitude: '', ownerType: 'institution', ownerId: '' });
    setEditingId(null);
    setIsCreating(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'ownerType' ? { ownerId: '' } : {})
    }));
  };

  const handleMapPositionChange = (lat, lng) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  const handleMapAddressChange = (newAddress) => {
    setFormData((prev) => ({ ...prev, address: newAddress }));
  };

  const handleSave = async () => {
    try {
      if (!formData.name || !formData.address || !formData.latitude || !formData.longitude || !formData.ownerId) {
        setError('Completa el nombre, selecciona un punto en el mapa y asigna un propietario.');
        return;
      }

      const payload = {
        name: formData.name,
        address: formData.address,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        institutionId: formData.ownerType === 'institution' ? parseInt(formData.ownerId) : undefined,
        researcherId: formData.ownerType === 'researcher' ? parseInt(formData.ownerId) : undefined,
      };

      if (isCreating) {
        await apiFetch('/laboratories', { method: 'POST', body: JSON.stringify(payload) });
      } else {
        await apiFetch(`/laboratories/${editingId}`, { method: 'PATCH', body: JSON.stringify(payload) });
      }

      await fetchData();
      resetForm();
      setError('');
    } catch (err) {
      setError(err.message || 'Error al guardar el laboratorio');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este laboratorio?')) return;
    try {
      await apiFetch(`/laboratories/${id}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      setError(err.message || 'Error al eliminar');
    }
  };

  const filteredLabs = laboratories.filter((lab) => 
    lab.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lab.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="admin-loading">Cargando laboratorios...</div>;

  const showForm = isCreating || editingId !== null;
  const currentCenter = formData.latitude && formData.longitude 
    ? [formData.latitude, formData.longitude] 
    : defaultCenter;

  return (
    <div className="admin-manager">
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-filters-bar">
        <input 
          type="text" 
          placeholder="Buscar por nombre o dirección..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="admin-filter-input"
        />
      </div>

      {!showForm && (
        <div className="admin-create-section">
          <button className="admin-btn-create" onClick={() => setIsCreating(true)}>
            + Crear Laboratorio
          </button>
        </div>
      )}

      {showForm && (
        <div className="admin-form-container">
          <h3>{isCreating ? 'Nuevo Laboratorio' : 'Editar Laboratorio'}</h3>
          
          <div className="admin-form-row">
            <input type="text" name="name" placeholder="Nombre (ej: Lab. de Robótica)" value={formData.name} onChange={handleInputChange} className="admin-input" />
          </div>

          <div className="admin-form-group">
            <label>Propietario del Laboratorio</label>
            <div className="admin-form-row">
              <select name="ownerType" value={formData.ownerType} onChange={handleInputChange} className="admin-input">
                <option value="institution">Institución</option>
                <option value="researcher">Investigador independiente</option>
              </select>

              <select name="ownerId" value={formData.ownerId} onChange={handleInputChange} className="admin-input">
                <option value="">Selecciona el propietario...</option>
                {formData.ownerType === 'institution' 
                  ? institutions.map(inst => <option key={inst.id} value={inst.id}>{inst.name}</option>)
                  : researchers.map(res => <option key={res.id} value={res.id}>{res.firstName} {res.lastNameP}</option>)
                }
              </select>
            </div>
          </div>

          <div className="admin-form-group">
            <label>Ubicación (Haz clic en el mapa o arrastra el pin)</label>
            
            {/* Contenedor del Mapa con el resicer automático */}
            <div style={{ height: '300px', width: '100%', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden', border: '1px solid #ddd', zIndex: 0 }}>
              <MapContainer center={currentCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <MapResizer />
                <TileLayer
                  attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
                />
                <LocationMarker 
                  position={{ lat: formData.latitude, lng: formData.longitude }} 
                  setPosition={handleMapPositionChange}
                  setAddress={handleMapAddressChange}
                />
              </MapContainer>
            </div>

            <input 
              type="text" 
              name="address" 
              placeholder="La dirección se autocompletará al hacer clic en el mapa..." 
              value={formData.address} 
              onChange={handleInputChange} 
              className="admin-input" 
            />
          </div>

          <div className="admin-form-actions">
            <button className="admin-btn-save" onClick={handleSave}>{isCreating ? 'Crear' : 'Guardar'}</button>
            <button className="admin-btn-cancel" onClick={resetForm}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Propietario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredLabs.length === 0 ? (
              <tr><td colSpan="4" className="admin-empty-text">No se encontraron laboratorios.</td></tr>
            ) : (
              filteredLabs.map((lab) => (
                <tr key={lab.id}>
                  <td>{lab.name}</td>
                  <td>
                    {lab.address}
                    <div style={{fontSize: '0.75em', color: '#888', marginTop: '4px'}}>
                      {lab.latitude}, {lab.longitude}
                    </div>
                  </td>
                  <td>
                    {lab.institution ? (
                      <span className="admin-badge-type">Inst: {lab.institution.acronym || lab.institution.name}</span>
                    ) : (
                      <span className="admin-badge-type" style={{backgroundColor: '#e3f2fd', color: '#1565c0'}}>
                        Inv: {lab.researcher?.firstName} {lab.researcher?.lastNameP}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="admin-actions">
                      <button className="admin-btn-edit" onClick={() => handleEdit(lab)}>Editar</button>
                      <button className="admin-btn-delete" onClick={() => handleDelete(lab.id)}>Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}