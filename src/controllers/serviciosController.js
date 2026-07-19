const Servicio = require('../models/Servicio');


//----------------------------------//
// --- MÉTODOS DEL CONTROLADOR ---  //
//----------------------------------//

// GET /servicios - Obtener todos los servicios
const obtenerServicios = async (req, res) => {
    try {
        const servicios = await Servicio.findAll();
        res.json(servicios);
    } catch (error) {
        console.error('Error al obtener servicios:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar los servicios.' });
    }
};

// GET /servicios/:id - Obtener un servicio por ID
const obtenerServicioPorId = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    try {
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ error: `No se encontró ningún servicio con el ID ${id}.` });
        }

        res.json(servicio);
    } catch (error) {
        console.error('Error al obtener servicio por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar el servicio.' });
    }
};

// POST /servicios - Crear un nuevo servicio
const crearServicio = async (req, res) => {
    const { nombre, precio } = req.body;

    // 1. Validar nombre
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: 'El nombre del servicio es obligatorio.' });
    }

    // 2. Validar precio (debe ser un número positivo)
    if (precio === undefined || isNaN(precio) || Number(precio) <= 0) {
        return res.status(400).json({ error: 'El precio es obligatorio y debe ser un número mayor a 0.' });
    }

    try {
        const nuevoServicio = await Servicio.create({
            nombre: nombre.trim(),
            precio: Number(precio)
        });

        res.status(201).json({
            mensaje: '¡Servicio creado con éxito!',
            servicio: nuevoServicio
        });
    } catch (error) {
        console.error('Error al crear el servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor al crear el servicio.' });
    }
};

// PUT /servicios/:id - Actualizar un servicio existente
const actualizarServicio = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    const { nombre, precio } = req.body;

    try {
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ error: `No se encontró ningún servicio con el ID ${id} para actualizar.` });
        }

        // Validaciones condicionales si vienen en el body
        if (nombre !== undefined && nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre del servicio no puede quedar vacío.' });
        }

        if (precio !== undefined && (isNaN(precio) || Number(precio) <= 0)) {
            return res.status(400).json({ error: 'El precio debe ser un número mayor a 0.' });
        }

        // Actualizar solo los campos enviados
        servicio.nombre = nombre !== undefined ? nombre.trim() : servicio.nombre;
        servicio.precio = precio !== undefined ? Number(precio) : servicio.precio;

        await servicio.save();

        res.json({
            mensaje: `¡Servicio con ID ${id} actualizado con éxito!`,
            servicio
        });
    } catch (error) {
        console.error('Error al actualizar el servicio:', error);
        res.status(500).json({ error: 'Error interno del servidor al intentar actualizar el servicio.' });
    }
};

// DELETE /servicios/:id - Eliminar un servicio y retornar sus datos
const eliminarServicio = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    try {
        const servicio = await Servicio.findByPk(id);

        if (!servicio) {
            return res.status(404).json({ error: `No se encontró ningún servicio con el ID ${id}.` });
        }

        // 1. Nos guardamos los datos del servicio antes de destruirlo
        const datosServicioEliminado = servicio.toJSON();

        // 2. Eliminamos el registro de la base de datos
        await servicio.destroy();

        // 3. Respondemos enviando el mensaje y el objeto eliminado
        res.json({
            mensaje: `¡Servicio con ID ${id} eliminado con éxito!`,
            servicio: datosServicioEliminado
        });

    } catch (error) {
        console.error('Error al eliminar el servidor:', error);

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'No se puede eliminar el servicio porque hay turnos agendados que lo utilizan. Primero reasigna o cancela esos turnos.'
            });
        }

        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar el servicio.' });
    }
};

module.exports = {
    obtenerServicios,
    obtenerServicioPorId,
    crearServicio,
    actualizarServicio,
    eliminarServicio
};