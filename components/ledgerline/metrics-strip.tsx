import MotionWrapper from "@/components/wrappers/motion-wrapper";
import { METRICS, METRICS_NOTE } from "@/lib/data/ledgerline/brand";
import { REVEAL } from "@/lib/ledgerline/constants";

export default function MetricsStrip() {
    return (
        <section aria-label={METRICS_NOTE} className="ledger-shell border-y border-border py-12">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                {METRICS.map((metric, index) => (
                    <MotionWrapper
                        key={metric.id}
                        yOffset={REVEAL.offset}
                        duration={REVEAL.seconds}
                        delay={index * REVEAL.stagger}
                        className="flex flex-col-reverse gap-2 lg:border-l lg:border-border lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                    >
                        <dt className="text-sm text-text-muted">{metric.label}</dt>
                        <dd className="ledger-figure text-text">{metric.value}</dd>
                    </MotionWrapper>
                ))}
            </dl>
            <p className="mt-8 font-mono text-xs text-text-muted">{METRICS_NOTE}</p>
        </section>
    );
}
