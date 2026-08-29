import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';

import { RepositoriesModule } from '@modules/repositories/repositories.module';
import { TagsModule } from '@modules/tags/tags.module';

import { CreateFileHandler } from '@modules/files/application/commands/create-file/create-file.handler';
import { DeleteFileHandler } from '@modules/files/application/commands/delete-file/delete-file.handler';
import { CreateFolderHandler } from '@modules/files/application/commands/create-folder/create-folder.handler';
import { DeleteFolderHandler } from '@modules/files/application/commands/delete-folder/delete-folder.handler';
import { UpdateFolderHandler } from '@modules/files/application/commands/update-folder/update-folder.handler';
import { GetExplorerContentHandler } from '@modules/files/application/queries/get-explorer-content/get-explorer-content.handler';
import { GetFileDownloadUrlHandler } from '@modules/files/application/queries/get-file-download-url/get-file-download-url.handler';

import { FileRepository } from '@modules/files/domain/repositories/file.repository';
import { FolderRepository } from '@modules/files/domain/repositories/folder.repository';

import { PrismaFileRepository } from '@modules/files/infrastructure/persistence/prisma-file.repository';
import { PrismaFolderRepository } from '@modules/files/infrastructure/persistence/prisma-folder.repository';

import { FilesController } from '@modules/files/presentation/controllers/files.controller';
import { PrismaModule } from '@shared/infrastructure/prisma/prisma.module';

@Module({
  imports: [CqrsModule, PrismaModule, RepositoriesModule, TagsModule],
  controllers: [FilesController],
  providers: [
    CreateFolderHandler,
    UpdateFolderHandler,
    DeleteFolderHandler,
    CreateFileHandler,
    DeleteFileHandler,
    GetExplorerContentHandler,
    GetFileDownloadUrlHandler,

    {
      provide: FolderRepository,
      useClass: PrismaFolderRepository,
    },
    {
      provide: FileRepository,
      useClass: PrismaFileRepository,
    },
  ],
})
export class FilesModule {}
