import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Max, Min, IsOptional } from 'class-validator';
import { PAGINATION_CONSTANTS } from '@shared/constants/pagination.constants';

export class GetMeBinnaclesDto {
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
