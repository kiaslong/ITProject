import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { MulterModule } from '@nestjs/platform-express';
import { CarController } from './car.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import * as multer from 'multer';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    CloudinaryModule,
    MulterModule.register({
      storage: multer.memoryStorage(),
    }),
  ],
  providers: [CarService, PrismaService],
  controllers: [CarController],
})
export class CarModule {}