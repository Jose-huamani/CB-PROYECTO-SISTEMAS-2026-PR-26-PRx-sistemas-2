import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getPresignedUrl, list, put, remove } from '@tigrisdata/storage';

import { APP_MESSAGES } from '@shared/constants/app-messages.constants';
import { STORAGE_CONSTANTS } from '@shared/constants/storage.constants';
import { TigrisConfig } from '@shared/types/tigris-config.type';

@Injectable()
export class TigrisStorageService {
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
      throw new InternalServerErrorException(result.error.message);
    }
  }

  async deleteObject(path: string, isPublic: boolean): Promise<void> {
    const result = await remove(path, {
      config: this.getConfig(isPublic),
    });

    if (result.error) {
      throw new InternalServerErrorException(result.error.message);
    }
  }

  async getReadUrl(path: string, isPublic: boolean): Promise<string> {
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
}
