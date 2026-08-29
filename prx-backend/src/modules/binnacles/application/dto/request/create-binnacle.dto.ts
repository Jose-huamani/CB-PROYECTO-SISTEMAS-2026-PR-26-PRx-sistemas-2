import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class CreateBinnacleDto {
  @ApiProperty({ example: 'Mi Bitácora' })
  @IsNotEmpty({ message: 'El título no puede estar vacío' })
  @IsString({ message: 'El título debe ser texto' })
  @MinLength(2, {
    message: ({ constraints }) =>
      `El título debe tener al menos ${constraints[0]} caracteres`,
  })
  @MaxLength(15, {
    message: ({ constraints }) =>
      `El título no puede exceder los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  name!: string;

  @ApiProperty({ example: 'Hoy hice...' })
  @IsNotEmpty({ message: 'El contenido no puede estar vacío' })
  @IsString({ message: 'El contenido debe ser texto' })
  @MinLength(1, {
    message: ({ constraints }) =>
      `El contenido debe tener al menos ${constraints[0]} caracteres`,
  })
  @MaxLength(2000, {
    message: ({ constraints }) =>
      `El contenido no puede exceder los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  content!: string;
}
