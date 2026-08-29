/// <reference types="node" />

import * as bcrypt from 'bcrypt';

import { PrismaClient, Role } from '../generated/prisma/client';

const prisma = new PrismaClient();

const SYSTEM_USER_ID = 1;

async function seedAdminUser(): Promise<void> {
  const password = await bcrypt.hash('12345Rx*', 10);

  await prisma.user.upsert({
    where: {
      id: SYSTEM_USER_ID,
    },
    update: {
      username: 'admin',
      email: 'admin@prx.com',
      password,
      role: Role.metaadministrador,
      avatarUrl: 'avatar/avatar1.png',
      status: 1,
    },
    create: {
      id: SYSTEM_USER_ID,
      username: 'admin',
      email: 'admin@prx.com',
      password,
      role: Role.metaadministrador,
      avatarUrl: 'avatar/avatar1.png',
      status: 1,
      createdBy: SYSTEM_USER_ID,
    },
  });

  console.log('Usuario administrador insertado correctamente.');
}

async function seedContinents(): Promise<void> {
  const continents = [
    {
      id: 1,
      name: 'AMÉRICA',
    },
    {
      id: 2,
      name: 'EUROPA',
    },
    {
      id: 3,
      name: 'ASIA',
    },
    {
      id: 4,
      name: 'ÁFRICA',
    },
    {
      id: 5,
      name: 'OCEANÍA',
    },
    {
      id: 6,
      name: 'ANTÁRTIDA',
    },
  ];

  for (const continent of continents) {
    await prisma.continent.upsert({
      where: {
        id: continent.id,
      },
      update: {
        name: continent.name,
      },
      create: {
        id: continent.id,
        name: continent.name,
      },
    });
  }

  console.log('Continentes insertados correctamente.');
}

async function seedCountries(): Promise<void> {
  const countries = [
    {
      id: 1,
      continentId: 2,
      name: 'ALEMANIA',
    },
    {
      id: 2,
      continentId: 1,
      name: 'ARGENTINA',
    },
    {
      id: 3,
      continentId: 3,
      name: 'ARABIA SAUDITA',
    },
    {
      id: 4,
      continentId: 5,
      name: 'AUSTRALIA',
    },
    {
      id: 5,
      continentId: 1,
      name: 'BOLIVIA',
    },
    {
      id: 6,
      continentId: 1,
      name: 'BRASIL',
    },
    {
      id: 7,
      continentId: 1,
      name: 'CANADÁ',
    },
    {
      id: 8,
      continentId: 1,
      name: 'CHILE',
    },
    {
      id: 9,
      continentId: 3,
      name: 'CHINA',
    },
    {
      id: 10,
      continentId: 1,
      name: 'COLOMBIA',
    },
    {
      id: 11,
      continentId: 3,
      name: 'COREA DEL SUR',
    },
    {
      id: 12,
      continentId: 1,
      name: 'COSTA RICA',
    },
    {
      id: 13,
      continentId: 1,
      name: 'CUBA',
    },
    {
      id: 14,
      continentId: 2,
      name: 'DINAMARCA',
    },
    {
      id: 15,
      continentId: 1,
      name: 'ECUADOR',
    },
    {
      id: 16,
      continentId: 4,
      name: 'EGIPTO',
    },
    {
      id: 17,
      continentId: 3,
      name: 'EMIRATOS ÁRABES UNIDOS',
    },
    {
      id: 18,
      continentId: 2,
      name: 'ESPAÑA',
    },
    {
      id: 19,
      continentId: 1,
      name: 'ESTADOS UNIDOS',
    },
    {
      id: 20,
      continentId: 4,
      name: 'ETIOPÍA',
    },
    {
      id: 21,
      continentId: 3,
      name: 'FILIPINAS',
    },
    {
      id: 22,
      continentId: 2,
      name: 'FRANCIA',
    },
    {
      id: 23,
      continentId: 1,
      name: 'GUATEMALA',
    },
    {
      id: 24,
      continentId: 3,
      name: 'INDIA',
    },
    {
      id: 25,
      continentId: 3,
      name: 'INDONESIA',
    },
    {
      id: 26,
      continentId: 3,
      name: 'ISRAEL',
    },
    {
      id: 27,
      continentId: 2,
      name: 'ITALIA',
    },
    {
      id: 28,
      continentId: 3,
      name: 'JAPÓN',
    },
    {
      id: 29,
      continentId: 4,
      name: 'KENIA',
    },
    {
      id: 30,
      continentId: 4,
      name: 'MARRUECOS',
    },
    {
      id: 31,
      continentId: 1,
      name: 'MÉXICO',
    },
    {
      id: 32,
      continentId: 4,
      name: 'NIGERIA',
    },
    {
      id: 33,
      continentId: 2,
      name: 'NORUEGA',
    },
    {
      id: 34,
      continentId: 5,
      name: 'NUEVA ZELANDA',
    },
    {
      id: 35,
      continentId: 2,
      name: 'PAÍSES BAJOS',
    },
    {
      id: 36,
      continentId: 1,
      name: 'PANAMÁ',
    },
    {
      id: 37,
      continentId: 1,
      name: 'PARAGUAY',
    },
    {
      id: 38,
      continentId: 1,
      name: 'PERÚ',
    },
    {
      id: 39,
      continentId: 2,
      name: 'PORTUGAL',
    },
    {
      id: 40,
      continentId: 2,
      name: 'REINO UNIDO',
    },
    {
      id: 41,
      continentId: 1,
      name: 'REPÚBLICA DOMINICANA',
    },
    {
      id: 42,
      continentId: 2,
      name: 'RUSIA',
    },
    {
      id: 43,
      continentId: 3,
      name: 'SINGAPUR',
    },
    {
      id: 44,
      continentId: 4,
      name: 'SUDÁFRICA',
    },
    {
      id: 45,
      continentId: 2,
      name: 'SUECIA',
    },
    {
      id: 46,
      continentId: 2,
      name: 'SUIZA',
    },
    {
      id: 47,
      continentId: 3,
      name: 'TAILANDIA',
    },
    {
      id: 48,
      continentId: 3,
      name: 'TURQUÍA',
    },
    {
      id: 49,
      continentId: 1,
      name: 'URUGUAY',
    },
    {
      id: 50,
      continentId: 1,
      name: 'VENEZUELA',
    },
  ];

  for (const country of countries) {
    await prisma.country.upsert({
      where: {
        id: country.id,
      },
      update: {
        continentId: country.continentId,
        name: country.name,
        status: 1,
      },
      create: {
        id: country.id,
        continentId: country.continentId,
        name: country.name,
        status: 1,
      },
    });
  }

  console.log('Países insertados correctamente.');
}

async function seedPhoneCodes(): Promise<void> {
  const phoneCodes = [
    {
      countryId: 1,
      code: '+49',
    },
    {
      countryId: 2,
      code: '+54',
    },
    {
      countryId: 3,
      code: '+966',
    },
    {
      countryId: 4,
      code: '+61',
    },
    {
      countryId: 5,
      code: '+591',
    },
    {
      countryId: 6,
      code: '+55',
    },
    {
      countryId: 7,
      code: '+1',
    },
    {
      countryId: 8,
      code: '+56',
    },
    {
      countryId: 9,
      code: '+86',
    },
    {
      countryId: 10,
      code: '+57',
    },
    {
      countryId: 11,
      code: '+82',
    },
    {
      countryId: 12,
      code: '+506',
    },
    {
      countryId: 13,
      code: '+53',
    },
    {
      countryId: 14,
      code: '+45',
    },
    {
      countryId: 15,
      code: '+593',
    },
    {
      countryId: 16,
      code: '+20',
    },
    {
      countryId: 17,
      code: '+971',
    },
    {
      countryId: 18,
      code: '+34',
    },
    {
      countryId: 19,
      code: '+1',
    },
    {
      countryId: 20,
      code: '+251',
    },
    {
      countryId: 21,
      code: '+63',
    },
    {
      countryId: 22,
      code: '+33',
    },
    {
      countryId: 23,
      code: '+502',
    },
    {
      countryId: 24,
      code: '+91',
    },
    {
      countryId: 25,
      code: '+62',
    },
    {
      countryId: 26,
      code: '+972',
    },
    {
      countryId: 27,
      code: '+39',
    },
    {
      countryId: 28,
      code: '+81',
    },
    {
      countryId: 29,
      code: '+254',
    },
    {
      countryId: 30,
      code: '+212',
    },
    {
      countryId: 31,
      code: '+52',
    },
    {
      countryId: 32,
      code: '+234',
    },
    {
      countryId: 33,
      code: '+47',
    },
    {
      countryId: 34,
      code: '+64',
    },
    {
      countryId: 35,
      code: '+31',
    },
    {
      countryId: 36,
      code: '+507',
    },
    {
      countryId: 37,
      code: '+595',
    },
    {
      countryId: 38,
      code: '+51',
    },
    {
      countryId: 39,
      code: '+351',
    },
    {
      countryId: 40,
      code: '+44',
    },
    {
      countryId: 41,
      code: '+1',
    },
    {
      countryId: 42,
      code: '+7',
    },
    {
      countryId: 43,
      code: '+65',
    },
    {
      countryId: 44,
      code: '+27',
    },
    {
      countryId: 45,
      code: '+46',
    },
    {
      countryId: 46,
      code: '+41',
    },
    {
      countryId: 47,
      code: '+66',
    },
    {
      countryId: 48,
      code: '+90',
    },
    {
      countryId: 49,
      code: '+598',
    },
    {
      countryId: 50,
      code: '+58',
    },
  ];

  for (const phoneCode of phoneCodes) {
    await prisma.phoneCode.upsert({
      where: {
        id: phoneCode.countryId,
      },
      update: {
        countryId: phoneCode.countryId,
        code: phoneCode.code,
        status: 1,
      },
      create: {
        id: phoneCode.countryId,
        countryId: phoneCode.countryId,
        code: phoneCode.code,
        status: 1,
      },
    });
  }

  console.log('Códigos telefónicos insertados correctamente.');
}

async function seedRepositoryRoles(): Promise<void> {
  const repositoryRoles = [
    {
      id: 1,
      name: 'propietario',
      description:
        'Repositorios que administras como responsable principal. Diriges el contenido, organizas el equipo y mantienes el control del proyecto.',
    },
    {
      id: 2,
      name: 'copropietario',
      description:
        'Repositorios donde colaboras en la administración junto al propietario, aportando ideas y ayudando a organizar el equipo.',
    },
    {
      id: 3,
      name: 'cocreador',
      description:
        'Repositorios a los que fuiste invitado para colaborar activamente, aportando contenido, ideas y recursos al proyecto.',
    },
    {
      id: 4,
      name: 'miembro',
      description:
        'Repositorios a los que accediste como miembro para participar, colaborar y aprovechar sus recursos disponibles.',
    },
  ];

  for (const repositoryRole of repositoryRoles) {
    await prisma.repositoryRole.upsert({
      where: {
        id: repositoryRole.id,
      },
      update: {
        name: repositoryRole.name,
        description: repositoryRole.description,
        status: 1,
      },
      create: {
        id: repositoryRole.id,
        name: repositoryRole.name,
        description: repositoryRole.description,
        status: 1,
        createdBy: SYSTEM_USER_ID,
      },
    });
  }

  console.log('Roles de repositorio insertados correctamente.');
}

async function seedRepositoryFunctions(): Promise<void> {
  const repositoryFunctions = [
    {
      id: 1,
      name: 'experto',
      description:
        'Usuario con conocimiento especializado dentro del repositorio.',
    },
    {
      id: 2,
      name: 'gestor',
      description:
        'Usuario encargado de organizar y gestionar el trabajo del repositorio.',
    },
    {
      id: 3,
      name: 'tecnologo',
      description:
        'Usuario encargado del apoyo técnico y tecnológico del repositorio.',
    },
  ];

  for (const repositoryFunction of repositoryFunctions) {
    await prisma.repositoryFunction.upsert({
      where: {
        id: repositoryFunction.id,
      },
      update: {
        name: repositoryFunction.name,
        description: repositoryFunction.description,
        status: 1,
      },
      create: {
        id: repositoryFunction.id,
        name: repositoryFunction.name,
        description: repositoryFunction.description,
        status: 1,
        createdBy: SYSTEM_USER_ID,
      },
    });
  }

  console.log('Funciones de repositorio insertadas correctamente.');
}

async function seedSocialNetworks(): Promise<void> {
  const socialNetworks = [
    {
      id: 1,
      name: 'LinkedIn',
      baseUrl: 'https://www.linkedin.com/in/',
      icon: 'pi pi-linkedin',
    },
    {
      id: 2,
      name: 'GitHub',
      baseUrl: 'https://github.com/',
      icon: 'pi pi-github',
    },
    {
      id: 3,
      name: 'Facebook',
      baseUrl: 'https://www.facebook.com/',
      icon: 'pi pi-facebook',
    },
    {
      id: 4,
      name: 'X',
      baseUrl: 'https://x.com/',
      icon: 'pi pi-twitter',
    },
    {
      id: 5,
      name: 'Instagram',
      baseUrl: 'https://www.instagram.com/',
      icon: 'pi pi-instagram',
    },
    {
      id: 6,
      name: 'YouTube',
      baseUrl: 'https://www.youtube.com/@',
      icon: 'pi pi-youtube',
    },
  ];

  for (const socialNetwork of socialNetworks) {
    await prisma.socialNetwork.upsert({
      where: {
        id: socialNetwork.id,
      },
      update: {
        name: socialNetwork.name,
        baseUrl: socialNetwork.baseUrl,
        icon: socialNetwork.icon,
        status: 1,
      },
      create: {
        id: socialNetwork.id,
        name: socialNetwork.name,
        baseUrl: socialNetwork.baseUrl,
        icon: socialNetwork.icon,
        status: 1,
        createdBy: SYSTEM_USER_ID,
      },
    });
  }

  console.log('Redes sociales insertadas correctamente.');
}

async function main(): Promise<void> {
  console.log('Iniciando seed...');

  await seedAdminUser();
  await seedContinents();
  await seedCountries();
  await seedPhoneCodes();
  await seedRepositoryRoles();
  await seedRepositoryFunctions();
  await seedSocialNetworks();

  console.log('Seed finalizado.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
