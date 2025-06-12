const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/usuarios/:id - Obtener información completa de un usuario
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const userId = req.params.id;
    console.log('🔍 Buscando información del usuario:', userId);

    // Verificar que el usuario solicitado coincida con el usuario autenticado o sea un administrador
    if (req.user.id !== parseInt(userId) && req.user.rol !== 'gestora') {
      console.log('❌ Acceso denegado. Usuario autenticado:', req.user);
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para acceder a esta información',
        error: 'FORBIDDEN'
      });
    }

    // Obtener información completa del usuario
    const result = await executeQuery(`
      SELECT 
        u.usu_id,
        u.usu_correo,
        u.usu_tipo,
        u.usu_activo,
        u.usu_fecha_registro,
        ui.usu_cedula,
        ui.usu_primer_nombre,
        ui.usu_segundo_nombre,
        ui.usu_primer_apellido,
        ui.usu_segundo_apellido,
        ui.usu_telefono,
        ui.usu_direccion,
        ui.are_id,
        ac.are_descripcion
      FROM cuentas u
      JOIN usuarios_info ui ON u.usu_id = ui.usu_id
      LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
      WHERE u.usu_id = ?
    `, [userId]);

    console.log('📋 Resultado de la consulta:', result);

    if (!result.success || result.data.length === 0) {
      console.log('❌ Usuario no encontrado');
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado',
        error: 'NOT_FOUND'
      });
    }

    // Formatear el nombre completo
    const userData = result.data[0];
    const nombreCompleto = [
      userData.usu_primer_nombre,
      userData.usu_segundo_nombre,
      userData.usu_primer_apellido,
      userData.usu_segundo_apellido
    ].filter(Boolean).join(' ');

    const response = {
      success: true,
      data: {
        ...userData,
        nombre_completo: nombreCompleto
      }
    };

    console.log('✅ Respuesta exitosa:', response);
    res.json(response);

  } catch (error) {
    console.error('❌ Error obteniendo información del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message || 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 