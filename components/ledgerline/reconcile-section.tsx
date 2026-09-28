import SectionHeading from "@/components/ledgerline/section-heading";
import MatchedRow from "@/components/ledgerline/matched-row";
import { MATCHED_ENTRIES, RECONCILE_COPY } from "@/lib/data/ledgerline/features";

const TITLE_ID = "reconcile-title";

export default function ReconcileSection() {
    return (
        <section aria-labelledby={TITLE_ID} className="ledger-section">
            <div className="ledger-shell grid items-start gap-14 lg:grid-cols-5 lg:gap-20">
                <SectionHeading
                    id={TITLE_ID}
                    eyebrow={RECONCILE_COPY.eyebrow}
                    title={RECONCILE_COPY.title}
                    lead={RECONCILE_COPY.lead}
                    className="lg:sticky lg:top-28 lg:col-span-2"
                />
                <div className="surface-card overflow-hidden lg:col-span-3">
                    <div className="flex items-center justify-between border-b border-border px-6 py-4 text-sm">
                        <span className="font-medium text-text">
                            {MATCHED_ENTRIES.length} {RECONCILE_COPY.progress}
                        </span>
                        <span className="font-mono text-xs text-text-muted">{RECONCILE_COPY.note}</span>
                    </div>
                    <ul>
                        {MATCHED_ENTRIES.map((entry, index) => (
                            <MatchedRow key={entry.id} entry={entry} index={index} />
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
