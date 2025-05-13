// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
// Aquí importarías tus funciones reales para llamar a tu API de backend
// Por ejemplo: import { loginUserApi, logoutUserApi } from '../utils/api';

// Creamos el Contexto de Autenticación
const AuthContext = createContext(null);

// Componente Proveedor de Autenticación
// Este componente envolverá a tu aplicación (o a las partes que necesiten autenticación)
export const AuthProvider = ({ children }) => {
  // Estados para manejar si el usuario está autenticado, su rol y si se está cargando la autenticación inicial
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial al verificar la sesión

  // useEffect para verificar el estado de autenticación al montar el componente (cuando carga la app)
  useEffect(() => {
    console.log('AuthContext useEffect: Verificando sesión en localStorage...');
    // En una aplicación real, aquí verificarías si hay un token válido
    // y podrías hacer una llamada a una API para validar que el token no ha expirado
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token && role) {
      // Si encontramos token y rol, asumimos que está autenticado (en esta simulación)
      console.log('AuthContext useEffect: Token y rol encontrados en localStorage.', { token, role });
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      console.log('AuthContext useEffect: No se encontraron token o rol en localStorage.');
    }
    // Una vez terminada la verificación inicial, ponemos loading en false
    setLoading(false);
    console.log('AuthContext useEffect: Verificación inicial completa. loading = false.');
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  // Función para manejar el inicio de sesión
  // Recibe el nombre de usuario, la contraseña y el rol seleccionado desde el formulario
  const login = async (username, password, selectedRole) => {
    console.log('A. Entrando a la función login en AuthContext...');
    console.log('B. Credenciales recibidas en login:', { username, password, selectedRole });
    setLoading(true); // Indicamos que el proceso de login está cargando

    try {
      // --- INICIO DE SIMULACIÓN DE LOGIN ---
      // ** Aquí integrarías tu llamada REAL a la API de backend **
      // await loginUserApi(username, password); // Llama a tu API
      // La API te respondería con un token y el ROL VERDADERO del usuario validado.
      // No confíes en 'selectedRole' del frontend para decidir el acceso en una app real.

      // Simulación: Usuarios válidos y sus roles (aquí usamos el nombre de usuario para simular el rol)
      const validUsers = {
        'testgestora': 'password', // Usuario ficticio para gestora
        'testconsultor': 'password', // Usuario ficticio para consultor
        'testreclutador': 'password', // Usuario ficticio para reclutador
      };

      if (validUsers[username] === password) { // Si las credenciales coinciden con un usuario simulado
         console.log('C. Credenciales de simulación válidas.');
         // En la simulación, asumimos que el rol seleccionado es el correcto para este usuario ficticio.
         // En una app real, usarías el rol DE VUELTA DEL BACKEND.
         const token = 'fake-token-de-' + username; // Token ficticio basado en el usuario
         const role = selectedRole; // Usamos el rol seleccionado para la simulación de redirección

         // Intentamos guardar el token y el rol en localStorage
         try {
            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', role);
             console.log('C0. Datos guardados en localStorage.');
         } catch (e) {
             console.error('C0. ERROR al guardar en localStorage:', e);
             // Aunque la simulación fue exitosa, falló el guardado.
             // Podrías manejar este error informando al usuario o retornando failure.
             setLoading(false);
             return { success: false, error: 'No se pudo guardar la sesión. Local Storage lleno.' };
         }


         // Actualizamos el estado del contexto
         console.log('C1. Intentando actualizar estado en AuthContext: isAuthenticated a true, userRole a', role);
         setIsAuthenticated(true);
         setUserRole(role);
         console.log('C2. Estado en AuthContext actualizado (debería triggerear re-render).');


         setLoading(false); // Terminó el proceso de login
         console.log('D. Simulación de login exitoso. Devolviendo:', { success: true, role });
         return { success: true, role }; // Retornamos éxito y el rol (el seleccionado en la simulación)

      } else { // Si las credenciales NO coinciden
        console.log('E. Credenciales de simulación NO válidas.');
        setLoading(false); // Terminó el proceso de login con error
        return { success: false, error: 'Credenciales incorrectas' }; // Retornamos fallo
      }
      // --- FIN DE SIMULACIÓN DE LOGIN ---

    } catch (error) { // Capturamos cualquier error durante el proceso (ej: falla la llamada a la API real)
      console.error("F. Error inesperado durante la función login:", error);
      setLoading(false); // Terminó el proceso de login con error
      // Retornamos fallo con el mensaje de error
      return { success: false, error: error.message || 'Error interno del login' };
    }
  };

  // Función para manejar el cierre de sesión
  const logout = () => {
    console.log('AuthContext: Iniciando cierre de sesión...');
    // Eliminamos la información del localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    console.log('AuthContext: Eliminados datos de localStorage.');
    // Reseteamos el estado del contexto
    setIsAuthenticated(false);
    setUserRole(null);
    console.log('AuthContext: Estado de autenticación reseteado.');
    // Opcional: Redirigir al usuario a la página de login después del logout
    // navigate('/login'); // Necesitarías obtener navigate aquí o manejar la redirección en otro lado
  };

  // El proveedor expone el estado y las funciones a los componentes hijos
  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loading, login, logout }}>
      {/* Renderizamos los hijos solo cuando la verificación inicial ha terminado (loading es false)
          Esto evita renderizar la UI de la app antes de saber si el usuario ya estaba loggeado. */}
      {!loading && children}
      {/* Opcional: Mostrar un indicador de carga global mientras loading es true */}
      {loading && <div>Cargando autenticación inicial...</div>}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar el acceso al contexto de autenticación
// Los componentes lo usan para obtener el estado y las funciones de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  // Si el hook se usa fuera de un AuthProvider, lanzamos un error
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};