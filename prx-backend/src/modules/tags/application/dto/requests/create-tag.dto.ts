import { ApiProperty } from '@nestjs/swagger';
import { Slugify } from '@shared/application/decorators/transforms/slugify.decorator';
import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({
    example: 'planetas',
  })
  @IsString({ message: 'El nombre de la etiqueta debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre de la etiqueta es obligatorio' })
  @MaxLength(25, {
    message: ({ constraints }) =>
      `El nombre de la etiqueta no puede superar los ${constraints[0]} caracteres`,
  })
  @Slugify()
  name!: string;
}
