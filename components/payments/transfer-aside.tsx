import Amount from "@/components/common/amount";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { TransferAccount, TransferOptions } from "@/lib/types";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";

interface Props {
    options: TransferOptions;
    source: TransferAccount | undefined;
}

const COPY = TRANSFER_COPY.aside;

export default function TransferAside({ options, source }: Props) {
    const currency = source?.currency ?? DEFAULT_CURRENCY;
    const facts = [
        {
            label: COPY.available,
            value: source ? (
                <Amount
                    amountMinor={source.availableMinor}
                    currency={source.currency}
                />
            ) : (
                COPY.chooseAccount
            ),
        },
        {
            label: COPY.perTransfer,
            value: (
                <Amount
                    amountMinor={options.limits.perTransferMinor}
                    currency={currency}
                />
            ),
        },
        {
            label: COPY.daily,
            value: (
                <Amount
                    amountMinor={options.limits.dailyRemainingMinor}
                    currency={currency}
                />
            ),
        },
        {
            label: COPY.cutOff,
            value: COPY.cutOffValue(options.cutOffHour, options.timeZone),
        },
        {
            label: COPY.settles,
            value: zonedLabel(options.settlesOn, "UTC", CALENDAR_DAY),
        },
    ];

    return (
        <aside
            aria-label={COPY.title}
            className="surface-card flex flex-col gap-3 p-4"
        >
            <h2 className="text-text text-sm font-medium">{COPY.title}</h2>
            <dl className="divide-border flex flex-col divide-y text-sm">
                {facts.map(({ label, value }) => (
                    <div
                        key={label}
                        className="flex items-baseline justify-between gap-3 py-2"
                    >
                        <dt className="text-text-secondary">{label}</dt>
                        <dd className="text-text text-right tabular-nums">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>
            <p className="text-text-muted text-xs">{COPY.note}</p>
        </aside>
    );
}
