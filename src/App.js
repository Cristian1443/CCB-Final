import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Contexto de autenticación
import { AuthProvider, useAuth } from './context/AuthContext';

// Páginas de autenticación
import LoginForm from './pages/Auth/LoginForm';

// Dashboards por rol
import GestoraDashboard from './pages/Gestora/GestoraDashboard';
import Dashboard from './pages/Gestora/Dashboard';
import ConsultorDashboard from './pages/Consultor/ConsultorDashboardPage';
import ReclutadorDashboard from './pages/Reclutador/ReclutadorDashboard';
import NotFound from './pages/NotFound';

// Páginas de Gestora
import NuevaProgramacionPage from './pages/Gestora/NuevaProgramacionPage';
import EventListPage from './pages/Gestora/EventListPage';
import EditEventPage from './pages/Gestora/EditEventPage';
import GestoraConsultores from './pages/Gestora/GestoraConsultores';
import ConsultorFormPage from './pages/Gestora/ConsultorFormPage';
import EvidenceListPage from './pages/Gestora/EvidenceListPage';
import EvidenceFormPage from './pages/Gestora/EvidenceFormPage';

// Páginas del Consultor
import ConsultorEventListPage from './pages/Consultor/ConsultorEventListPage';
import ConsultorEventDetailPage from './pages/Consultor/ConsultorEventDetailPage';

// Componente de protección de rutas
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) return <div className="loading-auth">Cargando autenticación...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(userRole)) return <Navigate to="/" replace />;

  return children;
};

// Redirección inicial según el rol
const HomeRedirect = () => {
  const { isAuthenticated, userRole, loading } = useAuth();

  if (loading) return <div className="loading-auth">Cargando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  switch (userRole) {
    case 'gestora':
      return <Navigate to="/gestora" replace />;
    case 'consultor':
      return <Navigate to="/consultor" replace />;
    case 'reclutador':
      return <Navigate to="/reclutador" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
};

const App = () => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Routes>
          {/* Ruta pública */}
          <Route path="/login" element={<LoginForm />} />

          {/* Dashboards por rol */}
          <Route
            path="/gestora"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <GestoraDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultor"
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

          {/* Gestora - Gestión de eventos */}
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

          {/* Gestora - Gestión de consultores */}
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

          {/* Gestora - Gestión de evidencias */}
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
          <Route
            path="/gestora/dashboard"
            element={
              <ProtectedRoute allowedRoles={['gestora']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Consultor - Eventos */}
          <Route
            path="/consultor/dashboard"
            element={
              <ProtectedRoute allowedRoles={['consultor']}>
                <ConsultorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultor/events"
            element={
              <ProtectedRoute allowedRoles={['consultor']}>
                <ConsultorEventListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultor/events/:eventId"
            element={
              <ProtectedRoute allowedRoles={['consultor']}>
                <ConsultorEventDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Redirección raíz */}
          <Route path="/" element={<HomeRedirect />} />

          {/* Página no encontrada */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </AuthProvider>
  );
};

export default App;
