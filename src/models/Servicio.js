const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // importamos nuestra conexion

const Servicio = sequelize.define('Servicio', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    }
}, {
    // Configuraciones extras de Sequelize
    tableName: 'servicios', // Nombre exacto de la tabla en MySQL
    timestamps: false     // Desactivamos createdAt y updatedAt
});

module.exports = Servicio;