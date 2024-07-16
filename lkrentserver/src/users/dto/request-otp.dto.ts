import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RequestOtpDto {
  @ApiProperty({ description: 'Email address of the user', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
