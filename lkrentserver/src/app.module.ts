import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import { PrismaService } from './prisma/prisma.service';
import { MailerModule } from './mailer/mailer.module';
import { SmsOtpModule } from './sms/sms.module';



@Module({
  imports: [ConfigModule.forRoot(), UserModule, MailerModule, SmsOtpModule],
  providers: [PrismaService],
})
export class AppModule {}
