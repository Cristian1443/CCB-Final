const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar configuración de base de datos
const { testConnection } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const consultoresRoutes = require('./routes/consultores');
const eventosRoutes = require('./routes/eventos');
const pagosRoutes = require('./routes/pagos');
const evidenciasRoutes = require('./routes/evidencias');
const vacantesRoutes = require('./routes/vacantes');
const programacionesRoutes = require('./routes/programaciones');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/consultores', consultoresRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/evidencias', evidenciasRoutes);
app.use('/api/vacantes', vacantesRoutes);
app.use('/api/programaciones', programacionesRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Servidor CCB funcionando correctamente',
    timestamp: new Date().toISOString(),
    status: 'OK'
  });
});

// Ruta para probar conexión a base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const isConnected = await testConnection();
    if (isConnected) {
      res.json({ 
        message: 'Conexión a MySQL exitosa',
        status: 'OK'
      });
    } else {
      res.status(500).json({ 
        message: 'Error conectando a MySQL',
        status: 'ERROR'
      });
    }
  } catch (error) {
    res.status(500).json({ 
      message: 'Error del servidor',
      error: error.message,
      status: 'ERROR'
    });
  }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
});

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('❌ No se pudo conectar a MySQL. Verifica la configuración.');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor iniciado en el puerto ${PORT}`);
      console.log(`📡 API disponible en: http://localhost:${PORT}/api`);
      console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🗄️  Test DB: http://localhost:${PORT}/api/test-db`);
    });
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer(); 