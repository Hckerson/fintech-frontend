import Link from "next/link";
import type { ReactNode } from "react";
import type { EmptyStateCopy } from "@/lib/types";

interface Props extends EmptyStateCopy {
    children?: ReactNode;
}

export default function EmptyState({ title, body, action, children }: Props) {
    return (
        <div className="flex flex-col items-start gap-2 py-2">
            <p className="text-text text-sm font-medium">{title}</p>
            {body ? (
                <p className="text-text-secondary measure text-sm">{body}</p>
            ) : null}
            {action ? (
                <Link
                    href={action.href}
                    className="text-accent text-sm underline-offset-4 hover:underline"
                >
                    {action.label}
                </Link>
            ) : null}
            {children}
        </div>
    );
}
