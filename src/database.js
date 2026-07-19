const { Sequelize } = require('sequelize');

// Creamos la instancia de Sequelize con la configuración de tu MySQL
const sequelize = new Sequelize('feelfree_db', 'barber_app', 'barbero92', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,

    // ➔ DOS LÍNEAS PARA LA HORA DE ARGENTINA:
    timezone: '-03:00', // Le dice a Sequelize que use la zona horaria de Argentina
    dialectOptions: {
        // En versiones nuevas de mysql2, usamos estas dos propiedades en vez de useUTC
        dateStrings: true, // Devuelve las fechas como Strings de la BD en vez de objetos Date de JS
        typeCast: function (field, next) { // Fuerza a que los campos DATETIME se mantengan como string
            if (field.type === 'DATETIME') {
                return field.string();
            }
            return next();
        }
    }
});

module.exports = sequelize;
