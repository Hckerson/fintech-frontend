import type { AdminUser, AdminUserFilters } from "@/lib/types";

export const newestFirst = (users: readonly AdminUser[]): AdminUser[] =>
    [...users].sort(
        (a, b) =>
            b.createdAt.localeCompare(a.createdAt) || a.id.localeCompare(b.id),
    );

export const matchUsers = (
    users: readonly AdminUser[],
    { q, role, status }: AdminUserFilters,
): AdminUser[] => {
    const term = q?.toLocaleLowerCase();

    return users.filter(
        (user) =>
            (!role || user.role === role) &&
            (!status || user.status === status) &&
            (!term ||
                user.fullName.toLocaleLowerCase().includes(term) ||
                user.email.toLocaleLowerCase().includes(term)),
    );
};
