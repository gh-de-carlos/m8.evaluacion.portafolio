const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /auth/login - Iniciar sesión
router.post('/login', authController.login);

// POST /auth/refresh - Renovar token
router.post('/refresh', authController.refreshToken);

module.exports = router;
