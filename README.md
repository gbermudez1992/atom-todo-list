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
