import { useQuery } from "@tanstack/react-query";
import { getAdminNotificationCount } from "@/lib/actions/get-admin-notification-count";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { unwrapResult } from "@/lib/utils/query-error";
import { NOTIFICATION_POLL_INTERVAL_MS } from "@/lib/workspace/constants";

export const useAdminNotificationCount = () =>
    useQuery({
        queryKey: queryKeys.admin.notificationCount(),
        queryFn: async () => unwrapResult(await getAdminNotificationCount()),
        ...readOptions("live"),
        refetchInterval: NOTIFICATION_POLL_INTERVAL_MS,
        refetchIntervalInBackground: false,
    });
