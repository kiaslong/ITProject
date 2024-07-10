import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, IsNotEmpty, IsDate, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber(null)
  phoneNumber: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false, type: Date })
  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  role?: string;
}
