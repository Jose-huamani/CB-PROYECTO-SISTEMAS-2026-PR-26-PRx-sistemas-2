// Run TypeScript with decorator metadata and Prisma's .js -> .ts resolution.
require('ts-node').register({ transpileOnly: true, experimentalResolver: true });
require('tsconfig-paths/register');
require('./src/main.ts');
