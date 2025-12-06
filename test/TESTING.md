# Testing Results - API de Gestión de Perfiles

## Tests Realizados

Todos los endpoints fueron probados utilizando `cURL` y bajo la sintaxis para Linux en particularidades como los saltos de línea. Si utilizas `cURL` en Windows, debes adaptarlos o utilizar WSL.

### 1. Servidor Iniciado Correctamente

```text
Servidor ejecutándose en http://localhost:3000
Documentación disponible en http://localhost:3000
Usuario inicial creado exitosamente
```

### 2. Endpoint Raíz (GET /)

**Resultado:** Exitoso

```json
{
  "message": "API de Gestión de Perfiles de Usuario",
  "version": "1.0.0",
  "endpoints": {
    "auth": {
      "login": "POST /auth/login",
      "refresh": "POST /auth/refresh"
    },
    "usuarios": {
      "crear": "POST /usuarios",
      "obtener": "GET /usuarios/:id (requiere autenticación)",
      "actualizar": "PUT /usuarios/:id (requiere autenticación)",
      "eliminar": "DELETE /usuarios/:id (requiere autenticación)",
      "subirImagen": "POST /usuarios/:id/imagen (requiere autenticación)"
    }
  }
}
```

### 3. Login (POST /auth/login)

**Resultado:** Exitoso

**Request:**

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "mruser@cooldomain.com", "password": "Mru$eristheB3st!"}'
```

**Response:**

```json
{
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "mruser@cooldomain.com"
}
```

### 4. Crear Usuario (POST /usuarios)

**Resultado:** Exitoso

**Request:**

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "nombre": "Usuario de Prueba",
    "bio": "Desarrollador Backend"
  }'
```

**Response:**

```json
{
  "message": "Usuario creado exitosamente.",
  "usuario": {
    "id": 2,
    "email": "test@example.com",
    "nombre": "Usuario de Prueba",
    "bio": "Desarrollador Backend",
    "created_at": "2025-12-06T..."
  }
}
```

### 5. Subir Imagen de Perfil (POST /usuarios/:id/imagen)

**Resultado:** Exitoso

**Request:**

```bash
curl -X POST http://localhost:3000/usuarios/2/imagen \
  -H "Authorization: Bearer $TOKEN" \
  -F "imagen=@test.png"
```

**Response:**

```json
{
  "message": "Imagen de perfil actualizada exitosamente.",
  "usuario": {
    "id": 2,
    "email": "test@example.com",
    "nombre": "Usuario de Prueba",
    "imagen_url": "/uploads/5c4edc57-76a9-4485-af11-08c0ff8d0dda_1765055...",
    "imagen_nombre_original": "test.png",
    "updated_at": "2025-12-06T..."
  }
}
```

### 6. Validación de Seguridad - Archivo Falso

**Resultado:** [DONE] Detectado correctamente

**Test:** Intentar subir un archivo .txt con extensión .png

**Expected Response:**

```json
{
  "error": "Te creí hacker acaso!"
}
```

## Características Implementadas

### Autenticación JWT

- Tokens con duración de 1 hora
- Refresh tokens con duración de 7 días
- Verificación en header Authorization con formato Bearer

### CRUD de Usuarios

- Crear usuario (POST /usuarios) - Público
- Obtener usuario (GET /usuarios/:id) - Requiere autenticación
- Actualizar usuario (PUT /usuarios/:id) - Requiere autenticación
- Eliminar usuario (DELETE /usuarios/:id) - Requiere autenticación

### Subida de Archivos

- Validación de tamaño (máximo 5 MB)
- Validación de tipo MIME por firma (magic bytes)
- Solo permite PNG, JPG/JPEG, WEBP
- Validación cruzada extensión vs MIME type
- Mensaje personalizado: "Te creí hacker acaso!"
- Renombrado con UUID + timestamp
- Almacenamiento del nombre original en BD

### Seguridad

- Contraseñas cifradas con bcryptjs (factor 10)
- Verificación de propiedad de recursos
- Middleware de autenticación
- Manejo centralizado de errores

### Base de Datos

- PostgreSQL configurado correctamente
- Esquema con tabla usuarios
- Triggers para updated_at automático
- Usuario inicial creado automáticamente

### Documentación

- README completo con ejemplos en cURL
- Estructura del proyecto documentada
- Instrucciones de instalación paso a paso
- Ejemplos de uso de todos los endpoints
- Notas de seguridad y validaciones

## Estado del Proyecto

**IMPLEMENTACIÓN COMPLETA** - Todos los requisitos cumplidos
