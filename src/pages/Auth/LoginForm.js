// src/pages/Auth/LoginForm.js
import React, { useState } from 'react';
// Importa useNavigate para poder redirigir al usuario programáticamente
import { useNavigate } from 'react-router-dom';
// Importa el hook useAuth para acceder al contexto de autenticación (especialmente la función login)
import { useAuth } from '../../context/AuthContext';
// Importa el componente para seleccionar el rol (las pestañas)
import RoleSelectorTabs from '../../components/RoleSelectorTabs';
// Importa los estilos CSS específicos para este formulario
// Asegúrate de que la ruta './LoginForm.css' sea correcta (el archivo CSS debe estar en la misma carpeta)
import './LoginForm.css';
// Importa los colores desde tu archivo de configuración de colores
import { colors } from '../../colors';

// Define el componente funcional LoginForm
function LoginForm() {
  // Estados para manejar los valores de los campos del formulario
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Estado para el checkbox "Recordar sesión"
  const [rememberMe, setRememberMe] = useState(false);
  // Estado para almacenar el rol seleccionado en las pestañas (inicialmente 'gestora')
  const [selectedRole, setSelectedRole] = useState('gestora');
  // Estado para manejar y mostrar mensajes de error del login
  const [error, setError] = useState(null);

  // Obtiene la función login del contexto de autenticación
  const { login } = useAuth();
  // Obtiene la función navigate para poder redirigir al usuario
  const navigate = useNavigate();


  // Función que se ejecuta cuando el usuario selecciona un rol en el componente RoleSelectorTabs
  const handleRoleSelect = (role) => {
    console.log('Rol seleccionado en pestañas:', role);
    // Actualiza el estado selectedRole con el rol que viene del componente de pestañas
    setSelectedRole(role);
    // Opcional: Puedes limpiar los campos de usuario y contraseña al cambiar de rol si lo deseas
    // setUsername('');
    // setPassword('');
    // Limpia cualquier mensaje de error anterior al cambiar de rol
    setError(null);
  };


  // Función que se ejecuta cuando se envía el formulario (al hacer clic en el botón "Iniciar Sesión")
  const handleSubmit = async (event) => {
    // Evita el comportamiento por defecto del navegador al enviar un formulario (que recargaría la página)
    event.preventDefault();
    // Limpia cualquier mensaje de error anterior
    setError(null);

    // --- Logs de depuración para rastrear la ejecución ---
    console.log('1. handleSubmit llamado.');
    console.log('2. Valores antes de llamar a login:', { username, password, selectedRole });
    // --- Fin de logs ---

    try {
      // Llama a la función login del contexto de autenticación
      // Le pasamos el usuario, la contraseña y el rol seleccionado en las pestañas
      const result = await login(username, password, selectedRole);

      // --- Log de depuración: Muestra el resultado de la función login ---
      console.log('3. Resultado de la llamada a login:', result);
      // --- Fin de log ---


      // Verifica si el resultado de la llamada a login indica éxito
      if (result.success) {
        console.log('4. Login exitoso detectado en LoginForm.');
        console.log(`Login exitoso como ${result.role}`);

        // --- Lógica de Redirección Directa usando navigate ---
        // Si el login fue exitoso, redirigimos al usuario a la ruta correspondiente a su rol.
        // Usamos el rol que nos devuelve la función login (result.role).
        switch (result.role) {
          case 'gestora':
            console.log('4a. Redirigiendo a /gestora');
            navigate('/gestora'); // Redirige a la ruta del dashboard de Gestora
            break;
          case 'consultor':
            console.log('4b. Redirigiendo a /consultor');
            navigate('/consultor'); // Redirige a la ruta del dashboard de Consultor
            break;
          case 'reclutador':
            console.log('4c. Redirigiendo a /reclutador');
            navigate('/reclutador'); // Redirige a la ruta del dashboard de Reclutador
            break;
          default:
            // Si el rol devuelto no coincide con ninguno esperado
            console.warn('4d. Rol desconocido devuelto por login:', result.role);
            // Opcional: redirigir a una página de error o al login de nuevo
            // navigate('/login');
            break;
        }
        // --- Fin de Lógica de Redirección Directa ---

      } else { // Si el resultado de la llamada a login indica fallo
        console.log('5. Login fallido detectado en LoginForm. Mostrando error.');
        // Muestra el mensaje de error que viene del contexto de autenticación
        setError(result.error || 'Error en el inicio de sesión.');
      }
    } catch (error) { // Captura cualquier error inesperado durante el proceso de submit/login
        console.error('6. Error inesperado durante handleSubmit:', error);
        // Muestra un mensaje de error genérico al usuario
        setError('Ocurrió un error inesperado.');
    }
  };

  // El componente renderiza el JSX que define la estructura del formulario de login
  return (
    <div className="login-container"> {/* Contenedor principal para centrar el formulario */}
      <div className="login-box"> {/* Caja blanca que contiene el formulario */}

        {/* Renderiza el componente para seleccionar el rol (las pestañas) */}
        {/* Le pasamos la función handleRoleSelect para que la llame cuando se selecciona un rol */}
        <RoleSelectorTabs onRoleSelect={handleRoleSelect} />

        {/* Título y subtítulo del formulario */}
        {/* Aplicamos el color 'secondary' al título desde colors.js */}
        <h1 className="system-title" style={{ color: colors.secondary }}>Sistema de Eventos</h1>
        <p className="subtitle">Ingresa con tus credenciales</p>

        {/* Formulario en sí. El onSubmit={handleSubmit} conecta el evento de envío del formulario con la función */}
        <form onSubmit={handleSubmit}>
          {/* Grupo para el campo de Usuario */}
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username" // El id debe coincidir con el htmlFor de la etiqueta label
              placeholder="Ingresa tu usuario"
              value={username} // El valor del input está controlado por el estado 'username'
              onChange={(e) => setUsername(e.target.value)} // Cuando cambia el input, actualiza el estado 'username'
              required // Hace que el campo sea obligatorio
            />
          </div>

          {/* Grupo para el campo de Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password" // Usa type="password" para ocultar la entrada
              id="password" // El id debe coincidir con el htmlFor de la etiqueta label
              placeholder="Ingresa tu contraseña"
              value={password} // El valor del input está controlado por el estado 'password'
              onChange={(e) => setPassword(e.target.value)} // Cuando cambia el input, actualiza el estado 'password'
              required // Hace que el campo sea obligatorio
            />
          </div>

          {/* Muestra el mensaje de error si el estado 'error' no es null */}
          {error && <p style={{ color: colors.primary, marginBottom: '15px' }}>{error}</p>}

          {/* Grupo para las opciones "Recordar sesión" y "¿Olvidaste tu contraseña?" */}
          <div className="options-group">
            {/* Checkbox para "Recordar sesión" */}
            <div className="remember-me">
              <input
                type="checkbox"
                id="rememberMe" // El id debe coincidir con el htmlFor de la etiqueta label
                checked={rememberMe} // El estado 'checked' está controlado por el estado 'rememberMe'
                onChange={(e) => setRememberMe(e.target.checked)} // Actualiza el estado 'rememberMe'
              />
              <label htmlFor="rememberMe">Recordar sesión</label>
            </div>
            {/* Enlace "¿Olvidaste tu contraseña?". Por ahora es un enlace '#' vacío. */}
            {/* Aplicamos el color 'primary' al enlace desde colors.js */}
            <a href="#" className="forgot-password" style={{ color: colors.primary }}>¿Olvidaste tu contraseña?</a>
          </div>

          {/* Botón para Iniciar Sesión */}
          {/* type="submit" es crucial para que dispare el evento onSubmit del formulario */}
          {/* Aplicamos el color de fondo 'primary' al botón desde colors.js */}
          <button type="submit" className="login-button" style={{ backgroundColor: colors.primary }}>
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
}

// Exporta el componente LoginForm como la exportación por defecto de este archivo
export default LoginForm;