export class CreateUserDto {
  email?: string;
  phoneNumber: string;
  password: string;
  fullName?: string;
  dateOfBirth?: Date;
  avatarUrl?: string;
  role?: string;
}
