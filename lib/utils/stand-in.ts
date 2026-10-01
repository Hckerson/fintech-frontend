import "server-only";
import type { z } from "zod";
import { HTTP_STATUS, REQUEST_FAILED } from "@/lib/constants";
import type { ActionResult, Workspace } from "@/lib/types";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { getSession } from "@/lib/utils/session";

const refused = (status: number) =>
    ({ ok: false, status, message: REQUEST_FAILED }) as const;

export const standIn = async <TSchema extends z.ZodType>(
    schema: TSchema,
    read: (workspace: Workspace) => z.input<TSchema>,
): Promise<ActionResult<z.output<TSchema>>> => {
    if (!(await getSession())) return refused(HTTP_STATUS.unauthorized);

    const workspace = await currentWorkspace();
    if (!workspace) return refused(HTTP_STATUS.forbidden);

    const parsed = schema.safeParse(read(workspace));
    return parsed.success
        ? { ok: true, data: parsed.data }
        : refused(HTTP_STATUS.badGateway);
};
