import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

import {
  CreateBinnacleLinkDto,
  CreateBinnacleTaskDto,
} from '@modules/binnacles/application/dto/request/create-binnacle.dto';
import { NormalizeSpaces } from '@shared/application/decorators/transforms/normalize-spaces.decorator';

export class UpdateBinnacleDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(15)
  @NormalizeSpaces()
  name!: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(2000)
  @NormalizeSpaces()
  content!: string;

  @ApiProperty({ type: [CreateBinnacleTaskDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateBinnacleTaskDto)
  tasks!: CreateBinnacleTaskDto[];

  @ApiProperty({ type: [CreateBinnacleLinkDto] })
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => CreateBinnacleLinkDto)
  links!: CreateBinnacleLinkDto[];
}
