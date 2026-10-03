"use client";
import { Fragment, type ReactNode } from "react";
import clsx from "clsx";
import { OTPInput, REGEXP_ONLY_DIGITS } from "input-otp";

interface Props {
    id: string;
    name: string;
    label: string;
    hint: string;
    length: number;
    value: string;
    onChange: (value: string) => void;
    readOnly: boolean;
    invalid: boolean;
    action?: ReactNode;
}

export default function CodeField({
    id,
    name,
    label,
    hint,
    length,
    value,
    onChange,
    readOnly,
    invalid,
    action,
}: Props) {
    const hintId = `${id}-hint`;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={id} className="text-text text-sm font-medium">
                    {label}
                </label>
                {action}
            </div>
            <OTPInput
                id={id}
                name={name}
                maxLength={length}
                value={value}
                onChange={onChange}
                pattern={REGEXP_ONLY_DIGITS}
                inputMode="numeric"
                autoComplete="one-time-code"
                readOnly={readOnly}
                aria-invalid={invalid}
                aria-describedby={hintId}
                autoFocus
                containerClassName={clsx(
                    "flex items-center gap-2",
                    readOnly && "opacity-70",
                )}
                render={({ slots }) =>
                    slots.map((slot, index) => (
                        <Fragment key={index}>
                            {index === length / 2 && (
                                <span
                                    aria-hidden
                                    className="bg-border-dark h-px w-3 shrink-0"
                                />
                            )}
                            <span
                                className={clsx(
                                    "bg-background-alt text-text flex h-13 flex-1 items-center justify-center rounded-lg border font-mono text-xl transition-colors",
                                    invalid
                                        ? "border-error"
                                        : slot.isActive
                                          ? "border-accent ring-accent/25 ring-4"
                                          : slot.char
                                            ? "border-text-muted"
                                            : "border-border-dark",
                                )}
                            >
                                {slot.char}
                                {slot.hasFakeCaret && (
                                    <span className="bg-text h-5 w-px animate-pulse motion-reduce:animate-none" />
                                )}
                            </span>
                        </Fragment>
                    ))
                }
            />
            <p id={hintId} className="text-text-muted text-sm">
                {hint}
            </p>
        </div>
    );
}
