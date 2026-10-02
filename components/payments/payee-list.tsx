"use client";
import { useId, useRef, useState } from "react";
import { Add } from "@carbon/icons-react";
import NotPermitted from "@/components/common/not-permitted";
import PayeeDialogs from "@/components/payments/payee-dialogs";
import PayeeNotices from "@/components/payments/payee-notices";
import PayeeResults from "@/components/payments/payee-results";
import PayeeSummary from "@/components/payments/payee-summary";
import PayeeToolbar from "@/components/payments/payee-toolbar";
import PageHeader from "@/components/shell/page-header";
import Button from "@/components/ui/button";
import { PAGE_TITLES } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { useOnline } from "@/lib/hooks/use-online";
import { usePayees } from "@/lib/hooks/use-payees";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { SEARCH_DEBOUNCE_MS } from "@/lib/query/constants";
import type { PayeeFilter, PayeeTarget } from "@/lib/types";

export default function PayeeList() {
    const { can } = useWorkspace();
    const allowed = can("managePayees");
    const online = useOnline();
    const { search, setSearch, debouncedSearch } = useDebouncedSearch(
        "",
        SEARCH_DEBOUNCE_MS,
    );
    const term = debouncedSearch.trim();
    const [filter, setFilter] = useState<PayeeFilter>("all");
    const payees = usePayees(term, filter, allowed);
    const panelId = useId();
    const outcomeRef = useRef<HTMLParagraphElement>(null);
    const [target, setTarget] = useState<PayeeTarget | null>(null);
    const [outcome, setOutcome] = useState("");
    const denied = !allowed || payees.error?.kind === "forbidden";
    const summary = payees.data?.pages[0]?.summary;
    const add = () => setTarget({ kind: "add" });

    const finish = (message: string, refocus = false) => {
        setTarget(null);
        setOutcome(message);
        if (refocus) requestAnimationFrame(() => outcomeRef.current?.focus());
    };

    return (
        <>
            <PageHeader
                eyebrow={PAYEE_COPY.eyebrow}
                title={PAGE_TITLES.payments}
                actions={
                    denied ? null : (
                        <Button
                            size="lg"
                            aria-disabled={!online}
                            onClick={() => online && add()}
                        >
                            <Add aria-hidden className="size-4 shrink-0" />
                            {PAYEE_COPY.add}
                        </Button>
                    )
                }
            />
            {denied ? (
                <NotPermitted page={PAGE_TITLES.payments} />
            ) : (
                <>
                    <PayeeSummary summary={summary} />
                    <section
                        aria-label={PAYEE_COPY.section}
                        className="surface-card flex min-w-0 flex-col"
                    >
                        <PayeeToolbar
                            panelId={panelId}
                            summary={summary}
                            filter={filter}
                            search={search}
                            onFilter={setFilter}
                            onSearch={setSearch}
                        />
                        <PayeeNotices
                            online={online}
                            outcome={outcome}
                            outcomeRef={outcomeRef}
                        />
                        <div id={panelId} role="tabpanel">
                            <PayeeResults
                                payees={payees}
                                term={term}
                                filtered={filter !== "all"}
                                online={online}
                                onAdd={add}
                                onClear={() => {
                                    setSearch("");
                                    setFilter("all");
                                }}
                                onRename={(payee) =>
                                    setTarget({ kind: "rename", payee })
                                }
                                onRemove={(payee) =>
                                    setTarget({ kind: "remove", payee })
                                }
                            />
                        </div>
                    </section>
                    <PayeeDialogs
                        target={target}
                        current={payees.data?.pages
                            .flatMap((page) => page.items)
                            .find(
                                (payee) =>
                                    target?.kind === "rename" &&
                                    payee.id === target.payee.id,
                            )}
                        onClose={() => setTarget(null)}
                        onDone={finish}
                    />
                </>
            )}
        </>
    );
}
