// src/pages/Gestora/ConsultorFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import './ConsultorFormPage.css';

// =========================================================================
// Datos Mock de consultores con eventos asignados detallados
// AÑADIMOS HORA DE FIN (endTime) a los eventos para mejor simulación de disponibilidad
// =========================================================================
const mockConsultores = [
    {
        id: 1,
        nombre: 'Andreína Ustate',
        especialidad: 'Finanzas corporativas',
        contacto: { email: 'austate@uniempresarial.edu.co', telefono: '3052512922' },
        eventos: 12,
        assignedEvents: [
            // Formato: { id, title, date, time (start), endTime, location, status }
            { id: 101, title: 'Taller de Presupuesto', date: '2025-06-10', time: '09:00', endTime: '11:00', location: 'Aula 301', status: 'Scheduled' },
            { id: 102, title: 'Curso de Inversiones', date: '2025-07-15', time: '14:00', endTime: '16:00', location: 'Online', status: 'Completed' }
        ]
    },
    {
        id: 2,
        nombre: 'Julie Sáenz Castañeda',
        especialidad: 'Innovación y emprendimiento',
        contacto: { email: 'jsaenzc@uniempresarial.edu.co', telefono: '3118131235' },
        eventos: 8,
        assignedEvents: [
            { id: 201, title: 'Seminario de Design Thinking', date: '2025-08-20', time: '10:30', endTime: '12:30', location: 'Auditorio Principal', status: 'Scheduled' }
        ]
    },
    {
        id: 3,
        nombre: 'Tatiana Prieto',
        especialidad: 'Marketing y ventas',
        contacto: { email: 'tprieto@uniempresarial.edu.co', telefono: '3012148031' },
        eventos: 15,
        assignedEvents: [
            { id: 301, title: 'Taller de Ventas Digitales', date: '2025-09-05', time: '09:00', endTime: '11:00', location: 'Sala de Juntas', status: 'Scheduled' },
            { id: 302, title: 'Curso de SEO', date: '2025-10-10', time: '16:00', endTime: '18:00', location: 'Online', status: 'Scheduled' },
            { id: 303, title: 'Webinar de Redes Sociales', date: '2025-11-18', time: '11:00', endTime: '12:00', location: 'Online', status: 'Completed' },
            { id: 304, title: 'Reunión de Seguimiento', date: '2025-09-05', time: '14:00', endTime: '15:00', location: 'Oficina', status: 'Scheduled' } // Otro evento el mismo día
        ]
    },
    {
        id: 4,
        nombre: 'Carlos Rojas',
        especialidad: 'Gestión de Proyectos',
        contacto: { email: 'crojas@uniempresarial.edu.co', telefono: '3201234567' },
        eventos: 5,
        assignedEvents: [] // Este consultor no tiene eventos asignados en los datos mock
    },
];
// =========================================================================


function ConsultorFormPage() {
    const { consultorId } = useParams();
    const navigate = useNavigate();

    const [consultor, setConsultor] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        especialidad: '',
        contacto: { email: '', telefono: '' },
    });
    const [assignedEvents, setAssignedEvents] = useState([]);

    // ==============================================================
    // Estado para la verificación de disponibilidad (se mantiene)
    // ==============================================================
    const [checkDate, setCheckDate] = useState('');
    const [checkTime, setCheckTime] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    // ==============================================================

    // ==============================================================
    // Estado para la sugerencia de disponibilidad
    // ==============================================================
    const [suggestedAvailability, setSuggestedAvailability] = useState('');
    // ==============================================================


    useEffect(() => {
        if (consultorId) {
            const foundConsultor = mockConsultores.find(c => c.id === parseInt(consultorId));

            if (foundConsultor) {
                setConsultor(foundConsultor);
                setFormData({
                    nombre: foundConsultor.nombre,
                    especialidad: foundConsultor.especialidad,
                    contacto: { ...foundConsultor.contacto },
                });
                const events = foundConsultor.assignedEvents || [];
                setAssignedEvents(events);
                // Generar sugerencia de disponibilidad al cargar el consultor
                setSuggestedAvailability(generateAvailabilitySummary(events, foundConsultor.nombre));

            } else {
                console.error('Consultor no encontrado con ID:', consultorId);
                navigate('/gestora/consultores');
            }
        } else {
            setConsultor(null);
            setFormData({
                nombre: '',
                especialidad: '',
                contacto: { email: '', telefono: '' },
            });
            setAssignedEvents([]);
            setSuggestedAvailability(''); // Limpiar sugerencia para nuevo consultor
        }
    }, [consultorId, navigate]);


    // ==============================================================
    // Lógica para generar resumen de disponibilidad
    // ==============================================================
    const generateAvailabilitySummary = (events, consultorName) => {
        if (!events || events.length === 0) {
            return `El consultor ${consultorName} no tiene eventos asignados actualmente. Es probable que esté disponible.`;
        }

        // Agrupar eventos por fecha
        const eventsByDate = events.reduce((acc, event) => {
            const date = event.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(event);
            return acc;
        }, {});

        let summary = `Basado en los ${events.length} eventos asignados a ${consultorName}:\n\n`;

        // Ordenar fechas cronológicamente
        const sortedDates = Object.keys(eventsByDate).sort();

        sortedDates.forEach(date => {
            summary += `En la fecha ${date}:\n`;
            // Ordenar eventos por hora de inicio
            const sortedEvents = eventsByDate[date].sort((a, b) => {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
                return 0;
            });

            sortedEvents.forEach(event => {
                summary += `- Ocupado de ${event.time} a ${event.endTime} para "${event.title}".\n`;
            });
            summary += '\n'; // Espacio entre días
        });

        summary += 'Es probable que el consultor esté disponible en otras fechas y horarios no listados.';

        return summary;
    };
    // ==============================================================


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email' || name === 'telefono') {
            setFormData({
                ...formData,
                contacto: {
                    ...formData.contacto,
                    [name]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (consultorId) {
            console.log('Guardando cambios para consultor con ID:', consultorId);
            console.log('Datos del formulario:', formData);
            console.log('Eventos asignados (estado actual):', assignedEvents);
            alert(`Funcionalidad Guardar cambios para consultor ${consultorId} no implementada.`);
        } else {
            console.log('Creando nuevo consultor:', formData);
            alert('Funcionalidad Crear nuevo consultor no implementada.');
        }
        // navigate('/gestora/consultores'); // Opcional: Redirigir después de guardar
    };

    const handleDeleteConsultor = () => {
        if (consultor && window.confirm(`¿Estás seguro de que quieres eliminar a ${consultor.nombre}? Esta acción no se puede deshacer.`)) {
            console.log('Eliminando consultor con ID:', consultor.id);
            alert(`Funcionalidad Eliminar consultor ${consultor.id} no implementada.`);
            navigate('/gestora/consultores');
        } else if (!consultorId) {
             navigate('/gestora/consultores');
        }
    };

    const handleDeleteAssignedEvent = (eventIdToDelete) => {
        console.log('Intentando eliminar evento asignado con ID:', eventIdToDelete, 'del consultor con ID:', consultorId);
        if (window.confirm(`¿Estás seguro de que quieres desasignar este evento (ID: ${eventIdToDelete}) del consultor?`)) {
            console.log(`Desasignando evento ${eventIdToDelete} localmente.`);
            const updatedEvents = assignedEvents.filter(event => event.id !== eventIdToDelete);
            setAssignedEvents(updatedEvents);
            // Actualizar sugerencia de disponibilidad después de desasignar
            setSuggestedAvailability(generateAvailabilitySummary(updatedEvents, consultor.nombre));
            alert(`Funcionalidad Desasignar evento ${eventIdToDelete} no implementada en API.`);
        }
    };

     const handleEditAssignedEvent = (eventIdToEdit) => {
         console.log('Clic en Editar evento asignado con ID:', eventIdToEdit);
         navigate(`/gestora/eventos/editar/${eventIdToEdit}`); // Redirige a la página de edición de eventos
     };

    // ==============================================================
    // Lógica para verificar disponibilidad (se mantiene, pero usa endTime)
    // ==============================================================
    const handleCheckAvailability = () => {
        if (!checkDate || !checkTime) {
            setAvailabilityMessage('Por favor, ingresa una fecha y hora para verificar.');
            return;
        }

        if (!assignedEvents || assignedEvents.length === 0) {
            setAvailabilityMessage(`El consultor ${consultor.nombre} no tiene eventos asignados. Parece estar disponible en ${checkDate} a las ${checkTime}.`);
            return;
        }

        // Crear objetos Date para comparar
        // Es crucial usar un formato que Date.parse pueda entender o construir la fecha manualmente
        // con año, mes, día, hora, minuto. Usar 'T' es común para separar fecha y hora en ISO 8601.
        // Asegurarse de que la hora de entrada tenga segundos ':00' si checkTime es solo HH:MM
        const checkDateTimeStr = `${checkDate}T${checkTime}:00`;
        const checkDateTime = new Date(checkDateTimeStr);

        let isAvailable = true;
        let conflictingEvent = null;

        for (const event of assignedEvents) {
            // Crear objetos Date para el inicio y fin del evento
            const eventStartDateTimeStr = `${event.date}T${event.time}:00`;
            const eventEndDateTimeStr = `${event.date}T${event.endTime}:00`;

            const eventStartDateTime = new Date(eventStartDateTimeStr);
            const eventEndDateTime = new Date(eventEndDateTimeStr);

            // Verificar si el tiempo a verificar está dentro del rango del evento
            // La disponibilidad es si el tiempo a verificar NO está entre el inicio y el fin del evento.
            // NOTA: Comparaciones con Date objects directamente pueden ser problemáticas con zonas horarias.
            // Para una simulación simple, comparamos los milisegundos desde la época.
            const checkTimeMs = checkDateTime.getTime();
            const eventStartTimeMs = eventStartDateTime.getTime();
            const eventEndTimeMs = eventEndDateTime.getTime();


            // Check for overlap:
            // The check time is *not* available if it falls within the event's time range.
            // checkTimeMs >= eventStartTimeMs && checkTimeMs < eventEndTimeMs
            // We use < eventEndTimeMs because an event ending at 10:00 means 10:00 is available.
            if (checkTimeMs >= eventStartTimeMs && checkTimeMs < eventEndTimeMs) {
                 isAvailable = false;
                 conflictingEvent = event;
                 break; // Encontramos un conflicto, no necesitamos seguir buscando
            }
        }

        if (isAvailable) {
            setAvailabilityMessage(`El consultor ${consultor.nombre} parece estar disponible en ${checkDate} a las ${checkTime}.`);
        } else {
            setAvailabilityMessage(`El consultor ${consultor.nombre} NO está disponible en ${checkDate} a las ${checkTime}. Tiene asignado el evento "${conflictingEvent.title}" de ${conflictingEvent.time} a ${conflictingEvent.endTime}.`);
        }
    };
    // ==============================================================


    if (consultorId && !consultor) {
        return <DashboardLayout><div>Cargando consultor...</div></DashboardLayout>;
    }

    return (
        <DashboardLayout>
            <h1>{consultorId ? 'Editar Consultor' : 'Nuevo Consultor'}</h1>

            <form className="consultor-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre:</label>
                    <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="especialidad">Especialidad:</label>
                    <input
                        type="text"
                        id="especialidad"
                        name="especialidad"
                        value={formData.especialidad}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <h3>Contacto</h3>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.contacto.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="telefono">Teléfono:</label>
                    <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.contacto.telefono}
                        onChange={handleInputChange}
                    />
                </div>

                {/* ============================================================== */}
                {/* Sección de Verificación de Disponibilidad Específica */}
                {/* ============================================================== */}
                 {consultor && (
                    <div className="availability-check-section">
                        <h3>Verificar Disponibilidad Específica</h3>
                        <p>Consulta si el consultor está disponible en una fecha y hora exactas.</p>
                        <div className="availability-inputs">
                            <div className="form-group">
                                <label htmlFor="checkDate">Fecha:</label>
                                <input
                                    type="date"
                                    id="checkDate"
                                    name="checkDate"
                                    value={checkDate}
                                    onChange={(e) => setCheckDate(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="checkTime">Hora:</label>
                                <input
                                    type="time"
                                    id="checkTime"
                                    name="checkTime"
                                    value={checkTime}
                                    onChange={(e) => setCheckTime(e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="check-availability-button"
                                onClick={handleCheckAvailability}
                            >
                                Verificar
                            </button>
                        </div>
                        {availabilityMessage && (
                            <p className={`availability-message ${availabilityMessage.includes('NO está disponible') ? 'not-available' : 'available'}`}>
                                {availabilityMessage}
                            </p>
                        )}
                    </div>
                 )}
                {/* ============================================================== */}

                {/* ============================================================== */}
                {/* Sección de Sugerencia de Disponibilidad (Nuevo) */}
                {/* ============================================================== */}
                 {consultor && (
                    <div className="suggested-availability-section">
                        <h3>Resumen de Horarios Ocupados</h3>
                        <p>Aquí puedes ver un resumen de los horarios en los que el consultor tiene eventos asignados.</p>
                        {suggestedAvailability ? (
                            <pre className="availability-summary">{suggestedAvailability}</pre>
                        ) : (
                            <p>Generando resumen de disponibilidad...</p>
                        )}
                    </div>
                 )}
                {/* ============================================================== */}


                {/* ============================================================== */}
                {/* Sección de Eventos Asignados (Formato Lista) - Se mantiene */}
                {/* ============================================================== */}
                {consultor && (
                    <div className="assigned-events-section">
                        <h3>Eventos Asignados ({assignedEvents.length})</h3>
                        {assignedEvents.length > 0 ? (
                            <div className="assigned-events-list-container"> {/* Contenedor para la lista */}
                                {/* Encabezado de la lista de eventos asignados */}
                                <div className="assigned-events-list-header">
                                    <div className="header-cell event-title-col">TÍTULO</div>
                                    <div className="header-cell event-date-col">FECHA</div>
                                    <div className="header-cell event-time-col">HORA INICIO</div> {/* Cambiado a Hora Inicio */}
                                    <div className="header-cell event-endTime-col">HORA FIN</div> {/* Nueva columna */}
                                    <div className="header-cell event-location-col">LUGAR</div>
                                    <div className="header-cell event-status-col">ESTADO</div>
                                    <div className="header-cell event-actions-col">ACCIONES</div> {/* Columna para botones */}
                                </div>
                                {/* Lista de eventos asignados */}
                                <div className="assigned-events-list-body">
                                    {assignedEvents.map(event => (
                                        <div key={event.id} className="assigned-event-list-item"> {/* Cada fila de evento */}
                                            <div className="event-cell event-title-col">{event.title}</div>
                                            <div className="event-cell event-date-col">{event.date}</div>
                                            <div className="event-cell event-time-col">{event.time}</div> {/* Muestra Hora Inicio */}
                                            <div className="event-cell event-endTime-col">{event.endTime}</div> {/* Muestra Hora Fin */}
                                            <div className="event-cell event-location-col">{event.location}</div>
                                            <div className="event-cell event-status-col">{event.status}</div>
                                            <div className="event-cell event-actions-col"> {/* Contenedor para botones */}
                                                <button
                                                    type="button"
                                                    className="assigned-event-action-button edit-assigned-event-button"
                                                    onClick={() => handleEditAssignedEvent(event.id)}
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    type="button"
                                                    className="assigned-event-action-button delete-assigned-event-button"
                                                    onClick={() => handleDeleteAssignedEvent(event.id)}
                                                >
                                                    Desasignar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <p>No hay eventos asignados a este consultor.</p>
                        )}
                        {/* Aquí podrías añadir un botón para asignar un nuevo evento */}
                        {/* <button type="button">Asignar Evento</button> */}
                    </div>
                )}
                {/* ============================================================== */}


                <div className="form-actions">
                    <button type="submit" className="save-button">
                        Guardar Cambios
                    </button>

                    {consultorId && (
                        <button type="button" className="delete-consultor-button" onClick={handleDeleteConsultor}>
                            Eliminar Consultor
                        </button>
                    )}

                    <button type="button" className="cancel-button" onClick={() => navigate('/gestora/consultores')}>
                         Cancelar
                     </button>
                </div>
            </form>
        </DashboardLayout>
    );
}

export default ConsultorFormPage;
