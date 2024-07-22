import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Post('login')
  async login(@Body() loginDto: { password: string }) {
    const isValid = await this.adminService.validateAdmin(loginDto.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid admin credentials');
    }
    return this.adminService.loginAdmin("LKAdmin");
  }
}