import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminUser as createUser } from "@/lib/actions/create-admin-user";
import type { CreateUserDto } from "@/lib/contract/schemas";
import { queryKeys } from "@/lib/hooks/query-keys";
import type { AdminUserList } from "@/lib/types";
import { ActionError } from "@/lib/utils/action-error";

interface Variables {
    input: CreateUserDto;
    idempotencyKey: string;
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation<
        Awaited<ReturnType<typeof createUser>> & { ok: true },
        ActionError,
        Variables
    >({
        mutationFn: async ({ input, idempotencyKey }) => {
            const result = await createUser(input, idempotencyKey);
            if (!result.ok) throw ActionError.from(result);
            return result;
        },
        onSuccess: ({ data: user }) => {
            queryClient.setQueryData<AdminUserList>(
                queryKeys.admin.users(),
                (list) =>
                    list && {
                        ...list,
                        items: [user, ...list.items],
                        total: list.total + 1,
                    },
            );
            void queryClient.invalidateQueries({
                queryKey: queryKeys.admin.stats(),
            });
        },
    });
};
