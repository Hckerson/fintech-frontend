import HelpRow from "@/components/help/help-row";
import { HELP_COPY } from "@/lib/data/help/copy";
import type { HelpArticle } from "@/lib/types";

interface Props {
    articles: readonly HelpArticle[];
}

export default function HelpRelated({ articles }: Props) {
    return (
        <section aria-labelledby="help-related" className="max-w-2xl">
            <h2
                id="help-related"
                className="text-text-muted flex items-center gap-3 font-mono text-xs tracking-[0.14em] uppercase"
            >
                {HELP_COPY.related}
                <span aria-hidden className="bg-border-dark h-px flex-1" />
            </h2>
            <ul className="mt-2">
                {articles.map((article) => (
                    <HelpRow key={article.slug} article={article} />
                ))}
            </ul>
        </section>
    );
}
