"use client";
import { useState } from "react";
import AdminUsersRows from "@/components/admin/admin-users-rows";
import AdminUsersSkeleton from "@/components/admin/admin-users-skeleton";
import Button from "@/components/ui/button";
import EmptyState from "@/components/ui/empty-state";
import QueryBoundary from "@/components/wrappers/query-boundary";
import { ADMIN_USERS_PAGE_SIZE } from "@/lib/admin/constants";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import type { useAdminUsers } from "@/lib/hooks/use-admin-users";
import type { AdminUserFilters } from "@/lib/types";
import { formatCount } from "@/lib/utils/admin-stats";
import { matchUsers } from "@/lib/utils/admin-users";

interface Props {
    query: ReturnType<typeof useAdminUsers>;
    filters: AdminUserFilters;
    onClear: () => void;
    onCopied: (message: string) => void;
}

const COPY = ADMIN_USERS_COPY;

export default function AdminUsersResults({
    query,
    filters,
    onClear,
    onCopied,
}: Props) {
    const [pages, setPages] = useState({ key: "", count: 1 });
    const key = JSON.stringify(filters);
    const shown = (pages.key === key ? pages.count : 1) * ADMIN_USERS_PAGE_SIZE;

    return (
        <QueryBoundary
            query={query}
            isEmpty={() => false}
            empty={null}
            skeleton={<AdminUsersSkeleton />}
            denied={
                <div className="p-4">
                    <EmptyState {...EMPTY_STATES.adminUsersNotPermitted} />
                </div>
            }
        >
            {(list) => {
                const matched = matchUsers(list.items, filters);

                return (
                    <>
                        {list.total > list.items.length ? (
                            <p className="border-border text-warning border-b px-4 py-2 text-xs">
                                {COPY.capped(
                                    formatCount(list.items.length),
                                    formatCount(list.total),
                                )}
                            </p>
                        ) : null}
                        {matched.length === 0 ? (
                            <div className="flex flex-col items-start gap-3 p-4">
                                <EmptyState
                                    title={
                                        EMPTY_STATES.adminUsersFiltered.title
                                    }
                                    body={EMPTY_STATES.adminUsersFiltered.body}
                                />
                                <Button
                                    tone="quiet"
                                    size="md"
                                    onClick={onClear}
                                >
                                    {EMPTY_STATES.adminUsersFiltered.action}
                                </Button>
                            </div>
                        ) : (
                            <AdminUsersRows
                                users={matched.slice(0, shown)}
                                matched={matched.length}
                                asOf={list.asOf}
                                busy={query.isFetching}
                                onLoadMore={() =>
                                    setPages({
                                        key,
                                        count:
                                            shown / ADMIN_USERS_PAGE_SIZE + 1,
                                    })
                                }
                                onCopied={onCopied}
                            />
                        )}
                        <p role="status" className="sr-only">
                            {COPY.matched(
                                formatCount(matched.length),
                                formatCount(list.items.length),
                            )}
                        </p>
                    </>
                );
            }}
        </QueryBoundary>
    );
}
