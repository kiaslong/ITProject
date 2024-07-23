import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AdminService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateAdmin(password: string): Promise<boolean> {
    const adminPassword = this.configService.get<string>('ADMIN_PASSWORD');
    return password === adminPassword;
  }

  async loginAdmin(adminId: string) {
    const payload = { sub: adminId, isAdmin: true };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async validateAdminToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      if (!decoded.isAdmin) {
        throw new Error('Not an admin token');
      }
      return { valid: true, decoded };
    } catch (e) {
      return { valid: false };
    }
  }
}
