# Backend agropecuario

API REST con Express y MongoDB para gestionar usuarios, terrenos, cultivos,
siembras, cosechas, inventario, costos, reportes y trazabilidad. Los datos
operativos se aíslan por usuario autenticado.

## Requisitos

- Node.js 18 o posterior.
- MongoDB local o una instancia accesible.

## Arranque local

Desde esta carpeta (`backend`):

```bash
npm install
```

```powershell
Copy-Item .env.example .env
```

Configura `MONGODB_URI` y `JWT_SECRET` en `.env`. Usa un secreto aleatorio de al
menos 32 caracteres y no lo compartas ni lo subas al repositorio.

```bash
npm run dev
```

En producción, inicia con `npm start`. La API queda disponible en `PORT`
(3000 por defecto); MongoDB debe estar conectado antes de iniciar el servidor.

## API

- `GET /health`
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/usuarios/me`, `PATCH /api/usuarios/me`
- CRUD autenticado: `/api/terrenos`, `/api/cultivos`, `/api/siembras`,
  `/api/cosechas`, `/api/inventario`, `/api/costos`, `/api/trazabilidad`
- `GET /api/reportes/resumen?from=2026-01-01&to=2026-12-31`
- `GET /api/trazabilidad/siembra/:sowingId`

Para rutas protegidas, envía `Authorization: Bearer <token>`. Las colecciones
CRUD admiten `GET /` con paginación `page` y `limit` (máximo 100), `POST /`,
`GET /:id`, `PATCH /:id` y `DELETE /:id`. Las respuestas de recursos usan
`{ data }`; los listados también incluyen `pagination`.

Las referencias a terrenos, cultivos y siembras deben pertenecer al usuario
autenticado. No se permite sembrar un área superior al área del terreno ni
eliminar registros que todavía tengan cosechas, costos o trazabilidad
asociados.

Los roles disponibles son `administrador`, `tecnico`, `operario` y
`productor`. Los terrenos usan los estados `disponible`, `en_preparacion`,
`sembrado`, `cosechado` y `en_descanso`. Las siembras pasan entre `activa`,
`finalizada` y `liquidada`, sin volver de liquidada a un estado anterior.

El campo `quantity` del catálogo de inventario es calculado y no puede
modificarse directamente desde la API; las variaciones deben registrarse como
movimientos trazables.
