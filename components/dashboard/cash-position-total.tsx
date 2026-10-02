import Link from "next/link";
import {
    ArrowDownRight,
    ArrowUpRight,
    Subtract,
    type CarbonIconType,
} from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import FigureCell from "@/components/common/figure-cell";
import StatusLabel from "@/components/ui/status-label";
import TrendLine from "@/components/ui/trend-line";
import { NOT_AVAILABLE } from "@/lib/constants";
import { SPARKLINE } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition, Trend } from "@/lib/types";
import { plottable, trendOf, trendPercent } from "@/lib/utils/trend";
import { ACCOUNTS_ROUTE } from "@/lib/workspace/constants";

interface Props {
    position: CashPosition;
    timeZone: string;
}

const COPY = DASHBOARD_COPY.cash;
const DIVIDED = "border-border border-t lg:border-t-0 lg:border-l";

const DIRECTION: Record<Trend["direction"], CarbonIconType> = {
    up: ArrowUpRight,
    down: ArrowDownRight,
    flat: Subtract,
};

export default function CashPositionTotal({ position, timeZone }: Props) {
    const { currency, available, current, netToday, includesFrozen } = position;
    const trend = trendOf(position.trend);
    const line = plottable(position.trend);
    const Direction = trend ? DIRECTION[trend.direction] : null;

    return (
        <dl className="border-border grid grid-cols-2 border-t first:border-t-0 lg:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,1fr))]">
            <FigureCell
                lead
                className="col-span-2 lg:col-span-1"
                label={
                    <>
                        <Link
                            href={ACCOUNTS_ROUTE}
                            className="hover:text-text underline-offset-4 hover:underline"
                        >
                            {COPY.available(currency)}
                        </Link>
                        {includesFrozen ? (
                            <StatusLabel
                                label={COPY.frozen}
                                severity="attention"
                            />
                        ) : null}
                    </>
                }
            >
                <Amount {...available} className="break-words" />
            </FigureCell>
            <FigureCell label={COPY.current} className={DIVIDED}>
                <Amount {...current} />
            </FigureCell>
            <FigureCell
                label={COPY.netToday(timeZone)}
                className={`${DIVIDED} border-l`}
            >
                {netToday ? (
                    <Amount {...netToday} display="signed" />
                ) : (
                    <span className="text-text-muted">{NOT_AVAILABLE}</span>
                )}
            </FigureCell>
            <FigureCell
                label={COPY.trendLabel}
                className={`${DIVIDED} col-span-2 lg:col-span-1`}
            >
                {trend && Direction ? (
                    <span className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-1">
                            <Direction
                                aria-hidden
                                className="text-text-muted size-4"
                            />
                            {COPY.trend(
                                trend,
                                trendPercent(trend, COPY.ceiling),
                            )}
                        </span>
                        {line ? (
                            <TrendLine values={line} box={SPARKLINE} />
                        ) : null}
                    </span>
                ) : (
                    <span className="text-text-muted">{NOT_AVAILABLE}</span>
                )}
            </FigureCell>
        </dl>
    );
}
