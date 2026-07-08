import { LoginForm } from "@/features/identity/presentation/components/LoginForm";

export const metadata = {
  title: "Login",
};

type LoginPageProps = {
  searchParams: Promise<{ registered?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return <LoginForm registered={params.registered === "1"} />;
}
