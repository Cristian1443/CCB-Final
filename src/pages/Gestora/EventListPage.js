import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import DashboardLayout from '../../components/DashboardLayout'; // Asegúrate de que esta ruta sea correcta
import EventItem from '../../components/EventItem'; // Asegúrate de que esta ruta sea correcta
import './EventListPage.css'; // Asegúrate de que esta importación exista
// Importa iconos si los usas, por ejemplo:
import { FaPlus, FaArrowLeft } from 'react-icons/fa'; // Importa los iconos necesarios

function EventListPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estados para filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [filterModality, setFilterModality] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');

  // Obtiene la función de navegación
  const navigate = useNavigate(); // <-- Inicializa useNavigate

  useEffect(() => {
  const loadEvents = () => {
    try {
      setLoading(true);
      const storedEvents = JSON.parse(localStorage.getItem('eventos')) || [];
if (storedEvents.length === 0) {
  const defaultEvents = [
    {
      id: 1,
      title: 'Clase de React Básico',
      date: '2025-05-20',
      time: '10:00',
      instructor: 'Juan Pérez',
      location: 'Aula 1',
      modality: 'Presencial',
      status: 'Programado',
    },
    {
      id: 2,
      title: 'Taller de CSS Grid',
      date: '2025-05-22',
      time: '14:00',
      instructor: 'Laura Gómez',
      location: 'Online',
      modality: 'Virtual',
      status: 'Programado',
    },
  ];
  localStorage.setItem('eventos', JSON.stringify(defaultEvents)); // <-- CLAVE CORREGIDA
  setEvents(defaultEvents);
} else {
  setEvents(storedEvents);
}


      setLoading(false);
    } catch (err) {
      setError('Error al cargar los eventos.');
      setLoading(false);
    }
  };

  loadEvents();
}, []);


  // Función para manejar la eliminación de un evento
  const handleDelete = (id) => {
  if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
    try {
      const updatedEvents = events.filter(event => event.id !== id);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      alert('Evento eliminado con éxito.');
    } catch (err) {
      setError('Error al eliminar el evento.');
      console.error(err);
    }
  }
};


  // Función para manejar la edición de un evento (redirigir a la página de edición)
  const handleEdit = (id) => {
    console.log('Navegando a editar evento con ID:', id);
    // Navega a la ruta de edición, pasando el ID del evento
    // ASEGÚRATE DE QUE LA RUTA '/gestora/eventos/editar/:id' ESTÁ CONFIGURADA EN TU App.js
    navigate(`/gestora/eventos/editar/${id}`);
  };

  // ** Funciones para manejar la navegación de los botones principales con rutas específicas corregidas **
  const handleAddEvent = () => {
    console.log('Navegando a la página para agregar nueva programación');
    // Navega a la ruta para crear un nuevo evento - RUTA CORREGIDA SEGÚN App.js
    navigate('/gestora/nueva-programacion');
  };

  const handleGoToDashboard = () => {
    console.log('Navegando de vuelta al dashboard');
    // Navega a la ruta del dashboard principal - RUTA CORREGIDA SEGÚN App.js
    navigate('/gestora');
  };
  // ** Fin de funciones de navegación **


  // Filtrar eventos basado en los estados de filtro
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModality = filterModality === 'all' || event.modality === filterModality;
    const matchesStatus = filterStatus === 'all' || event.status === filterStatus;

    // Logic to match date filter
    const matchesDate = filterDate === '' || event.date === filterDate;

    // Logic to match time filter
    const matchesTime = filterTime === '' || event.time === filterTime;


    // Combine all filters
    return matchesSearch && matchesModality && matchesStatus && matchesDate && matchesTime;
  });

  if (loading) {
    return (
      <DashboardLayout> {/* Envuelve el mensaje de carga también */}
        <div className="event-list-container">Cargando eventos...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout> {/* Envuelve el mensaje de error también */}
        <div className="event-list-container error-message">{error}</div>
      </DashboardLayout>
    );
  }

  return (
    // ENVUELVE TODO EL CONTENIDO CON DashboardLayout
    <DashboardLayout>
      {/* El contenido de la lista de eventos va AQUÍ DENTRO */}
      <div className="event-list-container">
        <div className="list-header">
          <h2>Lista de Eventos</h2>
          {/* Botones de acción en la parte superior */}
          <div className="header-actions">
            {/* Botón de "Agregar Programación" */}
            <button
                className="btn-add-programacion" // Clase CSS para el estilo premium
                onClick={handleAddEvent} // Llama a la función de navegación con la ruta correcta
            >
                <FaPlus /> Agregar Programación
            </button>
            {/* Botón de "Volver al Dashboard" */}
            <button
                className="btn-go-to-dashboard" // Clase CSS para el estilo premium
                onClick={handleGoToDashboard} // Llama a la función de navegación con la ruta correcta
            >
                <FaArrowLeft /> Volver al Dashboard
            </button>
          </div>
        </div>

        {/* Sección de filtros */}
        <div className="filter-section">
          <input
            type="text"
            placeholder="Buscar (Título, Lugar, Instructor)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
          <select
            value={filterModality}
            onChange={(e) => setFilterModality(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todas las Modalidades</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
            <option value="Hibrida">Híbrida</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">Todos los Estados</option>
            <option value="Programado">Programado</option>
            <option value="Completado">Completado</option>
            <option value="Cancelado">Cancelado</option>
            {/* Agrega otros estados si los tienes */}
          </select>
            {/* Filter fields for date and time */}
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="filter-input"
            />
            <input
              type="time"
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="filter-input"
            />
        </div>


        {/* Lista de EventItems */}
        <div className="event-items-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventItem
                key={event.id}
                event={event}
                onEdit={handleEdit} // <-- Pasa la función handleEdit aquí
                onDelete={handleDelete}
              />
            ))
          ) : (
            <p className="no-events-message">
                {searchTerm || filterModality !== 'all' || filterStatus !== 'all' || filterDate || filterTime
                    ? 'No se encontraron eventos que coincidan con los criterios de filtro.'
                    : 'No hay eventos para mostrar.'
                }
            </p>
          )}
        </div>

        {/* Aquí podrías añadir paginación si es necesario */}
        {/* <div className="pagination">...</div> */}
      </div>
      {/* FIN del contenido de la lista de eventos */}
    </DashboardLayout>
  );
}

export default EventListPage;
