import { Controller, Post, Body, UseGuards, UseInterceptors, UploadedFiles, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CarService } from './car.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCarDto } from './dto/create-car.dto';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@ApiTags('car')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('car')
export class CarController {
  private readonly logger = new Logger(CarController.name);

  constructor(
    private readonly carService: CarService,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new car' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Car successfully registered.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @UseInterceptors(FilesInterceptor('files', 10)) // Adjust the number of files as needed
  async registerCar(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    try {
      this.logger.log('Received body:', JSON.stringify(body));
      this.logger.log('Received files:', files.map(file => file.originalname));

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

      const avatarUrl = await this.cloudinaryService.uploadAvatar(files[0]);
      const imageUrls = await Promise.all(files.slice(1).map(file => this.cloudinaryService.uploadCarImage(file, folder)));

      this.logger.log(`Avatar uploaded: ${avatarUrl}`);
      this.logger.log('Car images uploaded:', imageUrls);

      // Call the service method to register the car with parsed data
      const car = await this.carService.registerCar(createCarDto, avatarUrl, imageUrls);
      this.logger.log('Car registered successfully:', car);

      return {
        message: 'Car registered successfully',
        car,
      };
    } catch (error) {
      this.logger.error('Error registering car:', error);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
