import Link from "next/link";
import Amount from "@/components/common/amount";
import AsOf from "@/components/common/as-of";
import TrendLine from "@/components/ui/trend-line";
import { SPARKLINE } from "@/lib/dashboard/constants";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import type { CashPosition } from "@/lib/types";
import { plottable, trendOf, trendPercent } from "@/lib/utils/trend";
import { ACCOUNTS_ROUTE } from "@/lib/workspace/constants";

interface Props {
    position: CashPosition;
    timeZone: string;
}

const COPY = DASHBOARD_COPY.cash;

export default function CashPositionTotal({ position, timeZone }: Props) {
    const { currency, available, current, netToday, includesFrozen } = position;
    const trend = trendOf(position.trend);
    const line = plottable(position.trend);

    return (
        <div className="flex min-w-0 flex-col gap-2">
            <Link
                href={ACCOUNTS_ROUTE}
                className="text-text-muted hover:text-text w-fit text-xs underline-offset-4 hover:underline"
            >
                {COPY.available(currency)}
            </Link>
            <Amount
                {...available}
                className="ledger-figure text-text break-words"
            />
            <p className="text-text-secondary text-sm">
                {COPY.current}{" "}
                <Amount {...current} className="text-text tabular-nums" />
            </p>
            {netToday ? (
                <p className="text-text-secondary text-sm">
                    {COPY.netToday}{" "}
                    <Amount
                        {...netToday}
                        display="signed"
                        className="text-text tabular-nums"
                    />
                </p>
            ) : (
                <p className="text-text-muted text-sm">{COPY.netUnavailable}</p>
            )}
            {trend ? (
                <div className="flex flex-wrap items-center gap-3">
                    {line ? <TrendLine values={line} box={SPARKLINE} /> : null}
                    <p className="text-text-secondary text-xs">
                        {COPY.trend(trend, trendPercent(trend, COPY.ceiling))}
                    </p>
                </div>
            ) : null}
            <p className="text-text-muted text-xs">
                {includesFrozen ? COPY.frozen : COPY.open}
            </p>
            <AsOf asOf={position.asOf} timeZone={timeZone} />
        </div>
    );
}
