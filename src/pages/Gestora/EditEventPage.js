// src/pages/Gestora/EditEventPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import './EditEventPage.css';

function EditEventPage() {
  const { eventId } = useParams(); // ID del evento desde la URL
  const navigate = useNavigate();
  const isEditing = !!eventId;

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    endTime: '',
    location: '',
    modality: '',
    instructor: '',
    participants: '',
    status: 'Scheduled',
  });

  useEffect(() => {
    if (isEditing) {
      const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
      const eventToEdit = storedEvents.find(
        (event) => event.id === eventId
      );

      if (eventToEdit) {
        setFormData({
          title: eventToEdit.title,
          date: eventToEdit.date,
          time: eventToEdit.time,
          endTime: eventToEdit.endTime || '',
          location: eventToEdit.location,
          modality: eventToEdit.modality,
          instructor: eventToEdit.instructor,
          participants: eventToEdit.participants,
          status: eventToEdit.status || 'Scheduled',
        });
      } else {
        console.error('Evento no encontrado con ID:', eventId);
        navigate('/gestora/eventos');
      }
    }
  }, [eventId, isEditing, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    if (isEditing) {
      const updatedEvents = storedEvents.map((event) =>
        event.id === parseInt(eventId)
          ? { ...event, ...formData, id: parseInt(eventId) }
          : event
      );    
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      alert('Evento actualizado con éxito.');
    } else {
      const newId = storedEvents.length > 0
        ? Math.max(...storedEvents.map((e) => e.id)) + 1
        : 1;
      const newEvent = { ...formData, id: newId };
      storedEvents.push(newEvent);
      localStorage.setItem('events', JSON.stringify(storedEvents));
      alert('Evento creado con éxito.');
    }

    navigate('/gestora/eventos');
  };

  const handleDelete = () => {
    if (isEditing && window.confirm(`¿Estás seguro de que deseas eliminar el evento "${formData.title}"?`)) {
      const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
      const updatedEvents = storedEvents.filter((event) => event.id !== parseInt(eventId));
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      alert('Evento eliminado.');
      navigate('/gestora/eventos');
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
