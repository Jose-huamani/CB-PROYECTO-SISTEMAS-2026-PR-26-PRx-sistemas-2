import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  Length,
  Matches,
} from 'class-validator';

import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';
import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';

export class ConfirmRegisterDto {
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

  @ApiProperty({ example: '123456' })
  @IsNotEmpty({ message: 'El código es obligatorio' })
  @IsString({ message: 'El código debe ser un texto' })
  @Length(6, 6, {
    message: 'El código debe tener exactamente 6 caracteres',
  })
  @Matches(/^\d{6}$/, {
    message: 'El código debe contener solo números',
  })
  code!: string;
}
