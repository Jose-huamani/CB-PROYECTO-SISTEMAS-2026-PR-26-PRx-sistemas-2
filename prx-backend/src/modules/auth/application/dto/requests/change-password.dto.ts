import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '12345Rx*' })
  @IsNotEmpty({ message: 'La contraseña actual es obligatoria' })
  @IsString({ message: 'La contraseña actual debe ser un texto' })
  currentPassword!: string;

  @ApiProperty({ example: '54321Rx*' })
  @IsNotEmpty({ message: 'La nueva contraseña es obligatoria' })
  @IsString({ message: 'La nueva contraseña debe ser un texto' })
  @MinLength(8, {
    message: ({ constraints }) =>
      `La nueva contraseña debe tener al menos ${constraints[0]} caracteres`,
  })
  @MaxLength(72, {
    message: ({ constraints }) =>
      `La nueva contraseña no puede superar los ${constraints[0]} caracteres`,
  })
  @IsStrongPassword(
    {},
    {
      message:
        'La nueva contraseña debe tener mayúscula, minúscula, número y carácter especial',
    },
  )
  newPassword!: string;
}
