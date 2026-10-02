import Amount from "@/components/common/amount";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { TransferParty } from "@/lib/types";
import { amountWords } from "@/lib/utils/amount-words";
import { fractionDigits } from "@/lib/utils/money";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";

interface Props {
    amountMinor: string;
    currency: string;
    from: TransferParty;
    fromNote?: string;
    to: TransferParty;
    memo: string | null;
    settlesOn: string;
}

const COPY = TRANSFER_COPY.review;

export default function TransferDetails({
    amountMinor,
    currency,
    from,
    fromNote,
    to,
    memo,
    settlesOn,
}: Props) {
    const rows = [
        {
            label: COPY.from,
            value: TRANSFER_COPY.destination(from.name, from.last4),
            note: fromNote,
        },
        {
            label: COPY.to,
            value: TRANSFER_COPY.destination(to.name, to.last4),
        },
        { label: COPY.memo, value: memo ?? COPY.noMemo },
        {
            label: COPY.settles,
            value: zonedLabel(settlesOn, "UTC", CALENDAR_DAY),
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="border-border bg-background flex flex-col gap-1 rounded-lg border p-4">
                <p className="micro-label text-text-muted">{COPY.amount}</p>
                <p className="text-h4 text-text font-medium tabular-nums">
                    <Amount amountMinor={amountMinor} currency={currency} />
                </p>
                <p className="text-text-secondary text-sm">
                    {amountWords(amountMinor, fractionDigits(currency))}{" "}
                    {currency}
                </p>
            </div>
            <dl className="divide-border flex flex-col divide-y text-sm">
                {rows.map(({ label, value, note }) => (
                    <div
                        key={label}
                        className="flex items-baseline justify-between gap-4 py-2.5"
                    >
                        <dt className="text-text-secondary shrink-0">
                            {label}
                        </dt>
                        <dd className="text-text flex flex-col text-right wrap-anywhere">
                            {value}
                            {note ? (
                                <span className="text-text-muted text-xs tabular-nums">
                                    {note}
                                </span>
                            ) : null}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
