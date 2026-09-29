import type { HelpArticle } from "@/lib/types";
import { BASICS_ARTICLES } from "@/lib/data/help/articles-basics";
import { RECORDS_ARTICLES } from "@/lib/data/help/articles-records";
import { ACCESS_ARTICLES } from "@/lib/data/help/articles-access";

export const HELP_ARTICLES: readonly HelpArticle[] = [
    ...BASICS_ARTICLES,
    ...RECORDS_ARTICLES,
    ...ACCESS_ARTICLES,
];
