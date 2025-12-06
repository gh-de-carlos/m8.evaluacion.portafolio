const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

pool.on('connect', () => {
    console.log('[INFO] Conectado a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
    console.error('[ERROR] Error inesperado en el cliente de base de datos:', err);
    process.exit(-1);
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
