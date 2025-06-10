import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar a los detalles
import moment from 'moment';
import 'moment/locale/es';
// Importar el layout específico del consultor
import ConsultorLayout from '../../components/ConsultorLayout';
// Ruta corregida para el CSS de esta página
import '../../styles/consultor-event-list.css';
// Importa tu hook de autenticación si necesitas obtener el ID del consultor para filtrar eventos
// import { useAuth } from '../../context/AuthContext';

moment.locale('es');

const ConsultorEventListPage = () => {
  // const { currentUser } = useAuth(); // Obtener el usuario actual para filtrar eventos
  const navigate = useNavigate(); // Hook para navegación

  const [allEvents, setAllEvents] = useState([]); // Lista completa de eventos
  const [filteredEvents, setFilteredEvents] = useState([]); // Lista de eventos filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda para filtrar
  const [filterDate, setFilterDate] = useState(''); // Fecha para filtrar
  const [filterTime, setFilterTime] = useState(''); // Hora para filtrar
  const [filterActivityStatus, setFilterActivityStatus] = useState(''); // Estado para filtro de estado de actividad


  // TODO: Implementar la carga real de eventos asignados al consultor
  useEffect(() => {
    const fetchConsultorEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        // Aquí deberías hacer la llamada a tu API para obtener TODOS los eventos
        // asignados a este consultor. Usarías el ID del consultor de useAuth.
        // Asegúrate de que la API devuelva los campos `estadoActividad` y `evidenceStatus`.
        // Por ahora, usamos datos mock (simulados).
        // const consultorId = currentUser?.id;
        // const response = await fetch(`/api/events?consultorId=${consultorId}`);
        // if (!response.ok) throw new Error('Error al cargar los eventos');
        // const data = await response.json();
        // setAllEvents(data.map(event => ({
        //    ...event,
        //    start: new Date(event.start), // Convertir strings de fecha a objetos Date
        //    end: new Date(event.end),
        //    estadoActividad: event.estadoActividad || 'Desconocido', // Asegúrate de que este campo venga de la API
        //    evidenceStatus: event.evidenceStatus || null, // <-- Puede ser null si no se ha subido
        // })));

        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 500));

        const mockEvents = [
           {
              id: 'event-1',
              title: 'Taller de Innovación',
              start: moment('2025-05-15T09:00:00').toDate(),
              end: moment('2025-05-15T12:00:00').toDate(),
              description: 'Taller sobre metodologías ágiles.',
              programa: 'Crecimiento Empresarial',
              tipoActividad: 'Talleres',
              modalidad: 'Presencial',
              ubicacion: 'Sala 301',
              tematica: 'Metodologías Ágiles',
              estadoActividad: 'Programado',
              coordinadorCCB: 'Luis Martínez',
              codigoAgenda: 'INN-T-001',
              dependencia: 'Innovación',
              nombreConsultor: 'Carlos Rojas',
              cedulaConsultor: '123456789',
              emailConsultor: 'carlos.rojas@example.com',
              celularConsultor: '3001234567',
              direccionConsultor: 'Calle 10 # 20-30',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-001',
              fechaInicioOAMPConsultor: moment('2025-01-01').toDate(),
              nroHorasPagarDocente: 3,
              clasificacionValorHora: '$ 90.000',
              valorHora: 90000,
              valorTotalPagarDocente: 270000,
              entregables: 'Presentación, Informe',
              observaciones: 'Preparar material adicional.',
              gestora: 'Ana García',
              region: 'Región 2',
              enlaceVirtual: null,
              cargueEvidencia: null, // No ha subido
              evidenceStatus: null, // Estado nulo si no ha subido
           },
            {
              id: 'event-2',
              title: 'Reunión de Estrategia Anual',
              start: moment('2025-05-20T14:00:00').toDate(),
              end: moment('2025-05-20T16:00:00').toDate(),
              description: 'Planificación de estrategias.',
              programa: 'Consolidación y escalamiento empresarial',
              tipoActividad: 'Asesorias Grupales o Capsulas',
              modalidad: 'Híbrido',
              enlaceVirtual: 'https://meet.google.com/abc-defg-hij',
              ubicacion: 'Oficina Principal, Piso 5',
              tematica: 'Planificación Estratégica',
              estadoActividad: 'Confirmado',
              coordinadorCCB: 'María López',
              codigoAgenda: 'EST-R-002',
              dependencia: 'Estrategia',
              nombreConsultor: 'Julie Sáenz',
              cedulaConsultor: '987654321',
              emailConsultor: 'julie.saenz@example.com',
              celularConsultor: '3109876543',
              direccionConsultor: 'Avenida Siempre Viva 742',
              tipoVinculacionConsultor: 'Prestación de Servicios',
              nroOAMPConsultor: 'OAMP-002',
              fechaInicioOAMPConsultor: moment('2025-02-15').toDate(),
              nroHorasPagarDocente: 2,
              clasificacionValorHora: '$ 100.000',
              valorHora: 100000,
              valorTotalPagarDocente: 200000,
              entregables: 'Acta de reunión',
              observaciones: 'Revisar informe previo.',
              gestora: 'Juan Pérez',
              region: 'Región 1',
              cargueEvidencia: 'URL_EVIDENCIA_EXISTENTE_2',
              evidenceStatus: 'Aceptada',
           },
            {
              id: 'event-3',
              title: 'Seminario de Marketing Digital (Devuelto)', // Indicador en título para demo
              start: moment('2025-06-05T10:00:00').toDate(),
              end: moment('2025-06-05T13:00:00').toDate(),
              description: 'Tendencias actuales en marketing digital.',
              programa: 'Emprendimiento',
              tipoActividad: 'Asesorias Individuales',
              modalidad: 'Virtual',
              enlaceVirtual: 'https://zoom.us/j/1234567890',
              ubicacion: null,
              tematica: 'Marketing Digital',
              estadoActividad: 'Finalizado', // Consideramos Finalizado para eventos pasados
              coordinadorCCB: 'Pedro Gómez',
              codigoAgenda: 'MKT-S-003',
              dependencia: 'Marketing',
              nombreConsultor: 'Andreína Ustate',
              cedulaConsultor: '1122334455',
              emailConsultor: 'andreina.ustate@example.com',
              celularConsultor: '3201122334',
              direccionConsultor: 'Carrera 5 # 15-25',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-003',
              fechaInicioOAMPConsultor: moment('2025-03-01').toDate(),
              nroHorasPagarDocente: 3,
              clasificacionValorHora: '$ 85.000',
              valorHora: 85000,
              valorTotalPagarDocente: 255000,
              entregables: 'Reporte de sesión',
              observaciones: 'Enfocarse en SEO local.',
              gestora: 'Laura Fernández',
              region: 'Región 3',
              cargueEvidencia: 'URL_EVIDENCIA_EXISTENTE_3',
              evidenceStatus: 'Devuelta',
              evidenceReturnReason: 'El informe no incluye todos los puntos solicitados.',
           },
           {
              id: 'event-4',
              title: 'Entrenamiento de Liderazgo (Pendiente Revisión)', // Indicador en título para demo
              start: moment('2025-06-10T15:00:00').toDate(),
              end: moment('2025-06-10T17:00:00').toDate(),
              description: 'Desarrollo de habilidades de liderazgo.',
              programa: 'Crecimiento Empresarial',
              tipoActividad: 'Talleres',
              modalidad: 'Presencial',
              ubicacion: 'Sala de Juntas, Anexo 2',
              tematica: 'Liderazgo',
              estadoActividad: 'Finalizado', // Consideramos Finalizado para eventos pasados
              coordinadorCCB: 'Luis Martínez',
              codigoAgenda: 'LID-T-004',
              dependencia: 'Recursos Humanos',
              nombreConsultor: 'Carlos Rojas',
              cedulaConsultor: '123456789',
              emailConsultor: 'carlos.rojas@example.com',
              celularConsultor: '3001234567',
              direccionConsultor: 'Calle 10 # 20-30',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-001',
              fechaInicioOAMPConsultor: moment('2025-01-01').toDate(),
              nroHorasPagarDocente: 2,
              clasificacionValorHora: '$ 90.000',
              valorHora: 90000,
              valorTotalPagarDocente: 180000,
              entregables: 'Plan de acción personal',
              observaciones: 'Sesión interactiva.',
              gestora: 'Ana García',
              region: 'Región 4',
              cargueEvidencia: 'URL_EVIDENCIA_EXISTENTE_4',
              evidenceStatus: 'Pendiente',
           },
           {
              id: 'event-5',
              title: 'Asesoría Individual - Plan de Negocio',
              start: moment('2025-06-18T09:30:00').toDate(),
              end: moment('2025-06-18T11:00:00').toDate(),
              description: 'Revisión y ajuste del plan de negocio.',
              programa: 'Emprendimiento',
              tipoActividad: 'Asesorias Individuales',
              modalidad: 'Virtual',
              enlaceVirtual: 'https://meet.google.com/wxyz-1234-567',
              ubicacion: null,
              tematica: 'Plan de Negocio',
              estadoActividad: 'Programado', // Este es futuro, sin evidencia
              coordinadorCCB: 'Pedro Gómez',
              codigoAgenda: 'EMP-A-005',
              dependencia: 'Emprendimiento',
              nombreConsultor: 'Andreína Ustate',
              cedulaConsultor: '1122334455',
              emailConsultor: 'andreina.ustate@example.com',
              celularConsultor: '3201122334',
              direccionConsultor: 'Carrera 5 # 15-25',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-003',
              fechaInicioOAMPConsultor: moment('2025-03-01').toDate(),
              nroHorasPagarDocente: 1.5,
              clasificacionValorHora: '$ 85.000',
              valorHora: 85000,
              valorTotalPagarDocente: 127500,
              entregables: 'Resumen de sesión',
              observaciones: 'Cliente con prototipo avanzado.',
              gestora: 'Laura Fernández',
              region: 'Región 3',
              cargueEvidencia: null,
              evidenceStatus: null, // <-- Estado nulo si no ha subido
           },
             {
              id: 'event-6',
              title: 'Taller de Ventas (Sin Evidencia)', // Indicador para demo
              start: moment('2025-05-01T09:00:00').toDate(), // Fecha en el pasado
              end: moment('2025-05-01T12:00:00').toDate(), // Fecha en el pasado
              description: 'Técnicas de cierre de ventas.',
              programa: 'Crecimiento Empresarial',
              tipoActividad: 'Talleres',
              modalidad: 'Virtual',
              enlaceVirtual: 'https://zoom.us/j/9876543210',
              ubicacion: null,
              tematica: 'Ventas',
              estadoActividad: 'Finalizado', // Estado: Finalizado
              coordinadorCCB: 'Luis Martínez',
              codigoAgenda: 'VEN-T-006',
              dependencia: 'Comercial',
              nombreConsultor: 'Carlos Rojas',
              cedulaConsultor: '123456789',
              emailConsultor: 'carlos.rojas@example.com',
              celularConsultor: '3001234567',
              direccionConsultor: 'Calle 10 # 20-30',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-001',
              fechaInicioOAMPConsultor: moment('2025-01-01').toDate(),
              nroHorasPagarDocente: 3,
              clasificacionValorHora: '$ 90.000',
              valorHora: 90000,
              valorTotalPagarDocente: 270000,
              entregables: 'Material de apoyo',
              observaciones: 'Alta participación esperada.',
              gestora: 'Ana García',
              region: 'Región 2',
              cargueEvidencia: null, // <-- No ha subido evidencia
              evidenceStatus: null, // <-- Estado nulo
           },
           {
              id: 'event-7',
              title: 'Asesoría Individual - Finanzas (Reprogramado)',
              start: moment('2025-07-10T10:00:00').toDate(),
              end: moment('2025-07-10T11:30:00').toDate(),
              description: 'Análisis financiero y proyecciones.',
              programa: 'Consolidación y escalamiento empresarial',
              tipoActividad: 'Asesorias Individuales',
              modalidad: 'Presencial',
              ubicacion: 'Oficina 205, Edificio Anexo',
              tematica: 'Finanzas',
              estadoActividad: 'Reprogramado',
              coordinadorCCB: 'María López',
              codigoAgenda: 'FIN-A-007',
              dependencia: 'Financiera',
              nombreConsultor: 'Julie Sáenz',
              cedulaConsultor: '987654321',
              emailConsultor: 'julie.saenz@example.com',
              celularConsultor: '3109876543',
              direccionConsultor: 'Avenida Siempre Viva 742',
              tipoVinculacionConsultor: 'Prestación de Servicios',
              nroOAMPConsultor: 'OAMP-002',
              fechaInicioOAMPConsultor: moment('2025-02-15').toDate(),
              nroHorasPagarDocente: 1.5,
              clasificacionValorHora: '$ 100.000',
              valorHora: 100000,
              valorTotalPagarDocente: 150000,
              entregables: 'Reporte financiero',
              observaciones: 'Cliente requiere análisis detallado.',
              gestora: 'Juan Pérez',
              region: 'Región 1',
              cargueEvidencia: null,
              evidenceStatus: null, // <-- Estado nulo
           },
      ];
      setAllEvents(mockEvents);
      setFilteredEvents(mockEvents); // Inicialmente, mostrar todos los eventos
    } catch (err) {
      setError('Hubo un error al cargar los eventos.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
    };

    fetchConsultorEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* Dependencia del ID del consultor si filtras por él */]); // Añadir dependencia si usas currentUser.id

  // Efecto para aplicar filtros cada vez que cambian los eventos o los términos de filtro
  useEffect(() => {
    let currentEvents = [...allEvents];

    // Filtrar por término de búsqueda (nombre, descripción, programa, etc.)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentEvents = currentEvents.filter(event =>
        event.title.toLowerCase().includes(lowerCaseSearchTerm) ||
        (event.description && event.description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (event.programa && event.programa.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (event.tipoActividad && event.tipoActividad.toLowerCase().includes(lowerCaseSearchTerm)) ||
         (event.modalidad && event.modalidad.toLowerCase().includes(lowerCaseSearchTerm)) ||
         (event.ubicacion && event.ubicacion.toLowerCase().includes(lowerCaseSearchTerm)) ||
         (event.tematica && event.tematica.toLowerCase().includes(lowerCaseSearchTerm)) ||
         (event.gestora && event.gestora.toLowerCase().includes(lowerCaseSearchTerm)) ||
         (event.region && event.region.toLowerCase().includes(lowerCaseSearchTerm))
         // Añade más campos aquí si quieres que la búsqueda los incluya
      );
    }

    // Filtrar por fecha
    if (filterDate) {
        const filterMomentDate = moment(filterDate, 'YYYY-MM-DD');
        if (filterMomentDate.isValid()) {
            currentEvents = currentEvents.filter(event =>
                moment(event.start).isSame(filterMomentDate, 'day')
            );
        }
    }

    // Filtrar por hora (aproximada, puedes ajustar la lógica si necesitas rangos)
    if (filterTime) {
        const [hours, minutes] = filterTime.split(':').map(Number);
        currentEvents = currentEvents.filter(event => {
            const eventStart = moment(event.start);
            // Filtra por la hora de inicio exacta
            return eventStart.hours() === hours && eventStart.minutes() === minutes;

            // Lógica más flexible para rango de hora (si la hora del filtro está dentro del evento):
            // const filterMomentTime = moment(filterTime, 'HH:mm');
            // const eventStart = moment(event.start);
            // const eventEnd = moment(event.end);
            // // Comprobar si la hora del filtro está entre la hora de inicio y fin del evento (inclusivo)
            // return filterMomentTime.isBetween(eventStart, eventEnd, null, '[]');
        });
    }

    // Filtrar por estado de actividad
    if (filterActivityStatus) {
        currentEvents = currentEvents.filter(event =>
            event.estadoActividad === filterActivityStatus
        );
    }


    setFilteredEvents(currentEvents);
  }, [allEvents, searchTerm, filterDate, filterTime, filterActivityStatus]); // Dependencias del efecto

  // Función para navegar a la página de detalles del evento
  const handleEventClick = (eventId) => {
    navigate(`/consultor/events/${eventId}`);
  };

  // Opciones de estado de actividad para el filtro (deberían venir de tu backend o ser constantes)
  const activityStatusOptions = [
      { value: '', label: 'Todos los estados' },
      { value: 'Programado', label: 'Programado' },
      { value: 'Confirmado', label: 'Confirmado' },
      { value: 'Pendiente', label: 'Pendiente' }, // Si el evento está pendiente (no la evidencia)
      { value: 'Finalizado', label: 'Finalizado' },
      { value: 'Cancelado', label: 'Cancelado' },
      { value: 'Reprogramado', label: 'Reprogramado' },
      // Añade aquí otros estados posibles según tu sistema
  ];


  if (loading) {
    return (
      <ConsultorLayout>
        <div className="consultor-event-list-container">
          <p className="loading-message">Cargando eventos...</p>
        </div>
      </ConsultorLayout>
    );
  }

  if (error) {
    return (
      <ConsultorLayout>
        <div className="consultor-event-list-container">
          <p className="error-message">{error}</p>
        </div>
      </ConsultorLayout>
    );
  }


  return (
    <ConsultorLayout>
      <div className="consultor-event-list-container">
        <h2>Mis Eventos Asignados</h2>

        {/* Filtros */}
        <div className="event-filters">
            <input
                type="text"
                placeholder="Buscar (nombre, tema, etc.)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
             <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
            />
             <input
                type="time"
                value={filterTime}
                onChange={(e) => setFilterTime(e.target.value)}
            />
             {/* Filtro de estado de actividad */}
             <select
                 value={filterActivityStatus}
                 onChange={(e) => setFilterActivityStatus(e.target.value)}
             >
                 {activityStatusOptions.map(option => (
                     <option key={option.value} value={option.value}>
                         {option.label}
                     </option>
                 ))}
             </select>

             {/* Botón para limpiar filtros */}
             {(searchTerm || filterDate || filterTime || filterActivityStatus) && (
                 <button className="clear-filters-button" onClick={() => {
                     setSearchTerm('');
                     setFilterDate('');
                     setFilterTime('');
                     setFilterActivityStatus('');
                 }}>Limpiar Filtros</button>
             )}
        </div>

        {/* Lista de Eventos Filtrados */}
        <ul className="event-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => {
                // Determinar la clase CSS para el estado de la evidencia en la lista
                let evidenceStatusClass = '';
                if (event.evidenceStatus) {
                    evidenceStatusClass = `evidence-${event.evidenceStatus.toLowerCase()}`;
                } else if (event.cargueEvidencia) {
                     // Si hay evidencia cargada pero no hay un evidenceStatus explícito, puedes tratarlo diferente
                     evidenceStatusClass = 'evidence-uploaded'; // Estilo para evidencia subida sin estado
                } else {
                    // Si no hay evidencia cargada ni evidenceStatus
                    evidenceStatusClass = 'evidence-not-uploaded'; // Estilo para evidencia no subida
                }

                return (
                  <li
                    key={event.id}
                    className={`event-list-item ${evidenceStatusClass}`} // Usar la clase determinada
                    onClick={() => handleEventClick(event.id)}
                  >
                     {/* Mostrar información clave del evento en la lista */}
                    <div className="event-title">{event.title}</div>
                    <div className="event-date-time">
                        {moment(event.start).format('DD/MM/YYYY')} | {moment(event.start).format('HH:mm')} - {moment(event.end).format('HH:mm')}
                    </div>
                     <div className="event-details-summary">
                         {event.tipoActividad} ({event.modalidad}) - {event.programa}
                     </div>
                     {/* Mostrar el estado de la evidencia en la lista */}
                     <div className={`event-evidence-status status-${event.evidenceStatus ? event.evidenceStatus.toLowerCase() : 'not-uploaded'}`}>
                         Evidencia: {event.evidenceStatus || 'No Subida'} {/* Mostrar "No Subida" si el estado es nulo */}
                     </div>
                     {/* Opcional: Mostrar el estado de la actividad también si lo deseas */}
                     {/* {event.estadoActividad && (
                          <div className="event-activity-status">
                              Estado: {event.estadoActividad}
                          </div>
                     )} */}
                  </li>
                );
            })
          ) : (
            <li className="no-events">No se encontraron eventos que coincidan con los filtros.</li>
          )}
        </ul>
      </div>
    </ConsultorLayout>
  );
};

export default ConsultorEventListPage;
