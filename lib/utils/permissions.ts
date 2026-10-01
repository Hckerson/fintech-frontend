import { CAPABILITY_ROLES } from "@/lib/data/permissions";
import type { Capability, WorkspaceRole } from "@/lib/types";

export const seesPermittedOnly = (role: WorkspaceRole) => role === "viewer";

export const roleCan = (
    role: WorkspaceRole | undefined,
    capability: Capability,
): boolean => {
    const allowed: readonly WorkspaceRole[] | undefined =
        CAPABILITY_ROLES[capability];
    return (
        role !== undefined && allowed !== undefined && allowed.includes(role)
    );
};
