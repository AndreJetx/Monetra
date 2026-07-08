export interface IDefaultCategoriesProvisioner {
  provision(organizationId: string): Promise<void>;
}
