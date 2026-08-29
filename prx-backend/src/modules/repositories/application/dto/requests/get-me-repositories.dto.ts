import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { RepositoryVisibility } from '@generated-prisma/enums';

import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';
import { Slugify } from '@shared/application/decorators/transforms/slugify.decorator';
import { ToUpperCase } from '@shared/application/decorators/transforms/to-uppercase.decorator';
import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class GetMeRepositoriesDto {
  @ApiPropertyOptional({
    description: 'Texto para buscar por nombre o etiquetas del repositorio',
    example: 'formula',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser un texto' })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `La búsqueda no puede superar los ${constraints[0]} caracteres`,
  })
  @Slugify()
  search?: string;

  @ApiPropertyOptional({
    description: 'Nombre del rol del usuario en el repositorio',
    example: 'cocreador',
  })
  @IsOptional()
  @IsString({ message: 'El rol debe ser un texto' })
  @MaxLength(50, {
    message: ({ constraints }) =>
      `El rol no puede superar los ${constraints[0]} caracteres`,
  })
  @ToLowerCase()
  role?: string;

  @ApiPropertyOptional({
    description: 'Nombre de la categoría del repositorio',
    example: 'CARRERA',
  })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser un texto' })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `La categoría no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  @ToUpperCase()
  category?: string;

  @ApiPropertyOptional({
    description: 'Tipo de visibilidad del repositorio',
    enum: RepositoryVisibility,
    example: RepositoryVisibility.privado,
  })
  @IsOptional()
  @IsEnum(RepositoryVisibility, {
    message: 'El tipo de repositorio no es válido',
  })
  visibility?: RepositoryVisibility;

  @ApiPropertyOptional({
    description: 'Número de página',
    example: PAGINATION_CONSTANTS.DEFAULT_PAGE,
    default: PAGINATION_CONSTANTS.DEFAULT_PAGE,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser mayor o igual a 1' })
  page: number = PAGINATION_CONSTANTS.DEFAULT_PAGE;

  @ApiPropertyOptional({
    description: 'Cantidad de elementos por página (mínimo 10, máximo 100)',
    example: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
    default: PAGINATION_CONSTANTS.DEFAULT_LIMIT,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(10, {
    message: ({ constraints }) =>
      `El límite debe ser mayor o igual a ${constraints[0]} elementos`,
  })
  @Max(PAGINATION_CONSTANTS.MAX_LIMIT, {
    message: ({ constraints }) =>
      `El límite no puede superar los ${constraints[0]} elementos`,
  })
  limit: number = PAGINATION_CONSTANTS.DEFAULT_LIMIT;
}
