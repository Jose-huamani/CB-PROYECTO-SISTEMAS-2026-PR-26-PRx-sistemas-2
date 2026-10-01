import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class CreateBinnacleTaskDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty({ message: 'El título de la tarea no puede estar vacío' })
  @MaxLength(250)
  title!: string;

  @IsBoolean()
  completed!: boolean;
}

export class CreateBinnacleLinkDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsUrl(
    { protocols: ['http', 'https'], require_protocol: true },
    { message: 'El enlace debe ser una URL válida' },
  )
  @MaxLength(2048)
  url!: string;
}

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

  @ApiProperty({ type: [CreateBinnacleTaskDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateBinnacleTaskDto)
  tasks: CreateBinnacleTaskDto[] = [];

  @ApiProperty({ type: [CreateBinnacleLinkDto], required: false })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateBinnacleLinkDto)
  links: CreateBinnacleLinkDto[] = [];
}
