import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RepositoryVisibility } from '@generated-prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import { CreateRepositoryCategoryDto } from '@modules/repositories/application/dto/requests/create-repository-category.dto';
import { CreateTagDto } from '@modules/tags/application/dto/requests/create-tag.dto';
import { IsHexColor } from '@shared/application/decorators/validators/is-hex-color.decorator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { UniqueByProperties } from '@shared/application/decorators/transforms/unique-by-properties.decorator';
import { Slugify } from '@shared/application/decorators/transforms/slugify.decorator';
import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';

export class CreateRepositoryDto {
  @ApiProperty({
    example: 'astronomia',
  })
  @IsString({ message: 'El nombre del repositorio debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del repositorio es obligatorio' })
  @MinLength(2, {
    message: ({ constraints }) =>
      `El nombre del repositorio debe tener al menos ${constraints[0]} caracteres`,
  })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `El nombre del repositorio no puede superar los ${constraints[0]} caracteres`,
  })
  @Slugify()
  name!: string;

  @ApiPropertyOptional({
    example: 'Repositorio para organizar informacion sobre astronomia.',
  })
  @IsOptional()
  @IsString({ message: 'La descripcion del repositorio debe ser un texto' })
  @MaxLength(1500, {
    message: ({ constraints }) =>
      `La descripcion del repositorio no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  description?: string;

  @ApiProperty({
    enum: [RepositoryVisibility.publico, RepositoryVisibility.privado],
    example: RepositoryVisibility.privado,
  })
  @IsEnum([RepositoryVisibility.publico, RepositoryVisibility.privado], {
    message: 'La visibilidad del repositorio no es válida',
  })
  visibility!: RepositoryVisibility;

  @ApiProperty({
    example: 'C9E4DE',
  })
  @IsString({ message: 'El color del repositorio debe ser un texto' })
  @IsNotEmpty({ message: 'El color del repositorio es obligatorio' })
  @IsHexColor({
    message:
      'El color del repositorio debe ser un color hexadecimal válido de 6 caracteres',
  })
  @NoSpaces()
  color!: string;

  @ApiProperty({
    type: CreateRepositoryCategoryDto,
  })
  @ValidateNested()
  @Type(() => CreateRepositoryCategoryDto)
  category!: CreateRepositoryCategoryDto;

  @ApiPropertyOptional({
    type: [CreateTagDto],
    maxItems: 5,
  })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben enviarse en una lista' })
  @ArrayMaxSize(5, {
    message: ({ constraints }) =>
      `No puedes agregar mas de ${constraints[0]} etiquetas al repositorio`,
  })
  @UniqueByProperties('name')
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags?: CreateTagDto[];
}
