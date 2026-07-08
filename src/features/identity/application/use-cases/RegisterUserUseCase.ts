import { User } from "@/features/identity/domain/entities/User";
import { EmailAlreadyInUseError } from "@/features/identity/domain/errors/EmailAlreadyInUseError";
import type { IUserRepository } from "@/features/identity/domain/repositories/IUserRepository";
import type { RegisterUserDTO } from "@/features/identity/application/dto/RegisterUserDTO";
import type { IPasswordHasher } from "@/features/identity/application/ports/IPasswordHasher";
import type { IAccountProvisioningGateway } from "@/features/identity/application/ports/IAccountProvisioningGateway";

export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly passwordHasher: IPasswordHasher,
    private readonly accountProvisioningGateway: IAccountProvisioningGateway,
  ) {}

  async execute(input: RegisterUserDTO): Promise<void> {
    const user = User.register({
      name: input.name,
      email: input.email,
      password: input.password,
    });

    const emailInUse = await this.userRepository.existsByEmail(user.getEmail());
    if (emailInUse) {
      throw new EmailAlreadyInUseError();
    }

    const passwordHash = await this.passwordHasher.hash(user.getPlainPassword());

    await this.accountProvisioningGateway.provisionOwner({
      name: user.getName(),
      email: user.getEmail(),
      passwordHash,
      organizationName: input.organizationName.trim(),
    });
  }
}
