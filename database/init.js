const bcrypt = require('bcryptjs');
const db = require('../config/database');
require('dotenv').config();

const initDatabase = async () => {
    try {
        // Verificar si existe el primer usuario
        const checkUser = await db.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [process.env.FIRST_USER_EMAIL]
        );

        if (checkUser.rows.length === 0) {
            // Crear el primer usuario
            const hashedPassword = await bcrypt.hash(process.env.FIRST_USER_PASSWORD, 10);
            await db.query(
                'INSERT INTO usuarios (email, password, nombre) VALUES ($1, $2, $3)',
                [process.env.FIRST_USER_EMAIL, hashedPassword, 'Usuario Principal']
            );
            console.log('[DONE] Usuario inicial creado exitosamente');
        } else {
            console.log('[INFO] Usuario inicial ya existe');
        }
    } catch (error) {
        console.error('[ERROR] Error al inicializar la base de datos:', error);
        throw error;
    }
};

module.exports = initDatabase;
