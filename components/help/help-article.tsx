import HelpBlock from "@/components/help/help-block";
import HelpBreadcrumbs from "@/components/help/help-breadcrumbs";
import { HELP_COPY } from "@/lib/data/help/copy";
import { HELP_UPDATED_FORMAT } from "@/lib/help/constants";
import { categoryOf } from "@/lib/help/articles";
import { dateFormatter } from "@/lib/utils/date-formatter";
import type { HelpArticle as Article } from "@/lib/types";

interface Props {
    article: Article;
}

export default function HelpArticle({ article }: Props) {
    const category = categoryOf(article.category);

    return (
        <article className="flex max-w-2xl flex-col gap-10">
            <HelpBreadcrumbs article={article} category={category} />
            <header className="flex flex-col gap-5">
                <h1 className="ledger-title text-text">{article.title}</h1>
                <p className="text-text-muted font-mono text-xs tracking-[0.14em] uppercase">
                    {category.title} · {HELP_COPY.updated}{" "}
                    <time dateTime={article.updatedOn}>
                        {dateFormatter(article.updatedOn, HELP_UPDATED_FORMAT)}
                    </time>
                </p>
                <p className="text-text-secondary text-lg">{article.summary}</p>
            </header>
            <div className="text-text-secondary flex flex-col gap-6 leading-relaxed">
                {article.body.map((block, index) => (
                    <HelpBlock key={`${block.kind}-${index}`} block={block} />
                ))}
            </div>
        </article>
    );
}
