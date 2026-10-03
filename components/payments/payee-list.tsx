"use client";
import { useId, useState } from "react";
import { toast } from "sonner";
import NotPermitted from "@/components/common/not-permitted";
import PayeeDialogs from "@/components/payments/payee-dialogs";
import PayeeHeader from "@/components/payments/payee-header";
import PayeeNotices from "@/components/payments/payee-notices";
import PayeePane from "@/components/payments/payee-pane";
import PayeeResults from "@/components/payments/payee-results";
import PayeeSheet from "@/components/payments/payee-sheet";
import PayeeSummary from "@/components/payments/payee-summary";
import PayeeToolbar from "@/components/payments/payee-toolbar";
import Toaster from "@/components/ui/toaster";
import { PAGE_TITLES } from "@/lib/constants";
import { PAYEE_COPY } from "@/lib/data/payments/copy";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { useOnline } from "@/lib/hooks/use-online";
import { usePayees } from "@/lib/hooks/use-payees";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { PAYEE_PANE_QUERY } from "@/lib/payments/constants";
import { SEARCH_DEBOUNCE_MS } from "@/lib/query/constants";
import type { PayeeFilter, PayeeSort, PayeeTarget } from "@/lib/types";

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
    const [sort, setSort] = useState<PayeeSort>("name_asc");
    const payees = usePayees(term, filter, sort, allowed);
    const panelId = useId();
    const [target, setTarget] = useState<PayeeTarget | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const denied = !allowed || payees.error?.kind === "forbidden";
    const items = payees.data?.pages.flatMap((page) => page.items) ?? [];
    const summary = payees.data?.pages[0]?.summary;
    const selected =
        items.find((payee) => payee.id === selectedId) ?? items.at(0);
    const add = () => setTarget({ kind: "add" });
    const act = (next: PayeeTarget) => {
        setSheetOpen(false);
        setTarget(next);
    };

    return (
        <>
            <PayeeHeader canAdd={!denied} online={online} onAdd={add} />
            {denied ? (
                <NotPermitted page={PAGE_TITLES.payments} />
            ) : (
                <>
                    <PayeeSummary summary={summary} />
                    <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
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
                            <PayeeNotices online={online} />
                            <div id={panelId} role="tabpanel">
                                <PayeeResults
                                    payees={payees}
                                    term={term}
                                    filtered={filter !== "all"}
                                    online={online}
                                    sort={sort}
                                    onSort={setSort}
                                    onAdd={add}
                                    onClear={() => {
                                        setSearch("");
                                        setFilter("all");
                                    }}
                                    selectedId={selected?.id}
                                    onOpen={(payee) => {
                                        setSelectedId(payee.id);
                                        setSheetOpen(
                                            !window.matchMedia(PAYEE_PANE_QUERY)
                                                .matches,
                                        );
                                    }}
                                    onRename={(payee) =>
                                        act({ kind: "rename", payee })
                                    }
                                    onRemove={(payee) =>
                                        act({ kind: "remove", payee })
                                    }
                                />
                            </div>
                        </section>
                        <PayeePane
                            payee={selected}
                            online={online}
                            onRename={(payee) => act({ kind: "rename", payee })}
                            onRemove={(payee) => act({ kind: "remove", payee })}
                        />
                    </div>
                    {sheetOpen && selected ? (
                        <PayeeSheet
                            payee={selected}
                            online={online}
                            onClose={() => setSheetOpen(false)}
                            onRename={(payee) => act({ kind: "rename", payee })}
                            onRemove={(payee) => act({ kind: "remove", payee })}
                        />
                    ) : null}
                    <PayeeDialogs
                        target={target}
                        current={items.find(
                            (payee) =>
                                target?.kind === "rename" &&
                                payee.id === target.payee.id,
                        )}
                        onClose={() => setTarget(null)}
                        onDone={(message) => {
                            setTarget(null);
                            toast.success(message);
                        }}
                    />
                    <Toaster />
                </>
            )}
        </>
    );
}
