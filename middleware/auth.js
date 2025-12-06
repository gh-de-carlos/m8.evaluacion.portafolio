const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            error: 'Acceso denegado. Token no proporcionado.'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado. Por favor, inicia sesión nuevamente.'
            });
        }
        return res.status(403).json({
            error: 'Token inválido.'
        });
    }
};

const verifyOwnership = (req, res, next) => {
    const requestedUserId = parseInt(req.params.id);
    const authenticatedUserId = req.user.userId;

    if (requestedUserId !== authenticatedUserId) {
        return res.status(403).json({
            error: 'No tienes permiso para acceder a este recurso.'
        });
    }

    next();
};

module.exports = { authenticateToken, verifyOwnership };
