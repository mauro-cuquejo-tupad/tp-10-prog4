# Backend - Gestor Gastronómico
**Materia:** Programación 4 - UTN  
**Alumno:** Mauro Cuquejo  

API REST desarrollada con **FastAPI** y **SQLModel** para la gestión del Food Store con autenticación mediante JWT en cookies HttpOnly y autorización basada en roles (RBAC).

---

## Arquitectura

El sistema implementa el dominio de **Identidad & Acceso** (`Usuario`, `Rol`, `UsuarioRol`) y protege el catálogo de **Categorías**, **Productos**, **Ingredientes** y **Pedidos**:

- **Autenticación y Sesión:**
  - `POST /api/v1/auth/register`: registro de usuarios con hash bcrypt en `password_hash` y asignación automática del rol `user`.
  - `POST /api/v1/auth/token`: autenticación por formulario OAuth2 recibiendo `username` (email) y `password`, emitiendo un JWT firmado en la cookie HttpOnly `access_token`.
  - `POST /api/v1/auth/logout`: cierre de sesión borrando la cookie en el cliente.
  - `GET /api/v1/auth/me`: perfil del usuario autenticado y roles vigentes.
  - `GET /api/v1/auth/admin/usuarios`, `POST /api/v1/auth/admin/usuarios/{id}/activar` y `POST /api/v1/auth/admin/usuarios/{id}/desactivar`: gestión de usuarios exclusiva para rol `admin`.
- **Autorización por Roles (RBAC):**
  - Dependencias `get_current_user`, `get_current_active_user` y `require_role(roles)`.
  - Operaciones de lectura disponibles para cualquier usuario autenticado.
  - Operaciones de escritura (`POST`, `PUT`, `PATCH`, `DELETE`) en categorías, productos e ingredientes restringidas exclusivamente a usuarios con rol `admin`.
  - Excepción de pedidos y direcciones: permitidos para roles `user` y `admin`, asignando el `usuario_id` extraído de la sesión.
- **Borrado Lógico:**
  - Entidades `Usuario`, `Categoria`, `Producto`, `Pedido` y `DireccionEntrega` utilizan el campo `deleted_at`. Los listados excluyen registros con `deleted_at` no nulo.
  - Las relaciones muchos a muchos (`UsuarioRol` y `ProductoCategoria`) eliminan la fila de enlace físico sin borrado lógico.
- **Catálogos precargados:**
  - `Rol`, `FormaPago` y `EstadoPedido` se inicializan mediante el script `seed.py` y se exponen en modo solo lectura.

---

## Instalación y Ejecución

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configuración de variables de entorno:**
   Copiar `.env.example` a `.env` y configurar credenciales:
   ```env
   DATABASE_URL=postgresql+psycopg://postgres:tu_password@localhost:5432/gestor_productos
   SECRET_KEY=clave_secreta_super_segura_de_al_menos_32_caracteres_longitud_minima
   RESET_DB_ON_STARTUP=false
   SEED_ON_STARTUP=true
   ```

3. **Iniciar el servidor:**
   ```bash
   uvicorn app.main:app --reload
   ```

4. **Ejecutar pruebas automatizadas:**
   ```bash
   pytest
   ```
