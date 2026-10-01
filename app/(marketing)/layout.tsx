import LedgerNav from "@/components/ledgerline/ledger-nav";
import LedgerFooter from "@/components/ledgerline/ledger-footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <LedgerNav />
            <main>{children}</main>
            <LedgerFooter />
        </>
    );
}
