import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import EventItem from '../../components/EventItem';
import './GestoraDashboard.css';
import { FaPlus, FaArrowRight, FaCalendarAlt, FaUsers, FaClock } from 'react-icons/fa';
import apiService from '../../utils/api';

function GestoraDashboard() {
    const navigate = useNavigate();
    const [scheduledEventsCount, setScheduledEventsCount] = useState(0);
    const [instructorsCount, setInstructorsCount] = useState(0);
    const [nextEvent, setNextEvent] = useState({ title: '', date: '' });
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [stats, setStats] = useState({});

    // Detectar cambios en el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Función helper para crear una fecha válida desde los datos de la DB
    const crearFechaDesdeDB = (fecha, hora) => {
        try {
            console.log('🔧 crearFechaDesdeDB - Input:', { fecha, hora, tipoFecha: typeof fecha, tipoHora: typeof hora });
            
            // Si fecha es null o undefined
            if (!fecha) {
                console.warn('⚠️ Fecha es null/undefined');
                return null;
            }

            // Si fecha ya es un objeto Date (puede pasar con MySQL timestamps)
            if (fecha instanceof Date) {
                console.log('📅 Fecha ya es objeto Date:', fecha.toISOString());
                return fecha;
            }

            // Convertir fecha a string y limpiar
            let fechaString = String(fecha).trim();
            
            // Si la fecha ya contiene hora (timestamp completo)
            if (fechaString.includes('T') || fechaString.includes(' ')) {
                const fechaCompleta = new Date(fechaString);
                if (!isNaN(fechaCompleta.getTime())) {
                    console.log('📅 Timestamp completo válido:', fechaCompleta.toISOString());
                    return fechaCompleta;
                }
            }

            // Extraer solo la parte de fecha si viene con hora
            if (fechaString.includes('T')) {
                fechaString = fechaString.split('T')[0];
            } else if (fechaString.includes(' ')) {
                fechaString = fechaString.split(' ')[0];
            }

            // Normalizar la hora
            let horaString = '';
            if (hora) {
                horaString = String(hora).trim();
                
                // Si hora viene como timestamp, extraer solo la parte de hora
                if (horaString.includes('T')) {
                    horaString = horaString.split('T')[1];
                    if (horaString.includes('Z')) {
                        horaString = horaString.split('Z')[0];
                    }
                }
                
                // Agregar segundos si no los tiene
                if (horaString && horaString.split(':').length === 2) {
                    horaString = horaString + ':00';
                }
            } else {
                horaString = '00:00:00'; // Hora por defecto
            }
            
            const fechaCompleta = `${fechaString}T${horaString}`;
            console.log('🔧 String final para parsear:', fechaCompleta);
            
            const fechaObj = new Date(fechaCompleta);
            
            // Verificar si la fecha es válida
            if (isNaN(fechaObj.getTime())) {
                console.warn('⚠️ Fecha inválida después de procesamiento:', { fechaString, horaString, fechaCompleta });
                
                // Intentar con formato alternativo (DD/MM/YYYY)
                try {
                    const [year, month, day] = fechaString.split('-');
                    const fechaAlternativa = new Date(year, month - 1, day, 
                        parseInt(horaString.split(':')[0]), 
                        parseInt(horaString.split(':')[1]));
                    
                    if (!isNaN(fechaAlternativa.getTime())) {
                        console.log('✅ Fecha válida con formato alternativo:', fechaAlternativa.toISOString());
                        return fechaAlternativa;
                    }
                } catch (altError) {
                    console.warn('⚠️ También falló formato alternativo:', altError.message);
                }
                
                return null;
            }
            
            console.log('✅ Fecha válida creada:', fechaObj.toISOString());
            return fechaObj;
            
        } catch (error) {
            console.error('❌ Error en crearFechaDesdeDB:', { fecha, hora, error: error.message });
            return null;
        }
    };

    // Función para obtener el próximo evento
    function getNextEvent(events) {
        const now = new Date();
        console.log('🕐 Fecha/hora actual:', now.toISOString());
        console.log('📅 Eventos para analizar:', events.length);
        
        const upcoming = events
            .map(e => {
                const dateTime = crearFechaDesdeDB(e.date, e.time);
                
                // Debug detallado para cada evento
                console.log(`📋 Evento: ${e.title}`);
                console.log(`   - Fecha raw: "${e.date}", Hora raw: "${e.time}"`);
                console.log(`   - Date parseado: ${dateTime ? dateTime.toISOString() : 'INVÁLIDA'}`);
                console.log(`   - Es futuro?: ${dateTime ? dateTime > now : false}`);
                
                return {
                    ...e,
                    dateTime: dateTime
                };
            })
            .filter(e => {
                const isFuture = e.dateTime && e.dateTime > now;
                console.log(`✅ Filtro - ${e.title}: ${isFuture ? 'FUTURO' : 'PASADO'}`);
                return isFuture;
            })
            .sort((a, b) => a.dateTime - b.dateTime);

        console.log('🔮 Eventos futuros encontrados:', upcoming.length);
        if (upcoming.length > 0) {
            console.log('🎯 Próximo evento seleccionado:', upcoming[0].title, upcoming[0].dateTime.toISOString());
        }

        return upcoming[0] || null;
    }

    // Función para cargar datos desde la API
    const cargarDatosDesdeAPI = async () => {
        try {
            setLoading(true);
            setError(null);

            // Obtener programaciones y estadísticas en paralelo
            const [programacionesRes, statsRes] = await Promise.all([
                apiService.getProgramaciones(),
                apiService.getDashboardStats()
            ]);

            if (programacionesRes.success) {
                const programaciones = programacionesRes.data.programaciones;
                
                console.log('📊 ANÁLISIS DE PROGRAMACIONES CARGADAS:');
                console.log('   - Total programaciones:', programaciones.length);
                if (programaciones.length > 0) {
                    const primer = programaciones[0];
                    console.log('   - Primera programación raw:', primer);
                    console.log('   - Fecha de primera:', typeof primer.date, primer.date);
                    console.log('   - Hora de primera:', typeof primer.time, primer.time);
                    console.log('   - Hora fin de primera:', typeof primer.end_time, primer.end_time);
                }
                
                // Transformar datos para que coincidan con el formato esperado por EventItem
                const eventosTransformados = programaciones.map(prog => ({
                    id: prog.id,
                    title: prog.title,
                    location: prog.location,
                    date: prog.date,
                    time: prog.time,
                    endTime: prog.end_time,
                    program: prog.program_name,
                    specialty: prog.area_conocimiento,
                    modality: prog.modality,
                    status: prog.status,
                    instructor: prog.instructor,
                    participants: prog.participants,
                    // Campos adicionales que podrían ser útiles
                    type: prog.type,
                    hours: prog.hours,
                    coordinator: prog.coordinator,
                    link: prog.link,
                    contract: prog.contract,
                    total_value: prog.total_value,
                    program_name: prog.program_name,
                    route_name: prog.route_name,
                    activity_type: prog.activity_type,
                    area_conocimiento: prog.area_conocimiento
                }));

                // Ordenar eventos por fecha (más próximos primero para el dashboard)
                const eventosOrdenados = eventosTransformados.sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`);
                    const dateB = new Date(`${b.date}T${b.time}`);
                    return dateA - dateB;
                });

                setUpcomingEvents(eventosOrdenados);
                setScheduledEventsCount(eventosOrdenados.length);

                // Configurar próximo evento
                if (statsRes.success && statsRes.data.proximo_evento) {
                    // Usar el próximo evento que viene del backend (más confiable)
                    const proximoEventoBackend = statsRes.data.proximo_evento;
                    const fechaObj = crearFechaDesdeDB(proximoEventoBackend.date, proximoEventoBackend.time);
                    
                    if (fechaObj) {
                        const opcionesFecha = { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        };
                        const fechaFormateada = fechaObj.toLocaleDateString('es-ES', opcionesFecha);

                        setNextEvent({
                            title: isMobile && proximoEventoBackend.title.length > 20 
                                ? proximoEventoBackend.title.substring(0, 20) + '...' 
                                : proximoEventoBackend.title,
                            date: fechaFormateada,
                            location: proximoEventoBackend.location,
                            modality: proximoEventoBackend.modality
                        });
                        
                        console.log('🎯 Próximo evento del backend:', proximoEventoBackend);
                    } else {
                        console.warn('⚠️ Fecha inválida en próximo evento del backend');
                        setNextEvent({ 
                            title: "Error en fecha del evento", 
                            date: "",
                            location: "",
                            modality: "" 
                        });
                    }
                } else {
                    // Fallback: calcular localmente si no viene del backend
                    const eventoMasProximo = getNextEvent(eventosOrdenados);
                    if (eventoMasProximo && eventoMasProximo.dateTime) {
                        const opcionesFecha = { 
                            day: 'numeric', 
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                        };
                        const fechaFormateada = eventoMasProximo.dateTime.toLocaleDateString('es-ES', opcionesFecha);

                        setNextEvent({
                            title: isMobile && eventoMasProximo.title.length > 20 
                                ? eventoMasProximo.title.substring(0, 20) + '...' 
                                : eventoMasProximo.title,
                            date: fechaFormateada,
                            location: eventoMasProximo.location,
                            modality: eventoMasProximo.modality
                        });
                        
                        console.log('🎯 Próximo evento calculado localmente:', eventoMasProximo);
                    } else {
                        setNextEvent({ 
                            title: "Sin eventos futuros", 
                            date: "",
                            location: "",
                            modality: "" 
                        });
                        console.log('⚠️ No se encontraron eventos futuros');
                    }
                }

                console.log('✅ Programaciones cargadas:', eventosOrdenados.length);
                console.log('🔍 Primer evento transformado:', eventosOrdenados[0]); // Debug para verificar la estructura
            } else {
                throw new Error(programacionesRes.message || 'Error al cargar programaciones');
            }

            // Procesar estadísticas
            if (statsRes.success) {
                setStats(statsRes.data);
                setInstructorsCount(statsRes.data.total_instructores);
                console.log('✅ Estadísticas cargadas:', statsRes.data);
                console.log('🔍 Próximo evento en estadísticas:', statsRes.data.proximo_evento);
                
                // Debug super detallado del próximo evento
                if (statsRes.data.proximo_evento) {
                    const pe = statsRes.data.proximo_evento;
                    console.log('📅 ANÁLISIS DETALLADO DEL PRÓXIMO EVENTO:');
                    console.log('   - Título:', pe.title);
                    console.log('   - Fecha raw (tipo):', typeof pe.date, pe.date);
                    console.log('   - Hora raw (tipo):', typeof pe.time, pe.time);
                    console.log('   - Fecha como string:', String(pe.date));
                    console.log('   - Hora como string:', String(pe.time));
                    
                    // Intentar parsear paso a paso
                    try {
                        const fechaString = String(pe.date);
                        const horaString = String(pe.time);
                        console.log('   - Intentando parsear:', `${fechaString}T${horaString}`);
                        const testDate = new Date(`${fechaString}T${horaString}`);
                        console.log('   - Resultado Date:', testDate);
                        console.log('   - Es válida?:', !isNaN(testDate.getTime()));
                        console.log('   - ISO String:', testDate.toISOString());
                    } catch (error) {
                        console.log('   - Error parseando:', error.message);
                    }
                }
            } else {
                console.warn('⚠️ Error al cargar estadísticas:', statsRes.message);
            }

        } catch (error) {
            console.error('❌ Error cargando datos del dashboard:', error);
            setError(`Error al cargar los datos: ${error.message}`);
            
            // Fallback: intentar cargar datos del localStorage como respaldo
            try {
                const eventosLocalStorage = JSON.parse(localStorage.getItem("eventos")) || [];
                if (eventosLocalStorage.length > 0) {
                    setUpcomingEvents(eventosLocalStorage);
                    setScheduledEventsCount(eventosLocalStorage.length);
                    console.log('⚠️ Usando datos de localStorage como respaldo');
                    setError("Conectado con datos locales (sin conexión a base de datos)");
                }
            } catch (localError) {
                console.error('❌ Error también con localStorage:', localError);
            }
        } finally {
            setLoading(false);
        }
    };

    // Cargar datos al montar el componente
    useEffect(() => {
        cargarDatosDesdeAPI();
    }, [isMobile]);

    // Función para eliminar evento (necesita implementación de API)
    const handleDeleteUpcomingEvent = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta programación?')) {
            try {
                // Por ahora, solo actualización local hasta implementar DELETE en API
                const updatedEvents = upcomingEvents.filter(event => event.id !== id);
                setUpcomingEvents(updatedEvents);
                setScheduledEventsCount(updatedEvents.length);
                
                // TODO: Implementar apiService.deleteProgramacion(id)
                console.log('🗑️ Programación eliminada localmente:', id);
                alert('Programación eliminada de la vista. \n(Nota: Eliminar de la base de datos requiere implementación adicional)');
            } catch (error) {
                console.error('Error eliminando programación:', error);
                alert('Error al eliminar la programación');
            }
        }
    };

    // Función para editar evento (navegar a página de edición)
    const handleEditUpcomingEvent = (id) => {
        // TODO: Crear página de edición de programaciones
        console.log('✏️ Editar programación:', id);
        alert(`Editar programación ${id}\n(Página de edición en desarrollo)`);
        // navigate(`/gestora/programacion/editar/${id}`);
    };

    const handleNewEventClick = () => {
        navigate('/gestora/nueva-programacion');
    };

    const handleViewAllEventsClick = () => {
        // TODO: Crear página de lista completa de programaciones
        console.log('📋 Ver todas las programaciones');
        alert('Página de listado completo en desarrollo');
        // navigate('/gestora/programaciones');
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
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                onClick={cargarDatosDesdeAPI} 
                                className="reload-button"
                                style={{
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '10px 16px',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem'
                                }}
                                disabled={loading}
                            >
                                {loading ? '🔄' : '🔄'} Recargar
                            </button>
                            <button onClick={handleNewEventClick} className="new-event-button">
                                <FaPlus className="button-icon" />
                                {isMobile ? 'Nueva' : 'Nueva Programación'}
                            </button>
                        </div>
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
