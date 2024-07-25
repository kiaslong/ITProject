import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, Prisma } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.prisma.order.create({
        data: {
          user: { connect: { id: createOrderDto.userId } },
          car: { connect: { id: createOrderDto.carId } },
          startRentDate: createOrderDto.startRentDate,
          endRentDate: createOrderDto.endRentDate,
          paymentState: createOrderDto.paymentState,
          orderState: createOrderDto.orderState,
          totalPrice: createOrderDto.totalPrice,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrderById(id: number): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
    });
  }

  async updateOrder(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: {
          ...(updateOrderDto.userId && { user: { connect: { id: updateOrderDto.userId } } }),
          ...(updateOrderDto.carId && { car: { connect: { id: updateOrderDto.carId } } }),
          ...(updateOrderDto.startRentDate && { startRentDate: updateOrderDto.startRentDate }),
          ...(updateOrderDto.endRentDate && { endRentDate: updateOrderDto.endRentDate }),
          ...(updateOrderDto.paymentState && { paymentState: updateOrderDto.paymentState }),
          ...(updateOrderDto.orderState && { orderState: updateOrderDto.orderState }),
          ...(updateOrderDto.totalPrice && { totalPrice: updateOrderDto.totalPrice }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to update order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    return this.prisma.order.findMany();
  }
}
