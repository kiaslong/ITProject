import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule],
  providers: [OrderService,PrismaService],
  controllers: [OrderController]
})
export class OrderModule {}
