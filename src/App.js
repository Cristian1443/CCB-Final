import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

// Importaciones de Auth
import LoginForm from './pages/Auth/LoginForm';
import { AuthProvider, useAuth } from './context/AuthContext';

// Importaciones de páginas principales
import GestoraDashboard from './pages/Gestora/GestoraDashboard';
import ConsultorDashboard from './pages/Consultor/ConsultorDashboardPage';
import ReclutadorDashboard from './pages/Reclutador/ReclutadorDashboard';
import NotFound from './pages/NotFound';

// Importaciones de páginas de Gestora
import NuevaProgramacionPage from './pages/Gestora/NuevaProgramacionPage';
import EventListPage from './pages/Gestora/EventListPage';
import EditEventPage from './pages/Gestora/EditEventPage';
import GestoraConsultores from './pages/Gestora/GestoraConsultores';
import ConsultorFormPage from './pages/Gestora/ConsultorFormPage';
import EvidenceListPage from './pages/Gestora/EvidenceListPage';
import EvidenceFormPage from './pages/Gestora/EvidenceFormPage';

// Componente para rutas protegidas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) return <div className="loading-auth">Cargando autenticación...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Componente para redirección inicial
const HomeRedirect = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) return <div className="loading-auth">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (userRole) {
    case 'gestora':
      return <Navigate to="/gestora" replace />;
    case 'consultor':
      return <Navigate to="/consultor/dashboard" replace />;
    case 'reclutador':
      return <Navigate to="/reclutador" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

// Componente principal de la aplicación
const App = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          {/* Ruta pública de login */}
          <Route path="/login" element={<LoginForm />} />

          {/* Dashboard principales por rol */}
          <Route
            path="/gestora"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <GestoraDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/consultor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['consultor']}>
                <ConsultorDashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/reclutador"
            element={
              <ProtectedRoute allowedRoles={['reclutador']}>
                <ReclutadorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Gestión de programaciones y eventos */}
          <Route
            path="/gestora/nueva-programacion"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <NuevaProgramacionPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/nuevo-evento"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <NuevaProgramacionPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/eventos"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <EventListPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/eventos/editar/:eventId"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <EditEventPage />
              </ProtectedRoute>
            }
          />

          {/* Gestión de consultores */}
          <Route
            path="/gestora/consultores"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <GestoraConsultores />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/consultores/nuevo"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <ConsultorFormPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/consultores/editar/:consultorId"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <ConsultorFormPage />
              </ProtectedRoute>
            }
          />

          {/* Gestión de evidencias */}
          <Route
            path="/gestora/evidencias"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <EvidenceListPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/evidencias/nuevo"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <EvidenceFormPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/gestora/evidencias/editar/:evidenceId"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <EvidenceFormPage />
              </ProtectedRoute>
            }
          />

          {/* Ruta raíz */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Ruta para páginas no encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;