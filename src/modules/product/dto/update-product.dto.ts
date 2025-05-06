import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsBoolean, IsOptional, Min } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    example: 'xboxs',
    description: 'Name of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    example: 'High-quality wireless headphones with noise cancellation',
    description: 'Detailed description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 199.99,
    description: 'Price of the product',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  price?: number;

  @ApiProperty({
    example: 100,
    description: 'Available stock quantity',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  stock?: number;

  @ApiProperty({
    example: ['Electronics', 'Audio'],
    description: 'Categories the product belongs to',
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiProperty({
    example: true,
    description: 'Whether the product is active',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
