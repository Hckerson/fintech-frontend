import { ArrowRight } from "@carbon/icons-react";
import { buttonClass } from "@/components/ui/button";

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
            className={buttonClass("accent", "xl", "group w-full")}
        >
            {pending ? pendingLabel : label}
            <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
            />
        </button>
    );
}
