// src/pages/Gestora/Dashboard.js
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

// Registrar los componentes necesarios de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Helper function to format currency
const formatCurrency = (valueStr) => {
  if (typeof valueStr !== 'string') {
    if (typeof valueStr === 'number') {
      return `$${valueStr.toLocaleString('es-CO')}`;
    }
    return valueStr;
  }
  const numericString = valueStr.replace(/[$.-]/g, '');
  const number = parseInt(numericString, 10);
  if (isNaN(number)) return valueStr;
  return `$${number.toLocaleString('es-CO')}`;
};

// Helper to parse hours, handling potential empty strings or non-numeric
const parseHours = (hoursStr) => {
  const val = parseInt(hoursStr, 10);
  return isNaN(val) ? 0 : val;
};


function Dashboard() {
  const [selectedProgramaId, setSelectedProgramaId] = useState('general');
  const [selectedRutaId, setSelectedRutaId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Define sections based on PDF PROGRAMAS
  const programasPrincipales = useMemo(() => [
    { id: 'general', name: 'Vista General', icon: '📊' },
    { id: 'crecimiento_empresarial', name: 'Crecimiento Empresarial', icon: '📈' },
    { id: 'emprendimiento_inn', name: 'Emprendimiento (Ruta Bgtá/Cund. Inn)', icon: '🚀' },
    { id: 'consolidacion_escalamiento', name: 'Consolidación y Escalamiento', icon: '🏢' },
    { id: 'sector_alimentos', name: 'Sector Alimentos', icon: '🍽️' },
    { id: 'internacionalizacion', name: 'Internacionalización', icon: '🌍' },
    { id: 'foro_presidente', name: 'Foro Presidente', icon: '🗣️' }
  ], []);

  // Restructured data based on PDF, including PROGRAMAS and their RUTAS
  const dashboardData = useMemo(() => ({
    general: {
      name: 'Vista General',
      icon: '📊',
      programStats: [
        { title: 'Total Horas Propuesta', value: parseHours('13895').toLocaleString('es-CO') }, // Corrected total from PDF [cite: 1, 3]
        { title: 'Valor Total Propuesta', value: formatCurrency('2691023510') }, // [cite: 1, 3]
        { title: 'Horas Ejecutadas (Abril 2025)', value: parseHours('113').toLocaleString('es-CO') } // [cite: 1, 3]
      ],
      programBarData: {
        labels: ['Crecimiento E.', 'Innovación', 'Emprendimiento', 'Consolidación (Rutas Principales)', 'Sector Alimentos', 'Internacionalización', 'Foro Presidente'],
        datasets: [{
          label: 'Horas Totales por Programa Principal',
          data: [
            1310, // Crecimiento Empresarial
            400 + 1000, // Emprendimiento Inn (Innovacion + Emprendimiento)
            818 + 765 + 1142 + 4300 + 854 + 1102 + 1044 + 192, // Consolidacion (sum of its main RUTAS from PDF)
            1908, // Sector Alimentos
            212 + 100 + 1280, // Internacionalización (sum of Asesorias + Plan)
            60    // Foro Presidente
          ],
          backgroundColor: [
            'rgba(227, 25, 55, 0.8)', 'rgba(54, 162, 235, 0.8)', 'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)', 'rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)',
            'rgba(120, 120, 120, 0.8)'
          ],
          borderWidth: 1,
        }]
      },
      programDoughnutData: {
        labels: ['Horas Ejecutadas (Abril 2025)', 'Horas Pendientes (Propuesta Total)'],
        datasets: [{
          data: [113, 13895 - 113],
          backgroundColor: ['rgba(227, 25, 55, 0.8)', 'rgba(228, 228, 228, 0.8)'],
          borderWidth: 1,
        }]
      },
      rutas: [] // No sub-rutas for general view
    },
    crecimiento_empresarial: {
      name: 'Crecimiento Empresarial',
      icon: '📈',
      programStats: [ // These are effectively RUTA stats as it's a single block
        { title: 'Total Horas', value: parseHours('1310').toLocaleString('es-CO') }, // [cite: 1, 3]
        { title: 'Valor Total', value: formatCurrency('230080540') }, // [cite: 1, 3]
        { title: 'Nº Consultores', value: '10' }, // [cite: 1, 3]
        { title: 'Horas Ejecutadas (Abril)', value: parseHours('10').toLocaleString('es-CO') } // [cite: 1, 3]
      ],
      areaConocimientoPrincipal: "Finanzas corporativas, valoración de empresas, intervención psicosocial.", // [cite: 1, 3]
      rutas: [
        {
          id: 'crecimiento_main', name: 'Detalle Crecimiento Empresarial',
          stats: [
            { title: 'Total Horas Ruta', value: parseHours('1310').toLocaleString('es-CO') },
            { title: 'Valor Total Ruta', value: formatCurrency('230080540') },
            { title: 'Nº Consultores', value: '10' },
            { title: 'Horas Ejecutadas (Abril)', value: parseHours('10').toLocaleString('es-CO') }
          ],
          barData: {
            labels: ['Ejecutadas (Abril)', 'Pendientes (del total)'],
            datasets: [{
              label: 'Progreso Horas', data: [10, 1310 - 10],
              backgroundColor: ['rgba(227, 25, 55, 0.8)', 'rgba(227, 25, 55, 0.3)'],
              borderColor: 'rgba(227, 25, 55, 1)', borderWidth: 1,
            }]
          },
          areaConocimiento: "Finanzas corporativas. Planificaciones financieras, construcción y análisis de indicadores financieros, valoración de empresas, inmersión de riesgo. Atención e implementación de programas de intervención personal y familiar."  // [cite: 1, 3]
        }
      ]
    },
    emprendimiento_inn: {
      name: 'Emprendimiento (Ruta Bgtá/Cund. Inn)',
      icon: '🚀',
      programStats: [
        { title: 'Total Horas (Inn+Empr)', value: parseHours(String(400 + 1000)).toLocaleString('es-CO') }, // Sum of TOTAL HORAS [cite: 1, 3]
        { title: 'Valor Total (Inn+Empr)', value: formatCurrency(String(102880200 + 281014400)) }, // Sum of VALOR TOTAL [cite: 1, 3]
        { title: 'Nº Consultores', value: '10' }, // [cite: 1, 3]
        { title: 'Horas Ejecutadas (Abril)', value: parseHours('55').toLocaleString('es-CO') } // [cite: 1, 3]
      ],
      rutas: [
        {
          id: 'innovacion', name: 'RUTA: INNOVACIÓN',
          stats: [
            { title: 'Total Horas Sector', value: parseHours('480').toLocaleString('es-CO') }, // [cite: 1, 3]
            { title: 'Valor Total', value: formatCurrency('102880200') }, // [cite: 1, 3]
            { title: 'Promedio Horas/Consultor', value: '92' } // [cite: 1, 3]
          ],
          barData: {
            labels: ['Horas Asignadas'], datasets: [{ label: 'Innovación', data: [480], backgroundColor: 'rgba(54, 162, 235, 0.8)' }]
          },
          areaConocimiento: "Innovación, Metodologías Ágiles, Manejo de herramientas IA" // [cite: 1, 3]
        },
        {
          id: 'emprendimiento', name: 'RUTA: EMPRENDIMIENTO',
          stats: [
            { title: 'Total Horas Sector', value: parseHours('1000').toLocaleString('es-CO') }, // [cite: 1, 3]
            { title: 'Valor Total', value: formatCurrency('281014400') }, // [cite: 1, 3]
            { title: 'Promedio Horas/Consultor', value: '160' } // [cite: 1, 3]
          ],
          barData: {
            labels: ['Horas Asignadas'], datasets: [{ label: 'Emprendimiento', data: [1000], backgroundColor: 'rgba(255, 206, 86, 0.8)' }]
          },
          areaConocimiento: "Marketing, Modelo de negocio, Emprendimiento, Financiero, Legal, Portafolio de Productos, Estrategia de Marketing, Portafolio de Productos, Pricing y Monetización" // [cite: 1, 3]
        }
      ]
    },
    consolidacion_escalamiento: {
      name: 'Consolidación y Escalamiento Empresarial',
      icon: '🏢',
      // Sum of its main RUTAS from PDF (excluding Alimentos, FinancieroProd, Inter)
      programStats: [
        { title: 'Total Horas (Rutas Base)', value: parseHours(String(818+765+1142+4300+854+1102+1044+192)).toLocaleString('es-CO') },
        { title: 'Valor Total (Rutas Base)', value: formatCurrency(String(143868612+134300010+200574028+755228200 /* Placeholder sum, complete with all rutas */))},
        { title: 'Nº Rutas Principales', value: '8' } // Count of direct RUTAS under this program in PDF
      ],
      rutas: [
        { id: 'ce_est_fin_moda', name: 'Est. Financiera (Moda)', totalHoras: 818, valorTotal: '143868612', consultores: 10, areaConocimiento: "Financiero" }, // [cite: 1, 3]
        { id: 'ce_fort_vent_moda', name: 'Fort. Ventas (Moda)', totalHoras: 705, valorTotal: '134300010', consultores: 'N/A', areaConocimiento: "Venta, Marketing, organización" }, // [cite: 1, 3]
        { id: 'ce_prog_abierta_region', name: 'Prog. Abierta y Región', totalHoras: 1142, valorTotal: '200574028', consultores: 10, areaConocimiento: "Mercadeo y ventas, estrategia, financiero, calidad, etc." }, // [cite: 1, 3]
        { id: 'ce_ciclos_focalizados', name: 'Ciclos Focalizados (Multisectorial)', totalHoras: 4300, valorTotal: '755228200', /* Consultores varies by sub-ciclo */ areaConocimiento: "Talento Humano (Construc.), Excelencia (Turismo), Financiero (Servicios), Transformación Digital, Tecnología (Modelos Neg., Logística), Desarrollo Proveedores, Marketing (Gastronómico), Interpersonal (Ventas)" }, // [cite: 1, 3]
        // Individual sub-items of "CICLOS FOCALIZADOS" can be added as further nested detail or separate RUTAS if desired.
        // For simplicity, starting with main RUTAS under "Consolidación".
         { id: 'ce_tec_cadena_abast', name: 'Tec. Cadena Abastecimiento', totalHoras: 854, valorTotal: 'N/A en PDF', consultores: 20, areaConocimiento: "Gestión de cadena de suministro, ERP, WMS, automatización, etc." }, // [cite: 1, 3] (Valor Total seems missing in PDF for this specific line)
         { id: 'ce_des_proveedores', name: 'Desarrollo Proveedores', totalHoras: 1102, valorTotal: 'N/A en PDF', consultores: 13, areaConocimiento: "Productividad operacional, laboral, gestión de calidad, logística"}, // [cite: 1, 3]
         { id: 'ce_mkt_experiencia_gastro', name: 'Mkt. Experiencia (Gastronómico)', totalHoras: 1044, valorTotal: 'N/A en PDF', consultores: 2, areaConocimiento: "Propuestas de valor, conexión emocional, fidelización" }, // [cite: 1, 3]
         { id: 'ce_mkt_impulsar_crec', name: 'Mkt. para Impulsar Crecimiento', totalHoras: 192, valorTotal: 'N/A en PDF', consultores: 'N/A', areaConocimiento: "Estrategias de mercadeo, plan de ventas, marketing digital"}, // [cite: 1, 3] (Note: PDF has "TOTAL HORAS" as 192 for "Interpersonal entrenamiento de ventas sugev" which seems to be this one, other fields are sparse for the "Mercadeo para Impulsar..." line)
      ].map(r => ({ // Common structure for rutas under Consolidacion
          ...r,
          stats: [
            { title: 'Total Horas Ruta', value: parseHours(String(r.totalHoras)).toLocaleString('es-CO') },
            { title: 'Valor Total Ruta', value: r.valorTotal !== 'N/A en PDF' ? formatCurrency(r.valorTotal) : 'No especificado' },
            { title: 'Nº Consultores', value: r.consultores || 'N/A' },
          ],
          barData: {
            labels: [r.name.substring(0,20)], datasets: [{ label: 'Horas Asignadas', data: [r.totalHoras], backgroundColor: 'rgba(255, 206, 86, 0.8)' }]
          }
      }))
    },
    sector_alimentos: {
      name: 'Sector Alimentos',
      icon: '🍽️',
      programStats: [
        { title: 'Total Horas Programa', value: parseHours('1908').toLocaleString('es-CO') }, // [cite: 1, 3]
        { title: 'Valor Total Programa', value: formatCurrency('335109672') }, // [cite: 1, 3]
        // N consultores is per RUTA
      ],
      rutas: [
        {
          id: 'alimentos_ia', name: 'RUTA: Aplicación IA (Alimentos)',
          stats: [
            { title: 'Total Horas Sector', value: parseHours('336').toLocaleString('es-CO') }, // [cite: 1, 3]
            { title: 'Nº Consultores', value: '3' }, // [cite: 1, 3]
            // Valor total for this specific RUTA not directly isolated in main summary, part of program total
          ],
          barData: { labels: ['Horas Asignadas'], datasets: [{ label: 'IA en Alimentos', data: [336], backgroundColor: 'rgba(153, 102, 255, 0.8)' }] },
          areaConocimiento: "Aplicación de la IA en empresas, herramientas y técnicas de IA para marketing y comunicación, chatbots, análisis de datos con IA." // [cite: 1, 3]
        },
        {
          id: 'alimentos_talento', name: 'RUTA: Fidelización y Talento Humano (Alimentos)',
          stats: [
            { title: 'Total Horas Sector', value: parseHours('336').toLocaleString('es-CO') }, // [cite: 1, 3]
            { title: 'Nº Consultores', value: '2' }, // [cite: 1, 3]
          ],
          barData: { labels: ['Horas Asignadas'], datasets: [{ label: 'Talento en Alimentos', data: [336], backgroundColor: 'rgba(255, 159, 64, 0.8)' }] },
          areaConocimiento: "Atracción y retención del talento humano y administración del talento humano." // [cite: 1, 3]
        },
        { // This RUTA is listed under SECTOR ALIMENTOS PROGRAMA in PDF
          id: 'alimentos_fin_prod', name: 'RUTA: Financiero y Productividad (en Alimentos)',
          stats: [
            { title: 'Total Horas Sector', value: parseHours('364').toLocaleString('es-CO') }, // [cite: 1, 3]
            { title: 'Valor Total', value: formatCurrency('63930770') }, // [cite: 1, 3]
            { title: 'Nº Consultores', value: '2' }, // [cite: 1, 3]
          ],
          barData: {
            labels: ["Productividad", "Gest. Financiera", "Tributario"],
            datasets: [{ label: 'Distribución Horas (aprox.)', data: [121, 121, 122], backgroundColor: 'rgba(75, 192, 192, 0.8)' }]
          },
          areaConocimiento: "Modernización de la Productividad, Gestión Financiero, Tributario y Financiero." // [cite: 1, 3]
        }
      ]
    },
    internacionalizacion: {
      name: 'Internacionalización',
      icon: '🌍',
      programStats: [
        { title: 'Total Horas Programa', value: parseHours(String(212 + 100 + 1280)).toLocaleString('es-CO') }, // Sum of Asesorias + Plan [cite: 1, 3]
        { title: 'Valor Total Programa', value: formatCurrency(String(9256488 + 100883584 + 196000000)) }, // Sum for Plan + Asesorias [cite: 1, 3] (PDF VALOR TOTAL for "Asesorias indidates" is 09:256.488, assuming 9,256,488. The other values are 100.883.584 and 196.000.000)
        { title: 'Horas Ejecutadas (Abril)', value: parseHours('30').toLocaleString('es-CO') } // [cite: 1, 3]
      ],
      rutas: [
        {
          id: 'inter_asesorias', name: 'RUTA: Asesorías Individuales (Inter.)',
          stats: [
            { title: 'Total Horas', value: parseHours(String(212+100)).toLocaleString('es-CO') }, // Sum of 212 + 100 [cite: 1, 3]
            { title: 'Valor Total', value: formatCurrency('9256488') }, // [cite: 1, 3]
            { title: 'Nº Consultores', value: '32' } // [cite: 1, 3]
          ],
          barData: { labels: ['Horas Asignadas'], datasets: [{ label: 'Asesorías', data: [312], backgroundColor: 'rgba(255, 99, 132, 0.8)' }] },
          areaConocimiento: "Consultoría, Gestión del Talento Humano, Servicios Financieros, Cadenas de Abastecimiento, Salud, Sector Farmacéutico, Construcción y Energía." // [cite: 1, 3]
        },
        {
          id: 'inter_plan', name: 'RUTA: Plan de Internacionalización',
          stats: [
            { title: 'Total Horas', value: parseHours('1280').toLocaleString('es-CO') }, // PDF has 1.28, assuming 1280 [cite: 1, 3]
            { title: 'Valor Total (Suma Entregables)', value: formatCurrency(String(100883584 + 196000000)) }, // Sum of two VALOR TOTAL lines for Plan [cite: 1, 3]
            { title: 'Nº Consultores', value: '13' } // [cite: 1, 3]
          ],
          barData: {
            labels: ['Preselección Mercado', 'MarketFit', 'One Pager'], // Based on SECTORES in PDF
            datasets: [{ label: 'Horas por Entregable (Ejemplo)', data: [420, 430, 430], backgroundColor: 'rgba(75, 192, 75, 0.8)' }] // Placeholder data
          },
          areaConocimiento: "Finanzas internacionales, comercio exterior, economía, administración de empresas, finanzas, negocios internacionales, relaciones internacionales o afines." // [cite: 1, 3]
        }
      ]
    },
    foro_presidente: {
      name: 'Foro Presidente',
      icon: '🗣️',
      programStats: [ // These are RUTA stats as it's one block
        { title: 'Total Horas', value: parseHours('60').toLocaleString('es-CO') }, // [cite: 1, 3]
        { title: 'Valor Total', value: formatCurrency('12300000') }, // [cite: 1, 3]
        { title: 'Nº Consultores', value: '4' }, // [cite: 1, 3]
      ],
      rutas: [
        {
          id: 'foro_escuela_mentores', name: 'RUTA: Escuela de Mentores, Voluntariado y Prog. Región',
          stats: [
            { title: 'Total Horas Ruta', value: parseHours('60').toLocaleString('es-CO') },
            { title: 'Valor Total Ruta', value: formatCurrency('12300000') },
            { title: 'Nº Consultores', value: '4' },
          ],
          barData: {
            labels: ['Horas Asignadas'], datasets: [{ label: 'Foro Presidente', data: [60], backgroundColor: 'rgba(120, 120, 120, 0.8)'}]
          },
          areaConocimiento: "Storytelling y herramientas para la mentoría, Creatividad desde la IA, Coaching de equipos de destinos, Liderazgo, Gestión del talento en la era de IA." // [cite: 1, 3]
        }
      ]
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [selectedProgramaId, selectedRutaId]);

  const handleProgramaChange = (programaId) => {
    setSelectedProgramaId(programaId);
    setSelectedRutaId(null); // Reset ruta when program changes
    // If the new programa has only one ruta, select it automatically
    const programa = dashboardData[programaId];
    if (programa && programa.rutas && programa.rutas.length === 1) {
        setSelectedRutaId(programa.rutas[0].id);
    }
  };

  const handleRutaChange = (rutaId) => {
    setSelectedRutaId(rutaId);
  };

  const renderContent = () => {
    const currentProgramaData = dashboardData[selectedProgramaId];
    if (!currentProgramaData) return <p>Seleccione un programa.</p>;

    let displayData;
    let areaConocimientoToShow = currentProgramaData.areaConocimientoPrincipal || ""; // For program overview

    if (selectedRutaId && currentProgramaData.rutas) {
      const currentRutaData = currentProgramaData.rutas.find(r => r.id === selectedRutaId);
      if (currentRutaData) {
        displayData = currentRutaData;
        areaConocimientoToShow = currentRutaData.areaConocimiento || areaConocimientoToShow;
      } else {
        // Fallback to program data if ruta somehow not found, though this shouldn't happen with proper state reset
        displayData = { stats: currentProgramaData.programStats, barData: currentProgramaData.programBarData, doughnutData: currentProgramaData.programDoughnutData };
      }
    } else {
      // Display Program-level overview
      displayData = { stats: currentProgramaData.programStats, barData: currentProgramaData.programBarData, doughnutData: currentProgramaData.programDoughnutData };
    }

    if (!displayData || !displayData.stats) return <p>Cargando datos...</p>;

    return (
      <div className="section-content">
        {/* Ruta Navigation - only if program has multiple rutas and it's not 'general' */}
        {selectedProgramaId !== 'general' && currentProgramaData.rutas && currentProgramaData.rutas.length > 0 && (
            <div className="ruta-navigation">
                <h4>Rutas del Programa "{currentProgramaData.name}":</h4>
                {currentProgramaData.rutas.map(ruta => (
                    <button
                        key={ruta.id}
                        className={`ruta-button ${selectedRutaId === ruta.id ? 'active' : ''}`}
                        onClick={() => handleRutaChange(ruta.id)}
                    >
                        {ruta.name}
                    </button>
                ))}
                 {/* Button to go back to program overview if a ruta is selected */}
                {selectedRutaId && (
                    <button
                        className="ruta-button"
                        onClick={() => handleRutaChange(null)}
                    >
                        Ver Resumen del Programa
                    </button>
                )}
            </div>
        )}

        <div className="dashboard-stats">
          {displayData.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          ))}
        </div>
        
        {areaConocimientoToShow && (
            <div className="area-conocimiento-card">
                <h4>Área(s) de Conocimiento Principal(es):</h4>
                <p>{areaConocimientoToShow}</p>
            </div>
        )}

        <div className="charts-grid">
          {displayData.barData && (
            <div className="chart-container">
              <h3>{displayData.barData.datasets[0].label || 'Análisis Principal'}</h3>
              <div className="chart-wrapper">
                <Bar data={displayData.barData} options={chartOptions} />
              </div>
            </div>
          )}
          {displayData.doughnutData && ( // Only show doughnut if data exists (e.g., for 'general')
            <div className="chart-container">
              <h3>{displayData.doughnutData.datasets[0].label || 'Progreso General'}</h3>
              <div className="chart-wrapper">
                <Doughnut data={displayData.doughnutData} options={doughnutOptions} />
              </div>
            </div>
          )}
        </div>

        <div className="dashboard-footer">
          <div className="footer-stats">
            <div className="stat-item">
              <span>Última Actualización</span>
              <strong>{new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
            <div className="stat-item">
              <span>Estado General</span>
              <strong className="status-active">Activo</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'top',
        labels: { boxWidth: isMobile ? 10 : 12, padding: isMobile ? 8 : 10, font: { size: isMobile ? 10 : 12 } }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: '#fff', bodyColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, padding: isMobile ? 8 : 10,
        bodyFont: { size: isMobile ? 11 : 12 }, titleFont: { size: isMobile ? 12 : 13, weight: 'bold' },
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) { label += ': '; }
                if (context.parsed.y !== null) {
                    label += context.parsed.y.toLocaleString('es-CO');
                    if (context.dataset.label && context.dataset.label.toLowerCase().includes('horas')) {
                        label += ' horas';
                    }
                }
                return label;
            }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true, grid: { drawBorder: false, color: 'rgba(0,0,0,0.05)' },
        ticks: { font: { size: isMobile ? 9 : 11 }, maxTicksLimit: isMobile ? 5 : 6,
           callback: function(value) { return value.toLocaleString('es-CO'); }
        }
      },
      x: {
        grid: { display: false },
        ticks: { font: { size: isMobile ? 9 : 11 }, maxRotation: isMobile ? 60 : 0, minRotation: isMobile ? 45 : 0 }
      }
    },
    animation: { duration: 800, easing: 'easeInOutQuart' }
  };

  const doughnutOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { boxWidth: isMobile ? 10 : 12, padding: isMobile ? 8 : 10, font: { size: isMobile ? 10 : 12 } } },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)', titleColor: '#fff', bodyColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)', borderWidth: 1, padding: isMobile ? 8 : 10,
        callbacks: {
            label: function(context) {
                let label = context.label || '';
                if (label) { label += ': '; }
                if (context.parsed !== null) {
                    label += context.parsed.toLocaleString('es-CO');
                    label += ' horas';
                }
                return label;
            }
        }
      }
    },
    cutout: isMobile ? '60%' : '70%',
    animation: { animateRotate: true, animateScale: true, duration: 1000 }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Panel de Control CCB - Propuesta Ejecución</h1>
        </div>

        <div className="dashboard-navigation">
          {programasPrincipales.map(prog => (
            <button
              key={prog.id}
              className={`nav-button ${selectedProgramaId === prog.id ? 'active' : ''}`}
              onClick={() => handleProgramaChange(prog.id)}
            >
              <span className="nav-icon">{prog.icon}</span>
              {isMobile && programasPrincipales.length > 4 ? '' : prog.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;