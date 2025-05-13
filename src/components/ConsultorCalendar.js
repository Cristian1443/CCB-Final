import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
// Importar localización en español para moment
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilos base del calendario
// Ruta corregida para el CSS del calendario
import '../styles/consultor-calendar.css';

// Configurar el localizador para el calendario en español
moment.locale('es');
const localizer = momentLocalizer(moment);

// Componente principal del Calendario del Consultor
const ConsultorCalendar = ({ events, onSelectEvent }) => {

  // Puedes definir colores de eventos basados en alguna propiedad si la tienes (ej: estado)
  const eventPropGetter = useMemo(() => (event) => {
    let backgroundColor = 'var(--complement)'; // Color por defecto de la variable CSS
    let color = 'white'; // Color de texto por defecto

    // Ejemplo: si tus eventos tienen una propiedad 'status'
    // Asegúrate de que las variables CSS como --status-pending estén definidas en variables.css
    // if (event.status === 'Pendiente') {
    //     backgroundColor = 'var(--status-pending)';
    //     color = 'var(--textPrimary)'; // Texto oscuro para fondo claro
    // }
    // if (event.status === 'Aceptado') {
    //     backgroundColor = 'var(--status-accepted)';
    //     color = 'white';
    // }
    // if (event.status === 'Devuelto') {
    //     backgroundColor = 'var(--status-returned)';
    //     color = 'white';
    // }
    return { style: { backgroundColor, color } };
  }, []);

  return (
    <div className="consultor-calendar-container">
      <Calendar
        localizer={localizer}
        events={events} // Los eventos que se le pasan como prop desde la página
        startAccessor="start" // Propiedad de cada evento para la fecha de inicio
        endAccessor="end"     // Propiedad de cada evento para la fecha de fin
        titleAccessor="title" // Propiedad de cada evento para el título
        onSelectEvent={onSelectEvent} // Función que se llama al seleccionar un evento
        style={{ height: '100%' }} // Permitir que el calendario ocupe la altura de su contenedor
        // Mensajes en español para el calendario
        messages={{
          next: 'Siguiente',
          previous: 'Anterior',
          today: 'Hoy',
          month: 'Mes',
          week: 'Semana',
          day: 'Día',
          agenda: 'Agenda',
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          noEventsInRange: 'No hay eventos en este rango.',
          showMore: total => `+ Ver más (${total})`
        }}
        eventPropGetter={eventPropGetter} // Para aplicar estilos dinámicos a los eventos
        defaultView="month" // Vista por defecto
        toolbar={true} // Mostrar la barra de herramientas
        popup={true} // Mostrar popup con detalles al hacer clic (comportamiento por defecto de react-big-calendar)
        // Si quieres un modal personalizado en lugar del popup, no uses popup={true}
        // y maneja la visualización del modal en el componente padre (ConsultorDashboardPage)
      />
    </div>
  );
};

export default ConsultorCalendar;
