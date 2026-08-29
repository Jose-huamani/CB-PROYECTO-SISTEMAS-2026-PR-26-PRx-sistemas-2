import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogoutDto {
  @ApiProperty({ example: 'refresh-token-jwt' })
  @IsNotEmpty({ message: 'El refresh token es obligatorio' })
  @IsString({ message: 'El refresh token debe ser un texto' })
  refreshToken!: string;
}
