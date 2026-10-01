import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import { HELP_COPY } from "@/lib/data/help/copy";
import { LOGIN_ROUTE } from "@/lib/constants";

export default function HelpEmpty() {
    return (
        <div className="border-border flex flex-col items-start gap-4 border-y py-12">
            <p className="text-text-secondary max-w-md text-lg">
                {HELP_COPY.empty}
            </p>
            <Link
                href={LOGIN_ROUTE}
                className="group text-text hover:text-accent inline-flex items-center gap-1.5"
            >
                {HELP_COPY.support}
                <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                />
            </Link>
        </div>
    );
}
