"use client";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
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
    return (
        <div role="status" className="px-4 py-6">
            {term || filtered ? (
                <EmptyState
                    title={
                        term
                            ? EMPTY_STATES.payeesNoMatch.title(term)
                            : EMPTY_STATES.payeesNoMatch.filtered
                    }
                    body={EMPTY_STATES.payeesNoMatch.body}
                >
                    <Button tone="quiet" size="md" onClick={onClear}>
                        {EMPTY_STATES.payeesNoMatch.action}
                    </Button>
                </EmptyState>
            ) : (
                <EmptyState
                    title={EMPTY_STATES.payees.title}
                    body={EMPTY_STATES.payees.body}
                >
                    <Button
                        size="md"
                        aria-disabled={!online}
                        onClick={() => online && onAdd()}
                    >
                        {EMPTY_STATES.payees.action}
                    </Button>
                </EmptyState>
            )}
        </div>
    );
}
