import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  ArrayMaxSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

import { CreateTagDto } from '@modules/tags/application/dto/requests/create-tag.dto';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { UniqueByProperties } from '@shared/application/decorators/transforms/unique-by-properties.decorator';
import { JsonArray } from '@shared/application/decorators/transforms/json-array.decorator';

export class CreateFileDto {
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
  @IsInt({ message: 'La carpeta debe ser un identificador válido' })
  @Min(1, {
    message: 'La carpeta debe ser un identificador válido',
  })
  folderId?: number;

  @ApiProperty({
    example: 'Reportes 2026',
  })
  @IsString({ message: 'El nombre del archivo debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre del archivo es obligatorio' })
  @MaxLength(255, {
    message: ({ constraints }) =>
      `El nombre del archivo no puede superar los ${constraints[0]} caracteres`,
  })
  @Matches(/^[^\\/:*?"<>|]+$/, {
    message:
      'El nombre del archivo no puede contener los caracteres \\ / : * ? " < > |',
  })
  @NormalizeSpaces()
  name!: string;

  @ApiPropertyOptional({
    type: 'string',
    example: '[{"name":"astronomia"},{"name":"planetas"}]',
  })
  @IsOptional()
  @JsonArray(CreateTagDto)
  @IsArray({ message: 'Las etiquetas deben enviarse en una lista' })
  @ArrayMaxSize(5, {
    message: ({ constraints }) =>
      `No puedes agregar mas de ${constraints[0]} etiquetas al archivo`,
  })
  @UniqueByProperties('name')
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags?: CreateTagDto[];

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @Allow()
  file!: string;
}
