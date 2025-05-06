import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateProductDto } from './create-product.dto';

export class BulkCreateProductDto {
  @ApiProperty({
    type: [CreateProductDto],
    description: 'Array of products to create',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductDto)
  products: CreateProductDto[];
}
