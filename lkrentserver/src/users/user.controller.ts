import { Controller, Post, Body, Put, Param, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserProfileDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiConsumes  } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiBody({ type: CreateUserDto })
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    const token = await this.userService.generateToken(user);
    return { user, token };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiBody({ type: LoginUserDto })
  async login(@Body() loginUserDto: LoginUserDto) {
    const user = await this.userService.validateUser(loginUserDto);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const token = await this.userService.generateToken(user);
    return { user, token };
  }

  @Post('validate-token')
  @ApiOperation({ summary: 'Validate a JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid.' })
  @ApiResponse({ status: 401, description: 'Token is invalid or expired.' })
  async validateToken(@Body('token') token: string) {
    return this.userService.validateToken(token);
  }

  @Put(':id/profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateProfile(
    @Param('id') userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.updateProfile(Number(userId), updateUserProfileDto, file);
  }
}
