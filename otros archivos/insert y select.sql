-- Insertar barberos de prueba
INSERT INTO barberos (nombre, especialidad) VALUES
('Matias', 'Cortes modernos y degradados'),
('Benja', 'Barba y perfilado tradicional');

-- Insertar Servicios de prueba
INSERT INTO servicios (nombre, precio) VALUES 
('Corte de Pelo', 4500.00),
('Perfilado de Barba', 2500.00),
('Combo Feel Free', 6000.00);

-- Insertamos un turno para el 
-- cliente "Aaron" con el Barbero 1 (Maxi) y Servicio 3 (Combo)
INSERT INTO turnos (cliente, fecha_hora, barbero_id, servicio_id) VALUES
('Aaron', '2026-07-15 14:30:00', 1, 3);

-- consultas
SELECT * FROM barberos;
SELECT * FROM servicios;
SELECT * FROM turnos;

 -- Este registro DEBERÍA fallar
INSERT INTO turnos (cliente, fecha_hora, barbero_id, servicio_id) VALUES 
('Gaston', '2026-07-16 10:00:00', 1, 99);

-- Intentamos borrar al barbero Maxi (ID 1) 
-- debe Fallar por ON DELETE RESTRICT
DELETE FROM barberos WHERE id = 1;

