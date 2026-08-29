import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsArray, IsInt, Min } from 'class-validator';

export class MarkNotificationsAsReadDto {
  @ApiProperty({
    example: [1, 2, 3],
    type: [Number],
  })
  @IsArray({
    message: 'Las notificaciones deben enviarse en una lista',
  })
  @ArrayNotEmpty({
    message: 'Debes enviar al menos una notificación',
  })
  @IsInt({
    each: true,
    message: 'Todos los ids de notificación deben ser números enteros',
  })
  @Min(1, {
    each: true,
    message: 'Todos los ids de notificación deben ser mayores o iguales a 1',
  })
  notificationIds!: number[];
}
