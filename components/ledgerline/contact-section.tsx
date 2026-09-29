"use client";
import clsx from "clsx";
import { useId, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight } from "@carbon/icons-react";
import SignatureRule from "@/components/ledgerline/signature-rule";
import RevealWords from "@/components/wrappers/reveal-words";
import { CTA_COPY } from "@/lib/data/ledgerline/closing";
import { contactSchema } from "@/lib/validations/contact";

const TITLE_ID = "contact-title";

export default function ContactSection() {
    const inputId = useId();
    const errorId = `${inputId}-error`;
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
        <section
            id="contact"
            aria-labelledby={TITLE_ID}
            className="border-border relative overflow-hidden border-t"
        >
            <div className="ledger-shell relative flex flex-col items-center gap-8 py-28 text-center lg:py-36">
                <SignatureRule className="mb-6 h-24" />
                <RevealWords
                    id={TITLE_ID}
                    text={CTA_COPY.title}
                    className="ledger-display text-text max-w-3xl"
                />
                <p className="text-text-secondary max-w-lg text-lg">
                    {CTA_COPY.lead}
                </p>
                <form
                    onSubmit={submit}
                    noValidate
                    className="flex w-full max-w-md flex-col gap-3 sm:flex-row"
                >
                    <label htmlFor={inputId} className="sr-only">
                        {CTA_COPY.emailLabel}
                    </label>
                    <input
                        id={inputId}
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder={CTA_COPY.emailPlaceholder}
                        aria-invalid={error !== null}
                        aria-describedby={error ? errorId : undefined}
                        className="border-border-dark bg-background-alt text-text placeholder:text-text-muted focus:border-accent h-12 flex-1 rounded-full border px-5 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="group sheen bg-accent text-text-inverse hover:bg-text inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full px-6 font-medium transition-colors"
                    >
                        {CTA_COPY.submit}
                        <ArrowRight
                            aria-hidden
                            className="size-4 transition-transform group-hover:translate-x-0.5"
                        />
                    </button>
                </form>
                <p
                    id={errorId}
                    role="status"
                    className={clsx(
                        "min-h-5 text-sm",
                        sent ? "text-success" : "text-error",
                    )}
                >
                    {sent ? CTA_COPY.success : (error ?? "")}
                </p>
                <p className="text-text-muted font-mono text-xs">
                    {CTA_COPY.note}
                </p>
            </div>
        </section>
    );
}
