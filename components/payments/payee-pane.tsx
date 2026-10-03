"use client";
import PayeeDestination from "@/components/payments/payee-destination";
import PayeeDetail from "@/components/payments/payee-detail";
import PayeeDetailActions from "@/components/payments/payee-detail-actions";
import Avatar from "@/components/ui/avatar";
import { PAYEE_SHEET_COPY } from "@/lib/data/payments/payee-sheet-copy";
import type { Payee } from "@/lib/types";

interface Props {
    payee: Payee | undefined;
    online: boolean;
    onRename: (payee: Payee) => void;
    onRemove: (payee: Payee) => void;
}

export default function PayeePane({
    payee,
    online,
    onRename,
    onRemove,
}: Props) {
    return (
        <aside
            aria-label={PAYEE_SHEET_COPY.pane}
            className="surface-card sticky top-18 flex max-h-[calc(100svh-6rem)] flex-col max-xl:hidden"
        >
            {payee ? (
                <>
                    <header className="border-border flex items-center gap-3 border-b p-4">
                        <Avatar name={payee.name} className="size-10 text-sm" />
                        <div className="flex min-w-0 flex-col">
                            <h2 className="text-text truncate text-sm font-medium">
                                {payee.name}
                            </h2>
                            <span className="text-xs">
                                <PayeeDestination payee={payee} />
                            </span>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
                        <PayeeDetail key={payee.id} payee={payee} />
                    </div>
                    <footer className="border-border flex flex-wrap justify-end gap-2 border-t p-4">
                        <PayeeDetailActions
                            payee={payee}
                            online={online}
                            onRename={onRename}
                            onRemove={onRemove}
                        />
                    </footer>
                </>
            ) : (
                <p className="text-text-muted p-4 text-sm">
                    {PAYEE_SHEET_COPY.none}
                </p>
            )}
        </aside>
    );
}
