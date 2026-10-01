import type { Metadata } from "next";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import WorkspaceProvider from "@/components/providers/workspace-provider";
import AppShell from "@/components/shell/app-shell";
import WorkspaceSidebar from "@/components/shell/workspace-sidebar";
import WorkspaceUtilities from "@/components/shell/workspace-utilities";
import {
    ADMIN_ROLE,
    ADMIN_ROUTE,
    LOGIN_ROUTE,
    NO_INDEX,
} from "@/lib/constants";
import { currentWorkspace } from "@/lib/utils/current-workspace";
import { serverEnv } from "@/lib/utils/server-env";
import { getSession } from "@/lib/utils/session";
import { APP_NAME, ONBOARDING_ROUTE } from "@/lib/workspace/constants";

export const metadata: Metadata = {
    title: { template: `%s · ${APP_NAME}`, default: APP_NAME },
    robots: NO_INDEX,
};

interface Props {
    children: ReactNode;
    drawer: ReactNode;
}

export default async function WorkspaceLayout({ children, drawer }: Props) {
    const session = await getSession();
    if (!session) redirect(LOGIN_ROUTE);

    const workspace = await currentWorkspace();
    if (!workspace) {
        redirect(session.role === ADMIN_ROLE ? ADMIN_ROUTE : ONBOARDING_ROUTE);
    }

    return (
        <WorkspaceProvider
            workspace={workspace}
            member={{ id: session.sub, email: session.email }}
            moneyMovement={serverEnv.moneyMovement}
        >
            <AppShell
                sidebar={<WorkspaceSidebar />}
                utilities={<WorkspaceUtilities />}
            >
                {children}
            </AppShell>
            {drawer}
        </WorkspaceProvider>
    );
}
