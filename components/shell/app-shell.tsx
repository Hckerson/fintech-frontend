import type { ReactNode } from "react";
import MobileNav from "@/components/shell/mobile-nav";
import OfflineNotice from "@/components/shell/offline-notice";
import RouteFocus from "@/components/shell/route-focus";
import SessionSync from "@/components/shell/session-sync";
import { MAIN_CONTENT_ID } from "@/lib/constants";
import { SHELL_COPY } from "@/lib/data/shell";

interface Props {
    sidebar: ReactNode;
    utilities: ReactNode;
    children: ReactNode;
}

export default function AppShell({ sidebar, utilities, children }: Props) {
    return (
        <div className="flex min-h-svh">
            <a
                href={`#${MAIN_CONTENT_ID}`}
                className="bg-accent text-text-inverse sr-only z-(--z-indices-tooltip) rounded-md px-3 py-2 text-sm focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
            >
                {SHELL_COPY.skip}
            </a>
            <aside className="border-border bg-background-alt sticky top-0 hidden h-svh w-60 shrink-0 border-r lg:block">
                {sidebar}
            </aside>
            <div className="flex min-w-0 flex-1 flex-col">
                <header className="border-border bg-background sticky top-0 z-(--z-indices-sticky) flex h-14 items-center gap-3 border-b px-4 lg:px-6">
                    <MobileNav>{sidebar}</MobileNav>
                    {utilities}
                </header>
                <OfflineNotice />
                <main
                    id={MAIN_CONTENT_ID}
                    tabIndex={-1}
                    className="mx-auto flex w-full max-w-(--ledger-shell) flex-1 flex-col gap-4 px-4 py-6 focus:outline-none lg:px-6"
                >
                    {children}
                </main>
            </div>
            <RouteFocus />
            <SessionSync />
        </div>
    );
}
