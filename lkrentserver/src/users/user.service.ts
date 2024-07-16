import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { MailerService } from '../mailer/mailer.service';
import * as crypto from 'crypto';

@Injectable()
export class UserService {
  private otps: Map<string, { otp: string; expiresAt: Date }> = new Map();

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private cloudinaryService: CloudinaryService,
    private mailerService: MailerService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserDto.password, salt);
    const user = await this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
        fullName: createUserDto.fullName || 'FullName',
        dateOfBirth: createUserDto.dateOfBirth || new Date(),
      },
    });
    return user;
  }

  async validateUser(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { phoneNumber: loginUserDto.phoneNumber },
    });
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
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

  async getUserInfo(userId: number) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateProfile(
    userId: number,
    updateUserProfileDto: UpdateUserProfileDto,
    file?: Express.Multer.File,
  ) {
    let avatarUrl: string | undefined;
    if (file) {
      avatarUrl = await this.cloudinaryService.uploadAvatar(file);
    }

    const data: any = { ...updateUserProfileDto };
    if (avatarUrl) {
      data.avatarUrl = avatarUrl;
    }

    // Set default gender to 'Nam' if not provided
    data.gender = data.gender || 'Nam';

    try {
      return this.prisma.user.update({
        where: { id: userId },
        data,
      });
    } catch (error) {
      throw new HttpException('Failed to update profile', HttpStatus.BAD_REQUEST);
    }
  }

  async requestOtp(requestOtpDto: RequestOtpDto) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

    this.otps.set(requestOtpDto.email, { otp, expiresAt });

    try {
      await this.mailerService.sendMail(
        requestOtpDto.email,
        'Your OTP Code',
        `Your OTP code is ${otp}`,
      );

      return { message: 'OTP sent', expiresAt };
    } catch (error) {
      throw new HttpException('Failed to send OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto) {
    const otpEntry = this.otps.get(verifyOtpDto.email);

    if (!otpEntry || otpEntry.otp !== verifyOtpDto.otp) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    if (otpEntry.expiresAt < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    this.otps.delete(verifyOtpDto.email);

    return { message: 'OTP verified' };
  }

  
}
