"use client";
import Link from "next/link";
import { useId, type MouseEvent } from "react";
import {
    Edit,
    OverflowMenuVertical,
    TrashCan,
    View,
} from "@carbon/icons-react";
import Button, { buttonClass } from "@/components/ui/button";
import Menu from "@/components/ui/menu";
import Tooltip from "@/components/ui/tooltip";
import { transferRoute } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    online: boolean;
    onOpen: (payee: Payee) => void;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

const ITEM = "aria-disabled:cursor-not-allowed aria-disabled:opacity-50";

const refocusTrigger = (event: MouseEvent<HTMLElement>) =>
    event.currentTarget
        .closest("[role='menu']")
        ?.parentElement?.querySelector<HTMLElement>("[aria-haspopup]")
        ?.focus();

export default function PayeeActions({
    payee,
    online,
    onOpen,
    onRename,
    onRemove,
}: Props) {
    const reasonId = useId();
    const removable = online && !payee.paymentInProgress;
    const reason = online
        ? payee.paymentInProgress
            ? PAYEE_COPY.reasons.paymentInProgress
            : null
        : PAYEE_COPY.reasons.offline;
    const items = [
        { label: PAYEE_COPY.details, icon: View, enabled: true, run: onOpen },
        {
            label: PAYEE_COPY.rename,
            icon: Edit,
            enabled: online,
            run: onRename,
        },
        {
            label: PAYEE_COPY.remove,
            icon: TrashCan,
            enabled: removable,
            run: onRemove,
        },
    ];

    return (
        <div className="flex items-center justify-end gap-1">
            {payee.status === "active" ? (
                <Link
                    href={transferRoute(payee.id)}
                    aria-label={PAYEE_COPY.payNamed(payee.name)}
                    className={buttonClass("quiet", "sm")}
                >
                    {PAYEE_COPY.pay}
                </Link>
            ) : (
                <Tooltip content={PAYEE_COPY.reasons.pendingVerification}>
                    <Button
                        tone="quiet"
                        size="sm"
                        aria-disabled
                        aria-describedby={reasonId}
                        aria-label={PAYEE_COPY.payNamed(payee.name)}
                    >
                        {PAYEE_COPY.pay}
                        <span id={reasonId} className="sr-only">
                            {PAYEE_COPY.reasons.pendingVerification}
                        </span>
                    </Button>
                </Tooltip>
            )}
            <Menu
                label={PAYEE_COPY.moreNamed(payee.name)}
                align="end"
                triggerClassName={buttonClass("ghost", "sm", "w-8 px-0")}
                trigger={
                    <OverflowMenuVertical
                        aria-hidden
                        className="size-4 shrink-0"
                    />
                }
            >
                {(close) => (
                    <>
                        {items.map(({ label, icon: Icon, enabled, run }) => (
                            <button
                                key={label}
                                type="button"
                                role="menuitem"
                                aria-disabled={!enabled}
                                className={ITEM}
                                onClick={(event) => {
                                    if (!enabled) return;
                                    refocusTrigger(event);
                                    close();
                                    run(payee);
                                }}
                            >
                                <Icon aria-hidden className="size-4 shrink-0" />
                                {label}
                            </button>
                        ))}
                        {reason ? (
                            <p className="border-border text-text-muted border-t px-2.5 py-2 text-xs">
                                {reason}
                            </p>
                        ) : null}
                    </>
                )}
            </Menu>
        </div>
    );
}
