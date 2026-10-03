"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { CheckmarkFilled } from "@carbon/icons-react";
import TransferDetails from "@/components/payments/transfer-details";
import Button, { buttonClass } from "@/components/ui/button";
import StatusLabel from "@/components/ui/status-label";
import { PAYMENTS_ROUTE } from "@/lib/constants";
import { TRANSFER_COPY } from "@/lib/data/payments/transfer-copy";
import type { Transfer } from "@/lib/types";
import { CALENDAR_DAY, zonedLabel } from "@/lib/utils/zoned-time";
import { pendingTransactionsRoute } from "@/lib/workspace/constants";

interface Props {
    transfer: Transfer;
    onAnother: () => void;
}

const COPY = TRANSFER_COPY.result;

export default function TransferResult({ transfer, onAnother }: Props) {
    const heading = useRef<HTMLHeadingElement>(null);

    useEffect(() => heading.current?.focus(), []);

    return (
        <section
            aria-labelledby="transfer-result"
            className="surface-card flex max-w-2xl min-w-0 flex-col gap-4 p-4"
        >
            <div className="flex items-start gap-3">
                <CheckmarkFilled
                    aria-hidden
                    className="text-success mt-0.5 size-5 shrink-0"
                />
                <div className="flex flex-col gap-1">
                    <h2
                        ref={heading}
                        id="transfer-result"
                        tabIndex={-1}
                        className="text-text flex flex-wrap items-center gap-2 text-sm font-medium focus:outline-none"
                    >
                        {COPY.title}
                        <StatusLabel label={COPY.status} severity="attention" />
                    </h2>
                    <p className="text-text-secondary text-sm">
                        {COPY.lead(
                            zonedLabel(
                                transfer.settlesOn,
                                "UTC",
                                CALENDAR_DAY,
                            ) ?? transfer.settlesOn,
                        )}
                    </p>
                    <p className="text-text-secondary text-sm">
                        {COPY.reference}{" "}
                        <span className="text-text font-mono select-all">
                            {transfer.reference}
                        </span>
                    </p>
                </div>
            </div>
            <TransferDetails {...transfer} />
            <div className="border-border flex flex-wrap justify-end gap-2 border-t pt-4">
                <Link
                    href={PAYMENTS_ROUTE}
                    className={buttonClass("ghost", "lg")}
                >
                    {COPY.payees}
                </Link>
                <Link
                    href={pendingTransactionsRoute(transfer.fromAccountId)}
                    className={buttonClass("quiet", "lg")}
                >
                    {COPY.view}
                </Link>
                <Button size="lg" onClick={onAnother}>
                    {COPY.another}
                </Button>
            </div>
        </section>
    );
}
