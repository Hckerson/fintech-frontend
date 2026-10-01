import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HelpArticle from "@/components/help/help-article";
import HelpRelated from "@/components/help/help-related";
import HelpSupport from "@/components/help/help-support";
import { HELP_ARTICLES } from "@/lib/data/help/articles";
import { HELP_COPY } from "@/lib/data/help/copy";
import { findArticle, relatedArticles } from "@/lib/help/articles";

interface Props {
    params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
    return HELP_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const article = findArticle((await params).slug);
    return article
        ? {
              title: `${article.title} · ${HELP_COPY.metaTitle}`,
              description: article.summary,
          }
        : {};
}

export default async function HelpArticlePage({ params }: Props) {
    const article = findArticle((await params).slug);
    if (!article) notFound();

    return (
        <div className="pt-(--ledger-header)">
            <div className="ledger-shell ledger-section flex flex-col gap-16">
                <HelpArticle article={article} />
                <HelpRelated articles={relatedArticles(article)} />
                <HelpSupport />
            </div>
        </div>
    );
}
