import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { CreateFileCommand } from '@modules/files/application/commands/create-file/create-file.command';
import { DeleteFileCommand } from '@modules/files/application/commands/delete-file/delete-file.command';
import { CreateFolderCommand } from '@modules/files/application/commands/create-folder/create-folder.command';
import { DeleteFolderCommand } from '@modules/files/application/commands/delete-folder/delete-folder.command';
import { UpdateFolderCommand } from '@modules/files/application/commands/update-folder/update-folder.command';
import { CreateFileDto } from '@modules/files/application/dto/requests/create-file.dto';
import { CreateFolderDto } from '@modules/files/application/dto/requests/create-folder.dto';
import { GetExplorerContentDto } from '@modules/files/application/dto/requests/get-explorer-content.dto';
import { UpdateFolderDto } from '@modules/files/application/dto/requests/update-folder.dto';
import { GetExplorerContentQuery } from '@modules/files/application/queries/get-explorer-content/get-explorer-content.query';
import { GetFileDownloadUrlQuery } from '@modules/files/application/queries/get-file-download-url/get-file-download-url.query';
import { FileUploadPipe } from '@modules/files/presentation/pipes/file-upload.pipe';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('repositories/:repositoryId/explorer')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findExplorerContent(
    @Param('repositoryId', ParseIntPipe) repositoryId: number,
    @Query() query: GetExplorerContentDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(
      new GetExplorerContentQuery(repositoryId, query, userId),
    );
  }

  @Post()
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileDto })
  @UseInterceptors(FileInterceptor('file'))
  createFile(
    @Body() dto: CreateFileDto,
    @UploadedFile(FileUploadPipe) file: Express.Multer.File,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new CreateFileCommand(dto, file, userId));
  }

  @Get(':id/download')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  downloadFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.queryBus.execute(new GetFileDownloadUrlQuery(id, userId));
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  deleteFile(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new DeleteFileCommand(id, userId));
  }

  @Post('folders')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  createFolder(
    @Body() dto: CreateFolderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new CreateFolderCommand(dto, userId));
  }

  @Patch('folders/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  updateFolder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFolderDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new UpdateFolderCommand(id, dto, userId));
  }

  @Delete('folders/:id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  deleteFolder(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(new DeleteFolderCommand(id, userId));
  }
}
