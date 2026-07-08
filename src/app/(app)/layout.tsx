import Link from "next/link";
import { auth } from "@/shared/auth/auth";
import { AuthSessionProvider } from "@/shared/auth/AuthSessionProvider";
import { Button } from "@/shared/components/ui/button";
import { logoutAction } from "@/features/identity/presentation/actions/auth.actions";
import { createListUserOrganizationsUseCase } from "@/features/organization/infrastructure/factories";
import { OrganizationSwitcher } from "@/features/organization/presentation/components/OrganizationSwitcher";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const listOrganizationsUseCase = createListUserOrganizationsUseCase();
  const organizations = session?.user?.id
    ? await listOrganizationsUseCase.execute(session.user.id)
    : [];

  return (
    <div className="flex min-h-full">
      <aside className="hidden w-60 flex-col border-r bg-card p-4 md:flex">
        <div className="mb-8">
          <Link href="/dashboard" className="text-lg font-bold text-primary">
            Monetra
          </Link>
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/dashboard" className="rounded-md px-3 py-2 hover:bg-accent">
            Dashboard
          </Link>
        </nav>
        <div className="mt-4 border-t pt-4">
          <OrganizationSwitcher
            organizations={organizations}
            activeOrganizationId={session?.user?.activeOrganizationId}
          />
        </div>
        <div className="mt-auto border-t pt-4 text-sm text-muted-foreground">
          {session?.user?.name}
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <span className="text-sm text-muted-foreground">Monetra</span>
          <form action={logoutAction}>
            <Button variant="ghost" size="sm" type="submit">
              Sair
            </Button>
          </form>
        </header>
        <main className="flex-1 p-6">
          <AuthSessionProvider session={session}>{children}</AuthSessionProvider>
        </main>
      </div>
    </div>
  );
}
