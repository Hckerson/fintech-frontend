import clsx from "clsx";
import { Checkmark } from "@carbon/icons-react";
import LedgerButton from "@/components/ledgerline/ledger-button";
import { PRICING_COPY } from "@/lib/data/ledgerline/closing";
import { LEDGER_BRAND } from "@/lib/data/ledgerline/brand";
import type { Plan } from "@/lib/types";

interface Props {
    plan: Plan;
}

export default function PlanCard({ plan }: Props) {
    return (
        <li
            className={clsx(
                "surface-card flex flex-col gap-6 p-8",
                plan.featured &&
                    "product-frame border-accent bg-background-muted lg:py-12",
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-text text-xl font-medium">{plan.name}</h3>
                {plan.featured && (
                    <span className="bg-accent-light text-accent rounded-full px-3 py-1 text-xs">
                        {PRICING_COPY.featured}
                    </span>
                )}
            </div>
            <p className="text-text-secondary text-sm">{plan.summary}</p>
            <p className="border-border flex items-baseline gap-2 border-y py-5">
                <span className="ledger-figure text-text">{plan.price}</span>
                <span className="text-text-muted text-sm">{plan.cadence}</span>
            </p>
            <ul className="text-text-secondary flex flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                        <Checkmark
                            aria-hidden
                            className="text-text-muted size-4 shrink-0"
                        />
                        {feature}
                    </li>
                ))}
            </ul>
            <LedgerButton
                href={LEDGER_BRAND.open.href}
                tone={plan.featured ? "accent" : "ghost"}
                className="mt-2"
            >
                {PRICING_COPY.cta} {plan.name}
            </LedgerButton>
        </li>
    );
}
