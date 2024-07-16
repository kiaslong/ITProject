import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SmsService {
  private apiUrl: string;
  private apiKey: string;
  private appID: string;
  private msgID: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) {
    this.apiUrl = this.configService.get<string>('INFOBIP_API_URL');
    this.apiKey = this.configService.get<string>('INFOBIP_API_KEY');
    this.appID = this.configService.get<string>('INFOBIP_APP_ID');
    this.msgID = this.configService.get<string>('INFOBIP_MSG_ID');
  }

  private getHeaders() {
    return {
      Authorization: `App ${this.apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async sendOtp(phoneNumber: string): Promise<{ pinId: string; createdTime: Date }> {
    const url = `${this.apiUrl}/2fa/2/pin`;
  
    const payload = {
      applicationId: this.appID,
      messageId: this.msgID,
      from: 'ServiceSMS',
      to: phoneNumber,
    };
  
    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers: this.getHeaders() }),
      );
      if (response.status === 200) {
        const createdTime = new Date();
        await this.prisma.otp.create({
          data: {
            phoneNumber,
            otpCode: response.data.pinId,
            expiryTime: new Date(createdTime.getTime() + 3 * 60000), // 3 minutes later
            createdTime,
            isVerified: false,
          },
        });
        return { pinId: response.data.pinId, createdTime };
      } else {
        throw new InternalServerErrorException('Failed to send SMS');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to send SMS');
    }
  }

  async fetchOrCreateOtp(phoneNumber: string): Promise<{ pinId: string; createdTime: Date }> {
    // Check if the phone number is already verified
    const phoneNumberWithoutPrefix = phoneNumber.replace(/^\+84/, '');
    const userWithPhoneNumber = await this.prisma.user.findFirst({
      where: {
        phoneNumber:phoneNumberWithoutPrefix,
        phoneNumberVerified: true,
      },
    });

    if (userWithPhoneNumber) {
      throw new BadRequestException('Phone number is already verified.');
    }

    // Check if there is an existing valid OTP
    const existingOtp = await this.prisma.otp.findFirst({
      where: {
        phoneNumber,
        isVerified: false,
        expiryTime: {
          gt: new Date(),
        },
      },
    });

    if (existingOtp) {
      return { pinId: existingOtp.otpCode, createdTime: existingOtp.createdTime };
    }

    // No valid OTP found, send a new one
    return this.sendOtp(phoneNumber);
  }
  
  async verifyCode(pinId: string, code: string): Promise<boolean> {
    const url = `${this.apiUrl}/2fa/2/pin/${pinId}/verify`;

    const payload = {
      pin: code,
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post(url, payload, { headers: this.getHeaders() }),
      );
      if (response.status === 200 && response.data.verified) {
        await this.prisma.otp.update({
          where: { otpCode: pinId },
          data: { isVerified: true },
        });

        const otp = await this.prisma.otp.findUnique({
          where: { otpCode: pinId },
        });

        if (otp) {
          const phoneNumberWithoutPrefix = otp.phoneNumber.replace(/^\+84/, '');
          await this.prisma.user.updateMany({
            where: {
              phoneNumber: {
                endsWith: phoneNumberWithoutPrefix,
              },
            },
            data: { phoneNumberVerified: true },
          });
        }

        return true;
      } else {
        throw new InternalServerErrorException('Invalid verification code');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify code');
    }
  }
}
