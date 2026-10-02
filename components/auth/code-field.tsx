import { Fragment, type ChangeEvent, type ReactNode } from "react";
import clsx from "clsx";

interface Props {
    id: string;
    name: string;
    label: string;
    hint: string;
    length: number;
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
    const active = Math.min(value.length, length - 1);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-4">
                <label
                    htmlFor={id}
                    className="text-text-secondary text-sm font-medium"
                >
                    {label}
                </label>
                {action}
            </div>
            <div className="group relative">
                <div aria-hidden className="flex items-center gap-2">
                    {Array.from({ length }, (_, index) => (
                        <Fragment key={index}>
                            {index === length / 2 && (
                                <span className="bg-border-dark h-px w-3 shrink-0" />
                            )}
                            <span
                                className={clsx(
                                    "bg-background text-text flex h-14 max-w-14 flex-1 items-center justify-center rounded-xl border font-mono text-2xl transition-colors",
                                    invalid
                                        ? "border-error"
                                        : value[index]
                                          ? "border-text-muted"
                                          : "border-border-dark",
                                    index === active &&
                                        "group-focus-within:border-accent group-focus-within:ring-accent/25 group-focus-within:ring-4",
                                    readOnly && "opacity-70",
                                )}
                            >
                                {value[index] ?? ""}
                            </span>
                        </Fragment>
                    ))}
                </div>
                <input
                    id={id}
                    name={name}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={length}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    aria-invalid={invalid}
                    aria-describedby={hintId}
                    autoFocus
                    required
                    className="absolute inset-0 size-full cursor-text opacity-0"
                />
            </div>
            <p id={hintId} className="text-text-muted text-sm">
                {hint}
            </p>
        </div>
    );
}
