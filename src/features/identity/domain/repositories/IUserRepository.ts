export type UserAuthRecord = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  passwordHash: string | null;
  activeOrganizationId?: string;
};

export interface IUserRepository {
  existsByEmail(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<UserAuthRecord | null>;
}
