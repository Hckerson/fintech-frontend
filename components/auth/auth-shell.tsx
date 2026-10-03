import Link from "next/link";
import type { ReactNode } from "react";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import SignatureRule from "@/components/ledgerline/signature-rule";
import AuthPanel from "@/components/auth/auth-panel";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";

interface Props {
    statement: string;
    children: ReactNode;
}

export default function AuthShell({ statement, children }: Props) {
    return (
        <div className="grid min-h-svh lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,42rem)_minmax(0,1fr)]">
            <div className="short:lg:py-6 relative flex flex-col px-6 py-6 sm:px-10 lg:px-12 lg:py-10">
                <div className="absolute inset-x-0 top-0 lg:hidden">
                    <SignatureRule className="h-6" play="mount" />
                </div>
                <LedgerLogo />
                <main className="short:py-6 flex flex-1 items-center justify-center py-10">
                    <div className="w-full max-w-104">{children}</div>
                </main>
                <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-sm">
                    <nav
                        aria-label={AUTH_SHELL_COPY.footnoteLabel}
                        className="flex gap-6"
                    >
                        {AUTH_SHELL_COPY.footnote.map((link) => (
                            <Link
                                key={link.id}
                                href={link.href}
                                className="text-text-muted hover:text-text transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <p className="text-text-muted font-mono text-xs">
                        {AUTH_SHELL_COPY.caption}
                    </p>
                </div>
            </div>
            <AuthPanel statement={statement} />
        </div>
    );
}
