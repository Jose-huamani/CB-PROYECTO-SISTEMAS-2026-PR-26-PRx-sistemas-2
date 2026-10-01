# PRX: Plataforma de Gestion de Repositorios

## 1. Problema que se esta solucionando

En proyectos academicos y profesionales, la informacion suele quedar distribuida entre carpetas personales, servicios de almacenamiento, conversaciones de mensajeria y documentos sin una estructura comun. Esta situacion dificulta encontrar la version correcta de un archivo, conocer quien hizo un cambio, controlar el acceso de cada colaborador y mantener una memoria ordenada del proyecto.

Ademas, cuando un equipo crece, compartir documentos sin roles claros puede provocar modificaciones accidentales, perdida de informacion o exposicion de contenido que deberia ser privado. Las notas y decisiones del proyecto tambien suelen quedar separadas de los archivos a los que hacen referencia. El problema principal es, por tanto, la falta de un espacio centralizado que combine organizacion documental, colaboracion y control de permisos.

## 2. Solucion propuesta

PRX es una plataforma web colaborativa para crear y administrar repositorios de proyectos. Cada repositorio funciona como un espacio organizado donde el equipo puede gestionar archivos, carpetas, notas y etiquetas. El propietario puede invitar colaboradores y asignar roles con permisos definidos, mientras que los usuarios reciben notificaciones de las actividades relevantes.

La plataforma integra autenticacion, perfiles de usuario, repositorios publicos o privados, archivos, notas, etiquetas, invitaciones, notificaciones y bitacoras. De esta manera, la informacion del proyecto permanece relacionada, consultable y protegida desde un solo sistema.

## 3. Usuarios objetivo

- **Propietario del repositorio:** crea el proyecto, administra colaboradores y controla permisos.
- **Colaborador:** consulta o modifica contenido de acuerdo con el rol asignado.
- **Visitante o usuario registrado:** explora el sistema y gestiona sus propios repositorios.
- **Administrador:** supervisa usuarios, catalogos y el funcionamiento general de la plataforma.

## 4. Alcance funcional

El prototipo contempla el registro e inicio de sesion, gestion del perfil, creacion y consulta de repositorios, invitaciones, roles, archivos, carpetas, notas, etiquetas, notificaciones y bitacoras. Tambien contempla mensajes de validacion y una interfaz orientada a que las acciones principales sean faciles de localizar.

El backend se implementa con NestJS, Prisma y MySQL. El frontend se implementa con Angular y PrimeNG. La autenticacion utiliza tokens y las contrasenas se almacenan mediante hash. El almacenamiento de archivos puede integrarse con Tigris y el envio de notificaciones por correo con SMTP.

## 5. Prototipo y flujo principal

El prototipo navegable de Figma representa el recorrido principal del usuario: acceder al sistema, registrarse o iniciar sesion, consultar el espacio principal, crear un repositorio, organizar su contenido, invitar colaboradores y revisar notificaciones. Tambien se incluyen las vistas de perfil y las pantallas de gestion necesarias para demostrar la propuesta.

El flujo prioritario para la validacion es:

1. El usuario entra a PRX y crea una cuenta o inicia sesion.
2. Consulta sus repositorios o crea uno nuevo.
3. Define la visibilidad y organiza archivos, carpetas y notas.
4. Invita a colaboradores y asigna permisos.
5. Consulta actividad y notificaciones para dar seguimiento al proyecto.

## 6. Product Backlog y priorizacion

El Product Backlog se elaboro como una lista ordenada de Historias de Usuario. La prioridad se definio considerando el valor para el cliente y las dependencias funcionales. Primero se ubicaron autenticacion, perfil, repositorios, roles, invitaciones y archivos porque sin estas funciones no existe un flujo colaborativo util. Luego se priorizaron notas, etiquetas, busqueda y notificaciones. Finalmente se dejaron bitacora, administracion, redes sociales y salud del sistema como funcionalidades de apoyo.

Cada historia incluye criterios de aceptacion verificables y una estimacion en puntos. Las historias se pueden revisar al terminar cada sprint para actualizar su prioridad, dividirlas o agregar nuevas necesidades descubiertas durante las pruebas del prototipo.

## 7. Beneficios esperados

PRX reduce el tiempo necesario para localizar informacion, mejora la coordinacion del equipo y establece responsabilidades claras sobre los contenidos. Tambien facilita la trazabilidad de cambios y disminuye el riesgo de compartir informacion con personas no autorizadas. Para estudiantes, docentes y equipos profesionales, el resultado es un espacio unico para conservar el conocimiento y avanzar de forma ordenada.

## 8. Conclusion

PRX responde a una necesidad concreta: centralizar la gestion de proyectos colaborativos con una estructura clara y permisos controlados. El prototipo de Figma permite validar la experiencia antes de finalizar la implementacion, mientras que el Product Backlog traduce las necesidades del usuario en trabajo priorizado para Scrum. La propuesta puede crecer progresivamente sin perder el foco en la organizacion, la colaboracion y la seguridad de la informacion.