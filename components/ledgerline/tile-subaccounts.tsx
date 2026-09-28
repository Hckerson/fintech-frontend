import MotionWrapper from "@/components/wrappers/motion-wrapper";
import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";
import { REVEAL } from "@/lib/ledgerline/constants";

export default function TileSubaccounts() {
    return (
        <MotionWrapper
            yOffset={REVEAL.offset}
            duration={REVEAL.seconds}
            delay={REVEAL.stagger * 3}
            className="surface-card flex flex-col gap-6 p-8 lg:col-span-3 lg:flex-row lg:items-center lg:justify-between"
        >
            <div className="flex max-w-md flex-col gap-2">
                <h3 className="text-lg font-medium text-text">{ACCOUNTS_COPY.subTitle}</h3>
                <p className="text-sm text-text-secondary">{ACCOUNTS_COPY.subDetail}</p>
            </div>
            <ul className="flex flex-wrap gap-2">
                {ACCOUNTS_COPY.subAccounts.map((name) => (
                    <li key={name} className="rounded-full border border-border-dark px-4 py-2 text-sm text-text-secondary">
                        {name}
                    </li>
                ))}
            </ul>
        </MotionWrapper>
    );
}
