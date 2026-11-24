# Trabajo Práctico 10 - Arquitectura por Features y Rutas Protegidas
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

---

## Descripción General

Este proyecto corresponde a la resolución del **Trabajo Práctico de la Unidad 10**, enfocado en la refactorización arquitectónica del frontend a una **arquitectura modular por features** y la **protección integral de rutas en el cliente basada en roles (RBAC)** con estado global en Zustand y comunicación segura vía cookies `HttpOnly` con el backend en FastAPI.

---

## Estructura del Repositorio

```text
tp-10/
├── fastapi-productos/             # Backend FastAPI + SQLModel + PostgreSQL (Unidad 9/10)
│   ├── app/
│   │   ├── core/                  # config, security, deps, uow, database
│   │   ├── modules/
│   │   │   └── usuarios/          # RBAC, autenticación por cookies HttpOnly
│   │   ├── categoria/             # Endpoints protegidos por rol admin
│   │   ├── producto/              # Endpoints protegidos por rol admin
│   │   ├── ingrediente/           # Endpoints protegidos por rol admin
│   │   └── pedidos/               # Pedidos y direcciones asociadas a sesión
│   ├── tests/
│   │   ├── conftest.py
│   │   └── test_auth.py           # Pruebas automatizadas de autenticación y roles
│   ├── requirements.txt
│   └── README.md
│
├── tp-categorias/                 # Frontend React 19 + TypeScript + Vite + Zustand + TanStack Query
│   ├── src/
│   │   ├── features/              # Módulos por dominio con barrel exports
│   │   │   ├── auth/              # components, hooks, services, store, types, pages
│   │   │   ├── categories/        # components, hooks, services, types, pages
│   │   │   ├── products/          # components, hooks, services, types, pages
│   │   │   └── ingredients/       # components, hooks, services, types, pages
│   │   ├── shared/                # Recursos transversales (api, setupInterceptors, Navbar, Toast)
│   │   ├── store/                 # Stores globales de interfaz (themeStore, notificationStore)
│   │   ├── routes/                # AppRouter.tsx y ProtectedRoute.tsx con Outlet
│   │   ├── App.tsx                # Composición limpia (checkAuth + router + Toast)
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.app.json          # Configuración de alias @/ -> src/
│   ├── vite.config.ts             # Configuración de alias @/
│   └── README.md
│
├── Cuquejo_Mauro_TP10.zip          # Entrega comprimida del frontend limpio (sin node_modules)
├── docker-compose.yml             # Contenedor de PostgreSQL
├── ingredientes.http              # Pruebas HTTP REST Client
├── pedidos.http                   # Pruebas HTTP REST Client
└── Readme.md                      # Documentación del proyecto
```

---

## Aspectos Técnicos Destacados

1. **Arquitectura por Features (RA-01 a RA-03):**
   - Cada dominio funcional (`auth`, `categories`, `products`, `ingredients`) encapsula sus componentes, hooks, servicios, tipos y páginas.
   - Las features exponen únicamente su interfaz pública mediante barrels (`index.ts`).
   - Ningún módulo importa subcarpetas internas de otro dominio.
   - Todo elemento compartido transversal reside en `shared/` o `store/`.

2. **Alias `@/` (HU-05, RA-08):**
   - Resuelto tanto en `vite.config.ts` como en `tsconfig.app.json` (`paths: { "@/*": ["./src/*"] }`), garantizando importaciones limpias e independientes de la profundidad de carpetas.

3. **Protección de Rutas con `<Outlet />` (HU-04, RA-05, RA-06):**
   - `ProtectedRoute.tsx` actúa como ruta padre contenedora leyendo el estado de sesión y roles de `useAuthStore`.
   - Estado `checking` para espera asincrónica sin redirecciones prematuras.
   - Redirección con `replace` a `/login` para usuarios sin sesión y a `/unauthorized` para usuarios autenticados sin rol correspondiente.
   - Ruta `/admin/users` restringida exclusivamente a `allowedRoles={['admin']}`.

4. **Custom Hooks con TanStack Query (HU-03, RA-07):**
   - Hooks especializados `useCategories`, `useProducts`, `useIngredients` y `useAuth` que aíslan las llamadas a Axios y los hooks `useQuery`/`useMutation` de TanStack Query, liberando los componentes de presentación de lógica de red.

5. **Manejo Centralizado de 401 y 403 (RA-05, Criterio B):**
   - `setupInterceptors.ts` captura respuestas 401 limpiando la sesión para redirección automática.
   - Captura respuestas 403 emitiendo avisos de acceso denegado sin interrumpir la sesión del usuario.

6. **Estado Global de Interfaz (HU-06, RA-09):**
   - Modo claro / oscuro persistido en `localStorage` con `useThemeStore` y middleware `persist`.
   - Sistema de alertas visuales no bloqueantes con `useNotificationStore` y `<Toast />` con temporizador de 3 segundos.
   - La sesión **no se guarda en localStorage**; se valida contra `/api/v1/auth/me` mediante cookie `HttpOnly`.

---

## Puesta en Marcha

### 1. Base de Datos
```bash
docker compose up -d
```

### 2. Backend (FastAPI)
```bash
cd fastapi-productos
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### 3. Frontend (React)
```bash
cd tp-categorias
pnpm install
pnpm dev
```

Build de producción:
```bash
pnpm build
```
