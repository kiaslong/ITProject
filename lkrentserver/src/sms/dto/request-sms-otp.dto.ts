import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class RequestSmsOtpDto {
  @ApiProperty({ description: 'Phone number to which the OTP will be sent' })
  @IsNotEmpty()
  @IsPhoneNumber("VN")
  phoneNumber: string;
}
