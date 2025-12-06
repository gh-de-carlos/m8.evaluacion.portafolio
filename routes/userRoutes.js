const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, verifyOwnership } = require('../middleware/auth');

// POST /usuarios - Crear un nuevo usuario (público)
router.post('/', userController.createUser);

// GET /usuarios/:id - Obtener usuario por ID (requiere autenticación)
router.get('/:id', authenticateToken, verifyOwnership, userController.getUserById);

// PUT /usuarios/:id - Actualizar usuario (requiere autenticación)
router.put('/:id', authenticateToken, verifyOwnership, userController.updateUser);

// DELETE /usuarios/:id - Eliminar usuario (requiere autenticación)
router.delete('/:id', authenticateToken, verifyOwnership, userController.deleteUser);

// POST /usuarios/:id/imagen - Subir imagen de perfil (requiere autenticación)
router.post('/:id/imagen', authenticateToken, verifyOwnership, userController.uploadProfileImage);

module.exports = router;
