import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { Slugify } from '@shared/application/decorators/transforms/slugify.decorator';

export class GetTagsDto {
    @ApiPropertyOptional({
        example: 'astronomia',
        description: 'Texto usado para buscar etiquetas por coincidencia de nombre.',
    })
    @IsOptional()
    @IsString({ message: 'La búsqueda debe ser un texto' })
    @MaxLength(100, {
        message: ({ constraints }) =>
            `La búsqueda no debe superar los ${constraints[0]} caracteres`,
    })
    @NormalizeSpaces()
    @Slugify()
    search?: string;

    @ApiPropertyOptional({
        example: 10,
        description: 'Cantidad máxima de etiquetas a devolver.',
    })
    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: 'El límite debe ser un número entero' })
    @Min(1, {
        message: ({ constraints }) => `El límite mínimo es ${constraints[0]}`,
    })
    @Max(20, {
        message: ({ constraints }) => `El límite máximo es ${constraints[0]}`,
    })
    limit?: number;
}
