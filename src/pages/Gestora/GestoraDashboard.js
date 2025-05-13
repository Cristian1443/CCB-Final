import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import DashboardLayout from '../../components/DashboardLayout';
import EventItem from '../../components/EventItem'; // Asegúrate de que esta ruta sea correcta
import './GestoraDashboard.css'; // Asegúrate de que esta importación exista
// Importa iconos si los usas, por ejemplo:
// import { FaPlus, FaArrowRight } from 'react-icons/fa';

// Datos de ejemplo para los próximos eventos en el Dashboard
const upcomingMockEvents = [
    {
        id: '1',
        title: 'Taller de Economía Popular',
        location: 'Auditorio Principal',
        date: '2025-11-14',
        time: '09:00',
        modality: 'Presencial',
        status: 'Programado',
        instructor: 'Andreina Ustate',
        participants: 45
    },
    {
        id: '2',
        title: 'Marketing Digital para Emprendedores',
        location: 'Plataforma Virtual',
        date: '2025-11-17',
        time: '14:00',
        modality: 'Virtual',
        status: 'Programado',
        instructor: 'Julie Sáenz Castañeda',
        participants: 32
    },
     {
        id: '3',
        title: 'Estrategias Financieras - Sector Moda',
        location: 'Sede Norte',
        date: '2025-11-21',
        time: '10:30',
        modality: 'Hibrida',
        status: 'Programado',
        instructor: 'Tatiana Prieto',
        participants: 28
    },
     {
        id: '4',
        title: 'Innovación y Modelos de Negocio',
        location: 'Centro de Innovación',
        date: '2025-11-24',
        time: '08:00',
        modality: 'Presencial',
        status: 'Programado',
        instructor: 'Johana Suescun',
        participants: 36
    },
    // Puedes añadir más eventos próximos aquí
];


function GestoraDashboard() {
    // Obtiene la función de navegación proporcionada por react-router-dom
    const navigate = useNavigate();

    const [scheduledEventsCount, setScheduledEventsCount] = useState(10);
    const [instructorsCount, setInstructorsCount] = useState(8);
    const [nextEvent, setNextEvent] = useState({
        title: 'Taller de Economía Popular',
        date: '14 nov'
    });

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        setLoading(true);
        try {
            // Simula la carga de datos con un pequeño retraso
            setTimeout(() => {
                setUpcomingEvents(upcomingMockEvents);
                setLoading(false);
            }, 500);

        } catch (err) {
            setError('Error al cargar los datos del dashboard.');
            setLoading(false);
            console.error(err);
        }

    }, []);


    // Función para manejar la eliminación de un evento (funcionalidad no completa en este ejemplo)
    const handleDeleteUpcomingEvent = (id) => {
        console.log('Eliminar próximo evento con ID:', id);
        setUpcomingEvents(upcomingEvents.filter(event => event.id !== id));
        alert('Funcionalidad de eliminar próximo evento no implementada completamente.');
    };

    // Función para manejar la edición de un evento próximo
    // ***** CAMBIO: Ahora navega a la página de edición *****
    const handleEditUpcomingEvent = (id) => {
        console.log('Navegando a editar evento con ID:', id);
        // Navega a la ruta de edición, pasando el ID del evento
        // ASEGÚRATE DE QUE LA RUTA '/gestora/eventos/editar/:id' ESTÁ CONFIGURADA EN TU App.js
        navigate(`/gestora/eventos/editar/${id}`);
    };

    // Función clave: Maneja el clic del botón "Nueva Programación"
    // Modifica esta función para navegar a la página de creación de eventos
    const handleNewEventClick = () => {
        console.log('Clic en Nueva Programación. Navegando...');
        // Utiliza la función navigate para ir a la ruta de la página de nueva programación
        // Asume que la ruta para crear un nuevo evento es '/gestora/nuevo-evento'
        // ¡IMPORTANTE! Esta ruta debe coincidir con la definida en tu archivo de rutas (ej: App.js)
        navigate('/gestora/nuevo-evento');
    };

    // Modifica esta función para navegar a la página de lista de eventos
    const handleViewAllEventsClick = () => {
        console.log('Clic en Ver todos los eventos. Navegando...');
        // Asume que la ruta para la lista de eventos es '/gestora/eventos'
        // ¡IMPORTANTE! Esta ruta debe coincidir con la definida en tu archivo de rutas (ej: App.js)
        navigate('/gestora/eventos');
    };


    return (
        <DashboardLayout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Dashboard</h1>
                </div>

                <div className="summary-cards">
                    <div className="card">
                        <h2>Eventos Programados</h2>
                        <p>{scheduledEventsCount}</p>
                    </div>
                    <div className="card">
                        <h2>Instructores</h2>
                        <p>{instructorsCount}</p>
                    </div>
                    <div className="card">
                        <h2>Próximo Evento</h2>
                        <p>{nextEvent.title} - {nextEvent.date}</p>
                    </div>
                </div>

                <div className="upcoming-events-section">
                    <div className="section-header">
                        <h2>Próximos Eventos</h2>
                        {/* El botón llama a la función de navegación cuando se hace clic */}
                        <button onClick={handleNewEventClick} className="new-event-button">
                            {/* <FaPlus /> */} Nueva Programación
                        </button>
                    </div>

                    {loading ? (
                        <p>Cargando próximos eventos...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : upcomingEvents.length > 0 ? (
                        <div className="upcoming-events-list">
                            {upcomingEvents.map(event => (
                                <EventItem
                                    key={event.id}
                                    event={event}
                                    onEdit={handleEditUpcomingEvent}
                                    onDelete={handleDeleteUpcomingEvent}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="no-upcoming-events">No hay próximos eventos programados.</p>
                    )}

                   <div className="view-all-link">
                        {/* El botón "Ver todos los eventos" también usa la navegación */}
                        <button onClick={handleViewAllEventsClick} className="link-button">
                             {/* <FaArrowRight /> */} Ver todos los eventos
                        </button>
                   </div>

                </div>
            </div>
        </DashboardLayout>
    );
}

export default GestoraDashboard; // Asegúrate de exportar el componente
