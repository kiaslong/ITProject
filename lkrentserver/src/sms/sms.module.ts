import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { SmsService } from './sms.service';
import { SmsOtpController } from './sms-otp.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule,PrismaModule],
  controllers: [SmsOtpController],
  providers: [SmsService],
})
export class SmsOtpModule {}
