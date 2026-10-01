import { useQuery } from "@tanstack/react-query";
import { getAdminUserTotal } from "@/lib/actions/get-admin-user-total";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import type { StatsPeriod } from "@/lib/types";
import { unwrapResult } from "@/lib/utils/query-error";

export const useAdminUserTotal = (period: StatsPeriod) =>
    useQuery({
        queryKey: queryKeys.admin.userTotal(period),
        queryFn: async () => unwrapResult(await getAdminUserTotal(period)),
        ...readOptions("standard"),
        refetchOnWindowFocus: true,
    });
