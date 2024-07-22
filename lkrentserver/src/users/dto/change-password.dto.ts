import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({
    description: 'The current password of the user',
    example: 'currentPassword123',
  })
  currentPassword: string;

  @ApiProperty({
    description: 'The new password that the user wants to set',
    example: 'newPassword456',
  })
  newPassword: string;
}
