import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';
import { UserModule } from './users/user.module';
import { PrismaService } from './prisma/prisma.service';
import { MailerModule } from './mailer/mailer.module';
import { SmsOtpModule } from './sms/sms.module';
import { CarModule } from './car/car.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdminModule } from './admin/admin.module';
import { PromotionModule } from './promotion/promotion.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    CloudinaryModule,
    MailerModule,
    SmsOtpModule,
    CarModule,
    AuthModule,
    AdminModule,
    PromotionModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
