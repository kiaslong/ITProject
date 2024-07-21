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
    return this.uploadImageToCloudinary(file, 'profileAvatar',{ width: 200, crop: 'scale' });
  }

  async uploadCarImage(file: Express.Multer.File, folder: string): Promise<string> {
    return this.uploadImageToCloudinary(file, folder, { width: 300, crop: 'scale' });
  }

  private async uploadImageToCloudinary(
    file: Express.Multer.File,
    folder: string,
    transformation?: { width: number; crop: string }
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

  async deleteImage(imageUrl: string): Promise<void> {
    if (!imageUrl) {
      throw new Error('Invalid image URL provided for deletion');
    }

    const publicId = this.extractPublicIdFromUrl(imageUrl);
    if (!publicId) {
      throw new Error('Failed to extract public_id from image URL');
    }

    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Image deleted successfully: ${imageUrl}`);
    } catch (error) {
      this.logger.error('Error deleting image from Cloudinary', error);
      throw error;
    }
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/\/([^\/]+)\.[^\/]+$/);
    return match ? match[1] : null;
  }
}
