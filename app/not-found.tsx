import type { Metadata } from "next";
import LedgerNav from "@/components/ledgerline/ledger-nav";
import LedgerFooter from "@/components/ledgerline/ledger-footer";
import NotFoundPanel from "@/components/status/not-found-panel";
import { NOT_FOUND_COPY } from "@/lib/data/status/not-found";

export const metadata: Metadata = {
    title: NOT_FOUND_COPY.metaTitle,
};

export default function NotFound() {
    return (
        <>
            <LedgerNav />
            <main className="pt-(--ledger-header)">
                <div className="ledger-shell ledger-section flex min-h-[70svh] flex-col justify-center">
                    <NotFoundPanel />
                </div>
            </main>
            <LedgerFooter />
        </>
    );
}
