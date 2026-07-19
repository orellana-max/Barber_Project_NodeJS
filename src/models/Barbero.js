const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Importamos nuestra conexión

const Barbero = sequelize.define('Barbero', {
    // Definimos los campos exactamente como están en la base de datos
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    especialidad: {
        type: DataTypes.STRING(100),
        allowNull: false
    }
}, {
    // Configuraciones extras de Sequelize
    tableName: 'barberos', // Le decimos el nombre exacto de la tabla en MySQL
    timestamps: false     // Desactivamos createdAt y updatedAt porque no los pusimos en la BD física
});

module.exports = Barbero;