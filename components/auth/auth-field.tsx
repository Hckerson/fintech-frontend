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
    error?: string;
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
    error,
}: Props) {
    const note = error ?? hint;
    const noteId = `${id}-note`;

    return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-4">
                <label htmlFor={id} className="text-text text-sm font-medium">
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
                    aria-describedby={note ? noteId : undefined}
                    autoFocus={autoFocus}
                    required
                    className="border-border-dark bg-background-alt text-text placeholder:text-text-muted hover:border-text-muted focus:border-accent focus:ring-accent/25 aria-invalid:border-error h-11 w-full rounded-lg border px-3.5 text-base transition-colors read-only:opacity-70 focus:ring-4 focus:outline-none"
                />
                {trailing}
            </div>
            {note ? (
                <p
                    id={noteId}
                    className={
                        error ? "text-error text-sm" : "text-text-muted text-sm"
                    }
                >
                    {note}
                </p>
            ) : null}
        </div>
    );
}
