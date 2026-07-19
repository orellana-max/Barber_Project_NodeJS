// src/utils/validarIdNumerico.js

const esIdValido = (id) => {
    // 1. Si es un booleano (true/false), lo rechazamos de inmediato
    if (typeof id === 'boolean') {
        return false;
    }

    // 2. Convertimos a número para validar strings numéricos como "25"
    const numero = Number(id);

    // 3. Validamos que sea un número real, entero y mayor a cero
    return !isNaN(numero) && Number.isInteger(numero) && numero > 0;
};

module.exports = esIdValido;