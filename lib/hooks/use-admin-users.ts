import { useQuery } from "@tanstack/react-query";
import { listAdminUsers } from "@/lib/actions/list-admin-users";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { unwrapResult } from "@/lib/utils/query-error";

export const useAdminUsers = () =>
    useQuery({
        queryKey: queryKeys.admin.users(),
        queryFn: async () => unwrapResult(await listAdminUsers()),
        ...readOptions("standard"),
        refetchOnWindowFocus: true,
    });
