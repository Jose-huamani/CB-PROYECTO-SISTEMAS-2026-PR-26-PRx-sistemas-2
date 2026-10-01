import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateNoteRequestDto {
    @ApiPropertyOptional()
    @IsString()
    @MinLength(1)
    @MaxLength(150)
    title!: string;

    @ApiPropertyOptional()
    @IsString()
    @MinLength(1)
    content!: string;

    @ApiPropertyOptional({ description: 'Lista JSON de tareas de la nota' })
    @IsString()
    tasks!: string;

    @ApiPropertyOptional({ description: 'Lista JSON de enlaces web de la nota' })
    @IsString()
    links!: string;

    @ApiPropertyOptional({ description: 'IDs separados por coma de archivos que se conservan' })
    @IsOptional()
    @IsString()
    retainedFileIds?: string;
}
