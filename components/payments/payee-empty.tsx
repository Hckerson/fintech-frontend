"use client";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import { EMPTY_STATES } from "@/lib/data/empty-states";

interface Props {
    term: string;
    online: boolean;
    onAdd: () => void;
    onClear: () => void;
}

export default function PayeeEmpty({ term, online, onAdd, onClear }: Props) {
    return (
        <div role="status" className="surface-card p-4">
            {term ? (
                <EmptyState
                    title={EMPTY_STATES.payeesNoMatch.title(term)}
                    body={EMPTY_STATES.payeesNoMatch.body}
                >
                    <Button tone="quiet" size="lg" onClick={onClear}>
                        {EMPTY_STATES.payeesNoMatch.action}
                    </Button>
                </EmptyState>
            ) : (
                <EmptyState
                    title={EMPTY_STATES.payees.title}
                    body={EMPTY_STATES.payees.body}
                >
                    <Button
                        size="lg"
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
