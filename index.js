const express = require('express');
const app = express();
const PORT = 3000;
const sequelize = require('./src/database');
const Barbero = require('./src/models/Barbero')
const Servicio = require('./src/models/Servicio');
const Turno = require('./src/models/Turno');

// Importamos el enrutador de turnos
const turnosRoutes = require('./src/routes/turnosRoutes');
const serviciosRoutes = require('./src/routes/serviciosRoutes');
const barberosRoutes = require('./src/routes/barberosRoutes');

// MIDDLEWARES
app.use(express.json());

// Middleware para capturar errores de JSON mal formado en el body
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ 
            error: 'El cuerpo de la petición (JSON) tiene un error de sintaxis y no pudo ser procesado.' 
        });
    }
    next();
});


// ENDPOINTS DIRECTOS
app.get('/', (req, res) => {
    res.send('¡Bienvenidos a la API de la barberia FEEL FREE! 💈 Turnos Online');
});


// ENDPOINTS MODULARIZADOS
// Al poner '/turnos', le decimos que todas las rutas dentro de turnosRoutes arrancan con /turnos
app.use('/turnos', turnosRoutes);
app.use('/servicios', serviciosRoutes);
app.use('/barberos', barberosRoutes);



// Función para probar la conexión a MySQL antes de arrancar todo
async function probarConexion() {
    try {
        await sequelize.authenticate();
        console.log('⚡ ¡Conexión a MySQL (feelfree_db) establecida con éxito!');
    } catch (error) {
        console.error('❌ No se pudo conectar a la base de datos:', error.message);
    }
}

probarConexion();


// ENCENDER EL MOTOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});