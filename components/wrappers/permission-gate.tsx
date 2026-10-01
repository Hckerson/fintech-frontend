"use client";
import type { ReactNode } from "react";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import type { Capability } from "@/lib/types";

interface Props {
    capability: Capability;
    fallback?: ReactNode;
    children: ReactNode;
}

export default function PermissionGate({
    capability,
    fallback = null,
    children,
}: Props) {
    const { can } = useWorkspace();
    return <>{can(capability) ? children : fallback}</>;
}
