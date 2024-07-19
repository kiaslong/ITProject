import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

class SelectedFeatureDto {
  @ApiProperty()
  @IsString()
  icon: string;

  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;
}

export class CreateCarDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsBoolean()
  discount: boolean;

  @ApiProperty()
  @IsString()
  promotion: string;

  @ApiProperty()
  @IsNumber()
  discountPercentage: number;

  @ApiProperty()
  @IsString()
  fuel: string;

  @ApiProperty()
  @IsString()
  licensePlate: string;

  @ApiProperty()
  @IsNumber()
  price: number;

  @ApiProperty({ type: [SelectedFeatureDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedFeatureDto)
  selectedFeatures: SelectedFeatureDto[];

  @ApiProperty()
  @IsString()
  selectedMake: string;

  @ApiProperty()
  @IsString()
  selectedModel: string;

  @ApiProperty()
  @IsString()
  selectedSeats: string;

  @ApiProperty()
  @IsString()
  selectedYear: string;

  @ApiProperty()
  @IsString()
  transmission: string;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  fastAcceptBooking?: boolean;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  startDateFastBooking?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  endDateFastBooking?: string;

  @ApiProperty()
  @IsNumber()
  ownerId: number;
}
