import type { PrismaClient } from "@prisma/client";
import type { IRevenueRepository } from "@/features/financial/domain/repositories/IRevenueRepository";
import type { Revenue } from "@/features/financial/domain/entities/Revenue";
import { RevenueMapper } from "@/features/financial/infrastructure/mappers/RevenueMapper";

export class PrismaRevenueRepository implements IRevenueRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(revenue: Revenue): Promise<Revenue> {
    const data = revenue.toPrimitives();

    const saved = await this.prisma.revenue.create({
      data: {
        organizationId: data.organizationId,
        amount: data.amount,
        description: data.description,
        status: data.status,
        dueDate: data.dueDate,
        receivedAt: data.receivedAt,
        categoryId: data.categoryId,
        customerId: data.customerId,
        createdBy: data.createdBy,
      },
    });

    return RevenueMapper.toDomain(saved);
  }

  async listByOrganization(organizationId: string): Promise<Revenue[]> {
    const revenues = await this.prisma.revenue.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: { dueDate: "desc" },
    });

    return revenues.map((revenue) => RevenueMapper.toDomain(revenue));
  }

  async findById(id: string, organizationId: string): Promise<Revenue | null> {
    const revenue = await this.prisma.revenue.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    return revenue ? RevenueMapper.toDomain(revenue) : null;
  }

  async update(revenue: Revenue): Promise<Revenue> {
    const data = revenue.toPrimitives();

    if (!data.id) {
      throw new Error("Revenue ID is required for update");
    }

    const updated = await this.prisma.revenue.update({
      where: { id: data.id },
      data: {
        status: data.status,
        receivedAt: data.receivedAt,
      },
    });

    return RevenueMapper.toDomain(updated);
  }
}
