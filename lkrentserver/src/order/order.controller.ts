import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Patch,
  HttpException,
  HttpStatus,
  UseGuards,
  ParseIntPipe,
  Logger,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order, OrderState, PaymentState } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust the import path as necessary

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  private readonly logger = new Logger(OrderController.name);

  constructor(private readonly orderService: OrderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiBody({
    description: 'Order data',
    type: CreateOrderDto,
  })
  @ApiResponse({ status: 201, description: 'The order has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const result = await this.orderService.createOrder(createOrderDto);
      return {
        statusCode: result.statusCode,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      throw new HttpException(
        {
          statusCode: error.getStatus(),
          message: error.message,
        },
        error.getStatus(),
      );
    }
  }

  @Get('pending')
  @ApiOperation({ summary: 'Get all orders with pending payment state' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of pending orders.' })
  async getPendingOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get('completed')
@ApiOperation({ summary: 'Get all orders with completed payment state' })
@ApiResponse({ status: 200, description: 'Successfully retrieved list of completed orders.' })
async getCompletedOrders(): Promise<Order[]> {
  return this.orderService.getAllCompletedOrders();
}

@Get('completed-payments')
@ApiOperation({ summary: 'Get all orders with completed payment state and completed order state' })
@ApiResponse({ status: 200, description: 'Successfully retrieved list of completed orders.' })
async getCompletedPayments(): Promise<Order[]> {
  return this.orderService.getAllOrdersWithCompletedPayment();
}



  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved the order.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  async getOrderById(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }
    return order;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number,
  })
  @ApiBody({
    description: 'Order update data',
    type: UpdateOrderDto,
  })
  @ApiResponse({ status: 200, description: 'The order has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateOrder(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      return await this.orderService.updateOrder(id, updateOrderDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of orders.' })
  async getAllOrders(): Promise<Order[]> {
    return this.orderService.getAllOrders();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders by user ID' })
  @ApiParam({
    name: 'userId',
    description: 'User ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved orders for the user.' })
  @ApiResponse({ status: 404, description: 'Orders not found for the user.' })
  async getOrderByUserId(@Param('userId', ParseIntPipe) userId: number): Promise<Order[]> {
    const orders = await this.orderService.getOrderByUserId(userId);
    if (!orders || orders.length === 0) {
      throw new HttpException('Orders not found for the user', HttpStatus.NOT_FOUND);
    }
    return orders;
  }


  
  @Get('car/:carId')
  @ApiOperation({ summary: 'Get orders by car ID' })
  @ApiParam({
    name: 'carId',
    description: 'Car ID',
    type: Number,
  })
  @ApiResponse({ status: 200, description: 'Successfully retrieved orders for the car.' })
  @ApiResponse({ status: 404, description: 'Orders not found for the car.' })
  async getOrderByCarId(@Param('carId', ParseIntPipe) carId: number): Promise<Order[]> {
    const orders = await this.orderService.getOrderByCarId(carId);
    if (!orders || orders.length === 0) {
      throw new HttpException('Orders not found for the car', HttpStatus.NOT_FOUND);
    }
    return orders;
  }


 

  @Patch(':id/orderState')
  @ApiOperation({ summary: 'Update the order state' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number,
  })
  @ApiBody({
    description: 'New order state',
    type: String,
    examples: {
      a: { summary: 'Example Order State', value: 'CONFIRMED' },
    },
  })

  @ApiResponse({ status: 200, description: 'Successfully updated the order state.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updateOrderState(
    @Param('id', ParseIntPipe) id: number,
    @Body('orderState') orderState: OrderState,
  ): Promise<Order> {
    try {
      return await this.orderService.updateOrderState(id, orderState);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id/paymentState')
  @ApiOperation({ summary: 'Update the payment state' })
  @ApiParam({
    name: 'id',
    description: 'Order ID',
    type: Number,
  })
  @ApiBody({
    description: 'New payment state',
    type: String,
    examples: {
      a: { summary: 'Example Payment State', value: 'COMPLETED' },
    },
  })
  @ApiResponse({ status: 200, description: 'Successfully updated the payment state.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async updatePaymentState(
    @Param('id', ParseIntPipe) id: number,
    @Body('paymentState') paymentState: PaymentState,
  ): Promise<Order> {
    try {
      return await this.orderService.updatePaymentState(id, paymentState);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  
}
