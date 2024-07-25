import { Controller, Post, Get, Body, Param, Patch, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      return await this.orderService.createOrder(createOrderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async getOrderById(@Param('id') id: number): Promise<Order> {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Patch(':id')
  async updateOrder(@Param('id') id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    try {
      return await this.orderService.updateOrder(id, updateOrderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }
}
