# 🛍️ API de Comercio Electrónico *Cool & Poderosa* en NestJS

Una API moderna **lista para microservicios** construida con **NestJS + TypeScript**, pensada para tiendas en línea de alto crecimiento. Incluye PostgreSQL, RabbitMQ y Redis desde el primer momento y sigue los principios de Clean Architecture, CQRS y Domain‑Driven Design.

---

## ✨ Funcionalidades

* **Módulo de Productos** – categorías, estadísticas, valoraciones y reseñas
* **Módulo de Pedidos** – analíticas, procesamiento / reembolsos e historial
* **Módulo de Usuarios** – gestión de perfil y preferencias más herramientas de administración
* Modules globales: autenticación JWT, rate‑limiting, paginación, documentación Swagger, validación, caché, compresión, trazabilidad con ID de solicitud y CORS.

---

## 🏗️ Stack Tecnológico

| Capa  | Tecnología                                      |
| ----- | ----------------------------------------------- |
| API   | NestJS (>=10), TypeScript                       |
| BD    | PostgreSQL (15) + TypeORM 
| Cola  | RabbitMQ (3.13)                                 |
| Caché | Redis (7)                                       |
| Docs  | Swagger / OpenAPI 3.1                           |
| CI    | Docker Compose (y opcionalmente GitHub Actions) |

---


![Logo de la API](https://raw.githubusercontent.com/gabrielgalati24/cashea-backend/main/image.png)

## 🚀 Inicio Rápido

```bash
# 1. Clona el proyecto y entra al directorio
$ git clone https://github.com/gabrielgalati24/cashea-backend 

# 2. Copia la plantilla de variables y ajusta secretos
$ cp .env.example .env
#   └─ Asegúrate de definir JWT_SECRET, credenciales de BD y AMQP_URL

# 3. Levanta los servicios básicos (PostgreSQL, RabbitMQ, Redis)
$ docker‑compose up -d postgres rabbitmq redis

# 4. Instala dependencias y lanza la API en modo watch
$ npm install
$ npm run start:dev

# 5. Explora la doc ➜  http://localhost:3000/api
```


---

## 🔧 Variables de Entorno (`.env`)

| Clave                | Descripción                               |
| -------------------- | ----------------------------------------- |
| `PORT`               | Puerto de la API (por defecto **3000**)   |
| `DATABASE_URL`       | Cadena de conexión a PostgreSQL           |
| `AMQP_URL`           | Cadena de conexión a RabbitMQ             |
| `REDIS_URL`          | Cadena de conexión a Redis                |
| `JWT_SECRET`         | Secreto para firmar tokens JWT            |
| `RATE_LIMIT_REGULAR` | Peticiones/min de usuarios normales (100) |
| `RATE_LIMIT_ADMIN`   | Peticiones/min de admins (300)            |

Encuentra una plantilla completa en **`.env.example`**.

---

## 📚 Referencia de API

### Autenticación & Encabezados

```text
Authorization: Bearer <jwt>
X‑Request‑Id: <uuid>            # se genera automáticamente si falta
```

### Formato de Paginación

```json
{
  "items": [...],
  "meta": { "total": 120, "page": 1, "limit": 20 }
}
```

### Formato de Errores

```json
{ "statusCode": 404, "message": "No Encontrado", "error": "ResourceNotFound" }
```

---
## 📦 Endpoints

<details>
<summary>🛒 Módulo de Productos</summary>

| Método | Ruta                           | Auth      | Descripción                                      | Implementado |
| ------ | ------------------------------ | --------- | ------------------------------------------------ | ------------ |
| GET    | `/products/categories`         | Público   | Lista categorías                                 | ❌           |
| POST   | `/products/categories`         | **Admin** | Crea categoría                                   | ❌           |
| GET    | `/products/stats`              | **Admin** | Estadísticas globales                            | ❌           |
| POST   | `/products/:id/reviews`        | Usuario   | Crea reseña                                      | ❌           |
| GET    | `/products/:id/reviews`        | Público   | Reseñas paginadas                                | ❌           |
| GET    | `/products`                    | Público   | Listar productos con paginación, filtros y búsqueda | ✅        |
| GET    | `/products/:id`                | Público   | Obtener producto por ID                          | ✅           |
| POST   | `/products`                    | **Admin** | Crear nuevo producto                             | ✅           |
| POST   | `/products/bulk`               | **Admin** | Crear productos en lote                          | ✅           |
| PUT    | `/products/:id`                | **Admin** | Actualizar producto                              | ✅           |
| DELETE | `/products/:id`                | **Admin** | Eliminar producto                                | ✅           |
| GET    | `/products/category/:category` | Público   | Listar productos por categoría                   | ✅           |

</details>

<details>
<summary>📑 Módulo de Pedidos</summary>

| Método | Ruta                      | Auth      | Descripción                           | Implementado |
| ------ | ------------------------- | --------- | ------------------------------------- | ------------ |
| GET    | `/orders/stats`           | **Admin** | KPI de ingresos y pedidos             | ❌           |
| POST   | `/orders/:id/process`     | **Admin** | Actualiza estado y notifica           | ❌           |
| POST   | `/orders/:id/refund`      | **Admin** | Emite reembolso                       | ❌           |
| GET    | `/orders/history`         | Usuario   | Historial paginado                    | ❌           |
| GET    | `/orders`                 | **Admin** | Obtener todos los pedidos             | ✅           |
| GET    | `/orders/:id`             | **Admin** | Obtener pedido por ID                 | ✅           |
| GET    | `/orders/user/:userId`    | Usuario   | Obtener pedidos de un usuario específico | ✅        |
| POST   | `/orders`                 | Usuario   | Crear nuevo pedido                    | ✅           |
| PUT    | `/orders/:id`             | **Admin** | Actualizar estado de pedido           | ✅           |
| DELETE | `/orders/:id`             | **Admin** | Cancelar pedido                       | ✅           |

</details>

<details>
<summary>👤 Módulo de Usuarios</summary>

| Método | Ruta                    | Auth      | Descripción                   | Implementado |
| ------ | ----------------------- | --------- | ----------------------------- | ------------ |
| GET    | `/users/profile`        | Usuario   | Perfil actual                 | ❌           |
| PUT    | `/users/profile`        | Usuario   | Actualiza perfil              | ❌           |
| GET    | `/users/preferences`    | Usuario   | Lee preferencias              | ❌           |
| PUT    | `/users/preferences`    | Usuario   | Actualiza preferencias        | ❌           |
| GET    | `/users/inactive`       | **Admin** | Usuarios inactivos            | ❌           |
| POST   | `/users/bulk-status`    | **Admin** | Cambia estado en lote         | ❌           |
| GET    | `/users`                | **Admin** | Obtener todos los usuarios    | ✅           |
| GET    | `/users/:id`            | **Admin** | Obtener usuario por ID        | ✅           |
| POST   | `/users`                | **Admin** | Crear nuevo usuario           | ✅           |
| PUT    | `/users/:id`            | Usuario   | Actualizar perfil de usuario  | ✅           |
| DELETE | `/users/:id`            | **Admin** | Eliminar usuario              | ✅           |

</details>

<details>
<summary>🔐 Módulo de Autenticación</summary>

| Método | Ruta             | Auth    | Descripción               | Implementado |
| ------ | ---------------- | ------- | ------------------------- | ------------ |
| POST   | `/auth/register` | Público | Registrar nuevo usuario   | ✅           |
| POST   | `/auth/login`    | Público | Inicio de sesión          | ✅           |
| POST   | `/auth/refresh`  | Público | Refrescar token de acceso | ✅           |

</details>

<details>
<summary>❤️ Health Check</summary>

| Método | Ruta      | Auth    | Descripción                 | Implementado |
| ------ | --------- | ------- | --------------------------- | ------------ |
| GET    | `/health` | Público | Estado de salud del sistema | ✅           |

</details>


## 🛡️ Políticas Globales

* **Rate Limiting:** 100 RPM (usuarios) · 300 RPM (admins)
* **Validación:** pipes de `class‑validator` en todas las peticiones
* **CORS:** Activado para todos los orígenes (configurable)
* **Compresión:** Gzip para payloads >1 KB
* **Cache‑Control:** Cabeceras inteligentes en endpoints GET
* **Request ID:** Cada petición se registra con UUID para rastreo

---

## 🩺 Salud, Métricas y Observabilidad

* `GET /health` – chequeo de vida/servicio
* Métricas Prometheus en `/metrics`
* Trazas distribuidas vía OpenTelemetry (exportador consola por defecto)
* Logs estructurados JSON con Winston (ámbitos request y error)

---

## 🧪 Ejecutar Pruebas

```bash
# e2e
npm run test:e2e

```
![image](https://github.com/user-attachments/assets/35ff6b8d-1626-4840-a240-36d02bc824bc)


