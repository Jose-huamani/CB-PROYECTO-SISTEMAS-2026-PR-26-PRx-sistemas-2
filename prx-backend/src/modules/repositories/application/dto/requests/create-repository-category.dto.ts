import { ApiProperty } from '@nestjs/swagger';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { ToUpperCase } from '@shared/application/decorators/transforms/to-uppercase.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRepositoryCategoryDto {
  @ApiProperty({
    example: 'CIENCIA',
  })
  @IsString({ message: 'El nombre de la categoria debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la categoria es obligatorio' })
  @MinLength(2, {
    message: ({ constraints }) =>
      `El nombre de la categoria debe tener al menos ${constraints[0]} caracteres`,
  })
  @MaxLength(50, {
    message: ({ constraints }) =>
      `El nombre de la categoria no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  @ToUpperCase()
  name!: string;
}
