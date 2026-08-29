import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class GetExplorerContentDto {
  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La carpeta debe ser un identificador válido' })
  @Min(1, {
    message: 'La carpeta debe ser un identificador válido',
  })
  folderId?: number;

  @ApiPropertyOptional({
    example: 'reporte',
  })
  @IsOptional()
  @IsString({ message: 'La búsqueda debe ser un texto' })
  @MaxLength(255, {
    message: ({ constraints }) =>
      `La búsqueda no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  search?: string;
}
