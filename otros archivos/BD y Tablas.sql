create database feelfree_db;
use feelfree_db;

-- 1. Tabla de Barberos
CREATE TABLE barberos (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
especialidad VARCHAR(100) NOT NULL
);

-- 2. Tabla de servicios
CREATE TABLE servicios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
precio DECIMAL(10,2) NOT NULL
); 

-- 3. Tabla de Turnos (Relacionada)
CREATE TABLE turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente VARCHAR(100) NOT NULL,
    fecha_hora DATETIME NOT NULL,
    barbero_id INT NOT NULL,
    servicio_id INT NOT NULL,
    
    -- Aquí definimos las restricciones de relación (Llaves Foráneas)
    CONSTRAINT fk_turno_barbero 
        FOREIGN KEY (barbero_id) REFERENCES barberos(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
        
    CONSTRAINT fk_turno_servicio 
        FOREIGN KEY (servicio_id) REFERENCES servicios(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);


-- 4. creacion de nuevo usuario con sus privilegios
CREATE USER 'barber_app'@'localhost' IDENTIFIED BY 'barbero92';
-- Le damos permisos de CRUD (Lectura, Inserción, Actualización y Borrado)
GRANT SELECT, INSERT, UPDATE, DELETE ON feelfree_db.* TO 'barber_app'@'localhost';
-- Recargamos los privilegios para que MySQL aplique los cambios inmediatamente
FLUSH PRIVILEGES;

