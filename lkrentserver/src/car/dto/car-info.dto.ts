// src/car/dto/car-info.dto.ts
export class CarFeatureDto {
    id: string;
    icon: string;
    name: string;
  }
  
  export class CarInfoDto {
    id: number;
    make: string;
    model: string;
    year: number;
    isCarVerified: boolean;
    carImages: string[];
    carPapers: string[];
    thumbImage: string;
    transmission: string;
    title: string;
    location: string;
    rating: string;
    trips: string;
    oldPrice: string;
    newPrice: string;
    supportsDelivery: boolean;
    description: string;
    features: CarFeatureDto[];
    ownerId: number;
    numberOfSeats:string;
    fastAcceptBooking: boolean;
    allowApplyPromo: boolean;
    startDateFastBooking: Date | null;
    endDateFastBooking: Date | null;
    fuelConsumption: string;
    licensePlate: string;
    fuelType: string;
  }
  
  export class OwnerDto {
    id: number;
    name: string;
    rating: string;
    trips: string;
    avatar: string;

    responseRate: string;
    approvalRate: string;
    responseTime: string;
  }
  