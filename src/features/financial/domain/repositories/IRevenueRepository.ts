import type { Revenue } from "@/features/financial/domain/entities/Revenue";

export interface IRevenueRepository {
  save(revenue: Revenue): Promise<Revenue>;
  findById(id: string, organizationId: string): Promise<Revenue | null>;
  update(revenue: Revenue): Promise<Revenue>;
  listByOrganization(organizationId: string): Promise<Revenue[]>;
}
