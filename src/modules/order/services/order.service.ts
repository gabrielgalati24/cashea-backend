import { Injectable, NotFoundException, Inject, Logger } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';
import { OrderRepository } from '../repositories/order.repository';
import { Order, OrderStatus } from '../entities/order.entity';
import { ClientProxy, MessagePattern, Payload } from '@nestjs/microservices';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject('EVENT_BUS') private readonly eventBusClient: ClientProxy,
  ) {}

  async findAll(options?: { page?: number; limit?: number; status?: string }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    return this.orderRepository.findAll({
      skip,
      take: limit,
      status: options?.status as OrderStatus,
    });
  }

  async findOneById(id: string): Promise<Order> {
    const order = await this.orderRepository.findOneById(id);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async findUserOrders(userId: string, options?: { page?: number; limit?: number }) {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const skip = (page - 1) * limit;

    return this.orderRepository.findUserOrders(userId, { skip, take: limit });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const totalAmount = createOrderDto.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderData = {
      userId: createOrderDto.userId,
      items: createOrderDto.items,
      shippingAddress: createOrderDto.shippingAddress,
      status: createOrderDto.status,
      totalAmount: totalAmount,
    };

    const newOrder = await this.orderRepository.create(orderData);

    this.logger.log(`Order created: ${newOrder.id}. Emitting event...`);
    this.eventBusClient.emit('order_created_send_email', {
      orderId: newOrder.id,
      userId: newOrder.userId,
      totalAmount: newOrder.totalAmount,
    });

    return newOrder;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.orderRepository.update(id, updateOrderDto);
    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" not found`);
    }
    return order;
  }

  async cancel(id: string): Promise<void> {
    const order = await this.findOneById(id);
    if (order.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel a delivered order');
    }
    await this.orderRepository.update(id, { status: OrderStatus.CANCELLED });
  }

  @MessagePattern('order_created_send_email')
  async handleOrderCreatedEmail(
    @Payload() data: { orderId: string; userId: string; totalAmount: number },
  ) {
    this.logger.log(`Received 'order_created_send_email' event for order ${data.orderId}`);
    this.logger.log(`Simulating email sending to user related to order ${data.orderId}...`);
  }
}
