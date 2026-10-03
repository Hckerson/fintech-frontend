"use client";
import { View, ViewOff } from "@carbon/icons-react";
import CopyButton from "@/components/ui/copy-button";
import { DASHBOARD_COPY } from "@/lib/data/dashboard/copy";
import { ACCOUNTS_COPY as COPY } from "@/lib/data/ledger/copy";
import {
    ACCOUNT_NUMBER_GROUP,
    REVEAL_WARNING_MS,
} from "@/lib/ledger/constants";
import type { Account, AccountReveal } from "@/lib/types";

interface Props {
    account: Account;
    reveal: AccountReveal | null;
}

const CONTROL =
    "text-text-muted hover:text-text focus-visible:outline-accent relative z-(--z-indices-dropdown) inline-flex size-5 cursor-pointer items-center justify-center rounded focus-visible:outline-2 disabled:cursor-wait disabled:opacity-50";

const grouped = (number: string) =>
    number.match(new RegExp(`.{1,${ACCOUNT_NUMBER_GROUP}}`, "g"))?.join(" ") ??
    number;

export default function AccountNumber({ account, reveal }: Props) {
    const { id, name, last4 } = account;
    const full = reveal?.shown?.accountId === id ? reveal.shown.number : null;

    return (
        <span className="inline-flex flex-wrap items-center gap-1">
            <span className="inline-flex items-center gap-1 whitespace-nowrap">
                {full ? (
                    <span className="text-text font-mono select-all">
                        {grouped(full)}
                    </span>
                ) : (
                    <>
                        <span aria-hidden className="font-mono">
                            ••{last4}
                        </span>
                        <span className="sr-only">
                            {DASHBOARD_COPY.accounts.ending(last4)}
                        </span>
                    </>
                )}
                <CopyButton
                    value={full ?? COPY.masked(name, last4)}
                    label={full ? COPY.copyFull(name) : COPY.copyNumber(name)}
                    copied={COPY.copied}
                    failed={COPY.copyFailed}
                />
                {reveal ? (
                    <button
                        type="button"
                        aria-pressed={Boolean(full)}
                        aria-label={full ? COPY.hide(name) : COPY.reveal(name)}
                        disabled={reveal.pendingId === id}
                        onClick={() =>
                            full ? reveal.hide() : reveal.reveal(id)
                        }
                        onKeyDown={(event) =>
                            event.key === "Escape" && full && reveal.hide()
                        }
                        className={CONTROL}
                    >
                        {full ? (
                            <ViewOff aria-hidden className="size-3.5" />
                        ) : (
                            <View aria-hidden className="size-3.5" />
                        )}
                    </button>
                ) : null}
            </span>
            {full && reveal?.warning ? (
                <span className="text-warning relative z-(--z-indices-dropdown) inline-flex items-center gap-1">
                    {COPY.hiding(REVEAL_WARNING_MS / 1_000)}
                    <button
                        type="button"
                        onClick={reveal.extend}
                        className="text-text cursor-pointer underline underline-offset-4"
                    >
                        {COPY.keep}
                    </button>
                </span>
            ) : null}
            {reveal?.failedId === id ? (
                <span role="alert" className="text-error">
                    {COPY.revealFailed}
                </span>
            ) : null}
        </span>
    );
}
