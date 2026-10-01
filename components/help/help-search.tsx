"use client";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "@carbon/icons-react";
import HelpLedger from "@/components/help/help-ledger";
import HelpEmpty from "@/components/help/help-empty";
import HelpCategoryFilter from "@/components/help/help-category-filter";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { HELP_COPY } from "@/lib/data/help/copy";
import { HELP_QUERY_PARAM } from "@/lib/constants";
import { HELP_SEARCH_DELAY } from "@/lib/help/constants";
import { groupByCategory, searchArticles } from "@/lib/help/articles";
import { queryString } from "@/lib/utils/query-string";
import type { HelpCategoryId } from "@/lib/types";

export default function HelpSearch() {
    const router = useRouter();
    const pathname = usePathname();
    const urlQuery = useSearchParams().get(HELP_QUERY_PARAM) ?? "";
    const { search, setSearch, debouncedSearch } = useDebouncedSearch(
        urlQuery,
        HELP_SEARCH_DELAY,
    );
    const [category, setCategory] = useState<HelpCategoryId | null>(null);
    const results = useMemo(
        () => searchArticles(debouncedSearch, category),
        [debouncedSearch, category],
    );
    const query = debouncedSearch.trim();

    useEffect(() => {
        if (query === urlQuery) return;
        router.replace(
            `${pathname}${queryString({ [HELP_QUERY_PARAM]: query || undefined })}`,
            { scroll: false },
        );
    }, [query, urlQuery, pathname, router]);

    return (
        <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-5">
                <label className="relative block">
                    <span className="sr-only">{HELP_COPY.searchLabel}</span>
                    <Search
                        aria-hidden
                        className="text-text-muted pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2"
                    />
                    <input
                        type="search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={HELP_COPY.searchPlaceholder}
                        className="border-border-dark bg-background-alt text-text placeholder:text-text-muted focus:border-accent h-14 w-full rounded-full border pr-5 pl-13 text-lg focus:outline-none"
                    />
                </label>
                <HelpCategoryFilter value={category} onChange={setCategory} />
            </div>
            <p role="status" className="text-text-muted font-mono text-xs">
                {results.length}{" "}
                {results.length === 1 ? HELP_COPY.article : HELP_COPY.articles}
                {query && ` ${HELP_COPY.matching} "${query}"`}
            </p>
            {results.length > 0 ? (
                <HelpLedger groups={groupByCategory(results)} />
            ) : (
                <HelpEmpty />
            )}
        </div>
    );
}
