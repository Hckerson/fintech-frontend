"use client";
import { useId, type ReactNode } from "react";

interface ControlProps {
    id: string;
    "aria-describedby": string;
    "aria-invalid": boolean;
}

interface Props {
    label: string;
    hint?: string;
    error?: string;
    children: (control: ControlProps) => ReactNode;
}

export default function Field({ label, hint, error, children }: Props) {
    const id = useId();
    const describedBy = [hint && `${id}-hint`, error && `${id}-error`]
        .filter(Boolean)
        .join(" ");

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="text-text text-sm font-medium">
                {label}
            </label>
            {children({
                id,
                "aria-describedby": describedBy,
                "aria-invalid": Boolean(error),
            })}
            {hint ? (
                <p id={`${id}-hint`} className="text-text-muted text-xs">
                    {hint}
                </p>
            ) : null}
            {error ? (
                <p id={`${id}-error`} className="text-error text-xs">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
