type ProvisionOwnerInput = {
  name: string;
  email: string;
  passwordHash: string;
  organizationName: string;
};

export interface IAccountProvisioningGateway {
  provisionOwner(input: ProvisionOwnerInput): Promise<void>;
}
