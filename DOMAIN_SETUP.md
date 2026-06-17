# Setup de dominios (landing + app + api)

La app y la landing viven en **un solo proyecto Vercel** (una sola SPA), separadas
por **hostname** (opción "B1"). El aislamiento es por dominio, no por build.

## Superficies

| Dominio | Sirve | Dónde corre |
|---|---|---|
| `tepidolacuenta.site` (apex) | Landing | Vercel |
| `app.tepidolacuenta.site` | App (dashboard, auth, `/request`) | Vercel (mismo proyecto) |
| `api.tepidolacuenta.site` | Backend | EC2 (AWS) |

**Comportamiento:**
- `tepidolacuenta.site/` → landing · `tepidolacuenta.site/<ruta-de-app>` → redirige a `app.`
- `app.tepidolacuenta.site/` → app (a `/dashboard` si hay sesión, si no `/login`) · resto de rutas → normales
- `localhost` y `*.vercel.app` (previews) → **sin separación**: todo funciona en el mismo host (no rompe dev/preview)

## DNS (Hostinger)

| Tipo | Nombre | Valor |
|---|---|---|
| `A` / ALIAS | `@` (apex) | el que indique Vercel (p. ej. `76.76.21.21`) |
| `CNAME` | `app` | `cname.vercel-dns.com` |
| `A` | `api` | IP del EC2 *(ya configurado)* |

## Vercel
- Project → Settings → Domains → agregar `app.tepidolacuenta.site` **y** `tepidolacuenta.site`.
- Vercel emite el SSL automáticamente (gratis). Ambos dominios sirven el mismo deployment.

## Frontend (Vercel) — variables de entorno (Production)
> ⚠️ Vite "hornea" estas vars en el **build**. Si las cambiás, **hay que redeploy** para que tomen.

| Variable | Valor |
|---|---|
| `VITE_API_BASE_URL` | `https://api.tepidolacuenta.site` |
| `VITE_WS_BASE_URL` | `api.tepidolacuenta.site` *(sin esquema; el cliente arma `wss://`)* |
| `VITE_USE_MOCK` | `false` (o sin setear) |

La app corre en `https`, así que la API debe ser `https://api...` (si no, el navegador bloquea por mixed-content).

## Backend (EC2) — variables de entorno
Viven como **GitHub Actions secrets** (ver `deploy.yml`); para cambiarlas, editar el secret y re-correr el deploy.
- `FRONTEND_BASE_URL=https://app.tepidolacuenta.site` *(define la URL de los QR, links de email y redirects)*
- `CORS_ALLOWED_ORIGINS` → **separado por comas, sin espacios**, con esquema y match exacto:
  `https://app.tepidolacuenta.site,https://tepidolacuenta.site`

## Integraciones externas
- **Google OAuth** (Cloud Console): *Authorized JS origins* + *Redirect URIs* con `https://app.tepidolacuenta.site`.
- **MercadoPago:** URLs de retorno → `https://app.tepidolacuenta.site/payment/{success,failure,pending}`.

## Cómo está implementado (código)
- **`src/ui/utils/host.ts`** — fuente única de los hosts (`APP_HOST`, `APP_ORIGIN`, `isAppHost()`, `isMarketingHost()`, `isNeutralHost()`). **Para cambiar el dominio, se edita solo acá.**
- **`src/ui/hooks/useDomainRouting.ts`** (montado en `AppRouter`) — en el apex, redirige las rutas de app al subdominio `app.`.
- **`src/ui/pages/Landing/index.tsx`** — en `app.`, la landing redirige a la app (y no fetchea planes).

## Migración futura a 2 proyectos (B2)
Si la landing crece y querés deploys independientes: se crea un segundo proyecto Vercel
para la app y se apunta `app.tepidolacuenta.site` ahí. Como la app **ya vive en `app.`**,
el cambio es transparente para los usuarios.

## Probar en producción
1. `app.tepidolacuenta.site` → debe caer en `/login` o `/dashboard`.
2. `tepidolacuenta.site/dashboard` → debe rebotar a `app.tepidolacuenta.site/dashboard`.
3. Login con Google, flujo de pago (MercadoPago) y escaneo del QR (`/request`).
