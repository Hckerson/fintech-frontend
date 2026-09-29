import { HELP_ARTICLES } from "@/lib/data/help/articles";
import { HELP_CATEGORIES } from "@/lib/data/help/categories";
import { HELP_RELATED_COUNT, WORDS_PER_MINUTE } from "@/lib/help/constants";
import type {
    HelpArticle,
    HelpBlock,
    HelpCategory,
    HelpCategoryId,
    HelpGroup,
} from "@/lib/types";

const blockText = (block: HelpBlock): string =>
    "text" in block ? block.text : block.items.join(" ");

const searchable = (article: HelpArticle): string =>
    `${article.title} ${article.summary}`.toLowerCase();

export const readMinutes = (article: HelpArticle): number => {
    const words = article.body.map(blockText).join(" ").split(/\s+/).length;
    return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
};

export const categoryOf = (id: HelpCategoryId): HelpCategory =>
    HELP_CATEGORIES.find((category) => category.id === id) ??
    HELP_CATEGORIES[0];

export const findArticle = (slug: string): HelpArticle | undefined =>
    HELP_ARTICLES.find((article) => article.slug === slug);

export const searchArticles = (
    query: string,
    category: HelpCategoryId | null,
): HelpArticle[] => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return HELP_ARTICLES.filter(
        (article) =>
            (category === null || article.category === category) &&
            terms.every((term) => searchable(article).includes(term)),
    );
};

export const groupByCategory = (
    articles: readonly HelpArticle[],
): HelpGroup[] =>
    HELP_CATEGORIES.map((category) => ({
        category,
        articles: articles.filter(
            (article) => article.category === category.id,
        ),
    })).filter((group) => group.articles.length > 0);

export const relatedArticles = (article: HelpArticle): HelpArticle[] =>
    [
        ...HELP_ARTICLES.filter((other) => other.category === article.category),
        ...HELP_ARTICLES.filter((other) => other.category !== article.category),
    ]
        .filter((other) => other.slug !== article.slug)
        .slice(0, HELP_RELATED_COUNT);
