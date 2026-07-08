import { Email } from "@/features/identity/domain/value-objects/Email";
import { InvalidCredentialsError } from "@/features/identity/domain/errors/InvalidCredentialsError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";

export type AuthenticatedUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  activeOrganizationId?: string;
};

type AuthenticateUserInput = {
  email: string;
  password: string;
};

export class AuthenticateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
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

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      activeOrganizationId: user.activeOrganizationId,
    };
  }
}
