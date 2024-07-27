import { IsBoolean, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarDto {
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Allow application of promotions' })
  allowApplyPromo?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Support car delivery' })
  supportsDelivery?: boolean;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Enable fast booking acceptance' })
  fastAcceptBooking?: boolean;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: 'Start date for fast booking acceptance' })
  startDateFastBooking?: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiProperty({ description: 'End date for fast booking acceptance' })
  endDateFastBooking?: Date;
}
