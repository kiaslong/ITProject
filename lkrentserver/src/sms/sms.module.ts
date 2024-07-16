import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { SmsOtpController } from './sms-otp.controller';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [SmsOtpController],
  providers: [SmsService],
})
export class SmsOtpModule {}
