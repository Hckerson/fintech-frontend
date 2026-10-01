"use client";
import { useRef, useState } from "react";
import NotPermitted from "@/components/common/not-permitted";
import PayeeAddDialog from "@/components/payments/payee-add-dialog";
import PayeeRemoveDialog from "@/components/payments/payee-remove-dialog";
import PayeeRenameDialog from "@/components/payments/payee-rename-dialog";
import PayeeResults from "@/components/payments/payee-results";
import PayeeToolbar from "@/components/payments/payee-toolbar";
import { PAGE_TITLES } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { useOnline } from "@/lib/hooks/use-online";
import { usePayees } from "@/lib/hooks/use-payees";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { SEARCH_DEBOUNCE_MS } from "@/lib/query/constants";
import type { Payee } from "@/lib/types";

type Target = { kind: "add" } | { kind: "rename" | "remove"; payee: Payee };

export default function PayeeList() {
    const { can } = useWorkspace();
    const online = useOnline();
    const { search, setSearch, debouncedSearch } = useDebouncedSearch(
        "",
        SEARCH_DEBOUNCE_MS,
    );
    const term = debouncedSearch.trim();
    const payees = usePayees(term, can("managePayees"));
    const outcomeRef = useRef<HTMLParagraphElement>(null);
    const [target, setTarget] = useState<Target | null>(null);
    const [outcome, setOutcome] = useState("");

    const finish = (message: string, refocus = false) => {
        setTarget(null);
        setOutcome(message);
        if (refocus) requestAnimationFrame(() => outcomeRef.current?.focus());
    };

    if (!can("managePayees") || payees.error?.kind === "forbidden") {
        return <NotPermitted page={PAGE_TITLES.payments} />;
    }

    return (
        <section
            aria-label={PAYEE_COPY.section}
            className="flex flex-col gap-3"
        >
            <PayeeToolbar
                search={search}
                online={online}
                onSearch={setSearch}
                onAdd={() => setTarget({ kind: "add" })}
            />
            <p
                role="status"
                className={online ? "sr-only" : "text-warning text-sm"}
            >
                {online ? "" : PAYEE_COPY.offline}
            </p>
            <p
                ref={outcomeRef}
                tabIndex={-1}
                role="status"
                className={
                    outcome
                        ? "bg-background-muted text-text rounded-lg px-3 py-2 text-sm focus:outline-none"
                        : "sr-only"
                }
            >
                {outcome}
            </p>
            <PayeeResults
                payees={payees}
                term={term}
                online={online}
                onAdd={() => setTarget({ kind: "add" })}
                onClear={() => setSearch("")}
                onRename={(payee) => setTarget({ kind: "rename", payee })}
                onRemove={(payee) => setTarget({ kind: "remove", payee })}
            />
            {target?.kind === "add" ? (
                <PayeeAddDialog
                    onClose={() => setTarget(null)}
                    onAdded={(payee) => finish(PAYEE_COPY.added(payee.name))}
                />
            ) : null}
            {target?.kind === "rename" ? (
                <PayeeRenameDialog
                    payee={target.payee}
                    current={payees.data?.pages
                        .flatMap((page) => page.items)
                        .find((payee) => payee.id === target.payee.id)}
                    onClose={() => setTarget(null)}
                    onRenamed={(from, payee) =>
                        finish(PAYEE_COPY.renamed(from, payee.name))
                    }
                />
            ) : null}
            {target?.kind === "remove" ? (
                <PayeeRemoveDialog
                    payee={target.payee}
                    onClose={() => setTarget(null)}
                    onRemoved={(payee) =>
                        finish(PAYEE_COPY.removed(payee.name), true)
                    }
                />
            ) : null}
        </section>
    );
}
