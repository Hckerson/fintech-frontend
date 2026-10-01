import "server-only";
import { cookies } from "next/headers";
import { MEMBERSHIPS } from "@/lib/data/workspace/memberships";
import type { Workspace } from "@/lib/types";
import { WORKSPACE_COOKIE } from "@/lib/workspace/constants";

export const currentWorkspace = async (): Promise<Workspace | null> => {
    const preferred = (await cookies()).get(WORKSPACE_COOKIE)?.value;
    return (
        MEMBERSHIPS.find(({ id }) => id === preferred) ?? MEMBERSHIPS[0] ?? null
    );
};
