import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { extname } from 'node:path';
import { NoteAttachment } from '@modules/notes/domain/repositories/note.repository';
import { TigrisStorageService } from '@shared/infrastructure/storage/tigris-storage.service';

@Injectable()
export class NoteMediaStorageService {
    private readonly logger = new Logger(NoteMediaStorageService.name);

    constructor(private readonly storage: TigrisStorageService) {}

    async upload(files: Express.Multer.File[], repositoryId: number, userId: number): Promise<NoteAttachment[]> {
        const uploaded: NoteAttachment[] = [];
        try {
            for (const file of files) {
                // Storage keys are independent of user-supplied names and never collide.
                const extension = extname(file.originalname).toLowerCase().replace(/[^.a-z0-9]/g, '').slice(0, 12);
                const storagePath = `repositories/${repositoryId}/notes/media/${randomUUID()}${extension}`;
                await this.storage.uploadObject({
                    path: storagePath,
                    body: file.buffer,
                    isPublic: false,
                    contentType: file.mimetype,
                    multipart: true,
                });
                uploaded.push({ name: file.originalname, storagePath, createdBy: userId });
            }
            return uploaded;
        } catch (error) {
            await this.remove(uploaded.map((file) => file.storagePath));
            throw error;
        }
    }

    // Only remove staged uploads on rollback, or old files after the database commit.
    // A storage cleanup error must never turn a committed save into a false failure.
    async remove(paths: string[]): Promise<void> {
        for (const path of paths) {
            for (let attempt = 1; attempt <= 3; attempt++) {
                try {
                    await this.storage.deleteObject(path, false);
                    break;
                } catch {
                    if (attempt === 3) this.logger.error(`No se pudo limpiar el archivo ${path}`);
                }
            }
        }
    }
}
