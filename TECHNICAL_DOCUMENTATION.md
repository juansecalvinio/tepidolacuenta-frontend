# Documentación Técnica - Tepidolacuenta Frontend

## Índice
1. [Descripción General](#descripción-general)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura de Directorios](#estructura-de-directorios)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Módulos Core](#módulos-core)
7. [Capa de Infraestructura](#capa-de-infraestructura)
8. [Capa de UI](#capa-de-ui)
9. [Gestión de Estado](#gestión-de-estado)
10. [Flujos de Datos](#flujos-de-datos)
11. [Configuración y Deployment](#configuración-y-deployment)
12. [Endpoints API](#endpoints-api)

---

## Descripción General

**Tepidolacuenta** es una aplicación web para gestión de mesas y pedidos de cuenta en restaurantes. Permite a los clientes escanear códigos QR en las mesas para solicitar la cuenta, y a los empleados del restaurante gestionar estas solicitudes en tiempo real.

### Características principales
- Autenticación con JWT
- Creación y gestión de restaurantes
- Generación automática de QR codes por mesa
- Sistema de solicitud de cuenta para clientes
- Dashboard para personal del restaurante
- Modo mock para desarrollo sin backend

---

## Stack Tecnológico

### Framework y Build
- **React 19.2.0** - Framework de UI
- **TypeScript 5.9.3** - Tipado estático
- **Vite 7.2.4** - Build tool y dev server
- **React Router DOM 7.11.0** - Enrutamiento del lado del cliente

### Gestión de Estado
- **Zustand 5.0.9** - State management ligero con middleware

### Estilos
- **Tailwind CSS 4.1.18** - Framework CSS utility-first
- **DaisyUI 5.5.14** - Biblioteca de componentes para Tailwind
- **@tailwindcss/vite 4.1.18** - Plugin de Tailwind para Vite

### Librerías Adicionales
- **React QR Code 2.0.18** - Generación de códigos QR
- **ESLint & TypeScript ESLint** - Linting y validación de tipos

---

## Arquitectura del Proyecto

El proyecto implementa **Clean Architecture** con tres capas principales:

```
┌─────────────────────────────────────────────┐
│     UI Layer (Componentes React)           │
│   Pages, Layouts, Components, Hooks        │
├─────────────────────────────────────────────┤
│    Application Layer (Custom Hooks)        │
│  useFetchAuth, useFetchTables, etc.        │
├─────────────────────────────────────────────┤
│    Use Cases (Lógica de Negocio)          │
│  Login, Register, CreateTables, etc.       │
├─────────────────────────────────────────────┤
│   Repository Interfaces (Contratos)       │
│  AuthRepository, TableRepository, etc.     │
├─────────────────────────────────────────────┤
│   Infrastructure (HTTP & Mocks)            │
│  ApiAuthRepository, MockAuthRepository     │
├─────────────────────────────────────────────┤
│    HTTP Client & API Communication         │
│      (Cliente HTTP basado en Fetch)        │
└─────────────────────────────────────────────┘
```

### Principios de Diseño

1. **Separation of Concerns**: La lógica de negocio está aislada de la UI y las llamadas HTTP
2. **Dependency Injection**: Los repositorios se inyectan mediante factories
3. **Testabilidad**: Cada capa puede ser testeada independientemente
4. **Flexibilidad**: Fácil intercambio entre implementaciones API ↔ Mock

---

## Estructura de Directorios

```
tepidolacuenta-frontend/
├── src/
│   ├── core/                        # Lógica de negocio y acceso a datos
│   │   ├── api/                     # Cliente HTTP y utilidades
│   │   │   ├── http-client.ts       # Cliente HTTP personalizado
│   │   │   └── mock-client.ts       # Cliente para mocks
│   │   └── modules/                 # Módulos por feature
│   │       ├── auth/                # Autenticación
│   │       ├── bill-request/        # Solicitudes de cuenta
│   │       ├── restaurant/          # Restaurantes
│   │       └── tables/              # Mesas
│   └── ui/                          # Capa de presentación
│       ├── components/              # Componentes reutilizables
│       ├── contexts/                # Stores Zustand
│       ├── hooks/                   # Custom React hooks
│       ├── layouts/                 # Componentes de layout
│       ├── pages/                   # Componentes de páginas
│       ├── router/                  # Configuración de rutas
│       ├── App.tsx                  # Componente raíz
│       └── main.tsx                 # Entry point
├── package.json
├── tsconfig.app.json
├── vite.config.ts
├── tailwind.config.ts
├── vercel.json                      # Configuración de Vercel
└── index.html
```

### Estructura de un Módulo

Cada módulo sigue el mismo patrón:

```
module-name/
├── domain/
│   ├── models/              # Interfaces y tipos TypeScript
│   └── repositories/        # Interfaces de repositorios
├── infrastructure/
│   ├── repositories/        # Implementaciones API y Mock
│   └── factories/           # Dependency injection factories
└── use-cases/               # Funciones de lógica de negocio
```

---

## Patrones de Diseño

### 1. Repository Pattern

**Propósito**: Abstrae el acceso a datos detrás de interfaces

**Ejemplo**:
```typescript
// Interfaz (Contrato)
export interface AuthRepository {
  register(user: RegisterRequest): Promise<RegisterResponse>;
  login(user: LoginRequest): Promise<LoginResponse>;
}

// Implementación API
export class ApiAuthRepository implements AuthRepository {
  async login(user: LoginRequest): Promise<LoginResponse> {
    return api.post<LoginResponse>('/api/v1/auth/login', user);
  }
}

// Implementación Mock
export class MockAuthRepository implements AuthRepository {
  async login(user: LoginRequest): Promise<LoginResponse> {
    // Retorna datos de prueba
  }
}
```

### 2. Use Cases (Application Services)

**Propósito**: Encapsulan la lógica de negocio

**Ejemplo**:
```typescript
export const Login = (repository: AuthRepository) =>
  async (credentials: LoginRequest): Promise<LoginResponse> => {
    return repository.login(credentials);
  };
```

### 3. Factory Pattern

**Propósito**: Selección de implementación en runtime

**Ejemplo**:
```typescript
export const getAuthRepository = (): AuthRepository => {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";
  return useMock ? new MockAuthRepository() : new ApiAuthRepository();
};
```

### 4. Custom Hooks para Integración

**Propósito**: Conectar UI con lógica de negocio

**Ejemplo**:
```typescript
export const useFetchAuth = () => {
  const { setAuth, setLoading, setError } = useAuthContext();

  const login = async (credentials: LoginRequest) => {
    setLoading(true);
    const repository = getAuthRepository();
    const loginUseCase = Login(repository);
    const response = await loginUseCase(credentials);

    if (response.success) {
      sessionStorage.setItem("auth-token", response.data.token);
      setAuth(response.data.user, response.data.token, restaurantId);
    }
  };

  return { login };
};
```

---

## Módulos Core

### 1. Auth Module

**Ubicación**: `src/core/modules/auth/`

**Responsabilidad**: Autenticación y autorización de usuarios

#### Modelos
- **User**: `id`, `email`, `username`, `createdAt`, `updatedAt`
- **LoginRequest**: `email`, `password`
- **LoginResponse**: `success`, `data: { token, user }`
- **RegisterRequest**: `email`, `username`, `password`
- **RegisterResponse**: `success`, `data: { user }`

#### Repositorio
```typescript
interface AuthRepository {
  register(user: RegisterRequest): Promise<RegisterResponse>
  login(user: LoginRequest): Promise<LoginResponse>
}
```

#### Use Cases
- **Login**: `Login(repository) => (credentials) => Promise<LoginResponse>`
- **Register**: `Register(repository) => (userData) => Promise<RegisterResponse>`

#### Endpoints
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Login con token JWT

---

### 2. Restaurant Module

**Ubicación**: `src/core/modules/restaurant/`

**Responsabilidad**: Gestión de información de restaurantes

#### Modelos
- **Restaurant**: `id`, `userId`, `name`, `address`, `phone`, `description`, timestamps
- **CreateRestaurantRequest**: `name`, `address`, `phone`, `description`
- **CreateRestaurantResponse**: `success`, `data: Restaurant`
- **GetRestaurantsResponse**: `success`, `data: Restaurant[]`

#### Repositorio
```typescript
interface RestaurantRepository {
  createRestaurant(request: CreateRestaurantRequest): Promise<CreateRestaurantResponse>
  getRestaurants(): Promise<GetRestaurantsResponse>
}
```

#### Use Cases
- **CreateRestaurant**: Crear nuevo restaurante
- **GetRestaurants**: Obtener restaurantes del usuario

#### Endpoints
- `POST /api/v1/restaurants` - Crear restaurante
- `GET /api/v1/restaurants` - Obtener restaurantes del usuario

---

### 3. Tables Module

**Ubicación**: `src/core/modules/tables/`

**Responsabilidad**: Gestión de mesas del restaurante

#### Modelos
- **Table**: `id`, `restaurantId`, `number`, `capacity`, `qrCode`, `isActive`, timestamps
- **CreateTablesRequest**: `restaurantId`, `count`
- **CreateTablesResponse**: `success`, `data: Table[]`
- **GetTablesResponse**: `success`, `data: Table[]`

#### Repositorio
```typescript
interface TableRepository {
  createTables(request: CreateTablesRequest): Promise<CreateTablesResponse>
  getTables(restaurantId: string): Promise<GetTablesResponse>
}
```

#### Use Cases
- **CreateTables**: Crear múltiples mesas de una vez (bulk creation)
- **GetTables**: Obtener mesas de un restaurante

#### Endpoints
- `POST /api/v1/tables/bulk` - Crear múltiples mesas
- `GET /api/v1/tables/restaurant/{restaurantId}` - Obtener mesas del restaurante

---

### 4. Bill Request Module

**Ubicación**: `src/core/modules/bill-request/`

**Responsabilidad**: Gestión de solicitudes de cuenta de clientes

#### Modelos
- **BillRequest**: `id`, `tableId`, `tableNumber`, `restaurantId`, `status`, timestamps
- **Status**: `"pending"` | `"attended"`
- **CreateBillRequestBody**: `restaurantId`, `tableId`, `tableNumber`, `hash`
- **GetPendingBillRequestsResponse**: `success`, `data: BillRequest[]`

#### Repositorio
```typescript
interface BillRequestRepository {
  getPendingRequests(): Promise<GetPendingBillRequestsResponse>
  markAsAttended(request: MarkBillRequestAsAttendedRequest): Promise<MarkBillRequestAsAttendedResponse>
  createBillRequest(body: CreateBillRequestBody): Promise<CreateBillRequestResponse>
}
```

#### Use Cases
- **GetPendingBillRequests**: Obtener solicitudes pendientes
- **MarkBillRequestAsAttended**: Marcar solicitud como atendida
- **CreateBillRequest**: Crear nueva solicitud (desde QR del cliente)

#### Endpoints
- `GET /api/v1/bill-requests/pending` - Obtener solicitudes pendientes
- `PATCH /api/v1/bill-requests/{requestId}/attended` - Marcar como atendida
- `POST /api/v1/public/request-account` - Crear solicitud (endpoint público)

---

## Capa de Infraestructura

### HTTP Client

**Ubicación**: `src/core/api/http-client.ts`

Clase personalizada basada en `fetch` API nativa.

#### Características
- Métodos: GET, POST, PUT, PATCH, DELETE
- Request/Response interceptors
- Base URL configurable
- Tipado genérico para request/response

#### Interceptor de Autorización
```typescript
const api = new HttpClient({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "",
  interceptRequest: (input, init) => {
    const token = sessionStorage.getItem("auth-token");
    if (token && init.headers) {
      (init.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
    return [input, init];
  },
});
```

Automáticamente inyecta el token JWT en el header `Authorization: Bearer <token>`.

### Mock Client

**Ubicación**: `src/core/api/mock-client.ts`

Provee implementaciones mock de los repositorios para desarrollo sin backend.

### Factory Pattern

Cada módulo tiene una factory que decide qué implementación usar:

```typescript
export const getTableRepository = (): TableRepository => {
  const useMock = import.meta.env.VITE_USE_MOCK === "true";
  return useMock ? new MockTableRepository() : new ApiTableRepository();
};
```

---

## Capa de UI

### Gestión de Estado (Zustand)

**Ubicación**: `src/ui/contexts/`

#### Auth Context (`auth.context.ts`)

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  restaurantId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser, setToken, setRestaurantId, setAuth
  setLoading, setError, logout, clearError
}
```

**Middleware**:
- `devtools`: Debugging con Redux DevTools
- `persist`: Persistencia en `sessionStorage` (no `localStorage`)

**Keys persistidos**: `user`, `token`, `restaurantId`, `isAuthenticated`

#### Tables Context (`tables.context.ts`)

```typescript
interface TablesContext {
  tables: Table[];
  isLoading: boolean;
  error: string | null;
  hasSetupTables: boolean;
  setTables, setLoading, setError, clearError, setHasSetupTables
}
```

#### Bill Request Context (`bill-request.context.ts`)

```typescript
interface BillRequestContext {
  requests: BillRequest[];
  isLoading: boolean;
  isRequested: boolean;
  error: string | null;
  setRequests, addRequest, updateRequest, removeRequest
  setLoading, setIsRequested, setError, clearError
}
```

---

### Custom Hooks

**Ubicación**: `src/ui/hooks/`

#### Hooks de Autenticación

**`useAuth()`** - Acceso simple al estado de auth
```typescript
const { user, token, restaurantId, isAuthenticated, logout } = useAuth();
```

**`useFetchAuth()`** - Operaciones de auth con side effects
```typescript
const { login, register, logout, isLoading, error } = useFetchAuth();
```
- Guarda token en `sessionStorage`
- Obtiene restaurante después del login
- Maneja loading y errores

#### Hooks de Datos

**`useFetchTables()`**
```typescript
const { fetchTables, createTables } = useFetchTables();
```

**`useFetchBillRequests()`**
```typescript
const {
  fetchPendingRequests,
  markAsAttended,
  createBillRequest
} = useFetchBillRequests();
```

**`useFetchRestaurant()`**
```typescript
const { createRestaurant } = useFetchRestaurant();
```

#### Hooks de Estado

**`useTables()`**
```typescript
const { tables, isLoading, error, hasSetupTables } = useTables();
```

**`useBillRequests()`**
```typescript
const { requests, isLoading, isRequested, error, pendingCount } = useBillRequests();
```

---

### Componentes

**Ubicación**: `src/ui/components/`

#### ProtectedRoute
- Protege rutas que requieren autenticación
- Redirige a `/login` si no está autenticado
- Verifica `useAuth().isAuthenticated`

#### Header
- Navegación y branding
- Muestra información del usuario
- Toggle de tema

#### ToggleTheme
- Cambio de tema claro/oscuro
- Usa sistema de temas de DaisyUI

#### TableQR
- Muestra códigos QR para mesas
- Genera links: `/request?r={restaurantId}&t={tableId}&n={tableNumber}&h={hash}`

---

### Layouts

**Ubicación**: `src/ui/layouts/`

#### MainLayout
- Envuelve páginas públicas y autenticadas (excepto páginas de auth)
- Incluye componente Header
- Usa `<Outlet />` de React Router
- Container responsive

---

### Páginas

**Ubicación**: `src/ui/pages/`

#### Landing (`/`)
- Página pública de inicio
- Branding y descripción del servicio

#### Login (`/login`)
- Formulario de autenticación email/password
- Validación de formulario
- Link a página de registro
- Redirige a `/dashboard` en caso de éxito

#### Register (`/register`)
- Formulario de creación de cuenta
- Campos: email, username, password
- UI similar a login

#### Dashboard (`/dashboard`)
- **Ruta protegida**
- Muestra cantidad de mesas y solicitudes pendientes
- Lista de solicitudes con información de tiempo
- Botón "Atendida" para marcar solicitudes
- Cards de estadísticas con navegación a tablas

#### Onboarding (`/dashboard/onboarding`)
- Setup inicial después del registro
- Crear restaurante
- Definir cantidad de mesas (1-100)
- Valida inputs antes de crear
- Crea mesas en bulk y navega al dashboard

#### Tables (`/dashboard/tables`)
- Muestra todas las mesas del restaurante con QR codes
- Genera links compartibles con QR
- Información de cada mesa

#### RequestBill (`/request`)
- **Ruta pública** (sin layout)
- UI con botón grande para clientes
- Parámetros URL: `?r={restaurantId}&t={tableId}&n={tableNumber}&h={hash}`
- Muestra mensajes de éxito/error
- Llama a `/api/v1/public/request-account`
- **Fix**: Maneja URLs con `\u0026` escapado

---

### Routing

**Router**: `src/ui/router/AppRouter.tsx`

```
/ (Landing)                    - Pública con MainLayout
/login                         - Formulario de auth
/register                      - Formulario de registro
/request                       - Solicitud de cuenta (pública, sin layout)
/dashboard                     - Dashboard protegido con MainLayout
/dashboard/onboarding          - Setup inicial (protegido, sin layout)
/dashboard/tables              - Vista de mesas (protegido con MainLayout)
```

**Protección de rutas**:
- Componente `<ProtectedRoute>` verifica autenticación
- Redirige a `/login` si no autenticado
- Autenticación basada en sesión con JWT

---

## Gestión de Estado

### Arquitectura Zustand + React

#### Características Clave

1. **Composición de Store**
   - Estado y acciones en un solo store
   - Type-safe con interfaces TypeScript
   - Sin boilerplate de context provider

2. **Stack de Middleware**
   - `persist`: Auto-save/restore desde sessionStorage
   - `devtools`: Integración con Redux DevTools

3. **Integración con Hooks**
   - Custom hooks conectan stores con componentes
   - Suscripciones automáticas y re-renders
   - Arrays de dependencias para optimización

4. **Persistencia en Session Storage**
   - Auth context persiste en `sessionStorage`
   - Se limpia al cerrar el tab del navegador
   - Provee persistencia del token JWT

---

## Flujos de Datos

### Flujo de Autenticación

```
LoginPage Component
  ↓ (llama)
useFetchAuth hook
  ↓ (crea)
Login use case
  ↓ (llama)
ApiAuthRepository.login()
  ↓ (usa)
HttpClient.post("/api/v1/auth/login")
  ↓ (respuesta)
API retorna { success, data: { token, user } }
  ↓ (hook guarda)
sessionStorage.setItem("auth-token", token)
  ↓ (hook setea)
useAuthContext.setAuth(user, token, restaurantId)
  ↓ (componente verifica)
Zustand store persiste a sessionStorage
  ↓ (navegación)
Navigate("/dashboard")
```

### Flujo de Creación de Mesas

```
Onboarding Component
  ↓ (llama)
useFetchTables.createTables(count, restaurantId)
  ↓ (crea)
CreateTables use case
  ↓ (llama)
TableRepository.createTables({ restaurantId, count })
  ↓ (llamada API)
HttpClient.post("/api/v1/tables/bulk", request)
  ↓ (respuesta)
Retorna CreateTablesResponse con Table[] data
  ↓ (hook actualiza)
useTablesContext.setTables(tables)
  ↓ (setea flag)
hasSetupTables = true
  ↓ (navegación)
Navigate("/dashboard")
```

### Flujo de Solicitud de Cuenta (Cliente)

```
RequestBill Component (QR escaneado)
  ↓ (extrae de URL)
restaurantId, tableId, tableNumber, hash
  ↓ (click en botón)
useFetchBillRequests.createBillRequest(body)
  ↓ (llama use case)
CreateBillRequest
  ↓ (llamada a repositorio)
ApiBillRequestRepository.createBillRequest()
  ↓ (endpoint API)
POST /api/v1/public/request-account
  ↓ (respuesta)
CreateBillRequestResponse
  ↓ (actualización de contexto)
useBillRequestContext.setIsRequested(true)
  ↓ (cambio en UI)
Botón se deshabilita y muestra "Cuenta pedida"
```

### Flujo de Solicitud de Cuenta (Personal)

```
Dashboard Component
  ↓ (on mount)
useFetchBillRequests.fetchPendingRequests()
  ↓ (usa caso)
GetPendingBillRequests
  ↓ (repositorio)
ApiBillRequestRepository.getPendingRequests()
  ↓ (llamada API)
GET /api/v1/bill-requests/pending
  ↓ (respuesta)
Retorna { requests: BillRequest[] }
  ↓ (almacena)
useBillRequestContext.setRequests()
  ↓ (muestra)
Mapea requests a tarjetas de solicitud
  ↓ (click "Atendida")
useFetchBillRequests.markAsAttended(requestId)
  ↓ (use case)
MarkBillRequestAsAttended
  ↓ (repositorio)
ApiBillRequestRepository.markAsAttended()
  ↓ (llamada API)
PATCH /api/v1/bill-requests/{id}/attended
  ↓ (actualiza contexto)
Estado de request cambia a "attended"
  ↓ (actualización UI)
Request se elimina de la lista de pendientes
```

---

## Configuración y Deployment

### Variables de Entorno

**`.env.example`**
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK=false
VITE_MODE=development
```

**Variables**:
- `VITE_API_BASE_URL` - URL del backend API
- `VITE_USE_MOCK` - Habilitar repositorios mock (cuando es "true")
- `VITE_MODE` - Modo development/production

### Scripts de Package.json

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

### Configuración de Vercel

**`vercel.json`**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- Configuración de routing para SPA
- Reescribe todas las rutas a `index.html` para React Router

### Proceso de Build

1. Compilación TypeScript: `tsc -b`
2. Bundling con Vite y plugins
3. Output: directorio `/dist/`

### Deployment en Vercel

- Deployments automáticos desde Git
- Variables de entorno configuradas en el dashboard de Vercel
- Rewrites configurados para SPA

---

## Endpoints API

### Autenticación

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| POST | `/api/v1/auth/register` | `{ email, username, password }` | `{ success, data: { user } }` |
| POST | `/api/v1/auth/login` | `{ email, password }` | `{ success, data: { token, user } }` |

### Restaurantes

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| POST | `/api/v1/restaurants` | `{ name, address, phone, description }` | `{ success, data: Restaurant }` |
| GET | `/api/v1/restaurants` | - | `{ success, data: Restaurant[] }` |

### Mesas

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| POST | `/api/v1/tables/bulk` | `{ restaurantId, count }` | `{ success, data: Table[] }` |
| GET | `/api/v1/tables/restaurant/{id}` | - | `{ success, data: Table[] }` |

### Solicitudes de Cuenta

| Método | Endpoint | Body | Respuesta |
|--------|----------|------|-----------|
| GET | `/api/v1/bill-requests/pending` | - | `{ success, data: BillRequest[] }` |
| PATCH | `/api/v1/bill-requests/{id}/attended` | `{ requestId }` | `{ success, data: BillRequest }` |
| POST | `/api/v1/public/request-account` | `{ restaurantId, tableId, tableNumber, hash }` | `{ success, data: BillRequest }` |

---

## Decisiones Arquitectónicas Clave

### ¿Por qué Clean Architecture?
- **Separation of Concerns**: Lógica de negocio aislada de UI y HTTP
- **Testability**: Cada capa puede ser testeada independientemente
- **Flexibility**: Fácil intercambio de implementaciones (API ↔ Mocks)
- **Maintainability**: Organización clara del código y dependencias

### ¿Por qué Zustand en lugar de Context API?
- **Simplicidad**: Menos boilerplate que Context + useReducer
- **Performance**: Se suscribe solo a las partes del state que se usan
- **DevTools**: Soporte integrado de Redux DevTools
- **Middleware**: Persistencia y debugging out of the box

### ¿Por qué un HTTP Client personalizado?
- **Control**: Sin dependencias externas, control total sobre interceptors
- **Interceptors**: Inyección automática de JWT sin ceremony
- **Type Safety**: Tipado genérico para respuestas
- **Simplicidad**: Solo basado en fetch, sin overhead de Axios

### Beneficios del Repository Pattern
- **Interface-driven**: Contratos definidos de antemano
- **Mock Support**: Testing fácil sin backend
- **Decoupling**: La UI no conoce detalles de la API
- **Flexibility**: Cambio de implementaciones en runtime

---

## Características Notables

### Autenticación Basada en Sesión
- Tokens JWT guardados en `sessionStorage` (no `localStorage`)
- Se limpian automáticamente al cerrar el tab del navegador
- Trade-off entre seguridad y persistencia

### Generación de Códigos QR
- Las mesas tienen QR codes que enlazan a la página `/request`
- Parámetros URL-encoded: restaurant, table, number, hash
- Los clientes escanean para solicitar la cuenta

### Creación Bulk de Mesas
- Crear hasta 100 mesas de una vez
- Mesas numeradas secuencialmente
- Auto-generación de códigos QR

### Tracking de Solicitudes en Tiempo Real
- Dashboard muestra solicitudes pendientes
- Formato de tiempo relativo ("Hace 5 minutos")
- Personal puede marcar solicitudes como atendidas

### UI Responsivo
- DaisyUI + Tailwind CSS
- Diseño mobile-first
- Botones touch-friendly

### Soporte de Temas
- Cambio de tema con DaisyUI
- Tema por defecto: "cupcake"
- Componente de toggle de tema

---

## Workflow de Desarrollo

### Ejecutar el Proyecto

```bash
# Servidor de desarrollo (Vite)
npm run dev

# Build para producción
npm run build

# Linting
npm run lint

# Preview del build de producción
npm run preview
```

### Setup del Entorno

```bash
# Copiar ejemplo de env
cp .env.example .env

# Actualizar con tu URL de API
VITE_API_BASE_URL=http://localhost:8080
```

### Mock vs API Real

```bash
# Usar repositorios mock
VITE_USE_MOCK=true npm run dev

# Usar API real
VITE_USE_MOCK=false npm run dev
```

---

## Resumen

Este proyecto demuestra:
- ✅ Implementación de Clean Architecture en React
- ✅ Patrón Repository con dependency injection
- ✅ Gestión de estado moderna con Zustand
- ✅ Autenticación JWT con sessionStorage
- ✅ UI responsivo con Tailwind CSS y DaisyUI
- ✅ TypeScript para type safety
- ✅ Separación clara de capas (Domain, Infrastructure, UI)
- ✅ Testing-friendly con mocks y factories
- ✅ Build moderno con Vite

El codebase está organizado de manera modular, escalable y mantenible, siguiendo best practices de React y principios de arquitectura limpia.
