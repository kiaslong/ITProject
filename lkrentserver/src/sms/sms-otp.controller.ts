import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { SmsService } from './sms.service';
import { RequestSmsOtpDto } from './dto/request-sms-otp.dto';
import { VerifySmsOtpDto } from './dto/verify-sms-otp.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('sms-otp')
@Controller('sms-otp')
export class SmsOtpController {
  constructor(private readonly smsService: SmsService) {}

  @Post('request')
  @ApiOperation({ summary: 'Request OTP for SMS verification' })
  @ApiResponse({ status: 201, description: 'OTP successfully sent.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: RequestSmsOtpDto })
  async requestOtp(@Body() requestSmsOtpDto: RequestSmsOtpDto) {
    try {
      const pinId = await this.smsService.sendOtp(requestSmsOtpDto.phoneNumber);
      return { message: 'OTP sent', pinId };
    } catch (error) {
      throw new HttpException('Failed to send OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Verify OTP for SMS' })
  @ApiResponse({ status: 200, description: 'OTP successfully verified.' })
  @ApiResponse({ status: 400, description: 'Invalid OTP.' })
  @ApiBody({ type: VerifySmsOtpDto })
  async verifyOtp(@Body() verifySmsOtpDto: VerifySmsOtpDto) {
    try {
      const isVerified = await this.smsService.verifyCode(verifySmsOtpDto.pinId, verifySmsOtpDto.code);
      if (isVerified) {
        return { message: 'OTP verified' };
      } else {
        return { message: 'Invalid OTP' };
      }
    } catch (error) {
      throw new HttpException('Failed to verify OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
