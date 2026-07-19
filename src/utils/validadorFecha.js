// src/utils/validadorFecha.js

/**
 * Valida que una fecha de turno cumpla con todos los requisitos de estructura y lógica.
 * @param {string} fecha_hora - La fecha a validar (Ej: "2026-07-30 15:30")
 * @returns {Object} - Objeto con { valido: boolean, error?: string }
 */
const validarFechaTurno = (fecha_hora) => {
    // 1. Filtro de obligatoriedad
    if (!fecha_hora) {
        return { valido: false, error: 'La fecha y hora del turno son obligatorias.' };
    }

    // 2. Filtro de estructura (Soporta YYYY-MM-DD HH:MM y YYYY-MM-DD HH:MM:SS)
    const regexFecha = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;
    if (!regexFecha.test(fecha_hora)) {
        return { 
            valido: false, 
            error: 'El formato de fecha_hora debe ser AAAA-MM-DD HH:MM.' 
        };
    }

    // 3. Filtro de existencia real en el calendario (ej: no permitir 31 de febrero)
    const fechaParseada = new Date(fecha_hora);
    if (isNaN(fechaParseada.getTime())) {
        return { valido: false, error: 'La fecha ingresada no es una fecha real del calendario.' };
    }

    // 4. Filtro de tiempo futuro (no turnos en el pasado)
    const ahora = new Date();
    if (fechaParseada < ahora) {
        return { valido: false, error: 'No se pueden agendar o modificar turnos con fechas pasadas.' };
    }

    // Si pasó todos los filtros
    return { valido: true };
};

module.exports = { validarFechaTurno };