import { Flash } from "@carbon/icons-react";
import MotionWrapper from "@/components/wrappers/motion-wrapper";
import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";
import { REVEAL } from "@/lib/ledgerline/constants";

export default function TileTransfer() {
    return (
        <MotionWrapper
            yOffset={REVEAL.offset}
            duration={REVEAL.seconds}
            delay={REVEAL.stagger}
            className="surface-card flex flex-col gap-3 p-8"
        >
            <span className="flex size-10 items-center justify-center rounded-full bg-accent-light text-accent">
                <Flash className="size-5" />
            </span>
            <h3 className="mt-3 text-lg font-medium text-text">{ACCOUNTS_COPY.transferTitle}</h3>
            <p className="text-sm text-text-secondary">{ACCOUNTS_COPY.transferDetail}</p>
        </MotionWrapper>
    );
}
