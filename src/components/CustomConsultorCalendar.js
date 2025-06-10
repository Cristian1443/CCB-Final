import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/es'; // Importar localización en español
// Ruta corregida para el CSS del calendario personalizado
import '../styles/custom-consultor-calendar.css';
  
// Configurar moment en español
moment.locale('es');

// Componente CustomConsultorCalendar
// Recibe 'events' (array de eventos) y 'onSelectEvent' (función al hacer clic en un evento)
const CustomConsultorCalendar = ({ events, onSelectEvent }) => {
  // Estado para el mes y año actual que se muestra
  const [currentMonth, setCurrentMonth] = useState(moment());

  // Función para ir al mes anterior
  const goToPreviousMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  };

  // Función para ir al mes siguiente
  const goToNextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'month'));
  };

  // Función para ir al mes actual (hoy)
  const goToToday = () => {
    setCurrentMonth(moment());
  };

  // Generar los días del mes para mostrar en el calendario
  const generateDays = () => {
    const startOfMonth = moment(currentMonth).startOf('month');
    const endOfMonth = moment(currentMonth).endOf('month');
    const startOfCalendar = moment(startOfMonth).startOf('week'); // Empieza la semana el lunes
    const endOfCalendar = moment(endOfMonth).endOf('week');     // Termina la semana el domingo

    const days = [];
    let day = moment(startOfCalendar);

    while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, 'day')) {
      days.push(moment(day));
      day.add(1, 'day');
    }

    return days;
  };

  const daysInMonth = generateDays();

  // Obtener los nombres de los días de la semana en español
  const weekdaysShort = moment.weekdaysShort(true); // true para empezar en lunes

  // Agrupar los días por semana
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    weeks.push(daysInMonth.slice(i, i + 7));
  }

  // Obtener eventos para un día específico
  const getEventsForDay = (day) => {
    return events.filter(event => moment(event.start).isSame(day, 'day'));
  };

  return (
    <div className="custom-calendar-container">
      {/* Barra de herramientas del calendario */}
      <div className="calendar-toolbar">
        <div className="toolbar-navigation">
          <button onClick={goToPreviousMonth}>Anterior</button>
          <button onClick={goToToday}>Hoy</button>
          <button onClick={goToNextMonth}>Siguiente</button>
        </div>
        <div className="toolbar-label">
          {currentMonth.format('MMMM YYYY')} {/* Nombre del mes y año */}
        </div>
        {/* Aquí podrías añadir botones para cambiar de vista (Semana, Día, Agenda) */}
        {/* Por ahora, solo tenemos la vista de mes */}
         <div className="toolbar-views">
             <button className="active">Mes</button>
             {/* <button>Semana</button> */}
             {/* <button>Día</button> */}
             {/* <button>Agenda</button> */}
         </div>
      </div>

      {/* Cabecera de los días de la semana */}
      <div className="calendar-weekdays">
        {weekdaysShort.map(day => (
          <div key={day} className="weekday-header">
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula de días del mes */}
      <div className="calendar-grid">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="calendar-week">
            {week.map(day => {
              const dayEvents = getEventsForDay(day);
              const isToday = day.isSame(moment(), 'day');
              const isCurrentMonth = day.isSame(currentMonth, 'month');

              return (
                <div
                  key={day.toISOString()}
                  className={`calendar-day ${isToday ? 'today' : ''} ${isCurrentMonth ? '' : 'other-month'}`}
                  // Puedes añadir onClick a la celda si quieres manejar clics en días sin eventos
                  // onClick={() => handleDayClick(day)}
                >
                  {/* Número del día */}
                  <div className="day-number">
                    {day.format('D')}
                  </div>

                  {/* Contenedor de eventos del día */}
                  <div className="day-events">
                    {dayEvents.map(event => (
                      <div
                        key={event.id}
                        className="calendar-event"
                        onClick={() => onSelectEvent(event)} // Llama a la función del padre al hacer clic
                        // Puedes añadir estilos inline basados en el evento si es necesario
                        // style={{ backgroundColor: event.status === 'Aceptado' ? 'var(--status-accepted)' : 'var(--complement)' }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomConsultorCalendar;
