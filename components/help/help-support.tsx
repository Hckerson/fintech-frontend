import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import { HELP_COPY } from "@/lib/data/help/copy";
import { LOGIN_ROUTE } from "@/lib/constants";

export default function HelpSupport() {
    return (
        <div className="border-border flex flex-col gap-2 border-t pt-6 sm:flex-row sm:items-baseline sm:justify-between">
            <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-text font-medium">{HELP_COPY.stuck}</span>
                <Link
                    href={LOGIN_ROUTE}
                    className="group text-text-secondary hover:text-text inline-flex items-center gap-1.5"
                >
                    {HELP_COPY.support}
                    <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-0.5"
                    />
                </Link>
            </p>
            <p className="text-text-muted font-mono text-xs">
                {HELP_COPY.note}
            </p>
        </div>
    );
}
