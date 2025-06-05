CREATE DATABASE automatizacion;
USE automatizacion;
/*
Tablas menos dependientes inicio
*/
-- Tabla de cuentas
CREATE TABLE cuentas (
	usu_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_correo VARCHAR(100) UNIQUE NOT NULL,
    usu_contraseña VARCHAR(255) NOT NULL,
    usu_tipo ENUM('Administrador','Consultor','Profesional','Reclutador') DEFAULT 'Consultor' NOT NULL,
    usu_fecha_registro TIMESTAMP NOT NULL,
    usu_activo BOOL NOT NULL
);
-- Tabla de habilidades
CREATE TABLE habilidades (
	hab_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    hab_nombre VARCHAR(100) NOT NULL,
    hab_categoria VARCHAR(100) NOT NULL,
    hab_descripcion VARCHAR(100) NOT NULL,
    hab_nivel_importancia INT NOT NULL
);
-- Tabla de modalidades
CREATE TABLE modalidades (
  mod_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  mod_nombre VARCHAR(100) NOT NULL
);

-- Tabla de actividades
CREATE TABLE actividades (
	act_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    act_tipo VARCHAR(255) NOT NULL
);
-- Tabla de areas_conocimiento
CREATE TABLE areas_conocimiento (
	are_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    are_descripcion TEXT NOT NULL
);
-- Tabla de regiones
CREATE TABLE regiones (
	reg_id VARCHAR(50) PRIMARY KEY NOT NULL
);

-- Tabla de programas
CREATE TABLE programas (
	prog_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    prog_nombre VARCHAR(255) NOT NULL,
    prog_total_horas FLOAT NOT NULL
);

/*
Tablas menos dependientes final
*/

/*
Tablas mas dependientes inicio
*/
-- Tabla de municipios
CREATE TABLE municipios (
	mun_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    reg_id VARCHAR(50),
    mun_nombre VARCHAR(255),
    FOREIGN KEY (reg_id) REFERENCES regiones(reg_id) ON DELETE CASCADE
);
-- Tabla de valor_horas_region
CREATE TABLE valor_horas_region (
  val_reg_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  reg_id VARCHAR(50) NOT NULL,
  val_reg_hora_base INT NOT NULL,
  val_reg_traslado INT NOT NULL,
  val_reg_sin_dictar INT NOT NULL,
  val_reg_dos_horas INT NOT NULL,
  val_reg_tres_horas INT NOT NULL,
  val_reg_cuatro_mas_horas INT NOT NULL,
   FOREIGN KEY (reg_id) REFERENCES regiones(reg_id) ON DELETE CASCADE
);
-- Tabla de consultores
CREATE TABLE usuarios_info (
  usu_cedula INT NOT NULL PRIMARY KEY,
  usu_id INT NOT NULL,  -- Relación con cuentas
  are_id INT NOT NULL,
  usu_primer_nombre VARCHAR(255) NOT NULL,
  usu_segundo_nombre VARCHAR(255) NULL,
  usu_primer_apellido VARCHAR(255) NOT NULL,
  usu_segundo_apellido VARCHAR(255) NOT NULL,
  usu_telefono VARCHAR(255) NOT NULL,
  usu_direccion VARCHAR(255) NOT NULL,
  FOREIGN KEY (usu_id) REFERENCES cuentas(usu_id) ON DELETE CASCADE,
  FOREIGN KEY (are_id) REFERENCES areas_conocimiento(are_id) ON DELETE CASCADE
);
-- Tabla de hojas de vida
CREATE TABLE hojas_de_vida (
	hv_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (Consultores)
    hv_archivo LONGBLOB NOT NULL,
    hv_formato VARCHAR(50) NOT NULL,
    hv_fecha_carga TIMESTAMP NOT NULL,
    hv_score_ia FLOAT NOT NULL,
    hv_resumen_automatico TEXT NOT NULL,
    hv_verificado BOOL NOT NULL,
	FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE
);
-- Tabla de notificaciones
CREATE TABLE notificaciones (
	not_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
	usu_cedula INT NOT NULL, -- Relación con usuarios_info (llega a los consultores)
    not_titulo VARCHAR(255) NOT NULL,
    not_mensaje VARCHAR(255) NOT NULL,
    not_fecha_hora TIMESTAMP NOT NULL,
    not_leida BOOL NOT NULL,
    not_tipo VARCHAR(100) NOT NULL,
	FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE
);
-- Tabla de configuracion_IA (reclutador configura la ia que vendra de n8n)
CREATE TABLE configuraciones_ia (
	confi_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (reclutadores)
    confi_nombre_parametro TEXT NOT NULL,
    confi_valor VARCHAR(255) NOT NULL,
    confi_descripcion TEXT NOT NULL,
    confi_ultima_modificacion TIMESTAMP NOT NULL,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE
);
-- Tabla de habilidad hoja de vida
CREATE TABLE habilidades_cv (
	hab_cv_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    hv_id INT NOT NULL, -- Relación con hojas_de_vida
    hab_id INT NOT NULL, -- Relación con habilidades
    hab_cv_nivel_dominio INT NOT NULL,
    hab_cv_descripcion VARCHAR(255) NOT NULL,
    hab_cv_validada BOOL NOT NULL,
    FOREIGN KEY (hv_id) REFERENCES hojas_de_vida(hv_id) ON DELETE CASCADE,
    FOREIGN KEY (hab_id) REFERENCES habilidades(hab_id) ON DELETE CASCADE
);
-- Tabla de favoritos
CREATE TABLE favoritos (
	fav_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (reclutadores)
    hv_id INT NOT NULL, -- Relación con hojas_de_vida
    fav_notas TEXT NOT NULL,
    fav_fecha_guardado TIMESTAMP NOT NULL,
    fav_carpeta VARCHAR(100) NOT NULL,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (hv_id) REFERENCES hojas_de_vida(hv_id) ON DELETE CASCADE
);
 -- Tabla de sectores
CREATE TABLE sectores (
	sec_cod INT PRIMARY KEY NOT NULL,
    are_id INT NOT NULL,
    sec_nombre VARCHAR(255) NOT NULL,
    sec_total_horas INT NOT NULL,
    FOREIGN KEY (are_id) REFERENCES areas_conocimiento(are_id) ON DELETE CASCADE
);
-- Tabla de valor_horas
CREATE TABLE valor_horas (
  val_hor_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
  mod_id INT NOT NULL, -- Relación con modalidades
  val_hor_clasificacion VARCHAR(100) NOT NULL, -- Ej. Virtual, Presencial
  val_hor_precio INT NOT NULL,
  FOREIGN KEY (mod_id) REFERENCES modalidades(mod_id) ON DELETE CASCADE
);
-- Tabla de rutas
CREATE TABLE rutas (
	rut_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    val_hor_id INT NOT NULL,
    rut_nombre VARCHAR(255) NOT NULL,
    rut_descripcion TEXT NOT NULL,
    rut_candidatos INT NOT NULL,
    rut_total_horas FLOAT NOT NULL,
    rut_promedio_horas_candidato FLOAT,
    FOREIGN KEY (val_hor_id) REFERENCES valor_horas(val_hor_id) ON DELETE CASCADE
);
-- Tabla de rutas secotor
CREATE TABLE ruta_sector (
  rs_id INT AUTO_INCREMENT PRIMARY KEY,
  rut_id INT NOT NULL,
  sec_cod INT NOT NULL,
  FOREIGN KEY (rut_id) REFERENCES rutas(rut_id),
  FOREIGN KEY (sec_cod) REFERENCES sectores(sec_cod)
);
-- Tabla de vacantes
CREATE TABLE vacantes (
	vac_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (reclutadores)
    rut_id INT NOT NULL, -- Relación con rutas
    vac_titulo VARCHAR(255) NOT NULL,
    vac_descripcion TEXT NOT NULL,
    vac_renumeracion FLOAT,
    vac_estado ENUM('Borrador', 'Publicada', 'Cerrada', 'Cancelada'),
    vac_fecha_publicacion DATE,
    vac_fecha_limite_postulacion DATE,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (rut_id) REFERENCES rutas(rut_id) ON DELETE CASCADE
);
-- Tala de requisitos
CREATE TABLE requisitos (
	req_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    vac_id INT NOT NULL, -- Relación con vacantes
    hab_id INT NOT NULL, -- Relación con habilidades
    req_nivel_requerido INT NOT NULL,
    req_obligatorio BOOL NOT NULL,
    req_ponderacion INT NOT NULL,
    FOREIGN KEY (vac_id) REFERENCES vacantes(vac_id) ON DELETE CASCADE,
    FOREIGN KEY (hab_id) REFERENCES habilidades(hab_id) ON DELETE CASCADE
);
-- Tala de postulaciones
CREATE TABLE postulaciones (
	pos_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    vac_id INT NOT NULL, -- Relación con vacantes
    hv_id INT NOT NULL, -- Relación con hojas_de_vida
    pos_fecha_postulacion TIMESTAMP NOT NULL,
    pos_estado ENUM('Pendiente', 'Revisada', 'Preseleccionada', 'Rechazada', 'Aprobada') NOT NULL,
    pos_puntuacion_match FLOAT NOT NULL,
    pos_comentarios_reclutador TEXT NOT NULL,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (vac_id) REFERENCES vacantes(vac_id) ON DELETE CASCADE,
    FOREIGN KEY (hv_id) REFERENCES hojas_de_vida(hv_id) ON DELETE CASCADE
);
-- Tabla de matchs
CREATE TABLE matchs (
	mat_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    pos_id INT NOT NULL, -- Relación con postulaciones
    req_id INT NOT NULL, -- Relación con requisitos
    mat_puntuacion FLOAT NOT NULL,
    mat_observacion TEXT NOT NULL,
	FOREIGN KEY (pos_id) REFERENCES postulaciones(pos_id) ON DELETE CASCADE,
    FOREIGN KEY (req_id) REFERENCES requisitos(req_id) ON DELETE CASCADE
);
-- Tabla de entrevistas (reclutador crea la entrevista y le llega una notificacion o correo al consultor de la entrevista)
CREATE TABLE entrevistas (
	vis_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    pos_id INT NOT NULL, -- Relación con postulaciones
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultor al que se le hara la entrevista)
    vis_fecha_hora TIMESTAMP NOT NULL,
    vis_modalidad VARCHAR(100) NOT NULL,
    vis_plataforma VARCHAR(100) NOT NULL,
    vis_link_acceso VARCHAR(100) NOT NULL,
    vis_estado ENUM('Programada', 'Realizada', 'Cancelada', 'Reprogramada') NOT NULL,
    vis_resultado VARCHAR(255) NOT NULL,
    vis_observaciones TEXT NOT NULL,
    FOREIGN KEY (pos_id) REFERENCES postulaciones(pos_id) ON DELETE CASCADE,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE
);
-- Tabla de contratos
CREATE TABLE contratos (
	oamp INT PRIMARY KEY NOT NULL,
	pos_id INT NOT NULL, -- Relación con postulaciones
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    oamp_terminos TEXT NOT NULL,
    oamp_fecha_generacion TIMESTAMP NOT NULL,
    oamp_estado ENUM('Borrador', 'Enviado', 'Rechazado', 'Cancelado') NOT NULL,
    oamp_valor_total FLOAT NOT NULL,
    oamp_documento_firmado LONGBLOB NOT NULL,
    FOREIGN KEY (pos_id) REFERENCES postulaciones(pos_id) ON DELETE CASCADE,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE
);

-- Tabla de responsable_rutas
CREATE TABLE responsable_rutas (
	res_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    rut_id INT NOT NULL, -- Relación con rutas
    res_nombre VARCHAR(255) NOT NULL,
    res_rol ENUM('Profesional', 'Auxiliar') NOT NULL,
    res_correo VARCHAR(255) NOT NULL,
    res_telefono VARCHAR(255) NOT NULL,
    FOREIGN KEY (rut_id) REFERENCES rutas(rut_id) ON DELETE CASCADE
);
-- Tabla de progrma con rutas
CREATE TABLE programa_ruta (
  pr_id INT AUTO_INCREMENT PRIMARY KEY,
  prog_id INT NOT NULL,
  rut_id INT NOT NULL,
  FOREIGN KEY (prog_id) REFERENCES programas(prog_id) ON DELETE CASCADE,
  FOREIGN KEY (rut_id) REFERENCES rutas(rut_id) ON DELETE CASCADE
);
-- Tabla de progrmaciones_grupales
CREATE TABLE programaciones_grupales (
	pro_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    pr_id INT NOT NULL, -- Relación con programa_ruta
    val_reg_id INT, -- Relación con valor_horas_region
    oamp INT NOT NULL, -- Relación con contratos
    act_id INT NOT NULL, -- Relación con actividades
    mod_id INT NOT NULL, -- Relación con modalidades
    pro_codigo_agenda INT NOT NULL,
    pro_tematica VARCHAR(255) NOT NULL,
    pro_mes VARCHAR(50) NOT NULL,
    pro_fecha_formacion DATE NOT NULL,
    pro_hora_inicio TIME NOT NULL,
    pro_hora_fin TIME NOT NULL,
    pro_horas_dictar INT NOT NULL,
    pro_coordinador_ccb VARCHAR(255),
    pro_direccion VARCHAR(255) NOT NULL,
    pro_enlace VARCHAR(255) NOT NULL,
    pro_estado ENUM('Realizada', 'Cancelada'),
    pro_numero_hora_pagar INT NOT NULL,
    pro_numero_hora_cobrar INT NOT NULL,
    pro_valor_hora FLOAT NOT NULL,
    pro_valor_total_hora_pagar FLOAT NOT NULL,
    pro_valor_total_hora_ccb FLOAT NOT NULL,
    pro_entregables TEXT NOT NULL,
    pro_dependencia VARCHAR(50) NOT NULL,
    pro_observaciones TEXT NOT NULL,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (mod_id) REFERENCES modalidades(mod_id) ON DELETE CASCADE,
    FOREIGN KEY (pr_id) REFERENCES programa_ruta(pr_id) ON DELETE CASCADE,
    FOREIGN KEY (val_reg_id) REFERENCES valor_horas_region(val_reg_id) ON DELETE CASCADE,
    FOREIGN KEY (oamp) REFERENCES contratos(oamp) ON DELETE CASCADE,
    FOREIGN KEY (act_id) REFERENCES actividades(act_id) ON DELETE CASCADE
);
-- Tabla de programaciones_individuales
CREATE TABLE programaciones_individuales (
	proin_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    pr_id INT NOT NULL, -- Relación con programa_ruta
    val_reg_id INT, -- Relación con valor_horas_region
    oamp INT NOT NULL, -- Relación con contratos
    act_id INT NOT NULL, -- Relación con actividades
    mod_id INT NOT NULL, -- Relación con modalidad
    proin_codigo_agenda INT NOT NULL,
    proin_tematica VARCHAR(255) NOT NULL,
    proin_mes VARCHAR(50) NOT NULL,
    proin_fecha_formacion DATE NOT NULL,
    proin_hora_inicio TIME NOT NULL,
    proin_hora_fin TIME NOT NULL,
    proin_horas_dictar INT NOT NULL,
    proin_coordinador_ccb VARCHAR(255),
    proin_direccion VARCHAR(255) NOT NULL,
    proin_enlace VARCHAR(255) NOT NULL,
    proin_nombre_empresario VARCHAR(255) NOT NULL,
    proin_identificacion_empresario VARCHAR(11) NOT NULL,
    proin_estado ENUM('Realizada', 'Cancelada'),
    proin_numero_hora_pagar INT NOT NULL,
    proin_numero_hora_cobrar INT NOT NULL,
    proin_valor_hora FLOAT NOT NULL,
    proin_valor_total_hora_pagar FLOAT NOT NULL,
    proin_valor_total_hora_ccb FLOAT NOT NULL,
    proin_entregables TEXT NOT NULL,
    proin_dependencia VARCHAR(50) NOT NULL,
    proin_observaciones TEXT NOT NULL,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (mod_id) REFERENCES modalidades(mod_id) ON DELETE CASCADE,
    FOREIGN KEY (pr_id) REFERENCES programa_ruta(pr_id) ON DELETE CASCADE,
    FOREIGN KEY (val_reg_id) REFERENCES valor_horas_region(val_reg_id) ON DELETE CASCADE,
    FOREIGN KEY (oamp) REFERENCES contratos(oamp) ON DELETE CASCADE,
    FOREIGN KEY (act_id) REFERENCES actividades(act_id) ON DELETE CASCADE
);
-- Tabla de valoracion
#Tabla de valoracion para las evidencias del consultor hecha por el profesional responsable
CREATE TABLE valoraciones (
	val_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    res_id INT NOT NULL, -- Relación con responsable_rutas
    pro_id INT NULL,
    proin_id INT NULL,
    val_puntuacion FLOAT NOT NULL,
    val_observaciones TEXT NOT NULL,
    FOREIGN KEY (res_id) REFERENCES responsable_rutas(res_id),
    FOREIGN KEY (pro_id) REFERENCES programaciones_grupales(pro_id),
    FOREIGN KEY (proin_id) REFERENCES programaciones_individuales(proin_id)
);
-- Tabla de evidencias_grupales
CREATE TABLE evidencias_grupales (
	evi_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    pro_id INT NOT NULL, -- Relacion con progrmaciones_grupales
    res_id INT NOT NULL, -- Relación con responsable_rutas
    evi_mes VARCHAR(100) NOT NULL,
    evi_fecha TIMESTAMP NOT NULL,
    evi_hora_inicio TIMESTAMP NOT NULL,
    evi_hora_fin TIMESTAMP NOT NULL,
    evi_horas_dictar INT NOT NULL,
    evi_valor_hora FLOAT NOT NULL,
    evi_valor_total_horas FLOAT NOT NULL,
    evi_tematica_dictada VARCHAR(100) NOT NULL,
    evi_numero_asistentes INT NOT NULL,
    evi_direccion VARCHAR(255) NOT NULL,
    evi_estado ENUM('Realizada', 'Cancelada'),
    evi_evidencias LONGBLOB NOT NULL, -- son archivo pdf con las fotografias
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (res_id) REFERENCES responsable_rutas(res_id) ON DELETE CASCADE,
    FOREIGN KEY (pro_id) REFERENCES programaciones_grupales(pro_id) ON DELETE CASCADE
);
-- Tabla de evidencias_individuales
CREATE TABLE evidencias_individuales (
	eviin_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    proin_id INT NOT NULL, -- Relacion con programaciones_individuales
    res_id INT NOT NULL, -- Relación con responsable_rutas
    eviin_mes VARCHAR(100) NOT NULL,
    eviin_fecha TIMESTAMP NOT NULL,
    eviin_hora_inicio TIMESTAMP NOT NULL,
    eviin_hora_fin TIMESTAMP NOT NULL,
    eviin_horas_dictar INT NOT NULL,
    eviin_valor_hora FLOAT NOT NULL,
    eviin_valor_total_horas FLOAT NOT NULL,
    eviin_tematica_dictada VARCHAR(100) NOT NULL,
    eviin_numero_asistentes INT NOT NULL,
    eviin_direccion VARCHAR(255) NOT NULL,
    eviin_estado ENUM('Realizada', 'Cancelada'),
    eviin_razon_social INT NOT NULL,
    eviin_nombre_asesorado VARCHAR(255) NOT NULL,
    eviin_identificacion_asesorado INT NOT NULL,
    eviin_evidencias LONGBLOB NOT NULL, -- son archivo pdf con las fotografias
    evi_pantallazo_avanza LONGBLOB NOT NULL,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (res_id) REFERENCES responsable_rutas(res_id) ON DELETE CASCADE,
    FOREIGN KEY (proin_id) REFERENCES programaciones_individuales(proin_id) ON DELETE CASCADE
);
CREATE TABLE informes (
	info_id INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    oamp INT NOT NULL, -- Relación con contratos
    usu_cedula INT NOT NULL, -- Relación con usuarios_info (consultores)
    evi_id INT, -- NUEVO: Relación con evidencias_grupales
    eviin_id INT, -- NUEVO: Relación con evidencias_individuales
    info_seg_mes VARCHAR(50) NOT NULL,
    info_seg_ejecucion_horas INT NOT NULL,
    info_valor_total_contrato FLOAT NOT NULL,
    info_ejecutado_mes FLOAT NOT NULL,
    info_ejecutado_acumulado FLOAT NOT NULL,
    info_valor_saldo_contrato FLOAT NOT NULL,
    info_total_horas FLOAT NOT NULL,
    info_horas_ejecutadas_mes FLOAT NOT NULL,
    info_horas_ejecutadas_acumulado FLOAT NOT NULL,
    info_horas_saldo_contrato FLOAT NOT NULL,
    FOREIGN KEY (oamp) REFERENCES contratos(oamp) ON DELETE CASCADE,
    FOREIGN KEY (usu_cedula) REFERENCES usuarios_info(usu_cedula) ON DELETE CASCADE,
    FOREIGN KEY (evi_id) REFERENCES evidencias_grupales(evi_id) ON DELETE SET NULL,
    FOREIGN KEY (eviin_id) REFERENCES evidencias_individuales(eviin_id) ON DELETE SET NULL
);

#Trigers informe
DELIMITER $$

CREATE TRIGGER trg_auto_informe_grupal
AFTER INSERT ON programaciones_grupales
FOR EACH ROW
BEGIN
  DECLARE horas_mes INT DEFAULT 0;
  DECLARE ejecutado_mes FLOAT DEFAULT 0;
  DECLARE valor_hora FLOAT DEFAULT 0;
  DECLARE valor_total FLOAT;
  DECLARE horas_acumuladas INT DEFAULT 0;
  DECLARE ejecutado_acumulado FLOAT DEFAULT 0;

  IF NEW.pro_estado = 'Realizada' THEN

    IF NEW.val_reg_id IS NULL THEN
      SELECT vh.val_hor_precio INTO valor_hora
      FROM valor_horas vh
      JOIN rutas r ON vh.val_hor_id = r.val_hor_id
      JOIN programa_ruta pr ON pr.rut_id = r.rut_id
      WHERE pr.pr_id = NEW.pr_id;
    ELSE
      SELECT
        CASE
          WHEN NEW.pro_horas_dictar = 0 THEN val_reg_sin_dictar
          WHEN NEW.pro_horas_dictar = 2 THEN val_reg_dos_horas
          WHEN NEW.pro_horas_dictar = 3 THEN val_reg_tres_horas
          WHEN NEW.pro_horas_dictar >= 4 THEN val_reg_cuatro_mas_horas
          ELSE val_reg_hora_base
        END
      INTO valor_hora
      FROM valor_horas_region
      WHERE val_reg_id = NEW.val_reg_id;
    END IF;

    SELECT oamp_valor_total INTO valor_total
    FROM contratos
    WHERE oamp = NEW.oamp;

    SELECT SUM(pro_horas_dictar) INTO horas_mes
    FROM programaciones_grupales
    WHERE usu_cedula = NEW.usu_cedula AND pro_mes = NEW.pro_mes AND pro_estado = 'Realizada';

    SET ejecutado_mes = horas_mes * valor_hora;

    SELECT SUM(pro_horas_dictar) INTO horas_acumuladas
    FROM programaciones_grupales
    WHERE usu_cedula = NEW.usu_cedula AND pro_estado = 'Realizada';

    SET ejecutado_acumulado = horas_acumuladas * valor_hora;

    INSERT INTO informes (
      oamp, usu_cedula, evi_id, info_seg_mes, info_seg_ejecucion_horas,
      info_valor_total_contrato, info_ejecutado_mes, info_ejecutado_acumulado,
      info_valor_saldo_contrato, info_total_horas,
      info_horas_ejecutadas_mes, info_horas_ejecutadas_acumulado,
      info_horas_saldo_contrato
    )
    VALUES (
      NEW.oamp, NEW.usu_cedula, NULL, NEW.pro_mes, horas_mes,
      valor_total, ejecutado_mes, ejecutado_acumulado,
      valor_total - ejecutado_acumulado, horas_acumuladas,
      horas_mes, horas_acumuladas,
      (valor_total / valor_hora) - horas_acumuladas
    );
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_auto_informe_individual
AFTER INSERT ON programaciones_individuales
FOR EACH ROW
BEGIN
  DECLARE horas_mes INT DEFAULT 0;
  DECLARE ejecutado_mes FLOAT DEFAULT 0;
  DECLARE valor_hora FLOAT DEFAULT 0;
  DECLARE valor_total FLOAT;
  DECLARE horas_acumuladas INT DEFAULT 0;
  DECLARE ejecutado_acumulado FLOAT DEFAULT 0;

  IF NEW.proin_estado = 'Realizada' THEN

    IF NEW.val_reg_id IS NULL THEN
      SELECT vh.val_hor_precio INTO valor_hora
      FROM valor_horas vh
      JOIN rutas r ON vh.val_hor_id = r.val_hor_id
      JOIN programa_ruta pr ON pr.rut_id = r.rut_id
      WHERE pr.pr_id = NEW.pr_id;
    ELSE
      SELECT
        CASE
          WHEN NEW.proin_horas_dictar = 0 THEN val_reg_sin_dictar
          WHEN NEW.proin_horas_dictar = 2 THEN val_reg_dos_horas
          WHEN NEW.proin_horas_dictar = 3 THEN val_reg_tres_horas
          WHEN NEW.proin_horas_dictar >= 4 THEN val_reg_cuatro_mas_horas
          ELSE val_reg_hora_base
        END
      INTO valor_hora
      FROM valor_horas_region
      WHERE val_reg_id = NEW.val_reg_id;
    END IF;

    SELECT oamp_valor_total INTO valor_total
    FROM contratos
    WHERE oamp = NEW.oamp;

    SELECT SUM(proin_horas_dictar) INTO horas_mes
    FROM programaciones_individuales
    WHERE usu_cedula = NEW.usu_cedula AND proin_mes = NEW.proin_mes AND proin_estado = 'Realizada';

    SET ejecutado_mes = horas_mes * valor_hora;

    SELECT SUM(proin_horas_dictar) INTO horas_acumuladas
    FROM programaciones_individuales
    WHERE usu_cedula = NEW.usu_cedula AND proin_estado = 'Realizada';

    SET ejecutado_acumulado = horas_acumuladas * valor_hora;

    INSERT INTO informes (
      oamp, usu_cedula, eviin_id, info_seg_mes, info_seg_ejecucion_horas,
      info_valor_total_contrato, info_ejecutado_mes, info_ejecutado_acumulado,
      info_valor_saldo_contrato, info_total_horas,
      info_horas_ejecutadas_mes, info_horas_ejecutadas_acumulado,
      info_horas_saldo_contrato
    )
    VALUES (
      NEW.oamp, NEW.usu_cedula, NULL, NEW.proin_mes, horas_mes,
      valor_total, ejecutado_mes, ejecutado_acumulado,
      valor_total - ejecutado_acumulado, horas_acumuladas,
      horas_mes, horas_acumuladas,
      (valor_total / valor_hora) - horas_acumuladas
    );
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_update_informe_grupal
BEFORE UPDATE ON programaciones_grupales
FOR EACH ROW
BEGIN
  DECLARE horas_mes INT DEFAULT 0;
  DECLARE ejecutado_mes FLOAT DEFAULT 0;
  DECLARE valor_hora FLOAT DEFAULT 0;
  DECLARE valor_total FLOAT;
  DECLARE horas_acumuladas INT DEFAULT 0;
  DECLARE ejecutado_acumulado FLOAT DEFAULT 0;

  IF NEW.pro_estado = 'Realizada' AND OLD.pro_estado <> 'Realizada' THEN

    IF NEW.val_reg_id IS NULL THEN
      SELECT vh.val_hor_precio INTO valor_hora
      FROM valor_horas vh
      JOIN rutas r ON vh.val_hor_id = r.val_hor_id
      JOIN programa_ruta pr ON pr.rut_id = r.rut_id
      WHERE pr.pr_id = NEW.pr_id;
    ELSE
      SELECT
        CASE
          WHEN NEW.pro_horas_dictar = 0 THEN val_reg_sin_dictar
          WHEN NEW.pro_horas_dictar = 2 THEN val_reg_dos_horas
          WHEN NEW.pro_horas_dictar = 3 THEN val_reg_tres_horas
          WHEN NEW.pro_horas_dictar >= 4 THEN val_reg_cuatro_mas_horas
          ELSE val_reg_hora_base
        END
      INTO valor_hora
      FROM valor_horas_region
      WHERE val_reg_id = NEW.val_reg_id;
    END IF;

    SELECT oamp_valor_total INTO valor_total
    FROM contratos
    WHERE oamp = NEW.oamp;

    SELECT SUM(pro_horas_dictar) INTO horas_mes
    FROM programaciones_grupales
    WHERE usu_cedula = NEW.usu_cedula AND pro_mes = NEW.pro_mes AND pro_estado = 'Realizada';

    SET ejecutado_mes = horas_mes * valor_hora;

    SELECT SUM(pro_horas_dictar) INTO horas_acumuladas
    FROM programaciones_grupales
    WHERE usu_cedula = NEW.usu_cedula AND pro_estado = 'Realizada';

    SET ejecutado_acumulado = horas_acumuladas * valor_hora;

    INSERT INTO informes (
      oamp, usu_cedula, evi_id, info_seg_mes, info_seg_ejecucion_horas,
      info_valor_total_contrato, info_ejecutado_mes, info_ejecutado_acumulado,
      info_valor_saldo_contrato, info_total_horas,
      info_horas_ejecutadas_mes, info_horas_ejecutadas_acumulado,
      info_horas_saldo_contrato
    )
    VALUES (
      NEW.oamp, NEW.usu_cedula, NULL, NEW.pro_mes, horas_mes,
      valor_total, ejecutado_mes, ejecutado_acumulado,
      valor_total - ejecutado_acumulado, horas_acumuladas,
      horas_mes, horas_acumuladas,
      (valor_total / valor_hora) - horas_acumuladas
    );
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER trg_update_informe_individual
BEFORE UPDATE ON programaciones_individuales
FOR EACH ROW
BEGIN
  DECLARE horas_mes INT DEFAULT 0;
  DECLARE ejecutado_mes FLOAT DEFAULT 0;
  DECLARE valor_hora FLOAT DEFAULT 0;
  DECLARE valor_total FLOAT;
  DECLARE horas_acumuladas INT DEFAULT 0;
  DECLARE ejecutado_acumulado FLOAT DEFAULT 0;

  IF NEW.proin_estado = 'Realizada' AND OLD.proin_estado <> 'Realizada' THEN

    IF NEW.val_reg_id IS NULL THEN
      SELECT vh.val_hor_precio INTO valor_hora
      FROM valor_horas vh
      JOIN rutas r ON vh.val_hor_id = r.val_hor_id
      JOIN programa_ruta pr ON pr.rut_id = r.rut_id
      WHERE pr.pr_id = NEW.pr_id;
    ELSE
      SELECT
        CASE
          WHEN NEW.proin_horas_dictar = 0 THEN val_reg_sin_dictar
          WHEN NEW.proin_horas_dictar = 2 THEN val_reg_dos_horas
          WHEN NEW.proin_horas_dictar = 3 THEN val_reg_tres_horas
          WHEN NEW.proin_horas_dictar >= 4 THEN val_reg_cuatro_mas_horas
          ELSE val_reg_hora_base
        END
      INTO valor_hora
      FROM valor_horas_region
      WHERE val_reg_id = NEW.val_reg_id;
    END IF;

    SELECT oamp_valor_total INTO valor_total
    FROM contratos
    WHERE oamp = NEW.oamp;

    SELECT SUM(proin_horas_dictar) INTO horas_mes
    FROM programaciones_individuales
    WHERE usu_cedula = NEW.usu_cedula AND proin_mes = NEW.proin_mes AND proin_estado = 'Realizada';

    SET ejecutado_mes = horas_mes * valor_hora;

    SELECT SUM(proin_horas_dictar) INTO horas_acumuladas
    FROM programaciones_individuales
    WHERE usu_cedula = NEW.usu_cedula AND proin_estado = 'Realizada';

    SET ejecutado_acumulado = horas_acumuladas * valor_hora;

    INSERT INTO informes (
      oamp, usu_cedula, eviin_id, info_seg_mes, info_seg_ejecucion_horas,
      info_valor_total_contrato, info_ejecutado_mes, info_ejecutado_acumulado,
      info_valor_saldo_contrato, info_total_horas,
      info_horas_ejecutadas_mes, info_horas_ejecutadas_acumulado,
      info_horas_saldo_contrato
    )
    VALUES (
      NEW.oamp, NEW.usu_cedula, NULL, NEW.proin_mes, horas_mes,
      valor_total, ejecutado_mes, ejecutado_acumulado,
      valor_total - ejecutado_acumulado, horas_acumuladas,
      horas_mes, horas_acumuladas,
      (valor_total / valor_hora) - horas_acumuladas
    );
  END IF;
END$$

DELIMITER ;
INSERT INTO cuentas (usu_correo, usu_contraseña, usu_tipo, usu_fecha_registro, usu_activo)
VALUES 
('admin@demo.com', '123456', 'Administrador', NOW(), 1),
('consultor@demo.com', '123456', 'Consultor', NOW(), 1),

('profesional@demo.com', '123456', 'Profesional', NOW(), 1),
('reclutador@demo.com', '123456', 'Reclutador', NOW(), 1);

INSERT INTO areas_conocimiento (are_descripcion)
VALUES 
('Finanzas corporativas, Proyecciones financieras, construcción y analisis de indicadores financieros, valoración de empresas, inversión de riesgo. Atención e implementación de programas de intervención personal y familiar psicosocial'),
('Innovación, Metodologías Agiles, Manejo de herramientas IA'),
('Marketing, Modelo de negocio, Emprendimiento, Financiero,Legal, Portafolio de Productos, Estrategia de Marca, Portafolio de Productos,Pricing y Monetización'),
('Financiera'),
('Venta, Marketing, organizacional, comunicación'),
('Mercadeo y ventas, estrategia empresarial. financiero y financiamiento, producción y calidad, marketing digital, contratación laboral y seguridad social'),
('Cumplimmiento normativo y tributario, aplicación de tipos de  contratos laborales apropiados para el sector construcion, prevencion de riesgos laborales y estrategias de negociación con sindicatos o empleados'),
('Implementación de tecnicas avanzadas de costeo, analisis de rentabilidad, ventas y mercadeo en el sector turismo'),
('Gestión financiera, planificación financiera, presupuestación, analisis de margen de contribución, control financiero,y gestion de riesgo, metodologia de analisis de datos y uso de herramientas de modelado'),
('Enfocados en IA'),
('Mercadeo en Ventas enfocados en IA, analisis de datos y plataformas de automatización'),
('Gestión de cadena de suministro, sustema de gestión de inventarios, (ERP, WMS), automatización de procesos logisticos, soluciones de trazabilidad, anaisis de datos para optimización de rutas y logistica inversa'),
('Líneas de productividad operacional, productividad laboral, gestión de la calidad y gestión logística'),
('Estrategias para generar propuestas de valor diferenciadas, conevtar emocionalmente con el publico objetivo y fidelización de clientes'),
('Habilidaes de servicio al cliente, psicologia del cliente, empátia, técnicas de comunicación interpersonal, entrenamiento de ventas sugestivas'),
('Estrategias de mercadeo, plan de ventas y plan de mercadeo, marketing digital'),
('Apicación de la IA en las empresas, herramientas y tecnologias de la IA para potenciar el marketing y la comunicación digital, desarrollo de chatbot o asistente virtual para la meora de la experiencia al cliente , herramientas y recursos dispónibles para el desarrollo de la IA conversacional en la empresas, herramientas y plataformas disponibles para el analisis de datos y prediccion con IA'),
('Atracción y retención del talento humano y administración del talento humano'),
('Tributario y Financiero'),
('Moda e Industrias Creativas y Culturales, Seguridad Alimentaria, TIC, Turismo, Consultoría, Gestión del Talento Humano, Servicios Financieros, Cadenas de Abastecimiento, Salud, Sector Farmacéutico, Construcción y Energía, Servicios Financieros y Logística, Cosmética, y otros servicios empresariales'),
('Economía, administración de empresas, finanzas internacionales, comercio exterior, negocios internacionales, relaciones internacionales o afines'),
('Storytelling y herramientas para la mentoría-Creatividad e innovación-Comunicación y Liderazgo-Gestión del talento en la era de la  IA-:  Coaching de equipos directivos-Modelos de negocios disruptivos');

INSERT INTO usuarios_info (usu_cedula, usu_id, are_id, usu_primer_nombre, usu_segundo_nombre, usu_primer_apellido, usu_segundo_apellido, usu_telefono, usu_direccion)
VALUES 
(1018425430, 1, 1, 'Camilo', 'Andrés', 'Garzón', 'Guitiérrez', '3001234567', 'Calle 123'),
(1002, 2, 2, 'Laura', NULL, 'Mendoza', 'Torres', '3012345678', 'Carrera 45'),
(1003, 3, 3, 'Diana', 'Carolina', 'Ortiz', 'García', '3200000000', 'Av. Las Palmas'),
(1004, 4, 4, 'Esteban', NULL, 'Ruiz', 'Jiménez', '3100000001', 'Cra 11 #45-67');

INSERT INTO modalidades (mod_nombre)
VALUES ('Virtual'), ('Presencial'), ('Híbrido');

INSERT INTO valor_horas (mod_id, val_hor_clasificacion, val_hor_precio)
VALUES 
(1, 'Internacionalización virtual', 90000),
(1, 'Internacionalización presencial', 95000),
(2, 'Innovación virtual', 90000),
(2, 'Innovación presencial', 95000),
(2, 'Presencial Bogotá y Soacha urbano', 85000),
(3, 'Otras', 80000);

INSERT INTO regiones (reg_id)
VALUES 
('REG01'),
('REG02'),
('REG03'),
('REG04');

INSERT INTO municipios (reg_id, mun_nombre)
VALUES
('REG01','Cajicá'),
('REG01','Chía'),
('REG01','Cogua'),
('REG01','Cota'),
('REG01','Gachancipá'),
('REG01','Granada'),
('REG01','La Calera'),
('REG01','Nemocón'),
('REG01','Sibaté'),
('REG01','Soacha rural'),
('REG01','Sopó'),
('REG01','Tabio'),
('REG01','Tenjo'),
('REG01','Tocancipá'),
('REG01','Zipaquirá'),
('REG02','Choachí'),
('REG02','Chocontá'),
('REG02','Gachetá'),
('REG02','Guasca'),
('REG02','Guatavita'),
('REG02','Machetá'),
('REG02','Manta'),
('REG02','Sesquilé'),
('REG02','Suesca'),
('REG02','Tibiritá'),
('REG02','Villa Pinzón'),
('REG03','Arbeláez'),
('REG03','Cabrera'),
('REG03','Cáqueza'),
('REG03','Chipaque'),
('REG03','Fómeque'),
('REG03','Fosca'),
('REG03','Fusagasugá'),
('REG03','Gachalá'),
('REG03','Gama'),
('REG03','Guayabetal'),
('REG03','Gutiérrez'),
('REG03','Junín'),
('REG03','Medina'),
('REG03','Pandi'),
('REG03','Pasca'),
('REG03','Quetame'),
('REG03','San Bernardo'),
('REG03','Silvania'),
('REG03','Tibacuy'),
('REG03','Ubalá'),
('REG03','Ubaque'),
('REG03','Une'),
('REG03','Venecia'),
('REG04','Carmen De Carupa'),
('REG04','Cucunubá'),
('REG04','Fúquene'),
('REG04','Guachetá'),
('REG04','Lenguazaque'),
('REG04','Simijaca'),
('REG04','Susa'),
('REG04','Sutatausa'),
('REG04','Tausa'),
('REG04','Ubaté');


INSERT INTO valor_horas_region (reg_id, val_reg_hora_base, val_reg_traslado, val_reg_sin_dictar, val_reg_dos_horas, val_reg_tres_horas, val_reg_cuatro_mas_horas)
VALUES 
('REG01', 90000, 30000, 30000, 105000, 100000, 97500),
('REG02', 95000, 60000, 60000, 125000, 115000, 110000),
('REG03', 100000, 85000, 85000, 142500, 128333, 121250),
('REG04', 105000, 110000, 110000, 160000, 141666, 132500);

INSERT INTO sectores (sec_cod, are_id, sec_nombre,sec_total_horas)
VALUES 
(1, 1,'Economia popular', 1310),
(2, 2,'Innovación', 460),
(3, 3,'Bogota Emprende  y Cundinamarca Emprende', 1600),
(4, 4,'Estrategia Financiera y Rendición de Cuentas para el Sector Moda e Industrias Creativas y Culturales', 818),
(5, 5,'Fortalecimiento de Equipos de Venta para el Sector Moda', 765),
(6, 6,'Programación abierta y region', 1142),
(7, 7,'Gestión del Talento Humano para el sector construcción', 240),
(8, 8,'Excelencia para el sector Turismo', 540),
(9, 9,'Proyectos financieros con proposito y Gestion financiera en empresas de servicios empresariales', 846),
(10, 10,'Transformación digital', 128),
(11, 11,'Tecnología en modelos de negocio y servicios de Consultoria', 510),
(12, 12,'Tecnología en Cadena de abastecimiento-(Logistica)', 854),
(13, 13,'Programa de Desarrollo proveedores', 1182),
(14, 14,'Marketing Experiencial', 1044),
(15, 15,'Servicio al Cliente para el sector gastronomico', 192),
(16, 16,'Mercadeo para Impulsar el Crecimiento', 192),
(17, 17,'Inteligencia Artificial', 336),
(18, 18,'Fidelización y atracción del Talento Humano', 336),
(19, 19,'Indicadores de gestión', 364),
(20, 19,'Metodologias de mejoramiento de la Productividad', 364),
(21, 19,'Gestión Finaciero', 364),
(22, 20,'Talleres', 272),
(23, 20,'Asesorias individales', 100),
(24, 21,'Internalización-Entregable-Preseleccion de mercado', 896),
(25, 21,'Internalización-Entregable-MarketFit', 896),
(26, 21,'Internalización-Entregable-One Pager', 0),
(27, 22,'Escuela de mentores', 60);

INSERT INTO actividades (act_tipo)
VALUES ('TALLERES, ASESORÍAS GRUPALES O CÁPSULAS'), ('ASESORÍAS INDIVIDUALES');

INSERT INTO rutas (val_hor_id, rut_nombre, rut_descripcion, rut_candidatos, rut_total_horas, rut_promedio_horas_candidato)
VALUES 
(6,'ECONOMIA POPULAR', 'Ruta para formación en economia popular', 10, 1310, 131),
(3,'INNOVACIÓN-VIRTUAL', 'Ruta para formación en innovación digital', 5, 460, 92),
(4,'INNOVACIÓN-PRESENCIAL', 'Ruta para formación en innovación digital', 5, 460, 92),
(6,'EMPRENDIMIENTO', 'Ruta para formación en emprendimiento', 10, 1600, 160),
(6,'ESTRATEGIA FINANCIERA Y RENDICIÓN DE CUENTAS PARA EL SECTOR MODA E INDUSTRIAS CREATIVAS Y CULTURALES', 'Ruta para formación en estrategia financiera y rendición de cuentas para el sector moda e industrias creativas y culturales', 818, 10, 81.8),
(6,'FORTALECIMIENTO DE EQUIPOS DE VENTA PARA EL SECTOR MODA', 'Ruta para formación en fortalecimiento de equipos de venta para el sector moda', 9, 765, 85),
(6,'PROGRAMACIÓN ABIERTA Y REGIÓN', 'Ruta para formación en programación abierta y región', 10, 1142, 114.2),
(6,'CICLOS FOCALIZADOS - MULTISECTORIAL', 'Ruta para formación en ciclos focalizados – multisectorial', 50, 4300, 86),
(6,'SECTOR ALIMENTOS', 'Ruta para formación en sector alimentos', 21, 1908, 90.8),
(6,'FINANCIERO Y PRODUCTIVIDAD', 'Ruta para formación en financiero y productividad', 6, 372, 62),
(1,'INTERNACIONALIZACIÓN-VIRTUAL-TALLERES', 'Ruta para formación en internacionalización', 6, 372, 62),
(2,'INTERNACIONALIZACIÓN-PRESENCIAL-TALLERES', 'Ruta para formación en internacionalización', 6, 372, 62),
(1,'INTERNACIONALIZACIÓN-VIRTUAL-ASESORIAS', 'Ruta para formación en internacionalización', 6, 372, 62),
(2,'INTERNACIONALIZACIÓN-PRESENCIAL-ASESOARIAS', 'Ruta para formación en internacionalización', 6, 372, 62),
(6,'PLAN DE INTERNALIZACIÓN', 'Ruta para formación en plan de internalización', 13, 896, 69),
(6,'ESCUELA DE MENTORES, VOLUNTARIADO Y PROGRAMACIÓN REGIÓN (FORO PRESIDENTES)', 'Ruta para formación en escuela de mentores, voluntariado y programación región (foro presidentes)', 4, 60, 15);

INSERT INTO ruta_sector (rut_id, sec_cod)
VALUES 
(1,1),
(2,2),
(3,2),
(4,3),
(5,4),
(6,5),
(7,6),
(8,7),
(8,8),
(8,9),
(8,10),
(8,11),
(8,12),
(8,13),
(9,14),
(9,15),
(9,16),
(9,17),
(9,18),
(10,19),
(10,20),
(10,21),
(11,22),
(12,22),
(13,23),
(14,23),
(15,24),
(15,25),
(15,26),
(16,27);

INSERT INTO programas (prog_nombre, prog_total_horas)
VALUES 
('Crecimiento Empresarial', 1310),
('Emprendimiento, Ruta Bogotá/Cundinamarca Emprende, Innovación', 2060),
('Consolidación y escalamiento empresarial', 10565),
('Foro presidentes', 60);

INSERT INTO programa_ruta (prog_id, rut_id)
VALUES 
(1,1),
(2,2),
(2,3),
(2,4),
(3,5),
(3,6),
(3,7),
(3,8),
(3,9),
(3,10),
(3,11),
(3,12),
(3,13),
(3,14),
(3,15),
(4,16);

INSERT INTO hojas_de_vida (
    usu_cedula, hv_archivo, hv_formato, hv_fecha_carga,
    hv_score_ia, hv_resumen_automatico, hv_verificado
) VALUES (
    1018425430, 'archivo.pdf', 'PDF', NOW(),
    87.5, 'Ingeniero con experiencia en transformación digital y asesoría a pymes.',
    1
);
INSERT INTO vacantes (
    usu_cedula, rut_id, vac_titulo, vac_descripcion,
    vac_renumeracion, vac_estado, vac_fecha_publicacion, vac_fecha_limite_postulacion
) VALUES (
    1018425430, 1, 'Asesor Innovación Digital',
    'Se requiere consultor para dictar talleres de innovación tecnológica a empresas.',
    1500000, 'Publicada', '2025-03-01', '2025-03-15'
);
INSERT INTO postulaciones (
    usu_cedula, vac_id, hv_id, pos_fecha_postulacion,
    pos_estado, pos_puntuacion_match, pos_comentarios_reclutador
) VALUES (
    1018425430, 1, 1, NOW(),
    'Preseleccionada', 88.2, 'El perfil se ajusta muy bien a la vacante'
);

INSERT INTO contratos (oamp, pos_id, usu_cedula, oamp_terminos, oamp_fecha_generacion, oamp_estado, oamp_valor_total, oamp_documento_firmado)
VALUES 
(2001, 1, 1018425430, 'Contrato para dictar talleres de tecnología', NOW(), 'Enviado', 150000000,'archivofirmado.pdf');

INSERT INTO responsable_rutas (rut_id, res_nombre, res_rol, res_correo, res_telefono)
VALUES 
(1, 'Andreina Ustate', 'Profesional', 'austate@uniempresarial.edu.co', '3052512922'),
(1, 'Alejandra Buitrago', 'Auxiliar', 'contratofortalecimiento@uniemoresarial.edu.co', '3042685388'),
(2, 'Julie Sáenz Castañeda', 'Profesional', 'jsaenzc@uniempresarial.edu.co', '3118131235'),
(3, 'Julie Sáenz Castañeda', 'Profesional', 'jsaenzc@uniempresarial.edu.co', '3118131235'),
(4, 'Tatiana Prieto', 'Profesional', 'tprieto@uniempresarial.edu.co', '3012748031'),
(5, 'Tatiana Prieto', 'Profesional', 'tprieto@uniempresarial.edu.co', '3012748031'),
(6, 'Andreina Ustate', 'Profesional', 'austate@uniempresarial.edu.co', '3052512922'),
(6, 'Alejandra Buitrago', 'Auxiliar', 'contratofortalecimiento@uniemoresarial.edu.co', '3042685388');

-- Caso 1: Solo se aplica precio por región (val_reg_id definido, pr_id definido pero se ignora su precio)
INSERT INTO programaciones_grupales (
    usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, pro_codigo_agenda,
    pro_tematica, pro_mes, pro_fecha_formacion, pro_hora_inicio, pro_hora_fin,
    pro_horas_dictar, pro_coordinador_ccb, pro_direccion, pro_enlace, pro_estado,
    pro_numero_hora_pagar, pro_numero_hora_cobrar, pro_valor_hora,
    pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
    pro_entregables, pro_dependencia, pro_observaciones
) VALUES (
    1002, 2, 3, 2001, 1, 1, 1111, 'Planeación Financiera', 'Enero', '2025-01-10',
    '09:00:00', '12:00:00', 3, 'Andrea Cortés', 'Calle 45 #7-30', 'https://link.com', 'Realizada',
    3, 3, 142500, 427500, 427500, 'Plan financiero entregado', 'Uniempresarial', 'Con alta participación'
);

-- Caso 2: Solo se aplica precio por ruta (val_reg_id es NULL)
INSERT INTO programaciones_grupales (
    usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, pro_codigo_agenda,
    pro_tematica, pro_mes, pro_fecha_formacion, pro_hora_inicio, pro_hora_fin,
    pro_horas_dictar, pro_coordinador_ccb, pro_direccion, pro_enlace, pro_estado,
    pro_numero_hora_pagar, pro_numero_hora_cobrar, pro_valor_hora,
    pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
    pro_entregables, pro_dependencia, pro_observaciones
) VALUES (
    1003, 3, NULL, 2001, 1, 2, 2222, 'Taller Innovación', 'Febrero', '2025-02-14',
    '08:00:00', '10:00:00', 2, 'Juan Pérez', 'Carrera 30 #8-20', 'https://meet.com', 'Realizada',
    2, 2, 90000, 180000, 180000, 'Informe entregado', 'CCB', 'Bien ejecutado'
);

-- Caso 3: Ambos definidos pero precio tomado por región
INSERT INTO programaciones_grupales (
    usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, pro_codigo_agenda,
    pro_tematica, pro_mes, pro_fecha_formacion, pro_hora_inicio, pro_hora_fin,
    pro_horas_dictar, pro_coordinador_ccb, pro_direccion, pro_enlace, pro_estado,
    pro_numero_hora_pagar, pro_numero_hora_cobrar, pro_valor_hora,
    pro_valor_total_hora_pagar, pro_valor_total_hora_ccb,
    pro_entregables, pro_dependencia, pro_observaciones
) VALUES (
    1004, 5, 4, 2001, 2, 2, 3333, 'Liderazgo y Gestión', 'Marzo', '2025-03-05',
    '10:00:00', '13:00:00', 3, 'Sara Gómez', 'Calle 12 #5-15', 'https://zoom.com', 'Realizada',
    3, 3, 160000, 480000, 480000, 'Lista de asistencia y memorias', 'Uniempresarial', 'Excelente desarrollo'
);

-- Caso 1: Solo región (sin usar precio de ruta)
INSERT INTO programaciones_individuales (
    usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, proin_codigo_agenda,
    proin_tematica, proin_mes, proin_fecha_formacion, proin_hora_inicio, proin_hora_fin,
    proin_horas_dictar, proin_coordinador_ccb, proin_direccion, proin_enlace,
    proin_nombre_empresario, proin_identificacion_empresario, proin_estado, proin_numero_hora_pagar, proin_numero_hora_cobrar,
    proin_valor_hora, proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
    proin_entregables, proin_dependencia, proin_observaciones
) VALUES (
    1002, 2, 2, 2001, 2, 2, 6666, 'Asesoría Legal', 'Febrero', '2025-02-05',
    '09:00:00', '12:00:00', 3, 'Carlos Díaz', 'Calle 34 #8-90', 'https://meet.google.com/leg123',
    'Carlos Duarte', '12155844', 'Realizada', 3, 3, 125000, 375000, 375000,
    'Documento asesoría', 'CCB', 'Sesión completada sin novedades'
);

-- Caso 2: Solo ruta (val_reg_id es NULL)
INSERT INTO programaciones_individuales (
    usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, proin_codigo_agenda,
    proin_tematica, proin_mes, proin_fecha_formacion, proin_hora_inicio, proin_hora_fin,
    proin_horas_dictar, proin_coordinador_ccb, proin_direccion, proin_enlace,
    proin_nombre_empresario, proin_identificacion_empresario, proin_estado, proin_numero_hora_pagar, proin_numero_hora_cobrar,
    proin_valor_hora, proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
    proin_entregables, proin_dependencia, proin_observaciones
) VALUES (
    1003, 3, NULL, 2001, 2, 2, 7777, 'Asesoría IA', 'Marzo', '2025-03-15',
    '10:00:00', '12:00:00', 2, 'Lucía Herrera', 'Cra 45 #20-12', 'https://zoom.us/ia123',
    'Tatiana García', '548158484', 'Realizada', 2, 2, 90000, 180000, 180000,
    'Informe IA aplicado', 'Uniempresarial', 'Buena interacción con la empresa'
);

-- Caso 3: Ambos definidos pero precio tomado por región
INSERT INTO programaciones_individuales (
    usu_cedula, pr_id, val_reg_id, oamp, act_id, mod_id, proin_codigo_agenda,
    proin_tematica, proin_mes, proin_fecha_formacion, proin_hora_inicio, proin_hora_fin,
    proin_horas_dictar, proin_coordinador_ccb, proin_direccion, proin_enlace,
    proin_nombre_empresario, proin_identificacion_empresario, proin_estado, proin_numero_hora_pagar, proin_numero_hora_cobrar,
    proin_valor_hora, proin_valor_total_hora_pagar, proin_valor_total_hora_ccb,
    proin_entregables, proin_dependencia, proin_observaciones
) VALUES (
    1004, 4, 4, 2001, 2, 2, 8888, 'Mentoría en Branding', 'Abril', '2025-04-20',
    '14:00:00', '17:00:00', 3, 'Paula Gómez', 'Av. Caracas #20-30', 'https://teams.com/brandmentor',
    'Ana López', '58784864', 'Realizada', 3, 3, 160000, 480000, 480000,
    'Plantilla de branding entregada', 'CCB', 'Excelente participación y resultados'
);

-- Evidencia grupal 1
INSERT INTO evidencias_grupales (
    usu_cedula, pro_id, res_id, evi_mes, evi_fecha, evi_hora_inicio, evi_hora_fin,
    evi_horas_dictar, evi_valor_hora, evi_valor_total_horas,
    evi_tematica_dictada, evi_numero_asistentes, evi_direccion, evi_estado, evi_evidencias
) VALUES (
    1018425430, 1, 1, 'Enero', '2025-01-20 09:00:00', '2025-01-20 09:00:00', '2025-01-20 12:00:00',
    3, 85000, 255000,
    'Transformación digital en PYMES', 20, 'Calle 100 #45-32', 'Realizada', 'evidencia_grupal_1.pdf'
);

-- Evidencia grupal 2
INSERT INTO evidencias_grupales (
    usu_cedula, pro_id, res_id, evi_mes, evi_fecha, evi_hora_inicio, evi_hora_fin,
    evi_horas_dictar, evi_valor_hora, evi_valor_total_horas,
    evi_tematica_dictada, evi_numero_asistentes, evi_direccion, evi_estado, evi_evidencias
) VALUES (
    1002, 2, 2, 'Febrero', '2025-02-14 14:00:00', '2025-02-14 14:00:00', '2025-02-14 17:00:00',
    3, 90000, 270000,
    'Introducción a la Inteligencia Artificial', 25, 'Cra 15 #72-10', 'Realizada', 'evidencia_grupal_2.pdf'
);
-- Evidencia grupal 3
INSERT INTO evidencias_grupales (
    usu_cedula, pro_id, res_id, evi_mes, evi_fecha, evi_hora_inicio, evi_hora_fin,
    evi_horas_dictar, evi_valor_hora, evi_valor_total_horas,
    evi_tematica_dictada, evi_numero_asistentes, evi_direccion, evi_estado, evi_evidencias
) VALUES (
    1003, 3, 3, 'Marzo', '2025-03-05 08:30:00', '2025-03-05 08:30:00', '2025-03-05 11:30:00',
    3, 95000, 285000,
    'Gestión de Proyectos Ágiles', 18, 'Av. Suba #90-45', 'Realizada', 'evidencia_grupal_3.pdf'
);

-- Evidencia para proin_id = 1
INSERT INTO evidencias_individuales (
    usu_cedula, proin_id, res_id, eviin_mes, eviin_fecha, eviin_hora_inicio, eviin_hora_fin,
    eviin_horas_dictar, eviin_valor_hora, eviin_valor_total_horas, eviin_tematica_dictada,
    eviin_numero_asistentes, eviin_direccion, eviin_estado, eviin_razon_social,
    eviin_nombre_asesorado, eviin_identificacion_asesorado, eviin_evidencias, evi_pantallazo_avanza
) VALUES (
    1002, 1, 1, 'Febrero', '2025-02-05 09:00:00', '2025-02-05 09:00:00', '2025-02-05 12:00:00',
    3, 125000, 375000, 'Asesoría Legal',
    1, 'Calle 34 #8-90', 'Realizada', 900123, 'Carlos Duarte', 103456789,
    'evidencia1.pdf', 'pantallazo1.png'
);

-- Evidencia para proin_id = 2
INSERT INTO evidencias_individuales (
    usu_cedula, proin_id, res_id, eviin_mes, eviin_fecha, eviin_hora_inicio, eviin_hora_fin,
    eviin_horas_dictar, eviin_valor_hora, eviin_valor_total_horas, eviin_tematica_dictada,
    eviin_numero_asistentes, eviin_direccion, eviin_estado, eviin_razon_social,
    eviin_nombre_asesorado, eviin_identificacion_asesorado, eviin_evidencias, evi_pantallazo_avanza
) VALUES (
    1003, 2, 2, 'Marzo', '2025-03-15 10:00:00', '2025-03-15 10:00:00', '2025-03-15 12:00:00',
    2, 90000, 180000, 'Asesoría IA',
    1, 'Cra 45 #20-12', 'Realizada', 901234, 'Tatiana García', 104567890,
    'evidencia2.pdf', 'pantallazo2.png'
);

-- Evidencia para proin_id = 3
INSERT INTO evidencias_individuales (
    usu_cedula, proin_id, res_id, eviin_mes, eviin_fecha, eviin_hora_inicio, eviin_hora_fin,
    eviin_horas_dictar, eviin_valor_hora, eviin_valor_total_horas, eviin_tematica_dictada,
    eviin_numero_asistentes, eviin_direccion, eviin_estado, eviin_razon_social,
    eviin_nombre_asesorado, eviin_identificacion_asesorado, eviin_evidencias, evi_pantallazo_avanza
) VALUES (
    1004, 3, 3, 'Abril', '2025-04-20 14:00:00', '2025-04-20 14:00:00', '2025-04-20 17:00:00',
    3, 160000, 480000, 'Mentoría en Branding',
    1, 'Av. Caracas #20-30', 'Realizada', 902345, 'Ana López', 105678901,
    'evidencia3.pdf', 'pantallazo3.png'
);
INSERT INTO informes (
    oamp, usu_cedula, pro_id, proin_id,
    info_seg_mes, info_seg_ejecucion_horas,
    info_valor_total_contrato, info_ejecutado_mes, info_ejecutado_acumulado,
    info_valor_saldo_contrato, info_total_horas, info_horas_ejecutadas_mes,
    info_horas_ejecutadas_acumulado, info_horas_saldo_contrato
) VALUES
-- Informe para evidencia 1
(2001, 1018425430, 1, NULL, 'Enero', 3, 1000000, 255000, 255000, 745000, 20, 3, 3, 17),

-- Informe para evidencia 2
(2001, 1002, 2, NULL, 'Febrero', 3, 1000000, 270000, 525000, 475000, 20, 3, 6, 14),

-- Informe para evidencia 3
(2001, 1003, 3, NULL, 'Marzo', 3, 1000000, 285000, 810000, 190000, 20, 3, 9, 11);

INSERT INTO informes (
    oamp, usu_cedula, pro_id, proin_id,
    info_seg_mes, info_seg_ejecucion_horas,
    info_valor_total_contrato, info_ejecutado_mes, info_ejecutado_acumulado,
    info_valor_saldo_contrato, info_total_horas, info_horas_ejecutadas_mes,
    info_horas_ejecutadas_acumulado, info_horas_saldo_contrato
) VALUES
-- Informe evidencia individual 1
(2001, 1018425430, NULL, 1, 'Enero', 2, 1000000, 180000, 180000, 820000, 20, 2, 2, 18),

-- Informe evidencia individual 2
(2001, 1002, NULL, 2, 'Febrero', 2, 1000000, 190000, 370000, 630000, 20, 2, 4, 16),

-- Informe evidencia individual 3
(2001, 1003, NULL, 3, 'Marzo', 2, 1000000, 170000, 540000, 460000, 20, 2, 6, 14);