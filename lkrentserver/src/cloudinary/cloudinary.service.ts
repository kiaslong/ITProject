import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.initializeCloudinary();
  }

  public async initializeCloudinary() {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    return this.uploadImageToCloudinary(file, 'profileAvatar', { width: 200, crop: 'scale',quality:'auto:best',fetch_format:'auto'});
  }

  async uploadCarImage(file: Express.Multer.File, folder: string): Promise<string> {
    return this.uploadImageToCloudinary(file, folder, { width: 350, crop: 'scale',quality:'auto:best',fetch_format:'auto' });
  }
  
  async uploadPromotionImage(file: Express.Multer.File): Promise<string> {
    return this.uploadImageToCloudinary(file, 'promotionImages', { width: 350, crop: 'scale',quality:'auto:best',fetch_format:'auto' });
  }

  async uploadDrivingLicense(file: Express.Multer.File): Promise<string> {
    return this.uploadImageToCloudinary(file, 'drivingLicenses', { width: 500, crop: 'scale',quality:'auto:best',fetch_format:'auto'});
  }

  private async uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: string,
    transformation?: { width: number; crop: string ,quality:string,fetch_format:string}
  ): Promise<string> {
    if (!file?.buffer) {
      throw new Error('Invalid file provided for upload');
    }

    return new Promise((resolve, reject) => {
      const uploadOptions: any = { folder };
      if (transformation) {
        uploadOptions.transformation = transformation;
      }

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error: any, result: UploadApiResponse) => {
          if (error) {
            this.logger.error('Error uploading file to Cloudinary', error);
            reject(error);
          } else {
            this.logger.log(`File uploaded successfully: ${result.secure_url}`);
            resolve(result.secure_url);
          }
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async deleteAvatarImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new Error('Invalid image URL provided for deletion');
    }

    const publicId = this.constructPublicIdForAvatar(imageUrl);
    if (!publicId) {
      throw new Error('Failed to extract public_id from image URL');
    }

    this.logger.log(`Deleting avatar image with publicId: ${publicId}`); // Log the publicId before deletion

    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Avatar image deleted successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error('Error deleting avatar image from Cloudinary', error);
      throw error;
    }
  }

  async deleteCarImage(imageUrl: string, licensePlate: string): Promise<void> {
    if (!imageUrl) {
      throw new Error('Invalid image URL provided for deletion');
    }

    const publicId = this.constructPublicIdForCar(licensePlate, imageUrl);
    if (!publicId) {
      throw new Error('Failed to construct public_id from image URL');
    }

    this.logger.log(`Deleting car image with publicId: ${publicId}`); // Log the publicId before deletion

    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Car image deleted successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error('Error deleting car image from Cloudinary', error);
      throw error;
    }
  }

  async deletePromotionImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new Error('Invalid image URL provided for deletion');
    }

    const publicId = this.constructPublicIdForPromotion(imageUrl);
    if (!publicId) {
      throw new Error('Failed to extract public_id from image URL');
    }

    this.logger.log(`Deleting promotion image with publicId: ${publicId}`); // Log the publicId before deletion

    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Promotion image deleted successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error('Error deleting promotion image from Cloudinary', error);
      throw error;
    }
  }

  async deleteDrivingLicenseImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new Error('Invalid image URL provided for deletion');
    }

    const publicId = this.constructPublicIdForDrivingLicense(imageUrl);
    if (!publicId) {
      throw new Error('Failed to extract public_id from image URL');
    }

    this.logger.log(`Deleting driving license image with publicId: ${publicId}`); // Log the publicId before deletion

    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Driving license image deleted successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error('Error deleting driving license image from Cloudinary', error);
      throw error;
    }
  }

  private constructPublicIdForAvatar(imageUrl: string): string | null {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    return publicId ? `profileAvatar/${publicId}` : null;
  }

  private constructPublicIdForCar(licensePlate: string, imageUrl: string): string | null {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    return publicId ? `car/${licensePlate}/${publicId}` : null;
  }

  private constructPublicIdForPromotion(imageUrl: string): string | null {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    return publicId ? `promotionImages/${publicId}` : null;
  }

  private constructPublicIdForDrivingLicense(imageUrl: string): string | null {
    const publicId = this.extractPublicIdFromUrl(imageUrl);
    return publicId ? `drivingLicenses/${publicId}` : null;
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/([^\/]+)\.[^\/]+$/);
    return match ? match[1] : null;
  }
}
