import type { Metadata } from "next";
import AdminRoleGate from "@/components/admin/admin-role-gate";
import AdminUsersSkeleton from "@/components/admin/admin-users-skeleton";
import AdminUsersTable from "@/components/admin/admin-users-table";
import SectionErrorBoundary from "@/components/wrappers/section-error-boundary";
import { PAGE_TITLES } from "@/lib/constants";
import { ADMIN_USERS_COPY } from "@/lib/data/admin/users";
import { EMPTY_STATES } from "@/lib/data/empty-states";
import { adminUsersSearchParamsSchema } from "@/lib/validations/admin-users";

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export const metadata: Metadata = { title: ADMIN_USERS_COPY.metaTitle };

export default async function AdminUsersPage({ searchParams }: Props) {
    const filters = adminUsersSearchParamsSchema.parse(await searchParams);

    return (
        <AdminRoleGate
            allow="admin"
            title={PAGE_TITLES.adminUsers}
            denied={EMPTY_STATES.adminUsersNotPermitted}
        >
            <SectionErrorBoundary skeleton={<AdminUsersSkeleton />}>
                <AdminUsersTable filters={filters} />
            </SectionErrorBoundary>
        </AdminRoleGate>
    );
}
