import { IsNotEmpty } from 'class-validator';

export class VerifySmsOtpDto {
  @IsNotEmpty()
  pinId: string;

  @IsNotEmpty()
  code: string;
}