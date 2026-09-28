import SectionHeading from "@/components/ledgerline/section-heading";
import ApprovalCard from "@/components/ledgerline/approval-card";
import { PAYMENT_POINTS, PAYMENTS_COPY } from "@/lib/data/ledgerline/features";

const TITLE_ID = "payments-title";

export default function PaymentsSection() {
    return (
        <section id="payments" aria-labelledby={TITLE_ID} className="ledger-section border-y border-border bg-background-alt">
            <div className="ledger-shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                <div className="flex flex-col gap-10">
                    <SectionHeading
                        id={TITLE_ID}
                        eyebrow={PAYMENTS_COPY.eyebrow}
                        title={PAYMENTS_COPY.title}
                        lead={PAYMENTS_COPY.lead}
                    />
                    <ul className="flex flex-col">
                        {PAYMENT_POINTS.map((point) => (
                            <li key={point.id} className="grid gap-1 border-t border-border py-5 sm:grid-cols-3 sm:gap-6">
                                <span className="font-medium text-text">{point.title}</span>
                                <span className="text-sm text-text-secondary sm:col-span-2">{point.detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <ApprovalCard />
            </div>
        </section>
    );
}
