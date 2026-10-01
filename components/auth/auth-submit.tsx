import { ArrowRight } from "@carbon/icons-react";
import { ledgerButtonClass } from "@/components/ledgerline/ledger-button";

interface Props {
    pending: boolean;
    label: string;
    pendingLabel: string;
}

export default function AuthSubmit({ pending, label, pendingLabel }: Props) {
    return (
        <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className={ledgerButtonClass(
                "accent",
                "lg",
                "w-full cursor-pointer disabled:cursor-wait disabled:opacity-70",
            )}
        >
            {pending ? pendingLabel : label}
            <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
            />
        </button>
    );
}
