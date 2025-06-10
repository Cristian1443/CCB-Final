// src/pages/Gestora/ConsultorFormPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import './ConsultorFormPage.css';
import { getConsultores, saveConsultores } from '../../data/dataConsultores';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaFileAlt, FaCalendarAlt, FaClock, FaTrash, FaPencilAlt, FaSave, FaTimes } from 'react-icons/fa';

function ConsultorFormPage() {
    const { cedula } = useParams();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [consultor, setConsultor] = useState(null);
    const [formData, setFormData] = useState({
        cedula: '',
        nombre: '',
        especialidad: '',
        contacto: { email: '', telefono: '' },
        direccion: '',
        consecutivoOAMP: '',
        fechaFirmaOAMP: ''
    });
    const [assignedEvents, setAssignedEvents] = useState([]);
    const [checkDate, setCheckDate] = useState('');
    const [checkTime, setCheckTime] = useState('');
    const [availabilityMessage, setAvailabilityMessage] = useState('');
    const [suggestedAvailability, setSuggestedAvailability] = useState('');

    useEffect(() => {
        const loadConsultor = async () => {
            setIsLoading(true);
            try {
                if (cedula) {
                    const storedConsultores = getConsultores();
                    const foundConsultor = storedConsultores.find(
                        (consultor) => String(consultor.cedula) === String(cedula)
                    );

                    if (foundConsultor) {
                        setConsultor(foundConsultor);
                        setFormData({
                            cedula: foundConsultor.cedula,
                            nombre: foundConsultor.nombre,
                            especialidad: foundConsultor.especialidad,
                            contacto: {
                                telefono: foundConsultor.celular || '',
                                email: foundConsultor.email || ''
                            },
                            direccion: foundConsultor.direccion || '',
                            consecutivoOAMP: foundConsultor.consecutivoOAMP || '',
                            fechaFirmaOAMP: foundConsultor.fechaFirmaOAMP || ''
                        });

                        const events = foundConsultor.assignedEvents || [];
                        setAssignedEvents(events);
                        setSuggestedAvailability(generateAvailabilitySummary(events, foundConsultor.nombre));
                    } else {
                        console.error('Consultor no encontrado con ID:', cedula);
                        navigate('/gestora/consultores');
                    }
                }
            } catch (error) {
                console.error('Error al cargar el consultor:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadConsultor();
    }, [cedula, navigate]);

    const generateAvailabilitySummary = (events, consultorName) => {
        if (!events || events.length === 0) {
            return `El consultor ${consultorName || ''} no tiene eventos asignados actualmente. Está disponible para nuevas programaciones.`;
        }

        const eventsByDate = events.reduce((acc, event) => {
            const date = event.date;
            if (!acc[date]) acc[date] = [];
            acc[date].push(event);
            return acc;
        }, {});

        const sortedDates = Object.keys(eventsByDate).sort();
        let summary = `Resumen de disponibilidad para ${consultorName}:\n\n`;

        sortedDates.forEach(date => {
            const formattedDate = new Date(date).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            summary += `${formattedDate}:\n`;
            const sortedEvents = eventsByDate[date].sort((a, b) => a.time.localeCompare(b.time));

            sortedEvents.forEach(event => {
                summary += `• ${event.time} - ${event.endTime}: "${event.title}"\n`;
            });
            summary += '\n';
        });

        return summary;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'email' || name === 'telefono') {
            setFormData(prev => ({
                ...prev,
                contacto: {
                    ...prev.contacto,
                    [name]: value,
                },
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const nuevosConsultores = getConsultores();
            const nuevo = {
                cedula: formData.cedula,
                nombre: formData.nombre,
                especialidad: formData.especialidad,
                celular: formData.contacto.telefono,
                email: formData.contacto.email,
                direccion: formData.direccion,
                consecutivoOAMP: formData.consecutivoOAMP,
                fechaFirmaOAMP: formData.fechaFirmaOAMP,
                assignedEvents: assignedEvents
            };

            if (consultor) {
                const index = nuevosConsultores.findIndex(c => c.cedula === consultor.cedula);
                if (index !== -1) {
                    nuevosConsultores[index] = nuevo;
                    saveConsultores(nuevosConsultores);
                    navigate("/gestora/consultores");
                }
            } else {
                const existe = nuevosConsultores.some(c => c.cedula === nuevo.cedula);
                if (existe) {
                    alert("Ya existe un consultor con esa cédula.");
                    return;
                }
                nuevosConsultores.push(nuevo);
                saveConsultores(nuevosConsultores);
                navigate("/gestora/consultores");
            }
        } catch (error) {
            console.error('Error al guardar el consultor:', error);
            alert('Hubo un error al guardar los cambios. Por favor, intente nuevamente.');
        }
    };

    const handleDeleteConsultor = () => {
        if (consultor && window.confirm(`¿Estás seguro de que quieres eliminar a ${consultor.nombre}? Esta acción no se puede deshacer.`)) {
            try {
                const nuevosConsultores = getConsultores().filter(c => c.cedula !== consultor.cedula);
                saveConsultores(nuevosConsultores);
                navigate('/gestora/consultores');
            } catch (error) {
                console.error('Error al eliminar el consultor:', error);
                alert('Hubo un error al eliminar el consultor. Por favor, intente nuevamente.');
            }
        }
    };

    const handleDeleteAssignedEvent = (eventIdToDelete) => {
        if (window.confirm(`¿Estás seguro de que quieres desasignar este evento del consultor?`)) {
            try {
                const updatedEvents = assignedEvents.filter(event => event.id !== eventIdToDelete);
                setAssignedEvents(updatedEvents);

                const nuevosConsultores = getConsultores();
                const index = nuevosConsultores.findIndex(c => c.cedula === consultor.cedula);
                if (index !== -1) {
                    nuevosConsultores[index].assignedEvents = updatedEvents;
                    saveConsultores(nuevosConsultores);
                    setSuggestedAvailability(generateAvailabilitySummary(updatedEvents, consultor.nombre));
                }
            } catch (error) {
                console.error('Error al desasignar el evento:', error);
                alert('Hubo un error al desasignar el evento. Por favor, intente nuevamente.');
            }
        }
    };

    const handleEditAssignedEvent = (eventIdToEdit) => {
        navigate(`/gestora/eventos/editar/${eventIdToEdit}`);
    };

    const handleCheckAvailability = () => {
        if (!checkDate || !checkTime) {
            setAvailabilityMessage('Por favor, ingresa una fecha y hora para verificar.');
            return;
        }

        if (!assignedEvents || assignedEvents.length === 0) {
            setAvailabilityMessage(`El consultor ${consultor ? consultor.nombre : ''} está disponible en la fecha y hora seleccionada.`);
            return;
        }

        const checkDateTime = new Date(`${checkDate}T${checkTime}:00`);
        let isAvailable = true;
        let conflictingEvent = null;

        for (const event of assignedEvents) {
            const eventStart = new Date(`${event.date}T${event.time}:00`);
            const eventEnd = new Date(`${event.date}T${event.endTime}:00`);

            if (checkDateTime >= eventStart && checkDateTime < eventEnd) {
                isAvailable = false;
                conflictingEvent = event;
                break;
            }
        }

        setAvailabilityMessage(
            isAvailable
                ? `${consultor.nombre} está disponible el ${new Date(checkDate).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} a las ${checkTime}.`
                : `${consultor.nombre} no está disponible en ese horario. Tiene asignado el evento "${conflictingEvent.title}" de ${conflictingEvent.time} a ${conflictingEvent.endTime}.`
        );
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Cargando información del consultor...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="consultor-form">
                <h1>{cedula ? 'Editar Consultor' : 'Nuevo Consultor'}</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Información Personal</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="cedula">
                                    <FaUser /> Cédula
                                </label>
                                <input
                                    type="text"
                                    id="cedula"
                                    name="cedula"
                                    value={formData.cedula}
                                    onChange={handleInputChange}
                                    required
                                    disabled={!!cedula}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="nombre">
                                    <FaUser /> Nombre Completo
                                </label>
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
                                <label htmlFor="especialidad">
                                    <FaFileAlt /> Especialidad
                                </label>
                                <input
                                    type="text"
                                    id="especialidad"
                                    name="especialidad"
                                    value={formData.especialidad}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Información de Contacto</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="email">
                                    <FaEnvelope /> Correo Electrónico
                                </label>
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
                                <label htmlFor="telefono">
                                    <FaPhone /> Teléfono
                                </label>
                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={formData.contacto.telefono}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="direccion">
                                    <FaMapMarkerAlt /> Dirección
                                </label>
                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={formData.direccion}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Información OAMP</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="consecutivoOAMP">
                                    <FaFileAlt /> Consecutivo OAMP
                                </label>
                                <input
                                    type="text"
                                    id="consecutivoOAMP"
                                    name="consecutivoOAMP"
                                    value={formData.consecutivoOAMP}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="fechaFirmaOAMP">
                                    <FaCalendarAlt /> Fecha Firma OAMP
                                </label>
                                <input
                                    type="date"
                                    id="fechaFirmaOAMP"
                                    name="fechaFirmaOAMP"
                                    value={formData.fechaFirmaOAMP}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    </div>

                    {consultor && (
                        <>
                            <div className="form-section">
                                <h3>Verificar Disponibilidad</h3>
                                <div className="availability-inputs">
                                    <div className="form-group">
                                        <label htmlFor="checkDate">
                                            <FaCalendarAlt /> Fecha
                                        </label>
                                        <input
                                            type="date"
                                            id="checkDate"
                                            value={checkDate}
                                            onChange={(e) => setCheckDate(e.target.value)}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="checkTime">
                                            <FaClock /> Hora
                                        </label>
                                        <input
                                            type="time"
                                            id="checkTime"
                                            value={checkTime}
                                            onChange={(e) => setCheckTime(e.target.value)}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        className="check-availability-button"
                                        onClick={handleCheckAvailability}
                                    >
                                        Verificar Disponibilidad
                                    </button>
                                </div>
                                {availabilityMessage && (
                                    <p className={`availability-message ${availabilityMessage.includes('no está disponible') ? 'not-available' : 'available'}`}>
                                        {availabilityMessage}
                                    </p>
                                )}
                            </div>

                            <div className="form-section">
                                <h3>Eventos Asignados ({assignedEvents.length})</h3>
                                {assignedEvents.length > 0 ? (
                                    <div className="assigned-events-list-container">
                                        <div className="assigned-events-list-header">
                                            <div className="header-cell event-title-col">Evento</div>
                                            <div className="header-cell event-date-col">Fecha</div>
                                            <div className="header-cell event-time-col">Inicio</div>
                                            <div className="header-cell event-endTime-col">Fin</div>
                                            <div className="header-cell event-location-col">Lugar</div>
                                            <div className="header-cell event-status-col">Estado</div>
                                            <div className="header-cell event-actions-col">Acciones</div>
                                        </div>
                                        <div className="assigned-events-list-body">
                                            {assignedEvents.map(event => (
                                                <div key={event.id} className="assigned-event-list-item">
                                                    <div className="event-cell event-title-col" data-label="Evento">{event.title}</div>
                                                    <div className="event-cell event-date-col" data-label="Fecha">{event.date}</div>
                                                    <div className="event-cell event-time-col" data-label="Inicio">{event.time}</div>
                                                    <div className="event-cell event-endTime-col" data-label="Fin">{event.endTime}</div>
                                                    <div className="event-cell event-location-col" data-label="Lugar">{event.location}</div>
                                                    <div className="event-cell event-status-col" data-label="Estado">{event.status}</div>
                                                    <div className="event-cell event-actions-col">
                                                        <button
                                                            type="button"
                                                            className="edit-assigned-event-button"
                                                            onClick={() => handleEditAssignedEvent(event.id)}
                                                        >
                                                            <FaPencilAlt /> Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="delete-assigned-event-button"
                                                            onClick={() => handleDeleteAssignedEvent(event.id)}
                                                        >
                                                            <FaTrash /> Desasignar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="no-events-message">No hay eventos asignados a este consultor.</p>
                                )}
                            </div>
                        </>
                    )}

                    <div className="form-actions">
                        <button type="submit" className="save-button">
                            <FaSave /> Guardar Cambios
                        </button>
                        {cedula && (
                            <button type="button" className="delete-consultor-button" onClick={handleDeleteConsultor}>
                                <FaTrash /> Eliminar Consultor
                            </button>
                        )}
                        <button type="button" className="cancel-button" onClick={() => navigate('/gestora/consultores')}>
                            <FaTimes /> Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}

export default ConsultorFormPage;
