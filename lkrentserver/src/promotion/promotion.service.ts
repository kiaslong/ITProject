import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Promotion } from '@prisma/client';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PromotionService {
  constructor(private prisma: PrismaService, private cloudinaryService: CloudinaryService) {}

  async createPromotion(data: CreatePromotionDto, file?: Express.Multer.File): Promise<Promotion> {
    let imageUrl = null;
    if (file) {
      imageUrl = await this.cloudinaryService.uploadPromotionImage(file);
    }
    return this.prisma.promotion.create({
        data: {
          promoCode: data.promoCode,
          discount: data.discount,
          makeApply: data.makeApply ?? null,
          modelApply: data.modelApply ?? null,
          promotionImageUrl: imageUrl,
        },
      });
    }

  async getPromotions(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany();
  }

  async deletePromotion(id: number): Promise<void> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException(`Promotion with ID ${id} not found`);
    }

    if (promotion.promotionImageUrl) {
      await this.cloudinaryService.deletePromotionImage(promotion.promotionImageUrl);
    }

    await this.prisma.promotion.delete({
      where: { id },
    });
  }
}
