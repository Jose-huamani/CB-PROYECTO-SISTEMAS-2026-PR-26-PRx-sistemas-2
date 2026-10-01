import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class UpdateNoteRequestDto {
    @ApiPropertyOptional()
    @IsString({ message: 'El título debe ser texto' })
    @IsNotEmpty({ message: 'El título es obligatorio' })
    @MaxLength(150, { message: 'El título no puede superar los 150 caracteres' })
    @NormalizeSpaces()
    title!: string;

    @ApiPropertyOptional()
    @IsString({ message: 'El contenido debe ser texto' })
    @IsNotEmpty({ message: 'El contenido es obligatorio' })
    @MaxLength(65535, { message: 'El contenido no puede superar los 65535 caracteres' })
    @NormalizeSpaces()
    content!: string;

    @ApiPropertyOptional({ description: 'Lista JSON de tareas de la nota' })
    @IsString({ message: 'La lista de tareas no es válida' })
    @MaxLength(50000, { message: 'La lista de tareas es demasiado extensa' })
    tasks!: string;

    @ApiPropertyOptional({ description: 'Lista JSON de enlaces web de la nota' })
    @IsString({ message: 'La lista de enlaces no es válida' })
    @MaxLength(120000, { message: 'La lista de enlaces es demasiado extensa' })
    links!: string;

    @ApiPropertyOptional({ description: 'IDs separados por coma de archivos que se conservan' })
    @IsOptional()
    @IsString()
    retainedFileIds?: string;
}
