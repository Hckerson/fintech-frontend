import {
    ArrowDownRight,
    ArrowUpRight,
    Subtract,
    type CarbonIconType,
} from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import { NOT_AVAILABLE } from "@/lib/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition, Trend } from "@/lib/types";
import { trendOf, trendPercent } from "@/lib/utils/trend";

interface Props {
    position: CashPosition;
    timeZone: string;
}

const COPY = DASHBOARD_COPY.cash;
const FACT = "flex flex-col gap-1";
const VALUE =
    "text-text text-compact font-medium whitespace-nowrap tabular-nums";
const MISSING = <span className="text-text-muted">{NOT_AVAILABLE}</span>;

const DIRECTION: Record<Trend["direction"], CarbonIconType> = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    flat: Subtract,
};

export default function HeroFacts({ position, timeZone }: Props) {
    const trend = trendOf(position.trend);
    const Direction = trend ? DIRECTION[trend.direction] : null;

    return (
        <dl className="[&>div]:border-border flex shrink-0 [&>div]:border-l [&>div]:px-3">
            <div className={FACT}>
                <dt className="figure-label whitespace-nowrap">
                    {COPY.current}
                </dt>
                <dd className={VALUE}>
                    <Amount {...position.current} />
                </dd>
            </div>
            <div className={FACT}>
                <dt className="figure-label whitespace-nowrap">
                    {COPY.netToday(timeZone)}
                </dt>
                <dd className={VALUE}>
                    {position.netToday ? (
                        <Amount {...position.netToday} display="signed" />
                    ) : (
                        MISSING
                    )}
                </dd>
            </div>
            <div className={FACT}>
                <dt className="figure-label whitespace-nowrap">
                    {COPY.trendLabel}
                </dt>
                <dd className={VALUE}>
                    {trend && Direction ? (
                        <span className="flex items-center gap-1">
                            <Direction
                                aria-hidden
                                className="text-accent size-3.5"
                            />
                            {COPY.trend(
                                trend,
                                trendPercent(trend, COPY.ceiling),
                            )}
                        </span>
                    ) : (
                        MISSING
                    )}
                </dd>
            </div>
        </dl>
    );
}
