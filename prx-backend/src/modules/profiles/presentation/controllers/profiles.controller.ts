import {
  Body,
  Controller,
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
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { CreateProfileCommand } from '@modules/profiles/application/commands/create-profile/create-profile.command';
import { UpdateAvatarCommand } from '@modules/profiles/application/commands/update-avatar/update-avatar.command';
import { UpdateProfileCommand } from '@modules/profiles/application/commands/update-profile/update-profile.command';
import { CreateProfileRequestDto } from '@modules/profiles/application/dto/requests/create-profile-request.dto';
import { GetTagsDto } from '@modules/profiles/application/dto/requests/get-tags.dto';
import { UpdateProfileRequestDto } from '@modules/profiles/application/dto/requests/update-profile-request.dto';
import { GetCountriesQuery } from '@modules/profiles/application/queries/get-countries/get-countries.query';
import { GetProfileByIdQuery } from '@modules/profiles/application/queries/get-profile-by-id/get-profile-by-id.query';
import { GetTagsQuery } from '@modules/profiles/application/queries/get-tags/get-tags.query';
import { CurrentUser } from '@shared/presentation/decorators/current-user.decorator';
import { Public } from '@shared/presentation/decorators/public.decorator';

@ApiTags('Profiles')
@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  getProfile(@CurrentUser('sub') userId: number) {
    return this.queryBus.execute(new GetProfileByIdQuery(userId));
  }

  @Public()
  @Get('public/:id')
  @HttpCode(HttpStatus.OK)
  getPublicProfile(@Param('id', ParseIntPipe) id: number) {
    return this.queryBus.execute(new GetProfileByIdQuery(id));
  }

  @Public()
  @Get('countries')
  @HttpCode(HttpStatus.OK)
  getCountries() {
    return this.queryBus.execute(new GetCountriesQuery());
  }

  @Public()
  @Get('tags')
  @HttpCode(HttpStatus.OK)
  getTags(@Query() query: GetTagsDto) {
    return this.queryBus.execute(new GetTagsQuery(query));
  }

  @ApiBearerAuth()
  @Patch()
  @HttpCode(HttpStatus.OK)
  updateProfile(
    @Body() updateProfileRequestDto: UpdateProfileRequestDto,
    @CurrentUser('sub') userId: number,
  ) {
    return this.commandBus.execute(
      new UpdateProfileCommand(userId, updateProfileRequestDto, userId),
    );
  }

  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createProfile(
    @Body() createProfileRequestDto: CreateProfileRequestDto,
    @CurrentUser('sub') userId: number,
    @CurrentUser('email') email: string,
  ) {
    return this.commandBus.execute(
      new CreateProfileCommand(createProfileRequestDto, userId, email),
    );
  }

  @ApiBearerAuth()
  @Patch('avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @HttpCode(HttpStatus.OK)
  updateAvatar(
    @CurrentUser() user: { sub: number },
    @UploadedFile() file: { buffer: Buffer; mimetype: string; size: number },
  ) {
    return this.commandBus.execute(new UpdateAvatarCommand(user.sub, file));
  }
}
