"use client";
import clsx from "clsx";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight } from "@carbon/icons-react";
import { CTA_COPY } from "@/lib/data/ledgerline/closing";
import { FOOTER_COPY } from "@/lib/data/ledgerline/footer";
import { contactSchema } from "@/lib/validations/contact";

export default function FooterUpdates() {
    const inputId = useId();
    const statusId = `${inputId}-status`;
    const [error, setError] = useState<string | null>(null);
    const [sent, setSent] = useState(false);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = contactSchema.safeParse({
            email: new FormData(event.currentTarget).get("email"),
        });
        setError(
            result.success
                ? null
                : (result.error.issues[0]?.message ?? CTA_COPY.invalid),
        );
        setSent(result.success);
    };

    return (
        <div className="flex flex-col gap-4">
            <p className="text-text-muted font-mono text-xs tracking-[0.18em] uppercase">
                {FOOTER_COPY.updates.title}
            </p>
            <p className="text-text-secondary text-sm">
                {FOOTER_COPY.updates.lead}
            </p>
            <form onSubmit={submit} noValidate className="relative">
                <label htmlFor={inputId} className="sr-only">
                    {FOOTER_COPY.updates.label}
                </label>
                <input
                    id={inputId}
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder={CTA_COPY.emailPlaceholder}
                    aria-invalid={error !== null}
                    aria-describedby={statusId}
                    className="border-border-dark bg-background-alt text-text placeholder:text-text-muted focus:border-accent h-12 w-full rounded-full border pr-14 pl-5 text-sm focus:outline-none"
                />
                <button
                    type="submit"
                    aria-label={FOOTER_COPY.updates.submit}
                    className="group sheen bg-accent text-text-inverse hover:bg-text absolute top-1.5 right-1.5 inline-flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors"
                >
                    <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                </button>
            </form>
            <p
                id={statusId}
                role="status"
                className={clsx(
                    "min-h-5 text-xs",
                    sent ? "text-success" : "text-error",
                )}
            >
                {sent ? FOOTER_COPY.updates.success : (error ?? "")}
            </p>
        </div>
    );
}
