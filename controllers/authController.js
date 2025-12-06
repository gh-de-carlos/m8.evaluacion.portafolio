const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen email y password
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos.'
            });
        }

        // Buscar usuario por email
        const result = await db.query(
            'SELECT id, email, password FROM usuarios WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: 'Credenciales inválidas.'
            });
        }

        const user = result.rows[0];

        // Verificar contraseña
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Credenciales inválidas.'
            });
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Generar refresh token (válido por 7 días)
        const refreshToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso.',
            token,
            refreshToken,
            userId: user.id,
            email: user.email
        });

    } catch (error) {
        console.error('[ERROR] Error en login:', error);
        res.status(500).json({
            error: 'Error al procesar el inicio de sesión.'
        });
    }
};

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                error: 'Refresh token es requerido.'
            });
        }

        // Verificar refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

        // Generar nuevo token
        const newToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Token renovado exitosamente.',
            token: newToken
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Refresh token expirado. Por favor, inicia sesión nuevamente.'
            });
        }
        return res.status(403).json({
            error: 'Refresh token inválido.'
        });
    }
};

module.exports = { login, refreshToken };
