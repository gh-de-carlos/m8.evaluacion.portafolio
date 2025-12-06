// Middleware para manejar rutas no encontradas
const notFound = (req, res, next) => {
    res.status(404).json({
        error: 'Ruta no encontrada.',
        path: req.originalUrl
    });
};

// Middleware para manejar errores generales
const errorHandler = (err, req, res, next) => {
    console.error('[ERROR]', err);

    // Error de sintaxis JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'JSON inválido en el cuerpo de la solicitud.'
        });
    }

    // Error por defecto
    res.status(err.status || 500).json({
        error: err.message || 'Error interno del servidor.',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = { notFound, errorHandler };
