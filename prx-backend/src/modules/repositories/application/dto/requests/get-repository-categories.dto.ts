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

import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { ToUpperCase } from '@shared/application/decorators/transforms/to-uppercase.decorator';

export class GetRepositoryCategoriesDto {
  @ApiPropertyOptional({
    example: 'ASTRONOMIA',
    description:
      'Texto usado para buscar categorías por coincidencia de nombre.',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser un texto' })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `La búsqueda no debe superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  @ToUpperCase()
  search?: string;

  @ApiPropertyOptional({
    example: 10,
    default: 10,
    description: 'Cantidad máxima de categorías a devolver.',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, {
    message: ({ constraints }) => `El límite mínimo es ${constraints[0]}`,
  })
  @Max(20, {
    message: ({ constraints }) => `El límite máximo es ${constraints[0]}`,
  })
  limit: number = 10;
}
