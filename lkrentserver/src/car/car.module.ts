import { Module } from '@nestjs/common';
import { CarService } from './car.service';
import { MulterModule } from '@nestjs/platform-express';
import { CarController } from './car.controller';
import { PrismaService } from '../prisma/prisma.service';
import { AuthModule } from '../auth/auth.module';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ConfigModule } from '@nestjs/config';
import * as multer from 'multer';


@Module({
  imports: [ConfigModule.forRoot(),AuthModule,MulterModule.register({
    storage: multer.memoryStorage(), // or any other multer storage configuration
  }),], 
  providers: [CarService, PrismaService,CloudinaryService],
  controllers: [CarController],
})
export class CarModule {}
