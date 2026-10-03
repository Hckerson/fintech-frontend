"use client";
import { Search } from "@carbon/icons-react";
import Button from "@/components/ui/button";
import Select from "@/components/ui/select";
import TextInput from "@/components/ui/text-input";
import { ADMIN_USER_QUERY_MAX } from "@/lib/admin/constants";
import {
    ADMIN_USERS_COPY,
    USER_ROLE_LABELS,
    USER_STATUS_LABELS,
} from "@/lib/data/admin/users";
import type { AdminUserFilters } from "@/lib/types";
import {
    userRoleSchema,
    userStatusSchema,
} from "@/lib/validations/admin-users";

interface Props {
    search: string;
    filters: AdminUserFilters;
    narrowed: boolean;
    onSearch: (value: string) => void;
    onFilters: (filters: Pick<AdminUserFilters, "role" | "status">) => void;
    onClear: () => void;
}

const COPY = ADMIN_USERS_COPY;

export default function AdminUsersToolbar({
    search,
    filters,
    narrowed,
    onSearch,
    onFilters,
    onClear,
}: Props) {
    return (
        <div className="border-border flex flex-wrap items-center gap-3 border-b px-4 py-3">
            <label className="relative min-w-0 flex-1 basis-64 md:max-w-sm">
                <span className="sr-only">{COPY.search.label}</span>
                <Search
                    aria-hidden
                    className="text-text-muted pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
                />
                <TextInput
                    type="search"
                    value={search}
                    maxLength={ADMIN_USER_QUERY_MAX}
                    placeholder={COPY.search.placeholder}
                    autoComplete="off"
                    onChange={(event) => onSearch(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Escape" && search) {
                            event.preventDefault();
                            onSearch("");
                        }
                    }}
                    className="h-9 pl-9"
                />
            </label>
            <Select
                aria-label={COPY.filters.role}
                value={filters.role ?? ""}
                onChange={(event) =>
                    onFilters({
                        role: userRoleSchema.safeParse(event.target.value).data,
                        status: filters.status,
                    })
                }
                className="h-9"
            >
                <option value="">{COPY.filters.anyRole}</option>
                {userRoleSchema.options.map((role) => (
                    <option key={role} value={role}>
                        {USER_ROLE_LABELS[role].label}
                    </option>
                ))}
            </Select>
            <Select
                aria-label={COPY.filters.status}
                value={filters.status ?? ""}
                onChange={(event) =>
                    onFilters({
                        role: filters.role,
                        status: userStatusSchema.safeParse(event.target.value)
                            .data,
                    })
                }
                className="h-9"
            >
                <option value="">{COPY.filters.anyStatus}</option>
                {userStatusSchema.options.map((status) => (
                    <option key={status} value={status}>
                        {USER_STATUS_LABELS[status].label}
                    </option>
                ))}
            </Select>
            {narrowed ? (
                <Button tone="ghost" size="md" onClick={onClear}>
                    {COPY.filters.clear}
                </Button>
            ) : null}
        </div>
    );
}
