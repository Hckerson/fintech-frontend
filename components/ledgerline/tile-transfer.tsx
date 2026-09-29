import { Flash } from "@carbon/icons-react";
import { ACCOUNTS_COPY } from "@/lib/data/ledgerline/features";

export default function TileTransfer() {
    return (
        <div className="surface-card flex flex-col gap-3 p-8">
            <span className="border-border-dark text-text-secondary flex size-10 items-center justify-center rounded-full border">
                <Flash className="size-5" />
            </span>
            <h3 className="text-text mt-3 text-lg font-medium">
                {ACCOUNTS_COPY.transferTitle}
            </h3>
            <p className="text-text-secondary text-sm">
                {ACCOUNTS_COPY.transferDetail}
            </p>
        </div>
    );
}
