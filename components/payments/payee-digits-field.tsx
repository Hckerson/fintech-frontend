"use client";
import Field from "@/components/ui/field";
import TextInput from "@/components/ui/text-input";

interface Props {
    name: string;
    label: string;
    hint: string;
    placeholder: string;
    error: string | undefined;
    value: string;
    readOnly: boolean;
    onChange: (value: string) => void;
}

export default function PayeeDigitsField({
    name,
    label,
    hint,
    placeholder,
    error,
    value,
    readOnly,
    onChange,
}: Props) {
    return (
        <Field label={label} hint={hint} error={error}>
            {(control) => (
                <TextInput
                    {...control}
                    name={name}
                    autoComplete="off"
                    inputMode="numeric"
                    placeholder={placeholder}
                    maxLength={placeholder.length}
                    value={value}
                    readOnly={readOnly}
                    onChange={(event) => onChange(event.target.value)}
                    className="font-mono tracking-wider tabular-nums"
                />
            )}
        </Field>
    );
}
