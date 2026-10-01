"use client";
import type { ComponentProps, ReactNode } from "react";
import AuthFormFooter from "@/components/auth/auth-form-footer";
import AuthFormHeader from "@/components/auth/auth-form-header";
import LedgerButton from "@/components/ledgerline/ledger-button";

interface Props extends ComponentProps<typeof AuthFormHeader> {
    notes?: readonly string[];
    action: { label: string; href: string };
    footer?: ComponentProps<typeof AuthFormFooter>;
    children?: ReactNode;
}

const focus = (node: HTMLElement | null) => node?.focus();

export default function AuthNotice({
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
            <AuthFormHeader {...header} />
            {notes && (
                <ul className="text-text-secondary flex list-disc flex-col gap-2 pl-5 text-sm">
                    {notes.map((note) => (
                        <li key={note}>{note}</li>
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
