import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";

export default function TileYield() {
    return (
        <div className="surface-card flex flex-col gap-3 p-8">
            <span className="ledger-figure text-accent">
                {ACCOUNTS_COPY.yieldValue}
            </span>
            <h3 className="text-text mt-2 text-lg font-medium">
                {ACCOUNTS_COPY.yieldTitle}
            </h3>
            <p className="text-text-secondary text-sm">
                {ACCOUNTS_COPY.yieldDetail}
            </p>
        </div>
    );
}
