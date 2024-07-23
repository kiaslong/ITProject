import { Controller, Get, Post, Delete, Body, Param, UseGuards, UploadedFile, UseInterceptors, ParseIntPipe } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Promotion } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Adjust the import path as necessary
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Promotion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('promotion')
export class PromotionController {
  constructor(private readonly promotionService: PromotionService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new promotion' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Promotion data',
    type: CreatePromotionDto,
  })
  @ApiResponse({ status: 201, description: 'The promotion has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @UseInterceptors(FileInterceptor('file'))
  async createPromotion(
    @Body() createPromotionDto: CreatePromotionDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Promotion> {
    return this.promotionService.createPromotion(createPromotionDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all promotions' })
  @ApiResponse({ status: 200, description: 'Successfully retrieved list of promotions.' })
  async getPromotions(): Promise<Promotion[]> {
    return this.promotionService.getPromotions();
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a promotion' })
  @ApiResponse({ status: 200, description: 'The promotion has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Promotion not found.' })
  async deletePromotion(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.promotionService.deletePromotion(id);
  }
}
