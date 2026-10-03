import { Checkmark, CircleDash } from "@carbon/icons-react";

interface Props {
    rules: readonly { id: string; label: string; met: boolean }[];
}

export default function PasswordRules({ rules }: Props) {
    return (
        <ul className="flex flex-col gap-2">
            {rules.map((rule) => {
                const Icon = rule.met ? Checkmark : CircleDash;

                return (
                    <li
                        key={rule.id}
                        className={`flex items-center gap-2 text-sm transition-colors ${rule.met ? "text-success" : "text-text-muted"}`}
                    >
                        <Icon aria-hidden className="size-4 shrink-0" />
                        {rule.label}
                    </li>
                );
            })}
        </ul>
    );
}
