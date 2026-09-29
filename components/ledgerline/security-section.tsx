import {
    Activity,
    Catalog,
    Locked,
    Password,
    Security,
    UserMultiple,
    type CarbonIconType,
} from "@carbon/icons-react";
import SectionHeading from "@/components/ledgerline/section-heading";
import {
    SECURITY_CONTROLS,
    SECURITY_COPY,
} from "@/lib/data/ledgerline/closing";
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

const [FEATURED, ...REST] = SECURITY_CONTROLS;
const FeaturedIcon = ICONS[FEATURED.icon];

export default function SecuritySection() {
    return (
        <section
            id="security"
            aria-labelledby={TITLE_ID}
            className="ledger-section"
        >
            <div className="ledger-shell flex flex-col gap-14">
                <SectionHeading
                    id={TITLE_ID}
                    eyebrow={SECURITY_COPY.eyebrow}
                    title={SECURITY_COPY.title}
                    lead={SECURITY_COPY.lead}
                />
                <div className="grid gap-10 lg:grid-cols-5 lg:gap-16">
                    <div className="surface-card product-frame flex flex-col gap-6 p-8 lg:col-span-2 lg:p-10">
                        <FeaturedIcon
                            aria-hidden
                            className="text-accent size-8"
                        />
                        <h3 className="text-text mt-auto text-2xl font-medium tracking-tight">
                            {FEATURED.title}
                        </h3>
                        <p className="text-text-secondary">{FEATURED.detail}</p>
                    </div>
                    <ul className="flex flex-col lg:col-span-3">
                        {REST.map((control) => {
                            const Icon = ICONS[control.icon];
                            return (
                                <li
                                    key={control.id}
                                    className="border-border flex gap-5 border-t py-5 first:border-t-0 first:pt-0"
                                >
                                    <Icon
                                        aria-hidden
                                        className="text-text-muted mt-0.5 size-5 shrink-0"
                                    />
                                    <div className="grid flex-1 gap-1 sm:grid-cols-5 sm:gap-6">
                                        <h3 className="text-text font-medium sm:col-span-2">
                                            {control.title}
                                        </h3>
                                        <p className="text-text-secondary text-sm sm:col-span-3">
                                            {control.detail}
                                        </p>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                <p className="text-text-muted font-mono text-xs">
                    {SECURITY_COPY.note}
                </p>
            </div>
        </section>
    );
}
