// src/components/DashboardLayout.js
import React from 'react';
// Importamos useAuth para obtener la información del usuario y la función logout
import { useAuth } from '../context/AuthContext';
// Importamos useNavigate para redirigir después del logout
import { useNavigate } from 'react-router-dom';
// Importamos los colores
import { colors } from '../colors';
import Sidebar from './Sidebar';
import './DashboardLayout.css';

function DashboardLayout({ children }) {
  // Obtenemos el usuario y la función logout del contexto de autenticación
  const { user, logout } = useAuth(); // Asumiendo que tu contexto AuthContext provee un objeto 'user'
  const navigate = useNavigate();

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige al usuario a la página de login después de cerrar sesión
  };

  // En una aplicación real, el objeto 'user' del contexto podría tener propiedades como 'name', 'email', etc.
  // Por ahora, usaremos un nombre ficticio o el userRole si no tenemos un nombre real.
  const userName = user ? user.name : 'Usuario'; // Intenta usar user.name si existe
  const userRoleDisplay = user ? (user.role === 'gestora' ? 'Gestora Administrativa' : user.role) : 'Rol Desconocido'; // Muestra el rol o un texto descriptivo

  return (
    <div className="dashboard-layout">
      {/* La barra lateral (Sidebar) */}
      <Sidebar />

      {/* El área de contenido principal */}
      <main className="dashboard-content">
        {/* ==================================================== */}
        {/* Encabezado del Dashboard con nombre y botón de logout */}
        {/* ==================================================== */}
        <header className="dashboard-header">
          <div className="user-info">
            {/* Muestra el nombre del usuario y su rol/descripción */}
            <span className="user-name">{userName}</span>
            <span className="user-role">{userRoleDisplay}</span>
             {/* Aquí podrías añadir un icono de avatar si tuvieras uno */}
             {/* <img src="/path/to/avatar.png" alt="Avatar" className="user-avatar" /> */}
          </div>
          {/* Botón de Cerrar Sesión */}
          <button className="logout-button" onClick={handleLogout} style={{ backgroundColor: colors.primary, color: 'white' }}>
            Cerrar Sesión
          </button>
        </header>
        {/* ==================================================== */}

        {/* El contenido específico de la página (Dashboard, Nueva Programación, etc.) se renderiza aquí */}
        <div className="page-content"> {/* Añadimos un contenedor para el contenido de la página */}
           {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;
