import { ResetPasswordForm } from "@/features/identity/presentation/components/ResetPasswordForm";

export const metadata = {
  title: "Redefinir senha",
};

type ResetPasswordPageProps = {
  params: Promise<{ token: string }>;
};

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;

  return <ResetPasswordForm token={token} />;
}
