import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ required: false })
  fullName?: string;

  @IsOptional()
  @IsDateString()
  @ApiProperty({ required: false })
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @IsIn(['Nam', 'Nữ'])
  @ApiProperty({ required: false })
  gender?: string;
}
