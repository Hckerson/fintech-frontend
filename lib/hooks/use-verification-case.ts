import { useQuery } from "@tanstack/react-query";
import { getVerificationCase } from "@/lib/actions/get-verification-case";
import { queryKeys } from "@/lib/hooks/query-keys";
import { readOptions } from "@/lib/hooks/read-options";
import { useWorkspace } from "@/lib/hooks/use-workspace";
import { unwrapResult } from "@/lib/utils/query-error";

export const useVerificationCase = ({
    enabled = true,
}: { enabled?: boolean } = {}) => {
    const { workspace } = useWorkspace();

    return useQuery({
        queryKey: queryKeys.verificationCase(workspace.id),
        queryFn: async () => unwrapResult(await getVerificationCase()),
        enabled,
        ...readOptions("live"),
    });
};
