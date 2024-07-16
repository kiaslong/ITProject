import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class SmsService {
  private apiUrl: string;
  private apiKey: string;
  private appID: string;
  private msgID: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
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

  async sendOtp(phoneNumber: string): Promise<string> {
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
        return response.data.pinId;
      } else {
        throw new InternalServerErrorException('Failed to send SMS');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to send SMS');
    }
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
      if (response.status === 200) {
        return response.data.verified;
      } else {
        throw new InternalServerErrorException('Invalid verification code');
      }
    } catch (error) {
      throw new InternalServerErrorException('Failed to verify code');
    }
  }
}
