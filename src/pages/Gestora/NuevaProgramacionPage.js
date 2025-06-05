// src/pages/Gestora/NuevaProgramacionPage.js
import React, { useState, useEffect } from "react";
// Importamos Link para la navegación
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import "./NuevaProgramacionPage.css";
import { colors } from "../../colors";
import * as XLSX from "xlsx";
import apiService from "../../utils/api";

function NuevaProgramacionPage() {
  const navigate = useNavigate();
  
  // =========================================================================
  // Estados para modo edición
  // =========================================================================
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState(null);
  
  // =========================================================================
  // Estados para datos de la base de datos
  // =========================================================================
  const [actividades, setActividades] = useState([]);
  const [modalidades, setModalidades] = useState([]);
  const [programas, setProgramas] = useState([]);
  const [regiones, setRegiones] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================================================================
  // Estados para el formulario
  // =========================================================================
  const [actividadSeleccionada, setActividadSeleccionada] = useState("");
  const [programaSeleccionado, setProgramaSeleccionado] = useState("");
  const [rutaSeleccionada, setRutaSeleccionada] = useState("");
  const [modalidadSeleccionada, setModalidadSeleccionada] = useState("");
  const [regionSeleccionada, setRegionSeleccionada] = useState("");
  const [municipioSeleccionado, setMunicipioSeleccionado] = useState("");
  const [contratoSeleccionado, setContratoSeleccionado] = useState("");

  // Campos comunes para ambos tipos
  const [tematica, setTematica] = useState("");
  const [mes, setMes] = useState("");
  const [fechaFormacion, setFechaFormacion] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [horasDictar, setHorasDictar] = useState("");
  const [coordinadorCCB, setCoordinadorCCB] = useState("");
  const [direccion, setDireccion] = useState("");
  const [enlace, setEnlace] = useState("");
  const [codigoAgenda, setCodigoAgenda] = useState("");
  const [entregables, setEntregables] = useState("");
  const [dependencia, setDependencia] = useState("");
  const [observaciones, setObservaciones] = useState("");

  // Campos específicos para programaciones individuales
  const [nombreEmpresario, setNombreEmpresario] = useState("");
  const [identificacionEmpresario, setIdentificacionEmpresario] = useState("");

  // Campos calculados
  const [horasPagar, setHorasPagar] = useState("");
  const [horasCobrar, setHorasCobrar] = useState("");
  const [valorHora, setValorHora] = useState("");
  const [valorTotalPagar, setValorTotalPagar] = useState("");
  const [valorTotalCobrar, setValorTotalCobrar] = useState("");

  // Estados para información del consultor seleccionado
  const [consultorSeleccionado, setConsultorSeleccionado] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =========================================================================
  // Efectos para cargar datos de la base de datos
  // =========================================================================
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        setLoading(true);
        
        const [
          actividadesRes,
          modalidadesRes,
          programaRutasRes,
          regionesRes,
          contratosRes
        ] = await Promise.all([
          apiService.getActividades(),
          apiService.getModalidades(),
          apiService.getProgramaRutas(),
          apiService.getRegiones(),
          apiService.getContratos()
        ]);

        if (actividadesRes.success) setActividades(actividadesRes.data.actividades);
        if (modalidadesRes.success) setModalidades(modalidadesRes.data.modalidades);
        if (programaRutasRes.success) setProgramas(programaRutasRes.data.programas);
        if (regionesRes.success) setRegiones(regionesRes.data.regiones);
        if (contratosRes.success) {
          console.log('🔍 Contratos recibidos del backend:', contratosRes.data.contratos);
          setContratos(contratosRes.data.contratos);
        }

      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error cargando los datos iniciales');
      } finally {
        setLoading(false);
      }
    };

    cargarDatosIniciales();
  }, []);

  // Efecto para cargar municipios cuando cambia la región
  useEffect(() => {
    const cargarMunicipios = async () => {
      if (!regionSeleccionada) {
        setMunicipios([]);
      return;
    }

      try {
        const result = await apiService.getMunicipiosByRegion(regionSeleccionada);
        if (result.success) {
          setMunicipios(result.data.municipios);
        }
      } catch (error) {
        console.error('Error cargando municipios:', error);
      }
    };

    cargarMunicipios();
  }, [regionSeleccionada]);

  // =========================================================================
  // Efectos para modo edición
  // =========================================================================
  useEffect(() => {
    // Detectar si estamos en modo edición
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    
    if (mode === 'edit') {
      setIsEditMode(true);
      
      // Cargar datos de edición desde localStorage
      const editDataString = localStorage.getItem('programacionEditar');
      if (editDataString) {
        try {
          const editInfo = JSON.parse(editDataString);
          setEditData(editInfo);
          console.log('📝 Modo edición activado:', editInfo);
          
        } catch (error) {
          console.error('Error parsing edit data:', error);
          setError('Error al cargar los datos para edición');
        }
      } else {
        console.warn('No se encontraron datos de edición en localStorage');
        setError('No se encontraron datos para editar');
      }
    }
  }, []);

  // Efecto separado para poblar el formulario cuando ya tenemos todos los datos
  useEffect(() => {
    if (isEditMode && editData && !loading && programas.length > 0 && actividades.length > 0 && modalidades.length > 0 && contratos.length > 0) {
      console.log('📋 Poblando formulario con datos cargados...');
      poblarFormularioConDatos(editData);
    }
  }, [isEditMode, editData, loading, programas, actividades, modalidades, contratos]);

  // Efecto para establecer información del consultor en modo edición
  useEffect(() => {
    if (isEditMode && contratoSeleccionado && contratos.length > 0 && !consultorSeleccionado) {
      const contrato = contratos.find(c => c.oamp.toString() === contratoSeleccionado);
      if (contrato) {
        const consultorData = {
          ...contrato,
          usu_segundo_nombre: contrato.usu_segundo_nombre || '',
          usu_telefono: contrato.usu_telefono || 'No especificado',
          usu_direccion: contrato.usu_direccion || 'No especificada',
          are_descripcion: contrato.are_descripcion || 'No especificada'
        };
        
        setConsultorSeleccionado(consultorData);
        console.log('📋 Consultor establecido en modo edición:', consultorData);
      }
    }
  }, [isEditMode, contratoSeleccionado, contratos, consultorSeleccionado]);

  // Función para poblar el formulario con datos existentes (corregida)
  const poblarFormularioConDatos = (editInfo) => {
    const { data, tipo } = editInfo;
    
    console.log('🔄 Poblando formulario con datos:', { data, tipo });
    
    // Función helper para formatear horas
    const formatearHora = (hora) => {
      if (!hora) return '';
      
      // Si ya está en formato HH:MM, devolverla tal como está
      if (typeof hora === 'string' && hora.match(/^\d{2}:\d{2}$/)) {
        return hora;
      }
      
      // Si viene como timestamp o con segundos, extraer solo HH:MM
      let horaString = String(hora);
      if (horaString.includes('T')) {
        horaString = horaString.split('T')[1];
      }
      if (horaString.includes(':')) {
        const partes = horaString.split(':');
        return `${partes[0].padStart(2, '0')}:${partes[1].padStart(2, '0')}`;
      }
      
      return horaString;
    };

    // Función helper para formatear fecha
    const formatearFecha = (fecha) => {
      if (!fecha) return '';
      
      if (fecha.includes('T')) {
        return fecha.split('T')[0];
      }
      return fecha;
    };
    
    if (tipo === 'grupal') {
      // Datos para programación grupal
      setActividadSeleccionada(data.act_id?.toString() || '');
      setModalidadSeleccionada(data.mod_id?.toString() || '');
      setRutaSeleccionada(data.pr_id?.toString() || '');
      
      // Usar el prog_id del backend si está disponible
      if (data.prog_id) {
        setProgramaSeleccionado(data.prog_id.toString());
        console.log('📋 Programa establecido desde backend:', data.prog_id);
      } else {
        // Fallback: buscar el programa que contiene esta ruta
        const rutaEncontrada = programas.find(prog => 
          prog.rutas.some(ruta => ruta.pr_id.toString() === data.pr_id?.toString())
        );
        if (rutaEncontrada) {
          setProgramaSeleccionado(rutaEncontrada.prog_id.toString());
          console.log('📋 Programa encontrado por búsqueda:', rutaEncontrada.prog_nombre);
        }
      }
      
      setContratoSeleccionado(data.oamp?.toString() || '');
      setTematica(data.pro_tematica || '');
      setMes(data.pro_mes || '');
      setFechaFormacion(formatearFecha(data.pro_fecha_formacion));
      setHoraInicio(formatearHora(data.pro_hora_inicio));
      setHoraFin(formatearHora(data.pro_hora_fin));
      setHorasDictar(data.pro_horas_dictar?.toString() || '');
      setCoordinadorCCB(data.pro_coordinador_ccb || '');
      setDireccion(data.pro_direccion || '');
      setEnlace(data.pro_enlace || '');
      setCodigoAgenda(data.pro_codigo_agenda?.toString() || '');
      setEntregables(data.pro_entregables || '');
      setDependencia(data.pro_dependencia || '');
      setObservaciones(data.pro_observaciones || '');
      setRegionSeleccionada(data.val_reg_id?.toString() || '');
      
      // Valores calculados
      setHorasPagar(data.pro_numero_hora_pagar?.toString() || '');
      setHorasCobrar(data.pro_numero_hora_cobrar?.toString() || '');
      setValorHora(data.pro_valor_hora?.toString() || '');
      setValorTotalPagar(data.pro_valor_total_hora_pagar?.toString() || '');
      setValorTotalCobrar(data.pro_valor_total_hora_ccb?.toString() || '');
      
    } else if (tipo === 'individual') {
      // Datos para programación individual
      setActividadSeleccionada(data.act_id?.toString() || '');
      setModalidadSeleccionada(data.mod_id?.toString() || '');
      setRutaSeleccionada(data.pr_id?.toString() || '');
      
      // Usar el prog_id del backend si está disponible
      if (data.prog_id) {
        setProgramaSeleccionado(data.prog_id.toString());
        console.log('📋 Programa establecido desde backend:', data.prog_id);
      } else {
        // Fallback: buscar el programa que contiene esta ruta
        const rutaEncontrada = programas.find(prog => 
          prog.rutas.some(ruta => ruta.pr_id.toString() === data.pr_id?.toString())
        );
        if (rutaEncontrada) {
          setProgramaSeleccionado(rutaEncontrada.prog_id.toString());
          console.log('📋 Programa encontrado por búsqueda:', rutaEncontrada.prog_nombre);
        }
      }
      
      setContratoSeleccionado(data.oamp?.toString() || '');
      setTematica(data.proin_tematica || '');
      setMes(data.proin_mes || '');
      setFechaFormacion(formatearFecha(data.proin_fecha_formacion));
      setHoraInicio(formatearHora(data.proin_hora_inicio));
      setHoraFin(formatearHora(data.proin_hora_fin));
      setHorasDictar(data.proin_horas_dictar?.toString() || '');
      setCoordinadorCCB(data.proin_coordinador_ccb || '');
      setDireccion(data.proin_direccion || '');
      setEnlace(data.proin_enlace || '');
      setCodigoAgenda(data.proin_codigo_agenda?.toString() || '');
      setEntregables(data.proin_entregables || '');
      setDependencia(data.proin_dependencia || '');
      setObservaciones(data.proin_observaciones || '');
      setRegionSeleccionada(data.val_reg_id?.toString() || '');
      
      // Campos específicos de individual
      setNombreEmpresario(data.proin_nombre_empresario || '');
      setIdentificacionEmpresario(data.proin_identificacion_empresario || '');
      
      // Valores calculados
      setHorasPagar(data.proin_numero_hora_pagar?.toString() || '');
      setHorasCobrar(data.proin_numero_hora_cobrar?.toString() || '');
      setValorHora(data.proin_valor_hora?.toString() || '');
      setValorTotalPagar(data.proin_valor_total_hora_pagar?.toString() || '');
      setValorTotalCobrar(data.proin_valor_total_hora_ccb?.toString() || '');
    }
    
    console.log('✅ Formulario poblado completamente con datos de edición');
  };

  // =========================================================================
  // Funciones auxiliares
  // =========================================================================
  
  const esActividadGrupal = () => {
    const actividad = actividades.find(a => a.act_id.toString() === actividadSeleccionada);
    return actividad && actividad.act_tipo.includes('TALLERES') || actividad?.act_tipo.includes('GRUPALES') || actividad?.act_tipo.includes('CÁPSULAS');
  };

  const esActividadIndividual = () => {
    const actividad = actividades.find(a => a.act_id.toString() === actividadSeleccionada);
    return actividad && actividad.act_tipo.includes('INDIVIDUALES');
  };

  const obtenerRutasDelPrograma = () => {
    const programa = programas.find(p => p.prog_id.toString() === programaSeleccionado);
    return programa ? programa.rutas : [];
  };

  // Función helper para formatear nombres completos
  const formatearNombreCompleto = (contrato) => {
    if (!contrato) return '';
    
    const nombres = [
      contrato.usu_primer_nombre,
      contrato.usu_segundo_nombre,
      contrato.usu_primer_apellido,
      contrato.usu_segundo_apellido
    ].filter(Boolean); // Filtrar valores falsy (null, undefined, '')
    
    return nombres.join(' ');
  };

  // Función helper para formatear nombre en dropdown
  const formatearNombreDropdown = (contrato) => {
    const nombreCompleto = formatearNombreCompleto(contrato);
    return `OAMP ${contrato.oamp} - ${nombreCompleto} (C.C. ${contrato.usu_cedula})`;
  };

  const calcularValores = async () => {
    // Verificar que tenemos los datos necesarios
    if (!rutaSeleccionada || !horasDictar) {
      return;
    }

    try {
      console.log('🔄 Calculando valores con datos reales de la base de datos...');
      
      const result = await apiService.calcularValoresRuta(
        rutaSeleccionada,
        regionSeleccionada,
        modalidadSeleccionada,
        horasDictar
      );

      if (result && result.success) {
        const { valorHora, horasPagar, horasCobrar, valorTotalPagar, valorTotalCobrar } = result.data;
        
        console.log('💰 Valores calculados desde la base de datos:', {
          valorHora,
          horasPagar,
          horasCobrar,
          valorTotalPagar,
          valorTotalCobrar
        });

        setHorasPagar(horasPagar.toString());
        setHorasCobrar(horasCobrar.toString());
        setValorHora(valorHora.toString());
        setValorTotalPagar(valorTotalPagar.toString());
        setValorTotalCobrar(valorTotalCobrar.toString());
      } else {
        console.warn('⚠️ Error al calcular valores, usando valores por defecto');
        // Fallback a valores por defecto en caso de error
        const horas = parseInt(horasDictar) || 0;
        const valorBase = 85000;
        
        setHorasPagar(horas.toString());
        setHorasCobrar(horas.toString());
        setValorHora(valorBase.toString());
        setValorTotalPagar((horas * valorBase).toString());
        setValorTotalCobrar((horas * valorBase * 2).toString());
      }
    } catch (error) {
      console.error('❌ Error al calcular valores:', error);
      // Fallback a valores por defecto en caso de error
      const horas = parseInt(horasDictar) || 0;
      const valorBase = 85000;
      
      setHorasPagar(horas.toString());
      setHorasCobrar(horas.toString());
      setValorHora(valorBase.toString());
      setValorTotalPagar((horas * valorBase).toString());
      setValorTotalCobrar((horas * valorBase * 2).toString());
    }
  };

  // Función para verificar completitud de datos del consultor
  const verificarCompleitudDatos = (consultor) => {
    const camposFaltantes = [];
    
    if (!consultor.usu_primer_nombre) camposFaltantes.push('Primer nombre');
    if (!consultor.usu_primer_apellido) camposFaltantes.push('Primer apellido');
    if (!consultor.usu_segundo_apellido) camposFaltantes.push('Segundo apellido');
    if (!consultor.usu_telefono || consultor.usu_telefono === 'No especificado') camposFaltantes.push('Teléfono');
    if (!consultor.usu_direccion || consultor.usu_direccion === 'No especificada') camposFaltantes.push('Dirección');
    if (!consultor.are_descripcion || consultor.are_descripcion === 'No especificada') camposFaltantes.push('Área de conocimiento');
    
    return camposFaltantes;
  };

  // Función para manejar selección de contrato
  const handleContratoChange = (contratoId) => {
    setContratoSeleccionado(contratoId);
    
    // Buscar y establecer información del consultor
    const contrato = contratos.find(c => c.oamp.toString() === contratoId);
    if (contrato) {
      // Sanitizar los datos para manejar valores null/undefined
      const consultorData = {
        ...contrato,
        usu_segundo_nombre: contrato.usu_segundo_nombre || '',
        usu_telefono: contrato.usu_telefono || 'No especificado',
        usu_direccion: contrato.usu_direccion || 'No especificada',
        are_descripcion: contrato.are_descripcion || 'No especificada'
      };
      
      setConsultorSeleccionado(consultorData);
      
      // Verificar completitud de datos
      const camposFaltantes = verificarCompleitudDatos(consultorData);
      if (camposFaltantes.length > 0) {
        console.warn('⚠️ Campos faltantes en el consultor:', camposFaltantes);
        // Opcional: mostrar alerta no intrusiva
        setTimeout(() => {
          if (window.confirm(`Algunos datos del consultor están incompletos:\n• ${camposFaltantes.join('\n• ')}\n\n¿Desea continuar de todas formas?`)) {
            console.log('✅ Usuario decidió continuar con datos incompletos');
          }
        }, 500);
      }
      
      // Debug: mostrar datos en consola
      console.log('🔍 Consultor seleccionado:', consultorData);
    } else {
      setConsultorSeleccionado(null);
    }
  };

  useEffect(() => {
    if (horasDictar && rutaSeleccionada) {
      calcularValores();
    }
  }, [horasDictar, regionSeleccionada, municipioSeleccionado, modalidadSeleccionada, rutaSeleccionada]);

  // =========================================================================
  // Función para enviar el formulario
  // =========================================================================
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const ruta = obtenerRutasDelPrograma().find(r => r.pr_id.toString() === rutaSeleccionada);
      
      if (!ruta) {
        setError("Ruta no encontrada");
        return;
      }

      // Datos comunes
      const datosComunes = {
        pr_id: parseInt(rutaSeleccionada),
        act_id: parseInt(actividadSeleccionada),
        mod_id: parseInt(modalidadSeleccionada),
        oamp: parseInt(contratoSeleccionado),
        val_reg_id: regionSeleccionada ? parseInt(regionSeleccionada) : null,
        pro_codigo_agenda: parseInt(codigoAgenda),
        pro_mes: mes,
        pro_fecha_formacion: fechaFormacion,
        pro_hora_inicio: horaInicio,
        pro_hora_fin: horaFin,
        pro_horas_dictar: parseInt(horasDictar),
        pro_coordinador_ccb: coordinadorCCB,
        pro_direccion: direccion,
        pro_enlace: enlace,
        pro_numero_hora_pagar: parseInt(horasPagar),
        pro_numero_hora_cobrar: parseInt(horasCobrar),
        pro_valor_hora: parseFloat(valorHora),
        pro_valor_total_hora_pagar: parseFloat(valorTotalPagar),
        pro_valor_total_hora_ccb: parseFloat(valorTotalCobrar),
        pro_entregables: entregables,
        pro_dependencia: dependencia,
        pro_observaciones: observaciones
      };

      let result;

      if (isEditMode && editData) {
        // MODO EDICIÓN
        console.log('📝 Modo edición - actualizando programación:', editData.id);
        
        if (editData.tipo === 'grupal') {
          // Actualizar programación grupal
          result = await apiService.updateProgramacion(editData.id, {
            ...datosComunes,
            pro_tematica: tematica
          });
        } else if (editData.tipo === 'individual') {
          // Actualizar programación individual - cambiar prefijos pro_ por proin_
          const datosIndividuales = {};
          Object.keys(datosComunes).forEach(key => {
            if (key.startsWith('pro_')) {
              datosIndividuales[key.replace('pro_', 'proin_')] = datosComunes[key];
            } else {
              datosIndividuales[key] = datosComunes[key];
            }
          });

          result = await apiService.updateProgramacion(editData.id, {
            ...datosIndividuales,
            proin_tematica: tematica,
            proin_nombre_empresario: nombreEmpresario,
            proin_identificacion_empresario: identificacionEmpresario
          });
        }
        
        if (result && result.success) {
          setSuccess("Programación actualizada exitosamente");
          // Limpiar datos de edición
          localStorage.removeItem('programacionEditar');
          setTimeout(() => {
            navigate("/gestora");
          }, 2000);
        } else {
          setError(result?.message || "Error al actualizar la programación");
        }
        
      } else {
        // MODO CREACIÓN (código original)
        if (esActividadGrupal()) {
          // Programación grupal
          result = await apiService.createProgramacionGrupal({
            ...datosComunes,
            pro_tematica: tematica
          });
        } else if (esActividadIndividual()) {
          // Programación individual - cambiar prefijos pro_ por proin_
          const datosIndividuales = {};
          Object.keys(datosComunes).forEach(key => {
            if (key.startsWith('pro_')) {
              datosIndividuales[key.replace('pro_', 'proin_')] = datosComunes[key];
            } else {
              datosIndividuales[key] = datosComunes[key];
            }
          });

          result = await apiService.createProgramacionIndividual({
            ...datosIndividuales,
            proin_tematica: tematica,
            proin_nombre_empresario: nombreEmpresario,
            proin_identificacion_empresario: identificacionEmpresario
          });
        }

        if (result && result.success) {
          setSuccess("Programación creada exitosamente");
          setTimeout(() => {
            navigate("/gestora");
          }, 2000);
        } else {
          setError(result?.message || "Error al crear la programación");
        }
      }

    } catch (error) {
      console.error('Error:', error);
      setError(error.message || "Error al enviar el formulario");
    }
  };

  // Función para hacer debug específico del consultor
  const debugConsultorActual = async () => {
    if (!consultorSeleccionado?.usu_cedula) {
      alert('No hay consultor seleccionado');
        return;
      }
  
    try {
      const result = await apiService.debugConsultor(consultorSeleccionado.usu_cedula);
      console.log('🔍 Debug consultor desde API:', result);
      
      if (result.success && result.data.consultor) {
        alert(`Debug Consultor:\n${JSON.stringify(result.data.consultor, null, 2)}`);
      } else {
        alert('No se encontraron datos del consultor');
      }
    } catch (error) {
      console.error('Error en debug:', error);
      alert('Error al obtener debug del consultor');
    }
  };

  // =========================================================================
  // Renderizado del componente
  // =========================================================================

  if (loading) {
    return (
      <DashboardLayout>
        <div className="nueva-programacion-content">
          <div className="loading-container">
            <h2>Cargando datos...</h2>
            <div className="spinner"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="nueva-programacion-content">
        <div className="page-header">
          <div>
            <h2>Panel de Gestión</h2>
            <h1>{isEditMode ? 'Editar Programación' : 'Nueva Programación'}</h1>
          </div>
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

        {error && (
          <div className="alert alert-error">
            {error}
        </div>
        )}

        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="programacion-form">
          {/* Sección 1: Tipo de Actividad */}
          <div className="form-section">
            <h3>Tipo de Actividad</h3>
                <div className="form-grid">
                  <div className="form-group">
                <label htmlFor="actividad">Tipo de Actividad *</label>
                    <select
                  id="actividad"
                  value={actividadSeleccionada}
                  onChange={(e) => setActividadSeleccionada(e.target.value)}
                      required
                    >
                  <option value="">Selecciona una actividad</option>
                  {actividades.map((actividad) => (
                    <option key={actividad.act_id} value={actividad.act_id}>
                      {actividad.act_tipo}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                <label htmlFor="modalidad">Modalidad *</label>
                    <select
                  id="modalidad"
                  value={modalidadSeleccionada}
                  onChange={(e) => setModalidadSeleccionada(e.target.value)}
                      required
                    >
                  <option value="">Selecciona una modalidad</option>
                  {modalidades.map((modalidad) => (
                    <option key={modalidad.mod_id} value={modalidad.mod_id}>
                      {modalidad.mod_nombre}
                        </option>
                      ))}
                    </select>
              </div>
            </div>
                  </div>

          {/* Sección 2: Programa y Ruta */}
          {actividadSeleccionada && (
            <div className="form-section">
              <h3>Programa y Ruta</h3>
              <div className="form-grid">
                  <div className="form-group">
                  <label htmlFor="programa">Programa *</label>
                    <select
                    id="programa"
                    value={programaSeleccionado}
                    onChange={(e) => {
                      setProgramaSeleccionado(e.target.value);
                      setRutaSeleccionada(""); // Reset ruta when programa changes
                    }}
                      required
                    >
                    <option value="">Selecciona un programa</option>
                    {programas.map((programa) => (
                      <option key={programa.prog_id} value={programa.prog_id}>
                        {programa.prog_nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                {programaSeleccionado && (
                  <div className="form-group">
                    <label htmlFor="ruta">Ruta *</label>
                    <select
                      id="ruta"
                      value={rutaSeleccionada}
                      onChange={(e) => setRutaSeleccionada(e.target.value)}
                      required
                    >
                      <option value="">Selecciona una ruta</option>
                      {obtenerRutasDelPrograma().map((ruta) => (
                        <option key={ruta.pr_id} value={ruta.pr_id}>
                          {ruta.rut_nombre}
                      </option>
                      ))}
                    </select>
                  </div>
                )}

                  <div className="form-group">
                  <label htmlFor="contrato">Contrato OAMP *</label>
                    <select
                    id="contrato"
                    value={contratoSeleccionado}
                    onChange={(e) => handleContratoChange(e.target.value)}
                      required
                    >
                    <option value="">Selecciona un contrato</option>
                    {contratos.map((contrato) => (
                      <option key={contrato.oamp} value={contrato.oamp}>
                        {formatearNombreDropdown(contrato)}
                      </option>
                    ))}
                    </select>
                  </div>
                  </div>
            </div>
          )}

          {/* Sección 3: Información Básica */}
          {rutaSeleccionada && (
            <div className="form-section">
              <h3>Información Básica</h3>
              <div className="form-grid">
                  <div className="form-group">
                  <label htmlFor="tematica">Temática *</label>
                    <input
                    type="text"
                    id="tematica"
                    value={tematica}
                    onChange={(e) => setTematica(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="mes">Mes *</label>
                    <select
                    id="mes"
                    value={mes}
                    onChange={(e) => setMes(e.target.value)}
                        required
                      >
                    <option value="">Selecciona un mes</option>
                    <option value="Enero">Enero</option>
                    <option value="Febrero">Febrero</option>
                    <option value="Marzo">Marzo</option>
                    <option value="Abril">Abril</option>
                    <option value="Mayo">Mayo</option>
                    <option value="Junio">Junio</option>
                    <option value="Julio">Julio</option>
                    <option value="Agosto">Agosto</option>
                    <option value="Septiembre">Septiembre</option>
                    <option value="Octubre">Octubre</option>
                    <option value="Noviembre">Noviembre</option>
                    <option value="Diciembre">Diciembre</option>
                      </select>
                    </div>

                  <div className="form-group">
                  <label htmlFor="fechaFormacion">Fecha de Formación *</label>
                    <input
                    type="date"
                    id="fechaFormacion"
                    value={fechaFormacion}
                    onChange={(e) => setFechaFormacion(e.target.value)}
                    required
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="horaInicio">Hora Inicio *</label>
                    <select
                    id="horaInicio"
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                      required
                    >
                      <option value="">Selecciona hora de inicio</option>
                      <option value="01:00">01:00 AM</option>
                      <option value="02:00">02:00 AM</option>
                      <option value="03:00">03:00 AM</option>
                      <option value="04:00">04:00 AM</option>
                      <option value="05:00">05:00 AM</option>
                      <option value="06:00">06:00 AM</option>
                      <option value="07:00">07:00 AM</option>
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                      <option value="19:00">07:00 PM</option>
                      <option value="20:00">08:00 PM</option>
                      <option value="21:00">09:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                      <option value="23:00">11:00 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                  <label htmlFor="horaFin">Hora Fin *</label>
                    <select
                    id="horaFin"
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                      required
                    >
                      <option value="">Selecciona hora de fin</option>
                      <option value="01:00">01:00 AM</option>
                      <option value="02:00">02:00 AM</option>
                      <option value="03:00">03:00 AM</option>
                      <option value="04:00">04:00 AM</option>
                      <option value="05:00">05:00 AM</option>
                      <option value="06:00">06:00 AM</option>
                      <option value="07:00">07:00 AM</option>
                      <option value="08:00">08:00 AM</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="13:00">01:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                      <option value="18:00">06:00 PM</option>
                      <option value="19:00">07:00 PM</option>
                      <option value="20:00">08:00 PM</option>
                      <option value="21:00">09:00 PM</option>
                      <option value="22:00">10:00 PM</option>
                      <option value="23:00">11:00 PM</option>
                    </select>
                  </div>

                  <div className="form-group">
                  <label htmlFor="horasDictar">Horas a Dictar *</label>
                    <input
                    type="number"
                    id="horasDictar"
                    value={horasDictar}
                    onChange={(e) => setHorasDictar(e.target.value)}
                    min="1"
                      required
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="coordinadorCCB">Coordinador CCB</label>
                    <input
                      type="text"
                    id="coordinadorCCB"
                    value={coordinadorCCB}
                    onChange={(e) => setCoordinadorCCB(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="direccion">Dirección *</label>
                    <input
                      type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="enlace">Enlace Virtual</label>
                    <input
                    type="url"
                    id="enlace"
                    value={enlace}
                    onChange={(e) => setEnlace(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="codigoAgenda">Código Agenda *</label>
                    <input
                    type="number"
                    id="codigoAgenda"
                    value={codigoAgenda}
                    onChange={(e) => setCodigoAgenda(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="dependencia">Dependencia *</label>
                    <input
                    type="text"
                    id="dependencia"
                    value={dependencia}
                    onChange={(e) => setDependencia(e.target.value)}
                      required
                    />
                  </div>
              </div>
            </div>
          )}

          {/* Sección 4: Campos específicos para asesorías individuales */}
          {esActividadIndividual() && rutaSeleccionada && (
            <div className="form-section">
              <h3>Información del Empresario (Asesoría Individual)</h3>
              <div className="form-grid">
                  <div className="form-group">
                  <label htmlFor="nombreEmpresario">Nombre del Empresario *</label>
                    <input
                    type="text"
                    id="nombreEmpresario"
                    value={nombreEmpresario}
                    onChange={(e) => setNombreEmpresario(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                  <label htmlFor="identificacionEmpresario">Identificación del Empresario *</label>
                    <input
                    type="text"
                    id="identificacionEmpresario"
                    value={identificacionEmpresario}
                    onChange={(e) => setIdentificacionEmpresario(e.target.value)}
                      required
                    />
                  </div>
              </div>
            </div>
          )}

          {/* Sección 5: Región (opcional) */}
          {rutaSeleccionada && (
            <div className="form-section">
              <h3>Región (Opcional)</h3>
                <div className="form-grid">
                  <div className="form-group">
                  <label htmlFor="region">Región</label>
                    <select
                    id="region"
                    value={regionSeleccionada}
                    onChange={(e) => setRegionSeleccionada(e.target.value)}
                  >
                    <option value="">Sin región específica</option>
                    {regiones.map((region) => (
                      <option key={region.reg_id} value={region.val_reg_id}>
                        Región {region.reg_id}
    </option>
  ))}
</select>
                  </div>

                {regionSeleccionada && (
                  <div className="form-group">
                    <label htmlFor="municipio">Municipio</label>
                    <select
                      id="municipio"
                      value={municipioSeleccionado}
                      onChange={(e) => setMunicipioSeleccionado(e.target.value)}
                    >
                      <option value="">Selecciona un municipio</option>
                      {municipios.map((municipio) => (
                        <option key={municipio.mun_id} value={municipio.mun_nombre}>
                          {municipio.mun_nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sección 6: Valores Calculados */}
          {horasDictar && (
            <div className="form-section">
              <h3>Valores Calculados</h3>
              <div className="form-grid">
                  <div className="form-group">
                  <label>Horas a Pagar</label>
                  <input type="text" value={horasPagar} readOnly />
                  </div>

                  <div className="form-group">
                  <label>Horas a Cobrar</label>
                  <input type="text" value={horasCobrar} readOnly />
                  </div>

                  <div className="form-group">
                  <label>Valor por Hora</label>
                  <input type="text" value={`$${parseInt(valorHora || 0).toLocaleString()}`} readOnly />
                  </div>

                  <div className="form-group">
                  <label>Valor Total a Pagar</label>
                  <input type="text" value={`$${parseInt(valorTotalPagar || 0).toLocaleString()}`} readOnly />
                  </div>

                  <div className="form-group">
                  <label>Valor Total a Cobrar CCB</label>
                  <input type="text" value={`$${parseInt(valorTotalCobrar || 0).toLocaleString()}`} readOnly />
                  </div>
              </div>
            </div>
          )}

          {/* Sección 7: Información Adicional */}
          {rutaSeleccionada && (
            <div className="form-section">
              <h3>Información Adicional</h3>
              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="entregables">Entregables</label>
                  <textarea
                    id="entregables"
                    value={entregables}
                    onChange={(e) => setEntregables(e.target.value)}
                    rows="3"
                    />
                  </div>

                <div className="form-group full-width">
                  <label htmlFor="observaciones">Observaciones</label>
                  <textarea
                    id="observaciones"
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    rows="3"
                    />
                  </div>
              </div>
            </div>
          )}

          {/* Sección nueva: Información del Consultor Seleccionado */}
          {consultorSeleccionado && (
            <div className="form-section consultor-info-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <h3 style={{ margin: 0 }}>📋 Información del Consultor Asignado</h3>
                <button 
                  type="button"
                  onClick={debugConsultorActual}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#ff9800',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  🔍 Debug Datos
                </button>
              </div>
                <div className="form-grid">
                  <div className="form-group">
                  <label>Nombres Completos</label>
                    <input
                    type="text" 
                    value={formatearNombreCompleto(consultorSeleccionado)} 
                    readOnly 
                    style={{ backgroundColor: formatearNombreCompleto(consultorSeleccionado) ? '#e3f2fd' : '#ffebee' }}
                    />
                  </div>

                  <div className="form-group">
                  <label>Cédula</label>
                    <input
                    type="text" 
                    value={consultorSeleccionado.usu_cedula || 'No disponible'} 
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                  <label>Teléfono</label>
                    <input
                      type="text"
                    value={consultorSeleccionado.usu_telefono} 
                      readOnly
                    style={{ backgroundColor: consultorSeleccionado.usu_telefono === 'No especificado' ? '#fff3e0' : '#e3f2fd' }}
                    />
                  </div>

                    <div className="form-group">
                  <label>Dirección</label>
                      <input
                        type="text"
                    value={consultorSeleccionado.usu_direccion} 
                        readOnly
                    style={{ backgroundColor: consultorSeleccionado.usu_direccion === 'No especificada' ? '#fff3e0' : '#e3f2fd' }}
                      />
                    </div>

                <div className="form-group full-width">
                  <label>Área de Conocimiento</label>
                    <input
                      type="text"
                    value={consultorSeleccionado.are_descripcion} 
                    readOnly 
                    style={{ backgroundColor: consultorSeleccionado.are_descripcion === 'No especificada' ? '#fff3e0' : '#e3f2fd' }}
                    />
                  </div>

                  <div className="form-group">
                  <label>Valor Total del Contrato</label>
                    <input
                      type="text"
                    value={`$${parseInt(consultorSeleccionado.oamp_valor_total || 0).toLocaleString()}`} 
                      readOnly
                    />
                  </div>

                  <div className="form-group">
                  <label>Fecha Generación Contrato</label>
                    <input
                      type="text"
                    value={new Date(consultorSeleccionado.oamp_fecha_generacion).toLocaleDateString('es-CO')} 
                    readOnly 
                    />
                  </div>
                  </div>
                  </div>
          )}

          {/* Botón de envío */}
          {rutaSeleccionada && (
            <div className="form-actions">
              <button
                type="submit"
                className="submit-button"
                style={{ backgroundColor: colors.primary }}
              >
                {isEditMode ? 'Actualizar Programación' : 'Crear Programación'}
              </button>
          </div>
        )}
        </form>
      </div>
    </DashboardLayout>
  );
}

export default NuevaProgramacionPage;
