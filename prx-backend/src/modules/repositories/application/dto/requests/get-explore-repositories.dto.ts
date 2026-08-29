import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';
import { Slugify } from '@shared/application/decorators/transforms/slugify.decorator';
import { ToUpperCase } from '@shared/application/decorators/transforms/to-uppercase.decorator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class GetExploreRepositoriesDto {
  @ApiPropertyOptional({
    description: 'Texto para buscar por nombre o etiquetas del repositorio',
    example: 'astronomia',
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
    description: 'Nombre de usuario del propietario del repositorio',
    example: 'alejandro',
  })
  @IsOptional()
  @IsString({ message: 'El propietario debe ser un texto' })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `El propietario no puede superar los ${constraints[0]} caracteres`,
  })
  @Slugify()
  owner?: string;

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
