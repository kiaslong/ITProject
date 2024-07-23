import { Injectable, HttpException, HttpStatus, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RequestOtpDto } from './dto/request-otp.dto';
import { MailerService } from '../mailer/mailer.service';
import * as crypto from 'crypto';
import { VerifyPhoneNumberDto } from './dto/verify-phone-number.dto';
import { Prisma } from '@prisma/client';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateDrivingLicenseDetailsDto, UpdateDrivingLicenseDto } from './dto/update-driving-license.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
    private mailerService: MailerService,
  ) {}


  async onModuleInit() {
    // Ensure database connection is established
    await this.prisma.$connect();

    // Ensure Cloudinary is properly configured
    await this.cloudinaryService.initializeCloudinary();

   
  }


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
    const data: any = { ...updateUserProfileDto, gender: updateUserProfileDto.gender || 'Nam' };
    let avatarUploadPromise: Promise<string | undefined> | undefined;
  
    if (file) {
      avatarUploadPromise = this.prisma.user
        .findUnique({
          where: { id: userId },
          select: { avatarUrl: true },
        })
        .then(async (currentUser) => {
          if (currentUser?.avatarUrl) {
            await this.cloudinaryService.deleteAvatarImage(currentUser.avatarUrl);
          }
          return this.cloudinaryService.uploadAvatar(file);
        });
    }
  
    try {
      const [updatedUser, avatarUrl] = await Promise.all([
        this.prisma.user.update({
          where: { id: userId },
          data,
        }),
        avatarUploadPromise,
      ]);
  
      if (avatarUrl) {
        await this.prisma.user.update({
          where: { id: userId },
          data: { avatarUrl },
        });
      }
  
      return { ...updatedUser, avatarUrl: avatarUrl || updatedUser.avatarUrl };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new HttpException(`Database error: ${error.message}`, HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to update profile', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  
  async requestOtp(requestOtpDto: RequestOtpDto, userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { email: requestOtpDto.email },
    });
  
    if (user && user.emailVerified) {
      throw new HttpException('Email is already verified', HttpStatus.BAD_REQUEST);
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // OTP expires in 3 minutes

    await this.prisma.otp.create({
      data: {
        email: requestOtpDto.email,
        otpCode: otp,
        createdTime: new Date(Date.now()),
        expiryTime: expiresAt,
        isVerified: false,
      },
    });

    try {
      await this.mailerService.sendMail(
        requestOtpDto.email,
        'EMAIL VERIFICATION FOR LKRENTAL',
        `Your OTP code for LKRENTAL is ${otp}`,
      );

      return { message: 'OTP sent', expiresAt };
    } catch (error) {
      throw new HttpException('Failed to send OTP', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, userId: number) {
    const otpEntry = await this.prisma.otp.findUnique({
      where: { otpCode: verifyOtpDto.otp },
    });

    if (!otpEntry || otpEntry.email !== verifyOtpDto.email || otpEntry.isVerified) {
      throw new HttpException('Invalid OTP', HttpStatus.BAD_REQUEST);
    }

    if (otpEntry.expiryTime < new Date()) {
      throw new HttpException('OTP expired', HttpStatus.BAD_REQUEST);
    }

    await this.prisma.otp.update({
      where: { id: otpEntry.id },
      data: { isVerified: true },
    });

    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          email: verifyOtpDto.email,
          emailVerified: true,
        },
      });
      return { message: 'OTP verified and email updated' };
    } catch (error) {
      throw new HttpException('Failed to update email verification status', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyPhoneNumberByHand(verifyPhoneNumberDto: VerifyPhoneNumberDto) {
    try {
      const user = await this.prisma.user.update({
        where: { phoneNumber: verifyPhoneNumberDto.phoneNumber },
        data: { phoneNumberVerified: true },
      });
      return { message: 'Phone number verified', user };
    } catch (error) {
      throw new HttpException('Failed to verify phone number', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteUser(userId: number) {
    try {
      const user = await this.prisma.user.delete({
        where: { id: userId },
      });
      return { message: 'User deleted successfully', user };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      throw error;
    }
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const isPasswordValid = await bcrypt.compare(changePasswordDto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Current password is incorrect', HttpStatus.BAD_REQUEST);
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }



  async getDrivingLicensesByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        drivingLicenseUrl: true,
        drivingLicenseFullName: true,
        drivingLicenseDOB: true,
        drivingLicenseNumber: true,
        drivingLicenseExpireDate:true,
        drivingLicenseVerified: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return user;
  }

  async getUnverifiedDrivingLicenses() {
    const unverifiedLicenses = await this.prisma.user.findMany({
      where: { drivingLicenseVerified: false },
      select: {
        id: true,
        drivingLicenseUrl: true,
        drivingLicenseFullName: true,
        drivingLicenseDOB: true,
        drivingLicenseNumber: true,
      },
    });

    return unverifiedLicenses;
  }


  async uploadDrivingLicense(
    userId: number,
    file: Express.Multer.File,
    updateDrivingLicenseDto: UpdateDrivingLicenseDto
  ) {
    if (!file) {
      throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Check if a driving license URL already exists
    if (user.drivingLicenseUrl) {
      // Delete the existing driving license image
      await this.cloudinaryService.deleteDrivingLicenseImage(user.drivingLicenseUrl);
    }

    // Upload the new driving license image
    const licenseUrl = await this.cloudinaryService.uploadDrivingLicense(file);

    const { drivingLicenseFullName, drivingLicenseDOB, drivingLicenseNumber } = updateDrivingLicenseDto;

    // Update user with new driving license information
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        drivingLicenseUrl: licenseUrl,
        drivingLicenseFullName,
        drivingLicenseDOB,
        drivingLicenseNumber,
      },
    });

    return { message: 'Driving license uploaded successfully', licenseUrl };
  }
  

  async updateDrivingLicenseDetails(
    userId: number,
    updateDrivingLicenseDetailsDto: UpdateDrivingLicenseDetailsDto
  ) {
    const { drivingLicenseExpireDate, drivingLicenseVerified } = updateDrivingLicenseDetailsDto;

    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return await this.prisma.user.update({
      where: { id: userId },
      data: {
        drivingLicenseExpireDate:drivingLicenseExpireDate,
        drivingLicenseVerified,
      },
    });
  }

}
