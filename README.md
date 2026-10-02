# 🗄️ Base de datos

El proyecto usa **Prisma ORM** con **MySQL**. La base de datos se puede alojar en [Aiven](https://aiven.io/) (plan gratuito disponible).

### Comandos Prisma

| **Comando** | **Descripción** |
| --- | --- |
| `npx prisma generate` | Genera el cliente Prisma a partir del schema |
| `npx prisma migrate dev` | Aplica migraciones (solo cuando cambia el schema) |
| `npx prisma db seed` | Inserta los datos iniciales del sistema |

### Credenciales de prueba

| **Usuario / Correo** | **Contraseña** | **Rol** |
| --- | --- | --- |
| `admin@prx.com` | `12345Rx*` | Metaadministrador |
| `hhj0034735@est.univalle.edu` | `12345Rx*` | Co-creador / Gestor |
| `va0035314@est.univalle.edu` | `12345Rx*` | Co-creador / Tecnólogo |
| `gbv0035239@est.univalle.edu` | `12345Rx*` | Propietario / Experto |
