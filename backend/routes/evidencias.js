const express = require('express');
const { executeQuery } = require('../config/database');
const { authenticateToken, requireConsultorOrGestora } = require('../middleware/auth');

const router = express.Router();

// GET /api/evidencias - Obtener evidencias
router.get('/', authenticateToken, requireConsultorOrGestora, async (req, res) => {
  try {
    const { evento_id, estado } = req.query;
    
    let whereClause = '1=1';
    let params = [];

    if (req.user.rol === 'consultor') {
      // Si es consultor, solo ver sus evidencias
      const consultorResult = await executeQuery(
        'SELECT id FROM consultores WHERE usuario_id = ?',
        [req.user.id]
      );
      
      if (consultorResult.success && consultorResult.data.length > 0) {
        whereClause += ' AND ev.consultor_id = ?';
        params.push(consultorResult.data[0].id);
      }
    }

    if (evento_id) {
      whereClause += ' AND ev.evento_id = ?';
      params.push(evento_id);
    }

    if (estado) {
      whereClause += ' AND ev.estado = ?';
      params.push(estado);
    }

    const result = await executeQuery(`
      SELECT 
        ev.*,
        e.titulo as evento_titulo,
        c.nombre as consultor_nombre,
        c.apellido as consultor_apellido
      FROM evidencias ev
      LEFT JOIN eventos e ON ev.evento_id = e.id
      LEFT JOIN consultores c ON ev.consultor_id = c.id
      WHERE ${whereClause}
      ORDER BY ev.fecha_subida DESC
    `, params);

    res.json({
      success: true,
      data: { evidencias: result.data }
    });

  } catch (error) {
    console.error('Error al obtener evidencias:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

module.exports = router; 