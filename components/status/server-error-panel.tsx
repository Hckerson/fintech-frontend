"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Copy, Renew } from "@carbon/icons-react";
import LedgerButton, {
    ledgerButtonClass,
} from "@/components/ledgerline/ledger-button";
import StatusLine from "@/components/status/status-line";
import { useOnline } from "@/lib/hooks/use-online";
import { SERVER_ERROR_COPY as COPY } from "@/lib/data/status/server-error";
import type { ErrorBoundaryProps } from "@/lib/types";
import { HELP_ROUTE, HOME_ROUTE } from "@/lib/constants";

const retriedAcrossRemounts = new Set<string>();

interface Props extends ErrorBoundaryProps {
    home?: { label: string; href: string };
}

export default function ServerErrorPanel({
    error,
    reset,
    home = { label: COPY.home, href: HOME_ROUTE },
}: Props) {
    const router = useRouter();
    const online = useOnline();
    const [pending, startTransition] = useTransition();
    const [copied, setCopied] = useState(false);
    const key = error.digest ?? error.message;
    const [again] = useState(() => retriedAcrossRemounts.has(key));
    const copy = online ? COPY[again ? "again" : "first"] : COPY.offline;

    const retry = () => {
        retriedAcrossRemounts.add(key);
        startTransition(() => {
            router.refresh();
            reset();
        });
    };

    const copyReference = async () => {
        await navigator.clipboard.writeText(error.digest ?? "");
        setCopied(true);
    };

    return (
        <section
            aria-labelledby="server-error-title"
            className="ledger-shell grid flex-1 content-center items-center gap-16 pb-(--ledger-gutter) lg:grid-cols-2"
        >
            <title>{COPY.metaTitle}</title>
            <div className="flex flex-col gap-10">
                <header className="flex flex-col gap-5">
                    <p className="text-error font-mono text-xs tracking-[0.18em] uppercase">
                        {COPY.eyebrow}
                    </p>
                    <h1
                        id="server-error-title"
                        className="ledger-display text-text"
                    >
                        {copy.title}
                    </h1>
                    <p
                        role="status"
                        className="text-text-secondary max-w-xl text-lg"
                    >
                        {copy.lead}
                    </p>
                </header>
                <div className="flex flex-wrap items-center gap-6">
                    {again ? (
                        <LedgerButton href={HELP_ROUTE} tone="accent">
                            {COPY.help}
                        </LedgerButton>
                    ) : null}
                    <button
                        type="button"
                        onClick={retry}
                        disabled={pending}
                        className={ledgerButtonClass(
                            again ? "ghost" : "accent",
                            "lg",
                            "cursor-pointer disabled:opacity-70",
                        )}
                    >
                        <Renew
                            aria-hidden
                            className={
                                pending ? "size-4 animate-spin" : "size-4"
                            }
                        />
                        {pending ? COPY.retrying : COPY.retry}
                    </button>
                    <Link
                        href={home.href}
                        className="text-text-secondary hover:text-text underline-offset-4 hover:underline"
                    >
                        {home.label}
                    </Link>
                    {again ? null : (
                        <Link
                            href={HELP_ROUTE}
                            className="text-text-secondary hover:text-text underline-offset-4 hover:underline"
                        >
                            {COPY.help}
                        </Link>
                    )}
                </div>
            </div>
            <StatusLine variant="failed">
                <span className="text-error tracking-[0.12em] uppercase">
                    {COPY.tag}
                </span>
                {error.digest ? (
                    <span className="text-text-muted flex items-center gap-2">
                        {COPY.reference}
                        <span className="text-text">{error.digest}</span>
                        <button
                            type="button"
                            onClick={copyReference}
                            aria-label={COPY.copy}
                            className="hover:text-text inline-flex cursor-pointer items-center gap-1 transition-colors"
                        >
                            <Copy aria-hidden className="size-4" />
                            {copied ? COPY.copied : null}
                        </button>
                    </span>
                ) : null}
            </StatusLine>
        </section>
    );
}
