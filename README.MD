# Documentación de API con Swagger — Provincias Argentinas

## 1. Descripción del proyecto

**TP-08 - PG Provincias** es una API REST desarrollada en **Node.js + Express** que permite gestionar un ABM (alta, baja, modificación y consulta) de las 20 provincias argentinas. Los datos se manejan en una base de datos **PostgreSQL alojada en Supabase** (anteriormente se manejaban en memoria, en `src/data/provinces.js`; ese archivo quedó deprecado tras la migración).

Es una **API propia**, desarrollada íntegramente por el grupo, con arquitectura en capas:

- **Controller** → rutas y validación de entrada HTTP
- **Service** → reglas de negocio, validaciones de dominio y logging de errores
- **Repository** → acceso a los datos, usando el driver `pg` contra Supabase

**URL base:** `http://localhost:3000`

## 2. Por qué esta API

- Tiene 7 endpoints (supera el mínimo de 6 pedido).
- CRUD completo (GET, POST, PUT, PATCH, DELETE), incluyendo una actualización parcial (PATCH) además de la completa (PUT), más un endpoint de consulta extra (orden por `display_order`).
- Validaciones de negocio bien definidas que disparan distintos códigos de error (400, 404, 500), ideal para documentar respuestas.
- Persistencia real en base de datos (Postgres / Supabase), en vez de datos en memoria.

## 3. Endpoints

| Método | Endpoint                         | Descripción                                                                 |
|--------|-----------------------------------|------------------------------------------------------------------------------|
| GET    | `/api/province/`                  | Obtiene el listado completo de provincias.                                  |
| GET    | `/api/province/order?sort=asc\|desc` | Devuelve todas las provincias ordenadas por `display_order` (asc por defecto). |
| GET    | `/api/province/:id`               | Obtiene una provincia puntual por ID.                                       |
| POST   | `/api/province/`                  | Crea una nueva provincia (ID autogenerado, valida campos obligatorios).     |
| PUT    | `/api/province/`                  | Actualiza una provincia existente (el `id` del body debe existir).          |
| PATCH  | `/api/province/:id`               | Actualiza únicamente el `name` de una provincia existente.                  |
| DELETE | `/api/province/:id`               | Elimina una provincia por ID.                                               |

## 4. Modelo `Provincia`

| Propiedad       | Tipo   | Descripción                                                                 |
|------------------|--------|------------------------------------------------------------------------------|
| `id`             | number | Generado automáticamente por la base de datos (`serial`, no se envía en el alta). |
| `name`           | string | Nombre corto. Mínimo 3 caracteres.                                          |
| `full_name`      | string | Nombre oficial completo. Mínimo 5 caracteres.                               |
| `latitude`       | string | Latitud del centro de la provincia (texto, debe representar un número).     |
| `longitude`      | string | Longitud del centro de la provincia (texto, debe representar un número).    |
| `display_order`  | number | Orden opcional para listados.                                               |

```json
{
  "id": 1,
  "name": "Buenos Aires",
  "full_name": "Provincia de Buenos Aires",
  "latitude": "-36.6769",
  "longitude": "-60.5588",
  "display_order": 1
}
```

## 5. Base de datos (Supabase / PostgreSQL)

Los datos se migraron de un array en memoria a una tabla `provinces` en un proyecto de **Supabase**.

### Tabla `provinces`

```sql
create table if not exists provinces (
    id serial primary key,
    name varchar(100) not null,
    full_name varchar(150) not null,
    latitude text not null,
    longitude text not null,
    display_order integer
);
```

Las 20 provincias se cargaron con un `INSERT` inicial ejecutado desde el **SQL Editor** de Supabase, usando los mismos datos que antes estaban hardcodeados en `src/data/provinces.js`.

### Variables de entorno (`.env`)

El archivo `.env` (excluido del repo vía `.gitignore`) contiene la conexión a la base, obtenida desde **Connect → Transaction pooler → URI** en el dashboard de Supabase:

```env
DB_USER=postgres.<project-ref>
DB_HOST=aws-0-<region>.pooler.supabase.com
DB_NAME=postgres
DB_PASSWORD=<password del proyecto>
DB_PORT=6543

LOG_FILE_PATH=./logs/
LOG_FILE_NAME=app.log
LOG_TO_FILE_ENABLED=true
LOG_TO_CONSOLE_ENABLED=true
```

Se eligió el **Transaction pooler** (puerto `6543`) porque el patrón de conexión del repository abre y cierra una conexión nueva (`new Client()` → `connect()` → query → `end()`) en cada método, en vez de mantener una conexión persistente — exactamente el caso de uso que ese modo de pooler está pensado para soportar.

### `src/configs/db-config.js`

Lee la configuración desde el `.env` y agrega `ssl`, requerido por Supabase:

```js
import 'dotenv/config';

const DBConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
    ssl: { rejectUnauthorized: false }
};

export default DBConfig;
```

### `src/repositories/repository-province.js`

Se reemplazó el acceso al array en memoria por queries SQL parametrizadas contra `provinces`, manteniendo la misma firma de métodos que antes (`getAllAsync`, `getByIdAsync`, `getAllOrderedAsync`, `createAsync`, `updateAsync`, `updateNameAsync`, `deleteByIdAsync`), por lo que **el service y el controller no necesitaron cambios de interfaz** para los métodos preexistentes. El único método nuevo, `updateNameAsync`, se agregó siguiendo el mismo patrón que el resto (query parametrizada, propio `Client`, `RETURNING *`).

Cada método abre su propio `Client`, ejecuta la query y cierra la conexión en el `finally`, atrapando errores de conexión con `logHelper.logError(error)`.

## 6. Cómo levantar el proyecto

```bash
npm install
node swagger.js   # regenera swagger_output.json y luego levanta el servidor
```

Documentación interactiva disponible en:

**http://localhost:3000/api-docs**

## 7. Cómo está implementado Swagger

- `swagger-autogen` genera la especificación (`swagger_output.json`) a partir de comentarios `#swagger.*` puestos en cada ruta de `src/controllers/province-controller.js`.
- `swagger.js` define la config base del doc (título, descripción, versión, host, schemes) y los modelos reutilizables `Provincia` / `ProvinciaInput` / `ProvinciaNombreInput` en `@definitions`, referenciados con `$ref` en cada endpoint. `ProvinciaNombreInput` es el modelo del body que espera el PATCH: solo el campo `name`.
- `index.js` importa el JSON generado y monta la UI con:
```js
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
```

## 8. Códigos de respuesta

| Código | Significado           | Cuándo se produce                                                                 |
|--------|------------------------|-------------------------------------------------------------------------------------|
| 200    | OK                     | Consulta o actualización resuelta correctamente (GET, PUT, PATCH).                 |
| 201    | Created                | Provincia creada correctamente (`POST /api/province/`).                            |
| 400    | Bad Request            | ID no numérico, parámetro `sort` inválido, o campos obligatorios inválidos (incluyendo el `name` del PATCH). |
| 404    | Not Found              | Provincia inexistente por ID, o update/patch/delete sobre un ID inexistente.        |
| 500    | Internal Server Error  | Error inesperado, capturado por el try/catch de cada endpoint.                     |

## 9. Logging de errores

Se centralizó el registro de errores en `src/helpers/log-helper.js` (ya existente), que escribe en archivo y/o consola según `LOG_TO_FILE_ENABLED` / `LOG_TO_CONSOLE_ENABLED` del `.env`.

- **Repository:** cada método atrapa errores de conexión/consulta a la base y los loguea con `logHelper.logError(error)`. No los vuelve a lanzar; ante un fallo, devuelve `null` (o array vacío en los métodos que listan), para no tirar abajo el servidor ante un problema puntual de conexión.
- **Service:** se agregó un `try/catch` en cada método (`getAllAsync`, `getByIdAsync`, `getAllOrderedAsync`, `createAsync`, `updateAsync`, `updateNameAsync`, `deleteByIdAsync`) que loguea cualquier error con `logHelper.logError(error)` y luego lo vuelve a lanzar (`throw error`) para no alterar el comportamiento que ya manejaba el controller (distinguir `error.esValidacion` para devolver 400).

Con esto, los errores de **validación** (`validarProvincia`, en `src/helpers/validaciones-helper.js`) quedan registrados en el log además de disparar el `400` esperado — algo que antes no sucedía, ya que el `service` no tenía manejo de errores propio y el error solo era atrapado por el `controller` sin loguearse. `updateNameAsync` reutiliza la misma `validarProvincia` en vez de tener su propia lógica de validación: arma un objeto completo (los datos existentes de la provincia + el `name` nuevo) y lo valida como si fuera un update completo, así el PATCH queda consistente con las mismas reglas de negocio del resto del CRUD.

## 10. Pruebas realizadas desde Swagger UI

- ✅ GET: listado completo y consulta por ID.
- ✅ POST / PUT: creación y actualización enviando body en JSON.
- ✅ PATCH: actualización parcial del nombre por ID.
- ✅ Endpoint con query params: listado ordenado (`order?sort=`).
- ✅ DELETE: eliminación por ID.

## 11. Evidencia

### GET /api/province/

![GET /api/province](assets/image.png)

### POST /api/province/

![POST /api/province](assets/image-1.png)

### PUT /api/province/

![PUT /api/province](assets/image-2.png)

### PATCH /api/province/:id

![PATCH /api/province/:id](assets/image-3.png)

### GET /api/province/order?sort=asc|desc

![GET /api/province/order](assets/image-4.png)

### GET /api/province/:id

![GET /api/province/:id](assets/image-5.png)

### DELETE /api/province/:id

![DELETE /api/province/:id](assets/image-6.png)

## 12. Problemas encontrados y cómo fueron solucionados

**Los modelos no se generaban como esquemas reutilizables.** Al principio definimos los modelos en `swagger.js` como una clave normal `definitions` dentro del objeto `doc`, y `swagger-autogen` los interpretaba como un simple ejemplo fijo (mostraba todo el JSON de ejemplo pero no generaba los campos editables del formulario en Swagger UI). Se solucionó cambiando la clave a `@definitions`, que es la que `swagger-autogen` reconoce específicamente para registrar esquemas reutilizables y referenciarlos con `$ref` en cada endpoint.

**`swagger_output.json` no se generaba ni se actualizaba.** Al principio, `swagger.js` no estaba llamando correctamente a `swaggerAutogen` (faltaba la dependencia instalada / la importación estaba mal hecha), por lo que al ejecutar el script no se creaba el archivo `swagger_output.json`, y si ya existía uno viejo, tampoco se actualizaba con los nuevos comentarios `#swagger.*` agregados en el controlador. Se solucionó instalando bien la dependencia `swagger-autogen` y verificando que `swagger.js` llame correctamente a `swaggerAutogen(outputFile, endpointsFiles, doc)` antes de levantar el servidor. Este mismo problema reapareció al agregar el endpoint PATCH: el JSON viejo no tenía ni el path ni la definición `ProvinciaNombreInput`, lo que hacía fallar la UI con un "Resolver error" al no poder resolver el `$ref`. Se solucionó agregando `ProvinciaNombreInput` a `@definitions` en `swagger.js` y regenerando el archivo con `node swagger.js`.

**Error al correr `node index.js` directamente.** Como `index.js` importa el archivo generado con `import swaggerFile from "./swagger_output.json" with { type: "json" }`, si se intentaba levantar el servidor con `node index.js` (o `npm start`) antes de haber ejecutado `swagger.js` al menos una vez, `swagger_output.json` no existía todavía y el servidor tiraba un error de módulo no encontrado al arrancar. Se solucionó dejando en claro que el flujo correcto es siempre ejecutar primero `node swagger.js` (que genera el archivo y recién después levanta `index.js`), y no `node index.js` de forma aislada.

**El servidor se quedaba colgado al conectar con Supabase.** Al usar el host de conexión directa (`db.<project-ref>.supabase.co`, puerto `5432`), el `client.connect()` nunca resolvía ni tiraba error — se quedaba esperando indefinidamente. La causa es que ese host solo resuelve por IPv6, y muchas redes (incluida la usada para probar el proyecto) no tienen salida IPv6, por lo que el intento de conexión queda colgado en vez de fallar. Se solucionó usando el **Transaction pooler** de Supabase (host `aws-0-<region>.pooler.supabase.com`, puerto `6543`, usuario `postgres.<project-ref>`), que sí resuelve por IPv4 y además es el modo recomendado para conexiones breves y aisladas como las que usa el repository.

**El `PUT` devolvía 200 en vez de 404 al actualizar una provincia inexistente.** El repository devolvía `result.rows[0]` directamente. Cuando una query no encuentra ninguna fila, `result.rows` es un array vacío, y acceder a `result.rows[0]` en JavaScript da `undefined`, no `null`. Como el `service` y el `controller` comparan explícitamente contra `null` (`if (provincia === null)`), esa condición nunca se cumplía con `undefined`, y el flujo seguía de largo hasta responder `200` con el body vacío. Se solucionó cambiando `result.rows[0]` por `result.rows[0] || null` en `getByIdAsync`, `createAsync`, `updateAsync`, `updateNameAsync` y `deleteByIdAsync`, asegurando que "no encontrado" siempre se represente como `null` de forma consistente.

**Los errores de validación no quedaban registrados en el log.** El `service` no tenía manejo de errores propio: cuando `validarProvincia` lanzaba una excepción, esta viajaba directo hasta el `controller` sin pasar por `logHelper`. Se solucionó agregando un `try/catch` en cada método del `service`, que loguea el error con `logHelper.logError(error)` y lo vuelve a lanzar (`throw error`), preservando el comportamiento del `controller` (que sigue distinguiendo `error.esValidacion` para responder 400) pero ahora con trazabilidad completa en el log.
