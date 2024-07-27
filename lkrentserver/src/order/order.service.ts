import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, Prisma, PaymentState, OrderState } from '@prisma/client';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<{ statusCode: number, message: string, data: Order }> {
    try {
      const order = await this.prisma.order.create({
        data: {
          user: { connect: { id: createOrderDto.userId } },
          car: { connect: { id: createOrderDto.carId } },
          startRentDate: createOrderDto.startRentDate,
          endRentDate: createOrderDto.endRentDate,
          paymentState: createOrderDto.paymentState,
          orderState: createOrderDto.orderState,
          totalPrice: createOrderDto.totalPrice,
          messageFromUser: createOrderDto.messageFromUser,
        },
      });
      
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Order created successfully',
        data: order,
      };
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
          ...(updateOrderDto.paymentState && { paymentState: updateOrderDto.paymentState }),
          ...(updateOrderDto.orderState && { orderState: updateOrderDto.orderState }),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to update order', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePaymentState(id: number, paymentState: PaymentState): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { paymentState },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to update payment state', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateOrderState(id: number, orderState: OrderState): Promise<Order> {
    try {
      return await this.prisma.order.update({
        where: { id },
        data: { orderState },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to update order state', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: { paymentState: PaymentState.PENDING },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to get orders', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrderByUserId(userId: number): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: { userId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to get orders by user ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getOrderByCarId(carId: number): Promise<Order[]> {
    try {
      return await this.prisma.order.findMany({
        where: {
          carId,
          paymentState: {
            in: [PaymentState.COMPLETED],
            
          },
          orderState:{
            in: [OrderState.CONFIRMED],
          }
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to get orders by car ID', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}
