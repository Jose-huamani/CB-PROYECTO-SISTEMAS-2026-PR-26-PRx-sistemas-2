import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  MaxLength,
  IsArray,
  ValidateNested,
  IsEmail,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { CreateTagDto } from '@modules/tags/application/dto/requests/create-tag.dto';
import { SocialNetworkInputDto } from '@modules/profiles/application/dto/requests/social-network-input.dto';

export class CreateProfileRequestDto {
  @ApiProperty({ example: 'Juan' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MaxLength(60, {
    message: ({ constraints }) =>
      `El nombre no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  firstName!: string;

  @ApiProperty({ example: 'Pérez' })
  @IsNotEmpty({ message: 'El apellido es obligatorio' })
  @IsString({ message: 'El apellido debe ser texto' })
  @MaxLength(60, {
    message: ({ constraints }) =>
      `El apellido no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  lastName!: string;

  @ApiProperty({ example: 'García', required: false })
  @IsOptional()
  @IsString({ message: 'El segundo apellido debe ser texto' })
  @MaxLength(60, {
    message: ({ constraints }) =>
      `El segundo apellido no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  secondLastName?: string | null;

  @ApiProperty({ example: 'Soy desarrollador', required: false })
  @IsOptional()
  @IsString({ message: 'La biografía debe ser texto' })
  @MaxLength(500, {
    message: ({ constraints }) =>
      `La biografía no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  biography?: string | null;

  @ApiProperty({ example: '+57 3001234567', required: false })
  @IsOptional()
  @IsString({ message: 'El número de teléfono debe ser texto' })
  @MaxLength(20, {
    message: ({ constraints }) =>
      `El teléfono no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  @Matches(/^[0-9+\s]+$/, { message: 'El teléfono sólo puede contener números, espacios y +' })
  phoneNumber?: string | null;

  @ApiProperty({ example: 1 })
  @IsNotEmpty({ message: 'El código de país es obligatorio' })
  @IsNumber({}, { message: 'El código de país debe ser un número' })
  phoneCodeId!: number;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El país debe ser un número' })
  countryId?: number | null;

  @ApiProperty({ example: 'Cochabamba', required: false })
  @IsOptional()
  @IsString({ message: 'La región debe ser texto' })
  @MaxLength(120, {
    message: ({ constraints }) =>
      `La región no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  regionName?: string | null;

  @ApiProperty({ example: 'Cercado', required: false })
  @IsOptional()
  @IsString({ message: 'La ciudad debe ser texto' })
  @MaxLength(120, {
    message: ({ constraints }) =>
      `La ciudad no puede superar los ${constraints[0]} caracteres`,
  })
  @NormalizeSpaces()
  townName?: string | null;

  @ApiProperty({ example: true })
  @IsNotEmpty({ message: 'isEmailVisible es obligatorio' })
  @IsBoolean({ message: 'isEmailVisible debe ser booleano' })
  isEmailVisible!: boolean;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
  @IsOptional()
  @IsString({ message: 'La URL del avatar debe ser texto' })
  @NormalizeSpaces()
  avatarUrl?: string | null;

  @ApiProperty({ type: [SocialNetworkInputDto], required: false })
  @IsOptional()
  @IsArray({ message: 'Las redes sociales deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => SocialNetworkInputDto)
  socialNetworks?: Array<{
    socialNetworkId: number;
    username: string;
  }>;

  @ApiProperty({ type: [CreateTagDto], required: false })
  @IsOptional()
  @IsArray({ message: 'Las etiquetas deben ser un array' })
  @ValidateNested({ each: true })
  @Type(() => CreateTagDto)
  tags?: CreateTagDto[];
}
