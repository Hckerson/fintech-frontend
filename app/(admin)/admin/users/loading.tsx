import AdminUsersSkeleton from "@/components/admin/admin-users-skeleton";
import PageHeader from "@/components/shell/page-header";
import { PAGE_TITLES } from "@/lib/constants";

export default function AdminUsersLoading() {
    return (
        <>
            <PageHeader title={PAGE_TITLES.adminUsers} />
            <div className="surface-card">
                <AdminUsersSkeleton />
            </div>
        </>
    );
}
