const express = require('express');
const { body, validationResult } = require('express-validator');
const { executeQuery } = require('../config/database');
const { authenticateToken, requireGestora, requireConsultorOrGestora } = require('../middleware/auth');

const router = express.Router();

// Helper function para determinar si una actividad es individual
const esActividadIndividual = (tipoActividad) => {
  const actividadesIndividuales = ['asesorias individuales', 'asesoria individual'];
  return actividadesIndividuales.some(tipo => 
    tipoActividad.toLowerCase().includes(tipo.toLowerCase())
  );
};

// GET /api/programaciones - Obtener programaciones
router.get('/', authenticateToken, requireConsultorOrGestora, async (req, res) => {
  try {
    const { tipo, limit = 10, offset = 0 } = req.query;

    let query, params = [];

    if (tipo === 'individual') {
      query = `
        SELECT 
          pi.*,
          a.act_tipo,
          ui.usu_nombre,
          ui.usu_apellido
        FROM programaciones_individuales pi
        LEFT JOIN actividades a ON pi.act_id = a.act_id
        LEFT JOIN usuarios_info ui ON pi.usu_cedula = ui.usu_cedula
        ORDER BY pi.proin_fecha_formacion DESC
        LIMIT ? OFFSET ?
      `;
      params = [parseInt(limit), parseInt(offset)];
    } else if (tipo === 'grupal') {
      query = `
        SELECT 
          pg.*,
          a.act_tipo,
          ui.usu_nombre,
          ui.usu_apellido
        FROM programaciones_grupales pg
        LEFT JOIN actividades a ON pg.act_id = a.act_id
        LEFT JOIN usuarios_info ui ON pg.usu_cedula = ui.usu_cedula
        ORDER BY pg.pro_fecha_formacion DESC
        LIMIT ? OFFSET ?
      `;
      params = [parseInt(limit), parseInt(offset)];
    } else {
      // Obtener ambas (unión)
      query = `
        (SELECT 
          'grupal' as tipo_programacion,
          pro_id as id,
          pro_tematica as tematica,
          pro_fecha_formacion as fecha_formacion,
          pro_hora_inicio as hora_inicio,
          pro_hora_fin as hora_fin,
          a.act_tipo,
          ui.usu_nombre,
          ui.usu_apellido,
          pro_estado as estado
        FROM programaciones_grupales pg
        LEFT JOIN actividades a ON pg.act_id = a.act_id
        LEFT JOIN usuarios_info ui ON pg.usu_cedula = ui.usu_cedula)
        UNION ALL
        (SELECT 
          'individual' as tipo_programacion,
          proin_id as id,
          proin_tematica as tematica,
          proin_fecha_formacion as fecha_formacion,
          proin_hora_inicio as hora_inicio,
          proin_hora_fin as hora_fin,
          a.act_tipo,
          ui.usu_nombre,
          ui.usu_apellido,
          proin_estado as estado
        FROM programaciones_individuales pi
        LEFT JOIN actividades a ON pi.act_id = a.act_id
        LEFT JOIN usuarios_info ui ON pi.usu_cedula = ui.usu_cedula)
        ORDER BY fecha_formacion DESC
        LIMIT ? OFFSET ?
      `;
      params = [parseInt(limit), parseInt(offset)];
    }

    const result = await executeQuery(query, params);

    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener programaciones',
        error: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: { programaciones: result.data }
    });

  } catch (error) {
    console.error('Error al obtener programaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/programaciones - Crear nueva programación
router.post('/', [
  body('usu_cedula').isInt().withMessage('Cédula del usuario es requerida'),
  body('act_id').isInt().withMessage('ID de actividad es requerido'),
  body('pro_tematica').notEmpty().withMessage('Temática es requerida'),
  body('pro_fecha_formacion').isDate().withMessage('Fecha de formación inválida'),
  body('pro_hora_inicio').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de inicio inválida'),
  body('pro_hora_fin').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora de fin inválida')
], authenticateToken, requireGestora, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        errors: errors.array()
      });
    }

    const { act_id, ...datosPrograma } = req.body;

    // Obtener el tipo de actividad para determinar qué tabla usar
    const actividadResult = await executeQuery(
      'SELECT act_tipo FROM actividades WHERE act_id = ?',
      [act_id]
    );

    if (!actividadResult.success || actividadResult.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Actividad no encontrada'
      });
    }

    const tipoActividad = actividadResult.data[0].act_tipo;
    const esIndividual = esActividadIndividual(tipoActividad);

    let insertResult;

    if (esIndividual) {
      // Insertar en programaciones_individuales
      const {
        usu_cedula, pr_id, val_reg_id, oamp, mod_id,
        proin_codigo_agenda, proin_tematica, proin_mes, proin_fecha_formacion,
        proin_hora_inicio, proin_hora_fin, proin_horas_dictar,
        proin_coordinador_ccb, proin_direccion, proin_enlace,
        proin_nombre_empresario, proin_identificacion_empresario,
        proin_estado, proin_numero_hora_pagar, proin_numero_hora_cobrar,
        proin_valor_hora, proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
        proin_entregables, proin_dependencia, proin_observaciones
      } = datosPrograma;

      insertResult = await executeQuery(`
        INSERT INTO programaciones_individuales (
          usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id,
          proin_codigo_agenda, proin_tematica, proin_mes, proin_fecha_formacion,
          proin_hora_inicio, proin_hora_fin, proin_horas_dictar,
          proin_coordinador_ccb, proin_direccion, proin_enlace,
          proin_nombre_empresario, proin_identificacion_empresario,
          proin_estado, proin_numero_hora_pagar, proin_numero_hora_cobrar,
          proin_valor_hora, proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
          proin_entregables, proin_dependencia, proin_observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id,
        proin_codigo_agenda, proin_tematica, proin_mes, proin_fecha_formacion,
        proin_hora_inicio, proin_hora_fin, proin_horas_dictar,
        proin_coordinador_ccb, proin_direccion, proin_enlace,
        proin_nombre_empresario, proin_identificacion_empresario,
        proin_estado, proin_numero_hora_pagar, proin_numero_hora_cobrar,
        proin_valor_hora, proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
        proin_entregables, proin_dependencia, proin_observaciones
      ]);

    } else {
      // Insertar en programaciones_grupales
      const {
        usu_cedula, pr_id, val_reg_id, oamp, mod_id,
        pro_codigo_agenda, pro_tematica, pro_mes, pro_fecha_formacion,
        pro_hora_inicio, pro_hora_fin, pro_horas_dictar,
        pro_coordinador_ccb, pro_direccion, pro_enlace,
        pro_estado, pro_numero_hora_pagar, pro_numero_hora_cobrar,
        pro_valor_hora, pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
        pro_entregables, pro_dependencia, pro_observaciones
      } = datosPrograma;

      insertResult = await executeQuery(`
        INSERT INTO programaciones_grupales (
          usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id,
          pro_codigo_agenda, pro_tematica, pro_mes, pro_fecha_formacion,
          pro_hora_inicio, pro_hora_fin, pro_horas_dictar,
          pro_coordinador_ccb, pro_direccion, pro_enlace,
          pro_estado, pro_numero_hora_pagar, pro_numero_hora_cobrar,
          pro_valor_hora, pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
          pro_entregables, pro_dependencia, pro_observaciones
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id,
        pro_codigo_agenda, pro_tematica, pro_mes, pro_fecha_formacion,
        pro_hora_inicio, pro_hora_fin, pro_horas_dictar,
        pro_coordinador_ccb, pro_direccion, pro_enlace,
        pro_estado, pro_numero_hora_pagar, pro_numero_hora_cobrar,
        pro_valor_hora, pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
        pro_entregables, pro_dependencia, pro_observaciones
      ]);
    }

    if (!insertResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear programación',
        error: 'DATABASE_ERROR'
      });
    }

    res.status(201).json({
      success: true,
      message: `Programación ${esIndividual ? 'individual' : 'grupal'} creada exitosamente`,
      data: {
        id: insertResult.data.insertId,
        tipo: esIndividual ? 'individual' : 'grupal',
        actividad: tipoActividad
      }
    });

  } catch (error) {
    console.error('Error al crear programación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 