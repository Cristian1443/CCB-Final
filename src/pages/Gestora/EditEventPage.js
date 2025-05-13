// src/pages/Gestora/EditEventPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import './EditEventPage.css'; // Asegúrate de tener este archivo CSS

// =========================================================================
// Datos Mock de eventos (COPIADOS DESDE EventListPage.js para simular)
// En una aplicación real, obtendrías estos datos de tu backend o un contexto global.
// =========================================================================
const allMockEvents = [
    { id: 1, title: 'Taller de Emprendimiento', date: '2025-11-14', time: '09:00', endTime: '11:00', location: 'Sede Principal', modality: 'Presencial', instructor: 'Julie Sáenz', participants: 30, status: 'Scheduled' },
    { id: 2, title: 'Marketing Digital', date: '2025-11-19', time: '14:30', endTime: '16:30', location: 'Virtual', modality: 'Virtual', instructor: 'Andreína Ustate', participants: 45, status: 'Scheduled' },
    { id: 3, title: 'Gestión de Proyectos', date: '2025-11-23', time: '10:00', endTime: '12:00', location: 'Online', modality: 'Virtual', instructor: 'Carlos Rojas', participants: 20, status: 'Scheduled' },
    { id: 4, title: 'Finanzas Personales', date: '2025-12-01', time: '09:00', endTime: '11:00', location: 'Aula 101', modality: 'Presencial', instructor: 'Andreína Ustate', participants: 50, status: 'Scheduled' },
    { id: 5, title: 'Innovación Abierta', date: '2025-12-05', time: '15:00', endTime: '17:00', location: 'Online', modality: 'Virtual', instructor: 'Julie Sáenz', participants: 25, status: 'Completed' },
    { id: 6, title: 'Contabilidad Básica', date: '2025-12-10', time: '09:00', endTime: '11:00', location: 'Sede Principal', modality: 'Presencial', instructor: 'Tatiana Prieto', participants: 40, status: 'Scheduled' },
     { id: 7, title: 'Ventas Avanzadas', date: '2025-12-15', time: '14:00', endTime: '16:00', location: 'Virtual', modality: 'Virtual', instructor: 'Tatiana Prieto', participants: 35, status: 'Cancelled' },
];
// =========================================================================


function EditEventPage() {
    const { eventId } = useParams(); // Obtiene el ID del evento de la URL
    const navigate = useNavigate();

    // Estado para almacenar los datos del formulario del evento
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        endTime: '', // Aseguramos el campo endTime
        location: '',
        modality: '',
        instructor: '',
        participants: '',
        status: '', // Aseguramos el campo status
    });

    // Estado para manejar si estamos editando un evento existente o creando uno nuevo
    const isEditing = eventId !== undefined;

    useEffect(() => {
        if (isEditing) {
            // Si estamos editando, buscamos el evento en los datos mock
            const eventToEdit = allMockEvents.find(event => event.id === parseInt(eventId));

            if (eventToEdit) {
                // Si encontramos el evento, precargamos el formulario con sus datos
                setFormData({
                    title: eventToEdit.title,
                    date: eventToEdit.date,
                    time: eventToEdit.time,
                    endTime: eventToEdit.endTime || '', // Usamos endTime o cadena vacía si no existe
                    location: eventToEdit.location,
                    modality: eventToEdit.modality,
                    instructor: eventToEdit.instructor,
                    participants: eventToEdit.participants,
                    status: eventToEdit.status || 'Scheduled', // Usamos status o 'Scheduled' por defecto
                });
            } else {
                // Si el ID no corresponde a ningún evento mock, redirigimos
                console.error('Evento no encontrado con ID:', eventId);
                navigate('/gestora/eventos'); // Redirige a la lista de eventos si no se encuentra
            }
        } else {
            // Si no estamos editando (creando uno nuevo), inicializamos el formulario vacío
            setFormData({
                title: '',
                date: '',
                time: '',
                endTime: '',
                location: '',
                modality: '',
                instructor: '',
                participants: '',
                status: 'Scheduled', // Estado por defecto para nuevos eventos
            });
        }
    }, [eventId, isEditing, navigate]); // Dependencias del useEffect

    // Maneja los cambios en los inputs del formulario
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Maneja el envío del formulario (Guardar/Crear)
    const handleSubmit = (e) => {
        e.preventDefault();

        // Aquí iría la lógica para enviar los datos a tu backend
        // Dependiendo de si isEditing es true o false, harías una petición PUT/PATCH o POST

        if (isEditing) {
            console.log('Guardando cambios para evento con ID:', eventId);
            console.log('Datos del formulario:', formData);
            alert(`Funcionalidad Guardar cambios para evento ${eventId} no implementada.`);
            // En una aplicación real:
            // 1. Llamar a la API para actualizar el evento
            // 2. Si es exitoso, redirigir a la lista de eventos o mostrar un mensaje de éxito
            // navigate('/gestora/eventos'); // Redirige después de guardar (si la API fuera real)
        } else {
            console.log('Creando nuevo evento:', formData);
            alert('Funcionalidad Crear nuevo evento no implementada.');
            // En una aplicación real:
            // 1. Llamar a la API para crear el nuevo evento
            // 2. Si es exitoso, redirigir a la lista de eventos o a la página del nuevo evento
            // navigate('/gestora/eventos'); // Redirige después de crear (si la API fuera real)
        }
    };

     // Maneja la eliminación del evento (solo visible en modo edición)
     const handleDelete = () => {
         if (isEditing && window.confirm(`¿Estás seguro de que quieres eliminar el evento "${formData.title}" (ID: ${eventId})? Esta acción no se puede deshacer.`)) {
             console.log('Eliminando evento con ID:', eventId);
             alert(`Funcionalidad Eliminar evento ${eventId} no implementada.`);
             // En una aplicación real:
             // 1. Llamar a la API para eliminar el evento
             // 2. Si es exitoso, redirigir a la lista de eventos
             navigate('/gestora/eventos'); // Redirige a la lista después de eliminar (si la API fuera real)
         }
     };


    return (
        <DashboardLayout>
            <h1>{isEditing ? 'Editar Evento' : 'Nuevo Evento'}</h1>

            <form className="event-form" onSubmit={handleSubmit}>
                {/* Campo Título del Evento */}
                <div className="form-group">
                    <label htmlFor="title">Título del Evento:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Fecha */}
                <div className="form-group">
                    <label htmlFor="date">Fecha:</label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Hora de Inicio */}
                <div className="form-group">
                    <label htmlFor="time">Hora de Inicio:</label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Hora de Fin */}
                 <div className="form-group">
                    <label htmlFor="endTime">Hora de Fin:</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Lugar */}
                <div className="form-group">
                    <label htmlFor="location">Lugar:</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                {/* Campo Modalidad (Selector) */}
                <div className="form-group">
                    <label htmlFor="modality">Modalidad:</label>
                    <select
                        id="modality"
                        name="modality"
                        value={formData.modality}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Selecciona una modalidad</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                    </select>
                </div>

                {/* Campo Instructor */}
                <div className="form-group">
                    <label htmlFor="instructor">Instructor:</label>
                    <input
                        type="text"
                        id="instructor"
                        name="instructor"
                        value={formData.instructor}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                 {/* Campo Participantes */}
                 <div className="form-group">
                    <label htmlFor="participants">Participantes:</label>
                    <input
                        type="number" // Usamos tipo number para participantes
                        id="participants"
                        name="participants"
                        value={formData.participants}
                        onChange={handleInputChange}
                        min="0" // Asegura que el número no sea negativo
                        required
                    />
                </div>

                 {/* Campo Estado (Selector) */}
                 <div className="form-group">
                    <label htmlFor="status">Estado:</label>
                    <select
                        id="status"
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="Scheduled">Programado</option>
                        <option value="Completed">Completado</option>
                        <option value="Cancelled">Cancelado</option>
                    </select>
                </div>


                {/* Botones de acción del formulario */}
                <div className="form-actions">
                    <button type="submit" className="save-button">
                        {isEditing ? 'Guardar Cambios' : 'Crear Evento'}
                    </button>

                    {/* Botón Eliminar (solo visible en modo edición) */}
                    {isEditing && (
                        <button type="button" className="delete-button" onClick={handleDelete}>
                            Eliminar Evento
                        </button>
                    )}

                    {/* Botón Cancelar */}
                    <button type="button" className="cancel-button" onClick={() => navigate('/gestora/eventos')}>
                         Cancelar
                     </button>
                </div>
            </form>
        </DashboardLayout>
    );
}

export default EditEventPage;
