import Amount from "@/components/common/amount";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

export default function PayeeTotals({
    totals,
}: {
    totals: Payee["totalPaid"];
}) {
    return totals.length === 0 ? (
        <span className="text-text-muted">{PAYEE_COPY.nothingPaid}</span>
    ) : (
        <span className="text-text inline-flex flex-col tabular-nums">
            {totals.map(({ currency, amountMinor }) => (
                <span key={currency} className="whitespace-nowrap">
                    <Amount amountMinor={amountMinor} currency={currency} />{" "}
                    <span className="text-text-muted text-xs">{currency}</span>
                </span>
            ))}
        </span>
    );
}
