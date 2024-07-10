import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ValidateJwtDto {
  @IsNotEmpty()
  @ApiProperty()
  token: string;
}
