import React, { useState, useEffect } from 'react';
import ConsultorLayout from '../../components/ConsultorLayout'; // Importar el layout específico del consultor
import ConsultorCalendar from '../../components/ConsultorCalendar'; // Importar el componente de calendario
// Ruta corregida para el CSS del dashboard
import '../../styles/consultor-dashboard.css';
// Importa tu hook de autenticación si necesitas obtener el ID del consultor para filtrar eventos
// import { useAuth } from '../../context/AuthContext';

const ConsultorDashboardPage = () => {
  // const { currentUser } = useAuth(); // Obtener el usuario actual para filtrar eventos
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para el evento seleccionado si decides implementar un modal personalizado
  // const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    // Función para cargar los eventos del consultor
    const fetchConsultorEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: Aquí deberías hacer la llamada a tu API para obtener los eventos del consultor
        // Puedes usar el ID del consultor de currentUser para filtrar
        // const consultorId = currentUser?.id;
        // const response = await fetch(`/api/events?consultorId=${consultorId}`);
        // if (!response.ok) throw new Error('Error al cargar los eventos');
        // const data = await response.json();
        // setEvents(data.map(event => ({
        //    ...event,
        //    start: new Date(event.start), // Convertir strings de fecha a objetos Date
        //    end: new Date(event.end),
        // })));

        // Datos mock (simulados) por ahora
        // Asegúrate de que las fechas sean objetos Date
        const mockEvents = [
          {
            id: 1,
            title: 'Taller de Innovación',
            start: new Date(2025, 4, 15, 9, 0), // Año, Mes (0-11), Día, Hora, Minuto
            end: new Date(2025, 4, 15, 12, 0),
            description: 'Taller sobre metodologías ágiles.',
            ubicacion: 'Sala 301',
            gestora: 'Ana García',
            status: 'Pendiente', // Puedes usar este estado para cambiar el color del evento en el calendario
          },
          {
            id: 2,
            title: 'Reunión de Estrategia Anual',
            start: new Date(2025, 4, 20, 14, 0),
            end: new Date(2025, 4, 20, 16, 0),
            description: 'Planificación de estrategias para el próximo trimestre.',
            ubicacion: 'Oficina Principal',
            gestora: 'Juan Pérez',
            status: 'Aceptado',
          },
          {
            id: 3,
            title: 'Seminario de Marketing Digital',
            start: new Date(2025, 5, 5, 10, 0), // Evento en Junio
            end: new Date(2025, 5, 5, 13, 0),
            description: 'Tendencias actuales en marketing digital.',
            ubicacion: 'Online (Zoom)',
            gestora: 'Laura Fernández',
            status: 'Aceptado',
          },
          {
            id: 4,
            title: 'Entrenamiento de Liderazgo',
            start: new Date(2025, 5, 10, 15, 0),
            end: new Date(2025, 5, 10, 17, 0),
            description: 'Desarrollo de habilidades de liderazgo.',
            ubicacion: 'Sala de Juntas',
            gestora: 'Carlos Ruiz',
            status: 'Pendiente',
          },
        ];
        setEvents(mockEvents);
      } catch (err) {
        setError('Hubo un error al cargar los eventos.');
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultorEvents();
  }, [/* currentUser?.id */]); // Dependencia si filtras por consultor

  // Función para manejar cuando se selecciona un evento en el calendario
  const handleSelectEvent = (event) => {
    // react-big-calendar con popup={true} ya muestra un popup básico.
    // Si quieres un modal personalizado, descomenta la línea de abajo
    // y la sección del modal en el JSX.
    // setSelectedEvent(event);
    console.log('Evento seleccionado:', event); // Puedes ver los detalles en la consola
    alert(`Evento: ${event.title}\nFecha: ${event.start.toLocaleDateString()}\nHora: ${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    // Puedes reemplazar el alert con la lógica para abrir tu modal personalizado
  };

  // Función para cerrar el modal de detalles (si implementas uno personalizado)
  // const handleCloseModal = () => {
  //   setSelectedEvent(null);
  // };

  return (
    <ConsultorLayout> {/* Usar el layout específico del consultor */}
      <div className="consultor-dashboard-container">
        <h2>Mi Calendario de Eventos</h2>
        {loading && <p className="loading-message">Cargando eventos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <ConsultorCalendar
            events={events}
            onSelectEvent={handleSelectEvent} // Pasar la función para manejar la selección
          />
        )}

        {/* Sección para un modal de detalles de evento personalizado (OPCIONAL) */}
        {/* Si usas popup={true} en ConsultorCalendar, no necesitas esto */}
        {/* {selectedEvent && (
          <div className="event-detail-modal-overlay" onClick={handleCloseModal}>
            <div className="event-detail-modal-content" onClick={e => e.stopPropagation()}>
              <h3>{selectedEvent.title}</h3>
              <p><strong>Fecha:</strong> {selectedEvent.start.toLocaleDateString()}</p>
              <p><strong>Hora:</strong> {selectedEvent.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {selectedEvent.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              <p><strong>Ubicación:</strong> {selectedEvent.ubicacion}</p>
              <p><strong>Gestora:</strong> {selectedEvent.gestora}</p>
              <p><strong>Descripción:</strong> {selectedEvent.description}</p>
              <button onClick={handleCloseModal} className="close-modal-button">Cerrar</button>
            </div>
          </div>
        )} */}
      </div>
    </ConsultorLayout>
  );
};

export default ConsultorDashboardPage;
