const express = require('express');
const { body, validationResult, param } = require('express-validator');
const { executeQuery } = require('../config/database');
const { authenticateToken, requireGestora, requireConsultorOrGestora } = require('../middleware/auth');

const router = express.Router();

// GET /api/programaciones/actividades - Obtener tipos de actividades
router.get('/actividades', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM actividades ORDER BY act_id');
    
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

// GET /api/programaciones/modalidades - Obtener modalidades
router.get('/modalidades', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery('SELECT * FROM modalidades ORDER BY mod_id');
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener modalidades',
        error: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: { modalidades: result.data }
    });

  } catch (error) {
    console.error('Error al obtener modalidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/programa-rutas - Obtener programas con sus rutas
router.get('/programa-rutas', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        p.prog_id,
        p.prog_nombre,
        p.prog_total_horas,
        r.rut_id,
        r.rut_nombre,
        r.rut_descripcion,
        r.rut_total_horas,
        pr.pr_id
      FROM programas p
      JOIN programa_ruta pr ON p.prog_id = pr.prog_id
      JOIN rutas r ON pr.rut_id = r.rut_id
      ORDER BY p.prog_nombre, r.rut_nombre
    `);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener programa-rutas',
        error: 'DATABASE_ERROR'
      });
    }

    // Organizar datos por programa
    const programaRutasMap = {};
    result.data.forEach(row => {
      if (!programaRutasMap[row.prog_id]) {
        programaRutasMap[row.prog_id] = {
          prog_id: row.prog_id,
          prog_nombre: row.prog_nombre,
          prog_total_horas: row.prog_total_horas,
          rutas: []
        };
      }
      
      programaRutasMap[row.prog_id].rutas.push({
        pr_id: row.pr_id,
        rut_id: row.rut_id,
        rut_nombre: row.rut_nombre,
        rut_descripcion: row.rut_descripcion,
        rut_total_horas: row.rut_total_horas
      });
    });

    res.json({
      success: true,
      data: { programas: Object.values(programaRutasMap) }
    });

  } catch (error) {
    console.error('Error al obtener programa-rutas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/regiones - Obtener regiones con valores
router.get('/regiones', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        r.reg_id,
        vhr.val_reg_id,
        vhr.val_reg_hora_base,
        vhr.val_reg_traslado,
        vhr.val_reg_sin_dictar,
        vhr.val_reg_dos_horas,
        vhr.val_reg_tres_horas,
        vhr.val_reg_cuatro_mas_horas
      FROM regiones r
      JOIN valor_horas_region vhr ON r.reg_id = vhr.reg_id
      ORDER BY r.reg_id
    `);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener regiones',
        error: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: { regiones: result.data }
    });

  } catch (error) {
    console.error('Error al obtener regiones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/municipios/:regionId - Obtener municipios por región
router.get('/municipios/:regionId', authenticateToken, async (req, res) => {
  try {
    const { regionId } = req.params;
    
    const result = await executeQuery(
      'SELECT * FROM municipios WHERE reg_id = ? ORDER BY mun_nombre',
      [regionId]
    );
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener municipios',
        error: 'DATABASE_ERROR'
      });
    }

    res.json({
      success: true,
      data: { municipios: result.data }
    });

  } catch (error) {
    console.error('Error al obtener municipios:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/contratos - Obtener contratos disponibles
router.get('/contratos', authenticateToken, async (req, res) => {
  try {
    const result = await executeQuery(`
      SELECT 
        c.oamp,
        c.oamp_valor_total,
        c.oamp_fecha_generacion,
        ui.usu_cedula,
        ui.are_id,
        ui.usu_primer_nombre,
        ui.usu_segundo_nombre,
        ui.usu_primer_apellido,
        ui.usu_segundo_apellido,
        ui.usu_telefono,
        ui.usu_direccion,
        ac.are_descripcion
      FROM contratos c
      JOIN usuarios_info ui ON c.usu_cedula = ui.usu_cedula
      LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
      WHERE c.oamp_estado = 'Enviado'
      ORDER BY c.oamp_fecha_generacion DESC
    `);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener contratos',
        error: 'DATABASE_ERROR'
      });
    }

    // Debug: Mostrar los datos en consola para verificar
    console.log('📋 Datos de contratos obtenidos:', JSON.stringify(result.data, null, 2));

    res.json({
      success: true,
      data: { contratos: result.data }
    });

  } catch (error) {
    console.error('Error al obtener contratos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/debug-consultor/:cedula - Debug información específica de consultor
router.get('/debug-consultor/:cedula', authenticateToken, async (req, res) => {
  try {
    const { cedula } = req.params;
    
    const result = await executeQuery(`
      SELECT 
        ui.*,
        ac.are_descripcion,
        c.usu_correo,
        c.usu_tipo
      FROM usuarios_info ui
      LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
      LEFT JOIN cuentas c ON ui.usu_id = c.usu_id
      WHERE ui.usu_cedula = ?
    `, [cedula]);
    
    if (!result.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener información del consultor',
        error: 'DATABASE_ERROR'
      });
    }

    console.log(`🔍 Debug consultor ${cedula}:`, JSON.stringify(result.data, null, 2));

    res.json({
      success: true,
      data: { consultor: result.data[0] || null }
    });

  } catch (error) {
    console.error('Error en debug consultor:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/calcular-valores - Calcular valores de una ruta específica
router.get('/calcular-valores', authenticateToken, async (req, res) => {
  try {
    const { pr_id, val_reg_id, mod_id, horas_dictar } = req.query;

    // Validar parámetros requeridos
    if (!pr_id || !horas_dictar) {
      return res.status(400).json({
        success: false,
        message: 'pr_id y horas_dictar son requeridos'
      });
    }

    let valorHora = 0;
    let horasPagar = parseInt(horas_dictar);
    let horasCobrar = parseInt(horas_dictar);

    // Si hay región específica, usar los valores de valor_horas_region
    if (val_reg_id && val_reg_id !== 'null' && val_reg_id !== '') {
      const regionQuery = await executeQuery(`
        SELECT 
          val_reg_hora_base,
          val_reg_traslado,
          val_reg_sin_dictar,
          val_reg_dos_horas,
          val_reg_tres_horas,
          val_reg_cuatro_mas_horas
        FROM valor_horas_region
        WHERE val_reg_id = ?
      `, [val_reg_id]);

      if (regionQuery.success && regionQuery.data.length > 0) {
        const valores = regionQuery.data[0];
        
        // Determinar valor según las horas a dictar
        if (horasPagar === 0) {
          valorHora = valores.val_reg_sin_dictar;
        } else if (horasPagar === 2) {
          valorHora = valores.val_reg_dos_horas;
        } else if (horasPagar === 3) {
          valorHora = valores.val_reg_tres_horas;
        } else if (horasPagar >= 4) {
          valorHora = valores.val_reg_cuatro_mas_horas;
        } else {
          valorHora = valores.val_reg_hora_base;
        }

        // Agregar traslado para actividades presenciales
        if (mod_id) {
          const modalidadQuery = await executeQuery(`
            SELECT val_hor_clasificacion
            FROM valor_horas vh
            JOIN modalidades m ON vh.mod_id = m.mod_id
            WHERE m.mod_id = ?
          `, [mod_id]);

          if (modalidadQuery.success && modalidadQuery.data.length > 0) {
            const clasificacion = modalidadQuery.data[0].val_hor_clasificacion;
            if (clasificacion && clasificacion.toLowerCase().includes('presencial')) {
              valorHora += valores.val_reg_traslado;
            }
          }
        }
      }
    } else {
      // Si no hay región específica, usar valor_horas general
      const rutaQuery = await executeQuery(`
        SELECT vh.val_hor_precio, vh.val_hor_clasificacion
        FROM valor_horas vh
        JOIN rutas r ON vh.val_hor_id = r.val_hor_id
        JOIN programa_ruta pr ON pr.rut_id = r.rut_id
        WHERE pr.pr_id = ?
      `, [pr_id]);

      if (rutaQuery.success && rutaQuery.data.length > 0) {
        valorHora = rutaQuery.data[0].val_hor_precio;
      } else {
        // Valor por defecto si no se encuentra información
        valorHora = 85000;
      }
    }

    // Calcular valores totales
    const valorTotalPagar = horasPagar * valorHora;
    const valorTotalCobrar = horasCobrar * valorHora * 2; // CCB cobra el doble

    console.log(`💰 Cálculo de valores para ruta ${pr_id}:`, {
      pr_id,
      val_reg_id,
      mod_id,
      horas_dictar,
      valorHora,
      horasPagar,
      horasCobrar,
      valorTotalPagar,
      valorTotalCobrar
    });

    res.json({
      success: true,
      data: {
        valorHora,
        horasPagar,
        horasCobrar,
        valorTotalPagar,
        valorTotalCobrar
      }
    });

  } catch (error) {
    console.error('Error al calcular valores:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/programaciones/grupal - Crear programación grupal
router.post('/grupal', [
  body('pr_id').isInt().withMessage('ID programa-ruta requerido'),
  body('act_id').isInt().withMessage('ID actividad requerido'),
  body('mod_id').isInt().withMessage('ID modalidad requerido'),
  body('oamp').isInt().withMessage('Número OAMP requerido'),
  body('pro_tematica').notEmpty().withMessage('Temática requerida'),
  body('pro_fecha_formacion').isDate().withMessage('Fecha de formación inválida'),
  body('pro_hora_inicio').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora inicio inválida'),
  body('pro_hora_fin').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Hora fin inválida'),
  body('pro_horas_dictar').isInt({ min: 1 }).withMessage('Horas a dictar debe ser mayor a 0')
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

    // Obtener cédula del usuario actual desde usuarios_info
    const userResult = await executeQuery(
      'SELECT usu_cedula FROM usuarios_info WHERE usu_id = ?',
      [req.user.id]
    );

    if (!userResult.success || userResult.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no tiene información completa en el sistema'
      });
    }

    const usu_cedula = userResult.data[0].usu_cedula;

    const {
      pr_id, val_reg_id, oamp, act_id, mod_id, pro_codigo_agenda,
      pro_tematica, pro_mes, pro_fecha_formacion, pro_hora_inicio, pro_hora_fin,
      pro_horas_dictar, pro_coordinador_ccb, pro_direccion, pro_enlace,
      pro_numero_hora_pagar, pro_numero_hora_cobrar, pro_valor_hora,
      pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
      pro_entregables, pro_dependencia, pro_observaciones
    } = req.body;

    // Debug: Mostrar datos antes del INSERT
    console.log('📝 BACKEND - Creando programación grupal:');
    console.log('   - Usuario cédula:', usu_cedula);
    console.log('   - Temática:', pro_tematica);
    console.log('   - Fecha:', pro_fecha_formacion);
    console.log('   - Hora inicio:', pro_hora_inicio);
    console.log('   - Hora fin:', pro_hora_fin);
    console.log('   - Total parámetros:', 24);

    const insertResult = await executeQuery(`
      INSERT INTO programaciones_grupales (
        usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, pro_codigo_agenda,
        pro_tematica, pro_mes, pro_fecha_formacion, pro_hora_inicio, pro_hora_fin,
        pro_horas_dictar, pro_coordinador_ccb, pro_direccion, pro_enlace,
        pro_numero_hora_pagar, pro_numero_hora_cobrar, pro_valor_hora,
        pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
        pro_entregables, pro_dependencia, pro_observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, pro_codigo_agenda,
      pro_tematica, pro_mes, pro_fecha_formacion, pro_hora_inicio, pro_hora_fin,
      pro_horas_dictar, pro_coordinador_ccb, pro_direccion, pro_enlace,
      pro_numero_hora_pagar, pro_numero_hora_cobrar, pro_valor_hora,
      pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
      pro_entregables, pro_dependencia, pro_observaciones
    ]);

    if (!insertResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear programación grupal',
        error: 'DATABASE_ERROR'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Programación grupal creada exitosamente',
      data: {
        pro_id: insertResult.data.insertId
      }
    });

  } catch (error) {
    console.error('Error al crear programación grupal:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/programaciones/individual - Crear programación individual
router.post('/individual', [
  body('pr_id').isInt().withMessage('ID programa-ruta requerido'),
  body('act_id').isInt().withMessage('ID actividad requerido'),
  body('mod_id').isInt().withMessage('ID modalidad requerido'),
  body('oamp').isInt().withMessage('Número OAMP requerido'),
  body('proin_tematica').notEmpty().withMessage('Temática requerida'),
  body('proin_fecha_formacion').isDate().withMessage('Fecha de formación inválida'),
  body('proin_nombre_empresario').notEmpty().withMessage('Nombre empresario requerido'),
  body('proin_identificacion_empresario').notEmpty().withMessage('Identificación empresario requerida')
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

    // Obtener cédula del usuario actual
    const userResult = await executeQuery(
      'SELECT usu_cedula FROM usuarios_info WHERE usu_id = ?',
      [req.user.id]
    );

    if (!userResult.success || userResult.data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Usuario no tiene información completa en el sistema'
      });
    }

    const usu_cedula = userResult.data[0].usu_cedula;

    const {
      pr_id, val_reg_id, oamp, act_id, mod_id, proin_codigo_agenda,
      proin_tematica, proin_mes, proin_fecha_formacion, proin_hora_inicio, proin_hora_fin,
      proin_horas_dictar, proin_coordinador_ccb, proin_direccion, proin_enlace,
      proin_nombre_empresario, proin_identificacion_empresario,
      proin_numero_hora_pagar, proin_numero_hora_cobrar, proin_valor_hora,
      proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
      proin_entregables, proin_dependencia, proin_observaciones
    } = req.body;

    // Debug: Mostrar datos antes del INSERT
    console.log('📝 BACKEND - Creando programación individual:');
    console.log('   - Usuario cédula:', usu_cedula);
    console.log('   - Temática:', proin_tematica);
    console.log('   - Fecha:', proin_fecha_formacion);
    console.log('   - Hora inicio:', proin_hora_inicio);
    console.log('   - Hora fin:', proin_hora_fin);
    console.log('   - Empresario:', proin_nombre_empresario);
    console.log('   - Total parámetros:', 26);

    const insertResult = await executeQuery(`
      INSERT INTO programaciones_individuales (
        usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, proin_codigo_agenda,
        proin_tematica, proin_mes, proin_fecha_formacion, proin_hora_inicio, proin_hora_fin,
        proin_horas_dictar, proin_coordinador_ccb, proin_direccion, proin_enlace,
        proin_nombre_empresario, proin_identificacion_empresario,
        proin_numero_hora_pagar, proin_numero_hora_cobrar, proin_valor_hora,
        proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
        proin_entregables, proin_dependencia, proin_observaciones
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, proin_codigo_agenda,
      proin_tematica, proin_mes, proin_fecha_formacion, proin_hora_inicio, proin_hora_fin,
      proin_horas_dictar, proin_coordinador_ccb, proin_direccion, proin_enlace,
      proin_nombre_empresario, proin_identificacion_empresario,
      proin_numero_hora_pagar, proin_numero_hora_cobrar, proin_valor_hora,
      proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
      proin_entregables, proin_dependencia, proin_observaciones
    ]);

    if (!insertResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al crear programación individual',
        error: 'DATABASE_ERROR'
      });
    }

    res.status(201).json({
      success: true,
      message: 'Programación individual creada exitosamente',
      data: {
        proin_id: insertResult.data.insertId
      }
    });

  } catch (error) {
    console.error('Error al crear programación individual:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones - Obtener todas las programaciones (grupales e individuales)
router.get('/', authenticateToken, async (req, res) => {
  try {
    // Obtener programaciones grupales
    const grupalResult = await executeQuery(`
      SELECT 
        CONCAT('grupal_', pg.pro_id) as id,
        pg.pro_id,
        'grupal' as tipo,
        pg.pro_tematica as title,
        pg.pro_direccion as location,
        pg.pro_fecha_formacion as date,
        pg.pro_hora_inicio as time,
        pg.pro_hora_fin as end_time,
        pg.pro_horas_dictar as hours,
        pg.pro_coordinador_ccb as coordinator,
        pg.pro_enlace as link,
        pg.pro_estado as status,
        m.mod_nombre as modality,
        ui.usu_primer_nombre,
        ui.usu_segundo_nombre,
        ui.usu_primer_apellido,
        ui.usu_segundo_apellido,
        ui.are_id,
        ac.are_descripcion as area_conocimiento,
        c.oamp,
        pg.pro_valor_total_hora_pagar as total_value,
        p.prog_nombre as program_name,
        r.rut_nombre as route_name,
        act.act_tipo as activity_type
      FROM programaciones_grupales pg
      JOIN usuarios_info ui ON pg.usu_cedula = ui.usu_cedula
      LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
      JOIN modalidades m ON pg.mod_id = m.mod_id
      JOIN contratos c ON pg.oamp = c.oamp
      JOIN programa_ruta pr ON pg.pr_id = pr.pr_id
      JOIN programas p ON pr.prog_id = p.prog_id
      JOIN rutas r ON pr.rut_id = r.rut_id
      JOIN actividades act ON pg.act_id = act.act_id
      ORDER BY pg.pro_fecha_formacion DESC, pg.pro_hora_inicio DESC
    `);

    // Obtener programaciones individuales
    const individualResult = await executeQuery(`
      SELECT 
        CONCAT('individual_', pi.proin_id) as id,
        pi.proin_id,
        'individual' as tipo,
        pi.proin_tematica as title,
        pi.proin_direccion as location,
        pi.proin_fecha_formacion as date,
        pi.proin_hora_inicio as time,
        pi.proin_hora_fin as end_time,
        pi.proin_horas_dictar as hours,
        pi.proin_coordinador_ccb as coordinator,
        pi.proin_enlace as link,
        pi.proin_estado as status,
        pi.proin_nombre_empresario as business_person,
        pi.proin_identificacion_empresario as business_id,
        m.mod_nombre as modality,
        ui.usu_primer_nombre,
        ui.usu_segundo_nombre,
        ui.usu_primer_apellido,
        ui.usu_segundo_apellido,
        ui.are_id,
        ac.are_descripcion as area_conocimiento,
        c.oamp,
        pi.proin_valor_total_hora_pagar as total_value,
        p.prog_nombre as program_name,
        r.rut_nombre as route_name,
        act.act_tipo as activity_type
      FROM programaciones_individuales pi
      JOIN usuarios_info ui ON pi.usu_cedula = ui.usu_cedula
      LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
      JOIN modalidades m ON pi.mod_id = m.mod_id
      JOIN contratos c ON pi.oamp = c.oamp
      JOIN programa_ruta pr ON pi.pr_id = pr.pr_id
      JOIN programas p ON pr.prog_id = p.prog_id
      JOIN rutas r ON pr.rut_id = r.rut_id
      JOIN actividades act ON pi.act_id = act.act_id
      ORDER BY pi.proin_fecha_formacion DESC, pi.proin_hora_inicio DESC
    `);

    // Verificar si alguna consulta falló
    if (!grupalResult.success || !individualResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener programaciones',
        error: 'DATABASE_ERROR'
      });
    }

    // Debug: Mostrar algunos ejemplos de los datos raw
    console.log('🔍 BACKEND - Ejemplos de programaciones raw de MySQL:');
    if (grupalResult.data.length > 0) {
      const ejemploGrupal = grupalResult.data[0];
      console.log('   - Ejemplo grupal:', ejemploGrupal.title);
      console.log('     * date:', typeof ejemploGrupal.date, ejemploGrupal.date);
      console.log('     * time:', typeof ejemploGrupal.time, ejemploGrupal.time);
      console.log('     * end_time:', typeof ejemploGrupal.end_time, ejemploGrupal.end_time);
    }
    if (individualResult.data.length > 0) {
      const ejemploIndividual = individualResult.data[0];
      console.log('   - Ejemplo individual:', ejemploIndividual.title);
      console.log('     * date:', typeof ejemploIndividual.date, ejemploIndividual.date);
      console.log('     * time:', typeof ejemploIndividual.time, ejemploIndividual.time);
      console.log('     * end_time:', typeof ejemploIndividual.end_time, ejemploIndividual.end_time);
    }

    // Combinar y transformar los datos
    const programacionesGrupales = grupalResult.data.map(prog => ({
      id: prog.id,
      type: prog.tipo,
      title: prog.title,
      location: prog.location,
      date: prog.date,
      time: prog.time,
      end_time: prog.end_time,
      hours: prog.hours,
      coordinator: prog.coordinator,
      link: prog.link,
      modality: prog.modality,
      status: prog.status || 'Programado',
      instructor: [
        prog.usu_primer_nombre,
        prog.usu_segundo_nombre,
        prog.usu_primer_apellido,
        prog.usu_segundo_apellido
      ].filter(Boolean).join(' '),
      contract: prog.oamp,
      total_value: prog.total_value,
      program_name: prog.program_name,
      route_name: prog.route_name,
      activity_type: prog.activity_type,
      area_conocimiento: prog.area_conocimiento || 'No especificada',
      participants: null // Para programaciones grupales, podríamos calcular esto después
    }));

    const programacionesIndividuales = individualResult.data.map(prog => ({
      id: prog.id,
      type: prog.tipo,
      title: prog.title,
      location: prog.location,
      date: prog.date,
      time: prog.time,
      end_time: prog.end_time,
      hours: prog.hours,
      coordinator: prog.coordinator,
      link: prog.link,
      modality: prog.modality,
      status: prog.status || 'Programado',
      instructor: [
        prog.usu_primer_nombre,
        prog.usu_segundo_nombre,
        prog.usu_primer_apellido,
        prog.usu_segundo_apellido
      ].filter(Boolean).join(' '),
      contract: prog.oamp,
      total_value: prog.total_value,
      program_name: prog.program_name,
      route_name: prog.route_name,
      activity_type: prog.activity_type,
      area_conocimiento: prog.area_conocimiento || 'No especificada',
      business_person: prog.business_person,
      business_id: prog.business_id,
      participants: 1 // Asesorías individuales siempre son para 1 persona
    }));

    // Combinar ambos tipos y ordenar por fecha
    const todasLasProgramaciones = [...programacionesGrupales, ...programacionesIndividuales]
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateB - dateA; // Más recientes primero
      });

    // Debug: Mostrar resultado final antes de enviar
    console.log('📊 BACKEND - Resultado final:');
    console.log(`   - Total programaciones: ${todasLasProgramaciones.length}`);
    if (todasLasProgramaciones.length > 0) {
      const primera = todasLasProgramaciones[0];
      console.log('   - Primera programación transformada:', {
        id: primera.id,
        title: primera.title,
        date: primera.date,
        time: primera.time,
        end_time: primera.end_time,
        area_conocimiento: primera.area_conocimiento
      });
    }

    res.json({
      success: true,
      data: {
        programaciones: todasLasProgramaciones,
        total: todasLasProgramaciones.length,
        grupales: programacionesGrupales.length,
        individuales: programacionesIndividuales.length
      }
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

// GET /api/programaciones/dashboard-stats - Obtener estadísticas para el dashboard
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    // Estadísticas de programaciones grupales
    const grupalStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_grupales,
        COUNT(DISTINCT ui.usu_cedula) as instructores_grupales,
        SUM(pg.pro_horas_dictar) as total_horas_grupales
      FROM programaciones_grupales pg
      JOIN usuarios_info ui ON pg.usu_cedula = ui.usu_cedula
    `);

    // Estadísticas de programaciones individuales
    const individualStats = await executeQuery(`
      SELECT 
        COUNT(*) as total_individuales,
        COUNT(DISTINCT ui.usu_cedula) as instructores_individuales,
        SUM(pi.proin_horas_dictar) as total_horas_individuales
      FROM programaciones_individuales pi
      JOIN usuarios_info ui ON pi.usu_cedula = ui.usu_cedula
    `);

    // Próximo evento
    const proximoEvento = await executeQuery(`
      SELECT * FROM (
        (SELECT 
          CONCAT('grupal_', pg.pro_id) as id,
          'grupal' as tipo,
          pg.pro_tematica as title,
          pg.pro_direccion as location,
          pg.pro_fecha_formacion as date,
          pg.pro_hora_inicio as time,
          m.mod_nombre as modality,
          CONCAT(ui.usu_primer_nombre, ' ', ui.usu_primer_apellido) as instructor,
          CONCAT(pg.pro_fecha_formacion, ' ', pg.pro_hora_inicio) as datetime_sort
        FROM programaciones_grupales pg
        JOIN usuarios_info ui ON pg.usu_cedula = ui.usu_cedula
        JOIN modalidades m ON pg.mod_id = m.mod_id
        WHERE CONCAT(pg.pro_fecha_formacion, ' ', pg.pro_hora_inicio) > NOW())
        UNION ALL
        (SELECT 
          CONCAT('individual_', pi.proin_id) as id,
          'individual' as tipo,
          pi.proin_tematica as title,
          pi.proin_direccion as location,
          pi.proin_fecha_formacion as date,
          pi.proin_hora_inicio as time,
          m.mod_nombre as modality,
          CONCAT(ui.usu_primer_nombre, ' ', ui.usu_primer_apellido) as instructor,
          CONCAT(pi.proin_fecha_formacion, ' ', pi.proin_hora_inicio) as datetime_sort
        FROM programaciones_individuales pi
        JOIN usuarios_info ui ON pi.usu_cedula = ui.usu_cedula
        JOIN modalidades m ON pi.mod_id = m.mod_id
        WHERE CONCAT(pi.proin_fecha_formacion, ' ', pi.proin_hora_inicio) > NOW())
      ) AS eventos_futuros
      ORDER BY datetime_sort ASC
      LIMIT 1
    `);

    if (!grupalStats.success || !individualStats.success || !proximoEvento.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas',
        error: 'DATABASE_ERROR'
      });
    }

    const statsGrupal = grupalStats.data[0] || {};
    const statsIndividual = individualStats.data[0] || {};
    const nextEvent = proximoEvento.data[0] || null;

    // Debug: Mostrar los datos raw del próximo evento
    console.log('🔍 BACKEND - Próximo evento raw de MySQL:', nextEvent);
    if (nextEvent) {
      console.log('   - Tipo de date:', typeof nextEvent.date, nextEvent.date);
      console.log('   - Tipo de time:', typeof nextEvent.time, nextEvent.time);
      console.log('   - Fecha como string:', String(nextEvent.date));
      console.log('   - Hora como string:', String(nextEvent.time));
    }

    const estadisticas = {
      total_programaciones: (statsGrupal.total_grupales || 0) + (statsIndividual.total_individuales || 0),
      total_instructores: Math.max(statsGrupal.instructores_grupales || 0, statsIndividual.instructores_individuales || 0),
      total_horas: (statsGrupal.total_horas_grupales || 0) + (statsIndividual.total_horas_individuales || 0),
      programaciones_grupales: statsGrupal.total_grupales || 0,
      programaciones_individuales: statsIndividual.total_individuales || 0,
      proximo_evento: nextEvent ? {
        id: nextEvent.id,
        title: nextEvent.title,
        location: nextEvent.location,
        date: nextEvent.date,
        time: nextEvent.time,
        modality: nextEvent.modality,
        instructor: nextEvent.instructor
      } : null
    };

    res.json({
      success: true,
      data: estadisticas
    });

  } catch (error) {
    console.error('Error al obtener estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// DELETE /api/programaciones/:id - Eliminar programación
router.delete('/:id', authenticateToken, requireGestora, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Determinar el tipo y ID real desde el ID compuesto (ej: "grupal_123" o "individual_456")
    let tipo, realId;
    
    if (id.startsWith('grupal_')) {
      tipo = 'grupal';
      realId = id.replace('grupal_', '');
    } else if (id.startsWith('individual_')) {
      tipo = 'individual';
      realId = id.replace('individual_', '');
    } else {
      return res.status(400).json({
        success: false,
        message: 'ID de programación inválido. Debe empezar con "grupal_" o "individual_"'
      });
    }

    let deleteResult;
    
    if (tipo === 'grupal') {
      // Verificar que la programación grupal existe
      const existsResult = await executeQuery(
        'SELECT pro_id FROM programaciones_grupales WHERE pro_id = ?',
        [realId]
      );
      
      if (!existsResult.success || existsResult.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Programación grupal no encontrada'
        });
      }
      
      // Eliminar programación grupal
      deleteResult = await executeQuery(
        'DELETE FROM programaciones_grupales WHERE pro_id = ?',
        [realId]
      );
      
    } else if (tipo === 'individual') {
      // Verificar que la programación individual existe
      const existsResult = await executeQuery(
        'SELECT proin_id FROM programaciones_individuales WHERE proin_id = ?',
        [realId]
      );
      
      if (!existsResult.success || existsResult.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Programación individual no encontrada'
        });
      }
      
      // Eliminar programación individual
      deleteResult = await executeQuery(
        'DELETE FROM programaciones_individuales WHERE proin_id = ?',
        [realId]
      );
    }

    if (!deleteResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al eliminar la programación',
        error: 'DATABASE_ERROR'
      });
    }

    console.log(`🗑️ Programación ${tipo} eliminada:`, { id, realId });

    res.json({
      success: true,
      message: `Programación ${tipo} eliminada exitosamente`,
      data: { id, tipo, realId }
    });

  } catch (error) {
    console.error('Error al eliminar programación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/programaciones/:id - Obtener una programación específica para edición
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Determinar el tipo y ID real desde el ID compuesto
    let tipo, realId;
    
    if (id.startsWith('grupal_')) {
      tipo = 'grupal';
      realId = id.replace('grupal_', '');
    } else if (id.startsWith('individual_')) {
      tipo = 'individual';
      realId = id.replace('individual_', '');
    } else {
      return res.status(400).json({
        success: false,
        message: 'ID de programación inválido'
      });
    }

    let result;
    
    if (tipo === 'grupal') {
      result = await executeQuery(`
        SELECT 
          pg.*,
          m.mod_nombre,
          ui.usu_primer_nombre,
          ui.usu_segundo_nombre,
          ui.usu_primer_apellido,
          ui.usu_segundo_apellido,
          ac.are_descripcion,
          p.prog_id,
          p.prog_nombre,
          r.rut_id,
          r.rut_nombre,
          act.act_id,
          act.act_tipo
        FROM programaciones_grupales pg
        JOIN usuarios_info ui ON pg.usu_cedula = ui.usu_cedula
        LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
        JOIN modalidades m ON pg.mod_id = m.mod_id
        JOIN programa_ruta pr ON pg.pr_id = pr.pr_id
        JOIN programas p ON pr.prog_id = p.prog_id
        JOIN rutas r ON pr.rut_id = r.rut_id
        JOIN actividades act ON pg.act_id = act.act_id
        WHERE pg.pro_id = ?
      `, [realId]);
      
    } else if (tipo === 'individual') {
      result = await executeQuery(`
        SELECT 
          pi.*,
          m.mod_nombre,
          ui.usu_primer_nombre,
          ui.usu_segundo_nombre,
          ui.usu_primer_apellido,
          ui.usu_segundo_apellido,
          ac.are_descripcion,
          p.prog_id,
          p.prog_nombre,
          r.rut_id,
          r.rut_nombre,
          act.act_id,
          act.act_tipo
        FROM programaciones_individuales pi
        JOIN usuarios_info ui ON pi.usu_cedula = ui.usu_cedula
        LEFT JOIN areas_conocimiento ac ON ui.are_id = ac.are_id
        JOIN modalidades m ON pi.mod_id = m.mod_id
        JOIN programa_ruta pr ON pi.pr_id = pr.pr_id
        JOIN programas p ON pr.prog_id = p.prog_id
        JOIN rutas r ON pr.rut_id = r.rut_id
        JOIN actividades act ON pi.act_id = act.act_id
        WHERE pi.proin_id = ?
      `, [realId]);
    }

    if (!result.success || result.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Programación no encontrada'
      });
    }

    const programacion = result.data[0];
    
    res.json({
      success: true,
      data: {
        programacion,
        tipo
      }
    });

  } catch (error) {
    console.error('Error al obtener programación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

// PUT /api/programaciones/:id - Actualizar programación
router.put('/:id', authenticateToken, requireGestora, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Determinar el tipo y ID real desde el ID compuesto
    let tipo, realId;
    
    if (id.startsWith('grupal_')) {
      tipo = 'grupal';
      realId = id.replace('grupal_', '');
    } else if (id.startsWith('individual_')) {
      tipo = 'individual';
      realId = id.replace('individual_', '');
    } else {
      return res.status(400).json({
        success: false,
        message: 'ID de programación inválido. Debe empezar con "grupal_" o "individual_"'
      });
    }

    let updateResult;
    
    if (tipo === 'grupal') {
      // Verificar que la programación grupal existe
      const existsResult = await executeQuery(
        'SELECT pro_id FROM programaciones_grupales WHERE pro_id = ?',
        [realId]
      );
      
      if (!existsResult.success || existsResult.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Programación grupal no encontrada'
        });
      }
      
      // Actualizar programación grupal
      const {
        pr_id, act_id, mod_id, oamp, val_reg_id, pro_codigo_agenda, pro_mes,
        pro_fecha_formacion, pro_hora_inicio, pro_hora_fin, pro_horas_dictar,
        pro_coordinador_ccb, pro_direccion, pro_enlace, pro_numero_hora_pagar,
        pro_numero_hora_cobrar, pro_valor_hora, pro_valor_total_hora_pagar,
        pro_valor_total_hora_ccb, pro_entregables, pro_dependencia, 
        pro_observaciones, pro_tematica
      } = req.body;
      
      updateResult = await executeQuery(`
        UPDATE programaciones_grupales SET
          pr_id = ?, act_id = ?, mod_id = ?, oamp = ?, val_reg_id = ?,
          pro_codigo_agenda = ?, pro_mes = ?, pro_fecha_formacion = ?,
          pro_hora_inicio = ?, pro_hora_fin = ?, pro_horas_dictar = ?,
          pro_coordinador_ccb = ?, pro_direccion = ?, pro_enlace = ?,
          pro_numero_hora_pagar = ?, pro_numero_hora_cobrar = ?, pro_valor_hora = ?,
          pro_valor_total_hora_pagar = ?, pro_valor_total_hora_ccb = ?,
          pro_entregables = ?, pro_dependencia = ?, pro_observaciones = ?,
          pro_tematica = ?
        WHERE pro_id = ?
      `, [
        pr_id, act_id, mod_id, oamp, val_reg_id, pro_codigo_agenda, pro_mes,
        pro_fecha_formacion, pro_hora_inicio, pro_hora_fin, pro_horas_dictar,
        pro_coordinador_ccb, pro_direccion, pro_enlace, pro_numero_hora_pagar,
        pro_numero_hora_cobrar, pro_valor_hora, pro_valor_total_hora_pagar,
        pro_valor_total_hora_ccb, pro_entregables, pro_dependencia, 
        pro_observaciones, pro_tematica, realId
      ]);
      
    } else if (tipo === 'individual') {
      // Verificar que la programación individual existe
      const existsResult = await executeQuery(
        'SELECT proin_id FROM programaciones_individuales WHERE proin_id = ?',
        [realId]
      );
      
      if (!existsResult.success || existsResult.data.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Programación individual no encontrada'
        });
      }
      
      // Actualizar programación individual
      const {
        pr_id, act_id, mod_id, oamp, val_reg_id, proin_codigo_agenda, proin_mes,
        proin_fecha_formacion, proin_hora_inicio, proin_hora_fin, proin_horas_dictar,
        proin_coordinador_ccb, proin_direccion, proin_enlace, proin_numero_hora_pagar,
        proin_numero_hora_cobrar, proin_valor_hora, proin_valor_total_hora_pagar,
        proin_valor_total_hora_ccb, proin_entregables, proin_dependencia, 
        proin_observaciones, proin_tematica, proin_nombre_empresario, 
        proin_identificacion_empresario
      } = req.body;
      
      updateResult = await executeQuery(`
        UPDATE programaciones_individuales SET
          pr_id = ?, act_id = ?, mod_id = ?, oamp = ?, val_reg_id = ?,
          proin_codigo_agenda = ?, proin_mes = ?, proin_fecha_formacion = ?,
          proin_hora_inicio = ?, proin_hora_fin = ?, proin_horas_dictar = ?,
          proin_coordinador_ccb = ?, proin_direccion = ?, proin_enlace = ?,
          proin_numero_hora_pagar = ?, proin_numero_hora_cobrar = ?, proin_valor_hora = ?,
          proin_valor_total_hora_pagar = ?, proin_valor_total_hora_ccb = ?,
          proin_entregables = ?, proin_dependencia = ?, proin_observaciones = ?,
          proin_tematica = ?, proin_nombre_empresario = ?, proin_identificacion_empresario = ?
        WHERE proin_id = ?
      `, [
        pr_id, act_id, mod_id, oamp, val_reg_id, proin_codigo_agenda, proin_mes,
        proin_fecha_formacion, proin_hora_inicio, proin_hora_fin, proin_horas_dictar,
        proin_coordinador_ccb, proin_direccion, proin_enlace, proin_numero_hora_pagar,
        proin_numero_hora_cobrar, proin_valor_hora, proin_valor_total_hora_pagar,
        proin_valor_total_hora_ccb, proin_entregables, proin_dependencia, 
        proin_observaciones, proin_tematica, proin_nombre_empresario, 
        proin_identificacion_empresario, realId
      ]);
    }

    if (!updateResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar la programación',
        error: 'DATABASE_ERROR'
      });
    }

    console.log(`✅ Programación ${tipo} actualizada:`, { id, realId });

    res.json({
      success: true,
      message: `Programación ${tipo} actualizada exitosamente`,
      data: { id, tipo, realId }
    });

  } catch (error) {
    console.error('Error al actualizar programación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router; 