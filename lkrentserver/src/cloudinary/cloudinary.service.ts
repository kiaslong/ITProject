import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Express } from 'express';

@Injectable()
export class CloudinaryService {
  constructor(@Inject(ConfigService) private readonly configService: ConfigService) {}

  async uploadAvatar(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'profileAvatar' }, 
        (error, result) => {
          if (error) {
            reject(error);
          }
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}
