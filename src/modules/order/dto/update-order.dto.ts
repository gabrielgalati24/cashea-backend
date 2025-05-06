import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

export class UpdateOrderDto {
  @ApiProperty({
    enum: OrderStatus,
    example: OrderStatus.PROCESSING,
    description: 'New status of the order',
    required: false,
  })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;

  @ApiProperty({
    example: 'caracas, venezuela',
    description: 'Updated shipping address',
    required: false,
  })
  @IsString()
  @IsOptional()
  shippingAddress?: string;

  @ApiProperty({
    example: 'pi_123456789',
    description: 'Payment intent ID',
    required: false,
  })
  @IsString()
  @IsOptional()
  paymentIntent?: string;
}
