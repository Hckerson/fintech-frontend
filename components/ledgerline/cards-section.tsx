import SectionHeading from "@/components/ledgerline/section-heading";
import MetalCard from "@/components/ledgerline/metal-card";
import CardControls from "@/components/ledgerline/card-controls";
import { CARDS_COPY } from "@/lib/data/ledgerline/features";

const TITLE_ID = "cards-title";

export default function CardsSection() {
    return (
        <section id="cards" aria-labelledby={TITLE_ID} className="ledger-section">
            <div className="ledger-shell grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
                <div className="order-2 flex flex-col gap-8 lg:order-1">
                    <MetalCard />
                    <p className="font-mono text-xs text-text-muted">{CARDS_COPY.note}</p>
                </div>
                <div className="order-1 flex flex-col gap-10 lg:order-2">
                    <SectionHeading id={TITLE_ID} eyebrow={CARDS_COPY.eyebrow} title={CARDS_COPY.title} lead={CARDS_COPY.lead} />
                    <CardControls />
                </div>
            </div>
        </section>
    );
}
