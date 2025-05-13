import React from 'react';
import { Link, useLocation } from 'react-router-dom';
// Ruta corregida para el CSS del sidebar
import '../styles/consultor-sidebar.css';
// Importa tu hook de autenticación si necesitas mostrar info del usuario o manejar logout aquí
// import { useAuth } from '../context/AuthContext';

const ConsultorSidebar = () => {
  const location = useLocation();
  // const { currentUser, logout } = useAuth(); // Ejemplo de uso del contexto

  // Enlaces de navegación para el consultor
  // Mantengamos los nombres en español para que sea intuitivo
  const navLinks = [
    { name: 'Calendario', path: '/consultor/dashboard' },
    // Puedes añadir más enlaces específicos para el consultor aquí
    // { name: 'Mi Perfil', path: '/consultor/perfil' },
  ];

  // Función para manejar el cierre de sesión (si tienes un botón en el sidebar)
  // const handleLogout = () => {
  //   logout(); // Llama a la función de logout de tu contexto
  // };

  return (
    <div className="consultor-sidebar">
      <div className="consultor-sidebar-header">
        {/* Logo o título de la aplicación/sección */}
        <h3>Consultor CCB</h3>
      </div>
      <nav className="consultor-sidebar-nav">
        <ul>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                 {/* Aquí puedes añadir iconos si lo deseas, ej: <i className="fas fa-calendar-alt"></i> */}
                {link.name}
              </Link>
            </li>
          ))}
          {/* Ejemplo de botón de cerrar sesión si lo pones en el sidebar */}
          {/* <li>
             <button onClick={handleLogout} className="sidebar-logout-button">
                Cerrar Sesión
             </button>
          </li> */}
        </ul>
      </nav>
      {/* Información adicional o pie de página del sidebar */}
      {/* <div className="consultor-sidebar-footer">
         <p>Usuario: {currentUser?.name || 'Consultor'}</p>
      </div> */}
    </div>
  );
};

export default ConsultorSidebar;
