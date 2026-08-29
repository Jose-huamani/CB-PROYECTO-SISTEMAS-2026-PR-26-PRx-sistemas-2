import { Environment } from '@env/environment.model';

export const environment: Environment = {
  production: true,
  api: {
    baseUrl: 'https://api-produccion.com/prx',
    timeout: 10000,
  },
  storage: {
    publicBaseUrl: 'https://prx-bucket-public.t3.tigrisfiles.io',
  },
};
