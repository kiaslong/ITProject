import { Controller, Post, Get, Body, Param, Patch, HttpException, HttpStatus, UseGuards, ParseIntPipe,Logger} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from '@prisma/client';
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
      throw new HttpException({
        statusCode: error.getStatus(),
        message: error.message,
      }, error.getStatus());
    }
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
  async updateOrder(@Param('id', ParseIntPipe) id: number, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
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
}
