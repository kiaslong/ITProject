import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { CarInfoDto, OwnerDto, CarFeatureDto } from './dto/car-info.dto';
import { parseRelativeTimeToDate } from './utils/utils.function';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CarInfoWithOwnerDto } from './dto/car-info-with-owner.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);

  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService
  ){}

  async onModuleInit() {
    await this.prisma.$connect();
    await this.cloudinaryService.initializeCloudinary();
  
  }

  async registerCar(createCarDto: CreateCarDto, avatarUrl: string, imageUrls: {
    front: string;
    left: string;
    right: string;
    back: string;
    registration: string;
  } ) {
    const {
      ownerId,
      description,
      discount,
      discountPercentage,
      fuelType,
      fuelConsumption,
      licensePlate,
      price,
      promotion,
      selectedFeatures,
      selectedMake,
      selectedModel,
      selectedSeats,
      selectedYear,
      transmission,
      location,
      fastAcceptBooking,
      startDateFastBooking,
      endDateFastBooking,
    } = createCarDto;

    const startDate = startDateFastBooking ? parseRelativeTimeToDate(startDateFastBooking) : null;
    const endDate = endDateFastBooking ? parseRelativeTimeToDate(endDateFastBooking) : null;

    const isAllowPromotion = promotion === 'Có';

    const car = await this.prisma.car.create({
      data: {
        ownerId,
        allowDiscount1Week: discount,
        discount1WeekPercent: discountPercentage.toString(),
        allowApplyPromo: isAllowPromotion,
        make: selectedMake,
        model: selectedModel,
        licensePlate: licensePlate,
        year: parseInt(selectedYear),
        transmission: transmission,
        description: description,
        price: `${price}`,
        carImages: [
          imageUrls.front,
          imageUrls.left,
          imageUrls.right,
          imageUrls.back,
         
        ],
        carPapers:  [imageUrls.registration],
        thumbImage: avatarUrl,
        fuelType: fuelType,
        fuelConsumption: fuelConsumption,
        numberOfSeats: selectedSeats,
        title: `${selectedMake} ${selectedModel}`,
        location: location,
        rating: '0', // Default rating
        trips: '0', // Default trips
        supportsDelivery: false, // Default value, adjust as needed
        fastAcceptBooking: fastAcceptBooking, // Ensure boolean value
        startDateFastBooking: startDate,
        endDateFastBooking: endDate,
        features: selectedFeatures as any, // Storing features as JSON
      },
    });

    return { code: 201, message: 'Car registered successfully' };
  }

  private isCarFeatureArray(value: unknown): value is CarFeatureDto[] {
    return (
      Array.isArray(value) &&
      value.every(
        (item) =>
          typeof item === 'object' &&
          'id' in item &&
          'icon' in item &&
          'name' in item
      )
    );
  }

  async getInfo(): Promise<CarInfoDto[]> {
    const cars = await this.prisma.car.findMany({
      include: {
        owner: true,
      },
      where: {
        isCarVerified: false, 
      },
    });

    return cars.map(car => {
      const features: CarFeatureDto[] = this.isCarFeatureArray(car.features)
        ? car.features
        : [];

      return {
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        isCarVerified: car.isCarVerified,
        requireCollateral:car.requireCollateral,
        carImages: car.carImages,
        carPapers: car.carPapers,
        thumbImage: car.thumbImage,
        transmission: car.transmission,
        title: car.title,
        location: car.location,
        rating: car.rating,
        trips: car.trips,
        price: car.price,
        allowDiscount1Week:car.allowDiscount1Week,
        discount1WeekPercent:car.discount1WeekPercent,
        supportsDelivery: car.supportsDelivery,
        description: car.description,
        features: features,
        ownerId: car.ownerId,
        owner: {
          id: car.owner.id,
          name: car.owner.fullName,
          rating: car.owner.ownerRating?.toString() || '0',
          trips: car.owner.ownerTrips || '0',
          avatar: car.owner.avatarUrl,
          phoneNumber:car.owner.phoneNumber,
          responseRate: car.owner.ownerResponseRate,
          approvalRate: car.owner.ownerApprovalRate,
          responseTime: car.owner.ownerResponseTime,
        } as OwnerDto,
        fastAcceptBooking: car.fastAcceptBooking,
        allowApplyPromo: car.allowApplyPromo,
        startDateFastBooking: car.startDateFastBooking,
        endDateFastBooking: car.endDateFastBooking,
        fuelConsumption: car.fuelConsumption,
        licensePlate: car.licensePlate,
        fuelType: car.fuelType,
        numberOfSeats:car.numberOfSeats,
      };
    });
  }

  async getInfoVerified(): Promise<CarInfoDto[]> {
    const cars = await this.prisma.car.findMany({
      include: {
        owner: true,
      },
      where: {
        isCarVerified: true, 
      },
    });

    return cars.map(car => {
      const features: CarFeatureDto[] = this.isCarFeatureArray(car.features)
        ? car.features
        : [];

      return {
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        isCarVerified: car.isCarVerified,
        requireCollateral:car.requireCollateral,
        carImages: car.carImages,
        carPapers: car.carPapers,
        thumbImage: car.thumbImage,
        transmission: car.transmission,
        title: car.title,
        location: car.location,
        rating: car.rating,
        trips: car.trips,
        price: car.price,
        allowDiscount1Week:car.allowDiscount1Week,
        discount1WeekPercent:car.discount1WeekPercent,
        supportsDelivery: car.supportsDelivery,
        description: car.description,
        features: features,
        ownerId: car.ownerId,
        owner: {
          id: car.owner.id,
          name: car.owner.fullName,
          rating: car.owner.ownerRating?.toString() || '0',
          trips: car.owner.ownerTrips || '0',
          avatar: car.owner.avatarUrl,
          phoneNumber:car.owner.phoneNumber,
          responseRate: car.owner.ownerResponseRate,
          approvalRate: car.owner.ownerApprovalRate,
          responseTime: car.owner.ownerResponseTime,
        } as OwnerDto,
        fastAcceptBooking: car.fastAcceptBooking,
        allowApplyPromo: car.allowApplyPromo,
        startDateFastBooking: car.startDateFastBooking,
        endDateFastBooking: car.endDateFastBooking,
        fuelConsumption: car.fuelConsumption,
        licensePlate: car.licensePlate,
        fuelType: car.fuelType,
        numberOfSeats:car.numberOfSeats,
      };
    });
  }

  async getInfoExcludingUser(userId: number, excludeCarIds?: number[]): Promise<CarInfoDto[]> {
    const whereClause: any = {
      ownerId: {
        not: userId,
      },
      isCarVerified: true,
    };
  
    if (excludeCarIds && excludeCarIds.length > 0) {
      whereClause.id = {
        notIn: excludeCarIds,
      };
    }
  
    const cars = await this.prisma.car.findMany({
      where: whereClause,
      include: {
        owner: true,
      },
    });
  
    return cars.map(car => {
      const features: CarFeatureDto[] = this.isCarFeatureArray(car.features)
        ? car.features
        : [];
  
      return {
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        isCarVerified: car.isCarVerified,
        requireCollateral: car.requireCollateral,
        carImages: car.carImages,
        carPapers: car.carPapers,
        thumbImage: car.thumbImage,
        transmission: car.transmission,
        title: car.title,
        location: car.location,
        rating: car.rating,
        trips: car.trips,
        price: car.price,
        allowDiscount1Week: car.allowDiscount1Week,
        discount1WeekPercent: car.discount1WeekPercent,
        supportsDelivery: car.supportsDelivery,
        description: car.description,
        features: features,
        ownerId: car.ownerId,
        owner: {
          id: car.owner.id,
          name: car.owner.fullName,
          rating: car.owner.ownerRating?.toString() || '0',
          trips: car.owner.ownerTrips || '0',
          avatar: car.owner.avatarUrl,
          phoneNumber:car.owner.phoneNumber,
          responseRate: car.owner.ownerResponseRate,
          approvalRate: car.owner.ownerApprovalRate,
          responseTime: car.owner.ownerResponseTime,
        } as OwnerDto,
        fastAcceptBooking: car.fastAcceptBooking,
        allowApplyPromo: car.allowApplyPromo,
        startDateFastBooking: car.startDateFastBooking,
        endDateFastBooking: car.endDateFastBooking,
        fuelConsumption: car.fuelConsumption,
        licensePlate: car.licensePlate,
        fuelType: car.fuelType,
        numberOfSeats: car.numberOfSeats,
      };
    });
  }
  
  async getInfoIncludingUser(userId: number): Promise<CarInfoDto[]> {
    const cars = await this.prisma.car.findMany({
      where: {
        ownerId: userId,
      },
      include: {
        owner: true,
      },
    });
  
    return cars.map(car => {
      const features: CarFeatureDto[] = this.isCarFeatureArray(car.features)
        ? car.features
        : [];
  
      return {
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        isCarVerified: car.isCarVerified,
        requireCollateral:car.requireCollateral,
        carImages: car.carImages,
        carPapers: car.carPapers,
        thumbImage: car.thumbImage,
        transmission: car.transmission,
        title: car.title,
        location: car.location,
        rating: car.rating,
        trips: car.trips,
        price: car.price,
        allowDiscount1Week:car.allowDiscount1Week,
        discount1WeekPercent:car.discount1WeekPercent,
        supportsDelivery: car.supportsDelivery,
        description: car.description,
        features: features,
        ownerId: car.ownerId,
        owner: {
          id: car.owner.id,
          name: car.owner.fullName,
          rating: car.owner.ownerRating?.toString() || '0',
          trips: car.owner.ownerTrips || '0',
          avatar: car.owner.avatarUrl,
          phoneNumber:car.owner.phoneNumber,
          responseRate: car.owner.ownerResponseRate,
          approvalRate: car.owner.ownerApprovalRate,
          responseTime: car.owner.ownerResponseTime,
        } as OwnerDto,
        fastAcceptBooking: car.fastAcceptBooking,
        allowApplyPromo: car.allowApplyPromo,
        startDateFastBooking: car.startDateFastBooking,
        endDateFastBooking: car.endDateFastBooking,
        fuelConsumption: car.fuelConsumption,
        licensePlate: car.licensePlate,
        fuelType: car.fuelType,
        numberOfSeats:car.numberOfSeats
      };
    });
  }


  async verifyCar(carId: number, isCarVerified: boolean): Promise<void> {
    await this.prisma.car.update({
      where: { id: carId },
      data: { isCarVerified },
    });
  }
  
  async deleteCar(carId: number): Promise<{ message: string }> {
    try {
      const car = await this.prisma.car.findUnique({
        where: { id: carId },
        select: { carImages: true, thumbImage: true, carPapers: true, licensePlate: true },
      });

      if (!car) {
        throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
      }

      const imageUrls = [...car.carImages, ...car.carPapers,car.thumbImage];

      for (const imageUrl of imageUrls) {
        if (imageUrl) {
          await this.cloudinaryService.deleteCarImage(imageUrl, car.licensePlate);
        }
      }

     

      await this.prisma.car.delete({
        where: { id: carId },
      });

      this.logger.log(`Car with ID ${carId} deleted successfully.`);
      return { message: 'Car deleted successfully' };
    } catch (error) {
      this.logger.error(`Failed to delete car with ID ${carId}:`, error);
      throw new HttpException('Failed to delete car', HttpStatus.BAD_REQUEST);
    }
  }


  async getCarById(carId: number): Promise<CarInfoWithOwnerDto> {
    const car = await this.prisma.car.findUnique({
      where: { id: carId },
      include: { owner: true },
    });

    if (!car) {
      throw new HttpException('Car not found', HttpStatus.NOT_FOUND);
    }

    const features: CarFeatureDto[] = this.isCarFeatureArray(car.features)
      ? car.features
      : [];

    const carInfo: CarInfoDto = {
      id: car.id,
      make: car.make,
      model: car.model,
      year: car.year,
      isCarVerified: car.isCarVerified,
      requireCollateral: car.requireCollateral,
      carImages: car.carImages,
      carPapers: car.carPapers,
      thumbImage: car.thumbImage,
      transmission: car.transmission,
      title: car.title,
      location: car.location,
      rating: car.rating,
      trips: car.trips,
      price: car.price,
      allowDiscount1Week: car.allowDiscount1Week,
      discount1WeekPercent: car.discount1WeekPercent,
      supportsDelivery: car.supportsDelivery,
      description: car.description,
      features: features,
      ownerId: car.ownerId,
      fastAcceptBooking: car.fastAcceptBooking,
      allowApplyPromo: car.allowApplyPromo,
      startDateFastBooking: car.startDateFastBooking,
      endDateFastBooking: car.endDateFastBooking,
      fuelConsumption: car.fuelConsumption,
      licensePlate: car.licensePlate,
      fuelType: car.fuelType,
      numberOfSeats: car.numberOfSeats,
    };

    const owner: OwnerDto = {
      id: car.owner.id,
      name: car.owner.fullName,
      rating: car.owner.ownerRating?.toString() || '0',
      trips: car.owner.ownerTrips || '0',
      avatar: car.owner.avatarUrl,
      phoneNumber:car.owner.phoneNumber,
      responseRate: car.owner.ownerResponseRate,
      approvalRate: car.owner.ownerApprovalRate,
      responseTime: car.owner.ownerResponseTime,
    };

    return {
      ...carInfo,
      owner,
    };
  }


  async updateCarDetails(carId: number, updateCarDto: UpdateCarDto): Promise<UpdateCarDto> {
    const updatedCar = await this.prisma.car.update({
      where: { id: carId },
      data: {
        ...updateCarDto,
      },
      select: {
        allowApplyPromo: true,
        supportsDelivery: true,
        fastAcceptBooking: true,
        startDateFastBooking: true,
        endDateFastBooking: true,
      },
    });

    return updatedCar;
  }

  

}
