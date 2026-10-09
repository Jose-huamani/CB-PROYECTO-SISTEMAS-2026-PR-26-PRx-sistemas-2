import { resolve } from 'node:path';
import { TigrisStorageService } from './tigris-storage.service';

describe('Rutas del almacenamiento local', () => {
  const service = new TigrisStorageService({} as any);
  it('acepta una ruta interna en el sistema operativo actual', () => {
    expect((service as any).getLocalPath('repositories/1/notes/media/test.pdf'))
      .toBe(resolve(process.cwd(), 'uploads/repositories/1/notes/media/test.pdf'));
  });
  it('rechaza escapar al directorio superior', () => {
    expect(() => (service as any).getLocalPath('../outside.pdf')).toThrow();
  });
  it('rechaza recorrido con separadores de Windows', () => {
    expect(() => (service as any).getLocalPath('..\\outside.pdf')).toThrow();
  });
});
