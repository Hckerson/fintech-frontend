import Meter from "@/components/ui/meter";
import { RUNWAY_COPY } from "@/lib/data/insights/runway";
import type { RunwayResult as Result } from "@/lib/utils/runway";

interface Props {
    result: Result | null;
    target: number;
    outlook: string;
    assumptions: string;
    announcement: string;
}

export default function RunwayResult({
    result,
    target,
    outlook,
    assumptions,
    announcement,
}: Props) {
    const covered = result?.months ?? target;

    return (
        <section
            aria-labelledby="runway-result"
            className="flex flex-col gap-4"
        >
            <div className="flex flex-wrap items-center gap-3">
                <span className="micro-label border-highlight/40 text-highlight rounded-full border px-3 py-1">
                    {RUNWAY_COPY.estimate}
                </span>
                <span className="text-text-muted text-xs">
                    {RUNWAY_COPY.disclaimer}
                </span>
            </div>
            <div className="flex flex-col gap-3">
                <h2 id="runway-result" className="ledger-display text-text">
                    {!result
                        ? "—"
                        : result.months === null
                          ? RUNWAY_COPY.notRunningOut
                          : RUNWAY_COPY.months(result.months)}
                </h2>
                <p className="text-text text-lg">{outlook}</p>
                {result ? (
                    <p className="text-text-secondary max-w-2xl text-sm">
                        {assumptions}
                    </p>
                ) : null}
            </div>
            {result ? (
                <Meter
                    value={covered}
                    max={target}
                    label={RUNWAY_COPY.meter}
                    valueText={RUNWAY_COPY.meterValue(covered, target)}
                />
            ) : null}
            <p aria-live="polite" className="sr-only">
                {announcement}
            </p>
        </section>
    );
}
