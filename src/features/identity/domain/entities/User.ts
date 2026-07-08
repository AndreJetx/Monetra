import { Email } from "@/features/identity/domain/value-objects/Email";
import { Password } from "@/features/identity/domain/value-objects/Password";

type UserRegisterProps = {
  name: string;
  email: string;
  password: string;
};

type UserProps = {
  name: string;
  email: Email;
  password: Password;
};

export class User {
  private constructor(private readonly props: UserProps) {}

  static register(props: UserRegisterProps): User {
    const name = props.name.trim();

    return new User({
      name,
      email: Email.create(props.email),
      password: Password.create(props.password),
    });
  }

  getName(): string {
    return this.props.name;
  }

  getEmail(): string {
    return this.props.email.value();
  }

  getPlainPassword(): string {
    return this.props.password.value();
  }
}
