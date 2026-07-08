"use server";

import { z } from "zod";
import { auth, updateSession } from "@/shared/auth/auth";
import { OrganizationAccessDeniedError } from "@/features/organization/domain/errors/OrganizationAccessDeniedError";
import { createSwitchOrganizationUseCase } from "@/features/organization/infrastructure/factories";

export type SwitchOrganizationActionState = {
  error?: string;
};

const switchOrganizationSchema = z.object({
  organizationId: z.string().min(1, "Organização inválida"),
});

export async function switchOrganizationAction(
  _prevState: SwitchOrganizationActionState,
  formData: FormData,
): Promise<SwitchOrganizationActionState> {
  const session = await auth();

  if (!session?.user?.id) {
    return { error: "Usuário não autenticado" };
  }

  const parsed = switchOrganizationSchema.safeParse({
    organizationId: formData.get("organizationId"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos" };
  }

  const useCase = createSwitchOrganizationUseCase();

  try {
    const result = await useCase.execute({
      userId: session.user.id,
      organizationId: parsed.data.organizationId,
    });

    await updateSession({
      user: {
        activeOrganizationId: result.activeOrganizationId,
      },
    });

    return {};
  } catch (error) {
    if (error instanceof OrganizationAccessDeniedError) {
      return { error: "Você não possui acesso a esta organização" };
    }
    throw error;
  }
}
