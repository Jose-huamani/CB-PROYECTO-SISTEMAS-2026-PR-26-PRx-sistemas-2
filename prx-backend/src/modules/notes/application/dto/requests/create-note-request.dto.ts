import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class CreateNoteRequestDto {
    @ApiProperty({ example: 'Título de la nota' })
    @IsNotEmpty({ message: 'El título es obligatorio' })
    @IsString({ message: 'El título debe ser texto' })
    @MaxLength(150, {
        message: ({ constraints }) =>
            `El título no puede superar los ${constraints[0]} caracteres`,
    })
    @NormalizeSpaces()
    title!: string;

    @ApiProperty({ example: 'Contenido de la nota' })
    @IsNotEmpty({ message: 'El contenido es obligatorio' })
    @IsString({ message: 'El contenido debe ser texto' })
    @NormalizeSpaces()
    @MaxLength(65535, {
        message: ({ constraints }) =>
            `El contenido no puede superar los ${constraints[0]} caracteres`,
    })
    content!: string;

    @ApiPropertyOptional({ description: 'Lista JSON de enlaces web de la nota' })
    @IsOptional()
    @IsString()
    links?: string;
}
