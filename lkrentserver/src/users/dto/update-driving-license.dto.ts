import { IsString, IsOptional,IsBoolean,IsDateString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { APP_FILTER } from '@nestjs/core';

export class UpdateDrivingLicenseDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  drivingLicenseFullName?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  drivingLicenseDOB?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  drivingLicenseNumber?: string;
}


export class UpdateDrivingLicenseDetailsDto {
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    drivingLicenseVerified?: boolean;
    
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsString()
    drivingLicenseExpireDate?: string;
  }