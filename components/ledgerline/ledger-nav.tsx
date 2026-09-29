"use client";
import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { Close, Menu } from "@carbon/icons-react";
import LedgerLogo from "@/components/ledgerline/ledger-logo";
import LedgerButton from "@/components/ledgerline/ledger-button";
import { LEDGER_BRAND, LEDGER_NAV } from "@/lib/data/ledgerline/brand";
import { NAV_SOLID_AFTER } from "@/lib/ledgerline/constants";

const MENU_ID = "ledger-menu";

export default function LedgerNav() {
    const [open, setOpen] = useState(false);
    const [solid, setSolid] = useState(false);
    const { scrollY } = useScroll();
    const close = () => setOpen(false);

    useMotionValueEvent(scrollY, "change", (value) =>
        setSolid(value > NAV_SOLID_AFTER),
    );

    return (
        <header className="ledger-pill z-(--z-indices-fixed)">
            <div
                className={clsx(
                    "border transition-[background-color,border-color,box-shadow,border-radius] duration-500",
                    open ? "rounded-3xl" : "rounded-full",
                    solid || open
                        ? "border-border-dark bg-background-alt shadow-(--ledger-frame-shadow)"
                        : "border-border bg-background/60",
                )}
            >
                <div className="ledger-nav-bar flex items-center gap-6 pr-2 pl-5">
                    <LedgerLogo />
                    <nav
                        aria-label={LEDGER_BRAND.menu.primary}
                        className="hidden flex-1 items-center justify-center gap-6 lg:flex"
                    >
                        {LEDGER_NAV.map((link) => (
                            <Link
                                key={link.id}
                                href={link.href}
                                className="text-text-secondary hover:text-text text-sm transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="ml-auto flex items-center gap-4 lg:ml-0">
                        <Link
                            href={LEDGER_BRAND.signIn.href}
                            className="text-text-secondary hover:text-text hidden text-sm md:inline lg:hidden xl:inline"
                        >
                            {LEDGER_BRAND.signIn.label}
                        </Link>
                        <LedgerButton
                            href={LEDGER_BRAND.open.href}
                            tone="accent"
                            size="sm"
                            className="hidden sm:inline-flex"
                        >
                            {LEDGER_BRAND.open.label}
                        </LedgerButton>
                        <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={MENU_ID}
                            onClick={() => setOpen((value) => !value)}
                            className="border-border text-text inline-flex size-10 items-center justify-center rounded-full border lg:hidden"
                        >
                            {open ? (
                                <Close aria-hidden className="size-5" />
                            ) : (
                                <Menu aria-hidden className="size-5" />
                            )}
                            <span className="sr-only">
                                {open
                                    ? LEDGER_BRAND.menu.close
                                    : LEDGER_BRAND.menu.open}
                            </span>
                        </button>
                    </div>
                </div>
                <div
                    id={MENU_ID}
                    className="collapse-grid lg:hidden"
                    data-open={open}
                    inert={!open}
                >
                    <div>
                        <nav
                            aria-label={LEDGER_BRAND.menu.mobile}
                            className="flex flex-col gap-4 px-5 pt-2 pb-6"
                        >
                            {LEDGER_NAV.map((link) => (
                                <Link
                                    key={link.id}
                                    href={link.href}
                                    onClick={close}
                                    className="text-text text-2xl font-medium tracking-tight"
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <Link
                                href={LEDGER_BRAND.signIn.href}
                                onClick={close}
                                className="text-text-secondary text-sm"
                            >
                                {LEDGER_BRAND.signIn.label}
                            </Link>
                            <LedgerButton
                                href={LEDGER_BRAND.open.href}
                                tone="accent"
                                onClick={close}
                                className="mt-2 self-start"
                            >
                                {LEDGER_BRAND.open.label}
                            </LedgerButton>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}
