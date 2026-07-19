// src/routes/serviciosRoutes.js
const express = require('express');
const router = express.Router();
const serviciosController = require('../controllers/serviciosController');
const validarId = require('../middlewares/validarId');

// Definición de rutas asociadas al controlador
router.get('/', serviciosController.obtenerServicios);
router.post('/', serviciosController.crearServicio);

// A las rutas que usan :id les pasamos 'validarId' como segundo parámetro
router.get('/:id', validarId, serviciosController.obtenerServicioPorId);
router.put('/:id', validarId, serviciosController.actualizarServicio);
router.delete('/:id', validarId, serviciosController.eliminarServicio);

module.exports = router;

