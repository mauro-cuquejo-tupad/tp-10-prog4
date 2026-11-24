# Frontend - Gestor Gastronómico (Unidad 10)
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

Frontend SPA interactivo refactorizado a **Arquitectura por Features** y **Rutas Protegidas por Rol con Zustand**, construido con React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Form, TanStack Table v8, Zustand y Axios.

---

## 🏛️ Arquitectura de Módulos por Feature

El código de `src/` ha sido reorganizado por dominio funcional para maximizar la cohesión y minimizar el acoplamiento:

```text
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── auth.service.ts
│   │   ├── store/
│   │   │   └── authStore.ts           # Sesión en memoria, sin persist, checking / auth / unauth
│   │   ├── types/
│   │   │   └── auth.types.ts
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   └── AdminUsersPage.tsx
│   │   └── index.ts                   # Barrel export: API pública
│   ├── categories/
│   │   ├── components/
│   │   │   ├── CategoriaCard.tsx
│   │   │   ├── CategoriaList.tsx
│   │   │   └── CategoriaModal.tsx
│   │   ├── hooks/
│   │   │   └── useCategories.ts       # useQuery + useMutation
│   │   ├── services/
│   │   │   └── categoria.service.ts
│   │   ├── types/
│   │   │   └── categoria.types.ts
│   │   ├── pages/
│   │   │   └── CategoriasPage.tsx
│   │   └── index.ts                   # Barrel export
│   ├── products/
│   │   ├── components/
│   │   │   ├── ProductoList.tsx
│   │   │   └── ProductoModal.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts          # useQuery + useMutation
│   │   ├── services/
│   │   │   └── producto.service.ts
│   │   ├── types/
│   │   │   └── producto.types.ts
│   │   ├── pages/
│   │   │   └── ProductsPage.tsx
│   │   └── index.ts                   # Barrel export
│   └── ingredients/
│       ├── components/
│       │   ├── IngredienteList.tsx
│       │   └── IngredienteModal.tsx
│       ├── hooks/
│       │   └── useIngredients.ts      # useQuery + useMutation
│       ├── services/
│       │   └── ingrediente.service.ts
│       ├── types/
│       │   └── ingrediente.types.ts
│       ├── pages/
│       │   └── IngredientesPage.tsx
│       └── index.ts                   # Barrel export
├── shared/
│   ├── api/
│   │   ├── api.ts                     # Instancia Axios con withCredentials: true
│   │   ├── handleApiError.ts          # Parseo uniforme de errores
│   │   └── setupInterceptors.ts       # Interceptor global 401 y 403
│   ├── components/
│   │   ├── Navbar.tsx                 # Barra responsive con switch de tema y datos de sesión
│   │   ├── Toast.tsx                  # Toast global de notificaciones
│   │   ├── UnauthorizedPage.tsx       # Pantalla 403 de acceso denegado
│   │   └── SharedModalsAndStates.tsx  # Estados de carga, vacío, error y modales
│   └── hooks/
│       └── useEscapeKey.ts
├── store/
│   ├── themeStore.ts                  # Estado de tema visual con persist ('theme-storage')
│   └── notificationStore.ts           # Store global para mensajes Toast (3s)
├── routes/
│   ├── AppRouter.tsx                  # Configuración centralizada de rutas públicas y anidadas
│   └── ProtectedRoute.tsx             # Guardián con <Outlet />, verificación de sesión y roles
├── App.tsx                            # Componente raíz sin lógica de negocio (checkAuth + AppRouter + Toast)
└── main.tsx                           # Bootstrap con setupInterceptors y QueryClientProvider
```

---

## 🔒 Rutas Protegidas y Flujo de Autorización

1. **ProtectedRoute con `<Outlet />`:**
   - Si `status === 'checking'`, muestra el indicador visual de verificación.
   - Si `status === 'unauthenticated'`, redirige a `/login` con `replace` preservando la ruta solicitada en `state={{ from: location }}`.
   - Si la ruta requiere roles (`allowedRoles`) y el usuario no posee el rol requerido (`!hasRole(...)`), redirige a `/unauthorized` (403).
   - Si la validación es satisfactoria, renderiza las pantallas hijas mediante `<Outlet />`.

2. **Rutas Públicas y Protegidas:**
   - **Públicas:** `/login`, `/register`, `/unauthorized`.
   - **Autenticadas:** `/categories`, `/products`, `/ingredientes`.
   - **Administración:** `/admin/users` anidada en `ProtectedRoute` con `allowedRoles={['admin']}`.

3. **Intercepción de 401 y 403 (`setupInterceptors.ts`):**
   - Ante un error `401` (excepto endpoints de login y me), limpia la sesión a `unauthenticated` para que el guardián redirija al login sin recargar la página.
   - Ante un error `403`, notifica el acceso denegado sin cerrar la sesión ni redirigir al login.

---

## 🎨 Estado Global de Interfaz (Zustand)

- **`themeStore`:** Alterna entre modo claro y oscuro persistiendo la elección en `localStorage` mediante `persist({ name: 'theme-storage' })`.
- **`notificationStore` & `<Toast />`:** Notificaciones automáticas ante creación, actualización, eliminación o errores en operaciones de cada módulo, auto-ocultables a los 3 segundos.

---

## 🚀 Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   pnpm install
   ```

2. **Iniciar servidor de desarrollo:**
   ```bash
   pnpm dev
   ```

3. **Compilar y verificar tipado TypeScript:**
   ```bash
   pnpm build
   ```

4. **Ejecutar linter:**
   ```bash
   pnpm lint
   ```
