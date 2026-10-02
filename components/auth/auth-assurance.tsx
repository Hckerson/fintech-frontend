import { Locked } from "@carbon/icons-react";

interface Props {
    text: string;
}

export default function AuthAssurance({ text }: Props) {
    return (
        <p className="border-border-dark text-text-muted flex gap-3 border-t pt-5 text-sm">
            <Locked aria-hidden className="mt-0.5 size-4 shrink-0" />
            {text}
        </p>
    );
}
