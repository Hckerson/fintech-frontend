"use client";
import ServerErrorPanel from "@/components/status/server-error-panel";
import type { ErrorBoundaryProps } from "@/lib/types";

export default function AdminError(props: ErrorBoundaryProps) {
    return <ServerErrorPanel {...props} />;
}
