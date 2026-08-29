import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ToLowerCase } from '@shared/application/decorators/transforms/to-lowercase.decorator';
import { NoSpaces } from '@shared/application/decorators/transforms/no-spaces.decorator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { Type } from 'class-transformer';

export class CreateRepositoryInvitationDto {
  @ApiProperty({
    description: 'Correo electrónico del usuario al que se va a invitar',
    example: 'usuario@email.com',
  })
  @IsNotEmpty({ message: 'El correo electrónico del usuario es obligatorio' })
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
  invitedUserEmail!: string;

  @ApiProperty({
    description: 'ID de la función que cumplirá en el repositorio',
    example: 1,
  })
  @IsNotEmpty({ message: 'El ID de la función es obligatorio' })
  @Type(() => Number)
  @IsInt({ message: 'El ID de la función debe ser un número entero' })
  repositoryFunctionId!: number;

  @ApiPropertyOptional({
    description: 'Mensaje opcional de bienvenida',
    example: '¡Únete a mi repositorio!',
  })
  @IsOptional()
  @IsString({ message: 'El mensaje debe ser un texto' })
  @NormalizeSpaces()
  @MaxLength(2000, {
    message: ({ constraints }) =>
      `El mensaje no puede superar los ${constraints[0]} caracteres`,
  })
  welcomeMessage?: string;
}
