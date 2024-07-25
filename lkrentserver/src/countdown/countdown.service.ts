import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PromotionService } from '../promotion/promotion.service';

@Injectable()
export class CountdownService implements OnModuleInit {
  private readonly logger = new Logger(CountdownService.name);
  private isRunning = false;

  constructor(private promotionService: PromotionService) {}

  onModuleInit() {
    this.logger.debug('CountdownService initialized');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    if (this.isRunning) {
      this.logger.warn('Hourly promotion expiration check is already running');
      return;
    }

    this.isRunning = true;
    this.logger.debug('Running hourly promotion expiration check');

    try {
      await this.deleteExpiredPromotions();
    } finally {
      this.isRunning = false;
    }
  }

  async deleteExpiredPromotions() {
    const now = new Date();
    const expiredPromotions = await this.promotionService.getExpiredPromotions(now);

    const deletePromises = expiredPromotions.map(async (promotion) => {
      try {
        await this.promotionService.deletePromotion(promotion.id);
        this.logger.debug(`Deleted promotion with ID ${promotion.id}`);
      } catch (error) {
        if (error instanceof NotFoundException) {
          this.logger.warn(`Promotion with ID ${promotion.id} was already deleted`);
        } else {
          this.logger.error(`Failed to delete promotion with ID ${promotion.id}: ${error.message}`);
        }
      }
    });

    await Promise.all(deletePromises);
    this.logger.debug(`Attempted to delete ${expiredPromotions.length} expired promotions`);
  }
}
