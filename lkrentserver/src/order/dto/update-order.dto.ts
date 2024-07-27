import { IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentState, OrderState } from './order.enums';

export class UpdateOrderDto {
  @ApiProperty({
    description: 'Payment state of the order',
    enum: PaymentState,
    required: false,
  })
  @IsOptional()
  @IsEnum(PaymentState)
  paymentState?: PaymentState;

  @ApiProperty({
    description: 'Order state of the car rental',
    enum: OrderState,
    required: false,
  })
  @IsOptional()
  @IsEnum(OrderState)
  orderState?: OrderState;
}
