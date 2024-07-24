import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Promotion } from '@prisma/client';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class PromotionService {
  private readonly logger = new Logger(PromotionService.name);

  constructor(
    private prisma: PrismaService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async createPromotion(
    data: CreatePromotionDto,
    file?: Express.Multer.File,
  ): Promise<Promotion> {
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
        expireDate: new Date(data.expireDate),
        promotionImageUrl: imageUrl,
      },
    });
  }

  async getPromotions(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany();
  }

  async getExpiredPromotions(currentDate: Date): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: {
        expireDate: { lte: currentDate },
      },
    });
  }

  async deletePromotion(id: number): Promise<void> {
    const promotion = await this.prisma.promotion.findUnique({
      where: { id },
    });

    if (!promotion) {
      this.logger.warn(`Promotion with ID ${id} not found during deletion attempt`);
      return;
    }

    if (promotion.promotionImageUrl) {
      await this.cloudinaryService.deletePromotionImage(promotion.promotionImageUrl);
    }

    try {
      await this.prisma.promotion.delete({
        where: { id },
      });
      this.logger.debug(`Deleted promotion with ID ${id}`);
    } catch (error) {
      if (error.code === 'P2025') {
        this.logger.warn(`Promotion with ID ${id} was already deleted`);
      } else {
        this.logger.error(`Failed to delete promotion with ID ${id}: ${error.message}`);
        throw error;
      }
    }
  }
}
