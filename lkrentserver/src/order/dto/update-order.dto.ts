import { IsOptional, IsNumber, IsString, IsDate, IsEnum } from 'class-validator';
import { PaymentState, OrderState } from '@prisma/client';

export class UpdateOrderDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsOptional()
  @IsNumber()
  carId?: number;

  @IsOptional()
  @IsDate()
  startRentDate?: Date;

  @IsOptional()
  @IsDate()
  endRentDate?: Date;

  @IsOptional()
  @IsString()
  totalPrice?: string;

  @IsOptional()
  @IsEnum(PaymentState)
  paymentState?: PaymentState;

  @IsOptional()
  @IsEnum(OrderState)
  orderState?: OrderState;
}
