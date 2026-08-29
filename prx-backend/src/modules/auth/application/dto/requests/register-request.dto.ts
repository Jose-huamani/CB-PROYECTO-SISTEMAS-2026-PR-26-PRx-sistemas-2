import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';
import { Slugify } from '@shared/application/decorators/transforms/slugify.decorator';
import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';

export class RegisterRequestDto {
  @ApiProperty({ example: 'user@est.univalle.edu' })
  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail(
    { require_tld: true },
    { message: 'El correo electrónico no es válido' },
  )
  @MaxLength(50, {
    message: ({ constraints }) =>
      `El correo electrónico no puede superar los ${constraints[0]} caracteres`,
  })
  @NoSpaces()
  @ToLowerCase()
  email!: string;

  @ApiProperty({ example: 'user' })
  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
  @IsString({ message: 'El nombre de usuario debe ser un texto' })
  @MaxLength(15, {
    message: ({ constraints }) =>
      `El nombre de usuario no puede superar los ${constraints[0]} caracteres`,
  })
  @Slugify()
  username!: string;

  @ApiProperty({ example: '12345Rx*' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(8, {
    message: ({ constraints }) =>
      `La contraseña debe tener al menos ${constraints[0]} caracteres`,
  })
  @MaxLength(72, {
    message: ({ constraints }) =>
      `La contraseña no puede superar los ${constraints[0]} caracteres`,
  })
  @IsStrongPassword(
    {},
    {
      message:
        'La contraseña debe tener mayúscula, minúscula, número y carácter especial',
    },
  )
  password!: string;
}
