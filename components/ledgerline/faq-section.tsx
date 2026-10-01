"use client";
import { useState } from "react";
import SectionHeading from "@/components/ledgerline/section-heading";
import FaqRow from "@/components/ledgerline/faq-row";
import { FAQ_COPY, FAQS } from "@/lib/data/ledgerline/closing";

const TITLE_ID = "faq-title";

export default function FaqSection() {
    const [openId, setOpenId] = useState<string | null>(FAQS[0].id);

    return (
        <section id="faq" aria-labelledby={TITLE_ID} className="ledger-section border-t border-border">
            <div className="ledger-shell grid gap-12 lg:grid-cols-5 lg:gap-20">
                <SectionHeading id={TITLE_ID} eyebrow={FAQ_COPY.eyebrow} title={FAQ_COPY.title} className="lg:col-span-2" />
                <ul className="border-t border-border lg:col-span-3">
                    {FAQS.map((item) => (
                        <FaqRow
                            key={item.id}
                            item={item}
                            open={openId === item.id}
                            onToggle={() => setOpenId((current) => (current === item.id ? null : item.id))}
                        />
                    ))}
                </ul>
            </div>
        </section>
    );
}
