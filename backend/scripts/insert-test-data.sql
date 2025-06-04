-- Script para insertar datos de prueba en las tablas de programaciones
-- Ejecutar después de crear las tablas principales

-- Insertar actividades de prueba
INSERT IGNORE INTO actividades (act_tipo) VALUES 
('Talleres'),
('Asesorias grupales'),
('Capsulas'),
('Asesorias individuales');

-- Insertar modalidades de prueba (si no existe la tabla)
CREATE TABLE IF NOT EXISTS modalidades (
    mod_id INT AUTO_INCREMENT PRIMARY KEY,
    mod_nombre VARCHAR(100) NOT NULL
);

INSERT IGNORE INTO modalidades (mod_nombre) VALUES 
('Virtual'),
('Presencial'),
('Hibrido');

-- Insertar programa_ruta de prueba (si no existe la tabla)
CREATE TABLE IF NOT EXISTS programa_ruta (
    pr_id INT AUTO_INCREMENT PRIMARY KEY,
    pr_nombre VARCHAR(200) NOT NULL
);

INSERT IGNORE INTO programa_ruta (pr_nombre) VALUES 
('Crecimiento Empresarial'),
('Emprendimiento'),
('Innovación'),
('Sector Alimentos');

-- Insertar valor_horas_region de prueba (si no existe la tabla)
CREATE TABLE IF NOT EXISTS valor_horas_region (
    val_reg_id VARCHAR(50) PRIMARY KEY,
    val_reg_nombre VARCHAR(100) NOT NULL,
    val_reg_valor DECIMAL(10,2) NOT NULL
);

INSERT IGNORE INTO valor_horas_region (val_reg_id, val_reg_nombre, val_reg_valor) VALUES 
('REG001', 'Región 1 - Bogotá', 90000.00),
('REG002', 'Región 2 - Sabana Centro', 95000.00),
('REG003', 'Región 3 - Sabana Occidente', 100000.00);

-- Insertar contratos de prueba (si no existe la tabla)
CREATE TABLE IF NOT EXISTS contratos (
    oamp INT AUTO_INCREMENT PRIMARY KEY,
    oamp_numero VARCHAR(100) NOT NULL,
    oamp_descripcion VARCHAR(200)
);

INSERT IGNORE INTO contratos (oamp_numero, oamp_descripcion) VALUES 
('OAMP001', 'Contrato de Servicios Profesionales 2024'),
('OAMP002', 'Contrato Marco de Consultorías'),
('OAMP003', 'Contrato Regional Sabana');

-- Insertar usuarios_info de prueba (si no existe la tabla)
CREATE TABLE IF NOT EXISTS usuarios_info (
    usu_cedula INT PRIMARY KEY,
    usu_nombre VARCHAR(100) NOT NULL,
    usu_apellido VARCHAR(100) NOT NULL,
    usu_telefono VARCHAR(20),
    usu_email VARCHAR(150),
    usu_especialidad VARCHAR(200)
);

INSERT IGNORE INTO usuarios_info (usu_cedula, usu_nombre, usu_apellido, usu_telefono, usu_email, usu_especialidad) VALUES 
(12345678, 'Juan', 'Pérez', '+57 300 123 4567', 'juan.perez@ccb.com', 'Desarrollo Empresarial'),
(87654321, 'María', 'González', '+57 300 765 4321', 'maria.gonzalez@ccb.com', 'Innovación y Tecnología'),
(11223344, 'Carlos', 'Rodríguez', '+57 300 112 2334', 'carlos.rodriguez@ccb.com', 'Finanzas Empresariales');

-- Verificar que todas las tablas están creadas y con datos
SELECT 'Actividades:' as tabla, COUNT(*) as registros FROM actividades
UNION ALL
SELECT 'Modalidades:', COUNT(*) FROM modalidades
UNION ALL
SELECT 'Programa_ruta:', COUNT(*) FROM programa_ruta
UNION ALL
SELECT 'Valor_horas_region:', COUNT(*) FROM valor_horas_region
UNION ALL
SELECT 'Contratos:', COUNT(*) FROM contratos
UNION ALL
SELECT 'Usuarios_info:', COUNT(*) FROM usuarios_info;
