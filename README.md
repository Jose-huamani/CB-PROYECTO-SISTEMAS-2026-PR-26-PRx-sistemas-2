# PRX

Aplicación web de repositorios, notas y colaboración. Frontend Angular y backend NestJS con Prisma y MySQL.

## Desarrollo local

Requisitos: Node.js 22.12 o posterior compatible con Angular 21, npm y MySQL.

Backend, desde `prx-backend`:

```sh
npm ci
# Copiar .env.example a .env y completar valores privados localmente.
npm run prisma:generate
npm run migrate:deploy
npm run start:dev
```

Frontend, desde `prx-frontend`:

```sh
npm ci
npm start
```

Frontend: http://localhost:4200. API: http://localhost:3000/prx. Swagger: http://localhost:3000/docs.
Si el puerto ya está ocupado, cerrar la instancia duplicada antes de iniciar otra.

## Compilación y pruebas

```sh
# Backend
npm run build
npm test -- --runInBand
# Frontend
npm run build
npm test -- --watch=false
```

## Base de datos

`npm run prisma:generate` genera el cliente en `generated/prisma-auth`.
`npm run migrate:deploy` aplica las migraciones existentes sin restablecer datos.
Para una base nueva, `npx prisma db seed` requiere `SEED_ADMIN_PASSWORD` configurada localmente.
No se publica una contraseña predeterminada ni se debe ejecutar el seed sobre datos existentes sin revisar su alcance.

## Documentación

`prx-documentation` contiene los documentos de Sprint 1 y Sprint 2.
El Manual Técnico original se conserva intacto localmente y se excluye de Git porque contiene contraseñas, según autorización del propietario.
Los documentos explican los cambios y las diferencias respecto al manual original.

No subir `.env`, `node_modules`, archivos generados, copias temporales ni credenciales.
