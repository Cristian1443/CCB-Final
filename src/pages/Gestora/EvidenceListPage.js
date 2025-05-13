import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EvidenceListPage.css';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUserTie, FaFileAlt, FaImage, FaCheckCircle, FaTimesCircle, FaArrowLeft, FaPlus, FaEdit, FaTrashAlt, FaCommentDots, FaPaperPlane, FaBan } from 'react-icons/fa';
import DashboardLayout from '../../components/DashboardLayout';

// Mock data para simular la respuesta de la API
const mockEventsData = [
    {
        id: 'event-1',
        title: 'Taller de Innovación',
        date: '2023-10-26',
        time: '09:00',
        location: 'Sala 301',
        consultant: 'Ana García',
        evidenceStatus: 'Pendiente Revisión',
        evidences: [
            { id: 'ev-1-1', name: 'Foto Grupo Taller Innovacion Largo Nombre', type: 'image', url: '#', previewUrl: 'https://placehold.co/80x80/a0a0a0/ffffff?text=IMG' },
            { id: 'ev-1-2', name: 'Acta Taller', type: 'document', url: '#' },
            { id: 'ev-1-3', name: 'Presentación Taller', type: 'document', url: '#' },
            { id: 'ev-1-4', name: 'Lista Asistencia', type: 'document', url: '#' },
        ],
        feedback: ''
    },
    {
        id: 'event-2',
        title: 'Conferencia Anual',
        date: '2023-11-15',
        time: '14:30',
        location: 'Auditorio Principal',
        consultant: 'Juan Pérez',
        evidenceStatus: 'Evidencias Aceptadas',
        evidences: [
            { id: 'ev-2-1', name: 'Foto Conferencia', type: 'image', url: '#', previewUrl: 'https://placehold.co/80x80/a0a0a0/ffffff?text=IMG' },
            { id: 'ev-2-2', name: 'Presentación Conferencia Principal', type: 'document', url: '#' },
        ],
        feedback: 'Evidencias completas y de alta calidad. Buen trabajo.'
    },
    {
        id: 'event-3',
        title: 'Seminario de Marketing Digital',
        date: '2024-01-20',
        time: '10:00',
        location: 'Online (Zoom)',
        consultant: 'Laura Fernández',
        evidenceStatus: 'Evidencias Devueltas',
        evidences: [
            { id: 'ev-3-1', name: 'Grabación Seminario', type: 'document', url: '#' },
            { id: 'ev-3-2', name: 'Materiales Adicionales', type: 'document', url: '#' },
        ],
        feedback: 'Falta evidencia fotográfica del evento. Por favor, subir capturas de pantalla relevantes.'
    },
    {
        id: 'event-4',
        title: 'Workshop Liderazgo',
        date: '2024-02-10',
        time: '15:00',
        location: 'Sala de Juntas',
        consultant: 'Carlos Ruiz',
        evidenceStatus: 'Pendiente Revisión',
        evidences: [
            { id: 'ev-4-1', name: 'Fotos Workshop', type: 'image', url: '#', previewUrl: 'https://placehold.co/80x80/a0a0a0/ffffff?text=IMG' },
            { id: 'ev-4-2', name: 'Ejercicios Prácticos', type: 'document', url: '#' },
        ],
        feedback: ''
    },
];

const EvidenceListPage = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [consultantFilter, setConsultantFilter] = useState('all');
    const [showFeedbackArea, setShowFeedbackArea] = useState(null);
    const [currentFeedback, setCurrentFeedback] = useState('');

    useEffect(() => {
        setEvents(mockEventsData);
        setFilteredEvents(mockEventsData);
    }, []);

    useEffect(() => {
        let updatedEvents = events;

        if (searchTerm) {
            updatedEvents = updatedEvents.filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.consultant.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.location.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter !== 'all') {
            updatedEvents = updatedEvents.filter(event => event.evidenceStatus === statusFilter);
        }

        if (consultantFilter !== 'all') {
             updatedEvents = updatedEvents.filter(event => event.consultant === consultantFilter);
        }

        setFilteredEvents(updatedEvents);
    }, [searchTerm, statusFilter, consultantFilter, events]);

    const consultants = [...new Set(events.map(event => event.consultant))];

    const handleViewEvidence = (url) => {
        console.log(`Ver evidencia en: ${url}`);
        alert(`Simulando ver evidencia. URL: ${url}`);
    };

    const handleConfirmEvidences = (eventId) => {
        console.log(`Confirmar evidencias para evento: ${eventId}`);
        const updatedEvents = events.map(event =>
            event.id === eventId ? { ...event, evidenceStatus: 'Evidencias Aceptadas' } : event
        );
        setEvents(updatedEvents);
        if (showFeedbackArea === eventId) {
            setShowFeedbackArea(null);
            setCurrentFeedback('');
        }
    };

    const handleReturnEvidences = (eventId, existingFeedback = '') => {
        setShowFeedbackArea(eventId);
        setCurrentFeedback(existingFeedback);
    };

    const handleCancelFeedback = () => {
        setShowFeedbackArea(null);
        setCurrentFeedback('');
    };

    const handleSubmitFeedback = (eventId) => {
        console.log(`Enviar feedback para evento ${eventId}: ${currentFeedback}`);
        const updatedEvents = events.map(event =>
            event.id === eventId ? { ...event, evidenceStatus: 'Evidencias Devueltas', feedback: currentFeedback } : event
        );
        setEvents(updatedEvents);
        setShowFeedbackArea(null);
        setCurrentFeedback('');
    };

    const getEvidenceIcon = (type) => {
        switch (type) {
            case 'document':
                return <FaFileAlt className="document-icon" />;
            case 'image':
                return <FaImage className="document-icon" />;
            default:
                return <FaFileAlt className="document-icon" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Pendiente Revisión':
                return 'status-pendiente-revisión';
            case 'Evidencias Aceptadas':
                return 'status-evidencias-aceptadas';
            case 'Evidencias Devueltas':
                return 'status-evidencias-devueltas';
            default:
                return '';
        }
    };

    return (
        <DashboardLayout>
            <div className="evidence-list-container">
                <header className="list-header">
                    <h2>Gestión de Evidencias</h2>
                    <div className="header-actions">
                        <button className="btn-go-to-dashboard" onClick={() => navigate('/gestora')}>
                            <FaArrowLeft /> Volver al Dashboard
                        </button>
                        <button 
                            className="btn-add-programacion" 
                            onClick={() => navigate('/gestora/nueva-programacion')}
                        >
                            <FaPlus /> Añadir Programación
                        </button>
                    </div>
                </header>

                <section className="filters-section">
                    <div className="filter-group">
                        <label htmlFor="search">Buscar Evento/Consultor:</label>
                        <input
                            type="text"
                            id="search"
                            className="filter-input"
                            placeholder="Escribe para buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="status-filter">Estado de Evidencias:</label>
                        <select
                            id="status-filter"
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">Todos los Estados</option>
                            <option value="Pendiente Revisión">Pendiente Revisión</option>
                            <option value="Evidencias Aceptadas">Evidencias Aceptadas</option>
                            <option value="Evidencias Devueltas">Evidencias Devueltas</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="consultant-filter">Consultor:</label>
                        <select
                            id="consultant-filter"
                            className="filter-select"
                            value={consultantFilter}
                            onChange={(e) => setConsultantFilter(e.target.value)}
                        >
                            <option value="all">Todos los Consultores</option>
                            {consultants.map(consultant => (
                                <option key={consultant} value={consultant}>{consultant}</option>
                            ))}
                        </select>
                    </div>
                </section>

                <div className="events-evidence-list">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map(event => (
                            <article key={event.id} className={`event-evidence-block ${getStatusClass(event.evidenceStatus)}`}>
                                <div className="event-content">
                                    <div className="event-details">
                                        <h3>{event.title}</h3>
                                        <p><strong><FaCalendarAlt /> Fecha:</strong> {event.date}</p>
                                        <p><strong><FaClock /> Hora:</strong> {event.time}</p>
                                        <p><strong><FaMapMarkerAlt /> Ubicación:</strong> {event.location}</p>
                                        <p><strong><FaUserTie /> Consultor:</strong> {event.consultant}</p>
                                        <p>
                                            <strong>Estado:</strong>
                                            <span className="evidence-status">
                                                {event.evidenceStatus}
                                            </span>
                                        </p>
                                    </div>

                                    <div className="evidence-items">
                                        <h4>Evidencias Enviadas ({event.evidences.length})</h4>
                                        {event.evidences.length > 0 ? (
                                            <div className="evidence-grid">
                                                {event.evidences.map(evidence => (
                                                    <div key={evidence.id} className="evidence-item-preview">
                                                        {evidence.type === 'image' && evidence.previewUrl ? (
                                                            <img src={evidence.previewUrl} alt={evidence.name} onError={(e) => e.target.src = 'https://placehold.co/80x80/ff0000/ffffff?text=Error'} />
                                                        ) : (
                                                            getEvidenceIcon(evidence.type)
                                                        )}
                                                        <p>{evidence.name}</p>
                                                        <a href={evidence.url} className="view-evidence-link" onClick={(e) => { e.preventDefault(); handleViewEvidence(evidence.url); }}>Ver</a>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="no-evidence-for-event">No hay evidencias para este evento.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="gestora-actions">
                                    {event.evidenceStatus === 'Pendiente Revisión' && (
                                        <>
                                            <button className="btn-confirm" onClick={() => handleConfirmEvidences(event.id)}>
                                                <FaCheckCircle /> Confirmar Evidencias
                                            </button>
                                            <button className="btn-return" onClick={() => handleReturnEvidences(event.id)}>
                                                <FaTimesCircle /> Devolver Evidencias
                                            </button>
                                        </>
                                    )}
                                    {event.evidenceStatus === 'Evidencias Aceptadas' && event.feedback && (
                                        <div className="feedback-display">
                                            <strong>Feedback Enviado:</strong>
                                            <p>{event.feedback}</p>
                                        </div>
                                    )}
                                    {event.evidenceStatus === 'Evidencias Devueltas' && event.feedback && (
                                        <div className="feedback-display status-returned">
                                            <strong>Feedback Enviado:</strong>
                                            <p>{event.feedback}</p>
                                            {showFeedbackArea !== event.id && (
                                                <button className="btn-edit-feedback" onClick={() => handleReturnEvidences(event.id, event.feedback)}>
                                                    <FaEdit /> Editar Feedback
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {showFeedbackArea === event.id && (
                                        <div className="feedback-area">
                                            <textarea
                                                placeholder="Escribe tu feedback aquí..."
                                                value={currentFeedback}
                                                onChange={(e) => setCurrentFeedback(e.target.value)}
                                            ></textarea>
                                            <div className="feedback-buttons">
                                                <button className="btn-cancel-feedback" onClick={handleCancelFeedback}>
                                                    <FaBan /> Cancelar
                                                </button>
                                                <button
                                                    className="btn-submit-feedback"
                                                    onClick={() => handleSubmitFeedback(event.id)}
                                                    disabled={!currentFeedback.trim()}
                                                >
                                                    <FaPaperPlane /> Enviar Feedback
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className="no-evidence-message">No se encontraron eventos con las evidencias correspondientes a los filtros.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default EvidenceListPage;