import Link from "next/link";
import { HELP_COPY } from "@/lib/data/help/copy";
import { HELP_ROUTE } from "@/lib/constants";
import type { HelpArticle, HelpCategory } from "@/lib/types";

interface Props {
    article: HelpArticle;
    category: HelpCategory;
}

export default function HelpBreadcrumbs({ article, category }: Props) {
    return (
        <nav aria-label={HELP_COPY.breadcrumb}>
            <ol className="text-text-muted flex flex-wrap items-center gap-2 font-mono text-xs">
                <li>
                    <Link href={HELP_ROUTE} className="hover:text-text">
                        {HELP_COPY.eyebrow}
                    </Link>
                </li>
                <li aria-hidden>/</li>
                <li>{category.title}</li>
                <li aria-hidden>/</li>
                <li aria-current="page" className="text-text-secondary">
                    {article.title}
                </li>
            </ol>
        </nav>
    );
}
