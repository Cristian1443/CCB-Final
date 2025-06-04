const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, requireGestora, requireConsultorOrGestora } = require('../middleware/auth');

const router = express.Router();

// GET /api/actividades - Obtener todas las actividades
router.get('/', authenticateToken, requireConsultorOrGestora, async (req, res) => {
  try {
    const result = await executeQuery(
      'SELECT act_id, act_tipo FROM actividades ORDER BY act_tipo'
    );

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener actividades',
        error: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: { actividades: result.data }
    });

  } catch (error) {
    console.error('Error al obtener actividades:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/actividades - Crear nueva actividad (solo gestora)
router.post('/', authenticateToken, requireGestora, async (req, res) => {
  try {
    const { act_tipo } = req.body;

    if (!act_tipo) {
      return res.status(400).json({
        success: false,
        message: 'El tipo de actividad es requerido'
      });
    }

    const insertResult = await executeQuery(
      'INSERT INTO actividades (act_tipo) VALUES (?)',
      [act_tipo]
    );

    if (!insertResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear actividad',
        error: 'DATABASE_ERROR'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Actividad creada exitosamente',
      data: {
        act_id: insertResult.data.insertId,
        act_tipo
      }
    });

  } catch (error) {
    console.error('Error al crear actividad:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 