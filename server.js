const app = require('./app');
const initDatabase = require('./database/init');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Inicializar base de datos
        await initDatabase();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`\n[INFO] Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`[INFO] Documentación disponible en http://localhost:${PORT}\n`);
        });
    } catch (error) {
        console.error('[ERROR] Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer();
