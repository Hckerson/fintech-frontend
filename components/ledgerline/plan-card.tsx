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
                plan.featured && "product-frame border-accent bg-background-muted lg:py-12",
            )}
        >
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-medium text-text">{plan.name}</h3>
                {plan.featured && (
                    <span className="rounded-full bg-accent-light px-3 py-1 text-xs text-accent">{PRICING_COPY.featured}</span>
                )}
            </div>
            <p className="text-sm text-text-secondary">{plan.summary}</p>
            <p className="flex items-baseline gap-2 border-y border-border py-5">
                <span className="ledger-figure text-text">{plan.price}</span>
                <span className="text-sm text-text-muted">{plan.cadence}</span>
            </p>
            <ul className="flex flex-col gap-3 text-sm text-text-secondary">
                {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                        <Checkmark aria-hidden className="size-4 shrink-0 text-accent" />
                        {feature}
                    </li>
                ))}
            </ul>
            <LedgerButton href={LEDGER_BRAND.open.href} tone={plan.featured ? "accent" : "ghost"} className="mt-2">
                {PRICING_COPY.cta} {plan.name}
            </LedgerButton>
        </li>
    );
}
