"use client";
import type { ComponentProps, ReactNode } from "react";
import AuthFormFooter from "@/components/auth/auth-form-footer";
import AuthFormHeader from "@/components/auth/auth-form-header";
import AuthNoticeMark from "@/components/auth/auth-notice-mark";
import LedgerButton from "@/components/ledgerline/ledger-button";
import type { NoticeTone } from "@/lib/types";

interface Props extends ComponentProps<typeof AuthFormHeader> {
    tone: NoticeTone;
    notes?: readonly string[];
    action: { label: string; href: string };
    footer?: ComponentProps<typeof AuthFormFooter>;
    children?: ReactNode;
}

const focus = (node: HTMLElement | null) => node?.focus();

export default function AuthNotice({
    tone,
    notes,
    action,
    footer,
    children,
    ...header
}: Props) {
    return (
        <section
            ref={focus}
            tabIndex={-1}
            aria-label={header.title}
            className="short:gap-6 flex flex-col gap-8 focus:outline-none"
        >
            <AuthNoticeMark tone={tone} />
            <AuthFormHeader {...header} />
            {notes && (
                <ul className="border-border-dark divide-border-dark bg-background-alt divide-y rounded-xl border">
                    {notes.map((note) => (
                        <li
                            key={note}
                            className="text-text-secondary flex gap-3 px-4 py-3 text-sm"
                        >
                            <span
                                aria-hidden
                                className="bg-text-muted mt-2 size-1 shrink-0 rounded-full"
                            />
                            {note}
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex flex-col gap-3">
                <LedgerButton
                    href={action.href}
                    tone="accent"
                    className="w-full"
                >
                    {action.label}
                </LedgerButton>
                {children}
            </div>
            {footer && <AuthFormFooter {...footer} />}
        </section>
    );
}
