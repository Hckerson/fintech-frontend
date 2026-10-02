"use client";
import Link from "next/link";
import type { MouseEvent } from "react";
import { Edit, OverflowMenuVertical, TrashCan } from "@carbon/icons-react";
import Button, { buttonClass } from "@/components/ui/button";
import Menu from "@/components/ui/menu";
import { transferRoute } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee;
    online: boolean;
    reasonId: string;
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
    reasonId,
    onRename,
    onRemove,
}: Props) {
    const removable = online && !payee.paymentInProgress;
    const reason = online
        ? payee.paymentInProgress
            ? PAYEE_COPY.reasons.paymentInProgress
            : null
        : PAYEE_COPY.reasons.offline;

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
                <Button
                    tone="quiet"
                    size="sm"
                    aria-disabled
                    aria-describedby={reasonId}
                    aria-label={PAYEE_COPY.payNamed(payee.name)}
                >
                    {PAYEE_COPY.pay}
                </Button>
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
                        <button
                            type="button"
                            role="menuitem"
                            aria-disabled={!online}
                            className={ITEM}
                            onClick={(event) => {
                                if (!online) return;
                                refocusTrigger(event);
                                close();
                                onRename(payee);
                            }}
                        >
                            <Edit aria-hidden className="size-4 shrink-0" />
                            {PAYEE_COPY.rename}
                        </button>
                        <button
                            type="button"
                            role="menuitem"
                            aria-disabled={!removable}
                            className={ITEM}
                            onClick={(event) => {
                                if (!removable) return;
                                refocusTrigger(event);
                                close();
                                onRemove(payee);
                            }}
                        >
                            <TrashCan aria-hidden className="size-4 shrink-0" />
                            {PAYEE_COPY.remove}
                        </button>
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
