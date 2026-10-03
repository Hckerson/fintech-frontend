import { NOT_AVAILABLE } from "@/lib/constants";
import { ADMIN_OVERVIEW_COPY } from "@/lib/data/admin/overview";
import type { SeriesView, StatsPeriod } from "@/lib/types";
import { formatAverage, formatCount } from "@/lib/utils/admin-stats";

interface Props {
    view: SeriesView;
    period: StatsPeriod;
}

const COPY = ADMIN_OVERVIEW_COPY.series.stats;

export default function AdminSeriesStats({ view, period }: Props) {
    const stats = [
        { term: COPY.total, detail: formatCount(view.total), note: null },
        {
            term: COPY.peak,
            detail: view.peak ? formatCount(view.peak.value) : null,
            note: view.peak?.label ?? null,
        },
        {
            term: COPY.average[period],
            detail: formatAverage(view.total, view.points.length),
            note: null,
        },
    ];

    return (
        <dl aria-label={COPY.label} className="flex flex-col text-sm">
            {stats.map(({ term, detail, note }) => (
                <div
                    key={term}
                    className="border-border flex items-baseline justify-between gap-3 border-b py-2"
                >
                    <dt className="text-text-muted">{term}</dt>
                    <dd className="text-text flex items-baseline gap-2 font-medium tabular-nums">
                        {note ? (
                            <span className="text-text-muted text-xs font-normal">
                                {note}
                            </span>
                        ) : null}
                        {detail ?? NOT_AVAILABLE}
                    </dd>
                </div>
            ))}
        </dl>
    );
}
