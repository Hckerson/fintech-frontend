"use client";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { Add } from "@carbon/icons-react";
import AdminUserCreateDialog from "@/components/admin/admin-user-create-dialog";
import AdminUsersResults from "@/components/admin/admin-users-results";
import AdminUsersToolbar from "@/components/admin/admin-users-toolbar";
import PageHeader from "@/components/shell/page-header";
import Button from "@/components/ui/button";
import { ADMIN_USER_QUERY_MIN } from "@/lib/admin/constants";
import { PAGE_TITLES } from "@/lib/constants";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";
import { useAdminUsers } from "@/lib/hooks/use-admin-users";
import { useDebouncedSearch } from "@/lib/hooks/use-debounced-search";
import { useOnline } from "@/lib/hooks/use-online";
import { SEARCH_DEBOUNCE_MS } from "@/lib/query/constants";
import type { AdminUser, AdminUserFilters } from "@/lib/types";
import { kindOf } from "@/lib/utils/query-error";
import { queryString } from "@/lib/utils/query-string";

const COPY = ADMIN_USERS_COPY;

export default function AdminUsersTable({
    filters,
}: {
    filters: AdminUserFilters;
}) {
    const pathname = usePathname();
    const online = useOnline();
    const query = useAdminUsers();
    const createRef = useRef<HTMLButtonElement>(null);
    const { search, setSearch, debouncedSearch } = useDebouncedSearch(
        filters.q ?? "",
        SEARCH_DEBOUNCE_MS,
    );
    const [picked, setPicked] = useState({
        role: filters.role,
        status: filters.status,
    });
    const [creating, setCreating] = useState(false);
    const [outcome, setOutcome] = useState("");
    const term = debouncedSearch.trim();
    const active: AdminUserFilters = {
        ...picked,
        q: term.length >= ADMIN_USER_QUERY_MIN ? term : undefined,
    };
    const denied = query.isError && kindOf(query.error) === "forbidden";

    const write = (next: AdminUserFilters) =>
        window.history.replaceState(
            null,
            "",
            `${pathname}${queryString(next)}`,
        );

    const pick = (next: Pick<AdminUserFilters, "role" | "status">) => {
        setPicked({ role: next.role, status: next.status });
        write({ ...active, ...next });
    };

    const clear = () => {
        setSearch("");
        setPicked({ role: undefined, status: undefined });
        write({});
    };

    const created = (user: AdminUser) => {
        setCreating(false);
        setOutcome(COPY.created(user.fullName));
        createRef.current?.focus();
    };

    return (
        <>
            <PageHeader
                title={PAGE_TITLES.adminUsers}
                actions={
                    denied ? null : (
                        <Button
                            ref={createRef}
                            size="lg"
                            aria-disabled={!online}
                            onClick={() => online && setCreating(true)}
                        >
                            <Add aria-hidden className="size-4 shrink-0" />
                            {COPY.create}
                        </Button>
                    )
                }
            />
            <section
                aria-label={COPY.section}
                className="surface-card flex min-w-0 flex-col"
            >
                {denied ? null : (
                    <AdminUsersToolbar
                        search={search}
                        filters={picked}
                        narrowed={Boolean(
                            search || picked.role || picked.status,
                        )}
                        onSearch={(value) => {
                            setSearch(value);
                            const q = value.trim();
                            write({
                                ...picked,
                                q:
                                    q.length >= ADMIN_USER_QUERY_MIN
                                        ? q
                                        : undefined,
                            });
                        }}
                        onFilters={pick}
                        onClear={clear}
                    />
                )}
                <p
                    role="status"
                    className={
                        outcome
                            ? "border-border bg-background-muted text-text-secondary border-b px-4 py-2 text-sm"
                            : "sr-only"
                    }
                >
                    {outcome}
                </p>
                <AdminUsersResults
                    query={query}
                    filters={active}
                    onClear={clear}
                    onCopied={setOutcome}
                />
            </section>
            {creating ? (
                <AdminUserCreateDialog
                    onClose={() => setCreating(false)}
                    onCreated={created}
                />
            ) : null}
        </>
    );
}
