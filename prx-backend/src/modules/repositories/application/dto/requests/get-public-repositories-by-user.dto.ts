import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class GetPublicRepositoriesByUserDto {
  @ApiPropertyOptional({
    description: 'Cantidad máxima de repositorios públicos a devolver',
    example: 10,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, {
    message: ({ constraints }) => `El límite mínimo es ${constraints[0]}`,
  })
  @Max(10, {
    message: ({ constraints }) => `El límite máximo es ${constraints[0]}`,
  })
  limit: number = 10;
}
