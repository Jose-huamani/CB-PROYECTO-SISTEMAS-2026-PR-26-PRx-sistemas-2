import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

import { IsHexColor } from '@shared/application/decorators/validators/is-hex-color.decorator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';

export class CreateFolderDto {
  @ApiProperty({
    example: 1,
  })
  @Type(() => Number)
  @IsInt({ message: 'El repositorio debe ser un identificador válido' })
  @Min(1, {
    message: 'El repositorio debe ser un identificador válido',
  })
  repositoryId!: number;

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'La carpeta padre debe ser un identificador válido' })
  @Min(1, {
    message: 'La carpeta padre debe ser un identificador válido',
  })
  parentId?: number;

  @ApiProperty({
    example: 'Documentos',
  })
  @IsString({ message: 'El nombre de la carpeta debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la carpeta es obligatorio' })
  @MaxLength(100, {
    message: ({ constraints }) =>
      `El nombre de la carpeta no puede superar los ${constraints[0]} caracteres`,
  })
  @Matches(/^[^\\/:*?"<>|]+$/, {
    message:
      'El nombre de la carpeta no puede contener los caracteres \\ / : * ? " < > |',
  })
  @NormalizeSpaces()
  name!: string;

  @ApiProperty({
    example: 'C9E4DE',
  })
  @IsString({ message: 'El color de la carpeta debe ser un texto' })
  @IsNotEmpty({ message: 'El color de la carpeta es obligatorio' })
  @IsHexColor({
    message:
      'El color de la carpeta debe ser un color hexadecimal válido de 6 caracteres',
  })
  @NoSpaces()
  color!: string;
}
