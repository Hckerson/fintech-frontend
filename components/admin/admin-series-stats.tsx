import Metric from "@/components/common/metric";
import NumberDisplay from "@/components/ui/number-display";
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
        { label: COPY.total, text: formatCount(view.total), note: undefined },
        {
            label: COPY.peak,
            text: view.peak ? formatCount(view.peak.value) : null,
            note: view.peak?.label,
        },
        {
            label: COPY.average[period],
            text: formatAverage(view.total, view.points.length),
            note: undefined,
        },
    ];

    return (
        <div
            role="group"
            aria-label={COPY.label}
            className="divide-border grid grid-cols-3 divide-x [&>*+*]:pl-4"
        >
            {stats.map(({ label, text, note }) => (
                <Metric
                    key={label}
                    label={label}
                    value={<NumberDisplay text={text} />}
                    note={note}
                />
            ))}
        </div>
    );
}
