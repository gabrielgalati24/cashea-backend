import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsArray,
  IsBoolean,
  IsNotEmpty,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    example: 'Wireless Headphones',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'xbox',
    description: 'Detailed description of the product',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    example: 199.99,
    description: 'Price of the product',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 100,
    description: 'Available stock quantity',
  })
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    example: ['Electronics', 'Audio'],
    description: 'Categories the product belongs to',
  })
  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @ApiProperty({
    example: true,
    description: 'Whether the product is active',
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
