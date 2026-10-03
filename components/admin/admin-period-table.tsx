import DeltaChip from "@/components/common/delta-chip";
import { ADMIN_OVERVIEW_COPY, DELTA_COPY } from "@/lib/data/admin/overview";
import type { SeriesView } from "@/lib/types";
import { periodRows } from "@/lib/utils/admin-stats";

const COPY = ADMIN_OVERVIEW_COPY.series.breakdown;

const HEAD = "pb-2 font-normal";
const CELL = "py-1.5";

export default function AdminPeriodTable({ view }: { view: SeriesView }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <caption className="sr-only">{COPY.caption}</caption>
                <thead>
                    <tr className="text-text-muted text-xs">
                        <th scope="col" className={HEAD}>
                            {COPY.period}
                        </th>
                        <th scope="col" className={`${HEAD} text-right`}>
                            {COPY.signUps}
                        </th>
                        <th scope="col" className={`${HEAD} w-28 text-right`}>
                            {COPY.change}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {periodRows(view).map((row) => (
                        <tr key={row.label} className="border-border border-t">
                            <th
                                scope="row"
                                className={`${CELL} text-text-secondary font-normal whitespace-nowrap`}
                            >
                                {row.label}
                            </th>
                            <td
                                className={`${CELL} text-text text-right font-medium tabular-nums`}
                            >
                                {row.display}
                            </td>
                            <td className={`${CELL} text-right text-xs`}>
                                {row.partial ? (
                                    <span className="text-text-muted">
                                        {COPY.partial}
                                    </span>
                                ) : (
                                    <DeltaChip
                                        delta={row.delta}
                                        fallback={DELTA_COPY.dash}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
