import Amount from "@/components/common/amount";
import HeroFacts from "@/components/dashboard/hero-facts";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition } from "@/lib/types";

interface Props {
    position: CashPosition;
    timeZone: string;
}

export default function CashHeadline({ position, timeZone }: Props) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 flex-col gap-2">
                <p className="figure-label">
                    {DASHBOARD_COPY.cash.available} · {position.currency}
                </p>
                <Amount
                    {...position.available}
                    className="ledger-figure text-text break-words"
                />
            </div>
            <HeroFacts position={position} timeZone={timeZone} />
        </div>
    );
}
