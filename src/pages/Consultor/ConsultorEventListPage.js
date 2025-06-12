import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Para navegar a los detalles
import moment from 'moment';
import 'moment/locale/es';
// Importar el layout específico del consultor
import ConsultorLayout from '../../components/ConsultorLayout';
// Ruta corregida para el CSS de esta página
import '../../styles/consultor-event-list.css';
import { useAuth } from '../../context/AuthContext';

moment.locale('es');

const ConsultorEventListPage = () => {
  const { userData } = useAuth();
  const navigate = useNavigate(); // Hook para navegación

  const [allEvents, setAllEvents] = useState([]); // Lista completa de eventos
  const [filteredEvents, setFilteredEvents] = useState([]); // Lista de eventos filtrados
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState(''); // Término de búsqueda para filtrar
  const [filterDate, setFilterDate] = useState(''); // Fecha para filtrar
  const [filterTime, setFilterTime] = useState(''); // Hora para filtrar
  const [filterActivityStatus, setFilterActivityStatus] = useState(''); // Estado para filtro de estado de actividad

  // Obtener el email del usuario actual desde el contexto de autenticación
  const currentUserEmail = userData?.user?.email;

  // TODO: Implementar la carga real de eventos asignados al consultor
  useEffect(() => {
    const fetchConsultorEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const mockEventsByConsultor = {
          'consultor1@demo.com': [
            {
              id: 'event-1-c1',
              title: 'Taller de Marketing Digital',
              start: moment('2025-05-10T09:00:00').toDate(),
              end: moment('2025-05-10T12:00:00').toDate(),
              description: 'Taller sobre estrategias de marketing digital y redes sociales.',
              programa: 'Emprendimiento Digital',
              tipoActividad: 'Talleres',
              modalidad: 'Presencial',
              ubicacion: 'Sala 201',
              tematica: 'Marketing Digital',
              estadoActividad: 'Programado',
              coordinadorCCB: 'Ana Martínez',
              codigoAgenda: 'MKT-T-001',
              dependencia: 'Marketing',
              nombreConsultor: 'Juan Carlos Pérez',
              cedulaConsultor: '1234567890',
              emailConsultor: 'consultor1@demo.com',
              celularConsultor: '3157894561',
              direccionConsultor: 'Calle 72 #10-34, Bogotá',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-2025-023',
              fechaInicioOAMPConsultor: moment('2025-03-15').toDate(),
              nroHorasPagarDocente: 3,
              clasificacionValorHora: '$ 95.000',
              valorHora: 95000,
              valorTotalPagarDocente: 285000,
              entregables: 'Presentación, Material de trabajo, Informe',
              observaciones: 'Preparar casos de éxito.',
              gestora: 'Laura Fernández',
              region: 'Región 1',
              enlaceVirtual: null,
              cargueEvidencia: null,
              evidenceStatus: null
            },
            {
              id: 'event-2-c1',
              title: 'Asesoría en Estrategia Digital',
              start: moment('2025-05-25T14:00:00').toDate(),
              end: moment('2025-05-25T16:00:00').toDate(),
              description: 'Asesoría individual sobre estrategia digital y presencia en línea.',
              programa: 'Transformación Digital',
              tipoActividad: 'Asesorías Individuales',
              modalidad: 'Virtual',
              enlaceVirtual: 'https://meet.google.com/xyz-abcd-123',
              ubicacion: null,
              tematica: 'Estrategia Digital',
              estadoActividad: 'Confirmado',
              coordinadorCCB: 'Pedro López',
              codigoAgenda: 'MKT-A-002',
              dependencia: 'Marketing',
              nombreConsultor: 'Juan Carlos Pérez',
              cedulaConsultor: '1234567890',
              emailConsultor: 'consultor1@demo.com',
              celularConsultor: '3157894561',
              direccionConsultor: 'Calle 72 #10-34, Bogotá',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-2025-023',
              fechaInicioOAMPConsultor: moment('2025-03-15').toDate(),
              nroHorasPagarDocente: 2,
              clasificacionValorHora: '$ 95.000',
              valorHora: 95000,
              valorTotalPagarDocente: 190000,
              entregables: 'Informe de asesoría, Plan digital',
              observaciones: 'Empresa en proceso de digitalización.',
              gestora: 'Ana García',
              region: 'Región 2',
              cargueEvidencia: null,
              evidenceStatus: null
            }
          ],
          'consultor2@demo.com': [
            {
              id: 'event-1',
              title: 'Taller de Finanzas Corporativas',
              start: moment('2025-05-15T09:00:00').toDate(),
              end: moment('2025-05-15T12:00:00').toDate(),
              description: 'Taller sobre análisis financiero y proyecciones.',
              programa: 'Crecimiento Empresarial',
              tipoActividad: 'Talleres',
              modalidad: 'Presencial',
              ubicacion: 'Sala 301',
              tematica: 'Análisis Financiero',
              estadoActividad: 'Programado',
              coordinadorCCB: 'Luis Martínez',
              codigoAgenda: 'FIN-T-001',
              dependencia: 'Finanzas',
              nombreConsultor: 'Adriana Marcela Díaz Jaime',
              cedulaConsultor: '1018425430',
              emailConsultor: 'consultor2@demo.com',
              celularConsultor: '3012345678',
              direccionConsultor: 'Carrera 15 #85-30',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-2025-024',
              fechaInicioOAMPConsultor: moment('2025-04-09').toDate(),
              nroHorasPagarDocente: 3,
              clasificacionValorHora: '$ 100.000',
              valorHora: 100000,
              valorTotalPagarDocente: 300000,
              entregables: 'Presentación, Material de trabajo, Informe',
              observaciones: 'Preparar casos prácticos.',
              gestora: 'Ana García',
              region: 'Región 2',
              enlaceVirtual: null,
              cargueEvidencia: null,
              evidenceStatus: null
            },
            {
              id: 'event-2',
              title: 'Asesoría en Proyecciones Financieras',
              start: moment('2025-05-20T14:00:00').toDate(),
              end: moment('2025-05-20T16:00:00').toDate(),
              description: 'Asesoría individual sobre proyecciones financieras y análisis de indicadores.',
              programa: 'Consolidación y escalamiento empresarial',
              tipoActividad: 'Asesorías Individuales',
              modalidad: 'Virtual',
              enlaceVirtual: 'https://meet.google.com/abc-defg-hij',
              ubicacion: null,
              tematica: 'Proyecciones Financieras',
              estadoActividad: 'Confirmado',
              coordinadorCCB: 'María López',
              codigoAgenda: 'FIN-A-002',
              dependencia: 'Finanzas',
              nombreConsultor: 'Adriana Marcela Díaz Jaime',
              cedulaConsultor: '1018425430',
              emailConsultor: 'consultor2@demo.com',
              celularConsultor: '3012345678',
              direccionConsultor: 'Carrera 15 #85-30',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-2025-024',
              fechaInicioOAMPConsultor: moment('2025-04-09').toDate(),
              nroHorasPagarDocente: 2,
              clasificacionValorHora: '$ 100.000',
              valorHora: 100000,
              valorTotalPagarDocente: 200000,
              entregables: 'Informe de asesoría, Plan financiero',
              observaciones: 'Empresa en etapa de crecimiento.',
              gestora: 'Juan Pérez',
              region: 'Región 1',
              cargueEvidencia: null,
              evidenceStatus: null
            },
            {
              id: 'event-3',
              title: 'Taller de Indicadores Financieros',
              start: moment('2025-06-05T10:00:00').toDate(),
              end: moment('2025-06-05T13:00:00').toDate(),
              description: 'Construcción y análisis de indicadores financieros clave.',
              programa: 'Emprendimiento',
              tipoActividad: 'Talleres',
              modalidad: 'Híbrido',
              enlaceVirtual: 'https://zoom.us/j/1234567890',
              ubicacion: 'Sala 402',
              tematica: 'Indicadores Financieros',
              estadoActividad: 'Programado',
              coordinadorCCB: 'Pedro Gómez',
              codigoAgenda: 'FIN-T-003',
              dependencia: 'Finanzas',
              nombreConsultor: 'Adriana Marcela Díaz Jaime',
              cedulaConsultor: '1018425430',
              emailConsultor: 'consultor2@demo.com',
              celularConsultor: '3012345678',
              direccionConsultor: 'Carrera 15 #85-30',
              tipoVinculacionConsultor: 'Contrato',
              nroOAMPConsultor: 'OAMP-2025-024',
              fechaInicioOAMPConsultor: moment('2025-04-09').toDate(),
              nroHorasPagarDocente: 3,
              clasificacionValorHora: '$ 100.000',
              valorHora: 100000,
              valorTotalPagarDocente: 300000,
              entregables: 'Material didáctico, Ejercicios prácticos',
              observaciones: 'Enfoque en indicadores de rentabilidad y liquidez.',
              gestora: 'Laura Fernández',
              region: 'Región 3',
              cargueEvidencia: null,
              evidenceStatus: null
            }
          ]
        };

        const events = mockEventsByConsultor[currentUserEmail] || [];
        setAllEvents(events);
        setFilteredEvents(events);
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