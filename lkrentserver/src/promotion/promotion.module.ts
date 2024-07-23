import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionController } from './promotion.controller';
import { PrismaService } from '../prisma/prisma.service'; // Adjust the import path if necessary
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { MulterModule } from '@nestjs/platform-express';
import multer from 'multer';

@Module({
  imports:[ ConfigModule.forRoot(),
    AuthModule,CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),],
  providers: [PromotionService, PrismaService],
  controllers: [PromotionController]
})
export class PromotionModule {}
