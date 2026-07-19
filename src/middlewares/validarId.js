// src/middlewares/validarId.js

const validarId = (req, res, next) => {
    // tomamos el id que viene en la URL
    const { id } = req.params;
    const idNumerico = Number(id);

    //  Aplicamos el triple filtro esctricto
    if (isNaN(idNumerico) || !Number.isInteger(idNumerico) || idNumerico <= 0) {
        return res.status(400).json({ error: 'El ID provisto no es válido'});
    }

    // Inyectamos el ID ya convertido en el objeto 'req' 
    // para que el controlador lo use directo sin volver a convertirlo
    req.idNumerico = idNumerico;

    // Le damos paso al controlador
    next();
};

module.exports = validarId;