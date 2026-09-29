import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import LedgerButton from "@/components/ledgerline/ledger-button";
import { NOT_FOUND_COPY } from "@/lib/data/status/not-found";
import { HELP_ROUTE, HOME_ROUTE } from "@/lib/constants";

export default function NotFoundPanel() {
    return (
        <section
            aria-labelledby="not-found-title"
            className="mx-auto flex max-w-3xl flex-col items-center gap-10 text-center"
        >
            <header className="flex flex-col items-center gap-5">
                <p className="text-text-muted font-mono text-xs tracking-[0.18em] uppercase">
                    {NOT_FOUND_COPY.eyebrow}
                </p>
                <h1 id="not-found-title" className="ledger-display text-text">
                    {NOT_FOUND_COPY.title}
                </h1>
                <p className="text-text-secondary max-w-xl text-lg">
                    {NOT_FOUND_COPY.lead}
                </p>
            </header>
            <div className="flex flex-wrap items-center justify-center gap-6">
                <LedgerButton href={HOME_ROUTE} tone="accent">
                    {NOT_FOUND_COPY.home}
                    <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                </LedgerButton>
                <Link
                    href={HELP_ROUTE}
                    className="text-text-secondary hover:text-text underline-offset-4 hover:underline"
                >
                    {NOT_FOUND_COPY.help}
                </Link>
            </div>
        </section>
    );
}
