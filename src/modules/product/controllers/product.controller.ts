import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpStatus,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { BulkCreateProductDto } from '../dto/bulk-create-product.dto';
import { Roles } from '../../../core/decorators/roles.decorator';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Products retrieved successfully' })
  @UseInterceptors(CacheInterceptor)
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ) {
    return this.productService.findAll({ page, limit, category, search });
  }

  @Get('stats')
  @Roles('admin')
  @ApiOperation({ summary: 'Obtener estadísticas globales de productos' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Estadísticas obtenidas con éxito' })
  @UseInterceptors(CacheInterceptor)
  async getStats() {
    return this.productService.getProductStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product retrieved successfully' })
  @UseInterceptors(CacheInterceptor)
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productService.findOneById(id);
  }

  @Post()
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Product created successfully' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Post('bulk')
  @Roles('admin')
  @ApiOperation({ summary: 'Create multiple products' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Products created successfully' })
  async bulkCreate(@Body() bulkCreateProductDto: BulkCreateProductDto) {
    return this.productService.bulkCreate(bulkCreateProductDto.products);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product updated successfully' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Product deleted successfully' })
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.productService.delete(id);
    return { message: 'Product deleted successfully' };
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Products retrieved successfully' })
  async findByCategory(
    @Param('category') category: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.productService.findByCategory(category, { page, limit });
  }
}
