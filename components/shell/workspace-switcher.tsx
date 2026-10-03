"use client";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronSort } from "@carbon/icons-react";
import WorkspaceOptions from "@/components/shell/workspace-options";
import Avatar from "@/components/ui/avatar";
import Menu from "@/components/ui/menu";
import { DASHBOARD_ROUTE } from "@/lib/constants";
import { ROLE_LABELS, SHELL_COPY } from "@/lib/data/shell";
import { useSwitchWorkspace } from "@/lib/hooks/use-switch-workspace";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { useWorkspaces } from "@/lib/hooks/use-workspaces";
import type { Workspace } from "@/lib/types";
import { announceSession } from "@/lib/utils/session-events";
import { keepsRoute } from "@/lib/utils/workspace-nav";

const COPY = SHELL_COPY.workspace;

export default function WorkspaceSwitcher() {
    const router = useRouter();
    const pathname = usePathname();
    const { workspace, moneyMovement } = useWorkspace();
    const workspaces = useWorkspaces();
    const switcher = useSwitchWorkspace();
    const [switched, setSwitched] = useState<Workspace | null>(null);
    const memberships = workspaces.data ?? [];

    const choose = (next: Workspace, close: () => void) => {
        close();
        if (next.id === workspace.id || switcher.isPending) return;
        switcher.mutate(next.id, {
            onSuccess: () => {
                setSwitched(next);
                router.replace(
                    keepsRoute(pathname, next.role, moneyMovement)
                        ? pathname
                        : DASHBOARD_ROUTE,
                );
                announceSession("workspace-switched");
            },
        });
    };

    const identity = (
        <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            <Avatar name={workspace.name} className="rounded-md" />
            <span className="flex min-w-0 flex-1 flex-col">
                <span className="text-text truncate text-sm leading-tight font-medium">
                    {workspace.name}
                </span>
                <span className="text-text-muted text-caption leading-tight">
                    {ROLE_LABELS[workspace.role]}
                </span>
            </span>
        </span>
    );

    return (
        <div className="flex flex-col gap-1">
            {memberships.length > 1 ? (
                <Menu
                    fill
                    label={COPY.trigger(workspace.name)}
                    triggerClassName="hover:bg-background-muted flex w-full items-center gap-2 rounded-md p-1"
                    trigger={
                        <>
                            {identity}
                            <ChevronSort
                                aria-hidden
                                className="text-text-muted size-4 shrink-0"
                            />
                        </>
                    }
                >
                    {(close) => (
                        <WorkspaceOptions
                            memberships={memberships}
                            currentId={workspace.id}
                            onChoose={(next) => choose(next, close)}
                        />
                    )}
                </Menu>
            ) : (
                <div className="flex items-center p-1">
                    <span className="sr-only">{COPY.label}: </span>
                    {identity}
                </div>
            )}
            {workspaces.isError ? (
                <p className="text-text-muted px-1 text-xs">
                    {COPY.loadFailed}
                    {" · "}
                    <button
                        type="button"
                        onClick={() => void workspaces.refetch()}
                        className="text-text cursor-pointer underline underline-offset-4"
                    >
                        {COPY.retry}
                    </button>
                </p>
            ) : null}
            <p role="status" className="sr-only">
                {switcher.isPending
                    ? COPY.switching
                    : switched?.id === workspace.id
                      ? COPY.switched(
                            workspace.name,
                            ROLE_LABELS[workspace.role],
                        )
                      : ""}
            </p>
            {switcher.isError ? (
                <p role="alert" className="text-error px-1 text-xs">
                    {COPY.switchFailed(workspace.name)}
                </p>
            ) : null}
        </div>
    );
}
