import Link from "next/link";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import { FOOTER_COLUMNS, FOOTER_COPY } from "@/lib/data/ledgerline/footer";

export default function LedgerFooter() {
    return (
        <footer className="border-border bg-background-alt border-t">
            <div className="ledger-shell flex flex-col gap-14 py-20">
                <div className="grid gap-12 lg:grid-cols-12">
                    <div className="flex flex-col gap-4 lg:col-span-5">
                        <LedgerLogo />
                        <p className="text-text-muted max-w-xs text-sm">
                            {FOOTER_COPY.tagline}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
                        {FOOTER_COLUMNS.map((column) => (
                            <nav
                                key={column.id}
                                aria-label={column.title}
                                className="flex flex-col gap-3"
                            >
                                <p className="text-text text-sm font-medium">
                                    {column.title}
                                </p>
                                {column.links.map((link) => (
                                    <Link
                                        key={link.id}
                                        href={link.href}
                                        className="text-text-secondary hover:text-text text-sm transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                        ))}
                    </div>
                </div>
                <div className="border-border flex flex-col gap-4 border-t pt-6 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
                    <p className="text-text-muted max-w-3xl text-xs leading-relaxed">
                        {FOOTER_COPY.disclosure}
                    </p>
                    <p className="text-text-muted shrink-0 text-xs">
                        {FOOTER_COPY.rights}
                    </p>
                </div>
            </div>
        </footer>
    );
}
