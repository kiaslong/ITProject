import { IsBoolean, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyCarDto {
    
@ApiProperty()
  @IsInt()
  carId: number;
  
  @ApiProperty()
  @IsBoolean()
  isCarVerified: boolean;
}
