import Amount from "@/components/common/amount";
import TransferSummary from "@/components/payments/transfer-summary";
import Meter from "@/components/ui/meter";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import { parseAmount } from "@/lib/payments/amount";
import type { Payee, TransferDraft, TransferOptions } from "@/lib/types";
import { formatMoney, fractionDigits } from "@/lib/utils/money";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";

interface Props {
    options: TransferOptions;
    draft: TransferDraft;
    payees: readonly Payee[];
}

const COPY = TRANSFER_COPY.aside;

const BASIS_POINTS = 10_000;

export default function TransferAside({ options, draft, payees }: Props) {
    const source = options.accounts.find(
        ({ id }) => id === draft.fromAccountId,
    );
    const payee = payees.find(({ id }) => id === draft.payeeId);
    const account = options.accounts.find(({ id }) => id === draft.accountId);
    const to =
        draft.kind === "payee"
            ? payee && { name: payee.name, last4: payee.destinationLast4 }
            : account;
    const amount = source
        ? parseAmount(draft.amount, fractionDigits(source.currency))
        : null;
    const currency = source?.currency ?? DEFAULT_CURRENCY;
    const { perTransferMinor, dailyLimitMinor, dailyRemainingMinor } =
        options.limits;
    const limit = BigInt(dailyLimitMinor);
    const used = limit - BigInt(dailyRemainingMinor);
    const money = (minor: string) => formatMoney(minor, currency) ?? "";
    const facts = [
        {
            label: COPY.perTransfer,
            value: (
                <Amount amountMinor={perTransferMinor} currency={currency} />
            ),
        },
        {
            label: COPY.daily,
            value: (
                <Amount amountMinor={dailyRemainingMinor} currency={currency} />
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
            <TransferSummary
                amountMinor={amount?.toString()}
                currency={currency}
                from={source}
                to={to}
            />
            <h2 className="text-text text-sm font-medium">{COPY.title}</h2>
            <Meter
                label={COPY.usedToday}
                value={
                    limit > BigInt(0)
                        ? Number((used * BigInt(BASIS_POINTS)) / limit)
                        : 0
                }
                max={BASIS_POINTS}
                valueText={COPY.used(
                    money(used.toString()),
                    money(dailyLimitMinor),
                )}
            />
            <dl className="divide-border border-border flex flex-col divide-y border-t text-sm">
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
