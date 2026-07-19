// src/controllers/turnosController.js
// Importamos los modelos para poder consultar la base de datos
const Turno = require('../models/Turno');
const Barbero = require('../models/Barbero');
const Servicio = require('../models/Servicio');
const { validarFechaTurno } = require('../utils/validadorFecha');

const esIdValido = require('../utils/validarIdNumerico');


//----------------------------------//
// --- MÉTODOS DEL CONTROLADOR ---  //
//----------------------------------//

// GET /turnos - Obtener todos los turnos con sus relaciones
const obtenerTurnos = async (req, res) => {
    try {
        const listaTurnos = await Turno.findAll({
            include: [
                { model: Barbero, as: 'barbero' },
                { model: Servicio, as: 'servicio' }
            ]
        });
        res.json(listaTurnos);
    } catch (error) {
        console.error('Error al obtener turnos en el controlador:', error);
        res.status(500).json({ error: 'Error al consultar la base de datos' });
    }
};

// GET /turnos/:id - Obtener un único turno con sus relaciones cruzadas
const obtenerTurnoPorId = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    try {
        const turno = await Turno.findByPk(id, {
            include: [
                { model: Barbero, as: 'barbero' },
                { model: Servicio, as: 'servicio' }
            ]
        });

        if (!turno) {
            return res.status(404).json({ error: `No se encontró ningún turno con el ID ${id}.` });
        }

        res.json(turno.toJSON());
    } catch (error) {
        console.error('Error al obtener el turno por ID:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar el turno.' });
    }
};

// POST /turnos
const crearTurno = async (req, res) => {
    // 1. Recibimos los datos del cuerpo de la petición (body)
    const { cliente, fecha_hora, barbero_id, servicio_id } = req.body;

    // 2. Primera capa de defensa: Validaciones de campos obligatorios en JS
    if (!cliente || cliente.trim() === '') {
        return res.status(400).json({ error: 'El nombre del cliente es obligatorio.' });
    }

    // NUEVA VALIDACIÓN MODULARIZADA DE FECHA
    const validacionFecha = validarFechaTurno(fecha_hora);
    if (!validacionFecha.valido) {
        return res.status(400).json({ error: validacionFecha.error });
    }

    // Validaciones de IDs de relaciones
    if (!esIdValido(barbero_id)) {
        return res.status(400).json({ error: 'Se requiere un ID de barbero válido.' });
    }

    if (!esIdValido(servicio_id)) {
        return res.status(400).json({ error: 'Se requiere un ID de servicio válido.' });
    }

    try {
        // 3. Segunda capa de defensa: Sequelize intenta insertar en MySQL.
        // Si el barbero_id o servicio_id no existen, saltará al catch por las restricciones de FK.
        const nuevoTurno = await Turno.create({
            cliente: cliente.trim(),
            fecha_hora,
            barbero_id,
            servicio_id
        });

        // 2. Lo volvemos a buscar incluyendo las relaciones para devolverlo completo
        const turnoCompleto = await Turno.findByPk(nuevoTurno.id, {
            include: [
                { model: Barbero, as: 'barbero' },
                { model: Servicio, as: 'servicio' }
            ]
        });

        // 4. Respondemos con el turno creado y el estado HTTP 201 (Created)
        res.status(201).json({
            mensaje: '¡Turno agendado con éxito!',
            turno: turnoCompleto.toJSON() // para corregir fecha desfasada
        });

    } catch (error) {
        console.error('Error al crear el turno:', error);

        // Si el error fue por integridad de llaves foráneas en la base de datos (Ej: id inexistente)
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'No se puede crear el turno porque el barbero o el servicio seleccionados no existen.'
            });
        }
        res.status(500).json({ error: 'Error interno del servidor al registrar el turno.' });
    }
};

// PUT /turnos/:id - Actualizar turno y devolverlo con sus relaciones actualizadas
const actualizarTurno = async (req, res) => {
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    const { cliente, fecha_hora, barbero_id, servicio_id } = req.body;

    // 1. Validaciones de IDs de relaciones si es que vienen en el body para actualizarse
    if (barbero_id !== undefined && !esIdValido(barbero_id)) {
        return res.status(400).json({ error: 'El ID de barbero provisto en el cuerpo no es válido.' });
    }

    if (servicio_id !== undefined && !esIdValido(servicio_id)) {
        return res.status(400).json({ error: 'El ID de servicio provisto en el cuerpo no es válido.' });
    }

    try {
        // 2. Buscar si el turno que quieren modificar realmente existe
        const turno = await Turno.findByPk(id);
        if (!turno) {
            return res.status(404).json({ error: `No se encontró ningún turno con el ID ${id} para actualizar.` });
        }

        // 3. Validaciones de los datos entrantes (solo si fueron enviados en el body)
        if (cliente !== undefined && cliente.trim() === '') {
            return res.status(400).json({ error: 'Para modificar nombre del cliente, el nombre no puede quedar vacío.' });
        }

        // NUEVA VALIDACIÓN MODULARIZADA DE FECHA (Solo si viene en el body)
        if (fecha_hora !== undefined) {
            const validacionFecha = validarFechaTurno(fecha_hora);
            if (!validacionFecha.valido) {
                return res.status(400).json({ error: validacionFecha.error });
            }
        }


        // 4. Actualizar los campos en el objeto de Sequelize
        // Actualizar los campos usando asignación coalescente nula (solo si no son undefined/null)
        turno.cliente = cliente?.trim() ?? turno.cliente;
        turno.fecha_hora = fecha_hora ?? turno.fecha_hora;
        turno.barbero_id = barbero_id ?? turno.barbero_id;
        turno.servicio_id = servicio_id ?? turno.servicio_id;

        // 5. Guardar los cambios en MySQL de forma segura
        await turno.save();

        // Buscamos de nuevo con Eager Loading para retornar el objeto con relaciones actualizadas
        const turnoActualizadoCompleto = await Turno.findByPk(id, {
            include: [
                { model: Barbero, as: 'barbero' },
                { model: Servicio, as: 'servicio' }
            ]
        });

        res.json({
            mensaje: `¡Turno con ID ${id} actualizado con éxito!`,
            turno: turnoActualizadoCompleto.toJSON()
        });

    } catch (error) {
        console.error('Error al actualizar el turno:', error);

        // Volvemos a atajar errores de llaves foráneas por si ponen un barbero/servicio que no existe
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(400).json({
                error: 'No se puede actualizar el turno porque el barbero o el servicio seleccionados no existen.'
            });
        }

        res.status(500).json({ error: 'Error interno del servidor al intentar actualizar el turno.' });
    }
};

// DELETE /turnos/:id
const eliminarTurno = async (req, res) => {
    // 1. Obtenemos el ID desde los parámetros de la URL (req.params)
    // ¡Ya viene validado y convertido desde el middleware!
    const id = req.idNumerico;

    try {
        // 3. Buscamos el turno incluyendo sus relaciones antes de borrarlo
        const turno = await Turno.findByPk(id, {
            include: [
                { model: Barbero, as: 'barbero' },
                { model: Servicio, as: 'servicio' }
            ]
        });

        if (!turno) {
            return res.status(404).json({ error: `No se encontró ningún turno con el ID ${id}.` });
        }

        // 4. Si existe
        // 4.1. Nos guardamos los datos completos estructurados en JSON
        const datosTurnoEliminado = turno.toJSON();

        // 4.2. Borramos el registro de la BD
        await turno.destroy(); // O también: await Turno.destroy({ where: { id } });

        // 5. Respondemos con éxito, enviando los datos del turno que fue eliminado
        res.json({
            mensaje: `¡Turno con ID ${id} cancelado con éxito!`,
            turno: datosTurnoEliminado
        });

    } catch (error) {
        console.error('Error al eliminar el turno:', error);
        res.status(500).json({ error: 'Error interno del servidor al intentar cancelar el turno.' });
    }
};

// Exportamos todas las funciones para que las usen las rutas
module.exports = {
    obtenerTurnoPorId,
    obtenerTurnos,
    crearTurno,
    actualizarTurno,
    eliminarTurno
};