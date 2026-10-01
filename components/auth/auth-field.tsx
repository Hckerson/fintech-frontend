import type { ChangeEvent, HTMLAttributes, ReactNode } from "react";

interface Props {
    id: string;
    name: string;
    label: string;
    type: string;
    autoComplete: string;
    inputMode: HTMLAttributes<HTMLInputElement>["inputMode"];
    value: string;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    readOnly: boolean;
    invalid: boolean;
    autoFocus?: boolean;
    action?: ReactNode;
    trailing?: ReactNode;
    hint?: string;
}

export default function AuthField({
    id,
    name,
    label,
    type,
    autoComplete,
    inputMode,
    value,
    onChange,
    readOnly,
    invalid,
    autoFocus = false,
    action,
    trailing,
    hint,
}: Props) {
    const hintId = `${id}-hint`;

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
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    inputMode={inputMode}
                    value={value}
                    onChange={onChange}
                    readOnly={readOnly}
                    aria-invalid={invalid}
                    aria-describedby={hint ? hintId : undefined}
                    autoFocus={autoFocus}
                    required
                    className="border-border-dark bg-background text-text placeholder:text-text-muted focus:border-accent focus:ring-accent/25 aria-invalid:border-error h-12 w-full rounded-xl border px-4 text-base transition-colors read-only:opacity-70 focus:ring-4 focus:outline-none"
                />
                {trailing}
            </div>
            {hint ? (
                <p id={hintId} className="text-text-muted text-sm">
                    {hint}
                </p>
            ) : null}
        </div>
    );
}
