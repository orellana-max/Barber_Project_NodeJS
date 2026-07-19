// src/routes/barberosRoutes.js
const express = require('express');
const router = express.Router();
const barberosController = require('../controllers/barberosController');
const validarId = require('../middlewares/validarId');

// Definición de rutas asociadas al controlador
router.get('/', barberosController.obtenerBarberos);
router.post('/', barberosController.crearBarbero);

// A las rutas que usan :id les pasamos 'validarId' como segundo parámetro
router.get('/:id', validarId, barberosController.obtenerBarberoPorId);
router.put('/:id', validarId, barberosController.actualizarBarbero);
router.delete('/:id', validarId, barberosController.eliminarBarbero);

module.exports = router;
