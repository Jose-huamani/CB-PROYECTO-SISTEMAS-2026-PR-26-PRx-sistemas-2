# PR-26-PRx-main

# PRX — Plataforma de Gestión de Repositorios

PRX es una plataforma web colaborativa orientada a la creación, organización y gestión de repositorios de proyectos académicos y profesionales. Permite a los usuarios documentar, organizar y compartir contenido con un equipo de trabajo, gestionando roles y permisos de forma clara y segura.

🎬 [Ver video demostrativo en YouTube](https://youtube.com/watch?v=iW-G1kh9bFY&si=E6WFcyaa-f9MX2Y6)

---

## 👥 Equipo

| Rol | Integrante |
|---|---|
| Team Leader | Alejandro Vidal |
| Database Architect | Julia Rafaela Herrera Heiden |
| Git Master | Victoria Luciana Guerra Bustillos |

---

## 🛠️ Stack tecnológico

**Frontend**
- Angular CLI `21.2.7`
- TypeScript `5.9.3`
- RxJS `7.8.2`
- PrimeNG + PrimeFlex
- Formly

**Backend**
- Node.js `v24.14.1`
- npm `11.12.1`
- NestJS CLI `11.0.18`
- Prisma ORM
- MySQL (alojado en Aiven)

**Servicios externos**
- Tigris — almacenamiento de archivos en la nube
- SMTP (Gmail) vía Nodemailer — envío de correos
- Aiven — base de datos MySQL en producción

**Autenticación**
- JWT (Access Token + Refresh Token)
- bcrypt

---

## 📁 Estructura del repositorio

```
PR-26-PRx-main/
├── prx-backend/    # API REST con NestJS + Prisma
└── prx-frontend/   # SPA con Angular + PrimeNG
```

---

## ⚙️ Instalación y configuración local

### Requisitos previos

- Node.js `v24.14.1`
- npm `11.12.1`
- NestJS CLI `11.0.18` → `npm install -g @nestjs/cli`
- Angular CLI `21.2.7` → `npm install -g @angular/cli`
- MySQL accesible (local o Aiven)

### 1. Clonar el repositorio

```bash
git clone https://github.com/CB-PROYECTO-SISTEMAS-2026/PR-26-PRx-main.git
cd PR-26-PRx-main
```

### 2. Configurar el Backend

Crea el archivo `.env` dentro de `prx-backend/` con el siguiente contenido (reemplaza los valores entre corchetes):

```env
PORT=3000
APP_NAME=PRX Backend
APP_VERSION=1.0.0
API_PREFIX=prx

DATABASE_URL="[CADENA DE CONECCION]"

JWT_ACCESS_SECRET="[SECRETO]"
JWT_REFRESH_SECRET="[SECRETO]"
JWT_ACCESS_EXPIRES_IN="1m"
JWT_REFRESH_EXPIRES_IN="7d"

MAIL_HOST="smtp.gmail.com"
MAIL_PORT=587
MAIL_USER="[CORREO]"
MAIL_PASS="[CONTRASEÑA DE APLICACIÓN]"
MAIL_FROM="[CORREO]"

TIGRIS_STORAGE_ACCESS_KEY_ID="[CLAVE]"
TIGRIS_STORAGE_SECRET_ACCESS_KEY="[CLAVE SECRETA]"
TIGRIS_STORAGE_ENDPOINT="[CLAVE]"
TIGRIS_PUBLIC_BUCKET="[CLAVE]"
TIGRIS_PRIVATE_BUCKET="[CLAVE]"

THROTTLE_TTL=60000
THROTTLE_LIMIT=1000
```

### 3. Instalar dependencias y preparar la base de datos

```bash
cd prx-backend
npm install
npx prisma generate
npx prisma db seed
```

> **Nota:** `npx prisma migrate dev` solo es necesario si se realizaron cambios en el schema de Prisma.

Al ejecutar el seed verás en consola:
```
Iniciando seed...
Usuario administrador insertado correctamente.
Continentes insertados correctamente.
Países insertados correctamente.
Códigos telefónicos insertados correctamente.
Roles de repositorio insertados correctamente.
Funciones de repositorio insertadas correctamente.
Redes sociales insertadas correctamente.
Seed finalizado.
```

### 4. Levantar el Backend

```bash
npm run start:dev
```

- API disponible en: `http://localhost:3000/prx`
- Documentación Swagger en: `http://localhost:3000/docs`

### 5. Instalar dependencias y levantar el Frontend

```bash
cd ../prx-frontend
npm install
```

- Frontend disponible en: `http://localhost:4200`

## 🗄️ Base de datos

El proyecto usa **Prisma ORM** con **MySQL**. La base de datos se puede alojar en [Aiven](https://aiven.io/) (plan gratuito disponible).

### Comandos Prisma

| Comando | Descripción |
|---|---|
| `npx prisma generate` | Genera el cliente Prisma a partir del schema |
| `npx prisma migrate dev` | Aplica migraciones (solo cuando cambia el schema) |
| `npx prisma db seed` | Inserta los datos iniciales del sistema |

### Credenciales de prueba

| Usuario / Correo | Contraseña | Rol |
|---|---|---|
| `admin@prx.com` | `12345Rx*` | Metaadministrador |
| `hhj0034735@est.univalle.edu` | `12345Rx*` | Co-creador / Gestor |
| `va0035314@est.univalle.edu` | `12345Rx*` | Co-creador / Tecnólogo |
| `gbv0035239@est.univalle.edu` | `12345Rx*` | Propietario / Experto |

---

## 🌿 Convención de ramas

```
sN/nombre-apellido
```

- `sN` → número de sprint (ej. `s1`, `s2`, `s3`...)
- `nombre-apellido` → integrante responsable

**Flujo:** `rama personal` → `dev` (merge por sprint) → `main` (entrega final)

**Repositorio:** https://github.com/CB-PROYECTO-SISTEMAS-2026/PR-26-PRx-main.git

## Arquitectura de carpetas

Ambos proyectos (backend y frontend) organizan sus módulos siguiendo una arquitectura por capas — **`domain` → `application` → `infrastructure` → `presentation`** — replicada de forma consistente en cada módulo de negocio (`auth`, `files`, `notes`, `repositories`, etc.).

### Backend (`prx-backend`)

```
prx-backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma             
│   └── seed.ts                   
├── generated/
│   └── prisma/                   
├── docs/
│   └── project-structure.md
├── src/
│   ├── config/
│   │   ├── env.config.ts
│   │   └── swagger.config.ts
│   ├── modules/                  
│   │   ├── auth/
│   │   │   ├── application/      
│   │   │   ├── domain/           
│   │   │   ├── infrastructure/   
│   │   │   ├── presentation/     
│   │   │   └── auth.module.ts
│   │   ├── binnacles/            
│   │   ├── files/                
│   │   ├── notes/                
│   │   ├── notifications/        
│   │   ├── profiles/             
│   │   ├── repositories/         
│   │   ├── repository-invitations/ 
│   │   ├── social-networks/      
│   │   ├── tags/                 
│   │   └── users/                
│   ├── shared/                   
│   │   ├── application/
│   │   │   ├── decorators/
│   │   │   └── dto/
│   │   ├── constants/
│   │   ├── domain/
│   │   ├── enums/
│   │   ├── infrastructure/
│   │   │   ├── avatar/
│   │   │   ├── mail/
│   │   │   ├── persistence/
│   │   │   ├── prisma/
│   │   │   └── storage/
│   │   ├── presentation/
│   │   │   ├── decorators/
│   │   │   ├── filters/
│   │   │   ├── guards/
│   │   │   └── interceptors/
│   │   ├── types/
│   │   └── utils/
│   ├── types/
│   ├── app.module.ts
│   └── main.ts
├── .env.example
├── nest-cli.json
├── package.json
├── prisma.config.ts
└── tsconfig.json
```

### Frontend (`prx-frontend`)

```
prx-frontend/
├── public/
│   ├── images/
│   │   ├── auth/
│   │   ├── landing-page/
│   │   └── repositories/
│   └── logo/
│       └── prx-logo.png
├── src/
│   ├── app/
│   │   ├── core/                 
│   │   │   ├── api/
│   │   │   ├── config/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── layouts/
│   │   │   ├── router/
│   │   │   ├── services/
│   │   │   └── theme/            
│   │   ├── features/             
│   │   │   ├── auth/
│   │   │   │   ├── application/
│   │   │   │   ├── constants/
│   │   │   │   ├── domain/
│   │   │   │   ├── infrastructure/
│   │   │   │   └── presentation/
│   │   │   ├── binnacles/        
│   │   │   ├── files/            
│   │   │   ├── notes/            
│   │   │   ├── notifications/    
│   │   │   ├── profiles/         
│   │   │   ├── repositories/     
│   │   │   ├── repository-invitations/ ⎭
│   │   │   ├── social-networks/
│   │   │   │   └── application/facades/
│   │   │   └── site/
│   │   │       └── presentation/
│   │   │           ├── pages/
│   │   │           │   ├── become-co-creator-page/
│   │   │           │   ├── become-member-page/
│   │   │           │   ├── docs-page/
│   │   │           │   ├── faq-page/
│   │   │           │   ├── guide-page/
│   │   │           │   └── landing-page/
│   │   │           └── site.routes.ts
│   │   ├── shared/
│   │   ├── app.component.ts
│   │   ├── app.config.ts
│   │   └── app.routes.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   ├── environment.development.ts
│   │   ├── environment.production.ts
│   │   └── environment.model.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.scss
├── angular.json
├── package.json
└── tsconfig.json
```
