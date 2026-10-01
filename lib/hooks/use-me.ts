import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/lib/actions/get-me";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { unwrapResult } from "@/lib/utils/query-error";

export const useMe = () =>
    useQuery({
        queryKey: queryKeys.me(),
        queryFn: async () => unwrapResult(await getMe()),
        ...readOptions("slow"),
    });
