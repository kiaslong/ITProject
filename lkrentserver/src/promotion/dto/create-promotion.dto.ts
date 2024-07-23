import { ApiProperty } from '@nestjs/swagger';

export class CreatePromotionDto {
  @ApiProperty({
    description: 'The unique promo code for the promotion',
    example: 'SAVE20',
  })
  promoCode: string;

  @ApiProperty({
    description: 'The discount amount or percentage',
    example: '20%',
  })
  discount: string;

  @ApiProperty({
    description: 'The make of the car this promotion applies to',
    example: 'Toyota',
    required: false,
  })
  makeApply?: string;

  @ApiProperty({
    description: 'The model of the car this promotion applies to',
    example: 'Camry',
    required: false,
  })
  modelApply?: string;

  @ApiProperty({
    description: 'The URL of the promotion image',
    example: 'http://example.com/promo.jpg',
    required: false,
  })
  promotionImageUrl?: string;
}
