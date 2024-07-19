import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPhoneNumberDto {
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;
}
