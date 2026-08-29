import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateRepositoryUserDto {
  @ApiPropertyOptional({
    description: 'ID del nuevo rol en el repositorio',
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID del rol debe ser un identificador válido' })
  @Min(1, { message: 'El ID del rol debe ser un identificador válido' })
  repositoryRoleId?: number;

  @ApiPropertyOptional({
    description: 'ID de la nueva función en el repositorio',
    example: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El ID de la función debe ser un identificador válido' })
  @Min(1, { message: 'El ID de la función debe ser un identificador válido' })
  repositoryFunctionId?: number;
}
