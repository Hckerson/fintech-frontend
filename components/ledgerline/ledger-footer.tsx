import Link from "next/link";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import { FOOTER_COLUMNS, FOOTER_COPY } from "@/lib/data/ledgerline/closing";

export default function LedgerFooter() {
    return (
        <footer className="border-t border-border bg-background-alt">
            <div className="ledger-shell grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex flex-col gap-4 lg:col-span-2">
                    <LedgerLogo />
                    <p className="max-w-xs text-sm text-text-muted">{FOOTER_COPY.tagline}</p>
                </div>
                {FOOTER_COLUMNS.map((column) => (
                    <nav key={column.id} aria-label={column.title} className="flex flex-col gap-3">
                        <p className="font-mono text-xs tracking-[0.14em] text-text-muted uppercase">{column.title}</p>
                        {column.links.map((link) => (
                            <Link key={link.id} href={link.href} className="text-sm text-text-secondary transition-colors hover:text-text">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                ))}
            </div>
            <div className="ledger-shell border-t border-border py-8">
                <p className="max-w-3xl text-xs leading-relaxed text-text-muted">{FOOTER_COPY.disclosure}</p>
                <p className="mt-4 font-mono text-xs text-text-muted">{FOOTER_COPY.rights}</p>
            </div>
        </footer>
    );
}
