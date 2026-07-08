"use client";

import { useActionState } from "react";
import type { UserOrganization } from "@/features/organization/domain/repositories/IMembershipRepository";
import {
  switchOrganizationAction,
  type SwitchOrganizationActionState,
} from "@/features/organization/presentation/actions/organization.actions";

type OrganizationSwitcherProps = {
  organizations: UserOrganization[];
  activeOrganizationId?: string;
};

const initialState: SwitchOrganizationActionState = {};

export function OrganizationSwitcher({
  organizations,
  activeOrganizationId,
}: OrganizationSwitcherProps) {
  const [state, formAction, isPending] = useActionState(switchOrganizationAction, initialState);

  if (organizations.length <= 1) {
    return null;
  }

  return (
    <form action={formAction} className="space-y-2">
      <label htmlFor="organizationId" className="text-xs font-medium text-muted-foreground">
        Empresa ativa
      </label>
      <select
        id="organizationId"
        name="organizationId"
        defaultValue={activeOrganizationId}
        className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        disabled={isPending}
      >
        {organizations.map((organization) => (
          <option key={organization.organizationId} value={organization.organizationId}>
            {organization.organizationName}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md border px-3 py-2 text-sm hover:bg-accent disabled:opacity-60"
      >
        {isPending ? "Atualizando..." : "Trocar empresa"}
      </button>
      {state.error ? <p className="text-xs text-destructive">{state.error}</p> : null}
    </form>
  );
}
