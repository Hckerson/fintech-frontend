import clsx from "clsx";
import { Activity, Catalog, Locked, Password, Security, UserMultiple, type CarbonIconType } from "@carbon/icons-react";
import SectionHeading from "@/components/ledgerline/section-heading";
import MotionWrapper from "@/components/wrappers/motion-wrapper";
import { SECURITY_CONTROLS, SECURITY_COPY } from "@/lib/data/ledgerline/closing";
import { REVEAL } from "@/lib/ledgerline/constants";
import type { SecurityIcon } from "@/lib/types";

const TITLE_ID = "security-title";

const ICONS: Record<SecurityIcon, CarbonIconType> = {
    approvals: UserMultiple,
    roles: Password,
    audit: Catalog,
    keys: Locked,
    funds: Security,
    monitoring: Activity,
};

export default function SecuritySection() {
    return (
        <section id="security" aria-labelledby={TITLE_ID} className="ledger-section border-y border-border bg-background-alt">
            <div className="ledger-shell flex flex-col gap-14">
                <SectionHeading id={TITLE_ID} eyebrow={SECURITY_COPY.eyebrow} title={SECURITY_COPY.title} lead={SECURITY_COPY.lead} />
                <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
                    {SECURITY_CONTROLS.map((control, index) => {
                        const Icon = ICONS[control.icon];
                        const featured = index === 0;
                        return (
                            <MotionWrapper
                                key={control.id}
                                yOffset={REVEAL.offset}
                                duration={REVEAL.seconds}
                                delay={index * REVEAL.stagger}
                                className={clsx("flex flex-col gap-4 p-8", featured ? "bg-accent-light" : "bg-background-alt")}
                            >
                                <Icon aria-hidden className={clsx("size-6", featured ? "text-accent" : "text-text-secondary")} />
                                <h3 className="text-lg font-medium text-text">{control.title}</h3>
                                <p className="text-sm text-text-secondary">{control.detail}</p>
                            </MotionWrapper>
                        );
                    })}
                </div>
                <p className="font-mono text-xs text-text-muted">{SECURITY_COPY.note}</p>
            </div>
        </section>
    );
}
