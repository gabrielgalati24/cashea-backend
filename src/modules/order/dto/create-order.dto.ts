import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsArray,
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  Min,
} from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class OrderItemDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the product',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'xbox',
    description: 'Name of the product',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 199.99,
    description: 'Price of the product',
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 2,
    description: 'Quantity of the product',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'ID of the user placing the order',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    type: [OrderItemDto],
    description: 'Array of items in the order',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ApiProperty({
    example: 'caracas, venezuela',
    description: 'Shipping address for the order',
  })
  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PENDING,
    description: 'Status of the order',
    default: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  @IsNotEmpty()
  status: OrderStatus = OrderStatus.PENDING;
}
