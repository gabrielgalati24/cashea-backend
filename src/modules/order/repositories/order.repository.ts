import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { UpdateOrderDto } from '../dto/update-order.dto';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async findAll(options?: {
    skip?: number;
    take?: number;
    status?: OrderStatus;
  }): Promise<[Order[], number]> {
    const query = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user');

    if (options?.status) {
      query.where('order.status = :status', { status: options.status });
    }

    query.orderBy('order.createdAt', 'DESC').skip(options?.skip).take(options?.take);

    return query.getManyAndCount();
  }

  async findOneById(id: string): Promise<Order | null> {
    return this.orderRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findUserOrders(
    userId: string,
    options?: { skip?: number; take?: number },
  ): Promise<[Order[], number]> {
    return this.orderRepository.findAndCount({
      where: { userId },
      relations: ['user'],
      skip: options?.skip,
      take: options?.take,
      order: { createdAt: 'DESC' },
    });
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order | null> {
    const order = await this.findOneById(id);
    if (!order) {
      return null;
    }

    const updatedOrder = this.orderRepository.merge(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  async delete(id: string): Promise<void> {
    await this.orderRepository.softDelete({ id });
  }
}
