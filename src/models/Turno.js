const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // Importamos nuestra conexión
const Barbero = require('./Barbero');
const Servicio = require('./Servicio');


const Turno = sequelize.define('Turno', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cliente: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    fecha_hora: {
        type: DataTypes.DATE,
        allowNull: false
    },
    barbero_id :{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Barbero,
            key: 'id'
        }
    },
    servicio_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Servicio,
            key: 'id'
        }
    }
}, {
    // Configuraciones extras de Sequelize
    tableName : 'turnos',
    timestamps: false
});

// ==========================================
// 🔗 DEFINICIÓN DE LAS RELACIONES (ASOCIACIONES)
// ==========================================

// 1. Un Turno PERTENECE A un Barbero (Relacion de Muchos a Uno)
Turno.belongsTo(Barbero, { foreignKey: 'barbero_id', as: 'barbero' });
// (Opcional) Un Barbero tiene muchos turnos
Barbero.hasMany(Turno, { foreignKey: 'barbero_id' });

// 2. Un Turno PERTENECE A un Servicio
Turno.belongsTo(Servicio, { foreignKey: 'servicio_id', as: 'servicio' });
// (Opciona) Un Servicio tiene muchos turnos
Servicio.hasMany(Turno, { foreignKey: 'servicio_id' });


module.exports = Turno;