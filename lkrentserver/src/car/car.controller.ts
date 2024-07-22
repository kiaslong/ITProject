import {
  Controller,
  Post,
  Get,
  Body,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
  Logger,
  Query,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarService } from './car.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCarDto } from './dto/create-car.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { VerifyCarDto } from './dto/verify-car.dto';

@ApiTags('car')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('car')
export class CarController {
  private readonly logger = new Logger(CarController.name);

  constructor(
    private readonly carService: CarService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}


  async onModuleInit() {
    // Ensure database connection is established
   

    // Ensure Cloudinary is properly configured
    await this.cloudinaryService.initializeCloudinary();

    console.log('UserService initialized: Database and Cloudinary connections established.');
  }


  @Post('register')
  @ApiOperation({ summary: 'Register a new car' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Car successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseInterceptors(FilesInterceptor('files', 10)) // Adjust the number of files as needed
  async registerCar(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    try {
      this.logger.log(`Received body: ${JSON.stringify(body)}`);
      this.logger.log(`Received files: ${files.map((file) => file.originalname).join(', ')}`);

      // Parse the selectedFeatures from JSON string to array
      if (body.selectedFeatures) {
        body.selectedFeatures = JSON.parse(body.selectedFeatures);
      }

      // Convert other fields to correct types
      body.ownerId = parseInt(body.ownerId, 10);
      body.price = parseInt(body.price, 10);
      body.discount = body.discount === 'true';
      body.fastAcceptBooking = body.fastAcceptBooking === 'true';
      body.discountPercentage = parseInt(body.discountPercentage, 10);

      // Validate the body against the DTO
      const createCarDto = plainToClass(CreateCarDto, body);
      const errors = await validate(createCarDto);
      if (errors.length > 0) {
        this.logger.error('Validation failed:', errors);
        throw new HttpException({ message: 'Validation failed', errors }, HttpStatus.BAD_REQUEST);
      }

      const carId = body.licensePlate; // Use licensePlate or generate a unique ID
      const folder = `car/${carId}`;

      // Map to keep track of the URLs
      const imageUrls = new Map<string, string>();

      // Define the expected file names
      const expectedFileNames = ['avatar', 'front', 'left', 'right', 'back', 'registration'];

      // Upload files to Cloudinary and store the URLs in the map
      for (const file of files) {
        const fileName = expectedFileNames.find((name) => file.originalname.includes(name));
        if (fileName) {
          const url = await this.cloudinaryService.uploadCarImage(file, folder);
          imageUrls.set(fileName, url);
          this.logger.log(`${fileName} uploaded: ${url}`);
        }
      }

      // Validate that all expected files have been uploaded
      for (const fileName of expectedFileNames) {
        if (!imageUrls.has(fileName)) {
          throw new HttpException(`Missing ${fileName} file`, HttpStatus.BAD_REQUEST);
        }
      }

      // Call the service method to register the car with parsed data and URLs
      const car = await this.carService.registerCar(createCarDto, imageUrls.get('avatar'), {
        front: imageUrls.get('front'),
        left: imageUrls.get('left'),
        right: imageUrls.get('right'),
        back: imageUrls.get('back'),
        registration: imageUrls.get('registration'),
      });
      this.logger.log('Car registered successfully:', car);

      return {
        message: 'Car registered successfully',
        car,
      };
    } catch (error) {
      this.logger.error('Error registering car:', error.message);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('info')
  @ApiOperation({ summary: 'Get information about all cars' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved car information.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getInfo() {
    try {
      const carInfo = await this.carService.getInfo();
     
      return carInfo;
    } catch (error) {
      this.logger.error('Error retrieving car information:', error.message);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }


  @Get('info-verified')
  @ApiOperation({ summary: 'Get information about all cars' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved car information.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getInfoVeified() {
    try {
      const carInfo = await this.carService.getInfoVerified();
     
      return carInfo;
    } catch (error) {
      this.logger.error('Error retrieving car information:', error.message);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('info-exclude-user')
  @ApiOperation({ summary: 'Get information about all cars excluding those owned by a specific user' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved car information excluding specific user.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getInfoExcludingUser(@Query('userId') userId: string) {
    try {
      const carInfo = await this.carService.getInfoExcludingUser(parseInt(userId, 10));
      return carInfo;
    } catch (error) {
      this.logger.error('Error retrieving car information:', error.message);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  @Get('info-include-user')
@ApiOperation({ summary: 'Get information about all cars including those owned by a specific user' })
@ApiResponse({ status: 200, description: 'Successfully retrieved car information including specific user.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
async getInfoIncludingUser(@Query('userId') userId: string) {
  try {
    const carInfo = await this.carService.getInfoIncludingUser(parseInt(userId, 10));
    return carInfo;
  } catch (error) {
    this.logger.error('Error retrieving car information:', error.message);
    throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
  }
}


@Patch('verify')
@ApiOperation({ summary: 'Verify a car' })
@ApiResponse({ status: 200, description: 'Car successfully verified.' })
@ApiResponse({ status: 400, description: 'Bad Request.' })
@ApiResponse({ status: 401, description: 'Unauthorized.' })
async verifyCar(@Body() verifyCarDto: VerifyCarDto) {
  try {
    const errors = await validate(verifyCarDto);
    if (errors.length > 0) {
      this.logger.error('Validation failed:', errors);
      throw new HttpException({ message: 'Validation failed', errors }, HttpStatus.BAD_REQUEST);
    }

    await this.carService.verifyCar(verifyCarDto.carId, verifyCarDto.isCarVerified);
    this.logger.log(`Car ${verifyCarDto.carId} verification status set to ${verifyCarDto.isCarVerified}`);

    return { message: 'Car successfully verified' };
  } catch (error) {
    this.logger.error('Error verifying car:', error.message);
    throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
  }
}


}
