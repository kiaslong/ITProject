import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCarDto } from './dto/create-car.dto';
import { parseRelativeTimeToDate } from './utils/utils.function';

@Injectable()
export class CarService {
  private readonly logger = new Logger(CarService.name);

  constructor(private prisma: PrismaService) {}

  async registerCar(createCarDto: CreateCarDto, avatarUrl: string, imageUrls: string[]) {
    

    const {
      ownerId,
      description,
      discount,
      discountPercentage,
      fuel,
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
      startDateFastBooking,
      endDateFastBooking,
    } = createCarDto;

    const startDate = startDateFastBooking ? parseRelativeTimeToDate(startDateFastBooking) : null;
    const endDate = endDateFastBooking ? parseRelativeTimeToDate(endDateFastBooking) : null;

    const isAllowPromotion = promotion === "Có";

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
        oldPrice: `${price}`,
        newPrice: `${price}`, // Simply set the newPrice to the price for now
        carImages: imageUrls,
        carPapers: imageUrls,
        thumbImage: avatarUrl,
        fuelConsumption: fuel,
        numberOfSeats: selectedSeats,
        title: `${selectedMake} ${selectedModel}`,
        location: location,
        rating: '0', // Default rating
        trips: '0', // Default trips
        supportsDelivery: true, // Default value, adjust as needed
        fastAcceptBooking: !!discount, // Ensure boolean value
        startDateFastBooking: startDate,
        endDateFastBooking: endDate,
        features: selectedFeatures as any, // Storing features as JSON
      },
    });



    return { code: 201, message: 'Car registered successfully' };
  }
}
