# Lista de Tareas

Aplicación de lista de tareas moderna que aprovecha la Arquitectura Limpia en el backend y Angular en el frontend.

## 🏗️ Arquitectura y Decisiones de Diseño

### Backend (`api/functions`)

El backend está construido como una API estructurada diseñada para ser desplegada en Firebase Cloud Functions.

- **Arquitectura Limpia (Clean Architecture)**: La estructura de directorios obliga a una separación estricta de responsabilidades, asegurando que la lógica de negocio no esté fuertemente acoplada a controladores de bases de datos o al enrutamiento de la capa web.
  - **`core/`**: Contiene interfaces y entidades del dominio.
  - **`use-cases/`**: Contiene orquestadores de la lógica de negocio.
  - **`infrastructure/`**: Maneja dependencias externas (Repositorios de Firestore, Servicio JWT, configuración de Firebase).
  - **`web/`**: Actúa como el mecanismo de entrega o presentación (controladores y middlewares de Express).
- **Express & Firebase Functions**: Toda la lógica se expone mediante una arquitectura escalable _serverless_ a través de Firebase.
- **Autenticación**: Autenticación basada en _tokens_ utilizando JWT (`JwtTokenService`) y gestionada por un `authMiddleware` de Express.
- **Base de Datos**: Almacenamiento persistente mediante Google Cloud **Firestore** (`FirestoreTaskRepository`).

### Frontend (`web`)

La interfaz del cliente está construida usando metodologías modernas de **Angular**.

- **Señales de Angular (Signals)**: La aplicación utiliza `signal()` para mantener y reaccionar a actualizaciones de estado síncronas.
- **Wrappers de Servicios**: Abstracción personalizada `HttpRequest` sobre el `HttpClient` nativo de Angular para la intercepción de peticiones centralizada. Esto asegura la inyección de la cabecera `Authorization: Bearer <token>` a través de todas las solicitudes, y una gestión de errores automática y unificada como el cierre de sesión y la redirección inmediata tras respuestas de HTTP 403 (Prohibido).
- **Estilos de Componente (Component-Level Styling)**: CSS puro encápsulado específicamente por componente _standalone_ y variables globales en `/app.css`.

## 🛠️ Stack Tecnológico

**Cliente**

- Angular
- RxJS
- HTML5 / CSS3

**Servidor / API**

- Node.js / TypeScript
- Express
- Firebase (Cloud Functions, Admin SDK)
- Cloud Firestore DB
- JWT (JSON Web Tokens)

## 🚀 Ejecución Local

Sigue estos pasos para levantar la aplicación en tu entorno de desarrollo local:

1. **Inicia sesión en Firebase**:
   Asegúrate de estar autenticado en la CLI de Firebase.

   ```bash
   firebase login
   ```

2. **Emula las Cloud Functions**:
   Navega al directorio del backend y levanta los emuladores locales de Firebase.

   ```bash
   cd api/functions
   npm run serve
   ```
<<<<<<< HEAD

   Esto compilará el código TypeScript y ejecutará las funciones localmente (la terminal mostrará una URL similar a `http://127.0.0.1:5001/...`).
=======
   esto compilará el código TypeScript y ejecutará las funciones localmente (la terminal mostrará una URL similar a `http://127.0.0.1:5001/...`).

   **Requisito de Variables de Entorno**:
   Crea un archivo `.env` dentro de `api/functions/` con las URLs permitidas para CORS (las URLs de tu entorno local y hosting):
   ```env
   ALLOWED_ORIGINS=http://localhost:4200,https://tu-proyecto.web.app
   ```

>>>>>>> 4382eb9 (feat: Configure Firebase hosting, implement dynamic CORS origin handling, and consolidate project configuration files.)

3. **Configura el entorno de Angular**:
   Copia la URL local del emulador de funciones generada en el paso anterior y reemplázala en el archivo `web/src/environments/environment.development.ts`:

   ```typescript
   export const environment = {
     production: false,
     apiUrl: "http://127.0.0.1:5001/tu-proyecto/us-central1/api", // Reemplazar con la URL del emulador
   };
   ```

4. **Inicia la aplicación frontend**:
   En una nueva terminal, levanta el servidor de desarrollo de Angular.
   ```bash
   cd web
   npm start # O ng serve
   ```
   La aplicación se abrirá en `http://localhost:4200/`.

## 🚀 Despliegue (Deployment)

Para desplegar la aplicación a producción en Firebase, sigue estos pasos:

### 1. Desplegar la API (Cloud Functions)
Asegúrate de que tu archivo `api/functions/.env` tenga las URLs de producción correctas en `ALLOWED_ORIGINS`.

```bash
cd api/functions
npm run deploy
```
Esto ejecutará el linter, compilará el proyecto y lo subirá a Firebase. La URL final de la API aparecerá en la consola (ej. `https://us-central1-tu-proyecto.cloudfunctions.net/api`).

### 2. Configurar Angular para Producción
Actualiza el archivo `web/src/environments/environment.ts` con la URL de la API desplegada:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://us-central1-tu-proyecto.cloudfunctions.net/api'
};
```

### 3. Desplegar el Frontend (Firebase Hosting)
Primero construye la aplicación Angular y luego despliégala.
```bash
cd web
npm run build
firebase deploy --only hosting
```
