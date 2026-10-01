import Link from "next/link";
import { ArrowRight, ArrowUp } from "@carbon/icons-react";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import LedgerButton from "@/components/ledgerline/ledger-button";
import CashTile from "@/components/ledgerline/cash-tile";
import FooterLinks from "@/components/ledgerline/footer-links";
import FooterUpdates from "@/components/ledgerline/footer-updates";
import { LEDGER_BRAND } from "@/lib/data/ledgerline/brand";
import { FOOTER_COPY } from "@/lib/data/ledgerline/footer";

const YEAR = new Date().getFullYear();

export default function LedgerFooter() {
    return (
        <footer className="border-border relative overflow-hidden border-t">
            <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 -bottom-[45%] h-[90%] bg-[radial-gradient(45%_50%_at_50%_50%,var(--ledger-glow),transparent_72%)]"
            />
            <div className="ledger-shell relative flex flex-col gap-16 pt-24 pb-10 lg:pt-32">
                <div className="grid items-end gap-14 lg:grid-cols-12">
                    <div className="flex flex-col items-start gap-7 lg:col-span-7">
                        <p className="ledger-title text-text">
                            {FOOTER_COPY.lead}
                            <span className="text-accent block">
                                {FOOTER_COPY.accent}
                            </span>
                        </p>
                        <p className="text-text-secondary max-w-lg text-lg">
                            {FOOTER_COPY.sub}
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <LedgerButton
                                href={LEDGER_BRAND.open.href}
                                tone="accent"
                            >
                                {LEDGER_BRAND.open.label}
                                <ArrowRight
                                    aria-hidden
                                    className="size-4 transition-transform group-hover:translate-x-0.5"
                                />
                            </LedgerButton>
                            <LedgerButton
                                href={LEDGER_BRAND.demo.href}
                                tone="ghost"
                            >
                                {LEDGER_BRAND.demo.label}
                            </LedgerButton>
                        </div>
                    </div>
                    <div className="lg:col-span-4 lg:col-start-9">
                        <CashTile />
                    </div>
                </div>
                <div className="border-border grid gap-14 border-t pt-14 lg:grid-cols-12">
                    <div className="lg:col-span-8">
                        <FooterLinks />
                    </div>
                    <div className="lg:col-span-4">
                        <FooterUpdates />
                    </div>
                </div>
                <div className="border-border flex items-center justify-between gap-6 border-t pt-8">
                    <div className="flex items-center gap-6">
                        <LedgerLogo />
                        <p className="text-text-muted text-xs">
                            © {YEAR} {LEDGER_BRAND.name}
                        </p>
                    </div>
                    <Link
                        href={FOOTER_COPY.top.href}
                        aria-label={FOOTER_COPY.top.label}
                        className="group sheen border-border-dark text-text-secondary hover:border-text-secondary hover:text-text inline-flex size-11 items-center justify-center rounded-full border transition-colors"
                    >
                        <ArrowUp
                            aria-hidden
                            className="size-4 transition-transform group-hover:-translate-y-0.5"
                        />
                    </Link>
                </div>
            </div>
        </footer>
    );
}
