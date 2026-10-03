import type { ReactNode } from "react";
import PageHeader from "@/components/shell/page-header";
import EmptyState from "@/components/ui/empty-state";
import type { EmptyStateCopy, PlatformRole } from "@/lib/types";
import { platformRoleOf } from "@/lib/utils/platform-role";
import { getSession } from "@/lib/utils/session";

interface Props {
    allow: PlatformRole;
    title: string;
    denied: EmptyStateCopy;
    children: ReactNode;
}

export default async function AdminRoleGate({
    allow,
    title,
    denied,
    children,
}: Props) {
    if (platformRoleOf(await getSession()) === allow) return children;

    return (
        <>
            <PageHeader title={title} />
            <div className="surface-card p-4">
                <EmptyState {...denied} />
            </div>
        </>
    );
}
