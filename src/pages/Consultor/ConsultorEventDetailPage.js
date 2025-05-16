import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Para obtener el ID del evento de la URL
import moment from 'moment';
import 'moment/locale/es';
// Importar el layout específico del consultor
import ConsultorLayout from '../../components/ConsultorLayout';
// Ruta corregida para el CSS de esta página
import '../../styles/consultor-event-detail.css';
// Importa tu hook de autenticación si necesitas el ID del consultor para la subida
// import { useAuth } from '../../context/AuthContext';

moment.locale('es');

const ConsultorEventDetailPage = () => {
  const { eventId } = useParams(); // Obtiene el eventId de la URL
  const navigate = useNavigate(); // Hook para navegación
  // const { currentUser } = useAuth(); // Para obtener el ID del consultor

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo seleccionado
  const [uploading, setUploading] = useState(false); // Estado para indicar si se está subiendo
  const [uploadError, setUploadError] = useState(null); // Estado para errores de subida
  const [uploadSuccess, setUploadSuccess] = useState(false); // Estado para éxito de subida

  // Referencia para el input de archivo (para poder abrirlo programáticamente)
  const fileInputRef = useRef(null);
  // Referencia para el input de cámara (si decides implementarlo)
  // const cameraInputRef = useRef(null);


  useEffect(() => {
    // TODO: Implementar la carga real de los detalles de un evento específico
    const fetchEventDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        // Aquí deberías hacer la llamada a tu API para obtener los detalles
        // del evento con el ID = eventId.
        // const response = await fetch(`/api/events/${eventId}`);
        // if (!response.ok) throw new Error('Error al cargar los detalles del evento');
        // const data = await response.json();
        // setEvent({
        //     ...data,
        //     start: new Date(data.start),
        //     end: new Date(data.end),
        //     fechaInicioOAMPConsultor: data.fechaInicioOAMPConsultor ? new Date(data.fechaInicioOAMPConsultor) : null,
        //     // Asegúrate de que el campo evidenceStatus venga de tu API
        //     evidenceStatus: data.evidenceStatus || null, // <-- Puede ser null si no se ha subido
        //     evidenceReturnReason: data.evidenceReturnReason || null, // Razón si es 'Devuelta'
        // });

         // Datos mock (simulados) para un evento específico, usando la estructura enriquecida
         // Y añadiendo el estado de la evidencia, incluyendo un evento pasado sin evidencia.
         const mockEvents = [
             {
                id: 'event-1',
                title: 'Taller de Innovación',
                start: moment('2025-05-15T09:00:00').toDate(),
                end: moment('2025-05-15T12:00:00').toDate(),
                description: 'Taller sobre metodologías ágiles y design thinking.',
                ubicacion: 'Sala 301, Edificio Principal',
                gestora: 'Ana García',
                status: 'Programado', // Estado del evento (no de la evidencia)
                programa: 'Crecimiento Empresarial',
                ruta: 'Ruta 1',
                sector: 'Tecnología',
                tematica: 'Metodologías Ágiles',
                tipoActividad: 'Talleres',
                modalidad: 'Presencial',
                region: 'Región 2',
                enlaceVirtual: null,
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
                cargueEvidencia: null, // No ha subido
                evidenceStatus: null, // Estado nulo si no ha subido
                evidenceReturnReason: null,
            },
             {
                id: 'event-2',
                title: 'Reunión de Estrategia Anual',
                start: moment('2025-05-20T14:00:00').toDate(),
                end: moment('2025-05-20T16:00:00').toDate(),
                description: 'Planificación de estrategias.',
                ubicacion: 'Oficina Principal, Piso 5',
                gestora: 'Juan Pérez',
                status: 'Confirmado',
                programa: 'Consolidación y escalamiento empresarial',
                ruta: 'Ruta 2',
                sector: 'Servicios',
                tematica: 'Planificación Estratégica',
                tipoActividad: 'Asesorias Grupales o Capsulas',
                modalidad: 'Híbrido',
                region: 'Región 1',
                enlaceVirtual: 'https://meet.google.com/abc-defg-hij',
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
                cargueEvidencia: 'URL_EVIDENCIA_EXISTENTE_2', // Simular evidencia existente
                evidenceStatus: 'Aceptada',
                evidenceReturnReason: null,
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
              cargueEvidencia: 'URL_EVIDENCIA_EXISTENTE_4', // Simular evidencia subida
              evidenceStatus: 'Pendiente',
              evidenceReturnReason: null,
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
              evidenceStatus: null, // Estado nulo si no ha subido
              evidenceReturnReason: null,
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
              evidenceReturnReason: null,
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
              evidenceReturnReason: null,
           },
      ];

         const foundEvent = mockEvents.find(ev => ev.id === eventId);

         if (foundEvent) {
             setEvent(foundEvent);
         } else {
             setError('Evento no encontrado.');
         }

      } catch (err) {
        setError('Hubo un error al cargar los detalles del evento.');
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetails();
    } else {
      setError('ID de evento no proporcionado.');
      setLoading(false);
    }

  }, [eventId]); // Dependencia del eventId de la URL

  // Manejar la selección de archivo
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadError(null); // Limpiar errores previos
      setUploadSuccess(false); // Limpiar éxito previo
    }
  };

  // TODO: Implementar la lógica para abrir la cámara
  const handleOpenCamera = () => {
    alert("Funcionalidad de abrir cámara no implementada en este ejemplo.");
    // Aquí iría la lógica para acceder a la cámara del dispositivo
    // Usualmente implica usar la API MediaDevices (navigator.mediaDevices.getUserMedia)
    // y mostrar el stream de video en un elemento <video>,
    // luego capturar un frame a un <canvas> para obtener la imagen.
    // Esto es más complejo y requiere permisos del usuario.
    // Por ahora, es un placeholder.
  };

  // TODO: Implementar la lógica de subida de evidencia
  const handleUploadEvidence = async () => {
    if (!selectedFile) {
      setUploadError("Por favor, selecciona un archivo para subir.");
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    // TODO: Aquí deberías implementar la llamada a tu API para subir el archivo
    // Necesitarás enviar el archivo (selectedFile) y el ID del evento (eventId)
    // y potencialmente el ID del consultor (currentUser?.id) al backend.
    // Puedes usar FormData para enviar el archivo en una petición POST.

    console.log("Simulando subida de archivo:", selectedFile.name, "para el evento:", eventId);
    // const formData = new FormData();
    // formData.append('evidence', selectedFile);
    // formData.append('eventId', eventId);
    // if (currentUser?.id) {
    //     formData.append('consultorId', currentUser.id);
    // }

    try {
       // const response = await fetch('/api/upload-evidence', {
       //     method: 'POST',
       //     body: formData,
       // });
       // if (!response.ok) {
       //     const errorData = await response.json();
       //     throw new Error(errorData.message || 'Error al subir la evidencia.');
       // }
       // const result = await response.json();
       // console.log("Subida exitosa:", result);

       // Simular subida exitosa
       await new Promise(resolve => setTimeout(resolve, 2000)); // Simular tiempo de subida
       setUploadSuccess(true);
       setSelectedFile(null); // Limpiar archivo seleccionado después de subir
       // TODO: Opcional: Actualizar el estado del evento para reflejar que ya tiene evidencia
       // setEvent(prevEvent => ({ ...prevEvent, cargueEvidencia: 'URL_DE_LA_EVIDENCIA_SUBIDA', evidenceStatus: 'Pendiente' })); // Cambiar estado a Pendiente al subir
       // alert("Evidencia subida con éxito. Esperando revisión de la gestora.");

    } catch (err) {
       console.error("Error durante la subida:", err);
       setUploadError(`Error al subir la evidencia: ${err.message}`);
    } finally {
       setUploading(false);
    }
  };

  // TODO: Implementar la lógica para enviar la evidencia a la gestora
  // Esto podría ser una llamada API separada o parte de la subida
  const handleSendEvidence = async () => {
      alert("Funcionalidad de enviar evidencia a la gestora no implementada en este ejemplo.");
      // Aquí iría la llamada a tu API para notificar a la gestora o marcar la evidencia como enviada
      // Probablemente necesites el eventId y el ID del consultor.
      console.log("Simulando envío de evidencia para el evento:", eventId);
      // try {
      //    const response = await fetch('/api/send-evidence', {
      //        method: 'POST',
      //        headers: { 'Content-Type': 'application/json' },
      //        body: JSON.stringify({ eventId: eventId, consultorId: currentUser?.id }),
      //    });
      //    if (!response.ok) throw new Error('Error al enviar la notificación a la gestora.');
      //    alert("Evidencia enviada a la gestora con éxito.");
      //    // TODO: Opcional: Actualizar el estado local si la API confirma el envío
      //    // setEvent(prevEvent => ({ ...prevEvent, evidenceStatus: 'Pendiente' })); // Asumiendo que al enviar pasa a Pendiente
      // } catch (err) {
      //    console.error("Error al enviar evidencia:", err);
      //    alert(`Error al enviar evidencia: ${err.message}`);
      // }
  };

  // Determinar el texto y la clase CSS para el estado de la evidencia
  // Si evidenceStatus es null y cargueEvidencia es null, mostramos "No Subida"
  let evidenceStatusText = 'Estado de Evidencia: No Subida';
  let evidenceStatusClass = 'evidence-status not-uploaded'; // Clase por defecto para no subida

  if (event?.evidenceStatus) { // Si evidenceStatus no es null o undefined
      switch (event.evidenceStatus) {
          case 'Pendiente':
              evidenceStatusText = 'Estado de Evidencia: Pendiente de revisión';
              evidenceStatusClass = 'evidence-status pending';
              break;
          case 'Aceptada':
              evidenceStatusText = 'Estado de Evidencia: Aceptada';
              evidenceStatusClass = 'evidence-status accepted';
              break;
          case 'Devuelta':
              evidenceStatusText = 'Estado de Evidencia: Devuelta';
              evidenceStatusClass = 'evidence-status returned';
              break;
           // Puedes añadir otros casos si tienes más estados de evidencia
          default:
             evidenceStatusText = `Estado de Evidencia: ${event.evidenceStatus}`; // Muestra el estado si es desconocido
             evidenceStatusClass = 'evidence-status unknown';
             break;
      }
  } else if (event?.cargueEvidencia) {
       // Si cargueEvidencia tiene un valor pero evidenceStatus es null
       // Esto podría representar un estado intermedio "Subida" sin revisión aún.
       evidenceStatusText = 'Estado de Evidencia: Subida (Pendiente de revisión)';
       evidenceStatusClass = 'evidence-status uploaded'; // Puedes definir este estilo
  }
   // Si event.evidenceStatus es null Y event.cargueEvidencia es null, se usan los valores por defecto ('No Subida', 'not-uploaded')


  if (loading) {
    return (
      <ConsultorLayout>
        <div className="consultor-event-detail-container">
          <p className="loading-message">Cargando detalles del evento...</p>
        </div>
      </ConsultorLayout>
    );
  }

  if (error) {
    return (
      <ConsultorLayout>
        <div className="consultor-event-detail-container">
          <p className="error-message">{error}</p>
          <button onClick={() => navigate('/consultor/events')} className="back-button">Volver a la Lista de Eventos</button>
        </div>
      </ConsultorLayout>
    );
  }

  if (!event) {
       return (
         <ConsultorLayout>
            <div className="consultor-event-detail-container">
               <p className="error-message">No se encontraron detalles para este evento.</p>
               <button onClick={() => navigate('/consultor/events')} className="back-button">Volver a la Lista de Eventos</button>
            </div>
         </ConsultorLayout>
       );
  }


  return (
    <ConsultorLayout>
      <div className="consultor-event-detail-container">
        <h2>Detalles del Evento</h2>

        {/* Información General del Evento */}
        <div className="event-details-section">
            <h3>{event.title}</h3>
            <p><strong>Programa:</strong> {event.programa}</p>
            <p><strong>Ruta:</strong> {event.ruta}</p>
            <p><strong>Sector:</strong> {event.sector}</p>
            <p><strong>Temática:</strong> {event.tematica || event.description}</p>
            <p><strong>Tipo de Actividad:</strong> {event.tipoActividad}</p>
            <p><strong>Modalidad:</strong> {event.modalidad}</p>
            <p><strong>Fecha:</strong> {moment(event.start).format('DD/MM/YYYY')}</p>
            <p><strong>Hora Inicio:</strong> {moment(event.start).format('HH:mm')}</p>
            <p><strong>Hora Fin:</strong> {moment(event.end).format('HH:mm')}</p>
            <p><strong>Lugar/Enlace:</strong> {event.ubicacion || event.enlaceVirtual}</p>
            <p><strong>Región:</strong> {event.region}</p>
            <p><strong>Estado de la Actividad:</strong> {event.estadoActividad}</p>
            <p><strong>Coordinador CCB:</strong> {event.coordinadorCCB}</p>
            <p><strong>Código Agenda:</strong> {event.codigoAgenda}</p>
            <p><strong>Dependencia:</strong> {event.dependencia}</p>
            <p><strong>Gestora:</strong> {event.gestora}</p>
        </div>

        {/* Información del Consultor (Opcional, si quieres mostrarla aquí también) */}
        {/* <div className="event-details-section">
            <h4>Información del Consultor</h4>
             <p><strong>Nombre:</strong> {event.nombreConsultor}</p>
             <p><strong>Cédula:</strong> {event.cedulaConsultor}</p>
             <p><strong>E-mail:</strong> {event.emailConsultor}</p>
             <p><strong>Celular:</strong> {event.celularConsultor}</p>
             <p><strong>Dirección:</strong> {event.direccionConsultor}</p>
             <p><strong>Tipo de Vinculación:</strong> {event.tipoVinculacionConsultor}</p>
             <p><strong>N° OAMP:</strong> {event.nroOAMPConsultor}</p>
             <p><strong>Fecha Inicio OAMP:</strong> {moment(event.fechaInicioOAMPConsultor).format('DD/MM/YYYY')}</p>
        </div> */}


        {/* Sección de Subida de Evidencia */}
        <div className="evidence-upload-section">
            <h3>Subir Evidencia</h3>

            {/* Mostrar el estado de la evidencia */}
            <p className={evidenceStatusClass}>{evidenceStatusText}</p>

            {/* Mostrar razón de devolución si aplica */}
            {event.evidenceStatus === 'Devuelta' && event.evidenceReturnReason && (
                <p className="evidence-return-reason">
                    <strong>Razón de devolución:</strong> {event.evidenceReturnReason}
                </p>
            )}

            {/* Mostrar evidencia existente si la hay */}
            {event.cargueEvidencia && (
                <div className="existing-evidence">
                    <p><strong>Evidencia Cargada:</strong> <a href={event.cargueEvidencia} target="_blank" rel="noopener noreferrer">Ver Archivo</a></p>
                </div>
            )}

            {/* Opciones de subida (mostrar solo si la evidencia no ha sido aceptada) */}
            {event.evidenceStatus !== 'Aceptada' && ( // Solo permite subir si no está Aceptada
                <>
                    <div className="upload-options">
                         {/* Input de archivo oculto */}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            style={{ display: 'none' }} // Ocultar el input nativo
                        />
                        {/* Botón para abrir el selector de archivos */}
                        <button onClick={() => fileInputRef.current.click()} className="upload-button">
                            Seleccionar Archivo
                        </button>
                        {/* Botón para abrir la cámara (placeholder) */}
                        <button onClick={handleOpenCamera} className="upload-button secondary">
                            Abrir Cámara
                        </button>
                    </div>

                    {/* Mostrar nombre del archivo seleccionado */}
                    {selectedFile && (
                        <p className="selected-file-info">Archivo seleccionado: <strong>{selectedFile.name}</strong></p>
                    )}

                    {/* Botón para subir la evidencia */}
                    <button
                        onClick={handleUploadEvidence}
                        className="upload-button primary"
                        disabled={!selectedFile || uploading} // Deshabilitar si no hay archivo o se está subiendo
                    >
                        {uploading ? 'Subiendo...' : 'Subir Evidencia'}
                    </button>

                    {/* Botón para enviar la evidencia a la gestora */}
                    {/* Mostrar este botón solo si hay evidencia cargada (simulada o real) Y no está aceptada */}
                    {(event.cargueEvidencia || uploadSuccess) && event.evidenceStatus !== 'Aceptada' && (
                         <button
                             onClick={handleSendEvidence}
                             className="send-evidence-button"
                             disabled={uploading} /* Deshabilitar si se está subiendo */
                         >
                             Enviar Evidencia a Gestora
                         </button>
                    )}
                </>
            )}


            {/* Mensajes de estado de subida */}
            {uploadError && <p className="upload-status error">{uploadError}</p>}
            {uploadSuccess && <p className="upload-status success">Evidencia subida con éxito.</p>}
        </div>

        {/* Botón para volver a la lista de eventos */}
        <button onClick={() => navigate('/consultor/events')} className="back-button">Volver a la Lista de Eventos</button>

      </div>
    </ConsultorLayout>
  );
};

export default ConsultorEventDetailPage;
