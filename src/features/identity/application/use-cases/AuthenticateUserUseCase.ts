import { Email } from "@/features/identity/domain/value-objects/Email";
import { InvalidCredentialsError } from "@/features/identity/domain/errors/InvalidCredentialsError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";
import type { IUserMembershipReader } from "@/features/identity/application/ports/IUserMembershipReader";
import type { Role } from "@/features/identity/shared/types/Role";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  activeOrganizationId?: string;
  role?: Role;
};

type AuthenticateUserInput = {
  email: string;
  password: string;
};

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly userMembershipReader: IUserMembershipReader,
  ) {}

  async execute(input: AuthenticateUserInput): Promise<AuthenticatedUser> {
    const email = Email.create(input.email).value();
    const user = await this.userRepository.findByEmail(email);

    if (!user?.passwordHash) {
      throw new InvalidCredentialsError();
    }

    const validPassword = await this.passwordHasher.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new InvalidCredentialsError();
    }

    const role = user.activeOrganizationId
      ? await this.userMembershipReader.getMembershipRole(user.id, user.activeOrganizationId)
      : null;

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      activeOrganizationId: user.activeOrganizationId,
      role: role ?? undefined,
    };
  }
}
