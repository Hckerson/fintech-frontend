import DeltaChip from "@/components/common/delta-chip";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY, DELTA_COPY } from "@/lib/data/admin/overview";
import type { SeriesView } from "@/lib/types";
import { periodRows } from "@/lib/utils/admin-stats";

const COPY = ADMIN_OVERVIEW_COPY.series.breakdown;

const HEAD = "py-2 font-medium";

const percent = new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: "percent",
    maximumFractionDigits: 0,
});

export default function AdminPeriodTable({ view }: { view: SeriesView }) {
    return (
        <div className="max-h-80 overflow-auto">
            <table className="w-full text-left text-xs">
                <caption className="sr-only">{COPY.caption}</caption>
                <thead className="bg-background-alt text-text-muted sticky top-0 text-xs">
                    <tr>
                        <th scope="col" className={HEAD}>
                            {COPY.period}
                        </th>
                        <th scope="col" className={`${HEAD} text-right`}>
                            {COPY.signUps}
                        </th>
                        <th
                            scope="col"
                            className={`${HEAD} hidden pl-6 sm:table-cell`}
                        >
                            {COPY.share}
                        </th>
                        <th scope="col" className={`${HEAD} text-right`}>
                            {COPY.change}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {periodRows(view).map((row) => (
                        <tr key={row.label} className="border-border border-t">
                            <th
                                scope="row"
                                className="text-text-secondary py-2 font-normal whitespace-nowrap"
                            >
                                {row.label}
                            </th>
                            <td className="text-text py-2 text-right font-mono tabular-nums">
                                {row.display}
                            </td>
                            <td className="hidden py-2 pl-6 sm:table-cell">
                                <span className="flex items-center gap-2">
                                    <span
                                        aria-hidden
                                        className="bg-background-muted h-1.5 w-full max-w-40 overflow-hidden rounded-full"
                                    >
                                        <span
                                            className="bg-accent block h-full rounded-full"
                                            style={{
                                                width: percent.format(
                                                    row.share,
                                                ),
                                            }}
                                        />
                                    </span>
                                    <span className="text-text-muted font-mono tabular-nums">
                                        {percent.format(row.share)}
                                    </span>
                                </span>
                            </td>
                            <td className="py-2 text-right">
                                <DeltaChip
                                    delta={row.delta}
                                    fallback={DELTA_COPY.dash}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
