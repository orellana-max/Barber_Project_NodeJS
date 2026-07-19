// src/controllers/barberosController.js
const Barbero = require('../models/Barbero');


//----------------------------------//
// --- MÉTODOS DEL CONTROLADOR ---  //
//----------------------------------//

// GET /barberos - Obtener todos los barberos
const obtenerBarberos = async (req, res) => {
    try {
        const barberos = await Barbero.findAll();
        res.json(barberos);
    } catch (error) {
        console.error(`Error al obtener barberos:`, error);
        res.status(500).json({ error: 'Error interno del servidor al consultar los barberos.' });
    }
};

// GET /barberos/:id - Obtener un barbero por ID
const obtenerBarberoPorId = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    try {
        const barbero = await Barbero.findByPk(id);

        if (!barbero) {
            return res.status(404).json({ error: `No se encontro nigun barbero con ID ${id}.` });
        }
        res.json({ barbero });
    } catch (error) {
        console.error(`Error al obtener barbero por ID:`, error);
        res.status(500).json({ error: `Error interno del servidor al consultar el barbero.` });
    }
};

//  POST /barberos - Crear un nuevo barbero
const crearBarbero = async (req, res) => {
    const { nombre, especialidad } = req.body;

    // Validar que venga el nombre
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ error: `El nombre del barbero es obligatorio.` });
    }
    // Validar que venga la especialidad
    if (!especialidad) {
        return res.status(400).json({ error: `La especialidad del barbero es obligatoria.` });
    }

    try {
        var especialidadDefinida = especialidad;

        if (especialidad !== undefined && especialidad.trim() === '') {
            especialidadDefinida = "Sin especialidad";
        }

        const nuevoBarbero = await Barbero.create({
            nombre: nombre.trim(),
            especialidad: especialidadDefinida.trim()
        });


        res.status(201).json({
            mensaje: '¡Barbero creado con éxito!',
            barbero: nuevoBarbero
        });
    } catch (error) {
        console.error(`Error al registrar barbero:`, error);
        res.status(500).json({ error: `Error interno del servidor al registrar el barbero.` });
    }
};

const actualizarBarbero = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    const { nombre, especialidad } = req.body;

    try {
        const barbero = await Barbero.findByPk(id);

        if (!barbero) {
            return res.status(404).json({ error: `No se encontró ningún barbero con el ID ${id} para actualizar.` });
        }

        if (nombre !== undefined && nombre.trim() === '') {
            return res.status(400).json({ error: 'El nombre del barbero no puede quedar vacío.' });
        }

        if (especialidad !== undefined && especialidad.trim() === '') {
            return res.status(400).json({ error: 'La especialidad del barbero no puede quedar vacío.' });
        }

        barbero.nombre = nombre !== undefined ? nombre.trim() : barbero.nombre;
        barbero.especialidad = especialidad !== undefined ? especialidad.trim() : barbero.especialidad;

        await barbero.save();

        res.json({
            mensaje: `¡Barbero con ID ${id} actualizado con éxito!`,
            barbero
        });
    } catch (error) {
        console.error(`Error al actualizar barbero:`, error);
        res.status(500).json({ error: `Error interno del servidor al intentar actualizar el barbero.` });
    }
};

const eliminarBarbero = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    try {
        const barbero = await Barbero.findByPk(id);

        if (!barbero) {
            return res.status(404).json({ error: `No se encontró ningún barbero con el ID ${id}.` });
        }

        // Guardamos los datos antes de borrar para mantener la coherencia
        const datosBarberoEliminado = barbero.toJSON();

        await barbero.destroy();

        res.json({
            mensaje: `¡Barbero con ID ${id} eliminado con éxito!`,
            barbero: datosBarberoEliminado
        })
    } catch (error) {
        console.error(`Error al eliminar el barbero:`, error);

        //  Si el barbero tiene turnos asignados, frena la eliminación
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'No se puede eliminar al barbero porque tiene turnos agendados en el sistema. Primero reasigna o cancela esos turnos.'
            });
        }

        res.status(500).json({ error: 'Error interno del servidor al intentar eliminar el barbero.' });
    }
};

module.exports = {
    obtenerBarberos,
    obtenerBarberoPorId,
    crearBarbero,
    actualizarBarbero,
    eliminarBarbero
}