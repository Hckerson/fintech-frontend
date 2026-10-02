"use client";
import { Search } from "@carbon/icons-react";
import Tabs from "@/components/ui/tabs";
import TextInput from "@/components/ui/text-input";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { PAYEE_SEARCH_MAX } from "@/lib/payments/constants";
import type { PayeeFilter } from "@/lib/types";

interface Props {
    panelId: string;
    filter: PayeeFilter;
    search: string;
    onFilter: (filter: PayeeFilter) => void;
    onSearch: (value: string) => void;
}

export default function PayeeToolbar({
    panelId,
    filter,
    search,
    onFilter,
    onSearch,
}: Props) {
    return (
        <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
            <Tabs
                label={PAYEE_COPY.filterLabel}
                tabs={PAYEE_COPY.filters}
                value={filter}
                onChange={onFilter}
                panelId={panelId}
            />
            <label className="relative min-w-0 flex-1 basis-56 md:max-w-xs">
                <span className="sr-only">{PAYEE_COPY.search.label}</span>
                <Search
                    aria-hidden
                    className="text-text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <TextInput
                    type="search"
                    value={search}
                    maxLength={PAYEE_SEARCH_MAX}
                    placeholder={PAYEE_COPY.search.placeholder}
                    onChange={(event) => onSearch(event.target.value)}
                    className="h-9 pl-9"
                />
            </label>
        </div>
    );
}
