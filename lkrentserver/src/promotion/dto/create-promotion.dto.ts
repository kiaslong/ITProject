import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreatePromotionDto {
  @IsString()
  @ApiProperty()
  promoCode: string;

  @IsString()
  @ApiProperty()
  discount: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  makeApply?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  modelApply?: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  promotionImageUrl?: string;

  @ApiProperty()
  @IsDateString()
  expireDate: Date;
}