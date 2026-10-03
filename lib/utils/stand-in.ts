import "server-only";
import type { z } from "zod";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import type { ActionResult, Workspace } from "@/lib/types";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { getSession } from "@/lib/utils/session";
import type { SessionPayload } from "@/lib/utils/verify-session-token";

const refused = (status: number) =>
    ({ ok: false, status, message: REQUEST_FAILED }) as const;

export const standIn = async <TSchema extends z.ZodType>(
    schema: TSchema,
    read: (workspace: Workspace, session: SessionPayload) => z.input<TSchema>,
): Promise<ActionResult<z.output<TSchema>>> => {
    const session = await getSession();
    if (!session) return refused(HTTP_STATUS.unauthorized);

    const workspace = await currentWorkspace();
    if (!workspace) return refused(HTTP_STATUS.forbidden);

    const parsed = schema.safeParse(read(workspace, session));
    return parsed.success
        ? { ok: true, data: parsed.data }
        : refused(HTTP_STATUS.badGateway);
};
