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

import { RepositoryUserScope } from '@modules/repositories/application/enums/repository-user-scope.enum';
import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';

export class GetRepositoryUsersDto {
  @ApiPropertyOptional({
    description: 'Texto para buscar por nombre de usuario o correo electrónico',
    example: 'user',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser un texto' })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `La búsqueda no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  @ToLowerCase()
  search?: string;

  @ApiPropertyOptional({
    description: 'Nombre del rol para filtrar usuarios del repositorio',
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
    description: 'Nombre de la función para filtrar usuarios del repositorio',
    example: 'experto',
  })
  @IsOptional()
  @IsString({ message: 'La función debe ser un texto' })
  @MaxLength(50, {
    message: ({ constraints }) =>
      `La función no puede superar los ${constraints[0]} caracteres`,
  })
  @ToLowerCase()
  function?: string;

  @ApiPropertyOptional({
    description:
      'Alcance del listado. all incluye todos los usuarios del repositorio y team incluye cocreadores y miembros',
    example: RepositoryUserScope.TEAM,
    enum: RepositoryUserScope,
    default: RepositoryUserScope.ALL,
  })
  @IsOptional()
  @IsEnum(RepositoryUserScope, {
    message: 'El alcance debe ser all o team',
  })
  scope: RepositoryUserScope = RepositoryUserScope.ALL;

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
