export interface Environment {
  production: boolean;
  api: {
    baseUrl: string;
    timeout: number;
  };
  storage: {
    publicBaseUrl: string;
  };
}
