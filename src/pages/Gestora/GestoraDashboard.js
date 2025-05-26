import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import EventItem from '../../components/EventItem';
import './GestoraDashboard.css';
import { FaPlus, FaArrowRight, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';

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
    const navigate = useNavigate();
    const [scheduledEventsCount, setScheduledEventsCount] = useState(0);
    const [instructorsCount, setInstructorsCount] = useState(0);
    const [nextEvent, setNextEvent] = useState({ title: '', date: '' });
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Detectar cambios en el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function getNextEvent(events) {
        const now = new Date();
        const upcoming = events
            .map(e => ({
                ...e,
                dateTime: new Date(`${e.date}T${e.time}`)
            }))
            .filter(e => e.dateTime > now)
            .sort((a, b) => a.dateTime - b.dateTime);

        return upcoming[0] || null;
    }

    useEffect(() => {
        setLoading(true);

        try {
            const eventosGuardados = JSON.parse(localStorage.getItem("eventos")) || [];
            const eventosFinales = eventosGuardados.length > 0 ? eventosGuardados : upcomingMockEvents;

            // Ordenar eventos por fecha
            const eventosFiltrados = eventosFinales.sort((a, b) => {
                const dateA = new Date(`${a.date}T${a.time}`);
                const dateB = new Date(`${b.date}T${b.time}`);
                return dateA - dateB;
            });

            setUpcomingEvents(eventosFiltrados);
            setScheduledEventsCount(eventosFiltrados.length);

            const instructoresUnicos = [...new Set(eventosFiltrados.map(evento => evento.instructor))];
            setInstructorsCount(instructoresUnicos.length);

            const eventoMasProximo = getNextEvent(eventosFiltrados);
            if (eventoMasProximo) {
                const opcionesFecha = { 
                    day: 'numeric', 
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit'
                };
                const fechaFormateada = new Date(`${eventoMasProximo.date}T${eventoMasProximo.time}`)
                    .toLocaleDateString('es-ES', opcionesFecha);

                setNextEvent({
                    title: isMobile && eventoMasProximo.title.length > 20 
                        ? eventoMasProximo.title.substring(0, 20) + '...' 
                        : eventoMasProximo.title,
                    date: fechaFormateada,
                    location: eventoMasProximo.location,
                    modality: eventoMasProximo.modality
                });
            } else {
                setNextEvent({ 
                    title: "Sin eventos futuros", 
                    date: "",
                    location: "",
                    modality: "" 
                });
            }

            setLoading(false);
        } catch (err) {
            setError("Error al cargar los datos del dashboard.");
            setLoading(false);
            console.error(err);
        }
    }, [isMobile]);

    const handleDeleteUpcomingEvent = (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este evento?')) {
            const updatedEvents = upcomingEvents.filter(event => event.id !== id);
            setUpcomingEvents(updatedEvents);
            localStorage.setItem("eventos", JSON.stringify(updatedEvents));
            setScheduledEventsCount(updatedEvents.length);
        }
    };

    const handleEditUpcomingEvent = (id) => {
        navigate(`/gestora/eventos/editar/${id}`);
    };

    const handleNewEventClick = () => {
        navigate('/gestora/nueva-programacion');
    };

    const handleViewAllEventsClick = () => {
        navigate('/gestora/eventos');
    };

    const renderSummaryCard = (icon, title, value) => (
        <div className="card">
            <div className="card-icon">
                {icon}
            </div>
            <div className="card-content">
                <h2>{title}</h2>
                <p>{value}</p>
            </div>
        </div>
    );

    return (
        <DashboardLayout>
            <div className="dashboard-container">
                <div className="dashboard-header">
                    <h1>Panel de Gestión</h1>
                </div>

                <div className="summary-cards">
                    {renderSummaryCard(
                        <FaCalendarAlt className="card-icon-svg" />,
                        "Eventos Programados",
                        scheduledEventsCount
                    )}
                    {renderSummaryCard(
                        <FaUsers className="card-icon-svg" />,
                        "Instructores",
                        instructorsCount
                    )}
                    {renderSummaryCard(
                        <FaClock className="card-icon-svg" />,
                        "Próximo Evento",
                        <div className="next-event-info">
                            <span className="event-title">{nextEvent.title}</span>
                            {nextEvent.date && (
                                <div className="event-details">
                                    <span className="event-date">{nextEvent.date}</span>
                                    {nextEvent.location && (
                                        <span className="event-location">{nextEvent.location}</span>
                                    )}
                                    {nextEvent.modality && (
                                        <span className={`event-modality ${nextEvent.modality.toLowerCase()}`}>
                                            {nextEvent.modality}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="upcoming-events-section">
                    <div className="section-header">
                        <h2>Próximos Eventos</h2>
                        <button onClick={handleNewEventClick} className="new-event-button">
                            <FaPlus className="button-icon" />
                            {isMobile ? 'Nueva' : 'Nueva Programación'}
                        </button>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <div className="loading-spinner"></div>
                            <p>Cargando eventos...</p>
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    ) : upcomingEvents.length > 0 ? (
                        <div className="upcoming-events-list">
                            {upcomingEvents.map(event => (
                                <EventItem
                                    key={event.id}
                                    event={event}
                                    onEdit={handleEditUpcomingEvent}
                                    onDelete={handleDeleteUpcomingEvent}
                                    isMobile={isMobile}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-upcoming-events">
                            <p>No hay eventos programados.</p>
                            <button onClick={handleNewEventClick} className="create-event-button">
                                Crear nuevo evento
                            </button>
                        </div>
                    )}

                    {upcomingEvents.length > 0 && (
                        <div className="view-all-link">
                            <button onClick={handleViewAllEventsClick} className="link-button">
                                <span>Ver todos los eventos</span>
                                <FaArrowRight className="button-icon" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default GestoraDashboard;
