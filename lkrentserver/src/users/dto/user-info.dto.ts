import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty()
  gender: string;

  @ApiProperty({ required: false, nullable: true })
  avatarUrl?: string;

  @ApiProperty({ required: false, nullable: true })
  email?: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  createdAt: Date; 

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false, nullable: true })
  drivingLicenseUrl?: string;

  @ApiProperty()
  numberOfSuccessRentals: number;

  @ApiProperty()
  rewardPoints: number;

  @ApiProperty()
  drivingLicenseVerified: boolean;

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  phoneNumberVerified: boolean;

  @ApiProperty({ required: false, nullable: true })
  ownerRating?: number;

  @ApiProperty({ required: false, nullable: true })
  ownerTrips?: string;

  @ApiProperty({ required: false, nullable: true })
  ownerBadgeText?: string;

  @ApiProperty({ required: false, nullable: true })
  ownerResponseRate?: string;

  @ApiProperty({ required: false, nullable: true })
  ownerApprovalRate?: string;

  @ApiProperty({ required: false, nullable: true })
  ownerResponseTime?: string;
}
