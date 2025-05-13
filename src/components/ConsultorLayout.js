import React from 'react';
import ConsultorSidebar from './ConsultorSidebar'; // Importar el sidebar específico del consultor
// Ruta corregida para el CSS del layout
import '../styles/consultor-layout.css';

const ConsultorLayout = ({ children }) => {
  return (
    <div className="consultor-layout-container">
      <ConsultorSidebar /> {/* Sidebar específico */}
      <main className="consultor-content-area">
        {/* Aquí se renderizará el contenido de la página (ej: ConsultorDashboardPage) */}
        {children}
      </main>
    </div>
  );
};

export default ConsultorLayout;
