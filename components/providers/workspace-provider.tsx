"use client";
import { useMemo, type ReactNode } from "react";
import type { Capability, Workspace, WorkspaceMember } from "@/lib/types";
import { roleCan } from "@/lib/utils/permissions";
import { WorkspaceContext } from "@/lib/workspace/context";

interface Props {
    workspace: Workspace;
    member: WorkspaceMember;
    moneyMovement: boolean;
    children: ReactNode;
}

export default function WorkspaceProvider({
    workspace,
    member,
    moneyMovement,
    children,
}: Props) {
    const { id, email } = member;
    const value = useMemo(
        () => ({
            workspace,
            member: { id, email },
            moneyMovement,
            can: (capability: Capability) =>
                roleCan(workspace.role, capability),
        }),
        [workspace, id, email, moneyMovement],
    );

    return <WorkspaceContext value={value}>{children}</WorkspaceContext>;
}
