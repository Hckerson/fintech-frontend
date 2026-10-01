import SectionHeading from "@/components/ledgerline/section-heading";
import PlanCard from "@/components/ledgerline/plan-card";
import { PLANS, PRICING_COPY } from "@/lib/data/ledgerline/closing";

const TITLE_ID = "pricing-title";

export default function PricingSection() {
    return (
        <section id="pricing" aria-labelledby={TITLE_ID} className="ledger-section">
            <div className="ledger-shell flex flex-col gap-14">
                <SectionHeading id={TITLE_ID} eyebrow={PRICING_COPY.eyebrow} title={PRICING_COPY.title} align="center" />
                <ul className="grid items-center gap-5 lg:grid-cols-3">
                    {PLANS.map((plan) => (
                        <PlanCard key={plan.id} plan={plan} />
                    ))}
                </ul>
                <p className="text-center font-mono text-xs text-text-muted">{PRICING_COPY.note}</p>
            </div>
        </section>
    );
}
