import {
    ArrowDownRight,
    ArrowUpRight,
    Subtract,
    type CarbonIconType,
} from "@carbon/icons-react";
import Amount from "@/components/common/amount";
import StatusLabel from "@/components/ui/status-label";
import TrendLine from "@/components/ui/trend-line";
import { NOT_AVAILABLE } from "@/lib/constants";
import { SPARKLINE } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition, Trend } from "@/lib/types";
import { plottable, trendOf, trendPercent } from "@/lib/utils/trend";

interface Props {
    position: CashPosition;
    timeZone: string;
}

const COPY = DASHBOARD_COPY.cash;
const CELL = "data-cell max-md:block max-md:border-b-0 max-md:py-2";
const LABEL = "figure-label block pb-1 md:hidden";
const MISSING = <span className="text-text-muted">{NOT_AVAILABLE}</span>;

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
        <tr className="max-md:border-border-light max-md:grid max-md:grid-cols-2 max-md:border-b max-md:py-2">
            <th
                scope="row"
                className={`${CELL} text-left font-normal max-md:col-span-2 md:w-px md:whitespace-nowrap`}
            >
                <span className="flex items-center gap-2">
                    <span className="border-border-dark text-text text-caption rounded border px-1.5 py-0.5 font-mono font-medium">
                        {currency}
                    </span>
                    {includesFrozen ? (
                        <StatusLabel label={COPY.frozen} severity="attention" />
                    ) : null}
                </span>
            </th>
            <td className={`${CELL} max-md:col-span-2`}>
                <span className={LABEL}>{COPY.available}</span>
                <Amount
                    {...available}
                    className="text-text text-h5 font-semibold tracking-tight break-words tabular-nums"
                />
            </td>
            <td className={`${CELL} md:text-right`}>
                <span className={LABEL}>{COPY.current}</span>
                <Amount {...current} className="text-text tabular-nums" />
            </td>
            <td className={`${CELL} md:text-right`}>
                <span className={LABEL}>{COPY.netToday(timeZone)}</span>
                {netToday ? (
                    <Amount
                        {...netToday}
                        display="signed"
                        className="text-text tabular-nums"
                    />
                ) : (
                    MISSING
                )}
            </td>
            <td className={`${CELL} max-md:col-span-2`}>
                <span className={LABEL}>{COPY.trendLabel}</span>
                {trend && Direction ? (
                    <span className="flex items-center justify-between gap-3 md:justify-end">
                        <span className="text-text flex items-center gap-1 tabular-nums">
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
                    MISSING
                )}
            </td>
        </tr>
    );
}
