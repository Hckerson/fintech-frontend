import Link from "next/link";
import { ArrowRight } from "@carbon/icons-react";
import { HELP_COPY } from "@/lib/data/help/copy";
import { helpArticleRoute } from "@/lib/constants";
import { readMinutes } from "@/lib/help/articles";
import type { HelpArticle } from "@/lib/types";

interface Props {
    article: HelpArticle;
}

export default function HelpRow({ article }: Props) {
    return (
        <li className="border-border border-t first:border-t-0">
            <Link
                href={helpArticleRoute(article.slug)}
                className="group flex items-baseline py-4"
            >
                <span className="flex min-w-0 flex-col gap-1">
                    <span className="text-text group-hover:text-accent font-medium transition-colors">
                        {article.title}
                    </span>
                    <span className="text-text-muted text-sm">
                        {article.summary}
                    </span>
                </span>
                <span
                    aria-hidden
                    className="border-border-dark mx-4 min-w-6 flex-1 border-b border-dotted"
                />
                <span className="text-text-muted flex shrink-0 items-center gap-2 font-mono text-xs">
                    {readMinutes(article)} {HELP_COPY.minutes}
                    <ArrowRight
                        aria-hidden
                        className="size-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                </span>
            </Link>
        </li>
    );
}
