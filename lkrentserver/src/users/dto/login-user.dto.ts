import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  password: string;
}
