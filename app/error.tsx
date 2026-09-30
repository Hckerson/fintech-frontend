"use client";
import type { ErrorBoundaryProps } from "@/lib/types";
import LedgerNav from "@/components/ledgerline/ledger-nav";
import LedgerFooter from "@/components/ledgerline/ledger-footer";
import ServerErrorPanel from "@/components/status/server-error-panel";

export default function RootError(props: ErrorBoundaryProps) {
    return (
        <>
            <LedgerNav />
            <main className="status-page">
                <ServerErrorPanel {...props} />
            </main>
            <LedgerFooter />
        </>
    );
}
