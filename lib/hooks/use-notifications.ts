import { useQuery } from "@tanstack/react-query";
import { getNotificationCount } from "@/lib/actions/get-notification-count";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { unwrapResult } from "@/lib/utils/query-error";
import { NOTIFICATION_POLL_INTERVAL_MS } from "@/lib/workspace/constants";

export const useNotificationCount = () => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.notifications.count(workspace.id),
        queryFn: async () => unwrapResult(await getNotificationCount()),
        ...readOptions("live"),
        refetchInterval: NOTIFICATION_POLL_INTERVAL_MS,
        refetchIntervalInBackground: false,
    });
};
