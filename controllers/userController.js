const bcrypt = require('bcryptjs');
const db = require('../config/database');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const { fileTypeFromBuffer } = require('file-type');

// Crear un nuevo usuario
const createUser = async (req, res) => {
    try {
        const { email, password, nombre, bio } = req.body;

        // Validar campos requeridos
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email y contraseña son requeridos.'
            });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Formato de email inválido.'
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await db.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: 'El email ya está registrado.'
            });
        }

        // Hashear contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Crear usuario
        const result = await db.query(
            'INSERT INTO usuarios (email, password, nombre, bio) VALUES ($1, $2, $3, $4) RETURNING id, email, nombre, bio, created_at',
            [email, hashedPassword, nombre || null, bio || null]
        );

        res.status(201).json({
            message: 'Usuario creado exitosamente.',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('[ERROR] Error al crear usuario:', error);
        res.status(500).json({
            error: 'Error al crear el usuario.'
        });
    }
};

// Obtener un usuario por ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await db.query(
            'SELECT id, email, nombre, bio, imagen_url, imagen_nombre_original, created_at, updated_at FROM usuarios WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado.'
            });
        }

        res.status(200).json({
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('[ERROR] Error al obtener usuario:', error);
        res.status(500).json({
            error: 'Error al obtener el usuario.'
        });
    }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, bio, password } = req.body;

        // Verificar que el usuario existe
        const userCheck = await db.query(
            'SELECT id FROM usuarios WHERE id = $1',
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado.'
            });
        }

        // Construir query dinámicamente según campos proporcionados
        let updateFields = [];
        let values = [];
        let paramCount = 1;

        if (nombre !== undefined) {
            updateFields.push(`nombre = $${paramCount}`);
            values.push(nombre);
            paramCount++;
        }

        if (bio !== undefined) {
            updateFields.push(`bio = $${paramCount}`);
            values.push(bio);
            paramCount++;
        }

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateFields.push(`password = $${paramCount}`);
            values.push(hashedPassword);
            paramCount++;
        }

        if (updateFields.length === 0) {
            return res.status(400).json({
                error: 'No hay campos para actualizar.'
            });
        }

        values.push(id);

        const query = `
            UPDATE usuarios
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING id, email, nombre, bio, imagen_url, imagen_nombre_original, updated_at
        `;

        const result = await db.query(query, values);

        res.status(200).json({
            message: 'Usuario actualizado exitosamente.',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('[ERROR] Error al actualizar usuario:', error);
        res.status(500).json({
            error: 'Error al actualizar el usuario.'
        });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Obtener información del usuario para eliminar su imagen
        const userResult = await db.query(
            'SELECT imagen_url FROM usuarios WHERE id = $1',
            [id]
        );

        if (userResult.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado.'
            });
        }

        // Eliminar imagen si existe
        if (userResult.rows[0].imagen_url) {
            const imagePath = path.join(__dirname, '..', userResult.rows[0].imagen_url);
            try {
                await fs.unlink(imagePath);
            } catch (error) {
                console.error('[ERROR] Error al eliminar imagen:', error);
            }
        }

        // Eliminar usuario
        await db.query('DELETE FROM usuarios WHERE id = $1', [id]);

        res.status(200).json({
            message: 'Usuario eliminado exitosamente.'
        });

    } catch (error) {
        console.error('[ERROR] Error al eliminar usuario:', error);
        res.status(500).json({
            error: 'Error al eliminar el usuario.'
        });
    }
};

// Subir imagen de perfil
const uploadProfileImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario existe
        const userCheck = await db.query(
            'SELECT id, imagen_url FROM usuarios WHERE id = $1',
            [id]
        );

        if (userCheck.rows.length === 0) {
            return res.status(404).json({
                error: 'Usuario no encontrado.'
            });
        }

        // Verificar que se subió un archivo
        if (!req.files || !req.files.imagen) {
            return res.status(400).json({
                error: 'No se proporcionó ningún archivo.'
            });
        }

        const uploadedFile = req.files.imagen;
        const maxSize = 5 * 1024 * 1024; // 5 MB

        // Validar tamaño
        if (uploadedFile.size > maxSize) {
            return res.status(400).json({
                error: 'El archivo excede el tamaño máximo permitido de 5 MB.'
            });
        }

        // Validar tipo de archivo por firma (magic bytes)
        const fileTypeResult = await fileTypeFromBuffer(uploadedFile.data);

        const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/webp'];
        const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

        if (!fileTypeResult || !allowedMimeTypes.includes(fileTypeResult.mime)) {
            return res.status(400).json({
                error: 'Te creí hacker acaso!'
            });
        }

        // Validar que la extensión del archivo coincida con el mime type
        const fileExtension = path.extname(uploadedFile.name).toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({
                error: 'Te creí hacker acaso!'
            });
        }

        // Validación cruzada: extensión vs mime type
        const extensionToMime = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.webp': 'image/webp'
        };

        if (extensionToMime[fileExtension] !== fileTypeResult.mime) {
            return res.status(400).json({
                error: 'Te creí hacker acaso!'
            });
        }

        // Eliminar imagen anterior si existe
        const oldImageUrl = userCheck.rows[0].imagen_url;
        if (oldImageUrl) {
            const oldImagePath = path.join(__dirname, '..', oldImageUrl);
            try {
                await fs.unlink(oldImagePath);
            } catch (error) {
                console.error('[ERROR] Error al eliminar imagen anterior:', error);
            }
        }

        // Generar nombre único para el archivo
        const timestamp = Date.now();
        const uniqueId = uuidv4();
        const extension = path.extname(uploadedFile.name);
        const newFileName = `${uniqueId}_${timestamp}${extension}`;

        // Crear directorio uploads si no existe
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        try {
            await fs.access(uploadsDir);
        } catch {
            await fs.mkdir(uploadsDir, { recursive: true });
        }

        // Guardar archivo
        const filePath = path.join(uploadsDir, newFileName);
        await uploadedFile.mv(filePath);

        // Actualizar base de datos
        const imageUrl = `/uploads/${newFileName}`;
        const result = await db.query(
            'UPDATE usuarios SET imagen_url = $1, imagen_nombre_original = $2 WHERE id = $3 RETURNING id, email, nombre, imagen_url, imagen_nombre_original, updated_at',
            [imageUrl, uploadedFile.name, id]
        );

        res.status(200).json({
            message: 'Imagen de perfil actualizada exitosamente.',
            usuario: result.rows[0]
        });

    } catch (error) {
        console.error('[ERROR] Error al subir imagen:', error);
        res.status(500).json({
            error: 'Error al subir la imagen.'
        });
    }
};

module.exports = {
    createUser,
    getUserById,
    updateUser,
    deleteUser,
    uploadProfileImage
};
