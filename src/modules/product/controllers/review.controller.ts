import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service';
import { CreateReviewDto } from '../dto/create-review.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('product-reviews')
@Controller('products/:productId/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener reseñas de un producto' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Reseñas obtenidas con éxito' })
  @UseInterceptors(CacheInterceptor)
  async findByProductId(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewService.findByProductId(productId, { page, limit });
  }

  @Post()
  @Roles('user')
  @ApiOperation({ summary: 'Crear una reseña para un producto' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Reseña creada con éxito' })
  async create(
    @Param('productId', new ParseUUIDPipe()) productId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewService.create(productId, createReviewDto);
  }
}
