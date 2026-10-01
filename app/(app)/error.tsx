"use client";
import ServerErrorPanel from "@/components/status/server-error-panel";
import { DASHBOARD_LINK } from "@/lib/data/shell";
import type { ErrorBoundaryProps } from "@/lib/types";

export default function AppError(props: ErrorBoundaryProps) {
    return (
        <main className="status-page">
            <ServerErrorPanel {...props} home={DASHBOARD_LINK} />
        </main>
    );
}
