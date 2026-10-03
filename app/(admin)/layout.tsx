import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import AdminNotificationEntry from "@/components/admin/admin-notification-entry";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AppShell from "@/components/shell/app-shell";
import UtilityBar from "@/components/shell/utility-bar";
import { getSession } from "@/lib/utils/session";
import { adminCommands, platformRoleOf } from "@/lib/utils/platform-role";
import { AUTH_GATE_DISABLED, LOGIN_ROUTE, NO_INDEX } from "@/lib/constants";

export const metadata: Metadata = { robots: NO_INDEX };

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getSession();
    if (!session && !AUTH_GATE_DISABLED) redirect(LOGIN_ROUTE);

    const role = platformRoleOf(session);
    if (!role) notFound();

    return (
        <AppShell
            sidebar={<AdminSidebar role={role} />}
            utilities={
                <UtilityBar
                    commands={adminCommands(role)}
                    email={session?.email ?? ""}
                    notifications={<AdminNotificationEntry />}
                />
            }
        >
            {children}
        </AppShell>
    );
}
