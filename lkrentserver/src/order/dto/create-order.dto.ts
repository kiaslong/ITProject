import { IsNotEmpty, IsNumber, IsString, IsDate, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentState, OrderState } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateOrderDto {
  @ApiProperty({
    description: 'ID of the user placing the order',
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'ID of the car to be rented',
    example: 123,
  })
  @IsNotEmpty()
  @IsNumber()
  carId: number;

  @ApiProperty({
    description: 'Start date of the car rental',
    example: '2024-07-25T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startRentDate: Date;

  @ApiProperty({
    description: 'End date of the car rental',
    example: '2024-07-30T00:00:00.000Z',
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endRentDate: Date;

  @ApiProperty({
    description: 'Total price for the car rental',
    example: '10000',
  })
  @IsNotEmpty()
  @IsString()
  totalPrice: string;

  @ApiProperty({
    description: 'Payment state of the order',
    enum: PaymentState,
  })
  @IsNotEmpty()
  @IsEnum(PaymentState)
  paymentState: PaymentState;

  @ApiProperty({
    description: 'Order state of the car rental',
    enum: OrderState,
  })
  @IsNotEmpty()
  @IsEnum(OrderState)
  orderState: OrderState;

  @ApiProperty({
    description: 'Message from the user',
    example: 'Please prepare the car for early morning pickup.',
  })
  @IsOptional()
  @IsString()
  messageFromUser: string;
}
