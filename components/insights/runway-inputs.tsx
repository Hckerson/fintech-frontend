"use client";
import { Link as LinkIcon, Reset } from "@carbon/icons-react";
import Field from "@/components/ui/field";
import Button from "@/components/ui/button";
import { RUNWAY_COPY } from "@/lib/data/insights/runway";
import { RUNWAY_PARAMS } from "@/lib/insights/constants";
import type { RunwayParam, RunwayValues } from "@/lib/hooks/use-runway-params";

interface Props {
    values: RunwayValues;
    errors: Partial<Record<RunwayParam, string>>;
    currency: string;
    status: string | null;
    copied: boolean;
    onChange: (key: RunwayParam, value: string) => void;
    onReset: () => void;
    onCopy: () => void;
}

export default function RunwayInputs({
    values,
    errors,
    currency,
    status,
    copied,
    onChange,
    onReset,
    onCopy,
}: Props) {
    return (
        <section
            aria-label="Assumptions"
            className="surface-card flex flex-col gap-4 p-4"
        >
            {status ? (
                <p
                    role="status"
                    className="bg-background-muted text-text-secondary rounded-lg px-4 py-3 text-sm"
                >
                    {status}
                </p>
            ) : null}
            {RUNWAY_PARAMS.map((key) => (
                <Field
                    key={key}
                    {...RUNWAY_COPY.fields[key]}
                    error={errors[key]}
                >
                    {(control) => (
                        <div className="border-border bg-background focus-within:border-accent flex h-12 items-center gap-3 rounded-lg border px-4 transition-colors">
                            <input
                                {...control}
                                name={key}
                                inputMode={
                                    key === "target" ? "numeric" : "decimal"
                                }
                                autoComplete="off"
                                value={values[key]}
                                onChange={(event) =>
                                    onChange(key, event.target.value)
                                }
                                className="text-text min-w-0 flex-1 bg-transparent font-mono tabular-nums outline-none"
                            />
                            <span className="text-text-muted font-mono text-xs">
                                {key === "target" ? "months" : currency}
                            </span>
                        </div>
                    )}
                </Field>
            ))}
            <div className="flex flex-wrap gap-3">
                <Button tone="quiet" size="lg" onClick={onReset}>
                    <Reset aria-hidden className="size-4" />
                    {RUNWAY_COPY.reset}
                </Button>
                <Button
                    tone="ghost"
                    size="lg"
                    onClick={onCopy}
                    aria-live="polite"
                >
                    <LinkIcon aria-hidden className="size-4" />
                    {copied ? RUNWAY_COPY.copied : RUNWAY_COPY.copyLink}
                </Button>
            </div>
        </section>
    );
}
