// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Creamos el Contexto de Autenticación
const AuthContext = createContext(null);

// Componente Proveedor de Autenticación
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Efecto para verificar la sesión al cargar la aplicación
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('authToken');
      const role = localStorage.getItem('userRole');

      if (token && role) {
        // En una aplicación real, aquí validarías el token con el backend
        setIsAuthenticated(true);
        setUserRole(role);
        
        // Redirige al dashboard correspondiente si está en una ruta pública
        if (window.location.pathname === '/login') {
          navigate(`/${role}`);
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, [navigate]);

  // Función para manejar el inicio de sesión
  const login = async (username, password, selectedRole) => {
    setLoading(true);
    setUserRole(null);
    
    try {
      // SIMULACIÓN DE API - EN PRODUCCIÓN REEMPLAZAR CON LLAMADA REAL
      const validUsers = {
        'testgestora': { password: 'password', role: 'gestora' },
        'testconsultor': { password: 'password', role: 'consultor' },
        'testreclutador': { password: 'password', role: 'reclutador' }
      };

      const user = validUsers[username];

      if (user && user.password === password) {
        // Simulamos respuesta de API exitosa
        const token = `fake-token-${username}-${Date.now()}`;
        const role = selectedRole; // En producción, el rol debe venir del backend

        // Guardamos en localStorage
        localStorage.setItem('authToken', token);
        localStorage.setItem('userRole', role);

        // Actualizamos estado
        setIsAuthenticated(true);
        setUserRole(role);
        setLoading(false);

        // Redirigimos según el rol
        switch (role) {
          case 'consultor':
            navigate('/consultor');
            break;
          case 'gestora':
            navigate('/gestora');
            break;
          case 'reclutador':
            navigate('/reclutador');
            break;
          default:
            navigate('/');
        }

        return { success: true, role };
      }

      throw new Error('Credenciales incorrectas');
    } catch (error) {
      // Limpiamos el estado ante un error
      setIsAuthenticated(false);
      setUserRole(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      setLoading(false);
      
      return { 
        success: false, 
        error: error.message || 'Error durante el inicio de sesión' 
      };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  // Valor que proveerá el contexto
  const contextValue = {
    isAuthenticated,
    userRole,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {/* Solo renderiza children cuando haya terminado de verificar la autenticación */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};