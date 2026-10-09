import { CreateNoteHandler } from './create-note/create-note.handler';
import { UpdateNoteHandler } from './update-note/update-note.handler';
import { NoteResponseMapper } from '../mappers/note-response.mapper';

describe('Guardado seguro de notas y adjuntos', () => {
    const oldFile = { id: 8, name: 'old.png', storagePath: 'old-path' };
    const uploaded = [{ name: 'new.png', storagePath: 'new-path', createdBy: 2 }];
    let notes: any, repos: any, members: any, media: any, note: any;
    beforeEach(() => {
        note = { id: 10, repositoryId: 5, title: 'nota', content: 'texto', files: [oldFile], tasks: [], links: [] };
        notes = {
            findById: jest.fn().mockResolvedValue(note),
            findActiveByRepositoryIdAndTitle: jest.fn().mockResolvedValue(null),
            createWithFiles: jest.fn().mockResolvedValue({ ...note, files: uploaded }),
            updateWithFiles: jest.fn().mockResolvedValue({ ...note, files: uploaded }),
        };
        repos = { findById: jest.fn().mockResolvedValue({ id: 5, ownerUserId: 2, visibility: 'intimo' }) };
        members = { findByRepositoryIdAndUserId: jest.fn().mockResolvedValue(null) };
        media = { upload: jest.fn().mockResolvedValue(uploaded), remove: jest.fn().mockResolvedValue(undefined) };
        jest.spyOn(NoteResponseMapper, 'toNoteResponse').mockImplementation((entity: any) => entity);
    });
    afterEach(() => jest.restoreAllMocks());
    const updateCommand = (retainedFileIds: string | undefined = '') => ({
        id: 10, userId: 2, files: [] as Express.Multer.File[],
        dto: { title: 'Nueva', content: 'Contenido', tasks: '[]', links: '[]', retainedFileIds },
    });
    it('responde a la creación con los adjuntos persistidos', async () => {
        const handler = new CreateNoteHandler(notes, repos, members, media);
        const result = await handler.execute({ repositoryId: 5, createdBy: 2, dto: { title: 'nota', content: 'texto', links: '[]' }, files: [] });
        expect(result.data.files).toEqual(uploaded);
        expect(notes.createWithFiles).toHaveBeenCalledWith(expect.anything(), uploaded);
    });
    it('no crea datos cuando la carga falla', async () => {
        media.upload.mockRejectedValue(new Error('UPLOAD_FAILED'));
        const handler = new CreateNoteHandler(notes, repos, members, media);
        await expect(handler.execute({ repositoryId: 5, createdBy: 2, dto: { title: 'nota', content: 'texto' }, files: [] })).rejects.toThrow('UPLOAD_FAILED');
        expect(notes.createWithFiles).not.toHaveBeenCalled();
    });
    it('limpia uploads cuando falla la transacción de creación', async () => {
        notes.createWithFiles.mockRejectedValue(new Error('DB_FAILED'));
        const handler = new CreateNoteHandler(notes, repos, members, media);
        await expect(handler.execute({ repositoryId: 5, createdBy: 2, dto: { title: 'nota', content: 'texto' }, files: [] })).rejects.toThrow('DB_FAILED');
        expect(media.remove).toHaveBeenCalledWith(['new-path']);
    });
    it('borra archivos anteriores únicamente después de confirmar los datos', async () => {
        const handler = new UpdateNoteHandler(notes, repos, members, media);
        await handler.execute(updateCommand());
        expect(media.remove).toHaveBeenCalledWith(['old-path']);
        expect(notes.updateWithFiles.mock.invocationCallOrder[0]).toBeLessThan(media.remove.mock.invocationCallOrder[0]);
    });
    it('un fallo de datos conserva los archivos anteriores', async () => {
        notes.updateWithFiles.mockRejectedValue(new Error('DB_FAILED'));
        const handler = new UpdateNoteHandler(notes, repos, members, media);
        await expect(handler.execute(updateCommand())).rejects.toThrow('DB_FAILED');
        expect(media.remove).toHaveBeenCalledWith(['new-path']);
        expect(media.remove).not.toHaveBeenCalledWith(['old-path']);
    });
    it('omite retainedFileIds sin eliminar adjuntos', async () => {
        const handler = new UpdateNoteHandler(notes, repos, members, media);
        const command = updateCommand();
        command.dto.retainedFileIds = undefined;
        await handler.execute(command);
        expect(notes.updateWithFiles).toHaveBeenCalledWith(10, expect.anything(), [8], uploaded);
        expect(media.remove).toHaveBeenCalledWith([]);
    });
    it('rechaza IDs ajenos antes de cargar archivos', async () => {
        const handler = new UpdateNoteHandler(notes, repos, members, media);
        await expect(handler.execute(updateCommand('999'))).rejects.toThrow('no pertenecen');
        expect(media.upload).not.toHaveBeenCalled();
    });
    it('rechaza más de cinco adjuntos combinados', async () => {
        const command = updateCommand('8');
        command.files = Array.from({ length: 5 }, () => ({} as Express.Multer.File));
        await expect(new UpdateNoteHandler(notes, repos, members, media).execute(command)).rejects.toThrow('máximo de 5');
        expect(media.upload).not.toHaveBeenCalled();
    });
    it('impide cambios de un usuario ajeno al repositorio íntimo', async () => {
        await expect(new UpdateNoteHandler(notes, repos, members, media).execute({ ...updateCommand(), userId: 3 })).rejects.toThrow();
        expect(media.upload).not.toHaveBeenCalled();
    });
});
