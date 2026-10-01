import { z } from "zod";
import { WORKSPACE_ROLES } from "@/lib/data/permissions";
import { VERIFICATION_STATES } from "@/lib/enums/ledger";

export const workspaceSchema = z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    role: z.enum(WORKSPACE_ROLES),
    verificationState: z.enum(VERIFICATION_STATES),
    timeZone: z.string().min(1),
});

export const workspaceListSchema = z.array(workspaceSchema);

export const notificationCountSchema = z.object({
    unread: z.number().int().nonnegative(),
});
