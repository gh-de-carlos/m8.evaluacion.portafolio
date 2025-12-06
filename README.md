# Evaluación de portafolio

## Contexto del Proyecto

Imagina que eres parte de un equipo de desarrollo encargado de crear un servicio web para gestionar perfiles de usuario en una aplicación de redes sociales. Esta aplicación debe permitir a los usuarios crear, obtener, actualizar y eliminar su perfil, además de permitirles subir una imagen de perfil.

La API REST que implementes deberá estar diseñada de acuerdo con las buenas prácticas de arquitectura REST, garantizando la interoperabilidad de sistemas. Además, el servicio debe ser seguro, implementando autenticación utilizando JWT (JSON Web Tokens) para proteger las rutas.

Tu tarea será crear el backend de esta aplicación utilizando Node.js, Express, y JWT para la seguridad. Además, deberás permitir la subida de archivos (como imágenes de perfil) utilizando File Uploader en lugar de Multer y asegurarte de que solo los usuarios autenticados puedan acceder a ciertas funcionalidades.

## Instrucciones

### Diseño de la API REST

Define los siguientes endpoints para gestionar los perfiles de usuario:

- `POST /usuarios`: Crea un nuevo perfil de usuario.
- `GET /usuarios/:id`: Obtiene el perfil de un usuario por su id.
- `PUT /usuarios/:id`: Actualiza el perfil de un usuario existente.
- `DELETE /usuarios/:id`: Elimina un perfil de usuario.
- `POST /usuarios/:id/imagen`: Permite a un usuario subir una imagen de perfil.

Asegúrate de que cada ruta siga las buenas prácticas de REST (por ejemplo, utilizar verbos HTTP adecuados, manejar respuestas con códigos de estado apropiados).

- Utiliza `express.Router` para organizar las rutas.

### Autenticación con JWT

- Implementa un sistema de autenticación para que los usuarios deban iniciar sesión con un nombre de usuario y contraseña antes de poder acceder a las rutas protegidas.
- Cuando un usuario se autentica correctamente, emite un JWT que el usuario utilizará para acceder a las rutas protegidas.
- Protege las rutas `GET /usuarios/:id`, `PUT /usuarios/:id`, y `DELETE /usuarios/:id` con un middleware de autenticación JWT para asegurar que solo los usuarios autenticados puedan acceder a sus propios perfiles.
- El JWT debe ser enviado en el encabezado `Authorization` de la solicitud, en formato `Bearer token`.

### Subida de Archivos con File Uploader

- Utiliza el paquete `File Uploader` para manejar la subida de archivos.
- Configura el almacenamiento de archivos para que las imágenes de perfil se guarden en una carpeta `uploads/` dentro del servidor.
- Asegúrate de validar el tipo de archivo (solo imágenes) y el tamaño (por ejemplo, máximo 5 MB).
- Después de la subida, la ruta `POST /usuarios/:id/imagen` debe actualizar el perfil del usuario con la URL de la imagen de perfil.
- Asegúrate de gestionar adecuadamente los errores, como la carga de un archivo no permitido o un archivo demasiado grande.

### Implementación de Seguridad

- Utiliza `bcryptjs` o `argon2` para cifrar las contraseñas antes de almacenarlas en la base de datos.
- Asegúrate de que el JWT esté firmado correctamente y que expire después de un tiempo determinado (por ejemplo, 1 hora).
- Implementa un mecanismo de refresco de tokens para mantener a los usuarios autenticados sin necesidad de que inicien sesión repetidamente.

### Pruebas y Documentación

- Prueba cada uno de los endpoints utilizando herramientas como `Postman` o `Insomnia`. (¿por qué no `cURL` o Juanito? Utilzaré cURL en la documentación así que aguántate noma.)
- Asegúrate de que la API sea capaz de manejar errores correctamente, como la validación de entrada y el manejo de archivos no válidos.
- Documenta cómo ejecutar el servidor y cómo probar cada uno de los endpoints, incluyendo los pasos para generar un token JWT y utilizarlo en las solicitudes.

## Producto Esperado

- Un servidor Express con las rutas descritas y la implementación adecuada de buenas prácticas de arquitectura REST.
- Un sistema de autenticación basado en JWT para proteger las rutas.
- Funcionalidad de subida de archivos para permitir a los usuarios cargar una imagen de perfil utilizando `File Uploader`.
- Seguridad en el almacenamiento de contraseñas utilizando `bcryptjs` o `argon2`.
- Documentación detallada de cómo ejecutar el servidor y probar la API.

---

## Notas de uso e implementación

### Estructura del Proyecto

```bash
m8.evaluacion.portafolio/
├── config/
│   └── database.js          # Configuración de conexión a PostgreSQL
├── controllers/
│   ├── authController.js    # Controlador de autenticación
│   └── userController.js    # Controlador de usuarios (CRUD)
├── database/
│   ├── init.js              # Inicialización de base de datos
│   └── schema.sql           # Esquema SQL de la base de datos
├── middleware/
│   ├── auth.js              # Middleware de autenticación JWT
│   └── errorHandler.js      # Middleware de manejo de errores
├── routes/
│   ├── authRoutes.js        # Rutas de autenticación
│   └── userRoutes.js        # Rutas de usuarios
├── uploads/                 # Carpeta para imágenes de perfil
├── .env                     # Variables de entorno
├── .gitignore               # Archivos ignorados por git
├── app.js                   # Configuración de Express
├── server.js                # Punto de entrada del servidor
├── package.json             # Dependencias del proyecto
└── README.md                # Este archivo
```

### Instalación y Configuración

#### 1. Requisitos previos

- Node.js (utilizando v22.18.0 con `fnm` como gestor de versiones)
- PostgreSQL (utilizando v16)
- npm

#### 2. Clonar el repositorio e instalar dependencias

```bash
# Navegar al directorio del proyecto
cd m8.evaluacion.portafolio

# Instalar dependencias (ya instaladas)
npm install
```

#### 3. Configurar la base de datos

Crear base de datos con propietario directamente (recomendado). Si no tienes un usuario dedicado para las actividades del bootcamp y utilizas postgres directamente, omite todo despues del nombre de la base de datos.

```bash
# Crear base de datos con propietario especificado
sudo -u postgres psql -c "CREATE DATABASE m8_evaluacion_portafolio WITH OWNER=bootcamp_user;"
```

Luego, ejecutar el esquema SQL:

```bash
# Aplicar el esquema a la base de datos
sudo -u postgres psql -d m8_evaluacion_portafolio -f database/schema.sql

# Si tienes un usuario dedicado, acá deberás cambiar la propiedad de las tablas. Reemplaza my_user por tu usuario:
sudo -u postgres psql -d m8_evaluacion_portafolio -c "ALTER TABLE usuarios OWNER TO my_user; ALTER SEQUENCE usuarios_id_seq OWNER TO my_user; ALTER FUNCTION update_updated_at_column() OWNER TO my_user;"
```

**Nota:** Si el usuario `bootcamp_user` ya existe, solo necesitas crear la base de datos con la Opción A. En algunos sistemas, se requiere usar `sudo -u postgres psql` en lugar de `psql` directamente. El cambio de propiedad es necesario porque el esquema se ejecuta con el usuario postgres.

#### 4. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables. Utiliza [`.env.example`](./.env.example) como referencia.:

```env
DB_HOST=localhost
DB_USER=tu_usuario_db
DB_PASSWORD=tu_password_db
DB_NAME=m8_evaluacion_portafolio
DB_PORT=5432
PORT=3000
JWT_SECRET=tu_secreto_jwt_muy_seguro
FIRST_USER_EMAIL=tu_email@ejemplo.com
FIRST_USER_PASSWORD=tu_password_seguro
```

#### 5. Iniciar el servidor

```bash
# Modo desarrollo (con nodemon)
npm run dev

# Modo producción
npm start
```

El servidor se iniciará en `http://localhost:3000`

### API Endpoints

#### Autenticación

##### 1. Iniciar sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mruser@cooldomain.com",
    "password": "Mru$eristheB3st!"
  }'
```

**Respuesta exitosa:**

```json
{
  "message": "Inicio de sesión exitoso.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1,
  "email": "mruser@cooldomain.com"
}
```

##### 2. Renovar token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "TU_REFRESH_TOKEN_AQUI"
  }'
```

#### Usuarios

##### 1. Crear un nuevo usuario (público)

```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@usuario.com",
    "password": "Password123!",
    "nombre": "Juan Pérez",
    "bio": "Desarrollador Full Stack"
  }'
```

**Respuesta exitosa:**

```json
{
  "message": "Usuario creado exitosamente.",
  "usuario": {
    "id": 2,
    "email": "nuevo@usuario.com",
    "nombre": "Juan Pérez",
    "bio": "Desarrollador Full Stack",
    "created_at": "2025-12-06T10:30:00.000Z"
  }
}
```

##### 2. Obtener usuario por ID (requiere autenticación)

```bash
curl -X GET http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

**Respuesta exitosa:**

```json
{
  "usuario": {
    "id": 1,
    "email": "mruser@cooldomain.com",
    "nombre": "Usuario Principal",
    "bio": null,
    "imagen_url": "/uploads/abc123-def456_1234567890.png",
    "imagen_nombre_original": "perfil.png",
    "created_at": "2025-12-06T10:00:00.000Z",
    "updated_at": "2025-12-06T11:00:00.000Z"
  }
}
```

##### 3. Actualizar usuario (requiere autenticación)

```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "bio": "Senior Full Stack Developer"
  }'
```

##### 4. Eliminar usuario (requiere autenticación)

```bash
curl -X DELETE http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

##### 5. Subir imagen de perfil (requiere autenticación)

```bash
curl -X POST http://localhost:3000/usuarios/1/imagen \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -F "imagen=@/ruta/a/tu/imagen.png"
```

**Respuesta exitosa:**

```json
{
  "message": "Imagen de perfil actualizada exitosamente.",
  "usuario": {
    "id": 1,
    "email": "mruser@cooldomain.com",
    "nombre": "Usuario Principal",
    "imagen_url": "/uploads/550e8400-e29b-41d4-a716-446655440000_1733486400000.png",
    "imagen_nombre_original": "mi-foto.png",
    "updated_at": "2025-12-06T12:00:00.000Z"
  }
}
```

### Seguridad Implementada

#### 1. Autenticación JWT

- Los tokens tienen una duración de 1 hora
- Los refresh tokens tienen una duración de 7 días
- Los tokens se envían en el header `Authorization` con formato `Bearer token`

#### 2. Cifrado de contraseñas

- Las contraseñas se cifran con `bcryptjs` usando un factor de coste de 10
- Nunca se almacenan contraseñas en texto plano

#### 3. Validación de archivos

- **Tamaño máximo:** 5 MB
- **Tipos permitidos:** PNG, JPG/JPEG, WEBP
- **Validación por firma (magic bytes):** Se utiliza `file-type` para verificar el tipo real del archivo
- **Validación cruzada:** Se compara la extensión del archivo con el tipo MIME detectado
- **Protección contra ataques:** Si hay discrepancia entre extensión y tipo MIME, se responde con: "Te creí hacker acaso!"

#### 4. Nombres de archivo únicos

- Los archivos se renombran usando `UUID + timestamp` para evitar colisiones
- Se guarda el nombre original en la base de datos para referencia

#### 5. Protección de rutas

- Las rutas protegidas verifican que el usuario autenticado solo acceda a sus propios recursos
- Middleware `verifyOwnership` previene el acceso no autorizado

### Base de Datos

#### Esquema de la tabla `usuarios`

```sql
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),
    bio TEXT,
    imagen_url VARCHAR(500),
    imagen_nombre_original VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Dependencias

#### Producción

- **express**: Framework web para Node.js
- **pg**: Cliente PostgreSQL para Node.js
- **dotenv**: Carga variables de entorno desde archivo .env
- **bcryptjs**: Librería para cifrado de contraseñas
- **jsonwebtoken**: Implementación de JSON Web Tokens
- **express-fileupload**: Middleware para manejo de subida de archivos
- **file-type**: Detección de tipo de archivo por firma (magic bytes)
- **uuid**: Generación de identificadores únicos universales
- **cors**: Middleware para habilitar CORS

#### Desarrollo

- **nodemon**: Reinicio automático del servidor durante el desarrollo

### Flujo de prueba completo

#### 1. Iniciar sesión con el usuario predeterminado

```bash
TOKEN=$(curl -s -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mruser@cooldomain.com",
    "password": "Mru$eristheB3st!"
  }' | grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Token obtenido: $TOKEN"
```

#### 2. Obtener información del usuario

```bash
curl -X GET http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer $TOKEN"
```

#### 3. Actualizar información del usuario

```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos User",
    "bio": "Backend Developer - Node.js & PostgreSQL"
  }'
```

#### 4. Subir una imagen de perfil

```bash
# Crear una imagen de prueba si no tienes una
# (esto crea un PNG simple de 1x1 píxel)
echo -n 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' | base64 -d > test.png

# Subir la imagen
curl -X POST http://localhost:3000/usuarios/1/imagen \
  -H "Authorization: Bearer $TOKEN" \
  -F "imagen=@test.png"
```

#### 5. Probar validación de archivos (intento de subir archivo inválido)

```bash
# Intentar subir un archivo .txt con extensión .png (debería fallar)
echo "Este es un archivo de texto" > fake.png

curl -X POST http://localhost:3000/usuarios/1/imagen \
  -H "Authorization: Bearer $TOKEN" \
  -F "imagen=@fake.png"

# Respuesta esperada: {"error": "Te creí hacker acaso!"}
```

### Manejo de Errores

La API devuelve códigos de estado HTTP apropiados:

- **200 OK**: Operación exitosa
- **201 Created**: Recurso creado exitosamente
- **400 Bad Request**: Error en los datos enviados
- **401 Unauthorized**: No autenticado o token inválido
- **403 Forbidden**: No autorizado para acceder al recurso
- **404 Not Found**: Recurso no encontrado
- **409 Conflict**: Conflicto (ej: email duplicado)
- **500 Internal Server Error**: Error del servidor

### Notas adicionales

1. **Usuario inicial**: Al iniciar el servidor por primera vez, se crea automáticamente el usuario definido en las variables de entorno.

2. **Refresh tokens**: Implementado para mantener sesiones activas sin requerir login frecuente.

3. **Carpeta uploads**: Se crea automáticamente si no existe cuando se sube la primera imagen.

4. **CORS**: Habilitado para permitir peticiones desde cualquier origen (configurable según necesidades).

5. **Validación de archivos**: Triple capa de seguridad:
   - Validación de tamaño (5 MB máximo)
   - Validación de tipo MIME por firma del archivo
   - Validación cruzada entre extensión y tipo MIME

6. **Limpieza de archivos**: Al actualizar o eliminar un usuario, las imágenes antiguas se eliminan automáticamente del servidor.

### Ejemplo de sesión completa

```bash
# 1. Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "mruser@cooldomain.com", "password": "Mru$eristheB3st!"}'

# 2. Crear un nuevo usuario
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!",
    "nombre": "Usuario de Prueba"
  }'

# 3. Login con el nuevo usuario
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "Test1234!"}'

# 4. Usar el token para acceder a recursos protegidos
# (Reemplazar TOKEN con el token obtenido en el paso 3)
curl -X GET http://localhost:3000/usuarios/2 \
  -H "Authorization: Bearer TOKEN"
```

### Implementación completada

[DONE] Servidor Express con arquitectura REST  
[DONE] Sistema de autenticación JWT con refresh tokens  
[DONE] CRUD completo de usuarios  
[DONE] Subida de archivos con validación rigurosa  
[DONE] Cifrado de contraseñas con bcryptjs  
[DONE] Manejo de errores centralizado  
[DONE] Protección de rutas por autenticación  
[DONE] Verificación de propiedad de recursos  
[DONE] Base de datos PostgreSQL con esquema completo  
[DONE] Documentación detallada con ejemplos en cURL  

Si quieres, puedes probar con los archivos de prueba en la carpeta [`test/`](./test/) o crear tus propios casos utilizando los patrones `cURL` ofrecidos. Uno de estos archivos tiene un mime type falso para probar la seguridad del sistema de subida de archivos. (no confiar en el mime type enviado por el cliente ni la extensión del archivo)
