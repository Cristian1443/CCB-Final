// src/pages/Gestora/Dashboard.js
import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import './Dashboard.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';

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

  // Datos específicos para cada sección
  const sectionData = {
    general: {
      stats: [
        { title: 'Total Horas', value: '13,895' },
        { title: 'Valor Total', value: '$2,861,523,576' },
        { title: 'Horas Ejecutadas', value: '113' }
      ],
      barData: {
        labels: ['Crecimiento', 'Innovación', 'Emprendimiento', 'Financiero', 'Alimentos'],
        datasets: [{
          label: 'Horas por Sector',
          data: [1310, 465, 1600, 818, 1508],
          backgroundColor: [
            'rgba(227, 25, 55, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
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
      }
    },
    crecimiento: {
      stats: [
        { title: 'Empresas Atendidas', value: '245' },
        { title: 'Horas Dedicadas', value: '1,310' },
        { title: 'Proyectos Activos', value: '28' }
      ],
      barData: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
        datasets: [{
          label: 'Empresas por Mes',
          data: [35, 42, 48, 40, 45, 35],
          backgroundColor: 'rgba(227, 25, 55, 0.8)',
          borderColor: 'rgba(227, 25, 55, 1)',
          borderWidth: 1,
        }]
      }
    },
    innovacion: {
      stats: [
        { title: 'Proyectos Innovadores', value: '156' },
        { title: 'Horas Innovación', value: '465' },
        { title: 'Patentes Registradas', value: '12' }
      ],
      barData: {
        labels: ['Tecnología', 'Procesos', 'Productos', 'Servicios'],
        datasets: [{
          label: 'Tipos de Innovación',
          data: [45, 32, 28, 51],
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }]
      }
    },
    emprendimiento: {
      stats: [
        { title: 'Startups Apoyadas', value: '89' },
        { title: 'Horas Mentoría', value: '1,600' },
        { title: 'Fondos Levantados', value: '$850M' }
      ],
      barData: {
        labels: ['Seed', 'Early', 'Growth', 'Scale'],
        datasets: [{
          label: 'Etapas de Emprendimiento',
          data: [34, 28, 15, 12],
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1,
        }]
      }
    },
    financiero: {
      stats: [
        { title: 'Empresas Financiadas', value: '67' },
        { title: 'Horas Consultoría', value: '818' },
        { title: 'Monto Total', value: '$1,200M' }
      ],
      barData: {
        labels: ['Crédito', 'Capital', 'Grants', 'Otros'],
        datasets: [{
          label: 'Tipos de Financiamiento',
          data: [450, 320, 180, 250],
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        }]
      }
    },
    alimentos: {
      stats: [
        { title: 'Empresas Sector', value: '134' },
        { title: 'Horas Sector', value: '1,508' },
        { title: 'Certificaciones', value: '45' }
      ],
      barData: {
        labels: ['Producción', 'Distribución', 'Retail', 'Exportación'],
        datasets: [{
          label: 'Cadena de Valor',
          data: [42, 38, 28, 26],
          backgroundColor: 'rgba(153, 102, 255, 0.8)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
        }]
      }
    }
  };

  const doughnutData = {
    labels: ['Horas Ejecutadas', 'Horas Pendientes'],
    datasets: [{
      data: [113, 13782],
      backgroundColor: [
        'rgba(227, 25, 55, 0.8)',
        'rgba(228, 228, 228, 0.8)',
      ],
      borderColor: [
        'rgba(227, 25, 55, 1)',
        'rgba(228, 228, 228, 1)',
      ],
      borderWidth: 1,
    }]
  };

  // Actualizar el estado de isMobile cuando cambia el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [selectedSection]);

  const handleSectionChange = (sectionId) => {
    setLoading(true);
    setSelectedSection(sectionId);
  };

  const renderSectionContent = () => {
    const currentSection = sectionData[selectedSection];

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
          <div className="chart-container">
            <h3>Análisis Principal</h3>
            <div className="chart-wrapper">
              <Bar 
                data={currentSection.barData} 
                options={chartOptions}
              />
            </div>
          </div>
          
          {selectedSection === 'general' && (
            <div className="chart-container">
              <h3>Progreso de Horas</h3>
              <div className="chart-wrapper">
                <Doughnut 
                  data={doughnutData}
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
              <strong>{new Date().toLocaleDateString()}</strong>
            </div>
            <div className="stat-item">
              <span>Estado</span>
              <strong className="status-active">Activo</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Ajustar las opciones de los gráficos según el dispositivo
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: isMobile ? 'bottom' : 'bottom',
        labels: {
          boxWidth: isMobile ? 8 : 12,
          padding: isMobile ? 10 : 15,
          font: {
            size: isMobile ? 10 : 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2C3E50',
        bodyColor: '#2C3E50',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: isMobile ? 8 : 10,
        bodyFont: {
          size: isMobile ? 11 : 12
        },
        titleFont: {
          size: isMobile ? 11 : 12,
          weight: 'bold'
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
            size: isMobile ? 10 : 11
          },
          maxTicksLimit: isMobile ? 4 : 5
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 11
          },
          maxRotation: isMobile ? 45 : 0,
          minRotation: isMobile ? 45 : 0
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: isMobile ? 8 : 12,
          padding: isMobile ? 10 : 15,
          font: {
            size: isMobile ? 10 : 11
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#2C3E50',
        bodyColor: '#2C3E50',
        borderColor: 'rgba(0,0,0,0.1)',
        borderWidth: 1,
        padding: isMobile ? 8 : 10
      }
    },
    cutout: isMobile ? '65%' : '70%'
  };

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Panel de Control CCB</h1>
        </div>

        <div className="dashboard-navigation">
          {sections.map(section => (
            <button
              key={section.id}
              className={`nav-button ${selectedSection === section.id ? 'active' : ''}`}
              onClick={() => handleSectionChange(section.id)}
            >
              <span className="nav-icon">{section.icon}</span>
              {isMobile ? section.icon : section.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Cargando datos...</p>
          </div>
        ) : (
          renderSectionContent()
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
