import React, { useState, useEffect } from 'react';
// Importar el layout específico del consultor
import ConsultorLayout from '../../components/ConsultorLayout';
// Importar tu componente de calendario personalizado
import CustomConsultorCalendar from '../../components/CustomConsultorCalendar';
// Ruta corregida para el CSS del dashboard (incluye estilos del modal)
import './ConsultorDashboardPage.css';
// Importa tu hook de autenticación si necesitas obtener el ID del consultor para filtrar eventos
// Asegúrate de que la ruta a tu AuthContext sea correcta desde src/pages/Consultor/
import { useAuth } from '../../context/AuthContext';
import moment from 'moment'; // Importar moment para manejar fechas y formato
import NotificationService from '../../utils/notificationService';

const ConsultorDashboardPage = () => {
  const { userData } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Estado para el evento seleccionado. Será null si el modal está cerrado.
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoaded, setNotificationsLoaded] = useState(false);

  // Efecto para cargar y actualizar notificaciones
  useEffect(() => {
    const loadNotifications = () => {
      if (userData?.user?.email) {
        console.log('📧 Cargando notificaciones para:', userData.user.email);
        const userNotifications = NotificationService.getNotifications(userData.user.email);
        console.log('📬 Notificaciones cargadas:', userNotifications);
        setNotifications(userNotifications);
        setNotificationsLoaded(true);
      }
    };

    // Cargar notificaciones inicialmente
    loadNotifications();

    // Configurar un intervalo para actualizar las notificaciones
    const interval = setInterval(loadNotifications, 30000); // Actualizar cada 30 segundos

    return () => clearInterval(interval);
  }, [userData?.user?.email]);

  // Efecto para actualizar eventos cuando cambian las notificaciones
  useEffect(() => {
    const fetchConsultorEvents = async () => {
      if (!notificationsLoaded) return;

      setLoading(true);
      setError(null);
      try {
        // Datos mock (simulados) por ahora, con más campos
        // Asegúrate de que las fechas sean objetos Date
        const mockEvents = [
          {
            id: 1,
            title: 'Taller de Innovación',
            start: moment('2025-05-15T09:00:00').toDate(),
            end: moment('2025-05-15T12:00:00').toDate(),
            description: 'Taller sobre metodologías ágiles y design thinking.',
            ubicacion: 'Sala 301, Edificio Principal',
            gestora: 'Ana García',
            status: 'Pendiente',
            programa: 'Crecimiento Empresarial',
            ruta: 'Ruta 1', // Ejemplo, ajusta según tu lógica
            sector: 'Tecnología', // Ejemplo
            tematica: 'Metodologías Ágiles', // Usamos un campo específico para temática
            tipoActividad: 'Talleres',
            modalidad: 'Presencial',
            region: 'Región 2', // Ejemplo
            enlaceVirtual: null, // O el enlace si aplica
            estadoActividad: 'Programado', // Ejemplo
            coordinadorCCB: 'Luis Martínez', // Ejemplo
            codigoAgenda: 'INN-T-001', // Ejemplo
            dependencia: 'Innovación', // Ejemplo
            nombreConsultor: 'Carlos Rojas', // Ejemplo
            cedulaConsultor: '123456789', // Ejemplo
            emailConsultor: 'carlos.rojas@example.com', // Ejemplo
            celularConsultor: '3001234567', // Ejemplo
            direccionConsultor: 'Calle 10 # 20-30', // Ejemplo
            tipoVinculacionConsultor: 'Contrato', // Ejemplo
            nroOAMPConsultor: 'OAMP-001', // Ejemplo
            fechaInicioOAMPConsultor: moment('2025-01-01').toDate(), // Ejemplo
            nroHorasPagarDocente: 3, // Ejemplo
            nroHorasCobrarCCB: 4, // ESTE CAMPO NO SE MOSTRARÁ AL CONSULTOR
            clasificacionValorHora: '$ 90.000', // Ejemplo
            valorHora: 90000, // Ejemplo
            valorTotalPagarDocente: 270000, // Ejemplo (3 * 90000)
            valorHoraCobrarCCB: 120000, // ESTE CAMPO NO SE MOSTRARÁ AL CONSULTOR
            valorTotalCobrarCCB: 480000, // ESTE CAMPO NO SE MOSTRARÁ AL CONSULTOR
            entregables: 'Presentación, Informe', // Ejemplo
            observaciones: 'Preparar material adicional.', // Ejemplo
            // cargueEvidencia: 'URL_EVIDENCIA', // Ejemplo
          },
          {
            id: 2,
            title: 'Reunión de Estrategia Anual',
            start: moment('2025-05-20T14:00:00').toDate(),
            end: moment('2025-05-20T16:00:00').toDate(),
            description: 'Planificación de estrategias para el próximo trimestre y revisión de objetivos.',
            ubicacion: 'Oficina Principal, Piso 5',
            gestora: 'Juan Pérez',
            status: 'Aceptado',
            programa: 'Consolidación y escalamiento empresarial', // Ejemplo
            ruta: 'Ruta 2', // Ejemplo
            sector: 'Servicios', // Ejemplo
            tematica: 'Planificación Estratégica', // Usamos un campo específico para temática
            tipoActividad: 'Asesorias Grupales o Capsulas',
            modalidad: 'Híbrido',
            region: 'Región 1', // Ejemplo
            enlaceVirtual: 'https://meet.google.com/abc-defg-hij', // Ejemplo
            estadoActividad: 'Confirmado', // Ejemplo
            coordinadorCCB: 'María López', // Ejemplo
            codigoAgenda: 'EST-R-002', // Ejemplo
            dependencia: 'Estrategia', // Ejemplo
            nombreConsultor: 'Julie Sáenz', // Ejemplo
            cedulaConsultor: '987654321', // Ejemplo
            emailConsultor: 'julie.saenz@example.com', // Ejemplo
            celularConsultor: '3109876543', // Ejemplo
            direccionConsultor: 'Avenida Siempre Viva 742', // Ejemplo
            tipoVinculacionConsultor: 'Prestación de Servicios', // Ejemplo
            nroOAMPConsultor: 'OAMP-002', // Ejemplo
            fechaInicioOAMPConsultor: moment('2025-02-15').toDate(), // Ejemplo
            nroHorasPagarDocente: 2, // Ejemplo
            nroHorasCobrarCCB: 2, // ESTE CAMPO NO SE MOSTRARÁ AL CONSULTOR
            clasificacionValorHora: '$ 100.000', // Ejemplo
            valorHora: 100000, // Ejemplo
            valorTotalPagarDocente: 200000, // Ejemplo
            valorHoraCobrarCCB: 150000, // ESTE CAMPO NO SE MOSTRARÁ AL CONSULTOR
            valorTotalCobrarCCB: 300000, // ESTE CAMPO NO SE MOSTRARÁ AL CONSULTOR
            entregables: 'Acta de reunión', // Ejemplo
            observaciones: 'Revisar informe previo.', // Ejemplo
            // cargueEvidencia: 'URL_EVIDENCIA_2', // Ejemplo
          },
          // Puedes añadir más eventos mock aquí con la estructura completa
        ];

        // Convertir notificaciones a eventos
        const notificationEvents = notifications
          .filter(n => n.type === 'nueva_programacion')
          .map(n => ({
            id: n.id,
            title: n.title,
            start: moment(n.data.fecha + 'T' + n.data.horaInicio).toDate(),
            end: moment(n.data.fecha + 'T' + n.data.horaInicio).add(2, 'hours').toDate(),
            description: n.message,
            programa: n.data.programa,
            tipoActividad: n.data.tipoActividad,
            modalidad: n.data.modalidad,
            ubicacion: n.data.direccion,
            enlaceVirtual: n.data.enlace,
            tematica: n.data.tematica,
            estadoActividad: 'Pendiente',
            coordinadorCCB: n.data.coordinadorCCB,
            isNew: !n.read,
            source: 'notification'
          }));

        console.log('🗓️ Eventos de notificaciones:', notificationEvents);

        // Combinar con eventos existentes
        const allEvents = [...mockEvents, ...notificationEvents];
        console.log('📅 Total de eventos:', allEvents.length);
        setEvents(allEvents);
      } catch (err) {
        setError('Hubo un error al cargar los eventos.');
        console.error('❌ Error cargando eventos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultorEvents();
  }, [notifications, notificationsLoaded]);

  // Función para manejar cuando se selecciona un evento
  const handleSelectEvent = (event) => {
    console.log("🎯 Evento seleccionado:", event);
    setSelectedEvent(event);
    
    // Si el evento viene de una notificación, marcarlo como leído
    if (event.source === 'notification' && event.isNew && userData?.user?.email) {
      console.log('✓ Marcando notificación como leída:', event.id);
      NotificationService.markAsRead(userData.user.email, event.id);
      // Actualizar las notificaciones
      const userNotifications = NotificationService.getNotifications(userData.user.email);
      setNotifications(userNotifications);
    }
  };

  // Función para cerrar el modal de detalles
  const handleCloseModal = () => {
    console.log("Cerrando modal..."); // <-- DEBUG: Indica que se llamó a cerrar modal
    setSelectedEvent(null); // Establece selectedEvent a null para ocultar el modal
    console.log("Estado selectedEvent establecido a null."); // <-- DEBUG: Confirma que se ocultará
  };

  console.log("Renderizando ConsultorDashboardPage. selectedEvent:", selectedEvent); // <-- DEBUG: Muestra el estado antes de renderizar

  return (
    <ConsultorLayout> {/* Usar el layout específico del consultor */}
      <div className="consultor-dashboard-container">
        <h2>Mi Calendario de Eventos</h2>

        {/* Panel de Notificaciones */}
        {notifications.length > 0 && (
          <div className="notifications-panel">
            <h3>Notificaciones</h3>
            <div className="notifications-list">
              {notifications.map(notification => (
                <div 
                  key={notification.id} 
                  className={`notification-item ${notification.read ? '' : 'unread'}`}
                >
                  <div className="notification-title">{notification.title}</div>
                  <div className="notification-message">{notification.message}</div>
                  <div className="notification-timestamp">
                    {moment(notification.timestamp).fromNow()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && <p className="loading-message">Cargando eventos...</p>}
        {error && <p className="error-message">{error}</p>}
        {!loading && !error && (
          <CustomConsultorCalendar
            events={events} // Pasar el array de eventos
            onSelectEvent={handleSelectEvent} // Pasar la función para manejar la selección
          />
        )}

        {/* Sección para el modal de detalles de evento personalizado */}
        {/* Se renderiza condicionalmente si selectedEvent tiene un valor (no es null) */}
        {/* Añadimos la clase 'visible' condicionalmente para controlar la animación/visibilidad con CSS */}
        {selectedEvent && (
          <div className={`event-detail-modal-overlay ${selectedEvent ? 'visible' : ''}`} onClick={handleCloseModal}>
            <div className="event-detail-modal-content" onClick={e => e.stopPropagation()}>
              <h3>{selectedEvent.title}</h3>
              {/* Mostrar más detalles del evento */}
              <p><strong>Programa:</strong> {selectedEvent.programa}</p>
              <p><strong>Ruta:</strong> {selectedEvent.ruta}</p>
              <p><strong>Sector:</strong> {selectedEvent.sector}</p>
              {/* Usamos el nuevo campo 'tematica' si existe, de lo contrario description */}
              <p><strong>Temática:</strong> {selectedEvent.tematica || selectedEvent.description}</p>
              <p><strong>Tipo de Actividad:</strong> {selectedEvent.tipoActividad}</p>
              <p><strong>Modalidad:</strong> {selectedEvent.modalidad}</p>
              <p><strong>Fecha:</strong> {moment(selectedEvent.start).format('DD/MM/YYYY')}</p>
              <p><strong>Hora Inicio:</strong> {moment(selectedEvent.start).format('HH:mm')}</p>
              <p><strong>Hora Fin:</strong> {moment(selectedEvent.end).format('HH:mm')}</p>
              {/* Puedes calcular las horas programadas si tienes la duración */}
              {/* <p><strong>Horas Programadas:</strong> {moment(selectedEvent.end).diff(moment(selectedEvent.start), 'hours')} horas</p> */}
              <p><strong>Lugar/Enlace:</strong> {selectedEvent.ubicacion || selectedEvent.enlaceVirtual}</p> {/* Mostrar ubicación o enlace */}
              <p><strong>Región:</strong> {selectedEvent.region}</p>
              <p><strong>Estado de la Actividad:</strong> {selectedEvent.estadoActividad}</p>
              <p><strong>Coordinador CCB:</strong> {selectedEvent.coordinadorCCB}</p>
              <p><strong>Código Agenda:</strong> {selectedEvent.codigoAgenda}</p>
              <p><strong>Dependencia:</strong> {selectedEvent.dependencia}</p>
              <p><strong>Gestora:</strong> {selectedEvent.gestora}</p>

              <h4>Información del Consultor</h4>
              <p><strong>Nombre:</strong> {selectedEvent.nombreConsultor}</p>
              <p><strong>Cédula:</strong> {selectedEvent.cedulaConsultor}</p>
              <p><strong>E-mail:</strong> {selectedEvent.emailConsultor}</p>
              <p><strong>Celular:</strong> {selectedEvent.celularConsultor}</p>
              <p><strong>Dirección:</strong> {selectedEvent.direccionConsultor}</p>
              <p><strong>Tipo de Vinculación:</strong> {selectedEvent.tipoVinculacionConsultor}</p>
              <p><strong>N° OAMP:</strong> {selectedEvent.nroOAMPConsultor}</p>
              <p><strong>Fecha Inicio OAMP:</strong> {moment(selectedEvent.fechaInicioOAMPConsultor).format('DD/MM/YYYY')}</p>

              <h4>Información de Pago (Docente)</h4> {/* Cambiado el título */}
              <p><strong>N° Horas a Pagar Docente:</strong> {selectedEvent.nroHorasPagarDocente}</p>
              {/* <p><strong>N° Horas a Cobrar CCB:</strong> {selectedEvent.nroHorasCobrarCCB}</p> <-- Oculto */}
              <p><strong>Clasificación Valor Hora:</strong> {selectedEvent.clasificacionValorHora}</p>
              <p><strong>Valor Hora:</strong> ${selectedEvent.valorHora?.toLocaleString('es-CO')}</p> {/* Formato de moneda CO */}
              <p><strong>Valor Total a Pagar Docente:</strong> ${selectedEvent.valorTotalPagarDocente?.toLocaleString('es-CO')}</p>
              {/* <p><strong>Valor Hora a Cobrar CCB:</strong> ${selectedEvent.valorHoraCobrarCCB?.toLocaleString('es-CO')}</p> <-- Oculto */}
              {/* <p><strong>Valor Total a Cobrar CCB:</strong> ${selectedEvent.valorTotalCobrarCCB?.toLocaleString('es-CO')}</p> <-- Oculto */}

              <h4>Otros Detalles</h4>
              <p><strong>Entregables:</strong> {selectedEvent.entregables}</p>
              <p><strong>Observaciones:</strong> {selectedEvent.observaciones}</p>
              {/* Si tienes la URL de la evidencia, puedes mostrar un enlace */}
              {/* {selectedEvent.cargueEvidencia && (
                <p><strong>Evidencia:</strong> <a href={selectedEvent.cargueEvidencia} target="_blank" rel="noopener noreferrer">Ver Evidencia</a></p>
              )} */}


              <button onClick={handleCloseModal} className="close-modal-button">Cerrar</button>
            </div>
          </div>
        )}
      </div>
    </ConsultorLayout>
  );
};

export default ConsultorDashboardPage;