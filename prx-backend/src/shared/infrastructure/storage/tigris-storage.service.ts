import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getPresignedUrl, list, put, remove } from '@tigrisdata/storage';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { extname, resolve } from 'node:path';

import { APP_MESSAGES } from '@shared/constants/app-messages.constants';
import { STORAGE_CONSTANTS } from '@shared/constants/storage.constants';
import { TigrisConfig } from '@shared/types/tigris-config.type';

@Injectable()
export class TigrisStorageService {
  private readonly localRoot = resolve(process.cwd(), 'uploads');

  constructor(private readonly configService: ConfigService) {}

  private getConfig(isPublic: boolean): TigrisConfig {
    const bucket = this.configService.getOrThrow<string>(
      isPublic ? 'storage.publicBucket' : 'storage.privateBucket',
    );

    return {
      bucket,
      accessKeyId: this.configService.getOrThrow<string>('storage.accessKeyId'),
      secretAccessKey: this.configService.getOrThrow<string>(
        'storage.secretAccessKey',
      ),
      endpoint: this.configService.getOrThrow<string>('storage.endpoint'),
    };
  }

  async verifyConnection(isPublic: boolean): Promise<void> {
    const result = await list({
      limit: 1,
      config: this.getConfig(isPublic),
    });

    if (result.error) {
      throw new InternalServerErrorException(result.error.message);
    }
  }

  async uploadObject(params: {
    path: string;
    body: Buffer;
    isPublic: boolean;
    contentType: string;
    multipart?: boolean;
  }): Promise<void> {
    const result = await put(params.path, params.body, {
      access: params.isPublic ? 'public' : 'private',
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: params.contentType,
      contentDisposition: 'attachment',
      multipart: params.multipart,
      config: this.getConfig(params.isPublic),
    });

    if (result.error) {
      if (this.localFallbackEnabled()) {
        await this.writeLocalObject(params.path, params.body);
        return;
      }

      throw new InternalServerErrorException(result.error.message);
    }
  }

  async deleteObject(path: string, isPublic: boolean): Promise<void> {
    if (await this.localObjectExists(path)) {
      await rm(this.getLocalPath(path), { force: true });
      return;
    }

    const result = await remove(path, {
      config: this.getConfig(isPublic),
    });

    if (result.error) {
      throw new InternalServerErrorException(result.error.message);
    }
  }

  async getReadUrl(path: string, isPublic: boolean): Promise<string> {
    if (await this.localObjectExists(path)) {
      const body = await readFile(this.getLocalPath(path));
      return `data:${this.getContentType(path)};base64,${body.toString('base64')}`;
    }

    if (isPublic) {
      const bucket = this.getConfig(true).bucket;
      const encodedPath = path.split('/').map(encodeURIComponent).join('/');

      return `https://${bucket}.t3.tigrisfiles.io/${encodedPath}`;
    }

    const result = await getPresignedUrl(path, {
      operation: 'get',
      config: this.getConfig(false),
      expiresIn: STORAGE_CONSTANTS.PRESIGNED_URL_EXPIRATION_SECONDS,
    });

    if (result.error || !result.data) {
      throw new InternalServerErrorException(
        result.error?.message ?? APP_MESSAGES.FILE_URL_GENERATION_ERROR,
      );
    }

    return result.data.url;
  }

  private localFallbackEnabled(): boolean {
    return process.env.NODE_ENV !== 'production';
  }

  private getLocalPath(storagePath: string): string {
    const normalized = storagePath.replace(/\\/g, '/').replace(/^\/+/, '');
    const localPath = resolve(this.localRoot, normalized);

    if (localPath !== this.localRoot && !localPath.startsWith(`${this.localRoot}\\`)) {
      throw new InternalServerErrorException('Ruta de almacenamiento local no válida');
    }

    return localPath;
  }

  private async writeLocalObject(storagePath: string, body: Buffer): Promise<void> {
    const localPath = this.getLocalPath(storagePath);
    await mkdir(resolve(localPath, '..'), { recursive: true });
    await writeFile(localPath, body);
  }

  private async localObjectExists(storagePath: string): Promise<boolean> {
    if (!this.localFallbackEnabled()) return false;

    try {
      return (await stat(this.getLocalPath(storagePath))).isFile();
    } catch {
      return false;
    }
  }

  private getContentType(storagePath: string): string {
    const extension = extname(storagePath).toLowerCase();
    const contentTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
    };

    return contentTypes[extension] ?? 'application/octet-stream';
  }
}
