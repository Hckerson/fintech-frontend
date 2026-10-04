import { useQuery } from "@tanstack/react-query";
import { readOptions } from "@/lib/hooks/read-options";
import { reads } from "@/lib/hooks/reads";
import { useWorkspace } from "@/lib/hooks/use-workspace";

export const useVerificationCase = ({
    enabled = true,
}: { enabled?: boolean } = {}) => {
    const { workspace } = useWorkspace();

    return useQuery({
        ...reads.verificationCase(workspace.id),
        enabled,
        ...readOptions("live"),
    });
};
