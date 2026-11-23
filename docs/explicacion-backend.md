# Explicación del backend agropecuario

Este documento describe cómo está organizado el backend, qué responsabilidad
tiene cada carpeta y cómo fluye una solicitud desde la API hasta MongoDB.
El proyecto está construido con Node.js, Express y Mongoose.

## 1. Estructura de carpetas

```text
backend/
├── .env.example
├── package.json
├── README.md
├── public/
│   └── scripts/
├── scripts/
│   └── seed.js
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   └── utils/
└── tests/
```

### Archivos de la raíz de `backend`

- **`.env.example`**: muestra las variables requeridas para ejecutar el
  servidor: `PORT`, `MONGODB_URI` y `JWT_SECRET`. Se copia a `.env` para
  configurar valores locales; `.env` no se debe subir al repositorio.
- **`package.json`**: declara dependencias y comandos. `npm run dev` inicia
  Nodemon, `npm start` inicia el servidor normalmente y `npm test` ejecuta las
  pruebas de Node.js.
- **`README.md`**: contiene instalación, configuración, arranque y resumen de
  las rutas de la API.
- **`public/`**: espacio reservado para recursos estáticos. Actualmente no
  contiene lógica de la API.
- **`scripts/`**: espacio para tareas manuales como carga inicial de datos.
- **`tests/`**: pruebas automatizadas. `domain-validation.test.js` comprueba
  algunas reglas de entrada, como impedir que el registro elija su propio rol
  y rechazar cantidades o áreas inválidas.

### Código dentro de `src`

- **`app.js`**: crea la aplicación Express, configura el límite del JSON,
  registra las rutas, expone `GET /health` y centraliza las respuestas de error.
- **`server.js`**: carga la configuración, conecta MongoDB e inicia el servidor
  solo cuando la conexión se completa correctamente.
- **`config/`**: configuración compartida:
  - `env.js` carga y valida las variables de entorno.
  - `db.js` conecta Mongoose a MongoDB.
- **`middlewares/`**: funciones que se ejecutan durante las solicitudes:
  - `auth.js` verifica el token Bearer y agrega el usuario autenticado a
    `req.user`.
  - `validate.js` valida y normaliza partes de la solicitud mediante Joi.
  - `errorHandler.js` convierte errores de validación, MongoDB y de negocio en
    respuestas HTTP.
  - `rbac.js` contiene un control reutilizable de permisos por rol.
  - `audit.js` está reservado para auditoría; todavía no está conectado a las
    rutas del flujo actual.
- **`modules/`**: funcionalidades del negocio, separadas por dominio. Cada
  módulo normalmente tiene rutas, controlador, servicio, esquema de
  validación y modelo de MongoDB.
- **`utils/`**: funciones comunes para reducir duplicación:
  - `resourceRoutes.js` crea rutas CRUD protegidas y paginadas.
  - `resourceController.js` traduce solicitudes HTTP a operaciones del
    servicio y da forma a las respuestas.
  - `resourceService.js` realiza operaciones comunes de consulta, creación,
    actualización y eliminación en MongoDB.
  - `ensureOwned.js` verifica que las referencias pertenezcan al usuario y
    evita borrar registros que aún tienen dependencias.

## 2. Módulos funcionales

| Módulo | Propósito |
| --- | --- |
| `auth/` | Registro e inicio de sesión; genera tokens JWT. |
| `usuarios/` | Consulta y actualización del perfil del usuario autenticado. |
| `terrenos/` | Registro de terrenos, ubicación y área disponible. |
| `cultivos/` | Catálogo de cultivos y variedades. |
| `siembras/` | Relaciona un terreno con un cultivo y registra área, fechas y estado. |
| `cosecha/` | Registra cantidades cosechadas asociadas a una siembra. |
| `inventario/` | Controla existencias, unidades, mínimos y costos de insumos. |
| `costos/` | Registra gastos generales o vinculados a un terreno/siembra. |
| `trazabilidad/` | Registra eventos del ciclo productivo y consulta su historial. |
| `reportes/` | Calcula indicadores resumidos de la operación. |

Los módulos operativos guardan `ownerId` en sus registros. Las búsquedas,
actualizaciones y eliminaciones usan el identificador del usuario autenticado,
para que una cuenta no gestione los datos de otra.

## 3. Responsabilidad de los archivos de un módulo

Un módulo CRUD, por ejemplo `terrenos/`, sigue esta separación:

1. **`routes.js`** define los métodos y caminos HTTP y aplica autenticación y
   validación.
2. **`schema.js`** declara qué campos acepta la API y sus límites.
3. **`controller.js`** recibe `req`/`res`, llama al servicio y fija el código
   HTTP de la respuesta.
4. **`service.js`** concentra reglas de negocio y llama a las operaciones de
   datos comunes o específicas.
5. **`model.js`** define el esquema Mongoose, los tipos, valores permitidos e
   índices de MongoDB.

`auth/` tiene una implementación propia porque registro e inicio de sesión no
son operaciones CRUD generales. `reportes/` también tiene lógica específica
porque construye agregaciones y resúmenes; por eso no tiene modelo ni servicio
genérico.

## 4. Flujo de una solicitud

Ejemplo: crear una siembra.

1. El cliente envía `POST /api/siembras` con un token en
   `Authorization: Bearer <token>` y los datos JSON.
2. Express encuentra la ruta montada en `app.js`.
3. `resourceRoutes.js` aplica `authenticate` y valida el cuerpo con el esquema
   de siembras.
4. `auth.js` valida el JWT y guarda el identificador y rol en `req.user`.
5. El controlador invoca el servicio con el usuario actual y los datos.
6. El servicio comprueba que el terreno y el cultivo existen y pertenecen a
   ese usuario; también comprueba que el área sembrada no exceda la del terreno.
7. El modelo Mongoose valida y persiste el documento en MongoDB.
8. El controlador devuelve `201 Created` con el registro dentro de `data`.
9. Si ocurre un error, `errorHandler.js` lo convierte en una respuesta con el
   código y el mensaje correspondientes.

## 5. Rutas principales

| Ruta | Uso |
| --- | --- |
| `GET /health` | Comprueba que Express responde. |
| `POST /api/auth/register` | Crea una cuenta de productor e inicia sesión. |
| `POST /api/auth/login` | Valida credenciales y devuelve un JWT. |
| `/api/usuarios/me` | Consulta o actualiza el perfil propio. |
| `/api/terrenos` | Gestiona terrenos. |
| `/api/cultivos` | Gestiona cultivos. |
| `/api/siembras` | Gestiona siembras. |
| `/api/cosechas` | Gestiona cosechas. |
| `/api/inventario` | Gestiona existencias. |
| `/api/costos` | Gestiona gastos. |
| `/api/trazabilidad` | Gestiona eventos de producción. |
| `GET /api/trazabilidad/siembra/:sowingId` | Consulta eventos, cosechas y costos de una siembra. |
| `GET /api/reportes/resumen` | Devuelve conteos, costos, cosecha y alertas de inventario. |

Las rutas CRUD de los módulos operativos aceptan `GET /` (listado paginado),
`POST /`, `GET /:id`, `PATCH /:id` y `DELETE /:id`. Las rutas protegidas
requieren un JWT. Los listados reciben `page` y `limit`; el máximo de `limit`
es 100.

## 6. Reglas de negocio que ya están implementadas

- La contraseña se almacena como hash con sal mediante `scrypt`, no como texto
  legible.
- La cuenta nueva se registra como `productor`; el cliente no puede asignarse
  un rol en el registro.
- Cada recurso operativo pertenece a un usuario.
- Las referencias de una siembra, cosecha, costo o evento de trazabilidad se
  verifican antes de guardar.
- El área de la siembra no puede superar el área del terreno.
- El área de un terreno no puede reducirse por debajo de una siembra existente.
- No se permite eliminar terrenos o cultivos asociados a siembras, ni
  siembras asociadas a cosechas, costos o trazabilidad.
- Los errores de validación se notifican al cliente; los errores internos se
  registran en la consola y no exponen detalles internos en la respuesta.
- Los roles admitidos incluyen administrador, técnico agrícola, operario y
  productor.
- Los terrenos conservan estado operativo, coordenadas y análisis físico-químico.
- Las siembras usan el ciclo activa, finalizada y liquidada. Las transiciones
  regresivas desde liquidada quedan bloqueadas.
- El stock del inventario es solo lectura en el catálogo y debe calcularse
  mediante movimientos registrados.

## 7. Configuración y ejecución

Desde la carpeta `backend`, instala dependencias y crea el archivo local de
variables:

```bash
npm install
```

```powershell
Copy-Item .env.example .env
```

Configura `MONGODB_URI` y establece en `JWT_SECRET` un secreto aleatorio de al
menos 32 caracteres. Después inicia el servidor en desarrollo:

```bash
npm run dev
```

El servidor usa el puerto `3000` por defecto. MongoDB debe estar disponible
antes de iniciar el backend. Para ejecutar las pruebas:

```bash
npm test
```

## 8. Convenciones de respuesta

Un recurso individual se devuelve dentro de `data`:

```json
{
  "data": {
    "_id": "identificador",
    "name": "Ejemplo"
  }
}
```

Un listado añade información de paginación:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "pages": 0
  }
}
```

Los errores usan un objeto `error`; cuando son errores de validación, también
incluyen una lista `details` con los campos que deben corregirse.
