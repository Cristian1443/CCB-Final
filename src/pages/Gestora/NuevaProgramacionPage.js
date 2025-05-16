// src/pages/Gestora/NuevaProgramacionPage.js
import React, { useState, useEffect } from "react";
// Importamos Link para la navegación
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import "./NuevaProgramacionPage.css";
import { colors } from "../../colors";
import * as XLSX from "xlsx";
import { useNavigate } from 'react-router-dom'; // Importa useNavigate

function NuevaProgramacionPage() {
  const [inputMethod, setInputMethod] = useState("manual");
  const navigate = useNavigate();
  // =========================================================================
  // Estados para los campos del formulario manual
  // =========================================================================
  const [ruta, setRuta] = useState("");
  const [sector, setSector] = useState(""); // Estado para el sector
  const [programa, setPrograma] = useState("");
  const [coordinadorCCB, setCoordinadorCCB] = useState("");
  const [numeroContrato, setNumeroContrato] = useState("");
  const [codigoAgenda, setCodigoAgenda] = useState("");
  const [tematica, setTematica] = useState("");
  const [mes, setMes] = useState("");
  const [fechaFormacion, setFechaFormacion] = useState("");
  const [dia, setDia] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [horasProgramadasTaller, setHorasProgramadasTaller] = useState("");
  const [tipoActividad, setTipoActividad] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [lugar, setLugar] = useState("");
  const [region, setRegion] = useState("");
  const [numeroRegion, setnumeroRegion] = useState("");
  const [isRegionEnabled, setIsRegionEnabled] = useState(false);
  const [municipio, setMunicipio] = useState("");
  const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);
  const [enlaceVirtual, setEnlaceVirtual] = useState("");
  const [envioProgramacion, setEnvioProgramacion] = useState("");
  const [estadoActividad, setEstadoActividad] = useState("");
  const [numeroAsistentes, setNumeroAsistentes] = useState("");
  // Estados del consultor que se llenarán automáticamente
  const [nombreConsultor, setNombreConsultor] = useState("");
  const [cedula, setCedula] = useState("");
  const [emailConsultor, setEmailConsultor] = useState("");
  const [celular, setCelular] = useState("");
  const [direccion, setDireccion] = useState("");
  // Otros estados
  const [tipoVinculacion, setTipoVinculacion] = useState("");
  const [horasPagarDocente, setHorasPagarDocente] = useState("");
  const [horasCobrarCCB, setHorasCobrarCCB] = useState("");
  const [clasificacionValorHora, setClasificacionValorHora] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [gastosTraslado, setGastosTraslado] = useState("");
  const [valorTotalPagarDocente, setValorTotalPagarDocente] = useState("");
  const [valorHoraCobrarCCB, setValorHoraCobrarCCB] = useState("");
  const [valorTotalCobrarCCB, setValorTotalCobrarCCB] = useState("");
  const [numeroOAMPConsultor, setNumeroOAMPConsultor] = useState("");
  const [fechaInicioOAMPConsultor, setFechaInicioOAMPConsultor] = useState("");
  const [entregables, setEntregables] = useState("");
  const [dependencia, setDependencia] = useState("");
  const [observaciones, setObservaciones] = useState("");
  const [programasFiltrados, setProgramasFiltrados] = useState([]);
  const [rutasFiltradas, setRutasFiltradas] = useState([]);
  const [sectoresFiltrados, setSectoresFiltrados] = useState([]);

  // =========================================================================

  // =========================================================================
  // Datos Mock de Consultores (En una app real, esto vendría de una API)
  // =========================================================================
  
  const mockConsultores = [
    {
      nombre: "Julie Sáenz",
      cedula: "1012345678",
      email: "julie.saenz@example.com",
      celular: "3001112233",
      direccion: "Calle 1 # 2-3",
    },
    {
      nombre: "Andreína Ustate",
      cedula: "1098765432",
      email: "andreina.ustate@example.com",
      celular: "3104445566",
      direccion: "Avenida 4 # 5-6",
    },
    {
      nombre: "Carlos Rojas",
      cedula: "1122334455",
      email: "carlos.rojas@example.com",
      celular: "3207778899",
      direccion: "Carrera 7 # 8-9",
    },
    // Añade más consultores ficticios aquí
  ];
  // =========================================================================

  const clasificacionOption = [80000, 85000, 90000, 95000, 100000, 105000];

  const regiones = {
    1: {
      municipios: [
        "Cajicá",
        "Chía",
        "Cogua",
        "Cota",
        "Gachancipá",
        "Granada",
        "La Calera",
        "Nemocón",
        "Sibaté",
        "Soacha rural",
        "Sopó",
        "Tabio",
        "Tenjo",
        "Tocancipá",
        "Zipaquirá",
      ],
      valorHora: 90000,
      traslado: 30000,
      sinHoras: 30000,
      dosHoras: 105000,
      tresHoras: 100000,
      cuatroOMas: 97500,
    },
    2: {
      municipios: [
        "Choachí",
        "Chocontá",
        "Gachetá",
        "Guasca",
        "Guatavita",
        "Machetá",
        "Manta",
        "Sesquilé",
        "Suesca",
        "Villa Pinzón",
      ],
      valorHora: 95000,
      traslado: 60000,
      sinHoras: 60000,
      dosHoras: 125000,
      tresHoras: 115000,
      cuatroOMas: 110000,
    },
    3: {
      municipios: [
        "Arbeláez",
        "Cabrera",
        "Cáqueza",
        "Chipaque",
        "Fómeque",
        "Fosca",
        "Fusagasugá",
        "Gachalá",
        "Gama",
        "Guayabetal",
        "Gutiérrez",
        "Junín",
        "Medina",
        "Pandi",
        "Pasca",
        "Quetame",
        "San Bernardo",
        "Silvania",
        "Tibacuy",
        "Ubalá",
        "Ubaque",
        "Une",
        "Venecia",
      ],
      valorHora: 100000,
      traslado: 85000,
      sinHoras: 85000,
      dosHoras: 142500,
      tresHoras: 128333,
      cuatroOMas: 121250,
    },
    4: {
      municipios: [
        "Carmen De Carupa",
        "Cucunubá",
        "Fúquene",
        "Guachetá",
        "Lenguazaque",
        "Simijaca",
        "Susa",
        "Sutatausa",
        "Tausa",
        "Ubaté",
      ],
      valorHora: 105000,
      traslado: 110000,
      sinHoras: 110000,
      dosHoras: 160000,
      tresHoras: 141666,
      cuatroOMas: 132500,
    },
  };

  const programaRutaSectorMap = {
    "Crecimiento Empresarial": {
      rutas: ["Economia Popular"],
      sectores: { "Economia Popular": ["Economia Popular"] },
    },
    Emprendimiento: {
      rutas: ["INNOVACION", "EMPRENDIMIENTO"],
      sectores: {
        INNOVACION: ["Innovación"],
        EMPRENDIMIENTO: ["Bogota Emprende y Cundinamarca Emprende"],
      },
    },
    "Consolidación y escalamiento empresarial": {
      rutas: [
        "ESTRATEGIA FINANCIERA Y RENDICIÓN DE CUENTAS PARA EL SECTOR MODA E INDUSTRIAS CREATIVAS Y CULTURALES",
        "FORTALECIMIENTO DE EQUIPOS DE VENTA PARA EL SECTOR MODA",
        "PROGRAMACIÓN ABIERTA Y REGIÓN",
        "CICLOS FOCALIZADOS - MULTISECTORIAL",
        "SECTOR ALIMENTOS, FINANCIERO Y PRODUCTIVIDAD",
        "INTERNACIONALIZACIÓN",
        "Plan de internacinalización",
      ],
      sectores: {
        "ESTRATEGIA FINANCIERA Y RENDICIÓN DE CUENTAS PARA EL SECTOR MODA E INDUSTRIAS CREATIVAS Y CULTURALES":
          [
            "Estrategia Financiera y Rendición de Cuentas para el Sector Moda e Industrias Creativas y Culturales",
          ],
        "FORTALECIMIENTO DE EQUIPOS DE VENTA PARA EL SECTOR MODA": [
          "Fortalecimiento de Equipos de Venta para el Sector Moda",
        ],
        "PROGRAMACIÓN ABIERTA Y REGIÓN": ["No aplica"],
        "CICLOS FOCALIZADOS - MULTISECTORIAL": [
          "Gestión del Talento Humano para el sector construcción",
          "Excelencia para el sector Turismo",
          "Proyectos financieros con proposito y Gestion financiera en empresas de servicios empresariales",
          "Transformación digital",
          "Tecnología en modelos de negocio y servicios de Consultoria",
          "Tecnología en Cadena de abastecimiento - (Logistica)",
          "Programa de Desarrollo proveedores",
        ],
        "SECTOR ALIMENTOS, FINANCIERO Y PRODUCTIVIDAD": [
          "Indicadores de gestión",
          "Metodologias de mejoramiento de la Productividad",
          "Gestión Finaciero",
        ],
        INTERNACIONALIZACIÓN: ["Talleres", "Asesorias individales"],
        "Plan de internacinalización": [
          "INTERNACIONALIZACION - Entregable - Preseleccion de mercado",
          "INTERNACIONALIZACION - Entregable - MarketFit",
          "INTERNACIONALIZACION - Entregable - One Pager",
        ],
      },
    },
  };
  const actualizarValoresPorRegion = (regionData, horas) => {
    setValorHora(regionData.valorHora);
    setClasificacionValorHora(regionData.valorHora);
    setValorHoraCobrarCCB(regionData.valorHora);
    setGastosTraslado(regionData.traslado);

    if (!isNaN(horas)) {
      setHorasCobrarCCB(horas);

      let totalDocente = regionData.valorHora * horas;
      if (horas === 2) totalDocente = regionData.dosHoras;
      else if (horas === 3) totalDocente = regionData.tresHoras;
      else if (horas >= 4) totalDocente = regionData.cuatroOMas;
      else if (horas === 0) totalDocente = regionData.sinHoras;

      setValorTotalPagarDocente(formatCOP(totalDocente));

      const totalCCB = regionData.valorHora * horas + regionData.traslado;
      setValorTotalCobrarCCB(formatCOP(totalCCB));
    }
  };

  const formatCOP = (value) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(value);

  // Manejador de cambio de clasificación
  const handleClasificacionChange = (e) => {
    const selectedValue = e.target.value;
    setClasificacionValorHora(selectedValue);
    setValorHora(selectedValue); // actualiza automáticamente el valorHora
  };

  useEffect(() => {
    if (isRegionEnabled || !ruta || !modalidad) return;

    const rutasEspeciales = [
      "INNOVACION",
      "INTERNACIONALIZACIÓN",
      "Plan de internacinalización",
    ];
    let valor = 0;

    if (modalidad === "Virtual") {
      valor = rutasEspeciales.includes(ruta) ? 90000 : 80000;
    } else if (modalidad === "Presencial" || modalidad === "Hibrido") {
      valor = rutasEspeciales.includes(ruta) ? 95000 : 85000;
    }

    setClasificacionValorHora(valor);
    setValorHora(valor);
    setValorHoraCobrarCCB(valor);
  }, [ruta, modalidad, isRegionEnabled]);

  useEffect(() => {
    if (isRegionEnabled) return; // Solo aplica si NO hay región

    setHorasCobrarCCB(horasPagarDocente);
    setValorHoraCobrarCCB(valorHora);

    const valor = parseFloat(valorHora);
    const horas = parseFloat(horasPagarDocente);

    if (!isNaN(horas) && !isNaN(valor)) {
      const totalPagarDocente = horas * valor;
      const totalCobrarCCB = totalPagarDocente * 2; // Se cobra el doble

      setValorTotalPagarDocente(formatCOP(totalPagarDocente));
      setValorTotalCobrarCCB(formatCOP(totalCobrarCCB));
    } else {
      setValorTotalCobrarCCB("");
      setValorTotalPagarDocente("");
    }
  }, [horasPagarDocente, valorHora, isRegionEnabled]);

  useEffect(() => {
    if (!region) {
      setIsRegionEnabled(false);
      setMunicipiosFiltrados([]);
      setMunicipio("");
      setGastosTraslado("");
      return;
    }

    const regionData = regiones[region];
    if (regionData) {
      setIsRegionEnabled(true);
      setMunicipiosFiltrados(regionData.municipios);
      setGastosTraslado(regionData.traslado);
    }
  }, [region]);

  useEffect(() => {
    if (!isRegionEnabled || !municipio) return;

    const regionData = Object.values(regiones).find((reg) =>
      reg.municipios.some((m) => m.toLowerCase() === municipio.toLowerCase())
    );

    if (!regionData) return;

    const horas = parseFloat(horasPagarDocente);
    if (isNaN(horas)) return;

    actualizarValoresPorRegion(regionData, horas);
  }, [isRegionEnabled, municipio, horasPagarDocente]);

  useEffect(() => {
    if (!programa) {
      setRutasFiltradas([]);
      setSectoresFiltrados([]);
      return;
    }

    const data = programaRutaSectorMap[programa];
    if (data) {
      setRutasFiltradas(data.rutas);
      setSectoresFiltrados(data.sectores[ruta] || []);
    }
  }, [programa, ruta]);

  // Actualizar sectores cuando cambia la ruta
  useEffect(() => {
    if (!ruta || !programa) {
      setSectoresFiltrados([]);
      return;
    }

    const data = programaRutaSectorMap[programa];
    if (data && data.sectores[ruta]) {
      setSectoresFiltrados(data.sectores[ruta]);
    }
  }, [ruta, programa]);

  // =========================================================================
  // Función para manejar el cambio en el campo Nombre del Consultor
  // =========================================================================
  const handleNombreConsultorChange = (e) => {
  const nombre = e.target.value;
  setNombreConsultor(nombre);

  // Buscar el consultor por nombre
  const consultor = mockConsultores.find(c => c.nombre === nombre);

  if (consultor) {
    setCedula(consultor.cedula);
    setEmailConsultor(consultor.email);
    setCelular(consultor.celular);
    setDireccion(consultor.direccion);
  } else {
    // Si no encuentra coincidencia, limpia los campos
    setCedula("");
    setEmailConsultor("");
    setCelular("");
    setDireccion("");
  }
};

  // =========================================================================
  const handleManualSubmit = (e) => {
  e.preventDefault();

  const nuevoEvento = {
    id: Date.now().toString(), // Generar ID único
    title: tematica,
    program: programa,
    location: sector,
    date: fechaFormacion, // puedes usar el valor real de tu input
    time: horaInicio,
    modality: modalidad,
    status: estadoActividad,
    instructor: nombreConsultor,
    participants: numeroAsistentes,
  };

  // Obtiene eventos existentes desde localStorage
  const eventosGuardados = JSON.parse(localStorage.getItem("eventos")) || [];

  // Agrega el nuevo
  const nuevosEventos = [...eventosGuardados, nuevoEvento];
  localStorage.setItem("eventos", JSON.stringify(nuevosEventos));

  alert("Programación guardada exitosamente");

  // Redirige al dashboard si deseas
  navigate("/gestora");
};

/** 
  const handleManualSubmit = (event) => {
    event.preventDefault();
    const formData = {
      ruta,
      sector,
      programa,
      coordinadorCCB,
      numeroContrato,
      codigoAgenda,
      tematica,
      mes,
      fechaFormacion,
      dia,
      horaInicio,
      horaFin,
      horasProgramadasTaller,
      tipoActividad,
      modalidad,
      lugar,
      region,
      enlaceVirtual,
      envioProgramacion,
      estadoActividad,
      numeroAsistentes,
      nombreConsultor,
      cedula,
      emailConsultor,
      celular,
      direccion,
      tipoVinculacion,
      horasPagarDocente,
      horasCobrarCCB,
      clasificacionValorHora,
      valorHora,
      gastosTraslado,
      valorTotalPagarDocente,
      valorHoraCobrarCCB,
      valorTotalCobrarCCB,
      numeroOAMPConsultor,
      fechaInicioOAMPConsultor,
      entregables,
      dependencia,
      observaciones,
    };
    console.log("Datos del formulario manual:", formData);
    alert("Formulario manual enviado. Revisa la consola para ver los datos.");
  };
*/
  function convertExcelTimeTo24HourFormat(timeStr) {
  // Ej: "2:30 PM" -> "14:30"
  if (typeof timeStr !== 'string') return '';

  const [time, modifier] = timeStr.trim().split(' ');
  let [hours, minutes] = time.split(':');

  hours = parseInt(hours, 10);
  if (modifier.toUpperCase() === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${minutes}`;
}
function convertExcelTime(value) {
  // Si es un número decimal de Excel
  if (!isNaN(value)) {
    const totalMinutes = Math.round(value * 24 * 60); // convertir días a minutos
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }

  // Si es texto con AM/PM
  if (typeof value === 'string') {
    const match = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
      return convertExcelTimeTo24HourFormat(value);
    }
  }

  return '';
}



  function formatExcelDate(value) {
  // Si es un número (formato de fecha Excel), conviértelo
  if (!isNaN(value)) {
    const date = XLSX.SSF.parse_date_code(value);
    const year = date.y;
    const month = String(date.m).padStart(2, '0');
    const day = String(date.d).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Si ya es una cadena, intenta transformarla desde dd/mm/yyyy a yyyy-mm-dd
  if (typeof value === 'string' && value.includes('/')) {
    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  }

  // Si no se pudo convertir, retorna tal cual
  return value;
}


  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert("No se seleccionó ningún archivo.");
      return;
    }
  
    console.log("Archivo seleccionado:", file.name);
    alert(`Archivo seleccionado: ${file.name}`);
  
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      console.log("Workbook leído correctamente:", workbook);
  
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
  
      // Usa `range` para eliminar filas vacías antes del encabezado si existen
      const range = XLSX.utils.decode_range(worksheet['!ref']);
      range.s.r = 0; // Asegura que comienza desde la primera fila (índice 0)
      worksheet['!ref'] = XLSX.utils.encode_range(range);
  
      // Lee los datos con encabezados desde la fila 1
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "", header: 1 });
  
      if (jsonData.length < 2) {
        alert("El archivo está vacío o mal formateado.");
        return;
      }
  
      const headers = jsonData[0];
      const firstRow = jsonData[1];
  
      const row = {};
      headers.forEach((header, index) => {
        row[header] = firstRow[index] ?? "";
      });
  
      console.log("Primera fila interpretada:", row);
  
      // Asignaciones
      setRuta(row["Ruta"] || "");
      setSector(row["Sector"] || "");
      setPrograma(row["Programa"] || "");
      setCoordinadorCCB(row["CoordinadorCCB"] || "");
      setNumeroContrato(row["NúmeroContrato"] || "");
      setCodigoAgenda(row["CódigoAgenda"] || "");
      setTematica(row["Temática"] || "");
      setMes(row["Mes"] || "");
      setFechaFormacion(formatExcelDate(row["FechaFormación"] || ""));
      setDia(row["Día"] || "");
      setHoraInicio(convertExcelTime(row["HoraInicio"]));
      setHoraFin(convertExcelTime(row["HoraFin"]));
      setHorasProgramadasTaller(row["HorasProgramadasTaller"] || "");
      setTipoActividad(row["TipoActividad"] || "");
      setModalidad(row["Modalidad"] || "");
      setLugar(row["Lugar"] || "");
      setRegion(row["Región"] || "");
      setEnlaceVirtual(row["EnlaceVirtual"] || "");
      setEstadoActividad(row["EstadoActividad"] || "");
      setNombreConsultor(row["NombreConsultor"] || "");
      setCedula(row["Cédula"] || "");
      setEmailConsultor(row["Email"] || "");
      setCelular(row["Celular"] || "");
      setDireccion(row["Dirección"] || "");
      setTipoVinculacion(row["TipoVinculación"] || "");
      setHorasPagarDocente(row["HorasPagarDocente"] || "");
      setHorasCobrarCCB(row["HorasCobrarCCB"] || "");
      setClasificacionValorHora(row["ClasificaciónValorHora"] || "");
      setValorHora(row["ValorHora"] || "");
      setGastosTraslado(row["GastosTraslado"] || "");
      setValorTotalPagarDocente(row["ValorTotalPagarDocente"] || "");
      setValorHoraCobrarCCB(row["ValorHoraCobrarCCB"] || "");
      setValorTotalCobrarCCB(row["ValorTotalCobrarCCB"] || "");
      setNumeroOAMPConsultor(row["NúmeroOAMPConsultor"] || "");
      setFechaInicioOAMPConsultor(formatExcelDate(row["FechaInicioOAMPConsultor"] || ""));
      setEntregables(row["Entregables"] || "");
      setDependencia(row["Dependencia"] || "");
      setObservaciones(row["Observaciones"] || "");
  
      const regionEstado = !!row["Región"];
      console.log("¿Región habilitada?:", regionEstado);
      setIsRegionEnabled(regionEstado);
  
      alert(`Se extrajeron correctamente los datos del archivo: ${file.name}`);
    };
  
    reader.onerror = (error) => {
      console.error("Error al leer el archivo:", error);
      alert("Hubo un error al leer el archivo.");
    };
  
    reader.readAsArrayBuffer(file);
  };
  
  

  return (
    <DashboardLayout>
      <div className="nueva-programacion-content">
        {/* Contenedor para el título de la página y el botón de volver */}
        <div className="page-header">
          <div>
            <h2>Panel de Gestión</h2>
            <h1>Nueva Programación</h1>
          </div>
          {/* Botón para volver al Dashboard */}
          <Link
            to="/gestora"
            className="back-button"
            style={{
              backgroundColor: colors.secondary,
              color: "white",
              textDecoration: "none",
            }}
          >
            Volver al Dashboard
          </Link>
        </div>

        {/* Opciones para elegir método de entrada */}
        <div className="input-method-selector">
          <button
            className={`method-button ${
              inputMethod === "manual" ? "active" : ""
            }`}
            onClick={() => setInputMethod("manual")}
            style={{
              backgroundColor:
                inputMethod === "manual" ? colors.primary : "transparent",
              color: inputMethod === "manual" ? "white" : colors.secondary,
            }}
          >
            Llenado Manual
          </button>
          <button
            className={`method-button ${
              inputMethod === "excel" ? "active" : ""
            }`}
            onClick={() => setInputMethod("excel")}
            style={{
              backgroundColor:
                inputMethod === "excel" ? colors.primary : "transparent",
              color: inputMethod === "excel" ? "white" : colors.secondary,
            }}
          >
            Cargar Excel
          </button>
        </div>

        {inputMethod === "excel" && (
          <div className="excel-upload-section">
            <h3>Cargar Programación desde Excel</h3>
            <input
              type="file"
              accept=".xls,.xlsx"
              onChange={handleFileUpload}
            />
            <p>
              Por favor, asegúrate de que tu archivo Excel tenga el formato
              correcto.
            </p>
          </div>
        )}

        {inputMethod === "manual" && (
          <div className="manual-form-section">
            <h3>Llenar Programación Manualmente</h3>
            <form onSubmit={handleManualSubmit}>
              {/* ==================================================== */}
              {/* GRUPO 1: Información Básica del Evento */}
              {/* ==================================================== */}
              <div className="form-group-container">
                <h4>Información del Evento</h4>
                <div className="form-grid">
                  {/* Campo: Programa */}
                  <div className="form-group">
                    <label htmlFor="programa">Programa</label>
                    <select
                      id="programa"
                      value={programa}
                      onChange={(e) => setPrograma(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un Programa</option>
                      {Object.keys(programaRutaSectorMap).map((prog) => (
                        <option key={prog} value={prog}>
                          {prog}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Campo: Ruta */}
                  <div className="form-group">
                    <label htmlFor="ruta">Ruta</label>
                    <select
                      id="ruta"
                      value={ruta}
                      onChange={(e) => setRuta(e.target.value)}
                      required
                    >
                      <option value="">Selecciona una Ruta</option>
                      {rutasFiltradas.map((ruta) => (
                        <option key={ruta} value={ruta}>
                          {ruta}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campo: Sector */}
                  <div className="form-group">
                    <label htmlFor="sector">Sector</label>
                    <select
                      id="sector"
                      value={sector}
                      onChange={(e) => setSector(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un Sector</option>
                      {sectoresFiltrados.map((sector) => (
                        <option key={sector} value={sector}>
                          {sector}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campo: Temática */}
                  <div className="form-group">
                    <label htmlFor="tematica">Temática</label>
                    <input
                      type="text"
                      id="tematica"
                      value={tematica}
                      onChange={(e) => setTematica(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Tipo de Actividad */}
                  <div className="form-group">
                    <label htmlFor="tipoActividad">Tipo de Actividad</label>
                    <select
                      id="tipoActividad"
                      value={tipoActividad}
                      onChange={(e) => setTipoActividad(e.target.value)}
                      required
                    >
                      <option value="">Selecciona un Programa</option>
                      <option value="Talleres">Talleres</option>
                      <option value="Asesorias Grupales o Capsulas">
                        Asesorias Grupales o Capsulas
                      </option>
                      <option value="Asesorias Individuales">
                        Asesorias Individuales
                      </option>
                    </select>
                  </div>

                  {/* Campo: Modalidad */}
                  <div className="form-group">
                    <label htmlFor="modalidad">Modalidad</label>
                    <select
                      id="modalidad"
                      value={modalidad}
                      onChange={(e) => setModalidad(e.target.value)}
                      required
                    >
                      <option value="">Selecciona Modalidad</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Hibrido">Híbrido</option>
                    </select>
                  </div>

                  {/* Campo: Lugar (Condicional según Modalidad) */}
                  <div className="form-group">
                    <label htmlFor="lugar">Lugar</label>
                    <input
                      type="text"
                      id="lugar"
                      value={lugar}
                      onChange={(e) => setLugar(e.target.value)}
                    />
                  </div>

                  {/* Campo: N asitentes (Condicional según Numero de asistentes) */}
                  <div className="form-group">
                    <label htmlFor="numeroAsistentes">Numero de Asistentes</label>
                    <input
                      type="Number"
                      id="numeroAsistentes"
                      value={numeroAsistentes}
                      onChange={(e) => setNumeroAsistentes(e.target.value)}
                    />
                  </div>

                  {/* Campo: Region - CAMBIADO A SELECT */}
                  <div className="form-group">
                    <label htmlFor="region">Región</label>
                    <select
                      id="region"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    >
                      <option value="">Selecciona una región</option>
                      <option value="1">Región 1</option>
                      <option value="2">Región 2</option>
                      <option value="3">Región 3</option>
                      <option value="4">Región 4</option>
                    </select>
                  </div>

                  {isRegionEnabled && (
                    <div className="form-group">
                      <label htmlFor="municipio">Municipio</label>
                      <select
                        id="municipio"
                        value={municipio}
                        onChange={(e) => setMunicipio(e.target.value)}
                        required
                      >
                        <option value="">Selecciona un municipio</option>
                        {municipiosFiltrados.map((mun) => (
                          <option key={mun} value={mun}>
                            {mun}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Campo: Enlace Virtual / híbrido (Condicional según Modalidad) */}
                  <div className="form-group">
                    <label htmlFor="enlaceVirtual">
                      Enlace Virtual / Híbrido
                    </label>
                    <input
                      type="url"
                      id="enlaceVirtual"
                      value={enlaceVirtual}
                      onChange={(e) => setEnlaceVirtual(e.target.value)}
                    />
                  </div>

                  {/* Campo: Estado de la Actividad */}
                  <div className="form-group">
                    <label htmlFor="estadoActividad">
                      Estado de la Actividad
                    </label>
                    <input
                      type="text"
                      id="estadoActividad"
                      value={estadoActividad}
                      onChange={(e) => setEstadoActividad(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Coordinador CCB */}
                  <div className="form-group">
                    <label htmlFor="coordinadorCCB">Coordinador CCB</label>
                    <input
                      type="text"
                      id="coordinadorCCB"
                      value={coordinadorCCB}
                      onChange={(e) => setCoordinadorCCB(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Coordinador CCB */}
                  <div className="form-group">
                    <label htmlFor="codigoAgenda">Codigo Agenda</label>
                    <input
                      type="text"
                      id="codigoAgenda"
                      value={codigoAgenda}
                      onChange={(e) => setCodigoAgenda(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Dependencia */}
                  <div className="form-group">
                    <label htmlFor="dependencia">Dependencia</label>
                    <input
                      type="text"
                      id="dependencia"
                      value={dependencia}
                      onChange={(e) => setDependencia(e.target.value)}
                      required
                    />
                  </div>
                </div>
                {/* Cierra form-grid */}
              </div>
              {/* Cierra form-group-container */}
              {/* ==================================================== */}
              {/* GRUPO 2: Fechas y Horarios */}
              {/* ==================================================== */}
              <div className="form-group-container">
                <h4>Fechas y Horarios</h4>
                <div className="form-grid">
                  {/* Campo: Mes */}
                  <div className="form-group">
                    <label htmlFor="mes">Mes</label>
                    <input
                      type="text"
                      id="mes"
                      value={mes}
                      onChange={(e) => setMes(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Fecha de la Formación */}
                  <div className="form-group">
                    <label htmlFor="fechaFormacion">
                      Fecha de la Formación
                    </label>
                    <input
                      type="date"
                      id="fechaFormacion"
                      value={fechaFormacion}
                      onChange={(e) => setFechaFormacion(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Día */}
                  <div className="form-group">
                    <label htmlFor="dia">Día</label>
                    <input
                      type="text"
                      id="dia"
                      value={dia}
                      onChange={(e) => setDia(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Hora Inicio */}
                  <div className="form-group">
                    <label htmlFor="horaInicio">Hora Inicio</label>
                    <input
                      type="time"
                      id="horaInicio"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Hora Fin */}
                  <div className="form-group">
                    <label htmlFor="horaFin">Hora Fin</label>
                    <input
                      type="time"
                      id="horaFin"
                      value={horaFin}
                      onChange={(e) => setHoraFin(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Horas Programadas Taller */}
                  <div className="form-group">
                    <label htmlFor="horasProgramadasTaller">
                      Horas Programadas Taller
                    </label>
                    <input
                      type="number"
                      id="horasProgramadasTaller"
                      value={horasProgramadasTaller}
                      onChange={(e) =>
                        setHorasProgramadasTaller(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>{" "}
                {/* Cierra form-grid */}
              </div>{" "}
              {/* Cierra form-group-container */}
              {/* ==================================================== */}
              {/* GRUPO 3: Información del Consultor */}
              {/* ==================================================== */}
              <div className="form-group-container">
                <h4>Información del Consultor</h4>
                <div className="form-grid">
                  {/* Campo: Nombre del Consultor - CON ONCHANGE PARA AUTOLLENAR */}
                  <div className="form-group">
                    <label htmlFor="nombreConsultor">
                      Nombre del Consultor
                    </label>
                    <select
  id="nombreConsultor"
  value={nombreConsultor}
  onChange={handleNombreConsultorChange}
  required
>
  <option value="">Seleccione un consultor</option>
  {mockConsultores.map((c) => (
    <option key={c.cedula} value={c.nombre}>
      {c.nombre}
    </option>
  ))}
</select>

                  </div>

                  {/* Campo: Cédula - SE LLENARÁ AUTOMATICAMENTE */}
                  <div className="form-group">
                    <label htmlFor="cedula">Cédula</label>
                    <input
                      type="number"
                      id="cedula"
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)} // Permite edición manual si es necesario
                      required
                      readOnly // Opcional: Puedes hacerlo de solo lectura si no quieres que se edite
                    />
                  </div>

                  {/* Campo: E- mail Personal / E - mail corporativo - SE LLENARÁ AUTOMATICAMENTE */}
                  <div className="form-group">
                    <label htmlFor="emailConsultor">E-mail Consultor</label>
                    <input
                      type="email"
                      id="emailConsultor"
                      value={emailConsultor}
                      onChange={(e) => setEmailConsultor(e.target.value)} // Permite edición manual
                      required
                      readOnly // Opcional: Solo lectura
                    />
                  </div>

                  {/* Campo: Celular - SE LLENARÁ AUTOMATICAMENTE */}
                  <div className="form-group">
                    <label htmlFor="celular">Celular</label>
                    <input
                      type="tel"
                      id="celular"
                      value={celular}
                      onChange={(e) => setCelular(e.target.value)} // Permite edición manual
                      required
                      readOnly // Opcional: Solo lectura
                    />
                  </div>

                  {/* Campo: Dirección - SE LLENARÁ AUTOMATICAMENTE */}
                  <div className="form-group">
                    <label htmlFor="direccion">Dirección</label>
                    <input
                      type="text"
                      id="direccion"
                      value={direccion}
                      onChange={(e) => setDireccion(e.target.value)} // Permite edición manual
                      required
                      readOnly // Opcional: Solo lectura
                    />
                  </div>

                  {/* Campo: Tipo de Vinculación */}
                  <div className="form-group">
                    <label htmlFor="tipoVinculacion">Tipo de Vinculación</label>
                    <input
                      type="text"
                      id="tipoVinculacion"
                      value={tipoVinculacion}
                      onChange={(e) => setTipoVinculacion(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Número de OAMP Consultor */}
                  <div className="form-group">
                    <label htmlFor="numeroOAMPConsultor">
                      N° OAMP Consultor
                    </label>
                    <input
                      type="text"
                      id="numeroOAMPConsultor"
                      value={numeroOAMPConsultor}
                      onChange={(e) => setNumeroOAMPConsultor(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Fecha Inicio de OAMP Consultor */}
                  <div className="form-group">
                    <label htmlFor="fechaInicioOAMPConsultor">
                      Fecha Inicio OAMP Consultor
                    </label>
                    <input
                      type="date"
                      id="fechaInicioOAMPConsultor"
                      value={fechaInicioOAMPConsultor}
                      onChange={(e) =>
                        setFechaInicioOAMPConsultor(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>{" "}
                {/* Cierra form-grid */}
              </div>{" "}
              {/* Cierra form-group-container */}
              {/* ==================================================== */}
              {/* GRUPO 4: Información de Pago */}
              {/* ==================================================== */}
              <div className="form-group-container">
                <h4>Información de Pago</h4>
                <div className="form-grid">
                  {/* Campo: Número de Horas a Pagar al Docente */}
                  <div className="form-group">
                    <label htmlFor="horasPagarDocente">
                      N° Horas a Pagar Docente
                    </label>
                    <input
                      type="number"
                      id="horasPagarDocente"
                      value={horasPagarDocente}
                      onChange={(e) => setHorasPagarDocente(e.target.value)}
                      required
                    />
                  </div>

                  {/* Campo: Número de Horas a Cobrar a CCB */}
                  <div className="form-group">
                    <label htmlFor="horasCobrarCCB">
                      N° Horas a Cobrar CCB
                    </label>
                    <input
                      type="number"
                      id="horasCobrarCCB"
                      value={horasCobrarCCB}
                      onChange={(e) => setHorasCobrarCCB(e.target.value)}
                      readOnly
                    />
                  </div>

                  {/* Campo: Clasificación Valor Hora */}
                  <div className="form-group">
                    <label htmlFor="clasificacionValorHora">
                      Clasificación Valor Hora
                    </label>
                    <select
                      id="clasificacionValorHora"
                      value={clasificacionValorHora}
                      onChange={handleClasificacionChange}
                      required
                    >
                      <option value="">
                        Selecciona una clasificación de valor de hora
                      </option>
                      {clasificacionOption.map((option, index) => (
                        <option key={index} value={option}>
                          {formatCOP(option)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Campo: Valor Hora */}
                  <div className="form-group">
                    <label htmlFor="valorHora">Valor Hora</label>
                    <input
                      type="text"
                      id="valorHora"
                      value={valorHora ? formatCOP(valorHora) : ""}
                      onChange={(e) => setValorHora(e.target.value)}
                      readOnly
                    />
                  </div>

                  {/* Campo: Gastos de Traslado */}
                  {isRegionEnabled && (
                    <div className="form-group">
                      <label htmlFor="gastosTraslado">Valor Traslado</label>
                      <input
                        type="text"
                        id="gastosTraslado"
                        value={formatCOP(gastosTraslado)}
                        readOnly
                      />
                    </div>
                  )}

                  {/* Campo: Valor Total a Pagar al Docente */}
                  <div className="form-group">
                    <label htmlFor="valorTotalPagarDocente">
                      Valor Total a Pagar Docente
                    </label>
                    <input
                      type="text"
                      id="valorTotalPagarDocente"
                      value={valorTotalPagarDocente}
                      onChange={(e) =>
                        setValorTotalPagarDocente(e.target.value)
                      }
                      required
                    />
                  </div>

                  {/* Campo: Valor Hora a Cobrar a CCB */}
                  <div className="form-group">
                    <label htmlFor="valorHoraCobrarCCB">
                      Valor Hora a Cobrar CCB
                    </label>
                    <input
                      type="text"
                      id="valorHoraCobrarCCB"
                      value={
                        valorHoraCobrarCCB ? formatCOP(valorHoraCobrarCCB) : ""
                      }
                      onChange={(e) => setValorHoraCobrarCCB(e.target.value)}
                      readOnly
                    />
                  </div>

                  {/* Campo: Valor Total a Cobrar a CCB */}
                  <div className="form-group">
                    <label htmlFor="valorTotalCobrarCCB">
                      Valor Total a Cobrar CCB
                    </label>
                    <input
                      type="text"
                      id="valorTotalCobrarCCB"
                      value={valorTotalCobrarCCB}
                      onChange={(e) => setValorTotalCobrarCCB(e.target.value)}
                      required
                    />
                  </div>
                </div>{" "}
                {/* Cierra form-grid */}
              </div>{" "}
              {/* Cierra form-group-container */}
              {/* ==================================================== */}
              {/* GRUPO 5: Entregables y Observaciones */}
              {/* ==================================================== */}
              <div className="form-group-container">
                <h4>Otros Detalles</h4>
                <div className="form-grid">
                  {/* Campo: Entregables */}
                  <div className="form-group full-width">
                    <label htmlFor="entregables">Entregables</label>
                    <textarea
                      id="entregables"
                      value={entregables}
                      onChange={(e) => setEntregables(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Campo: Observaciones */}
                  <div className="form-group full-width">
                    <label htmlFor="observaciones">Observaciones</label>
                    <textarea
                      id="observaciones"
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  {/* Campo: Cargue Evidencia (Puede ir aquí o en otro grupo si es post-evento) */}
                  <div className="form-group full-width">
                    <label htmlFor="cargueEvidencia">Cargue Evidencia</label>
                    <input type="file" id="cargueEvidencia" />
                  </div>
                </div>{" "}
                {/* Cierra form-grid */}
              </div>{" "}
              {/* Cierra form-group-container */}
              {/* Botón de envío del formulario manual */}
              <button
                type="submit"
                className="submit-button"
                style={{ backgroundColor: colors.secondary, color: "white" }}
              >
                Guardar Programación
              </button>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default NuevaProgramacionPage;
