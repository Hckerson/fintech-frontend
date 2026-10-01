import Link from "next/link";
import type { ReactNode } from "react";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import SignatureRule from "@/components/ledgerline/signature-rule";
import AuthPanel from "@/components/auth/auth-panel";
import { AUTH_SHELL_COPY } from "@/lib/data/auth/shell";

interface Props {
    statement: string;
    visual?: ReactNode;
    children: ReactNode;
}

export default function AuthShell({ statement, visual, children }: Props) {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="short:lg:py-8 relative flex flex-col px-6 py-6 sm:px-10 lg:p-12 xl:p-16">
                <div className="absolute inset-x-0 top-0 lg:hidden">
                    <SignatureRule className="h-6" play="mount" />
                </div>
                <div className="mx-auto flex w-full max-w-md flex-1 flex-col lg:max-w-none">
                    <LedgerLogo />
                    <main className="short:lg:py-4 flex flex-1 items-center py-8 lg:py-6">
                        <div className="w-full">{children}</div>
                    </main>
                    <nav
                        aria-label={AUTH_SHELL_COPY.footnoteLabel}
                        className="flex gap-6 text-sm"
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
                </div>
            </div>
            <AuthPanel
                statement={statement}
                caption={AUTH_SHELL_COPY.caption}
                visual={visual}
            />
        </div>
    );
}
