import { IsNotEmpty, IsNumber, IsString, IsDate, IsEnum } from 'class-validator';
import { PaymentState, OrderState } from '@prisma/client';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @IsNotEmpty()
  @IsNumber()
  carId: number;

  @IsNotEmpty()
  @IsDate()
  startRentDate: Date;

  @IsNotEmpty()
  @IsDate()
  endRentDate: Date;

  @IsNotEmpty()
  @IsString()
  totalPrice: string;

  @IsNotEmpty()
  @IsEnum(PaymentState)
  paymentState: PaymentState;

  @IsNotEmpty()
  @IsEnum(OrderState)
  orderState: OrderState;
}
