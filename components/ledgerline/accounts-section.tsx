import SectionHeading from "@/components/ledgerline/section-heading";
import SignatureRule from "@/components/ledgerline/signature-rule";
import TileCurrencies from "@/components/ledgerline/tile-currencies";
import TileTransfer from "@/components/ledgerline/tile-transfer";
import TileYield from "@/components/ledgerline/tile-yield";
import TileSubaccounts from "@/components/ledgerline/tile-subaccounts";
import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";

const TITLE_ID = "accounts-title";

export default function AccountsSection() {
    return (
        <section id="accounts" aria-labelledby={TITLE_ID} className="ledger-section">
            <div className="ledger-shell flex flex-col gap-14">
                <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
                    <SectionHeading id={TITLE_ID} eyebrow={ACCOUNTS_COPY.eyebrow} title={ACCOUNTS_COPY.title} />
                    <p className="max-w-md text-lg text-text-secondary">{ACCOUNTS_COPY.lead}</p>
                </div>
                <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
                    <TileCurrencies />
                    <TileTransfer />
                    <TileYield />
                    <TileSubaccounts />
                </div>
                <div className="flex flex-col gap-3">
                    <SignatureRule />
                    <p className="font-mono text-xs text-text-muted">{ACCOUNTS_COPY.note}</p>
                </div>
            </div>
        </section>
    );
}
