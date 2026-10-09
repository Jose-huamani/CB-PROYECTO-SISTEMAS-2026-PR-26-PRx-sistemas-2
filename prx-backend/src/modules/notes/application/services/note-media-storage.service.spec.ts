import { NoteMediaStorageService } from './note-media-storage.service';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

const file = (name = 'foto.png') => ({ originalname: name, buffer: Buffer.from('image'), mimetype: 'image/png' }) as Express.Multer.File;

describe('Carga y recuperación de multimedia', () => {
    let storage: { uploadObject: jest.Mock; deleteObject: jest.Mock };
    let service: NoteMediaStorageService;
    beforeEach(() => {
        storage = { uploadObject: jest.fn().mockResolvedValue(undefined), deleteObject: jest.fn().mockResolvedValue(undefined) };
        service = new NoteMediaStorageService(storage as unknown as TigrisStorageService);
    });
    it('genera rutas diferentes para archivos con el mismo nombre', async () => {
        const result = await service.upload([file(), file()], 12, 3);
        expect(result[0].storagePath).not.toBe(result[1].storagePath);
        expect(result.map((item) => item.name)).toEqual(['foto.png', 'foto.png']);
        expect(result[0].storagePath).toMatch(/^repositories\/12\/notes\/media\/[a-f0-9-]+\.png$/);
    });
    it('no incorpora rutas suministradas por el usuario a la clave', async () => {
        const result = await service.upload([file('../../foto.png')], 12, 3);
        expect(result[0].storagePath).not.toContain('..');
    });
    it('limpia cargas previas cuando falla otro archivo', async () => {
        storage.uploadObject.mockResolvedValueOnce(undefined).mockRejectedValueOnce(new Error('STORAGE_FAILURE'));
        await expect(service.upload([file(), file()], 12, 3)).rejects.toThrow('STORAGE_FAILURE');
        expect(storage.deleteObject).toHaveBeenCalledTimes(1);
        expect(storage.deleteObject).toHaveBeenCalledWith(storage.uploadObject.mock.calls[0][0].path, false);
    });
    it('reintenta un borrado transitorio', async () => {
        storage.deleteObject.mockRejectedValueOnce(new Error('temporary'));
        await service.remove(['old.png']);
        expect(storage.deleteObject).toHaveBeenCalledTimes(2);
    });
});
