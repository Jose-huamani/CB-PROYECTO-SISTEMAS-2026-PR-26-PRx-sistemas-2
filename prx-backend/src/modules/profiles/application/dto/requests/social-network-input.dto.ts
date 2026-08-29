import { ApiProperty } from '@nestjs/swagger';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export class SocialNetworkInputDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty({ message: 'El ID de red social es obligatorio' })
    @IsNumber({}, { message: 'El ID de red social debe ser un número' })
    socialNetworkId!: number;

    @ApiProperty({ example: '@usuario' })
    @IsNotEmpty({ message: 'El usuario de red social es obligatorio' })
    @IsString({ message: 'El usuario debe ser texto' })
    @MaxLength(100, {
        message: ({ constraints }) =>
            `El usuario no puede superar los ${constraints[0]} caracteres`,
    })
    @NormalizeSpaces()
    username!: string;
}
