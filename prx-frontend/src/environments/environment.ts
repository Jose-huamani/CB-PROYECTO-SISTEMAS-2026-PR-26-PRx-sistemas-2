import { Environment } from '@env/environment.model';

export const environment: Environment = {
  production: false,
  api: {
    baseUrl: 'http://localhost:3000/prx',
    timeout: 10000,
  },
  storage: {
    publicBaseUrl: 'https://prx-bucket-public.t3.tigrisfiles.io',
  },
};
