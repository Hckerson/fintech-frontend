import Amount from "@/components/common/amount";
import HeroFacts from "@/components/dashboard/hero-facts";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition } from "@/lib/types";
import { moneyParts } from "@/lib/utils/money";

interface Props {
    position: CashPosition;
    timeZone: string;
}

export default function CashHeadline({ position, timeZone }: Props) {
    const { amountMinor, currency } = position.available;
    const parts = moneyParts(amountMinor, currency);

    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
                <p className="figure-label">
                    {DASHBOARD_COPY.cash.available} · {position.currency}
                </p>
                {parts ? (
                    <data
                        value={amountMinor}
                        className="figure-hero text-text break-words"
                    >
                        {parts.major}
                        <span className="text-text-muted">{parts.minor}</span>
                    </data>
                ) : (
                    <Amount
                        {...position.available}
                        className="figure-hero text-text"
                    />
                )}
            </div>
            <HeroFacts position={position} timeZone={timeZone} />
        </div>
    );
}
