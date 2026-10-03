"use client";
import { Search, UserFollow } from "@carbon/icons-react";
import Button from "@/components/ui/button";
import { EMPTY_STATES } from "@/lib/data/empty-states";

interface Props {
    term: string;
    filtered: boolean;
    online: boolean;
    onAdd: () => void;
    onClear: () => void;
}

export default function PayeeEmpty({
    term,
    filtered,
    online,
    onAdd,
    onClear,
}: Props) {
    const narrowed = Boolean(term) || filtered;
    const copy = narrowed ? EMPTY_STATES.payeesNoMatch : EMPTY_STATES.payees;
    const Icon = narrowed ? Search : UserFollow;

    return (
        <div
            role="status"
            className="flex min-h-64 flex-col items-center justify-center gap-3 px-4 py-6 text-center"
        >
            <span className="border-border bg-background-muted text-text-secondary flex size-10 items-center justify-center rounded-full border">
                <Icon aria-hidden className="size-5" />
            </span>
            <div className="flex flex-col gap-1">
                <p className="text-text text-sm font-medium">
                    {term
                        ? EMPTY_STATES.payeesNoMatch.title(term)
                        : narrowed
                          ? EMPTY_STATES.payeesNoMatch.filtered
                          : EMPTY_STATES.payees.title}
                </p>
                <p className="text-text-secondary measure text-sm">
                    {copy.body}
                </p>
            </div>
            {narrowed ? (
                <Button tone="quiet" size="md" onClick={onClear}>
                    {copy.action}
                </Button>
            ) : (
                <Button
                    size="md"
                    aria-disabled={!online}
                    onClick={() => online && onAdd()}
                >
                    {copy.action}
                </Button>
            )}
        </div>
    );
}
