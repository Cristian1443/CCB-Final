// src/pages/Gestora/Dashboard.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2'; // Line chart was not used in the original, keeping it simple

// Registrar los componentes necesarios de ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Helper function to format currency
const formatCurrency = (value) => {
  if (typeof value === 'string') {
    // Remove non-numeric characters except for comma and period for parsing
    const numericString = value.replace(/[$.-]/g, '').replace(',', '.');
    const number = parseFloat(numericString);
    if (isNaN(number)) return value; // Return original if parsing fails
    return `$${parseInt(number).toLocaleString('es-CO')}`; // Format as integer COP
  }
  if (typeof value === 'number') {
    return `$${value.toLocaleString('es-CO')}`;
  }
  return value; // Return as is if not string or number
};


function Dashboard() {
  const [selectedSection, setSelectedSection] = useState('general');
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const sections = [
    { id: 'general', name: 'Vista General', icon: '📊' },
    { id: 'crecimiento', name: 'Crecimiento Empresarial', icon: '📈' },
    { id: 'innovacion', name: 'Innovación', icon: '💡' },
    { id: 'emprendimiento', name: 'Emprendimiento', icon: '🚀' },
    { id: 'financiero', name: 'Financiero y Productividad', icon: '💰' },
    { id: 'alimentos', name: 'Sector Alimentos', icon: '🍽️' }
  ];

  // Datos actualizados basados en el PDF
  const sectionData = {
    general: {
      stats: [
        { title: 'Total Horas Programa', value: '13,895' }, // [cite: 2]
        { title: 'Valor Total Programa', value: formatCurrency('2691023510') }, // [cite: 2]
        { title: 'Horas Ejecutadas (Abril 2025)', value: '113' } // [cite: 2]
      ],
      barData: {
        labels: ['Crecimiento E.', 'Innovación', 'Emprendimiento', 'Financiero & Prod.', 'Alimentos'],
        datasets: [{
          label: 'Horas por Sector/Programa Principal',
          data: [1310, 480, 1000, 364, 1908], // [cite: 2]
          backgroundColor: [
            'rgba(227, 25, 55, 0.8)',  // Crecimiento
            'rgba(54, 162, 235, 0.8)', // Innovación
            'rgba(255, 206, 86, 0.8)', // Emprendimiento
            'rgba(75, 192, 192, 0.8)', // Financiero
            'rgba(153, 102, 255, 0.8)',// Alimentos
          ],
          borderColor: [
            'rgba(227, 25, 55, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }]
      },
      doughnutData: { // Added for 'general' section
        labels: ['Horas Ejecutadas (Abril 2025)', 'Horas Pendientes'],
        datasets: [{
          data: [113, 13895 - 113], // 113 ejecutadas, 13782 pendientes [cite: 2]
          backgroundColor: [
            'rgba(227, 25, 55, 0.8)', // Rojo para ejecutadas
            'rgba(228, 228, 228, 0.8)', // Gris para pendientes
          ],
          borderColor: [
            'rgba(227, 25, 55, 1)',
            'rgba(200, 200, 200, 1)',
          ],
          borderWidth: 1,
        }]
      }
    },
    crecimiento: {
      stats: [
        { title: 'Total Horas Asignadas', value: '1,310' }, // [cite: 2]
        { title: 'Valor Total Estimado', value: formatCurrency('230080540') }, // [cite: 2]
        { title: 'Nº Consultores', value: '10' } // [cite: 2]
      ],
      barData: {
        labels: ['Ejecutadas (Abril 2025)', 'Pendientes (del total)'],
        datasets: [{
          label: 'Progreso Horas Crecimiento Empresarial',
          data: [10, 1310 - 10], // 10 ejecutadas en Abril [cite: 2]
          backgroundColor: ['rgba(227, 25, 55, 0.8)', 'rgba(227, 25, 55, 0.3)'],
          borderColor: 'rgba(227, 25, 55, 1)',
          borderWidth: 1,
        }]
      }
    },
    innovacion: { // RUTA: INNOVACION
      stats: [
        { title: 'Total Horas Asignadas', value: '480' }, // [cite: 2]
        { title: 'Valor Total Estimado', value: formatCurrency('102880200') }, // [cite: 2]
        { title: 'Nº Consultores (Grupo Empr.)', value: '10' } // [cite: 2]
      ],
      barData: {
        labels: ['Total Horas Asignadas Innovación'],
        datasets: [{
          label: 'Horas Innovación',
          data: [480], // [cite: 2]
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }]
      }
    },
    emprendimiento: { // RUTA: EMPRENDIMIENTO
      stats: [
        { title: 'Total Horas Asignadas', value: '1,000' }, // [cite: 2]
        { title: 'Valor Total Estimado', value: formatCurrency('281014400') }, // [cite: 2]
        { title: 'Nº Consultores (Grupo Empr.)', value: '10' } // [cite: 2]
      ],
      barData: {
        labels: ['Total Horas Asignadas Emprendimiento'],
        datasets: [{
          label: 'Horas Emprendimiento',
          data: [1000], // [cite: 2]
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        }]
      }
    },
    financiero: { // RUTA: FINANCIERO Y PRODUCTIVIDAD
      stats: [
        { title: 'Total Horas Asignadas', value: '364' }, // [cite: 2]
        { title: 'Valor Total Estimado', value: formatCurrency('63930770') }, // [cite: 2]
        { title: 'Nº Consultores', value: '2' } // [cite: 2]
      ],
      barData: {
        labels: ["Productividad", "Gestión Financiera", "Tributario/Financiero"],
        datasets: [{
          label: 'Distribución Horas (aprox.)',
          data: [121, 121, 122], // Aproximación de 364h
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      }
    },
    alimentos: { // PROGRAMA: SECTOR ALIMENTOS
      stats: [
        { title: 'Total Horas Programa', value: '1,908' }, // [cite: 2]
        { title: 'Valor Total Estimado', value: formatCurrency('335109672') }, // [cite: 2]
        { title: 'Nº Consultores (Subáreas)', value: '5+' } // 3 (IA) + 2 (Talento Humano) [cite: 2]
      ],
      barData: {
        labels: ["Aplicación IA (Alim.)", "Talento Humano (Alim.)"],
        datasets: [{
          label: 'Horas por Sub-Programa (Sector Alimentos)',
          data: [336, 336], // [cite: 2]
          backgroundColor: ['rgba(153, 102, 255, 0.8)', 'rgba(255, 159, 64, 0.8)'],
          borderColor: ['rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
          borderWidth: 1,
        }]
      }
    }
  };


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setLoading(true); // Iniciar carga al cambiar de sección
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Simular un pequeño retraso para la carga de datos
    return () => clearTimeout(timer);
  }, [selectedSection]);

  const handleSectionChange = (sectionId) => {
    setSelectedSection(sectionId);
  };

  const renderSectionContent = () => {
    const currentSection = sectionData[selectedSection];
    if (!currentSection) return <p>Selecciona una sección.</p>;


    return (
      <div className="section-content">
        <div className="dashboard-stats">
          {currentSection.stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h3>{stat.title}</h3>
              <p>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="charts-grid">
          {currentSection.barData && (
            <div className="chart-container">
              <h3>{currentSection.barData.datasets[0].label || 'Análisis Principal'}</h3>
              <div className="chart-wrapper">
                <Bar
                  data={currentSection.barData}
                  options={chartOptions}
                />
              </div>
            </div>
          )}
          
          {selectedSection === 'general' && currentSection.doughnutData && (
            <div className="chart-container">
              <h3>Progreso General de Horas</h3>
              <div className="chart-wrapper">
                <Doughnut
                  data={currentSection.doughnutData}
                  options={doughnutOptions}
                />
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
              <span>Estado del Programa</span>
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
        labels: {
          boxWidth: isMobile ? 10 : 12,
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: isMobile ? 8 : 10,
        bodyFont: {
          size: isMobile ? 11 : 12
        },
        titleFont: {
          size: isMobile ? 12 : 13,
          weight: 'bold'
        },
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    // Formatear como número con separadores de miles
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
        beginAtZero: true,
        grid: {
          drawBorder: false,
          color: 'rgba(0,0,0,0.05)'
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11
          },
          maxTicksLimit: isMobile ? 5 : 6,
           callback: function(value) {
            return value.toLocaleString('es-CO'); // Formato con separador de miles
          }
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: isMobile ? 9 : 11
          },
          maxRotation: isMobile ? 60 : 0,
          minRotation: isMobile ? 45 : 0
        }
      }
    },
    animation: {
        duration: 800,
        easing: 'easeInOutQuart'
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: isMobile ? 10 : 12,
          padding: isMobile ? 8 : 10,
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: isMobile ? 8 : 10,
        callbacks: {
            label: function(context) {
                let label = context.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed !== null) {
                     // Formatear como número con separadores de miles
                    label += context.parsed.toLocaleString('es-CO');
                    label += ' horas';
                }
                return label;
            }
        }
      }
    },
    cutout: isMobile ? '60%' : '70%',
    animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000
    }
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Panel de Control CCB - Propuesta Ejecución</h1>
        </div>

        <div className="dashboard-navigation">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-button ${selectedSection === section.id ? 'active' : ''}`}
              onClick={() => handleSectionChange(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              {isMobile && sections.length > 4 ? '' : section.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Cargando datos de la sección...</p>
          </div>
        ) : (
          renderSectionContent()
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;