import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';
import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';

export class LoginDto {
  @ApiProperty({ example: 'user@est.univalle.edu' })
  @IsNotEmpty({ message: 'El identificador es obligatorio' })
  @IsString({ message: 'El identificador debe ser un texto' })
  @NoSpaces()
  @ToLowerCase()
  identifier!: string;

  @ApiProperty({ description: 'Contraseña configurada por el usuario', writeOnly: true })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MaxLength(72, {
    message: ({ constraints }) =>
      `La contraseña no puede superar los ${constraints[0]} caracteres`,
  })
  password!: string;
}
