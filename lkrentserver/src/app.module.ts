import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { PrismaService } from './prisma/prisma.service';
import { MailerModule } from './mailer/mailer.module';
import { SmsOtpModule } from './sms/sms.module';
import { CarModule } from './car/car.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, MailerModule, SmsOtpModule, CarModule, AuthModule],
  providers: [PrismaService],
})
export class AppModule {}
