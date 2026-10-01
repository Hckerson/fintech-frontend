"use client";
import ServerErrorPanel from "@/components/status/server-error-panel";
import { DASHBOARD_LINK } from "@/lib/data/shell";
import type { ErrorBoundaryProps } from "@/lib/types";

export default function WorkspaceError(props: ErrorBoundaryProps) {
    return (
        <div className="flex flex-1 flex-col py-6">
            <ServerErrorPanel {...props} home={DASHBOARD_LINK} />
        </div>
    );
}
