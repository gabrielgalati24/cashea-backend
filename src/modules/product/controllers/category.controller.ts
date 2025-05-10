import { Controller, Get, Post, Body, Query, UseInterceptors, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CategoryService } from '../services/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('product-categories')
@Controller('products/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Categorías obtenidas con éxito' })
  @UseInterceptors(CacheInterceptor)
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.categoryService.findAll({ page, limit });
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Categoría creada con éxito' })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
}
