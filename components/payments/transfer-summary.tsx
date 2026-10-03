import { ArrowDown } from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { TransferParty } from "@/lib/types";

interface Props {
    amountMinor: string | undefined;
    currency: string;
    from: TransferParty | undefined;
    to: TransferParty | undefined;
}

const COPY = TRANSFER_COPY.aside;

export default function TransferSummary({
    amountMinor,
    currency,
    from,
    to,
}: Props) {
    const parties = [
        { label: TRANSFER_COPY.form.from, party: from },
        { label: TRANSFER_COPY.form.to, party: to },
    ];

    return (
        <div className="border-border bg-background flex flex-col gap-3 rounded-lg border p-3">
            <div className="flex flex-col gap-1">
                <p className="micro-label text-text-muted">{COPY.sending}</p>
                <p className="text-h5 text-text font-medium tabular-nums">
                    {amountMinor ? (
                        <Amount amountMinor={amountMinor} currency={currency} />
                    ) : (
                        <span className="text-text-muted">{COPY.noAmount}</span>
                    )}
                </p>
            </div>
            <ol className="flex flex-col gap-2 text-sm">
                {parties.map(({ label, party }, index) => (
                    <li key={label} className="flex flex-col gap-2">
                        {index > 0 ? (
                            <ArrowDown
                                aria-hidden
                                className="text-text-muted size-4"
                            />
                        ) : null}
                        <span className="flex items-baseline justify-between gap-3">
                            <span className="text-text-secondary">{label}</span>
                            <span
                                className={
                                    party
                                        ? "text-text truncate text-right"
                                        : "text-text-muted text-right"
                                }
                            >
                                {party
                                    ? TRANSFER_COPY.destination(
                                          party.name,
                                          party.last4,
                                      )
                                    : COPY.notChosen}
                            </span>
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    );
}
