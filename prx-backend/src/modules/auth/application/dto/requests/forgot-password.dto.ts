import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';
import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';

export class ForgotPasswordDto {
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
}
