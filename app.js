const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de express-fileupload
app.use(fileUpload({
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    abortOnLimit: true,
    responseOnLimit: 'El archivo excede el tamaño máximo permitido de 5 MB.',
    uploadTimeout: 60000
}));

// Servir archivos estáticos desde la carpeta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.get('/', (req, res) => {
    res.json({
        message: 'API de Gestión de Perfiles de Usuario',
        version: '1.0.0',
        endpoints: {
            auth: {
                login: 'POST /auth/login',
                refresh: 'POST /auth/refresh'
            },
            usuarios: {
                crear: 'POST /usuarios',
                obtener: 'GET /usuarios/:id (requiere autenticación)',
                actualizar: 'PUT /usuarios/:id (requiere autenticación)',
                eliminar: 'DELETE /usuarios/:id (requiere autenticación)',
                subirImagen: 'POST /usuarios/:id/imagen (requiere autenticación)'
            }
        }
    });
});

app.use('/auth', authRoutes);
app.use('/usuarios', userRoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

module.exports = app;
