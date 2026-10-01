import { useQuery } from "@tanstack/react-query";
import { getAdminUserSeries } from "@/lib/actions/get-admin-user-series";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import type { StatsPeriod } from "@/lib/types";
import { unwrapResult } from "@/lib/utils/query-error";

export const useAdminUserSeries = (period: StatsPeriod) =>
    useQuery({
        queryKey: queryKeys.admin.userSeries(period),
        queryFn: async () => unwrapResult(await getAdminUserSeries(period)),
        ...readOptions("standard"),
        refetchOnWindowFocus: true,
    });
