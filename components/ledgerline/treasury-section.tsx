import SectionHeading from "@/components/ledgerline/section-heading";
import ForecastChart from "@/components/ledgerline/forecast-chart";
import { TREASURY_COPY, TREASURY_FIGURES } from "@/lib/data/ledgerline/treasury";

const TITLE_ID = "treasury-title";

export default function TreasurySection() {
    return (
        <section id="treasury" aria-labelledby={TITLE_ID} className="ledger-section border-y border-border bg-background-alt">
            <div className="ledger-shell flex flex-col gap-14">
                <SectionHeading
                    id={TITLE_ID}
                    eyebrow={TREASURY_COPY.eyebrow}
                    title={TREASURY_COPY.title}
                    lead={TREASURY_COPY.lead}
                    align="center"
                />
                <div className="surface-card product-frame flex flex-col gap-10 bg-background p-6 sm:p-10">
                    <ForecastChart />
                    <dl className="grid gap-8 border-t border-border pt-8 sm:grid-cols-3">
                        {TREASURY_FIGURES.map((figure) => (
                            <div key={figure.id} className="flex flex-col-reverse gap-2">
                                <dt className="text-sm text-text-muted">{figure.label}</dt>
                                <dd className="ledger-figure text-text">{figure.value}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
                <p className="text-center font-mono text-xs text-text-muted">{TREASURY_COPY.note}</p>
            </div>
        </section>
    );
}
