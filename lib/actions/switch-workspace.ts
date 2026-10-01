"use server";
import { cookies } from "next/headers";
import { HTTP_STATUS, REQUEST_FAILED, SESSION_MAX_AGE } from "@/lib/constants";
import { MEMBERSHIPS } from "@/lib/data/workspace/memberships";
import type { ActionResult, Workspace } from "@/lib/types";
import { getSession } from "@/lib/utils/session";
import { WORKSPACE_COOKIE } from "@/lib/workspace/constants";

const refused = (status: number) =>
    ({ ok: false, status, message: REQUEST_FAILED }) as const;

export const switchWorkspace = async (
    workspaceId: string,
): Promise<ActionResult<Workspace>> => {
    if (!(await getSession())) return refused(HTTP_STATUS.unauthorized);

    const membership = MEMBERSHIPS.find(({ id }) => id === workspaceId);
    if (!membership) return refused(HTTP_STATUS.forbidden);

    (await cookies()).set(WORKSPACE_COOKIE, membership.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_MAX_AGE,
    });

    return { ok: true, data: membership };
};
