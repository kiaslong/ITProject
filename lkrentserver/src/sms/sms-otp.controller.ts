import { Controller, Post, Body, HttpException, HttpStatus, InternalServerErrorException, BadRequestException, UseGuards } from '@nestjs/common';
import { SmsService } from './sms.service';
import { VerifySmsOtpDto } from './dto/verify-sms-otp.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@ApiTags('sms-otp')
@UseGuards(JwtAuthGuard) 
@Controller('sms-otp')
export class SmsOtpController {
  constructor(private readonly smsService: SmsService) {}

  @Post('request')
  async requestOtp(@Body('phoneNumber') phoneNumber: string) {
    try {
      const result = await this.smsService.fetchOrCreateOtp(phoneNumber);
      return {
        success: true,
        pinId: result.pinId,
        createdTime: result.createdTime,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        return {
          success: false,
          message: error.message,
        };
      }
      throw new InternalServerErrorException('Failed to request OTP');
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
