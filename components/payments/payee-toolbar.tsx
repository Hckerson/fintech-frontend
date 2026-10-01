"use client";
import { Add, Search } from "@carbon/icons-react";
import Button from "@/components/ui/button";
import TextInput from "@/components/ui/text-input";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { PAYEE_SEARCH_MAX } from "@/lib/payments/constants";

interface Props {
    search: string;
    online: boolean;
    onSearch: (value: string) => void;
    onAdd: () => void;
}

export default function PayeeToolbar({
    search,
    online,
    onSearch,
    onAdd,
}: Props) {
    return (
        <div className="flex flex-wrap items-center gap-3">
            <label className="relative min-w-0 flex-1 basis-56">
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
                    className="pl-9"
                />
            </label>
            <Button
                size="lg"
                aria-disabled={!online}
                onClick={() => online && onAdd()}
            >
                <Add aria-hidden className="size-4" />
                {PAYEE_COPY.add}
            </Button>
        </div>
    );
}
