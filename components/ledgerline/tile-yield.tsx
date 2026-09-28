import MotionWrapper from "@/components/wrappers/motion-wrapper";
import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";
import { REVEAL } from "@/lib/ledgerline/constants";

export default function TileYield() {
    return (
        <MotionWrapper
            yOffset={REVEAL.offset}
            duration={REVEAL.seconds}
            delay={REVEAL.stagger * 2}
            className="surface-card flex flex-col gap-3 p-8"
        >
            <span className="ledger-figure text-accent">{ACCOUNTS_COPY.yieldValue}</span>
            <h3 className="mt-2 text-lg font-medium text-text">{ACCOUNTS_COPY.yieldTitle}</h3>
            <p className="text-sm text-text-secondary">{ACCOUNTS_COPY.yieldDetail}</p>
        </MotionWrapper>
    );
}
