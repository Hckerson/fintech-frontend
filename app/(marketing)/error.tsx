"use client";
import type { ErrorBoundaryProps } from "@/lib/types";
import ServerErrorPanel from "@/components/status/server-error-panel";

export default function MarketingError(props: ErrorBoundaryProps) {
    return (
        <div className="status-page">
            <ServerErrorPanel {...props} />
        </div>
    );
}
