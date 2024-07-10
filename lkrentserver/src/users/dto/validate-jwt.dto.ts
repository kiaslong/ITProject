import { IsNotEmpty } from 'class-validator';

export class ValidateJwtDto {
  @IsNotEmpty()
  token: string;
}
