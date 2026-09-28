"use client";
import Link from "next/link";
import { useState } from "react";
import { Close, Menu } from "@carbon/icons-react";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import LedgerButton from "@/components/ledgerline/ledger-button";
import { LEDGER_BRAND, LEDGER_NAV } from "@/lib/data/ledgerline/brand";

const MENU_ID = "ledger-menu";

export default function LedgerNav() {
    const [open, setOpen] = useState(false);
    const close = () => setOpen(false);

    return (
        <header className="fixed inset-x-0 top-0 z-(--z-indices-fixed) border-b border-border bg-background/90">
            <div className="ledger-shell ledger-nav-bar flex items-center gap-10">
                <LedgerLogo />
                <nav aria-label={LEDGER_BRAND.menu.primary} className="hidden flex-1 items-center gap-7 lg:flex">
                    {LEDGER_NAV.map((link) => (
                        <Link key={link.id} href={link.href} className="text-sm text-text-secondary transition-colors hover:text-text">
                            {link.label}
                        </Link>
                    ))}
                </nav>
                <div className="ml-auto flex items-center gap-5">
                    <Link href={LEDGER_BRAND.signIn.href} className="hidden text-sm text-text-secondary hover:text-text md:inline">
                        {LEDGER_BRAND.signIn.label}
                    </Link>
                    <LedgerButton href={LEDGER_BRAND.open.href} size="sm" className="hidden sm:inline-flex">
                        {LEDGER_BRAND.open.label}
                    </LedgerButton>
                    <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={MENU_ID}
                        onClick={() => setOpen((value) => !value)}
                        className="inline-flex size-10 items-center justify-center rounded-full border border-border text-text lg:hidden"
                    >
                        {open ? <Close aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
                        <span className="sr-only">{open ? LEDGER_BRAND.menu.close : LEDGER_BRAND.menu.open}</span>
                    </button>
                </div>
            </div>
            <div id={MENU_ID} className="collapse-grid lg:hidden" data-open={open} inert={!open}>
                <div>
                    <nav aria-label={LEDGER_BRAND.menu.mobile} className="ledger-shell flex flex-col gap-4 py-6">
                        {LEDGER_NAV.map((link) => (
                            <Link key={link.id} href={link.href} onClick={close} className="text-2xl font-medium tracking-tight text-text">
                                {link.label}
                            </Link>
                        ))}
                        <LedgerButton href={LEDGER_BRAND.open.href} onClick={close} className="mt-2 self-start">
                            {LEDGER_BRAND.open.label}
                        </LedgerButton>
                    </nav>
                </div>
            </div>
        </header>
    );
}
