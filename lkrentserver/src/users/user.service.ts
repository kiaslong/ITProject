import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        fullName: createUserDto.fullName || "FullName",
        dateOfBirth: createUserDto.dateOfBirth || new Date(),
        role: createUserDto.role || "user",
      },
    });
    return user;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: loginUserDto.phoneNumber },
    });
    if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
      return user;
    }
    return null;
  }

  public async generateToken(user: any): Promise<string> {
    const payload = { phoneNumber: user.phoneNumber, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async validateToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      return { valid: true, decoded };
    } catch (e) {
      return { valid: false };
    }
  }
}
