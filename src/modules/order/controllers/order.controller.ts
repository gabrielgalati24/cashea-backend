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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { Roles } from '../../../core/decorators/roles.decorator';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all orders' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Orders retrieved successfully' })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: string,
  ) {
    return this.orderService.findAll({ page, limit, status });
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get orders for a specific user' })
  @ApiResponse({ status: HttpStatus.OK, description: 'User orders retrieved successfully' })
  async findUserOrders(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.orderService.findUserOrders(userId, { page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order retrieved successfully' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.orderService.findOneById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new order' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Order created successfully' })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.orderService.create(createOrderDto);
  }

  @Put(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Update an order' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order updated successfully' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Cancel an order' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Order cancelled successfully' })
  async cancel(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.orderService.cancel(id);
    return { message: 'Order cancelled successfully' };
  }
}
