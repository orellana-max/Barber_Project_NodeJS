const express = require('express');
const router = express.Router();
// Importamos el controlador con sus funciones lógicas
const turnosController = require('../controllers/turnosController');
const validarId = require('../middlewares/validarId');


// Definimos qué función se ejecuta en cada método y camino
// GET /turnos -> Delega la acción al método obtenerTurnos del controlador
router.get('/', turnosController.obtenerTurnos);
router.post('/', turnosController.crearTurno);

// turnos/:id (El :id es un parámetro dinámico)
// A las rutas que usan :id les pasamos 'validarId' como segundo parámetro
router.get('/:id', validarId, turnosController.obtenerTurnoPorId);
router.delete('/:id', validarId, turnosController.eliminarTurno);
router.put('/:id', validarId, turnosController.actualizarTurno);

module.exports = router;