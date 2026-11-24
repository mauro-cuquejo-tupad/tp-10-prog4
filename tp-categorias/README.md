# Frontend - Gestor Gastronómico
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

Frontend desarrollado en **React** y **TypeScript** con **Vite**, estilizado con **Tailwind CSS** y estructurado mediante una **arquitectura por features**.

---

## 🛠️ Organización del Código

El proyecto sigue una estructura modular orientada a funcionalidades:

```text
src/
├── features/
│   ├── auth/           # Login, registro, administración de usuarios y estado de sesión
│   ├── categories/     # Listado, creación, edición y baja de categorías
│   ├── products/       # Catálogo y administración de productos
│   └── ingredients/    # Gestión de ingredientes
├── shared/             # Recursos compartidos (API, Navbar, Toast, modales)
├── routes/             # Configuración de rutas y guardián de acceso (ProtectedRoute)
├── store/              # Stores globales de interfaz (tema visual y notificaciones)
├── App.tsx             # Componente raíz de la aplicación
└── main.tsx            # Punto de entrada
```

### Principales aspectos de diseño:
- **Modularidad e imports limpios:** cada feature contiene sus propios componentes, hooks de datos, servicios y tipos, exponiendo únicamente lo necesario a través de su archivo `index.ts`. Se utiliza el alias `@/` para simplificar las rutas de importación.
- **Rutas protegidas:** se valida el estado de la sesión antes de mostrar cualquier pantalla privada. Si no hay sesión iniciada se redirige al login, y si el usuario no tiene permisos suficientes para una sección (como el panel de usuarios), se muestra la vista de acceso denegado.
- **Hooks de datos:** las consultas y mutaciones asíncronas se encapsulan en hooks personalizados utilizando TanStack Query, manteniendo los componentes visuales enfocados en la interfaz.
- **Preferencias de interfaz:** incluye alternancia entre modo claro y modo oscuro (guardando la preferencia en el navegador) y avisos flotantes temporales ante las distintas acciones del usuario.

---

## 💻 Comandos del Proyecto

```bash
# Instalar dependencias
pnpm install

# Iniciar en modo desarrollo
pnpm dev

# Compilar para producción y verificar tipado
pnpm build

# Ejecutar el linter
pnpm lint
```
