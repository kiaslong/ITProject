import { Injectable, Inject, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);
  private readonly uploadOptions = { folder: 'profileAvatar' };

  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {
    this.initializeCloudinary();
  }

  private initializeCloudinary() {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    if (!file?.buffer) {
      throw new Error('Invalid file provided for upload');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        this.uploadOptions,
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

  async deleteAvatar(avatarUrl: string): Promise<void> {
    if (!avatarUrl) {
      throw new Error('Invalid avatar URL provided for deletion');
    }

    const publicId = this.extractPublicIdFromUrl(avatarUrl);
    if (!publicId) {
      throw new Error('Failed to extract public_id from avatar URL');
    }

    try {
      await cloudinary.uploader.destroy(publicId);
      this.logger.log(`Avatar deleted successfully: ${avatarUrl}`);
    } catch (error) {
      this.logger.error('Error deleting avatar from Cloudinary', error);
      throw error;
    }
  }

  private extractPublicIdFromUrl(url: string): string | null {
    const match = url.match(/profileAvatar\/([^.]+)/);
    return match ? match[0] : null;
  }
}