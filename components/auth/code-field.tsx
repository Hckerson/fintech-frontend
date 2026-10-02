import type { ChangeEvent } from "react";
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
}: Props) {
    const hintId = `${id}-hint`;
    const active = Math.min(value.length, length - 1);

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={id}
                className="text-text-secondary text-sm font-medium"
            >
                {label}
            </label>
            <div className="group relative">
                <div aria-hidden className="flex gap-2">
                    {Array.from({ length }, (_, index) => (
                        <span
                            key={index}
                            className={clsx(
                                "bg-background text-text flex h-14 flex-1 items-center justify-center rounded-xl border font-mono text-xl transition-colors",
                                invalid ? "border-error" : "border-border-dark",
                                index === active &&
                                    "group-focus-within:border-accent group-focus-within:ring-accent/25 group-focus-within:ring-4",
                                readOnly && "opacity-70",
                            )}
                        >
                            {value[index] ?? ""}
                        </span>
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
